import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Destroyer } from '@models';
import { BungieService, SEOService } from '@service';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-destiny-clan',
  templateUrl: './destiny-clan.component.html',
  styleUrls: ['./destiny-clan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyClanComponent extends Destroyer implements OnInit {

  public clanData = new BehaviorSubject<any>(null);

  constructor(
    private bungie: BungieService,
    private activatedRoute: ActivatedRoute,
    private seo: SEOService
  ) {
    super();
  }

  ngOnInit() {
    const snapshot = this.activatedRoute.snapshot;
    if (snapshot && snapshot.params && snapshot.params.clanId) {
      const id = snapshot.params.clanId;
      this.bungie.setClanId(snapshot.params.clanId);
      this.bungie.clan.pipe(
        takeUntil(this.destroy$)
      ).subscribe(
        clan => {
          if (clan) {
            this.clanData.next(clan);
            this.seo.updateTitle(clan.name);
          }
        }
      )
    }
  }

}
