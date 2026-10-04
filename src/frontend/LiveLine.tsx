import { Game } from "../types";

interface LiveGame extends Game {
    team_1_name?: string | null;
    team_2_name?: string | null;
}

// One line of in-progress scores with each team's owner; renders nothing when no game is live.
export default function LiveLine({ games, owners, me }: { games: LiveGame[]; owners: Record<string, string>; me?: string }) {
    const live = games.filter(g => g.game_status === "live");
    if (live.length === 0) return null;
    const team = (id: string | null, name: string | null | undefined, score: number | null) => {
        const owner = id ? owners[id] : undefined;
        return (
            <>
                {name}
                {owner && <span className={`live-owner${owner === me ? " mine" : ""}`}> ({owner})</span>}
                {" "}{score ?? 0}
            </>
        );
    };
    return (
        <div className="live-line">
            <span className="live-tag">Live</span>
            {live.map(g => (
                <span key={g.id} className="live-game">
                    {team(g.team_1_id, g.team_1_name, g.team_1_score)} · {team(g.team_2_id, g.team_2_name, g.team_2_score)}
                </span>
            ))}
        </div>
    );
}
