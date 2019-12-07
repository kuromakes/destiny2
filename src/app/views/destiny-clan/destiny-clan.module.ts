import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinyRosterComponent } from './components/destiny-roster/destiny-roster.component';
import { DestinyProfileComponent } from './components/destiny-profile/destiny-profile.component';
import { DestinyStatsComponent } from './components/destiny-stats/destiny-stats.component';
import { DestinyLeaderboardComponent } from './components/destiny-leaderboard/destiny-leaderboard.component';
import { DestinyLeaderboardsComponent } from './components/destiny-leaderboards/destiny-leaderboards.component';
import { MaterialModule } from '../../material.module';

const components = [
  DestinyRosterComponent,
  DestinyProfileComponent,
  DestinyStatsComponent,
  DestinyLeaderboardComponent,
  DestinyLeaderboardsComponent
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [ ...components ],
  exports: []
})
export class DestinyClanModule {

}
