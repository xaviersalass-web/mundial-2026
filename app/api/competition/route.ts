import { respond } from "@/lib/api/respond";
import { getCompetition } from "@/lib/footballData";
import { mockCompetition } from "@/lib/mock/data";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// Competition metadata: current matchday + season dates (for hero countdown,
// default calendar view, "Matchday N" labels).
export async function GET() {
  return respond(getCompetition, mockCompetition, { sMaxAge: 3600 });
}
