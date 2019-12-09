import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BungieService } from '@service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-destiny-clan',
  templateUrl: './destiny-clan.component.html',
  styleUrls: ['./destiny-clan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyClanComponent implements OnInit {

  public clanData = new BehaviorSubject<any>(null);

  constructor(
    private bungie: BungieService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    const snapshot = this.activatedRoute.snapshot;
    console.log(snapshot);
    if (snapshot && snapshot.params && snapshot.params.clanId) {
      const id = snapshot.params.clanId;
      console.log(id);
      this.bungie.setClanId(snapshot.params.clanId);
      this.bungie.getClan(id).pipe(take(1)).subscribe(
        clan => {
          if (clan) {
            console.log('CLAN:::', clan);
            this.clanData.next(clan)
          }
        }
      )
    }
  }

}
