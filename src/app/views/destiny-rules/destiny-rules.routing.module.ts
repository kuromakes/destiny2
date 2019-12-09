import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinyRulesComponent } from './destiny-rules.component';

const routes: Routes = [
  {
    path: '',
    component: DestinyRulesComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DestinyRulesRoutingModule {

}
