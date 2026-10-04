export const TOURNAMENT_HEAD = "TheeeeOPlex"
export const TOURNAMENT_SUBHEAD = "The Ledgesheet is dead"
export const ROUND_POINTS = [0, 0, 1, 3, 5, 7, 9, 11]; // index 2 is round of 64

// currently using https://github.com/henrygd/ncaa-api
export const SEASON_YEAR = 2026;
export const GAME_QUERY_URL = "https://ncaa-api.henrygd.me/brackets/basketball-men/d1/"
export const getGameQueryUrl = (year?: number) =>{
    const y = year ?? SEASON_YEAR;
    return `${GAME_QUERY_URL}${y}`
}

export const NCAA_URL = "https://www.ncaa.com/march-madness-live/game/"

export const ROUND_NAMES = [
  "Round of 64", "Round of 32", "Sweet 16", "Elite 8", "Final Four", "Championship",
];

export const TABS = [
    ["leaderboard", "Standings"], // the first tab is the default
    ["bracket", "Bracket"],
    ["draft", "Draft"],
    ["history", "History"],
] as const;


export function calculateUpsetPoints(winning_seed: number, losing_seed: number, round: number): number {
    if (winning_seed > losing_seed)
        return ROUND_POINTS[round] + ((winning_seed - losing_seed) / 2);
    else
        return ROUND_POINTS[round];
}

// adding some old data from emails without full data
export const HISTORICAL_DATA = {
    2019:{
        scores:[
            {user_name: 'Elliott*', 'total_points': 42, rank: 1},
            {user_name: '???', 'total_points': '???', rank: 8}
        ]
    }
}

export const HISTORICAL_NOTES = "2017,  I have one email where Grapes is in the lead but the tournament isn't over. Assuming we just decided to not allow that to play out.";