import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home.component';
import { HomePageRoutingModule } from './home.routing.module';

@NgModule({
  imports: [ CommonModule, HomePageRoutingModule ],
  declarations: [ HomePageComponent ]
})
export class HomePageModule {

}