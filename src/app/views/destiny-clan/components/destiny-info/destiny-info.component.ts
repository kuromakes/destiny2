import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Destroyer } from '@models';
import { BungieService, SEOService } from '@service';
import { switchMap, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { throwError, of } from 'rxjs';

interface CachedStatMap {
  pvp: {
    [key: string]: number;
  }
  pve: {
    [key: string]: number;
  }
}

@Component({
  selector: 'app-destiny-info',
  templateUrl: './destiny-info.component.html',
  styleUrls: ['./destiny-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyInfoComponent extends Destroyer implements OnInit {

  public allStats: any[];

  private cachedStatMap: CachedStatMap = {
    pvp: {},
    pve: {}
  }

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
          this.seo.updateTitle(`${clanName} Info`);
          return this.bungie.roster.pipe(switchMap(
            roster => this.bungie.getLeaderboards(roster))
          )
        }
      }),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(
      (leaderboards: any[]) => {
        if (!leaderboards) {
          console.warn('No respone for clan leaderboard info')
          return
        }
        this.allStats = leaderboards;
        this.cd.markForCheck();
      },
      err => {
        console.error('Unexpected failure retrieving average clan stats', err);
        alert('Failed to load clan average stats. See browser console for more info or reload to try again.')
      }
    );
  }

  // returns average of all clan members for a given stat
  // optional argument `compress` allows for large numbers without hitting infinity
  getAverageStat(category: string, stat: string): number {
    if (this.cachedStatMap[category][stat]) {
      return this.cachedStatMap[category][stat];
    }
    let average: number;
    let total = 0;
    let size = 0;
    if (this.allStats) {
      this.allStats.forEach(player => {
        const stats = player[category];
        if (stats) {
          let targetStat = stats[stat];
          if (targetStat && !isNaN(+targetStat) && targetStat !== Infinity) {
            total += +targetStat;
            size++;
          }
        }
      });
      average = total / size;
    }
    this.cachedStatMap[category][stat] = average;
    return average;
  }

}
