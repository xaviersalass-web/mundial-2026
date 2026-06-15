import { respond } from "@/lib/api/respond";
import { getScorers } from "@/lib/footballData";
import { mockScorers } from "@/lib/mock/data";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// Top scorers. ?limit=N (default 20).
export async function GET(req: Request) {
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? "20");
  return respond(() => getScorers(limit), mockScorers, { sMaxAge: 300 });
}
