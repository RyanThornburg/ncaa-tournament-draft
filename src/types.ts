export interface User {
    id: string;
    user_name: string;
    display_name: string;
    email: string | null;
    role: string;
    active: boolean;
    created_at: string;
}

export type AppVariables = {
    currentUser?: User;
};

export interface Team {
    id: string;
    name: string;
    seed: number;
    region: string;
    overall_rank: number;
}

export interface Pick {
    user_id: string;
    user_name: string;
    team_id: string;
    pick_order: number;
    team_name: string;
    seed: number;
    region: string;
    overall_rank: number;
    autodraft: boolean;
}

export interface Game {
    id: number;
    round: number;
    region: string| null;
    bracket_position_id: string | null;
    team_1_id: string | null;
    team_2_id: string | null;
    team_1_seed: number | null;
    team_2_seed: number | null;
    winner_team_id: string | null;
    winner_team_name: string | null;
    team_1_score: number | null;
    team_2_score: number | null;
    game_time: string | null;
    game_status: string | null;
    start_time: string | null;
    start_date: string | null;
    start_time_epoch: number | null;
    location: string | null;
    data_source: string;
    updated_at?: string;
}

export interface UserScore {
    user_name: string;
    total: number;
    breakdown: {
        team_id: string;
        seed: number;
        wins: number;
        points: number;
    }[];
}

export interface DraftOrderEntry {
    pick_number: number;
    user_id: string;
    user_name: string;
    auto_draft: number;     // 1=autodraft, 0=user selected
}

export interface PickGameResult {
    game_id: number;
    round: number;
    opponent_team_id: string;
    opponent_name: string;
    opponent_seed: number;
    winner_team_id: string;
    winner_seed: number;
    points: number;
}

export interface PickResult {
    team_id: string;
    team_name: string;
    seed: number;
    region: string;
    pick_order: number;
    points_earned: number;
    games: PickGameResult[];
    eliminated: 0 | 1;
    eliminated_round: number | null; //2=R64, 3=R32, 4=R16, 5=E8, 6=F4, 7=Championship
}

export interface LeaderboardEntry {
    rank?: number;
    user_id: string;
    user_name: string;
    total_points: number;
    teams_alive: number;
    picks: PickResult[];
}

export type Leaderboard = LeaderboardEntry[];

// leaderboard and historical 
export interface PickRow {
    user_id: string;
    user_name: string;
    team_id: string;
    team_name: string;
    seed: number;
    region: string;
    overall_rank: number;
    pick_order: number;
    autodraft: 0 | 1;
    eliminated: 0 | 1;
    eliminated_round: number | null;
}

export interface WinRow {
    game_id: number;
    winner_team_id: string;
    winner_seed: number;
    round: number;
    loser_team_id: string;
    loser_name: string;
    loser_seed: number;
}

// NCAA API response types (https://github.com/henrygd/ncaa-api)
export interface NcaaApiTeam {
    seoname: string;
    nameShort: string;
    nameFull: string;
    seed: number;
    score: number | null;
    isWinner: boolean;
    isVisible: boolean;
    isHome: boolean;
    isTop: boolean;
}

export interface NcaaApiGame {
    contestId: number;
    bracketPositionId: number;
    sectionId: number;
    gameState: string;         // "P"=pre, "I"=in-progress, "F"=final
    statusCodeDisplay: string; // "pre", "live", "final"
    startDate: string;         // "MM/DD/YYYY"
    startTime: string;
    startTimeEpoch: number;
    contestClock: string;
    currentPeriod: string;
    teams: NcaaApiTeam[];
}

export interface NcaaApiRegion {
    sectionId: number;
    title: string;
    abbreviation: string;
    regionCode: string;
}

export interface NcaaApiRounds {
    roundNumber: number;
    label: string;
    subTitle: string;
    title: string;
}

export interface NcaaApiResponse {
    championships: {
        games: NcaaApiGame[];
        regions: NcaaApiRegion[];
        rounds: NcaaApiRounds[];
        year: number;
    }[];
}
