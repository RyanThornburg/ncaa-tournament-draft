// Draft search that finds teams by the names people say out loud on the call:
// "Colorado State" for Colorado St., "Saint John's" for St. John's, "Connecticut" for UConn.

const clean = (s: string) => s.toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’.()]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// what the feed abbreviates, spelled out (keys are clean() names)
const ALIASES: Record<string, string[]> = {
    "uconn": ["connecticut"],
    "unc wilmington": ["north carolina wilmington", "uncw"],
    "unc asheville": ["north carolina asheville"],
    "unc greensboro": ["north carolina greensboro", "uncg"],
    "north carolina": ["unc", "carolina"],
    "nc state": ["north carolina state"],
    "ole miss": ["mississippi"],
    "byu": ["brigham young"],
    "vcu": ["virginia commonwealth"],
    "lsu": ["louisiana state"],
    "tcu": ["texas christian"],
    "smu": ["southern methodist"],
    "usc": ["southern california", "southern cal"],
    "ucf": ["central florida"],
    "ucla": ["california los angeles"],
    "uc san diego": ["ucsd", "california san diego"],
    "uc irvine": ["uci", "california irvine"],
    "uc santa barbara": ["ucsb", "california santa barbara"],
    "siu edwardsville": ["siue", "southern illinois edwardsville"],
    "unlv": ["nevada las vegas"],
    "utep": ["texas el paso"],
    "texas a and m": ["tamu", "texas am"],
    "fau": ["florida atlantic"],
    "fgcu": ["florida gulf coast"],
    "etsu": ["east tennessee state"],
    "liu": ["long island"],
    "vmi": ["virginia military"],
    "uab": ["alabama birmingham"],
    "umbc": ["maryland baltimore county"],
    "miami fl": ["miami"],
    "miami oh": ["miami ohio"],
    "pitt": ["pittsburgh"],
    "penn": ["pennsylvania"],
};

/** Every spelling a team answers to: as listed, "St." read as State (at the end) or Saint (elsewhere), plus aliases. */
export function searchNames(name: string): string[] {
    const base = clean(name);
    const words = base.split(" ");
    const expanded = words.map((w, i) => (w === "st" ? (i === words.length - 1 ? "state" : "saint") : w)).join(" ");
    return [...new Set([base, expanded, ...(ALIASES[base] ?? [])])];
}

/** True when the query (in any of those spellings) appears in the team's name. */
export function teamMatches(name: string, query: string): boolean {
    const q = clean(query);
    if (!q) return true;
    // the query can say "st" too ("st marys"): try it as Saint and as State as well
    const qs = /\bst\b/.test(q) ? [q, q.replace(/\bst\b/g, "saint"), q.replace(/\bst\b/g, "state")] : [q];
    const names = searchNames(name);
    return qs.some(v => names.some(n => n.includes(v)));
}
