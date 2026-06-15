// Realistic mock dataset for DEMO MODE (no API token configured yet).
// Groups A and D use the VERIFIED 2026 draw; groups B and C are illustrative so the
// UI has enough to render. Everything served from here is flagged demo:true in the
// envelope, and is replaced by real data the moment FOOTBALL_DATA_TOKEN is set.

import type {
  CompetitionMeta,
  GroupStanding,
  Match,
  Scorer,
  TeamRef,
  TeamSummary,
} from "@/lib/types/models";

export const mockCompetition: CompetitionMeta = {
  currentMatchday: 1,
  seasonStart: "2026-06-11",
  seasonEnd: "2026-07-19",
};

function t(id: number, name: string, tla: string): TeamRef {
  return { id, name, tla, crest: null };
}

// --- Teams (id, name in API's English, tla) ---
const MEX = t(1, "Mexico", "MEX");
const RSA = t(2, "South Africa", "RSA");
const KOR = t(3, "South Korea", "KOR");
const CZE = t(4, "Czechia", "CZE");

const USA = t(5, "United States", "USA");
const PAR = t(6, "Paraguay", "PAR");
const AUS = t(7, "Australia", "AUS");
const TUR = t(8, "Turkey", "TUR");

const ARG = t(9, "Argentina", "ARG");
const NGA = t(10, "Ghana", "GHA");
const JPN = t(11, "Japan", "JPN");
const NOR = t(12, "Norway", "NOR");

const BRA = t(13, "Brazil", "BRA");
const MAR = t(14, "Morocco", "MAR");
const CRO = t(15, "Croatia", "CRO");
const SUI = t(16, "Switzerland", "SUI");

// Stable "today" anchor for demo kickoffs (tournament window, June 2026).
const DAY = "2026-06-15";

function iso(time: string): string {
  return `${DAY}T${time}:00Z`;
}

export const mockLiveMatches: Match[] = [
  {
    id: 90001,
    utcDate: iso("17:00"),
    status: "IN_PLAY",
    minute: 63,
    stage: "GROUP_STAGE",
    group: "Group A",
    matchday: 2,
    home: MEX,
    away: KOR,
    score: { home: 2, away: 1 },
    halfTime: { home: 1, away: 1 },
    winner: null,
    venue: "Estadio Ciudad de México",
  },
  {
    id: 90002,
    utcDate: iso("18:00"),
    status: "PAUSED",
    minute: 45,
    stage: "GROUP_STAGE",
    group: "Group D",
    matchday: 2,
    home: USA,
    away: AUS,
    score: { home: 0, away: 0 },
    halfTime: { home: 0, away: 0 },
    winner: null,
    venue: "SoFi Stadium, Los Ángeles",
  },
  {
    id: 90003,
    utcDate: iso("14:00"),
    status: "FINISHED",
    minute: null,
    stage: "GROUP_STAGE",
    group: "Group B",
    matchday: 2,
    home: ARG,
    away: JPN,
    score: { home: 3, away: 1 },
    halfTime: { home: 1, away: 0 },
    winner: "HOME_TEAM",
    venue: "MetLife Stadium, Nueva Jersey",
  },
  {
    id: 90004,
    utcDate: iso("21:00"),
    status: "TIMED",
    minute: null,
    stage: "GROUP_STAGE",
    group: "Group C",
    matchday: 2,
    home: BRA,
    away: CRO,
    score: { home: null, away: null },
    halfTime: null,
    winner: null,
    venue: "BC Place, Vancouver",
  },
  {
    id: 90005,
    utcDate: iso("23:30"),
    status: "TIMED",
    minute: null,
    stage: "GROUP_STAGE",
    group: "Group D",
    matchday: 2,
    home: PAR,
    away: TUR,
    score: { home: null, away: null },
    halfTime: null,
    winner: null,
    venue: "BMO Field, Toronto",
  },
];

function row(
  position: number,
  team: TeamRef,
  w: number,
  d: number,
  l: number,
  gf: number,
  ga: number,
  form: string,
): GroupStanding["rows"][number] {
  const played = w + d + l;
  return {
    position,
    team,
    played,
    won: w,
    draw: d,
    lost: l,
    goalsFor: gf,
    goalsAgainst: ga,
    goalDifference: gf - ga,
    points: w * 3 + d,
    form,
  };
}

export const mockStandings: GroupStanding[] = [
  {
    group: "Group A",
    rows: [
      row(1, MEX, 1, 0, 0, 2, 0, "W"),
      row(2, RSA, 1, 0, 0, 1, 0, "W"),
      row(3, KOR, 0, 0, 1, 0, 1, "L"),
      row(4, CZE, 0, 0, 1, 0, 2, "L"),
    ],
  },
  {
    group: "Group B",
    rows: [
      row(1, ARG, 1, 0, 0, 3, 1, "W"),
      row(2, NOR, 1, 0, 0, 2, 1, "W"),
      row(3, NGA, 0, 0, 1, 1, 2, "L"),
      row(4, JPN, 0, 0, 1, 1, 3, "L"),
    ],
  },
  {
    group: "Group C",
    rows: [
      row(1, BRA, 1, 0, 0, 2, 0, "W"),
      row(2, CRO, 0, 1, 0, 1, 1, "D"),
      row(3, SUI, 0, 1, 0, 1, 1, "D"),
      row(4, MAR, 0, 0, 1, 0, 2, "L"),
    ],
  },
  {
    group: "Group D",
    rows: [
      row(1, USA, 0, 1, 0, 1, 1, "D"),
      row(2, PAR, 0, 1, 0, 1, 1, "D"),
      row(3, AUS, 0, 1, 0, 0, 0, "D"),
      row(4, TUR, 0, 1, 0, 0, 0, "D"),
    ],
  },
];

export const mockScorers: Scorer[] = [
  { rank: 1, player: "Santiago Giménez", team: MEX, goals: 3, assists: 1, penalties: 0, playedMatches: 2 },
  { rank: 2, player: "Lionel Messi", team: ARG, goals: 2, assists: 2, penalties: 1, playedMatches: 2 },
  { rank: 3, player: "Christian Pulisic", team: USA, goals: 2, assists: 0, penalties: 0, playedMatches: 2 },
  { rank: 4, player: "Vinícius Júnior", team: BRA, goals: 2, assists: 1, penalties: 0, playedMatches: 1 },
  { rank: 5, player: "Erling Haaland", team: NOR, goals: 2, assists: 0, penalties: 1, playedMatches: 1 },
  { rank: 6, player: "Son Heung-min", team: KOR, goals: 1, assists: 1, penalties: 0, playedMatches: 1 },
  { rank: 7, player: "Hirving Lozano", team: MEX, goals: 1, assists: 2, penalties: 0, playedMatches: 2 },
  { rank: 8, player: "Kerem Aktürkoğlu", team: TUR, goals: 1, assists: 0, penalties: 0, playedMatches: 1 },
];

export const mockTeams: TeamSummary[] = [
  MEX, RSA, KOR, CZE, USA, PAR, AUS, TUR,
  ARG, NGA, JPN, NOR, BRA, MAR, CRO, SUI,
].map((x) => ({ id: x.id ?? 0, name: x.name, tla: x.tla, crest: x.crest }));

export const mockFixtures: Match[] = [
  ...mockLiveMatches,
  {
    id: 90010,
    utcDate: "2026-06-16T17:00:00Z",
    status: "SCHEDULED",
    minute: null,
    stage: "GROUP_STAGE",
    group: "Group A",
    matchday: 3,
    home: RSA,
    away: CZE,
    score: { home: null, away: null },
    halfTime: null,
    winner: null,
    venue: "Estadio Akron, Guadalajara",
  },
  {
    id: 90011,
    utcDate: "2026-06-16T20:00:00Z",
    status: "SCHEDULED",
    minute: null,
    stage: "GROUP_STAGE",
    group: "Group B",
    matchday: 3,
    home: NOR,
    away: NGA,
    score: { home: null, away: null },
    halfTime: null,
    winner: null,
    venue: "Estadio BBVA, Monterrey",
  },
];
