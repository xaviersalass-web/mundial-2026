import { respond } from "@/lib/api/respond";
import { getLiveMatches } from "@/lib/footballData";
import { mockLiveMatches } from "@/lib/mock/data";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// Today's / live matches. Polled by the client every ~30s; upstream deduped to 45s.
export async function GET() {
  return respond(getLiveMatches, mockLiveMatches, { sMaxAge: 45, swr: 120 });
}
