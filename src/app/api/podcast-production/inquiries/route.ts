import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digestIdentifier, protectDetails, validateInquiry } from "@/lib/production-inquiries";
import { deliverInquiryEmail } from "@/lib/production-inquiry-mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 12_000;

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin)
    return error("Submit the form directly from Fireside Chat.", 403);

  const statedLength = Number(request.headers.get("content-length") ?? 0);
  if (statedLength > MAX_BODY_BYTES) return error("Request is too large.", 413);
  let payload: Record<string, unknown>;
  try {
    const text = await request.text();
    if (Buffer.byteLength(text) > MAX_BODY_BYTES) return error("Request is too large.", 413);
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return error("Invalid inquiry details.", 400);
    payload = parsed as Record<string, unknown>;
  } catch {
    return error("Invalid inquiry details.", 400);
  }

  const result = validateInquiry(payload);
  if (!result.ok) return error(result.error, 422);

  try {
    const info = result.value;
    const emailHash = digestIdentifier(info.contactEmail, "contact");
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const clientHash = digestIdentifier(ip, "ip");
    const last30m = new Date(Date.now() - 30 * 60_000);
    const last24h = new Date(Date.now() - 24 * 60 * 60_000);
    const [recentFromClient, recentFromOffice, duplicate] = await Promise.all([
      db.podcastProductionInquiry.count({ where: { clientHash, submittedAt: { gte: last30m } } }),
      db.podcastProductionInquiry.count({ where: { officeKey: info.officeKey, submittedAt: { gte: last24h } } }),
      db.podcastProductionInquiry.findFirst({
        where: { contactEmailHash: emailHash, officeKey: info.officeKey, submittedAt: { gte: last24h } },
        select: { id: true },
      }),
    ]);
    if (duplicate) return NextResponse.json({ ok: true, duplicate: true }, { headers: { "Cache-Control": "no-store" } });
    if (recentFromClient >= 4 || recentFromOffice >= 5)
      return error("Too many recent inquiries. Please try again later.", 429);

    const protectedDetails = protectDetails({
      contactName: info.contactName, contactRole: info.contactRole, contactEmail: info.contactEmail,
      phone: info.phone, productionFormat: info.productionFormat, message: info.message,
    });
    const inquiry = await db.podcastProductionInquiry.create({
      data: {
        memberName: info.memberName, chamber: info.chamber, state: info.state, district: info.district,
        officeKey: info.officeKey, contactEmailHash: emailHash, clientHash, protectedDetails,
      }, select: { id: true },
    });

    // Durable record and Engine Room inquiry summary exist independently of mail-provider delivery.
    // Outbox retries while the free web worker is awake, once a verified sender and key are provisioned.
    try { await deliverInquiryEmail(inquiry.id); } catch {
      // The persisted PENDING/FAILED record is recoverable; no contact details are logged.
    }
    return NextResponse.json({ ok: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return error("This service is temporarily unable to accept inquiries. Please try later.", 503);
  }
}
