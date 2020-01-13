import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { map, take, takeUntil, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { BackdropComponent } from '@components/backdrop/backdrop.component';
import { DestinyProfileComponent } from '../destiny-profile/destiny-profile.component';
import { Destroyer, RosterItem } from '@models';
import { BungieService, RoutingService, SEOService } from '@service';

@Component({
  selector: 'app-destiny-roster',
  templateUrl: './destiny-roster.component.html',
  styleUrls: ['./destiny-roster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyRosterComponent extends Destroyer implements AfterViewInit {

  public roster: BehaviorSubject<RosterItem[]>;
  public pageSizeOptions: number[] = [10, 25, 50, 100];
  public pageSize = 10;
  public pageIndex = 0;
  public rosterTableColumnNames: string[] = ['icon', 'name', 'status', 'profile'];
  public dataSource: MatTableDataSource<RosterItem>;
  public selectedDestinyId: string;
  public selectedBungieId: string;
  public selectedPlayer: RosterItem;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(BackdropComponent, { static: false }) backdrop: BackdropComponent;
  @ViewChild(DestinyProfileComponent, { static: false }) profile: DestinyProfileComponent;

  constructor(
    public bungie: BungieService,
    private cd: ChangeDetectorRef,
    private routing: RoutingService,
    private activeRoute: ActivatedRoute,
    private seo: SEOService
  ) {
    super();
    this.roster = new BehaviorSubject<RosterItem[]>([]);
  }

  ngAfterViewInit() {
    this.initRoster();
  }

  private initRoster(): void {
    this.bungie.clan.pipe(
      switchMap(clan => {
        if (!clan) {
          const params = this.activeRoute.snapshot.params
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
          this.seo.updateTitle(`${clanName} Roster`)
          return this.bungie.roster
        }
      }),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(
      roster => {
        if (!roster) {
          console.warn('Received invalid roster from Bungie', roster)
          return
        }
        this.roster.next(roster)
        this.dataSource = new MatTableDataSource(this.roster.value)
        this.paginator.pageSize = 10
        this.paginator.length = roster.length
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.loadPlayerByUrl()
        this.cd.markForCheck()
      },
      err => {
        console.error('Failed to get clan from bungie service', err)
        alert('Failed to load clan roster. See browser console for more info or reload to try again.')
      }
    )
  }

  public searchRoster(filter: string): void {
    this.dataSource.filter = filter.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  public viewPlayer(player: RosterItem): void {
    this.selectedPlayer = player
    this.backdrop.open()
    this.routing.router.navigate(['player', player.destinyId, player.bungieId], {
      relativeTo: this.activeRoute,
      replaceUrl: true
    })
    this.routing
    this.seo.updateTitle(`${player.name} on Destiny 2`)
    this.seo.updateDescription(`Player stats for ${player.name} on Destiny 2`)
    this.cd.markForCheck()
  }

  public updateRoute(event: boolean): void {
    if (!event) {
      this.routing.router.navigate(['clan', this.bungie.clanId || ''], {
        relativeTo: this.activeRoute.root,
        replaceUrl: true
      })
      const clan = this.bungie.clan.value
      if (clan) {
        this.seo.updateTitle(`${clan.name} Roster`)
        this.seo.updateDescription()
      }
    }
  }

  private loadPlayerByUrl(): void {
    const route = this.activeRoute.firstChild;
    if (
      route &&
      route.snapshot &&
      route.snapshot.params &&
      route.snapshot.params.destinyId &&
      route.snapshot.params.bungieId
    ) {
      this.roster.pipe(
        map(players => {
          for (const player of players) {
            if (player.destinyId === route.snapshot.params.destinyId) {
              return player;
            }
          }
        }),
        take(1)
      ).subscribe(player => {
        this.viewPlayer(player)
      })
    }
  }

}
