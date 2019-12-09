import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, zip, of, BehaviorSubject, Subscription } from 'rxjs';
import { map, switchMap, shareReplay, takeUntil } from 'rxjs/operators';
import { BungieProfile, DestinyCharacter, DestinyPlayerLookup, DestinyProfile, DestinyPvEStats, DestinyPvPStats, RosterItem } from '../models/destiny';
import { environment } from '../../environments/environment';
import { Destroyer } from '@models';

@Injectable({
  providedIn: 'root'
})
export class BungieService extends Destroyer {

  private readonly rootUrl = 'https://www.bungie.net/platform';

  private httpOptions = {
    headers: new HttpHeaders().set('X-API-KEY', environment.bungieKey)
  };

  private _roster: Observable<RosterItem[]>;

  private _leaderboards: Observable<{}>;

  private _clanId: number;

  private _rosterSubscription: Subscription;

  public roster = new BehaviorSubject<RosterItem[]>([]);

  constructor(private http: HttpClient) {
    super();
  }

  get clanId(): number {
    return this._clanId;
  }

  set clanId(id: number) {
    console.log('NEW CLAN ID:::', id);
    this._clanId = id;
    if (this._rosterSubscription) {
      this._rosterSubscription.unsubscribe();
    }
    this._rosterSubscription = this.getRoster(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      roster => {
        console.log('UPDATED ROSTER:::', roster)
        this.roster.next(roster);
      },
      err => console.error('Bungie service failed to update roster subject', err)
    );
  }

  public setClanId(id: number) {
    this.clanId = id;
  }

  public getClan(id?: number): Observable<any> {
    const url = `${this.rootUrl}/groupv2/${id || this.clanId}/`;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(response => {
        if (response && response.Response) {
          return response.Response;
        }
      })
    );
  }

  public getRoster(id?: number): Observable<RosterItem[]> {
    const url = `${this.rootUrl}/groupv2/${id || this.clanId}/members/`;
    if (!this._roster) {
      this._roster = this.http.get(url, this.httpOptions).pipe(
        map((response: any) => {
          const roster: RosterItem[] = [];
          const data: any[] = response.Response.results;
          if (data) {
            data.forEach(player => {
              if (player.destinyUserInfo && player.bungieNetUserInfo) {
                roster.push({
                  name: player.destinyUserInfo.displayName,
                  icon: player.bungieNetUserInfo.iconPath,
                  status: player.isOnline ? 'Online' : 'Offline',
                  bungieId: player.bungieNetUserInfo.membershipId,
                  destinyId: player.destinyUserInfo.membershipId,
                  platform: player.destinyUserInfo.crossSaveOverride || player.destinyUserInfo.LastSeenDisplayNameType
                });
              }
            });
            roster.sort((a, b) => {
              if (a.status > b.status) {
                return -1;
              } else if (a.status < b.status) {
                return 1;
              } else {
                return 0;
              }
            });
          }
          return roster;
        }),
        shareReplay(1)
      );
    }
    return this._roster;
  }

  public generateDestinyProfileById(destinyId: string, bungieId: string, platform: number): Observable<DestinyProfile> {
    return forkJoin(
      this.getDestinyProfileById(destinyId, platform),
      this.getBungieProfileById(bungieId),
      this.getHoursPlayed(destinyId, platform),
      this.getOverallStats(destinyId, platform),
      this.getCharacters(destinyId, platform)
    ).pipe(map((responses) => {
      const metadata = responses[0];
      const bungieProfile = responses[1];
      const hoursPlayed = responses[2];
      const overallStats = responses[3];
      const characters = responses[4];
      return new DestinyProfile(destinyId, metadata['name'], metadata['lastPlayed'], hoursPlayed, bungieProfile, characters, overallStats.pvp, overallStats.pve);
    }));
  }

  public generatePlayerLookup(bnet: string, platform: number): Observable<DestinyPlayerLookup> {
    const playerLookup = new DestinyPlayerLookup();
    playerLookup.battleNet = bnet;
    playerLookup.platform = platform;
    const lookup = this.getPlayerByName(bnet, platform).pipe(
      switchMap(player => {
        if (player) {
          playerLookup.destinyId = player.id;
          return this.getHoursPlayed(playerLookup.destinyId, player.platform).pipe(
            switchMap(hours => {
              playerLookup.hoursPlayed = hours;
              return this.getOverallStats(playerLookup.destinyId, player.platform).pipe(
                switchMap(stats => {
                  playerLookup.pvpStats = stats.pvp;
                  playerLookup.pveStats = stats.pve;
                  return this.getCharacters(playerLookup.destinyId, player.platform).pipe(
                    map(characters => {
                      playerLookup.characters = characters;
                      return playerLookup;
                    })
                  );
                })
              );
            })
          );
        } else {
          return of(null);
        }
      })
    );
    return lookup;
  }


  public getDestinyProfileById(destinyId: string, platform: number): Observable<{ name, lastPlayed, characterIds }> {
    const url = `${this.rootUrl}/destiny2/${platform}/profile/${destinyId}/?components=100`;
    return this.http.get(url, this.httpOptions).pipe(
      map((response: any) => {
        if (response.ErrorCode === 1) {
          // shorten reference to server response
          const data = response.Response.profile.data;
          // begin storing profile values
          const name = data.userInfo.displayName;
          const lastPlayed = data.dateLastPlayed;
          const characterIds = data.characterIds;
          return {
            name: name,
            lastPlayed: lastPlayed,
            characterIds: characterIds
          }
        } else {
          return {
            name: 'Failed to load profile metadata',
            lastPlayed: 'Failed to load profile metadata',
            characterIds: ['Failed to load character data']
          }
        }
      })
    );
  }

  public getBungieProfileById(bungieId: string): Observable<BungieProfile> {
    const url = `https://www.bungie.net/platform/user/getBungieNetUserById/${bungieId}/`;
    return this.http.get(url, this.httpOptions).pipe(
      map((response: any) => {
        if (response.ErrorCode === 1) {
          return {
            bungieId: response.Response.bungieId,
            icon: response.Response.profilePicturePath,
            theme: response.Response.profileThemeName,
            bio: response.Response.about
          }
        }
      })
    );
  }

  public getPlayerByName(name: string, platform: number): Observable<{ name: string, id: string, platform: number }> {
    name = encodeURIComponent(name);
    const url = `https://www.bungie.net/platform/destiny2/searchdestinyplayer/${platform}/${name}/`;
    return this.http.get(url, this.httpOptions).pipe(
      map((response: any) => {
        if (response && response.ErrorCode === 1 && response.Response.length) {
          return {
            name: response.Response[0].displayName,
            id: response.Response[0].membershipId,
            platform: response.Response[0].membershipType
          };
        } else {
          return null;
        }
      })
    );
  }

  public getCharacters(destinyId: string, platform: number): Observable<DestinyCharacter[]> {
    const url = `${this.rootUrl}/destiny2/${platform}/profile/${destinyId}/?components=200`;
    return this.http.get(url, this.httpOptions).pipe(map((response: any) => {
      const data = response.Response.characters.data;
      const characterIds = Object.keys(data);
      const characters: DestinyCharacter[] = [];
      characterIds.forEach((id: any) => {
        const character: any = data[id];
        characters.push(new DestinyCharacter(
          null,
          character.characterId,
          this.destinyClassToString(character.classType),
          {
            mobility: this.getCharacterStat(character, 'mobility'),
            resilience: this.getCharacterStat(character, 'resilience'),
            recovery: this.getCharacterStat(character, 'recovery')
          },
          '',
          character.dateLastPlayed
        ));
      });
      return characters;
    }));
  }

  public getHoursPlayed(destinyId: string, platform: number): Observable<string> {
    const url = `https://www.bungie.net/platform/destiny2/${platform}/account/${destinyId}/stats/`;
    return this.http.get(url, this.httpOptions).pipe(map((response: any) => {
      if (response.ErrorCode === 1) {
        return `${Math.round(response.Response.mergedAllCharacters.merged.allTime.secondsPlayed.basic.value / 3600)}h`;
      } else {
        return `Error`;
      }
    }));
  }

  public getOverallStats(destinyId: string, platform: number): Observable<{ pvp: DestinyPvPStats, pve: DestinyPvEStats }> {
    const url = `${this.rootUrl}/destiny2/${platform}/account/${destinyId}/character/0/stats/`;
    return this.http.get(url, this.httpOptions).pipe(
      map((data: any) => this.parseBungieStats(data))
    );
  }

  public getStatsForCharacter(destinyId: string, characterId: string, platform: number): Observable<{ pvp: DestinyPvPStats, pve: DestinyPvEStats }> {
    const url = `${this.rootUrl}/destiny2/${platform}/account/${destinyId}/character/${characterId}/stats/`;
    return this.http.get(url, this.httpOptions).pipe(
      map((data: any) => this.parseBungieStats(data))
    );
  }

  public getLeaderboards(roster: RosterItem[]): Observable<{}> {
    if (!this._leaderboards) {
      this._leaderboards = (() => {
        const playerStats = [];
        roster.forEach(player => playerStats.push(
          this.getOverallStats(player.destinyId, player.platform).pipe(
            map((stats: any) => {
              return {
                player: player,
                pvp: stats.pvp,
                pve: stats.pve
              }
            })
          )
        ));
        return zip(...playerStats).pipe(shareReplay(1));
      })();
    }
    return this._leaderboards;
  }

  public parseSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    let hoursPlayed = '';
    if (typeof hours === 'number' && hours > 0 && hours != Infinity) {
      hoursPlayed += (`${hours}h`);
    }
    if (typeof minutes === 'number' && minutes > 0 && minutes != Infinity) {
      hoursPlayed += (` ${minutes}m`);
    }
    return hoursPlayed;
  }

  private parseBungieStats(input: any): { pvp: DestinyPvPStats, pve: DestinyPvEStats } {
    const pvp = input.Response.allPvP.allTime;
    const raid = input.Response.raid.allTime;
    const strikes = input.Response.allStrikes.allTime;
    let destinyPvpStats: DestinyPvPStats = new DestinyPvPStats();
    let destinyPveStats: DestinyPvEStats = new DestinyPvEStats();
    if (pvp) {
      destinyPvpStats.kd = pvp.killsDeathsRatio.basic.value;
      destinyPvpStats.kda = pvp.killsDeathsAssists.basic.value;
      destinyPvpStats.efficiency = pvp.efficiency.basic.value;
      destinyPvpStats.kills = pvp.kills.basic.value;
      destinyPvpStats.assists = pvp.assists.basic.value;
      destinyPvpStats.defeats = destinyPvpStats.kills + destinyPvpStats.assists;
      destinyPvpStats.singleGameKills = pvp.bestSingleGameKills.basic.value;
      destinyPvpStats.killSpree = pvp.longestKillSpree.basic.value;
      destinyPvpStats.mostPrecisionKills = pvp.mostPrecisionKills.basic.value;
      destinyPvpStats.bestWeapon = pvp.weaponBestType.basic.displayValue;
    }
    if (raid) {
      destinyPveStats.raidClears = raid.activitiesCleared.basic.value;
      destinyPveStats.raidKills = raid.kills.basic.value;
      destinyPveStats.killsPerRaid = raid.kills.pga.value;
      destinyPveStats.bestRaidKills = raid.bestSingleGameKills.basic.value;
      destinyPveStats.deathsPerRaid = Math.round(raid.deaths.basic.value / raid.activitiesCleared.basic.value);
      destinyPveStats.raidTimePerClear = Math.round(raid.secondsPlayed.basic.value / raid.activitiesCleared.basic.value);
    }
    if (strikes) {
      destinyPveStats.killsPerStrike = strikes.kills.pga.value;
      destinyPveStats.strikeClears = strikes.activitiesCleared.basic.value;
      destinyPveStats.strikeKills = strikes.kills.basic.value;
      destinyPveStats.bestStrikeKills = strikes.bestSingleGameKills.basic.value;
    }
    return {
      pvp: destinyPvpStats,
      pve: destinyPveStats
    }
  }

  private destinyClassToString(type: number): string {
    switch (type) {
      case 0: return 'Titan';
      case 1: return 'Hunter';
      case 2: return 'Warlock';
      default: return 'Unknown';
    }
  }

  private destinyGenderToString(type: number): string {
    switch (type) {
      case 0: return 'Male';
      case 1: return 'Female';
      case 2: return 'Unknown';
    }
  }

  private getCharacterStat(character: any, stat: string): string {
    switch (stat.toLowerCase()) {
      case 'mobility': return character.stats[2996146975];
      case 'resilience': return character.stats[392767087];
      case 'recovery': return character.stats[1943323491];
    }
  }

}
