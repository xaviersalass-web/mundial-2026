// Normalized UI models for the World Cup 2026 page.
// The API proxy maps football-data.org's raw v4 shapes (or mock data) into these,
// so the frontend and the mock dataset speak ONE stable language.

export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "SUSPENDED"
  | "POSTPONED"
  | "CANCELLED"
  | "AWARDED";

export type Winner = "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;

// football-data.org v4 stages used by the World Cup.
export type Stage =
  | "GROUP_STAGE"
  | "LAST_32"
  | "LAST_16"
  | "QUARTER_FINALS"
  | "SEMI_FINALS"
  | "THIRD_PLACE"
  | "FINAL";

export interface TeamRef {
  id: number | null;
  name: string;
  /** Three-letter abbreviation, e.g. "MEX". May be null on the free tier. */
  tla: string | null;
  /** Crest image URL. May be null. */
  crest: string | null;
}

export interface MatchScore {
  home: number | null;
  away: number | null;
}

export interface Match {
  id: number;
  /** ISO UTC kickoff time. */
  utcDate: string;
  status: MatchStatus;
  /** Live minute while IN_PLAY/PAUSED; null otherwise. */
  minute: number | null;
  stage: Stage | string;
  /** "Group A".."Group L" during the group stage; null in knockout. */
  group: string | null;
  matchday: number | null;
  home: TeamRef;
  away: TeamRef;
  /** Current/full-time score. */
  score: MatchScore;
  halfTime: MatchScore | null;
  winner: Winner;
  venue: string | null;
}

export interface StandingRow {
  position: number;
  team: TeamRef;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  /** e.g. "W,W,D,L,W"; null if unavailable. */
  form: string | null;
}

export interface GroupStanding {
  /** "Group A".."Group L". */
  group: string;
  rows: StandingRow[];
}

export interface Scorer {
  rank: number;
  player: string;
  team: TeamRef;
  goals: number;
  assists: number | null;
  penalties: number | null;
  playedMatches: number | null;
}

export interface TeamSummary {
  id: number;
  name: string;
  tla: string | null;
  crest: string | null;
}

export interface CompetitionMeta {
  /** Current matchday (1–3 during groups). */
  currentMatchday: number | null;
  /** ISO date of the tournament's first match. */
  seasonStart: string;
  /** ISO date of the final. */
  seasonEnd: string;
}

/**
 * Every API route returns this envelope so the UI can render honest status:
 * - demo:    serving mock data because no API token is configured yet.
 * - delayed: free tier — live scores are delayed (badge "Datos en vivo demorados").
 * - stale:   upstream rate-limited (429); showing the last good/cached value.
 */
export interface ApiEnvelope<T> {
  data: T;
  demo: boolean;
  delayed: boolean;
  stale: boolean;
  updatedAt: string; // ISO timestamp of this response
  error?: string;
}
