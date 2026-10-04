// src/App.tsx
//TODO: move shared data to app level or context
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import Tabs from "./Tabs";
import { ROUND_NAMES, SEASON_YEAR, TABS, TOURNAMENT_HEAD, TOURNAMENT_SUBHEAD } from "../config";
import { Game, Pick, Team, User } from "../types";
import Draft from "./Draft";
import Leaderboard from "./Leaderboard";
import Bracket from "./Bracket";
import History from "./History";
import Admin from "./Admin";
import { useAdmin } from "./useAdmin";
import { isPlayer, useMe } from "./useMe";

// Masthead edition line: the round being played (first round with an unfinished game) and its day
function editionLine(games: Game[]): string {
	const open = games.filter(g => g.team_1_id && g.team_2_id && g.game_status !== "final" && g.game_status !== "forfeit");
	if (games.length === 0) return `${SEASON_YEAR}`;
	if (open.length === 0) return `${SEASON_YEAR} · Final`;
	const round = Math.min(...open.map(g => g.round));
	const live = open.find(g => g.round === round && g.game_status === "live");
	const next = open.filter(g => g.round === round && g.start_time_epoch).sort((a, b) => a.start_time_epoch! - b.start_time_epoch!)[0];
	const epoch = live ? Date.now() / 1000 : next?.start_time_epoch;
	const day = epoch ? new Date(epoch * 1000).toLocaleDateString("en-US", { weekday: "short" }) : "";
	return [ROUND_NAMES[round - 2] ?? "", day].filter(Boolean).join(" · ");
}

function App() {
	const [tab, setTab] = useState<string>(TABS[0][0]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [users, setUsers] = useState<User[]>([]);
  	const [teams, setTeams] = useState<Team[]>([]);
	const [picks, setPicks] = useState<Pick[]>([]);
	const [games, setGames] = useState<Game[]>([]);
	// null = follow the reader ("me"); "" = nobody highlighted
	const [bracketChoice, setBracketUser] = useState<string | null>(null);
	const [me, setMe] = useMe();

	const { isAdmin } = useAdmin();

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [u, t, p, g] = await Promise.all([
				api.getUsers(),
				api.getTeams(),
				api.getPicks(),
				api.getGames(),
			]);
			setGames(g);
			setUsers(u);
			setTeams(t);
			setPicks(p);
			if (p.length === 0){
				setTab(TABS[1][0])
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	const allTabs: readonly (readonly [string, string])[] = [
		...TABS,
		...(isAdmin ? [["admin", "Admin"] as const] : []),
	];

	const bracketUsers = [...new Set(picks.map(p => p.user_name))].sort();
	const bracketUser = bracketChoice ?? (isPlayer(me) ? me : "");
	const askWho = me === "" && bracketUsers.length > 0 && (tab === "leaderboard" || tab === "bracket");

	return (
		<div className="app">
			<header className="header">
				<h1 className="header-title">{TOURNAMENT_HEAD}</h1>
				<div className="header-sub">
					<span>{TOURNAMENT_SUBHEAD}</span>
					<span>{editionLine(games)}</span>
				</div>
			</header>
			<Tabs tab={tab} setTab={setTab} tabs={allTabs} />

			<main className="page" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
				{error && <div className="error-banner">Couldn't load the pool ({error}). Refresh to try again.</div>}
				{askWho && (
					<div className="who">
						<span className="who-q">Who are you?</span>
						<div className="who-names">
							{bracketUsers.map(u => <button key={u} className="who-name" onClick={() => setMe(u)}>{u}</button>)}
							<button className="link-btn" onClick={() => setMe("-")}>Just looking</button>
						</div>
					</div>
				)}
				{tab === "bracket" && !loading && bracketUsers.length > 0 && (
					<div className="bk-toolbar">
						<span className="label">Highlight</span>
						<select
							className="bk-user-select"
							aria-label="Highlight a player's teams"
							value={bracketUser}
							onChange={e => setBracketUser(e.target.value)}
						>
							<option value="">Nobody</option>
							{bracketUsers.map(u => <option key={u} value={u}>{u}</option>)}
						</select>
						{bracketUser && (
							<button className="bk-user-clear" onClick={() => setBracketUser("")}>Clear</button>
						)}
					</div>
				)}
				{loading ? (
					<div className="spinner">Loading…</div>
				) : (
					<>
						{tab === "leaderboard" && <Leaderboard me={me} onChangeMe={() => setMe("")} />}
						{tab === "draft" && <Draft teams={teams} users={users} isAdmin={isAdmin} />}
						{tab === "bracket" && <Bracket selectedUser={bracketUser} me={me} />}
						{tab === "history" && <History />}
						{tab === "admin" && isAdmin && <Admin />}
					</>
				)}
			</main>
		</div>
	);
}

export default App;
