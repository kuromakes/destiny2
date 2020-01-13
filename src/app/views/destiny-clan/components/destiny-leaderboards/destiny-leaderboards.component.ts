import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { take, switchMap, takeUntil, filter, distinctUntilChanged } from 'rxjs/operators';
import { BackdropComponent } from '@components/backdrop/backdrop.component';
import { RosterItem, LeaderboardItem } from '@models/destiny';
import { BungieService } from '@service/bungie.service';
import { SEOService } from '@service';
import { Destroyer } from '@models';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-destiny-leaderboards',
  templateUrl: './destiny-leaderboards.component.html',
  styleUrls: ['./destiny-leaderboards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyLeaderboardsComponent extends Destroyer implements OnInit {

  @Input() roster: RosterItem[];

  // pvp leaderboards
  public kdLeaderboard: LeaderboardItem[];

  public kdaLeaderboard: LeaderboardItem[];

  public efficiencyLeaderboard: LeaderboardItem[];

  public killsLeaderboard: LeaderboardItem[];

  public assistsLeaderboard: LeaderboardItem[];

  public defeatsLeaderboard: LeaderboardItem[];

  // pve leaderboards
  public raidClearsLeaderboard: LeaderboardItem[];

  public raidTimePerClearLeaderboard: LeaderboardItem[];

  public raidKillsLeaderboard: LeaderboardItem[];

  public deathsPerRaidLeaderboard: LeaderboardItem[];

  public strikeClearsLeaderboard: LeaderboardItem[];

  public strikeKillsLeaderboard: LeaderboardItem[];

  public dataSource: MatTableDataSource<RosterItem>;

  public activity = 'crucible';

  public failure = false;

  @ViewChild(BackdropComponent, { static: false }) backdrop: BackdropComponent;

  constructor(
    public bungie: BungieService,
    private cd: ChangeDetectorRef,
    private seo: SEOService,
    private activeRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.bungie.clan.pipe(
      switchMap(clan => {
        if (!clan) {
          const params = this.activeRoute.snapshot.params;
          if (params && params.clanId) {
            const clanId = params.clanId
            this.bungie.setClanId(clanId)
            return of(null)
          } else {
            const parentRoute = this.activeRoute.parent.snapshot;
            if (parentRoute && parentRoute.params && parentRoute.params.clanId) {
              const clanId = parentRoute.params.clanId
              this.bungie.setClanId(clanId)
              return of(null)
            }
          }
          // couldn't find id, so throw error
          const err = new TypeError('Could not find clan ID')
          return throwError(err)
        } else {
          const clanName = clan.name || clan.detail ? clan.detail.name : 'Clan'
          this.seo.updateTitle(`${clanName} Leaderboards`)
          return this.bungie.roster.pipe(
            switchMap(roster => this.bungie.getLeaderboards(roster))
          )
        }
      }),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(
      (leaderboards: RosterItem[]) => {
        if (!leaderboards) {
          console.warn('No response for clan leaderboards')
          return;
        }
        // pvp
        this.kdLeaderboard = this.getKdLeaderboard(leaderboards);
        this.kdaLeaderboard = this.getKdaLeaderboard(leaderboards);
        this.efficiencyLeaderboard = this.getEfficiencyLeaderboard(leaderboards);
        this.killsLeaderboard = this.getKillsLeaderboard(leaderboards);
        this.assistsLeaderboard = this.getAssistsLeaderboard(leaderboards);
        this.defeatsLeaderboard = this.getDefeatsLeaderboard(leaderboards);
        // pve
        this.raidClearsLeaderboard = this.getRaidClearsLeaderboard(leaderboards);
        this.raidTimePerClearLeaderboard = this.getRaidRaidTimePerClearLeaderboard(leaderboards);
        this.raidKillsLeaderboard = this.getRaidKillsLeaderboard(leaderboards);
        this.deathsPerRaidLeaderboard = this.getDeathsPerRaidLeaderboard(leaderboards);
        this.strikeClearsLeaderboard = this.getStrikeClearsLeaderboard(leaderboards);
        this.strikeKillsLeaderboard = this.getStrikeKillsLeaderboard(leaderboards);
        this.cd.markForCheck();
      },
      err => {
        this.failure = true;
        this.cd.markForCheck();
        console.error('Failed to load leaderboards', err);
        alert('Failed to load clan leaderboards. See browser console for more info or reload to try again.')
      }
    );
  }

  // pvp

  private getKdLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[]  = [];
    const sorted = list.sort((a, b) => b.pvp.kd - a.pvp.kd);
    sorted.forEach((player, rank)=> {
      result.push({
        player: player.player,
        value: player.pvp.kd.toFixed(2),
        rank: rank + 1
      });
    });
    return result;
  }

  private getKdaLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[]  = [];
    const sorted = list.sort((a, b) => b.pvp.kda - a.pvp.kda);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: player.pvp.kda.toFixed(2),
        rank: rank + 1
      });
    });
    return result;
  }

  private getEfficiencyLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pvp.efficiency - a.pvp.efficiency);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: player.pvp.efficiency.toFixed(2),
        rank: rank + 1
      });
    });
    return result;
  }

  private getKillsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pvp.kills - a.pvp.kills);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pvp.kills).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  private getAssistsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pvp.assists - a.pvp.assists);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pvp.assists).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  private getDefeatsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pvp.defeats - a.pvp.defeats);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pvp.defeats).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  // pve

  public getRaidClearsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pve.raidClears - a.pve.raidClears);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.raidClears).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  public getRaidRaidTimePerClearLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => a.pve.raidTimePerClear - b.pve.raidTimePerClear);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: this.bungie.parseSeconds(player.pve.raidTimePerClear),
        rank: rank + 1
      });
    });
    return result;
  }

  public getRaidKillsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pve.raidKills - a.pve.raidKills);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.raidKills).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  public getDeathsPerRaidLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => a.pve.deathsPerRaid - b.pve.deathsPerRaid);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.deathsPerRaid).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  public getStrikeClearsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pve.strikeClears - a.pve.strikeClears);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.strikeClears).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  public getStrikeKillsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pve.strikeKills - a.pve.strikeKills);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.strikeKills).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

}
