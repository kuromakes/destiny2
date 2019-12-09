import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestinyRulesComponent } from './destiny-rules.component';
import { MatTabsModule } from '@angular/material';
import { InputComponentModule, HeroComponentModule } from '@components';
import { DestinyRulesRoutingModule } from './destiny-rules.routing.module';

const componentModules = [
  InputComponentModule,
  HeroComponentModule
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    DestinyRulesRoutingModule,
    ...componentModules
  ],
  declarations: [ DestinyRulesComponent ]
})
export class DestinyRulesComponentModule {

}
