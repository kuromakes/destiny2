import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private static readonly STORAGE_KEY = '__ku_d2_theme__';

  private _theme: Theme = 'dark';

  private renderer: Renderer2;

  public activeTheme = new BehaviorSubject<Theme>(this.theme);

  constructor(private _rendererFactory: RendererFactory2) {
    this.renderer = _rendererFactory.createRenderer(null, null);
    this._theme = this.getLocalTheme();
  }

  get theme(): Theme {
    return this._theme || 'dark';
  }

  set theme(newTheme: Theme) {
    if (newTheme as Theme && newTheme !== this._theme) {
      // clone theme before changing
      const previous = `${this._theme}`;
      // update
      this._theme = newTheme;
      this.activeTheme.next(newTheme);
      // update DOM
      const body = document.querySelector('body');
      this.renderer.removeClass(body, previous + '-theme');
      this.renderer.addClass(body, newTheme + '-theme')
      // save locally
      this.cacheTheme();
    }
  }

  public setTheme(theme: Theme) {
    this.theme = theme;
  }

  private cacheTheme(): void {
    localStorage.setItem(ThemeService.STORAGE_KEY, this._theme);
  }

  private getLocalTheme(): Theme {
    const local = localStorage.getItem(ThemeService.STORAGE_KEY) as Theme;
    return local || 'dark';
  }

}
