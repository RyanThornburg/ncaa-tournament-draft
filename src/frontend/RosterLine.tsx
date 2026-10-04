// eliminated_round: 2=R64, 3=R32, 4=S16, 5=E8, 6=F4, 7=Championship
const OUT_LABELS: Record<number, string> = { 2: "R64", 3: "R32", 4: "S16", 5: "E8", 6: "F4", 7: "Final" };

export interface LiveScore {
    mine: number;
    theirs: number;
    opponent: string;
    winValue: number;
}

interface RosterLineProps {
    seed: number;
    teamName: string;
    points: number;
    eliminated: boolean;
    eliminatedRound?: number | null;
    live?: LiveScore | null;
}

export default function RosterLine({ seed, teamName, points, eliminated, eliminatedRound, live }: RosterLineProps) {
    const outLabel = eliminatedRound ? OUT_LABELS[eliminatedRound] ?? "" : "";
    return (
        <div className={`roster-line${eliminated ? " out" : ""}${live ? " playing" : ""}`}>
            <span className="roster-seed">{seed}</span>
            <span className="roster-team">
                {teamName}
                {live && (
                    <span className="roster-live">
                        <span className="live-tag">Live</span> {live.mine}–{live.theirs} vs {live.opponent}
                        <span className="roster-stake">+{live.winValue} if they win</span>
                    </span>
                )}
            </span>
            <span className="roster-out">
                {eliminated && <><span className="sr-only">eliminated </span>{outLabel ? <><span className="sr-only">in </span>{outLabel}</> : "Out"}</>}
            </span>
            <span className="roster-pts">{points > 0 ? `+${points}` : <span aria-label="no points">—</span>}</span>
        </div>
    );
}
