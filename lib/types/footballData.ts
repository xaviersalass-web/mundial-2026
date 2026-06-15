// Minimal raw shapes for the football-data.org v4 endpoints we consume.
// Only the fields the UI actually uses are typed; everything else is ignored.
// Docs: https://docs.football-data.org/general/v4/

export interface FdArea {
  id: number;
  name: string;
  code?: string;
  flag?: string | null;
}

export interface FdTeam {
  id: number | null;
  name: string | null;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
}

export interface FdScoreSide {
  home: number | null;
  away: number | null;
}

export interface FdScore {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  duration?: string;
  fullTime: FdScoreSide;
  halfTime: FdScoreSide;
}

export interface FdMatch {
  id: number;
  utcDate: string;
  status: string;
  minute?: number | null;
  injuryTime?: number | null;
  stage: string;
  group: string | null;
  matchday?: number | null;
  homeTeam: FdTeam;
  awayTeam: FdTeam;
  score: FdScore;
  venue?: string | null;
}

export interface FdMatchesResponse {
  filters?: Record<string, unknown>;
  resultSet?: { count: number; first?: string; last?: string };
  competition?: { id: number; name: string; code: string };
  matches: FdMatch[];
}

export interface FdSingleMatchResponse {
  // /v4/matches/{id} returns a match-ish object; we normalize the common fields.
  id: number;
  utcDate: string;
  status: string;
  minute?: number | null;
  stage: string;
  group?: string | null;
  matchday?: number | null;
  homeTeam: FdTeam;
  awayTeam: FdTeam;
  score: FdScore;
  venue?: string | null;
}

export interface FdTableEntry {
  position: number;
  team: FdTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string | null;
}

export interface FdStanding {
  stage: string;
  type: string; // "TOTAL" | "HOME" | "AWAY"
  group: string | null;
  table: FdTableEntry[];
}

export interface FdStandingsResponse {
  competition?: { id: number; name: string; code: string };
  season?: FdSeason;
  standings: FdStanding[];
}

export interface FdScorerEntry {
  player: { id: number; name: string; nationality?: string | null };
  team: FdTeam;
  playedMatches?: number | null;
  goals: number | null;
  assists?: number | null;
  penalties?: number | null;
}

export interface FdScorersResponse {
  competition?: { id: number; name: string; code: string };
  scorers: FdScorerEntry[];
}

export interface FdSeason {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday?: number | null;
}

export interface FdTeamsResponse {
  count?: number;
  competition?: { id: number; name: string; code: string };
  season?: FdSeason;
  teams: FdTeam[];
}

export interface FdCompetitionResponse {
  id: number;
  name: string;
  code: string;
  currentSeason?: FdSeason;
}
