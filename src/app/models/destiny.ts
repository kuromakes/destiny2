export class DestinyPvPStats {
    public kd: number;
    public kda: number;
    public efficiency: number;
    public kills: number;
    public assists: number;
    public defeats: number;
    public singleGameKills: number;
    public killSpree: number;
    public mostPrecisionKills: number;
    public bestWeapon: string;
    constructor(
        kd?: number,
        kda?: number,
        efficiency?: number,
        kills?: number,
        assists?: number,
        singleGameKills?: number,
        killSpree?: number,
        mostPrecisionKills?: number,
        bestWeapon?: string,
    ) {
        this.kd = kd;
        this.kda = kda;
        this.efficiency = efficiency;
        this.kills = kills;
        this.assists = assists;
        this.defeats = kills + assists;
        this.singleGameKills = singleGameKills;
        this.killSpree = killSpree;
        this.mostPrecisionKills = mostPrecisionKills;
        this.bestWeapon = bestWeapon;
    }
}

export class DestinyPvEStats {
    public raidClears: number;
    public raidKills: number;
    public killsPerRaid: number;
    public bestRaidKills: number;
    public deathsPerRaid: number;
    public raidTimePerClear: number;
    public strikeClears: number;
    public strikeKills: number;
    public bestStrikeKills: number;
    public killsPerStrike: number;
    constructor(
        raidClears?: number,
        raidKills?: number,
        killsPerRaid?: number,
        bestRaidKills?: number,
        deathsPerRaid?: number,
        raidTimePerClear?: number,
        strikeClears?: number,
        strikeKills?: number,
        bestStrikeKills?: number,
        killsPerStrike?: number,
    ) {
        this.raidClears = raidClears;
        this.raidKills = raidKills;
        this.killsPerRaid = killsPerRaid;
        this.bestRaidKills = bestRaidKills;
        this.deathsPerRaid = deathsPerRaid;
        this.raidTimePerClear = raidTimePerClear;
        this.strikeClears = strikeClears;
        this.strikeKills = strikeKills;
        this.bestStrikeKills = bestStrikeKills;
        this.killsPerStrike = killsPerStrike;
    }
}

export class DestinyCharacter {
    public activityStats: {
        pve: DestinyPvEStats,
        pvp: DestinyPvPStats
    }
    public characterId: string;
    public characterClass: string;
    public characterStats: {
        mobility: string;
        resilience: string;
        recovery: string;
    };
    public hoursPlayed: string;
    public lastPlayed: string;
    constructor(
        activityStats?: { pve: DestinyPvEStats, pvp: DestinyPvPStats },
        characterId?: string,
        characterClass?: string,
        characterStats?: { mobility: string, resilience: string, recovery: string },
        hoursPlayed?: string,
        lastPlayed?: string
    ) {
        this.activityStats = activityStats;
        this.characterId = characterId;
        this.characterClass = characterClass;
        this.characterStats = characterStats;
        this.hoursPlayed = hoursPlayed;
        this.lastPlayed = lastPlayed;
    }
}

export class BungieProfile {
    public bungieId: string;
    public icon: string;
    public theme: string;
    public bio: string;
}

export class DestinyProfile {
    public destinyId: string;
    public name: string;
    public lastPlayed: string;
    public hoursPlayed: string;
    public bungieProfile: BungieProfile;
    public pvpStats: DestinyPvPStats;
    public pveStats: DestinyPvEStats;
    public characters: DestinyCharacter[];
    constructor(
        destinyId?: string,
        name?: string,
        lastPlayed?: string,
        hoursPlayed?: string,
        bungieProfile?: BungieProfile,
        characters?: DestinyCharacter[],
        pvpStats?: DestinyPvPStats,
        pveStats?: DestinyPvEStats
    ) {
        this.destinyId = destinyId;
        this.name = name;
        this.lastPlayed = lastPlayed;
        this.hoursPlayed = hoursPlayed;
        this.bungieProfile = bungieProfile;
        this.characters = characters;
        this.pvpStats = pvpStats;
        this.pveStats = pveStats;
    }
}

export class DestinyPlayerLookup {
    public platform: number;
    public destinyId: string;
    public battleNet: string;
    public hoursPlayed: string;
    public pvpStats: DestinyPvPStats;
    public pveStats: DestinyPvEStats;
    public characters: DestinyCharacter[];
    constructor(
        platform?: number,
        destinyId?: string,
        battleNet?: string,
        hoursPlayed?: string,
        characters?: DestinyCharacter[],
        pvpStats?: DestinyPvPStats,
        pveStats?: DestinyPvEStats
    ) {
        this.platform = platform || 4;
        this.destinyId = destinyId || '';
        this.battleNet = battleNet || '';
        this.hoursPlayed = hoursPlayed || '';
        this.characters = characters || [];
        this.pvpStats = pvpStats || null;
        this.pveStats = pveStats || null;
    }
}

export enum DestinyPlatforms {
    XBOX = 1,
    PS4 = 2,
    PC = 4
}

export interface RosterItem {
    name: string;
    icon: string;
    status: string;
    bungieId: string;
    destinyId: string;
    platform: number;
}

export interface LeaderboardItem {
    player: RosterItem;
    value: any;
    rank: number;
}