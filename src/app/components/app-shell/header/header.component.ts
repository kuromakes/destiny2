import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material';
import { Destroyer } from '@models';
import { PwaService, ThemeService } from '@service';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent extends Destroyer {

  public navOpen = new BehaviorSubject<boolean>(false);
  
  public isMobile$: BehaviorSubject<boolean>;

  @ViewChild('ThemeToggle', {static: false})
  themeToggle: MatSlideToggle;

  constructor(
    public themeService: ThemeService,
    public pwa: PwaService,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.isMobile$ = new BehaviorSubject(window.innerWidth < 960);
    this.resizeListener();
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

  private resizeListener(): void {
    fromEvent(window, 'resize').pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.isMobile$.next(window.innerWidth < 960);
    });
  }

}