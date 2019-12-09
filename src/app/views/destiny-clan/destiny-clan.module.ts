import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinyRosterComponent } from './components/destiny-roster/destiny-roster.component';
import { DestinyProfileComponent } from './components/destiny-profile/destiny-profile.component';
import { DestinyStatsComponent } from './components/destiny-stats/destiny-stats.component';
import { DestinyLeaderboardComponent } from './components/destiny-leaderboard/destiny-leaderboard.component';
import { DestinyLeaderboardsComponent } from './components/destiny-leaderboards/destiny-leaderboards.component';
import { DestinyClanComponent } from './destiny-clan.component';
import { BackdropComponentModule, HeroComponentModule, InputComponentModule } from '@components';
import { DestinyClanRoutingModule } from './destiny-clan.routing.module';
import { MaterialModule } from 'src/app/material.module';
import { DestinyInfoComponent } from './components/destiny-info/destiny-info.component';

const components = [
  DestinyRosterComponent,
  DestinyProfileComponent,
  DestinyStatsComponent,
  DestinyLeaderboardComponent,
  DestinyLeaderboardsComponent,
  DestinyInfoComponent
];

@NgModule({
  imports: [
    CommonModule,
    DestinyClanRoutingModule,
    MaterialModule,
    BackdropComponentModule,
    HeroComponentModule,
    InputComponentModule
  ],
  declarations: [ DestinyClanComponent, ...components ]
})
export class DestinyClanModule {

}
