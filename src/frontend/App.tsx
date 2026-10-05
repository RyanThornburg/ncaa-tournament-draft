// src/App.tsx
//TODO: move shared data to app level or context
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import Tabs from "./Tabs";
import { SEASON_YEAR, TABS, TOURNAMENT_HEAD, TOURNAMENT_SUBHEAD } from "../config";
import { Game, Pick, Team, User } from "../types";
import Draft from "./Draft";
import Leaderboard from "./Leaderboard";
import Bracket from "./Bracket";
import History from "./History";
import Admin from "./Admin";
import LoadError from "./LoadError";
import { setUrlParams, urlParam } from "./url";
import { useAdmin } from "./useAdmin";
import { isPlayer, useMe } from "./useMe";
import { championshipDecided, currentRound, regionOrder, roundLabel } from "./tournament";

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
	return [roundLabel(round, "long"), day].filter(Boolean).join(" · ");
}

// Deep links: ?tab=bracket&view=path&player=Dana. "standings" is the public name for the leaderboard tab.
const TAB_ALIASES: Record<string, string> = { standings: "leaderboard" };
function tabFromUrl(): string | null {
	const t = urlParam("tab");
	if (!t) return null;
	const key = TAB_ALIASES[t] ?? t;
	return [...TABS.map(([k]) => k as string), "admin"].includes(key) ? key : null;
}
function App() {
	const [linkedTab] = useState(tabFromUrl);
	const [tab, setTab] = useState<string>(linkedTab ?? TABS[0][0]);
	// draft night on the screen-share: masthead and tabs fold away (?tab=draft&broadcast=1)
	const [broadcastOn, setBroadcastOn] = useState(() => urlParam("broadcast") === "1");
	function setBroadcast(on: boolean) {
		setBroadcastOn(on);
		setUrlParams({ broadcast: on ? "1" : null });
		window.scrollTo(0, 0);
	}
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

	// quiet reloads (retries) keep the page up instead of swapping it for the spinner
	const load = useCallback(async (quiet = false) => {
		if (!quiet) setLoading(true);
		try {
			// games only feed the masthead, the live marker and region order; the tabs load their own,
			// so a games hiccup never blanks the draft board
			api.getGames().then(setGames).catch(() => {});
			const [u, t, p] = await Promise.all([
				api.getUsers(),
				api.getTeams(),
				api.getPicks(),
			]);
			setUsers(u);
			setTeams(t);
			setPicks(p);
			setError(null);
			if (p.length === 0 && !linkedTab) setTab("draft");
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setLoading(false);
		}
	}, [linkedTab]);

	useEffect(() => { load(); }, [load]);

	// if the pool data failed, keep trying on the same 2-minute beat as everything else
	useEffect(() => {
		if (!error) return;
		const t = setInterval(() => load(true), 2 * 60 * 1000);
		return () => clearInterval(t);
	}, [error, load]);

	// keep game status fresh for the masthead and the nav's live marker
	useEffect(() => {
		const t = setInterval(() => { api.getGames().then(setGames).catch(() => {}); }, 2 * 60 * 1000);
		return () => clearInterval(t);
	}, []);

	const allTabs: readonly (readonly [string, string])[] = [
		...TABS,
		...(isAdmin ? [["admin", "Admin"] as const] : []),
	];

	const bracketUsers = [...new Set(picks.map(p => p.user_name))].sort();
	const bracketUser = bracketChoice ?? (isPlayer(me) && !championshipDecided(games) ? me : "");
	const askWho = me === "" && bracketUsers.length > 0 && tab === "leaderboard";

	// Standings tab shows LIVE while one of the reader's teams is playing (any game, if no reader chosen)
	const liveTeamIds = new Set(games.filter(g => g.game_status === "live").flatMap(g => [g.team_1_id, g.team_2_id]));
	const standingsLive = isPlayer(me)
		? picks.some(p => p.user_name === me && liveTeamIds.has(p.team_id))
		: liveTeamIds.size > 0;

	const broadcast = broadcastOn && tab === "draft";

	function changeTab(next: string) {
		setTab(next);
		// a tab switch starts a fresh link; views and players belong to the tab they were set on
		setUrlParams({ tab: next === TABS[0][0] ? null : next === "leaderboard" ? "standings" : next, view: null, player: null, broadcast: null });
		setBroadcastOn(false);
		window.scrollTo(0, 0);
	}

	return (
		<div className={`app${broadcast ? " broadcast" : ""}`}>
			{broadcast ? (
				<header className="bc-strip">
					<h1 className="bc-title">{TOURNAMENT_HEAD}</h1>
					<span className="bc-sub">Draft night</span>
					<button className="link-btn bc-exit" onClick={() => setBroadcast(false)}>Exit broadcast</button>
				</header>
			) : (
				<>
					<header className="header">
						<h1 className="header-title">{TOURNAMENT_HEAD}</h1>
						<div className="header-sub">
							<span>{TOURNAMENT_SUBHEAD}</span>
							<span>{editionLine(games)}</span>
						</div>
					</header>
					<Tabs tab={tab} setTab={changeTab} tabs={allTabs} live={standingsLive ? ["leaderboard"] : []} />
				</>
			)}

			<main className="page" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
				{/* players, teams and picks feed Draft and Bracket; Standings and History load their own */}
				{error && (tab === "draft" || tab === "bracket") && <LoadError what="the players and picks" detail={error} polls onRetry={() => load(true)} />}
				{askWho && (
					<div className="who">
						<span className="who-q">Who are you?</span>
						<div className="who-names">
							{bracketUsers.map(u => <button key={u} className="who-name" onClick={() => setMe(u)}>{u}</button>)}
							<button className="link-btn" onClick={() => setMe("-")}>Just looking</button>
						</div>
					</div>
				)}
				{loading ? (
					<div className="spinner">Loading…</div>
				) : (
					<>
						{tab === "leaderboard" && <Leaderboard me={me} fallbackOwners={Object.fromEntries(picks.map(p => [p.team_id, p.user_name]))} onChangeMe={() => setMe("")} onOpenGames={() => { changeTab("bracket"); setUrlParams({ view: "games" }); }} />}
						{tab === "draft" && !error && <Draft teams={teams} users={users} isAdmin={isAdmin} regionOrder={rs => regionOrder(games, rs)} tournamentRound={currentRound(games)} me={isPlayer(me) ? me : ""} broadcast={broadcast} onBroadcast={setBroadcast} />}
						{tab === "bracket" && !error && <Bracket selectedUser={bracketUser} onSelectUser={setBracketUser} players={bracketUsers} me={me} />}
						{tab === "history" && <History me={isPlayer(me) ? me : ""} />}
						{tab === "admin" && isAdmin && <Admin started={games.some(g => !!g.winner_team_id)} decided={championshipDecided(games)} />}
					</>
				)}
			</main>
		</div>
	);
}

export default App;
