// Shared helpers for the /api/* route handlers: wraps data in the ApiEnvelope,
// handles the no-token (demo) and rate-limited (429) cases, and sets CDN cache
// headers so bursts are absorbed at the edge (stale-while-revalidate).

import { DEMO_MODE, FdError, LIVE_DELAYED } from "@/lib/footballData";
import type { ApiEnvelope } from "@/lib/types/models";

interface RespondOpts {
  /** CDN s-maxage in seconds. */
  sMaxAge: number;
  /** stale-while-revalidate window in seconds. */
  swr?: number;
  /** Mark scores as delayed (free tier). Defaults to the live/delayed env flag. */
  delayed?: boolean;
}

function envelope<T>(data: T, partial: Partial<ApiEnvelope<T>>): ApiEnvelope<T> {
  return {
    data,
    demo: false,
    delayed: LIVE_DELAYED,
    stale: false,
    updatedAt: new Date().toISOString(),
    ...partial,
  };
}

function json<T>(body: ApiEnvelope<T>, opts: RespondOpts, status = 200): Response {
  const swr = opts.swr ?? opts.sMaxAge * 2;
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": `public, s-maxage=${opts.sMaxAge}, stale-while-revalidate=${swr}`,
    },
  });
}

/**
 * Run a fetcher and respond. On missing token (503/NO_TOKEN) serve the provided
 * mock data flagged demo:true. On upstream 429 serve mock flagged stale:true with
 * a short cache so the client backs off gracefully instead of erroring.
 */
export async function respond<T>(
  fetcher: () => Promise<T>,
  mock: T,
  opts: RespondOpts,
): Promise<Response> {
  if (DEMO_MODE) {
    return json(envelope(mock, { demo: true, delayed: false }), opts);
  }
  try {
    const data = await fetcher();
    return json(envelope(data, { delayed: opts.delayed ?? LIVE_DELAYED }), opts);
  } catch (err) {
    if (err instanceof FdError && err.status === 429) {
      // Rate limited: return last-resort mock, short cache, flagged stale.
      return json(
        envelope(mock, { stale: true, error: "RATE_LIMITED" }),
        { sMaxAge: 30, swr: 120 },
        200,
      );
    }
    const status = err instanceof FdError ? err.status : 500;
    return json(
      envelope(mock, { stale: true, error: `UPSTREAM_${status}` }),
      { sMaxAge: 15, swr: 60 },
      status >= 500 ? 200 : status,
    );
  }
}
