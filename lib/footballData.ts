// Server-only football-data.org v4 client.
// The browser NEVER calls this — it goes through /api/* route handlers, which keep
// the token server-side and let Next's Data Cache dedupe upstream calls so we stay
// under the free tier's 10 req/min even with many concurrent visitors.

import type {
  FdMatch,
  FdMatchesResponse,
  FdScorerEntry,
  FdScorersResponse,
  FdSingleMatchResponse,
  FdStanding,
  FdStandingsResponse,
  FdTableEntry,
  FdTeam,
  FdTeamsResponse,
} from "@/lib/types/footballData";
import type { FdCompetitionResponse } from "@/lib/types/footballData";
import type {
  CompetitionMeta,
  GroupStanding,
  Match,
  MatchStatus,
  Scorer,
  StandingRow,
  Stage,
  TeamRef,
  TeamSummary,
  Winner,
} from "@/lib/types/models";

export const FD_BASE = "https://api.football-data.org/v4";
export const COMPETITION = "WC"; // FIFA World Cup

const TOKEN = process.env.FOOTBALL_DATA_TOKEN;
/** Optionally pin the edition (e.g. "2026") if the default ever resolves wrong. */
const SEASON = process.env.FOOTBALL_DATA_SEASON;

/** No token yet → serve realistic mock data so the app is demonstrable. */
export const DEMO_MODE = !TOKEN;

/**
 * Free tier delivers delayed scores. When the account is upgraded to a livescores
 * plan, set FOOTBALL_DATA_LIVESCORES=true and the "delayed" badge disappears.
 * No code or architecture change needed — just the env var + the token.
 */
export const LIVE_DELAYED = process.env.FOOTBALL_DATA_LIVESCORES !== "true";

export class FdError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message ?? `football-data ${status}`);
    this.status = status;
    this.name = "FdError";
  }
}

interface FetchOpts {
  revalidate: number;
  tags?: string[];
}

async function fdFetch<T>(path: string, opts: FetchOpts): Promise<T> {
  if (!TOKEN) throw new FdError(503, "NO_TOKEN");
  const res = await fetch(`${FD_BASE}${path}`, {
    headers: { "X-Auth-Token": TOKEN },
    next: { revalidate: opts.revalidate, tags: opts.tags },
  });
  if (!res.ok) {
    throw new FdError(res.status, `football-data ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

function withSeason(qs: URLSearchParams): string {
  if (SEASON) qs.set("season", SEASON);
  const s = qs.toString();
  return s ? `?${s}` : "";
}

// ---------------------------------------------------------------------------
// Mappers: raw football-data.org shapes → normalized UI models.
// ---------------------------------------------------------------------------

function mapTeamRef(t: FdTeam | null | undefined): TeamRef {
  return {
    id: t?.id ?? null,
    name: t?.name ?? t?.shortName ?? "—",
    tla: t?.tla ?? null,
    crest: t?.crest ?? null,
  };
}

function normalizeStatus(s: string): MatchStatus {
  const known: MatchStatus[] = [
    "SCHEDULED",
    "TIMED",
    "IN_PLAY",
    "PAUSED",
    "FINISHED",
    "SUSPENDED",
    "POSTPONED",
    "CANCELLED",
    "AWARDED",
  ];
  return (known.includes(s as MatchStatus) ? s : "SCHEDULED") as MatchStatus;
}

export function mapMatch(m: FdMatch | FdSingleMatchResponse): Match {
  return {
    id: m.id,
    utcDate: m.utcDate,
    status: normalizeStatus(m.status),
    minute: m.minute ?? null,
    stage: (m.stage as Stage) ?? "GROUP_STAGE",
    group: m.group ?? null,
    matchday: m.matchday ?? null,
    home: mapTeamRef(m.homeTeam),
    away: mapTeamRef(m.awayTeam),
    score: {
      home: m.score?.fullTime?.home ?? null,
      away: m.score?.fullTime?.away ?? null,
    },
    halfTime: m.score?.halfTime
      ? { home: m.score.halfTime.home, away: m.score.halfTime.away }
      : null,
    winner: (m.score?.winner ?? null) as Winner,
    venue: m.venue ?? null,
  };
}

function mapTableRow(e: FdTableEntry): StandingRow {
  return {
    position: e.position,
    team: mapTeamRef(e.team),
    played: e.playedGames,
    won: e.won,
    draw: e.draw,
    lost: e.lost,
    goalsFor: e.goalsFor,
    goalsAgainst: e.goalsAgainst,
    goalDifference: e.goalDifference,
    points: e.points,
    form: e.form ?? null,
  };
}

function mapStanding(s: FdStanding): GroupStanding {
  return {
    group: s.group ?? "—",
    rows: (s.table ?? []).map(mapTableRow),
  };
}

function mapScorer(e: FdScorerEntry, idx: number): Scorer {
  return {
    rank: idx + 1,
    player: e.player?.name ?? "—",
    team: mapTeamRef(e.team),
    goals: e.goals ?? 0,
    assists: e.assists ?? null,
    penalties: e.penalties ?? null,
    playedMatches: e.playedMatches ?? null,
  };
}

function mapTeamSummary(t: FdTeam): TeamSummary {
  return {
    id: t.id ?? 0,
    name: t.name ?? t.shortName ?? "—",
    tla: t.tla ?? null,
    crest: t.crest ?? null,
  };
}

// ---------------------------------------------------------------------------
// Feature fetchers (used by the route handlers).
// ---------------------------------------------------------------------------

const LIVE_STATUSES = "IN_PLAY,PAUSED";

/** Today's / live matches. football-data refreshes live ~1/min; 45s revalidate is plenty. */
export async function getLiveMatches(): Promise<Match[]> {
  const qs = new URLSearchParams({ competitions: COMPETITION });
  const data = await fdFetch<FdMatchesResponse>(
    `/matches${withSeason(qs)}`,
    { revalidate: 45, tags: ["live"] },
  );
  return (data.matches ?? []).map(mapMatch);
}

export interface FixturesQuery {
  stage?: string;
  matchday?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function getFixtures(q: FixturesQuery = {}): Promise<Match[]> {
  const qs = new URLSearchParams();
  if (q.stage) qs.set("stage", q.stage);
  if (q.matchday) qs.set("matchday", q.matchday);
  if (q.dateFrom) qs.set("dateFrom", q.dateFrom);
  if (q.dateTo) qs.set("dateTo", q.dateTo);
  if (SEASON) qs.set("season", SEASON);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  const data = await fdFetch<FdMatchesResponse>(
    `/competitions/${COMPETITION}/matches${suffix}`,
    { revalidate: 300, tags: ["fixtures"] },
  );
  return (data.matches ?? []).map(mapMatch);
}

export async function getStandings(): Promise<GroupStanding[]> {
  const qs = new URLSearchParams();
  const data = await fdFetch<FdStandingsResponse>(
    `/competitions/${COMPETITION}/standings${withSeason(qs)}`,
    { revalidate: 300, tags: ["standings"] },
  );
  // Keep only the per-group TOTAL tables, sorted by group name.
  return (data.standings ?? [])
    .filter((s) => s.type === "TOTAL")
    .map(mapStanding)
    .sort((a, b) => a.group.localeCompare(b.group));
}

export async function getScorers(limit = 20): Promise<Scorer[]> {
  const qs = new URLSearchParams({ limit: String(limit) });
  const data = await fdFetch<FdScorersResponse>(
    `/competitions/${COMPETITION}/scorers${withSeason(qs)}`,
    { revalidate: 300, tags: ["scorers"] },
  );
  return (data.scorers ?? []).map(mapScorer);
}

export async function getTeams(): Promise<TeamSummary[]> {
  const qs = new URLSearchParams();
  const data = await fdFetch<FdTeamsResponse>(
    `/competitions/${COMPETITION}/teams${withSeason(qs)}`,
    { revalidate: 86400, tags: ["teams"] },
  );
  return (data.teams ?? []).map(mapTeamSummary);
}

export async function getMatch(id: number): Promise<Match> {
  const data = await fdFetch<FdSingleMatchResponse>(`/matches/${id}`, {
    revalidate: 45,
    tags: [`match:${id}`],
  });
  return mapMatch(data);
}

export async function getCompetition(): Promise<CompetitionMeta> {
  const data = await fdFetch<FdCompetitionResponse>(`/competitions/${COMPETITION}`, {
    revalidate: 3600,
    tags: ["competition"],
  });
  return {
    currentMatchday: data.currentSeason?.currentMatchday ?? null,
    seasonStart: data.currentSeason?.startDate ?? "2026-06-11",
    seasonEnd: data.currentSeason?.endDate ?? "2026-07-19",
  };
}
