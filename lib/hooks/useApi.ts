"use client";

// Client data hooks. Only the live endpoint polls; everything else is fetched once
// with a long dedupe window. On 429 our API returns 200 with stale:true, so SWR
// never sees an error and the UI keeps showing the last good value.

import useSWR, { type SWRConfiguration } from "swr";
import type {
  ApiEnvelope,
  CompetitionMeta,
  GroupStanding,
  Match,
  Scorer,
  TeamSummary,
} from "@/lib/types/models";

async function fetcher<T>(url: string): Promise<ApiEnvelope<T>> {
  const res = await fetch(url);
  return (await res.json()) as ApiEnvelope<T>;
}

const STATIC_OPTS: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 5 * 60 * 1000,
};

export function useLive() {
  return useSWR<ApiEnvelope<Match[]>>("/api/live", fetcher, {
    refreshInterval: 30_000,
    keepPreviousData: true,
    revalidateOnFocus: true,
    onErrorRetry: (_err, _key, _cfg, revalidate, { retryCount }) => {
      // Exponential backoff, capped — be gentle with the free-tier rate limit.
      const delay = Math.min(60_000, 1000 * 2 ** retryCount);
      setTimeout(() => revalidate({ retryCount }), delay);
    },
  });
}

export function useStandings() {
  return useSWR<ApiEnvelope<GroupStanding[]>>(
    "/api/standings",
    fetcher,
    STATIC_OPTS,
  );
}

export function useScorers(limit = 20) {
  return useSWR<ApiEnvelope<Scorer[]>>(
    `/api/scorers?limit=${limit}`,
    fetcher,
    STATIC_OPTS,
  );
}

export function useTeams() {
  return useSWR<ApiEnvelope<TeamSummary[]>>("/api/teams", fetcher, STATIC_OPTS);
}

export function useCompetition() {
  return useSWR<ApiEnvelope<CompetitionMeta>>(
    "/api/competition",
    fetcher,
    STATIC_OPTS,
  );
}

export function useFixtures(query = "") {
  return useSWR<ApiEnvelope<Match[]>>(
    `/api/fixtures${query ? `?${query}` : ""}`,
    fetcher,
    STATIC_OPTS,
  );
}
