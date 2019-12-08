import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DestinyPvPStats, DestinyPvEStats } from '@models/destiny';

@Component({
  selector: 'app-destiny-stats',
  templateUrl: './destiny-stats.component.html',
  styleUrls: ['./destiny-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyStatsComponent {

  @Input() pvpStats: DestinyPvPStats;
  @Input() pveStats: DestinyPvEStats;

  private _failure: boolean;
  get failure(): boolean {
    return this._failure;
  }
  @Input() set failure(state: boolean) {
    this._failure = state;
    this.cd.markForCheck();
  }

  constructor(private cd: ChangeDetectorRef) { }

  public loadStats(pvpStats: DestinyPvPStats, pveStats: DestinyPvEStats): void {
    try {
      this.pvpStats = pvpStats;
      this.pveStats = pveStats;
      this.cd.markForCheck();
    } catch (err) {
      this.failure = true;
    }
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

}
