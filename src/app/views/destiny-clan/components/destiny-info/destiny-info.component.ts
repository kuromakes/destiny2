import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Destroyer } from '@models';
import { BungieService, SEOService } from '@service';
import { takeUntil, take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-destiny-info',
  templateUrl: './destiny-info.component.html',
  styleUrls: ['./destiny-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyInfoComponent extends Destroyer implements OnInit {

  private allStats: any[];

  constructor(public bungie: BungieService, private cd: ChangeDetectorRef, private seo: SEOService) {
    super();
  }

  ngOnInit() {
    const clan = this.bungie.clan.value;
    if (clan) {
      this.seo.updateTitle(`${clan.name} Info`);
    }
    this.bungie.getRoster().pipe(
      switchMap(roster => this.bungie.getLeaderboards(roster)),
      take(1)
    ).subscribe(
      (leaderboards: any[]) => {
        this.allStats = leaderboards;
        this.cd.markForCheck();
      }
    )
  }

  // returns average of all clan members for a given stat
  // optional argument `compress` allows for large numbers without hitting infinity
  getAverageStat(category: string, stat: string, compress?: boolean): number {
    let average: number;
    let total = 0;
    let size = 0;
    if (this.allStats) {
      this.allStats.forEach(player => {
        const stats = player[category];
        if (stats) {
          let targetStat = stats[stat];
          if (targetStat && !isNaN(+targetStat) && targetStat !== Infinity) {
            if (compress) {
              targetStat = +targetStat / 1000;
            }
            total += +targetStat;
            size++;
          } else {
            console.error('Stat not found:', stat);
          }
        }
      });
      average = total / size;
      if (compress) {
        average = average * 1000;
      }
    }
    return average;
  }

  // returns value for the most occurrent stat value
  getModeStat(category: string, stat: string): string {
    const counter = {};
    let result: string;
    if (this.allStats) {
      this.allStats.forEach(player => {
        const stats = player[category];
        if (stats) {
          const entry = stats[stat];
          if (counter[entry]) {
            counter[entry]++;
          } else {
            counter[entry] = 1;
          }
        }
      });
      let highest = 0;
      Object.keys(counter).forEach(entry => {
        if (counter[entry] > highest) {
          result = counter[entry];
        }
      })
    }
    return result;
  }

}