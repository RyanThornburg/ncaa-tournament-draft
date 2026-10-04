import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { Game, Pick } from "../types";
import { NCAA_URL } from "../config";
import LiveLine from "./LiveLine";
import Updated from "./Updated";
import { Chevron } from "./Icons";
import { lastSync } from "./tournament";

// bracket_position_id ranges by round:
//  r64 (round 2): 200s
//  r32 (round 3): 300s
//  ...
//  championship (round 7): 700s

interface BracketGame extends Game {
  team_1_name?: string | null;
  team_2_name?: string | null;
  winner_name?: string | null;
}

interface TeamPickMap {
  [teamId: string]: string; // team_id → display_name
}

const ROUND_LABELS = ["", "", "R64", "R32", "Sweet 16", "Elite 8", "Final Four", "Championship"];

// region order from bracket_position_id in r64
function computeRegionOrder(games: BracketGame[]): [string[], string[]] {
  const minPos: Record<string, number> = {};
  for (const g of games) {
    if (g.round !== 2 || !g.region || !g.bracket_position_id) continue;
    const pos = parseInt(g.bracket_position_id);
    if (minPos[g.region] === undefined || pos < minPos[g.region]) {
      minPos[g.region] = pos;
    }
  }
  const sorted = Object.keys(minPos).sort((a, b) => minPos[a] - minPos[b]);
  return [sorted.slice(0, 2), sorted.slice(2, 4)];
}


interface TeamSlotProps {
  teamId: string | null;
  teamName: string | null;
  seed: number | null;
  score: number | null;
  isWinner: boolean;
  isLoser?: boolean;
  pickerName: string | null;
  mirrored?: boolean;
  highlighted?: boolean;
}

function TeamSlot({ teamId, teamName, seed, score, isWinner, isLoser, pickerName, mirrored, highlighted }: TeamSlotProps) {
  const isEmpty = !teamId && !teamName;
  const cls = `bk-team-slot ${isWinner ? "bk-winner" : ""} ${isLoser ? "bk-loser" : ""} ${isEmpty ? "bk-empty" : ""} ${highlighted ? "bk-highlighted" : ""}`;
  const scoreEl = score !== null && score !== undefined
    ? <span className={`bk-score ${isWinner ? "bk-score-win" : ""}`}>{score}</span>
    : null;
  const nameEl = <span className={`bk-team-name${mirrored ? " bk-team-name-r" : ""}`} title={teamName ?? undefined}>{teamName ?? <span className="bk-tbd">TBD</span>}</span>;
  const seedEl = <span className="bk-seed">{seed ?? ""}</span>;
  const pickerEl = pickerName ? <span className="bk-picker" title={pickerName}>{pickerName}</span> : null;

  return (
    <div className={cls}>
      {mirrored ? <>{scoreEl}{pickerEl}{nameEl}{seedEl}</> : <>{seedEl}{nameEl}{pickerEl}{scoreEl}</>}
    </div>
  );
}

interface ChampSectionProps {
  ffLeft: BracketGame | null;
  ffRight: BracketGame | null;
  champGame: BracketGame | null;
  picks: TeamPickMap;
  highlightedTeams?: Set<string>;
}

function ChampSection({ ffLeft, ffRight, champGame, picks, highlightedTeams }: ChampSectionProps) {
  return (
    <>
      <div className="bk-bottom-section">
        <div className="bk-ff-label">{ROUND_LABELS[6]}</div>
        <GameCard game={ffLeft} picks={picks} placeholder="Final Four" highlightedTeams={highlightedTeams} />
      </div>
      <div className="bk-championship">
        <div className="bk-champ-label">{ROUND_LABELS[7]}</div>
        <GameCard game={champGame} picks={picks} placeholder="Championship" highlightedTeams={highlightedTeams} />
        {champGame?.winner_team_id && (
          <div className="bk-champion-banner">
            <div className="bk-champion-text">CHAMPION</div>
            <div className="bk-champion-name">{champGame.winner_name ?? ""}</div>
            {picks[champGame.winner_team_id] && (
              <div className="bk-champion-picker">{picks[champGame.winner_team_id]}</div>
            )}
          </div>
        )}
      </div>
      <div className="bk-bottom-section">
        <div className="bk-ff-label">{ROUND_LABELS[6]}</div>
        <GameCard game={ffRight} picks={picks} placeholder="Final Four" highlightedTeams={highlightedTeams} />
      </div>
    </>
  );
}

interface GameCardProps {
  game: BracketGame | null;
  picks: TeamPickMap;
  placeholder?: string;
  mirrored?: boolean;
  highlightedTeams?: Set<string>;
}

function GameCard({ game, picks, placeholder, mirrored, highlightedTeams }: GameCardProps) {
  if (!game) {
    return (
      <div className="bk-game bk-game-empty">
        <div className="bk-team-slot bk-empty"><span className="bk-tbd">{placeholder ?? "TBD"}</span></div>
        <div className="bk-divider" />
        <div className="bk-team-slot bk-empty"><span className="bk-tbd">{placeholder ?? "TBD"}</span></div>
      </div>
    );
  }

  const hasScore = game.team_1_score !== null || game.team_2_score !== null;
  const name1 = game.team_1_name ?? null;
  const name2 = game.team_2_name ?? null;

  // team_1 = top slot (per sync job)
  const top    = { id: game.team_1_id, name: name1, seed: game.team_1_seed, score: game.team_1_score };
  const bottom = { id: game.team_2_id, name: name2, seed: game.team_2_seed, score: game.team_2_score };

  const topHighlighted    = !!highlightedTeams && !!top.id    && highlightedTeams.has(top.id);
  const bottomHighlighted = !!highlightedTeams && !!bottom.id && highlightedTeams.has(bottom.id);
  const gameHighlighted   = topHighlighted || bottomHighlighted;

  const gameTime = (()=> {
    if (!game.start_time_epoch) return '';
    const date = new Date(game.start_time_epoch * 1000);
    const time = date.toLocaleString('en-US', {timeStyle: 'short'});
    const isToday = date.toDateString() === new Date().toDateString();
    return isToday ? time : `${date.toLocaleString('en-US', { weekday: 'long' })} ${time}`
  });

  const ncaaUrl = game.bracket_position_id ? `${NCAA_URL}${game.bracket_position_id}` : null;

  // spoken summary, e.g. "Auburn (Dana) 83 def. Alabama St. (Grapes) 79, final"
  const label = (() => {
    const who = (t: typeof top) => `${t.name ?? "TBD"}${t.id && picks[t.id] ? ` (${picks[t.id]})` : ""}`;
    if (game.winner_team_id) {
      const [w, l] = game.winner_team_id === top.id ? [top, bottom] : [bottom, top];
      return `${who(w)} ${w.score ?? ""} def. ${who(l)} ${l.score ?? ""}, final`;
    }
    if (game.game_status === "live") return `${who(top)} ${top.score ?? 0}, ${who(bottom)} ${bottom.score ?? 0}, live`;
    return `${who(top)} vs ${who(bottom)}${gameTime() ? `, ${gameTime()}` : ""}`;
  })();

  return (
    <div
      className={`bk-game ${game.winner_team_id ? "bk-game-final" : ""} ${game.game_status === "live" ? "bk-game-live" : ""} ${gameHighlighted ? "bk-game-highlighted" : ""} ${ncaaUrl ? "bk-game-clickable" : ""}`}
      data-bracket-id={game.bracket_position_id ?? undefined}
      onClick={ncaaUrl ? () => window.open(ncaaUrl, "_blank", "noopener,noreferrer") : undefined}
      onKeyDown={ncaaUrl ? (e) => { if (e.key === "Enter") window.open(ncaaUrl, "_blank", "noopener,noreferrer"); } : undefined}
      role={ncaaUrl ? "link" : undefined}
      aria-label={ncaaUrl ? `${label}. Opens on NCAA.com` : label}
      tabIndex={ncaaUrl ? 0 : undefined}
    >
      {game.game_status === "live" && <span className="bk-live-badge">LIVE</span>}
      {name1 && name2 && game.game_status === "pre" && <span className="bk-live-badge">{gameTime()}</span>}
      <TeamSlot
        teamId={top.id}
        teamName={top.name}
        seed={top.seed}
        score={hasScore ? (top.score ?? 0) : null}
        isWinner={game.winner_team_id !== null && game.winner_team_id === top.id}
        isLoser={game.winner_team_id !== null && !!top.id && game.winner_team_id !== top.id}
        pickerName={top.id ? (picks[top.id] ?? null) : null}
        mirrored={mirrored}
        highlighted={topHighlighted}
      />
      <div className="bk-divider" />
      <TeamSlot
        teamId={bottom.id}
        teamName={bottom.name}
        seed={bottom.seed}
        score={hasScore ? (bottom.score ?? 0) : null}
        isWinner={game.winner_team_id !== null && game.winner_team_id === bottom.id}
        isLoser={game.winner_team_id !== null && !!bottom.id && game.winner_team_id !== bottom.id}
        pickerName={bottom.id ? (picks[bottom.id] ?? null) : null}
        mirrored={mirrored}
        highlighted={bottomHighlighted}
      />
    </div>
  );
}

// games for a region + round, sorted by bracket_position_id
function getRegionRoundGames(games: BracketGame[], region: string, round: number): BracketGame[] {
  return games
    .filter(g => g.region === region && g.round === round)
    .sort((a, b) => parseInt(a.bracket_position_id ?? "0") - parseInt(b.bracket_position_id ?? "0"));
}

// FF games have null region in the API use position instead
function getFFGame(games: BracketGame[], side: "left" | "right"): BracketGame | null {
  const ffGames = games
    .filter(g => g.round === 6)
    .sort((a, b) => parseInt(a.bracket_position_id ?? "0") - parseInt(b.bracket_position_id ?? "0"));
  return side === "left" ? (ffGames[0] ?? null) : (ffGames[ffGames.length - 1] ?? null);
}

function getChampGame(games: BracketGame[]): BracketGame | null {
  return games.find(g => g.round === 7) ?? null;
}

interface RegionColumnProps {
  region: string;
  games: BracketGame[];
  picks: TeamPickMap;
  mirrored?: boolean;
  highlightedTeams?: Set<string>;
}

function RegionColumn({ region, games, picks, mirrored, highlightedTeams }: RegionColumnProps) {
  const rounds = [2, 3, 4, 5];
  const roundNames: Record<number, string> = { 2: "R64", 3: "R32", 4: "Sweet 16", 5: "Elite 8" };

  return (
    <div className="bk-region-col">
      <div className="bk-region-label">{region}</div>
      <div className="bk-rounds-row">
        {rounds.map((round) => {
          const roundGames = getRegionRoundGames(games, region, round);
          const slots = round === 2 ? 8 : round === 3 ? 4 : round === 4 ? 2 : 1;
          return (
            <div key={round} className={`bk-round-col bk-round-${round}`}>
              <div className="bk-round-label">{roundNames[round]}</div>
              <div className="bk-round-games">
                {Array.from({ length: slots }).map((_, i) => (
                  <GameCard key={i} game={roundGames[i] ?? null} picks={picks} mirrored={mirrored} highlightedTeams={highlightedTeams} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ROUND_NAMES_SHORT: Record<number, string> = { 2: "R64", 3: "R32", 4: "Sweet 16", 5: "Elite 8" };

// Phone view: two rounds side by side, filling the screen
function MobileRegion({ region, games, picks, highlightedTeams }: RegionColumnProps) {
  // open on the round before the first unfinished one, so live/next games sit in the right column
  const open = games.filter(g => g.region === region && g.team_1_id && g.team_2_id && g.game_status !== "final" && g.game_status !== "forfeit");
  const current = open.length ? Math.min(...open.map(g => g.round)) : 5;
  const [startChoice, setStart] = useState<number | null>(null);
  const start = startChoice ?? Math.min(4, Math.max(2, current - 1));
  const rounds = [start, start + 1];

  return (
    <div className="bk-mobile-region">
      <div className="bk-round-step">
        <button aria-label="Earlier rounds" disabled={start <= 2} onClick={() => setStart(start - 1)}><Chevron dir="left" size={14} /></button>
        <span className="bk-round-step-label" aria-live="polite">{ROUND_NAMES_SHORT[start]} <span aria-hidden="true">→</span><span className="sr-only">and</span> {ROUND_NAMES_SHORT[start + 1]}</span>
        <button aria-label="Later rounds" disabled={start >= 4} onClick={() => setStart(start + 1)}><Chevron dir="right" size={14} /></button>
      </div>
      <div className="bk-mobile-rounds">
        {rounds.map(round => {
          const roundGames = getRegionRoundGames(games, region, round);
          const slots = round === 2 ? 8 : round === 3 ? 4 : round === 4 ? 2 : 1;
          return (
            <div key={round} className="bk-mobile-round">
              <div className="bk-round-label">{ROUND_NAMES_SHORT[round]}</div>
              <div className="bk-mobile-games">
                {Array.from({ length: slots }).map((_, i) => (
                  <GameCard key={i} game={roundGames[i] ?? null} picks={picks} highlightedTeams={highlightedTeams} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BracketProps {
  selectedUser: string;
  me: string;
}

export default function Bracket({ selectedUser, me }: BracketProps) {
  const [games, setGames] = useState<BracketGame[]>([]);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileSelChoice, setMobileSel] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    Promise.all([api.getGames(), api.getPicks()])
      .then(([g, p]) => {
        setGames(g);
        setPicks(p);
      })
      .catch((e) => setError(e.message))
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [load]);

  // team to user mapping
  const teamPickMap: TeamPickMap = {};
  for (const p of picks) {
    teamPickMap[p.team_id] = p.user_name;
  }

  if (loading) return <div className="spinner">Loading bracket…</div>;
  if (error) return <div className="error-banner">{error}</div>;

  const [leftRegions, rightRegions] = computeRegionOrder(games);
  const allRegions = [...leftRegions, ...rightRegions];
  const champGame = getChampGame(games);
  const ffLeft = getFFGame(games, "left");
  const ffRight = getFFGame(games, "right");

  const highlightedTeams: Set<string> | undefined = selectedUser
    ? new Set(picks.filter(p => p.user_name === selectedUser).map(p => p.team_id))
    : undefined;

  const ffHasTeams = !!(ffLeft?.team_1_id || ffLeft?.team_2_id || ffRight?.team_1_id || ffRight?.team_2_id);
  // phones open where the reader's live or next game is; else the Final Four once set; else the first region
  const myTeams = new Set(picks.filter(p => p.user_name === me).map(p => p.team_id));
  const myOpen = games
    .filter(g => g.team_1_id && g.team_2_id && !g.winner_team_id && (myTeams.has(g.team_1_id) || myTeams.has(g.team_2_id)))
    .sort((a, b) => (a.game_status === "live" ? -1 : 0) - (b.game_status === "live" ? -1 : 0) || (a.start_time_epoch ?? 0) - (b.start_time_epoch ?? 0));
  const myRegion = myOpen[0] ? (myOpen[0].region ?? "__ff__") : null;
  const mobileSel = mobileSelChoice ?? myRegion ?? (ffHasTeams || allRegions.length === 0 ? "__ff__" : allRegions[0]);

  return (
    <div className={`bk-root${highlightedTeams ? " bk-user-filter" : ""}`}>
      <div className="bk-status">
        <LiveLine games={games} owners={teamPickMap} me={me} />
        <Updated at={lastSync(games)} refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
      </div>
      <div className="bk-mobile-nav">
        {allRegions.map(r => (
          <button key={r} className={`bk-mobile-tab${mobileSel === r ? " active" : ""}`} aria-pressed={mobileSel === r} onClick={() => setMobileSel(r)}>
            {r}
          </button>
        ))}
        <button className={`bk-mobile-tab${mobileSel === "__ff__" ? " active" : ""}`} aria-pressed={mobileSel === "__ff__"} onClick={() => setMobileSel("__ff__")}>
          Final Four
        </button>
      </div>

      <div className="bk-mobile-view">
        {mobileSel !== "__ff__" && (
          <MobileRegion key={mobileSel} region={mobileSel} games={games} picks={teamPickMap} highlightedTeams={highlightedTeams} />
        )}
        {mobileSel === "__ff__" && (
          <div className="bk-mobile-ff">
            <ChampSection ffLeft={ffLeft} ffRight={ffRight} champGame={champGame} picks={teamPickMap} highlightedTeams={highlightedTeams} />
          </div>
        )}
      </div>

      {ffHasTeams && (
        <div className="bk-bottom">
          <ChampSection ffLeft={ffLeft} ffRight={ffRight} champGame={champGame} picks={teamPickMap} highlightedTeams={highlightedTeams} />
        </div>
      )}

      <div className="bk-bracket-wrap">
        <div className="bk-side bk-side-left">
          {leftRegions.map((region) => (
            <RegionColumn key={region} region={region} games={games} picks={teamPickMap} highlightedTeams={highlightedTeams} />
          ))}
        </div>
        <div className="bk-side bk-side-right">
          {rightRegions.map((region) => (
            <RegionColumn key={region} region={region} games={games} picks={teamPickMap} mirrored highlightedTeams={highlightedTeams} />
          ))}
        </div>
      </div>

      {!ffHasTeams && (
        <div className="bk-bottom">
          <ChampSection ffLeft={ffLeft} ffRight={ffRight} champGame={champGame} picks={teamPickMap} highlightedTeams={highlightedTeams} />
        </div>
      )}
    </div>
  );
}
