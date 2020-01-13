import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BungieService, SEOService } from '@service';
import { take, filter, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { Destroyer } from '@models';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent extends Destroyer implements OnDestroy {

  public clanName: string

  public searchResults = new BehaviorSubject<any[]>(null)

  public isLoading = new BehaviorSubject<boolean>(false)

  private focused$: Subject<void>

  constructor(private bungie: BungieService, private seo: SEOService) {
    super()
    this.seo.resetTitle()
    this.seo.updateDescription()
  }

  public search(): void {
    if (!this.clanName) {
      return;
    }
    this.isLoading.next(true)
    this.bungie.searchClans({
      name: this.clanName.trim(),
      groupType: 1
    }).pipe(
      take(1)
    ).subscribe(
      clans => {
        if (clans && clans.results) {
          this.searchResults.next(clans.results)
        }
        this.isLoading.next(false)
      },
      err => {
        console.error('Unexpected failure retrieving clan search results', err)
        this.isLoading.next(false)
        alert('Uh oh, there was an error retrieving clan search. See console for more details.')
      }
    )
  }

  private listenForSubmissionKeys(): void {
    if (!this.focused$) {
      this.focused$ = new Subject()
    }
    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter(event => event && event.key && event.key.toLowerCase() === 'enter'),
      takeUntil(this.focused$)
    ).subscribe(
      event => {
        event.preventDefault()
        event.stopPropagation()
        this.search()
      },
      err => {
        console.error('Unexpected failure in keyboard shortcut listener', err);
      }
    )
  }

  public handleSearchFocus(event: boolean): void {
    if (event) {
      this.listenForSubmissionKeys()
    } else {
      this.focused$.next()
      this.focused$.complete()
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy()
    if (this.focused$) {
      this.focused$.next();
      this.focused$.complete();
    }
  }

}
