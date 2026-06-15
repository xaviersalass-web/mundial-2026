import { respond } from "@/lib/api/respond";
import { getTeams } from "@/lib/footballData";
import { mockTeams } from "@/lib/mock/data";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// All 48 participating teams. Changes rarely → cached a day.
export async function GET() {
  return respond(getTeams, mockTeams, { sMaxAge: 86400 });
}
