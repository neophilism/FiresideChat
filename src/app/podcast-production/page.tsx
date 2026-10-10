import type { Metadata } from "next";
import Link from "next/link";
import { ProductionInquiryForm } from "@/components/production-inquiry-form";

export const metadata: Metadata = {
  title: "Podcast Production for Congress",
  description: "Congressional offices considering a podcast can inquire about podcast planning and production services.",
};

export default function PodcastProductionPage() {
  return (
    <div className="detail-page studio-production-page">
      <section className="search-hero">
        <p className="eyebrow">A voice of your own</p>
        <h1>Start a podcast for your office.</h1>
        <p>Members of Congress who do not yet have a podcast can request help developing and producing one. Tell us what you have in mind, and we will follow up directly with your office.</p>
        <p>Need to browse the archive first? <Link href="/people">Explore existing congressional shows →</Link></p>
      </section>
      <section className="section-block studio-production-section">
        <div className="studio-production-intro">
          <p className="section-label">For congressional offices</p>
          <h2>Request podcast production services.</h2>
          <p>We can discuss show format, recording logistics, editorial workflows, editing, accessibility, publication, and continuing production. There is no commitment when submitting this form.</p>
        </div>
        <ProductionInquiryForm />
      </section>
    </div>
  );
}
