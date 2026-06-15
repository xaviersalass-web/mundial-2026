import { respond } from "@/lib/api/respond";
import { getStandings } from "@/lib/footballData";
import { mockStandings } from "@/lib/mock/data";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// Group standings: one table per group (A–L).
export async function GET() {
  return respond(getStandings, mockStandings, { sMaxAge: 300, swr: 600 });
}
