import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements OnInit {

  @Input()
  bannerUrl: string;

  @Input()
  fullscreen = false;

  @Input()
  size: string;

  private _backgroundImage: { 'background-image' };

  get backgroundImage(): { 'background-image' } {
    return this._backgroundImage;
  }

  set backgroundImage(image: { 'background-image' }) {
    this._backgroundImage = image;
    this.cd.markForCheck();
  }

  public get sizing(): string {
    return this.size ? `hero-${this.size.toLowerCase()}` : ``;
  }

  constructor(private cd: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() {
    this.backgroundImage = {
      'background-image': (this.bannerUrl) ? 'url("' + this.bannerUrl + '")' : '#111'
    };
    if (this.size === 'full-screen') {
      this.renderer.addClass(this.el.nativeElement, 'full-screen');
    }
  }

}
