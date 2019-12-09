import { Injectable, isDevMode } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { timer, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Destroyer } from '@models/destroyer';

@Injectable({
  providedIn: 'root'
})
export class PwaService extends Destroyer {

  private static UPDATE_INTERVAL = 60 * 60 * 1000;

  public promptEvent;

  constructor(private swUpdate: SwUpdate) {
    super();
    if (!isDevMode()) {
      // check for update whenever app is loaded, then on recurring interval
      const interval = timer(1000, PwaService.UPDATE_INTERVAL).pipe(takeUntil(this.destroy$));
      // after installation, prompt for reload
      this.swUpdate.activated.pipe(takeUntil(this.destroy$)).subscribe(
        () => {
          const shouldUpdate = confirm(`There's a new version of Destiny by Kuroi. Refresh now to update?`);
          if (shouldUpdate) {
            window.location.reload();
          }
        },
        err => {
          console.error('Unexpected failure activating new application version', err);
        }
      );
      // install updates automatically
      this.swUpdate.available.pipe(takeUntil(this.destroy$)).subscribe(() =>
        this.swUpdate.activateUpdate()
      );
      // kick off interval
      interval.subscribe(() => swUpdate.checkForUpdate());
      // download prompt
      fromEvent(window, 'beforeintsallprompt').pipe(takeUntil(this.destroy$)).subscribe(
        event => {
          if (!window.matchMedia('(display-mode: standalone').matches) {
            this.promptEvent = event;
          }
        }
      );
    }
  }
}
