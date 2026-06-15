import { respond } from "@/lib/api/respond";
import { getFixtures } from "@/lib/footballData";
import { mockFixtures } from "@/lib/mock/data";

export const runtime = "nodejs";
export const fetchCache = "default-cache";

// Calendar / fixtures, filterable by ?stage= ?matchday= ?dateFrom= ?dateTo=.
// Also powers the knockout bracket via ?stage=LAST_32,LAST_16,...,FINAL.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = {
    stage: searchParams.get("stage") ?? undefined,
    matchday: searchParams.get("matchday") ?? undefined,
    dateFrom: searchParams.get("dateFrom") ?? undefined,
    dateTo: searchParams.get("dateTo") ?? undefined,
  };
  return respond(() => getFixtures(q), mockFixtures, { sMaxAge: 300 });
}
