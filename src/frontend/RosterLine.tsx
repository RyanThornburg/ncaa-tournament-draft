// eliminated_round: 2=R64, 3=R32, 4=S16, 5=E8, 6=F4, 7=Championship
const OUT_LABELS: Record<number, string> = { 2: "R64", 3: "R32", 4: "S16", 5: "E8", 6: "F4", 7: "Final" };

interface RosterLineProps {
    seed: number;
    teamName: string;
    points: number;
    eliminated: boolean;
    eliminatedRound?: number | null;
}

export default function RosterLine({ seed, teamName, points, eliminated, eliminatedRound }: RosterLineProps) {
    return (
        <div className={`roster-line${eliminated ? " out" : ""}`}>
            <span className="roster-seed">{seed}</span>
            <span className="roster-team"><span>{teamName}</span></span>
            <span className="roster-out">{eliminated ? (eliminatedRound ? OUT_LABELS[eliminatedRound] ?? "Out" : "Out") : ""}</span>
            <span className="roster-pts">+{points}</span>
        </div>
    );
}
