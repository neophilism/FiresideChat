import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorizedInternalToken } from "@/lib/production-inquiries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!authorizedInternalToken(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const [countResult, recent] = await Promise.all([
      db.$queryRaw<Array<{ unique_offices: bigint }>>`SELECT count(DISTINCT "officeKey") AS unique_offices FROM "PodcastProductionInquiry"`,
      db.podcastProductionInquiry.findMany({
        orderBy: { submittedAt: "desc" },
        take: 100,
        select: { id: true, memberName: true, chamber: true, state: true,
          district: true, officeKey: true, submittedAt: true },
      }),
    ]);
    const seen = new Set<string>();
    const offices = recent.filter((item) => {
      if (seen.has(item.officeKey)) return false;
      seen.add(item.officeKey);
      return true;
    }).slice(0, 30).map((item) => ({
      id: item.id, memberName: item.memberName, chamber: item.chamber,
      state: item.state, district: item.district, submittedAt: item.submittedAt.toISOString(),
    }));
    return NextResponse.json({
      uniqueOffices: Number(countResult[0]?.unique_offices ?? 0),
      offices,
      source: "FiresideChat",
      verification: "self-reported; not independently verified",
      asOf: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store, private" } });
  } catch {
    return NextResponse.json({ error: "Inquiry summary unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
