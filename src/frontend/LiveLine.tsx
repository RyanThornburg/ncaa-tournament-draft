import { Game } from "../types";

interface LiveGame extends Game {
    team_1_name?: string | null;
    team_2_name?: string | null;
}

// One line of in-progress scores; renders nothing when no game is live.
export default function LiveLine({ games }: { games: LiveGame[] }) {
    const live = games.filter(g => g.game_status === "live");
    if (live.length === 0) return null;
    return (
        <div className="live-line">
            <span className="live-tag">Live</span>
            {live.map(g => (
                <span key={g.id} className="live-game">
                    {g.team_1_name} {g.team_1_score ?? 0} · {g.team_2_name} {g.team_2_score ?? 0}
                </span>
            ))}
        </div>
    );
}
