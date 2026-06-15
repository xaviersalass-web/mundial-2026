import { respond } from "@/lib/api/respond";
import { getTeams } from "@/lib/footballData";
import { mockTeams } from "@/lib/mock/data";
import type { TeamSummary } from "@/lib/types/models";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// Single team detail. Free tier is thin (no squads/stats), so for now we resolve
// the team from the competition's team list — robust and within rate limits.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const teamId = Number(id);
  const fallback: TeamSummary =
    mockTeams.find((t) => t.id === teamId) ?? mockTeams[0];
  return respond(
    async () => {
      const teams = await getTeams();
      const found = teams.find((t) => t.id === teamId);
      if (!found) throw new Error("TEAM_NOT_FOUND");
      return found;
    },
    fallback,
    { sMaxAge: 86400 },
  );
}
