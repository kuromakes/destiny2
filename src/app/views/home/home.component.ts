import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BungieService, SEOService } from '@service';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {

  public clanName: string;

  public searchResults = new BehaviorSubject<any[]>(null);

  public isLoading = new BehaviorSubject<boolean>(false);

  constructor(private bungie: BungieService, private seo: SEOService) {
    this.seo.resetTitle();
    this.seo.updateDescription();
  }

  public search(): void {
    this.isLoading.next(true);
    this.bungie.searchClans({
      name: this.clanName.trim(),
      groupType: 1
    }).pipe(
      take(1)
    ).subscribe(
      clans => {
        if (clans && clans.results) {
          this.searchResults.next(clans.results);
        }
        this.isLoading.next(false);
      },
      err => {
        console.error('Unexpected failure retrieving clan search results', err);
        this.isLoading.next(false);
      }
    );
  }

}
