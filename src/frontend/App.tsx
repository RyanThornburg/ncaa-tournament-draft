// src/App.tsx
//TODO: move shared data to app level or context
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import Tabs from "./Tabs";
import { TABS, TOURNAMENT_HEAD, TOURNAMENT_SUBHEAD } from "../config";
import { Pick, Team, User } from "../types";
import Draft from "./Draft";
import Leaderboard from "./Leaderboard";
import Bracket from "./Bracket";
import History from "./History";
import Admin from "./Admin";
import { useAdmin } from "./useAdmin";

function App() {
	const [tab, setTab] = useState<string>(TABS[0][0]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [users, setUsers] = useState<User[]>([]);
  	const [teams, setTeams] = useState<Team[]>([]);
	const [picks, setPicks] = useState<Pick[]>([]);
	const [bracketUser, setBracketUser] = useState<string>("");

	const { isAdmin } = useAdmin();

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [u, t, p] = await Promise.all([
				api.getUsers(),
				api.getTeams(),
				api.getPicks(),
			]);
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

	return (
		<>
			<div className="app">
				<div className="header">
					<div>
						<div className="header-title">{TOURNAMENT_HEAD}</div>
						<div className="header-subtitle">{TOURNAMENT_SUBHEAD}</div>
					</div>
					<div className="header-right">
						{tab === "bracket" && !loading && bracketUsers.length > 0 && (
							<div className="bk-user-select-wrap">
								<select
									className="bk-user-select"
									value={bracketUser}
									onChange={e => setBracketUser(e.target.value)}
								>
									<option value="">Highlight player…</option>
									{bracketUsers.map(u => <option key={u} value={u}>{u}</option>)}
								</select>
								{bracketUser && (
									<button className="bk-user-clear" onClick={() => setBracketUser("")}>✕</button>
								)}
							</div>
						)}
						<Tabs tab={tab} setTab={setTab} tabs={allTabs} />
					</div>
				</div>

				{error && <div className="error-banner">{error}</div>}
				{loading ? (
					<div className="spinner">Loading…</div>
				) : (
					<>
						{tab === "leaderboard" && <Leaderboard />}
						{tab === "draft" && <Draft teams={teams} users={users} isAdmin={isAdmin} />}
						{tab === "bracket" && <Bracket selectedUser={bracketUser} />}
						{tab === "history" && <History />}
						{tab === "admin" && isAdmin && <Admin />}
					</>
				)
				}

			</div>

		</>
	);
}

export default App;
