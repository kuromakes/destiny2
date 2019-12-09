import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home.component';
import { HeroComponentModule, InputComponentModule } from '@components';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    HeroComponentModule,
    InputComponentModule,
    MaterialModule,
    RouterModule
  ],
  declarations: [
    HomePageComponent
  ]
})
export class HomePageModule {

}