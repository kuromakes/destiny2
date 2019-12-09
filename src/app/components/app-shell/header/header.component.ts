import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PwaService } from '@service/pwa.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {

  public navOpen = new BehaviorSubject<boolean>(false);

  constructor(private pwa: PwaService) {

  }

  public open(): void {
    this.navOpen.next(true);
  }

  public close(): void {
    this.navOpen.next(false);
  }

  public toggle(): void {
    const state = !!this.navOpen.value;
    this.navOpen.next(!state);
  }

  public install(): void {
    this.pwa.promptEvent.prompt();
  }

}