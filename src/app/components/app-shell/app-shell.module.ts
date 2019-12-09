import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from './header/header.component';
import { AppFooterComponent } from './footer/footer.component';
import { AppShellComponent } from './app-shell.component';
import { AppLogoModule } from '../logo/logo.module';
import { MatIconModule, MatSlideToggleModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AppLogoModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  declarations: [
    AppHeaderComponent,
    AppFooterComponent,
    AppShellComponent
  ],
  exports: [
    AppShellComponent
  ]
})
export class AppShellModule {

}