import { useState } from "react";
import { Chevron } from "./Icons";
import { Game } from "../types";
import { bankedPoints, currentRound, eliminatedIn, maxRemaining, outLabel, RoadStop, roundLabel, teamRoad, tipTime, winValue } from "./tournament";

export interface NamedGame extends Game {
  team_1_name?: string | null;
  team_2_name?: string | null;
}

const when = (g: Game) => tipTime(g.start_time_epoch);

interface Ctx {
  games: NamedGame[];
  owners: Record<string, string>;   // team id → player
  names: Record<string, string>;    // team id → team name
  seeds: Record<string, number>;
}

function teamLabel(ctx: Ctx, id: string) {
  const owner = ctx.owners[id];
  return `${ctx.names[id] ?? "TBD"}${owner ? ` (${owner})` : ""}`;
}

// ── Box score ────────────────────────────────────────────────────────────

function BoxScore({ g, ctx, me }: { g: NamedGame; ctx: Ctx; me: string }) {
  const live = g.game_status === "live";
  const final = !!g.winner_team_id;
  const sides = [
    { id: g.team_1_id, name: g.team_1_name, seed: g.team_1_seed, score: g.team_1_score },
    { id: g.team_2_id, name: g.team_2_name, seed: g.team_2_seed, score: g.team_2_score },
  ];
  const owner = (id: string | null) => (id ? ctx.owners[id] : undefined);
  const o1 = owner(g.team_1_id), o2 = owner(g.team_2_id);
  let stake = "";
  if (!final && g.team_1_id && g.team_2_id) {
    const v1 = winValue(g, g.team_1_id), v2 = winValue(g, g.team_2_id);
    if (o1 && o1 === o2) stake = `${o1} banks +${Math.min(v1, v2)} either way`;
    else stake = `Win is worth ${o1 ? `+${v1} to ${o1}` : `+${v1}`} or ${o2 ? `+${v2} to ${o2}` : `+${v2}`}`;
  }
  return (
    <div className={`gm-box${live ? " live" : ""}`}>
      <div className="gm-box-head">
        <span>{g.region ?? roundLabel(g.round)}{live ? "" : final ? "" : when(g) ? ` · ${when(g)}` : ""}</span>
        {final ? <span>Final</span> : null}
      </div>
      {sides.map((s, i) => {
        const won = final && g.winner_team_id === s.id;
        const lost = final && !!s.id && g.winner_team_id !== s.id;
        const o = owner(s.id);
        return (
          <div key={i} className={`gm-team${won ? " won" : ""}${lost ? " lost" : ""}${o && o === me ? " mine" : ""}`}>
            <span className="gm-seed">{s.seed ?? ""}</span>
            <span className="gm-name">
              {s.name ?? "TBD"}
              {o && <small>{o}{o === me ? " · you" : ""}</small>}
            </span>
            <span className="gm-score">{s.score ?? ""}</span>
          </div>
        );
      })}
      {stake && <div className="gm-stake">{stake}</div>}
    </div>
  );
}

// ── Road ─────────────────────────────────────────────────────────────────

function opponentText(ctx: Ctx, stop: RoadStop): { main: string; sub: string } {
  const opps = stop.opponents;
  if (opps.length === 0) return { main: "TBD", sub: "" };
  if (opps.length === 1) return { main: ctx.names[opps[0]] ?? "TBD", sub: ctx.owners[opps[0]] ? `${ctx.owners[opps[0]]}'s` : "" };
  if (opps.length === 2) {
    return {
      main: opps.map(o => ctx.names[o] ?? "TBD").join(" / "),
      sub: opps.map(o => (ctx.owners[o] ? `${ctx.owners[o]}'s` : "unowned")).join(" / "),
    };
  }
  const fav = [...opps].sort((a, b) => (ctx.seeds[a] ?? 99) - (ctx.seeds[b] ?? 99))[0];
  const regions = new Set(opps.map(o => ctx.games.find(g => g.round === 2 && (g.team_1_id === o || g.team_2_id === o))?.region).filter(Boolean));
  const label = regions.size === 1 ? `${[...regions][0]} winner` : stop.round === 7 ? "Other half" : "Winner";
  return { main: label, sub: `${opps.length} left · top seed ${teamLabel(ctx, fav)}` };
}

function Road({ stops, ctx, teamId }: { stops: RoadStop[]; ctx: Ctx; teamId: string }) {
  return (
    <ol className="road">
      {stops.map(stop => {
        const { main, sub } = opponentText(ctx, stop);
        const live = stop.status === "live";
        const g = stop.game;
        const score = live && g ? (g.team_1_id === teamId ? `${g.team_1_score ?? 0}–${g.team_2_score ?? 0}` : `${g.team_2_score ?? 0}–${g.team_1_score ?? 0}`) : "";
        const value = g && stop.opponents.length === 1 && g.team_1_id && g.team_2_id ? winValue(g, teamId) : stop.value;
        return (
          <li key={stop.round} className={`road-stop${stop.status !== "future" ? " now" : ""}`}>
            <span className="road-round">
              {roundLabel(stop.round, "tiny")}
              {live ? <span className="live-tag">Live</span> : stop.status === "next" && g && when(g) ? ` · ${when(g)}` : ""}
            </span>
            <span className="road-opp">vs {main}{score && <> · {score}</>}</span>
            {sub && <span className="road-sub">{sub}</span>}
            <span className="road-val">+{value}{stop.status !== "future" ? " if they win" : ""}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ── Games view ───────────────────────────────────────────────────────────

export function GamesView({ games, owners, names, seeds, me }: Ctx & { me: string }) {
  const ctx = { games, owners, names, seeds };
  const rounds = [2, 3, 4, 5, 6, 7].filter(r => games.some(g => g.round === r));
  const [round, setRound] = useState<number>(() => currentRound(games));
  const inRound = games.filter(g => g.round === round);
  const live = inRound.filter(g => g.game_status === "live");
  const next = inRound.filter(g => !g.winner_team_id && g.game_status !== "live" && g.team_1_id && g.team_2_id)
    .sort((a, b) => (a.start_time_epoch ?? 0) - (b.start_time_epoch ?? 0));
  const waiting = inRound.filter(g => !g.winner_team_id && !(g.team_1_id && g.team_2_id)).length;
  const final = inRound.filter(g => !!g.winner_team_id).sort((a, b) => (b.start_time_epoch ?? 0) - (a.start_time_epoch ?? 0));

  // reader's surviving teams with their road (for the strip above the columns)
  const myTeams = Object.keys(owners).filter(id => owners[id] === me);
  const myRoads = myTeams.map(id => ({ id, stops: teamRoad(games, id) })).filter(r => r.stops.length);

  const column = (key: string, title: string, list: NamedGame[], empty: string) => (
    <section className={`gm-col gm-col-${key}`}>
      <h2 className="gm-col-head">{title}</h2>
      {list.length ? list.map(g => <BoxScore key={g.id} g={g} ctx={ctx} me={me} />) : <p className="gm-empty">{empty}</p>}
    </section>
  );
  const at = rounds.indexOf(round);

  return (
    <div>
      <div className="gm-rounds" role="group" aria-label="Round">
        {rounds.map(r => (
          <button key={r} className={`chip${r === round ? " on" : ""}`} aria-pressed={r === round} onClick={() => setRound(r)}>{roundLabel(r)}</button>
        ))}
      </div>
      <div className="gm-round-step bk-round-step">
        <button aria-label="Earlier round" disabled={at <= 0} onClick={() => setRound(rounds[at - 1])}><Chevron dir="left" size={14} /></button>
        <span className="bk-round-step-label">{roundLabel(round, "long")}</span>
        <button aria-label="Later round" disabled={at >= rounds.length - 1} onClick={() => setRound(rounds[at + 1])}><Chevron dir="right" size={14} /></button>
      </div>
      <div className={`gm-cols${final.length ? "" : " no-final"}`}>
        {myRoads.length > 0 && (
          <section className="gm-col gm-col-mine road-strip">
            <h2 className="gm-col-head">Your games <small>{me}</small></h2>
            {myRoads.map(r => (
              <div key={r.id} className="road-strip-row">
                <span className="road-strip-team">{names[r.id]}</span>
                <Road stops={r.stops.slice(0, 1)} ctx={ctx} teamId={r.id} />
              </div>
            ))}
          </section>
        )}
        {column("live", "Live", live, "Nothing on right now.")}
        {column("next", "Up next", next, waiting ? `${waiting} game${waiting > 1 ? "s" : ""} waiting on earlier results.` : "No games left to play.")}
        {final.length > 0 && column("final", "Final", final, "")}
      </div>
    </div>
  );
}

// ── My path view ─────────────────────────────────────────────────────────

export function PathView({ games, owners, names, seeds, player, players, onPlayer }: Ctx & { player: string; players: string[]; onPlayer: (p: string) => void }) {
  const ctx = { games, owners, names, seeds };
  const teams = Object.keys(owners).filter(id => owners[id] === player);
  const alive = teams.map(id => ({ id, stops: teamRoad(games, id) })).filter(t => t.stops.length);
  const champion = teams.find(id => games.some(g => g.round === 7 && g.winner_team_id === id));
  const out = teams.filter(id => eliminatedIn(games, id) !== null)
    .sort((a, b) => (eliminatedIn(games, b) ?? 0) - (eliminatedIn(games, a) ?? 0));
  const banked = teams.reduce((s, id) => s + bankedPoints(games, id), 0);
  const max = banked + maxRemaining(games, owners, player);

  return (
    <div className="path">
      <div className="path-head">
        <label className="label" htmlFor="path-player">Path for</label>
        <select id="path-player" className="bk-user-select" value={player} onChange={e => onPlayer(e.target.value)}>
          {players.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <span className="path-totals">{banked} pts · max {max}</span>
      </div>
      {champion && <p className="path-champ">{names[champion]} won it all.</p>}
      {alive.length === 0 && !champion && <p className="gm-empty">No teams left on the road.</p>}
      {alive.map(t => (
        <section key={t.id} className="path-team">
          <h2 className="path-team-head">
            {names[t.id]} <small>{seeds[t.id]} seed · +{bankedPoints(games, t.id)} so far</small>
          </h2>
          <Road stops={t.stops} ctx={ctx} teamId={t.id} />
        </section>
      ))}
      {out.length > 0 && (
        <section className="path-out">
          <h2 className="gm-col-head">Out <small>{out.length} team{out.length > 1 ? "s" : ""}</small></h2>
          {out.map(id => (
            <div key={id} className="roster-line out">
              <span className="roster-seed">{seeds[id]}</span>
              <span className="roster-team">{names[id]}</span>
              <span className="roster-out">{outLabel(eliminatedIn(games, id) ?? 2)}</span>
              <span className="roster-pts">{bankedPoints(games, id) ? `+${bankedPoints(games, id)}` : "—"}</span>
            </div>
          ))}
        </section>
      )}
      <p className="lb-key">Points shown are round points; a lower seed winning adds half the seed difference.</p>
    </div>
  );
}

