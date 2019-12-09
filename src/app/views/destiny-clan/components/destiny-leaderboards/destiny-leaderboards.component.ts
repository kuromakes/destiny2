import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { take } from 'rxjs/operators';
import { BackdropComponent } from '@components/backdrop/backdrop.component';
import { RosterItem, LeaderboardItem } from '@models/destiny';
import { BungieService } from '@service/bungie.service';
import { SEOService } from '@service';

@Component({
  selector: 'app-destiny-leaderboards',
  templateUrl: './destiny-leaderboards.component.html',
  styleUrls: ['./destiny-leaderboards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinyLeaderboardsComponent implements OnInit {

  @Input() roster: RosterItem[];

  // pvp leaderboards
  public kdLeaderboard: LeaderboardItem[];

  public kdaLeaderboard: LeaderboardItem[];

  public efficiencyLeaderboard: LeaderboardItem[];

  public killsLeaderboard: LeaderboardItem[];

  public assistsLeaderboard: LeaderboardItem[];

  public defeatsLeaderboard: LeaderboardItem[];

  // pve leaderboards
  public raidClearsLeaderboard: LeaderboardItem[];

  public raidTimePerClearLeaderboard: LeaderboardItem[];

  public raidKillsLeaderboard: LeaderboardItem[];

  public deathsPerRaidLeaderboard: LeaderboardItem[];

  public strikeClearsLeaderboard: LeaderboardItem[];

  public strikeKillsLeaderboard: LeaderboardItem[];

  public dataSource: MatTableDataSource<RosterItem>;

  public activity = 'crucible';

  public failure = false;

  @ViewChild(BackdropComponent, { static: false }) backdrop: BackdropComponent;

  constructor(public bungie: BungieService, private cd: ChangeDetectorRef, private seo: SEOService) {

  }

  ngOnInit() {
    const clan = this.bungie.clan.value;
    if (clan) {
      this.seo.updateTitle(`${clan.name} Leaderboards`);
    }
    this.bungie.getRoster().pipe(take(1)).subscribe((response: any) => {
      if (response) {
        this.bungie.getLeaderboards(response).pipe(take(1)).subscribe(leaderboards => {
          // pvp
          this.kdLeaderboard = this.getKdLeaderboard(leaderboards);
          this.kdaLeaderboard = this.getKdaLeaderboard(leaderboards);
          this.efficiencyLeaderboard = this.getEfficiencyLeaderboard(leaderboards);
          this.killsLeaderboard = this.getKillsLeaderboard(leaderboards);
          this.assistsLeaderboard = this.getAssistsLeaderboard(leaderboards);
          this.defeatsLeaderboard = this.getDefeatsLeaderboard(leaderboards);
          // pve
          this.raidClearsLeaderboard = this.getRaidClearsLeaderboard(leaderboards);
          this.raidTimePerClearLeaderboard = this.getRaidRaidTimePerClearLeaderboard(leaderboards);
          this.raidKillsLeaderboard = this.getRaidKillsLeaderboard(leaderboards);
          this.deathsPerRaidLeaderboard = this.getDeathsPerRaidLeaderboard(leaderboards);
          this.strikeClearsLeaderboard = this.getStrikeClearsLeaderboard(leaderboards);
          this.strikeKillsLeaderboard = this.getStrikeKillsLeaderboard(leaderboards);
          this.cd.markForCheck();
        });
      }
    }, err => {
      this.failure = true;
      console.error('Failed to load leaderboards', err);
    });
  }

  // pvp

  private getKdLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[]  = [];
    const sorted = list.sort((a, b) => b.pvp.kd - a.pvp.kd);
    sorted.forEach((player, rank)=> {
      result.push({
        player: player.player,
        value: player.pvp.kd.toFixed(2),
        rank: rank + 1
      });
    });
    return result;
  }

  private getKdaLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[]  = [];
    const sorted = list.sort((a, b) => b.pvp.kda - a.pvp.kda);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: player.pvp.kda.toFixed(2),
        rank: rank + 1
      });
    });
    return result;
  }

  private getEfficiencyLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pvp.efficiency - a.pvp.efficiency);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: player.pvp.efficiency.toFixed(2),
        rank: rank + 1
      });
    });
    return result;
  }

  private getKillsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pvp.kills - a.pvp.kills);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pvp.kills).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  private getAssistsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pvp.assists - a.pvp.assists);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pvp.assists).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  private getDefeatsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pvp.defeats - a.pvp.defeats);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pvp.defeats).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  // pve

  public getRaidClearsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pve.raidClears - a.pve.raidClears);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.raidClears).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  public getRaidRaidTimePerClearLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => a.pve.raidTimePerClear - b.pve.raidTimePerClear);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: this.bungie.parseSeconds(player.pve.raidTimePerClear),
        rank: rank + 1
      });
    });
    return result;
  }

  public getRaidKillsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pve.raidKills - a.pve.raidKills);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.raidKills).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  public getDeathsPerRaidLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => a.pve.deathsPerRaid - b.pve.deathsPerRaid);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.deathsPerRaid).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  public getStrikeClearsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pve.strikeClears - a.pve.strikeClears);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.strikeClears).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

  public getStrikeKillsLeaderboard(list): LeaderboardItem[] {
    const result: LeaderboardItem[] = [];
    const sorted = list.sort((a, b) => b.pve.strikeKills - a.pve.strikeKills);
    sorted.forEach((player, rank) => {
      result.push({
        player: player.player,
        value: Number(player.pve.strikeKills).toLocaleString(),
        rank: rank + 1
      });
    });
    return result;
  }

}
