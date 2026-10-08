import { NextResponse } from "next/server";
import { getArchiveStats } from "@/lib/archive-stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getArchiveStats();

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
