import { RosterItem, DestinyPvPStats, DestinyPvEStats } from './destiny';

export interface Leaderboard {
  player: RosterItem
  pvp: DestinyPvPStats
  pve: DestinyPvEStats
}
