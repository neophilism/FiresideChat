import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revealDetails } from "@/lib/production-inquiries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Podcast production inquiries", robots: { index: false, follow: false } };

function date(value: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" }).format(value);
}

export default async function ProductionInquiryAdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const inquiries = await db.podcastProductionInquiry.findMany({
    orderBy: { submittedAt: "desc" }, take: 100,
  });
  return (
    <div className="detail-page production-inquiry-admin">
      <section className="search-hero">
        <p className="eyebrow">Private studio requests</p>
        <h1>Podcast production inquiries</h1>
        <p>Requests are self-reported by congressional offices. A House/Senate email domain is required, but office identity has not been independently verified.</p>
        <Link href="/admin">← Back to archive operations</Link>
      </section>
      <section className="section-block">
        <h2>{inquiries.length} most recent submissions</h2>
        {inquiries.map((record) => {
          let details: ReturnType<typeof revealDetails> | null = null;
          try { details = revealDetails(record.protectedDetails); } catch { /* Invalid or unavailable key: never print ciphertext. */ }
          return (
            <article className="studio-admin-card" key={record.id}>
              <header><strong>{record.memberName}</strong><span>{date(record.submittedAt)}</span></header>
              <p>{record.chamber === "HOUSE" ? "U.S. House of Representatives" : "U.S. Senate"} · {record.state}
                {record.district ? " · District " + record.district : ""} · self-reported, unverified</p>
              {details ? <>
                <p><strong>Contact:</strong> {details.contactName} ({details.contactRole.toLowerCase()})</p>
                <p><strong>Email:</strong> <a href={"mailto:" + details.contactEmail}>{details.contactEmail}</a></p>
                {details.phone ? <p><strong>Phone:</strong> {details.phone}</p> : null}
                <p><strong>Requested format:</strong> {details.productionFormat}</p>
                <p className="studio-request-message">{details.message}</p>
              </> : <p>Private details could not be decrypted. Check the server encryption key.</p>}
              <small>Email: {record.emailStatus.toLowerCase()} · {record.emailAttempts} delivery attempts{record.emailLastError ? " · operator action may be needed" : ""}</small>
            </article>
          );
        })}
        {inquiries.length === 0 ? <p>No requests have been submitted yet.</p> : null}
      </section>
    </div>
  );
}
