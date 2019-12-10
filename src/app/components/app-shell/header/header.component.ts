import { Component, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PwaService, ThemeService } from '@service';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {

  public navOpen = new BehaviorSubject<boolean>(false);

  @ViewChild('ThemeToggle', {static: false})
  themeToggle: MatSlideToggle;

  constructor(
    public themeService: ThemeService,
    public pwa: PwaService,
    private cd: ChangeDetectorRef
  ) {

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

  public setTheme(event: MatSlideToggleChange): void {
    const dark = event.checked;
    console.log(`setTheme(${dark})`);
    this.themeService.setTheme(dark ? 'dark' : 'light');
  }

  public toggleTheme(): void {
    this.themeService.toggle();
    this.themeToggle.toggle();
    this.cd.markForCheck();
  }

}