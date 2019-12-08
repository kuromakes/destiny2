import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { Destroyer, LeaderboardItem, RosterItem } from '@models';
import { BehaviorSubject } from 'rxjs';
import { BackdropComponent } from '@components/backdrop/backdrop.component';

@Component({
    selector: 'app-destiny-leaderboard',
    templateUrl: './destiny-leaderboard.component.html',
    styleUrls: ['./destiny-leaderboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyLeaderboardComponent extends Destroyer {

    public selectedPlayer = new BehaviorSubject<RosterItem>(null);

    private _leaderboard: LeaderboardItem[];

    @Input() set leaderboard(leaderboard: LeaderboardItem[]) {
        if (leaderboard) {
            this._leaderboard = leaderboard;
            this.cd.markForCheck();
        }
    }

    @Input() leaderboardTitle: string;

    @ViewChild('FullLeaderboard', { static: false }) fullLeaderboardBackdrop: BackdropComponent;

    @ViewChild('Player', { static: false }) playerBackdrop: BackdropComponent;

    constructor(private cd: ChangeDetectorRef) {
        super();
    }

    get leaderboard(): LeaderboardItem[] {
        return this._leaderboard;
    }

    get topFive(): LeaderboardItem[] {
        if (this.leaderboard) {
            return [...this.leaderboard].splice(0, 5);
        } else {
            return [];
        }
    }

    public viewFullLeaderboard() {
        if (this.playerBackdrop.isOpen) {
            this.playerBackdrop.close();
        }
        this.fullLeaderboardBackdrop.open();
    }

    public viewPlayer(player: LeaderboardItem) {
        this.selectedPlayer.next(player.player);
        if (this.fullLeaderboardBackdrop.isOpen) {
            this.fullLeaderboardBackdrop.close();
        }
        this.playerBackdrop.open();
        this.cd.markForCheck();
    }

}