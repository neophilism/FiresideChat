import { NextResponse } from "next/server";
import { getOperationalHealth } from "@/lib/operational-health";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await getOperationalHealth();
    return NextResponse.json(health, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        service: "fireside-chat",
        database: "unreachable",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }
}
