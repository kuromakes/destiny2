import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './views/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'clan',
    loadChildren: () => import('./views/destiny-clan/destiny-clan.module').then(m => m.DestinyClanModule)
  },
  {
    path: 'scrim-rules',
    loadChildren: () => import ('./views/destiny-rules/destiny-rules.module').then(m => m.DestinyRulesComponentModule)
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

}