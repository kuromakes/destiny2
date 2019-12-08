import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ HeroComponent ],
  exports: [ HeroComponent ]
})
export class HeroComponentModule {

}