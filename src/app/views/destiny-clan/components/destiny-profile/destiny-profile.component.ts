import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { DestinyStatsComponent } from '../destiny-stats/destiny-stats.component';
import { RosterItem, DestinyProfile, DestinyPvPStats, DestinyPvEStats, DestinyCharacter } from '@models/destiny';
import { BungieService } from '@service/bungie.service';

@Component({
  selector: 'app-destiny-profile',
  templateUrl: './destiny-profile.component.html',
  styleUrls: ['./destiny-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyProfileComponent {

  @Input() showBanner = true;

  private _player: RosterItem;
  public get player(): RosterItem {
    return this._player;
  }

  @Input() public set player(player: RosterItem) {
    if (player && this._player !== player) {
      this._player = player;
      this.loadProfile(player.destinyId, player.bungieId, player.platform);
    }
  }

  private _profileTheme: string;
  public get profileTheme(): string {
    return `https://www.bungie.net/img/UserThemes/${this._profileTheme}/header.jpg`;
  }

  public destinyProfile: DestinyProfile;
  public pvpStats: DestinyPvPStats;
  public pveStats: DestinyPvEStats;

  private characterStats: { characterId: string, pvp: DestinyPvPStats, pve: DestinyPvEStats }[] = [];

  public selectedCharacterClass: string;

  @ViewChild(DestinyStatsComponent, { static: false }) statDisplay: DestinyStatsComponent;

  constructor(
    private cd: ChangeDetectorRef,
    public bungie: BungieService
  ) { }

  public loadProfile(destinyId: string, bungieId: string, platform: number): void {
    this.clearProfile();
    this.bungie.generateDestinyProfileById(destinyId, bungieId, platform).pipe(take(1)).subscribe((profile: DestinyProfile) => {
      this.destinyProfile = profile;
      this.pvpStats = profile.pvpStats;
      this.pveStats = profile.pveStats;
      this._profileTheme = profile.bungieProfile.theme;
      this.cd.markForCheck();
    });
  }

  public clearProfile(): void {
    this.destinyProfile = undefined;
    this.cd.markForCheck();
  }

  public loadCharacter(character?: DestinyCharacter): void {
    if (character) {
      this.selectedCharacterClass = character.characterClass;
      if (this.characterStats.findIndex(stored => stored.characterId === character.characterId) < 0) {
        this.bungie.getStatsForCharacter(this.destinyProfile.destinyId, character.characterId, this.player.platform).pipe(take(1)).subscribe(response => {
          this.characterStats.push({
            characterId: character.characterId,
            pvp: response.pvp,
            pve: response.pve
          });
          this.pvpStats = response.pvp;
          this.pveStats = response.pve;
          this.cd.markForCheck();
        });
      } else {
        const selectedCharacterStats = this.characterStats[this.characterStats.findIndex(char => char.characterId === character.characterId)];
        this.pvpStats = selectedCharacterStats.pvp;
        this.pveStats = selectedCharacterStats.pve;
      }
    } else {
      this.pvpStats = this.destinyProfile.pvpStats;
      this.pveStats = this.destinyProfile.pveStats;
    }
    this.cd.markForCheck();
  }

}
