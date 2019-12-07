import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'clan/:id',
    loadChildren: () => import('./views/destiny-clan/destiny-clan.module').then(m => m.DestinyClanModule)
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

}