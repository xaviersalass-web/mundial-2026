import { respond } from "@/lib/api/respond";
import { getMatch } from "@/lib/footballData";
import { mockLiveMatches } from "@/lib/mock/data";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// Single match detail. Polled only while the match is open.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const matchId = Number(id);
  const fallback =
    mockLiveMatches.find((m) => m.id === matchId) ?? mockLiveMatches[0];
  return respond(() => getMatch(matchId), fallback, { sMaxAge: 45, swr: 120 });
}
