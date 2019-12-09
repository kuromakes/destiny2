import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home.component';
import { HeroComponentModule, InputComponentModule } from '@components';

@NgModule({
  imports: [
    CommonModule,
    HeroComponentModule,
    InputComponentModule
  ],
  declarations: [
    HomePageComponent
  ]
})
export class HomePageModule {

}