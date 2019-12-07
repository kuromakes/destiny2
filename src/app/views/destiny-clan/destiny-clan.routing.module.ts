import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DestinyLeaderboardsComponent } from './components/destiny-leaderboards/destiny-leaderboards.component';

const routes: Routes = [{
    path: '',
    component: DestinyLeaderboardsComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DestinyClanRoutingModule { }
