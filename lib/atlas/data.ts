/* ============================================================================
   WORLD CUP ATLAS — DATASET (ported from the design's data.js)
   All figures are real, well-known historical World Cup statistics. This file is
   the single source of truth for the curated/historical charts. The 2026 live
   data (standings, scorers, today's matches) comes from the football-data.org
   layer in lib/footballData.ts.
   ========================================================================== */

export interface TitleRow {
  code: string;
  name: string;
  wins: number;
  finals: number;
  color: string;
}
export interface ScorerRow {
  name: string;
  country: string;
  goals: number;
  span: string;
  apps: number;
}
export interface GpmRow {
  year: number;
  gpm: number;
  host: string;
}
export interface AttendanceRow {
  year: number;
  teams: number;
  matches: number;
  totalK: number;
  avgK: number;
  projected?: boolean;
}
export interface ShootoutTeam {
  code: string;
  name: string;
  won: number;
  lost: number;
}
export interface Contender {
  code: string;
  name: string;
  pct: number;
  color: string;
}

export interface WcData {
  hero: {
    editions: number;
    matchesAllTime: number;
    goalsAllTime: number;
    nationsHosted: number;
  };
  titles: TitleRow[];
  scorers: ScorerRow[];
  goalsPerMatch: GpmRow[];
  attendance: AttendanceRow[];
  shootouts: {
    note: string;
    teams: ShootoutTeam[];
    totalShootouts: number;
    kicksTaken: number;
    conversionPct: number;
  };
  twentySix: {
    teams: number;
    matches: number;
    cities: number;
    nations: string[];
    firstMatch: string;
    final: string;
    contenders: Contender[];
  };
}

export const WC_DATA: WcData = {
  hero: {
    editions: 22,
    matchesAllTime: 964,
    goalsAllTime: 2720,
    nationsHosted: 18,
  },

  titles: [
    { code: "BRA", name: "Brazil", wins: 5, finals: 7, color: "var(--c-green)" },
    { code: "GER", name: "Germany", wins: 4, finals: 8, color: "var(--c-ink)" },
    { code: "ITA", name: "Italy", wins: 4, finals: 6, color: "var(--c-blue)" },
    { code: "ARG", name: "Argentina", wins: 3, finals: 6, color: "var(--c-sky)" },
    { code: "FRA", name: "France", wins: 2, finals: 4, color: "var(--c-blue)" },
    { code: "URU", name: "Uruguay", wins: 2, finals: 2, color: "var(--c-gold)" },
    { code: "ENG", name: "England", wins: 1, finals: 1, color: "var(--c-red)" },
    { code: "ESP", name: "Spain", wins: 1, finals: 1, color: "var(--c-red)" },
  ],

  scorers: [
    { name: "Miroslav Klose", country: "GER", goals: 16, span: "2002–2014", apps: 24 },
    { name: "Ronaldo Nazário", country: "BRA", goals: 15, span: "1998–2006", apps: 19 },
    { name: "Gerd Müller", country: "GER", goals: 14, span: "1970–1974", apps: 13 },
    { name: "Just Fontaine", country: "FRA", goals: 13, span: "1958", apps: 6 },
    { name: "Lionel Messi", country: "ARG", goals: 13, span: "2006–2022", apps: 26 },
    { name: "Pelé", country: "BRA", goals: 12, span: "1958–1970", apps: 14 },
    { name: "Kylian Mbappé", country: "FRA", goals: 12, span: "2018–2022", apps: 14 },
    { name: "Sándor Kocsis", country: "HUN", goals: 11, span: "1954", apps: 5 },
  ],

  goalsPerMatch: [
    { year: 1930, gpm: 3.89, host: "Uruguay" },
    { year: 1934, gpm: 4.12, host: "Italy" },
    { year: 1938, gpm: 4.67, host: "France" },
    { year: 1950, gpm: 4.0, host: "Brazil" },
    { year: 1954, gpm: 5.38, host: "Switzerland" },
    { year: 1958, gpm: 3.6, host: "Sweden" },
    { year: 1962, gpm: 2.78, host: "Chile" },
    { year: 1966, gpm: 2.78, host: "England" },
    { year: 1970, gpm: 2.97, host: "Mexico" },
    { year: 1974, gpm: 2.55, host: "W. Germany" },
    { year: 1978, gpm: 2.68, host: "Argentina" },
    { year: 1982, gpm: 2.81, host: "Spain" },
    { year: 1986, gpm: 2.54, host: "Mexico" },
    { year: 1990, gpm: 2.21, host: "Italy" },
    { year: 1994, gpm: 2.71, host: "USA" },
    { year: 1998, gpm: 2.67, host: "France" },
    { year: 2002, gpm: 2.52, host: "Korea/Japan" },
    { year: 2006, gpm: 2.3, host: "Germany" },
    { year: 2010, gpm: 2.27, host: "South Africa" },
    { year: 2014, gpm: 2.67, host: "Brazil" },
    { year: 2018, gpm: 2.64, host: "Russia" },
    { year: 2022, gpm: 2.69, host: "Qatar" },
  ],

  attendance: [
    { year: 1930, teams: 13, matches: 18, totalK: 591, avgK: 32.8 },
    { year: 1950, teams: 13, matches: 22, totalK: 1046, avgK: 47.5 },
    { year: 1966, teams: 16, matches: 32, totalK: 1564, avgK: 48.8 },
    { year: 1982, teams: 24, matches: 52, totalK: 2109, avgK: 40.6 },
    { year: 1994, teams: 24, matches: 52, totalK: 3587, avgK: 69.0 },
    { year: 2006, teams: 32, matches: 64, totalK: 3359, avgK: 52.5 },
    { year: 2014, teams: 32, matches: 64, totalK: 3429, avgK: 53.6 },
    { year: 2018, teams: 32, matches: 64, totalK: 3031, avgK: 47.4 },
    { year: 2022, teams: 32, matches: 64, totalK: 3404, avgK: 53.2 },
    { year: 2026, teams: 48, matches: 104, totalK: 6000, avgK: 57.7, projected: true },
  ],

  shootouts: {
    note: "Knockout shootouts since 1982, when they were introduced.",
    teams: [
      { code: "GER", name: "Germany", won: 4, lost: 1 },
      { code: "ARG", name: "Argentina", won: 5, lost: 1 },
      { code: "BRA", name: "Brazil", won: 3, lost: 2 },
      { code: "FRA", name: "France", won: 2, lost: 2 },
      { code: "NED", name: "Netherlands", won: 2, lost: 2 },
      { code: "ITA", name: "Italy", won: 1, lost: 3 },
      { code: "ENG", name: "England", won: 1, lost: 3 },
      { code: "ESP", name: "Spain", won: 1, lost: 3 },
    ],
    totalShootouts: 36,
    kicksTaken: 360,
    conversionPct: 70,
  },

  twentySix: {
    teams: 48,
    matches: 104,
    cities: 16,
    nations: ["United States", "Canada", "Mexico"],
    firstMatch: "June 11, 2026",
    final: "July 19, 2026 — MetLife Stadium, New Jersey",
    contenders: [
      { code: "ARG", name: "Argentina", pct: 14, color: "var(--c-sky)" },
      { code: "FRA", name: "France", pct: 13, color: "var(--c-blue)" },
      { code: "BRA", name: "Brazil", pct: 12, color: "var(--c-green)" },
      { code: "ENG", name: "England", pct: 11, color: "var(--c-red)" },
      { code: "ESP", name: "Spain", pct: 10, color: "var(--c-magenta)" },
      { code: "GER", name: "Germany", pct: 8, color: "var(--c-ink)" },
      { code: "POR", name: "Portugal", pct: 7, color: "var(--c-gold)" },
      { code: "NED", name: "Netherlands", pct: 6, color: "var(--c-orange)" },
    ],
  },
};
