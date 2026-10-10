"use client";

import { useState, type FormEvent } from "react";

export function ProductionInquiryForm() {
  const [chamber, setChamber] = useState("HOUSE");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [failure, setFailure] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setFailure("");
    try {
      const fields = Object.fromEntries(new FormData(event.currentTarget));
      const body = {
        ...fields,
        authorized: fields.authorized === "on",
        noPodcast: fields.noPodcast === "on",
        consent: fields.consent === "on",
      };
      const response = await fetch("/api/podcast-production/inquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "same-origin", body: JSON.stringify(body),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "The request could not be received. Please try again.");
      }
      setDone(true);
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "The request could not be received.");
    } finally {
      setSending(false);
    }
  }

  if (done) return (
    <div className="studio-success" role="status">
      <h2>Your production inquiry has been received.</h2>
      <p>Thank you for contacting Fireside Chat. Your details have been saved securely for our team to review. We will use your office contact information to follow up.</p>
    </div>
  );

  return (
    <form className="studio-inquiry-form" onSubmit={(event) => { void submit(event); }}>
      <div className="studio-field-pair">
        <label>Member of Congress's full name <span aria-hidden="true">*</span>
          <input name="memberName" required minLength={3} maxLength={120} placeholder="Representative or Senator's name" autoComplete="name" />
        </label>
        <label>Office <span aria-hidden="true">*</span>
          <select name="chamber" value={chamber} onChange={(event) => setChamber(event.target.value)} required>
            <option value="HOUSE">U.S. House of Representatives</option>
            <option value="SENATE">U.S. Senate</option>
          </select>
        </label>
      </div>
      <div className="studio-field-pair">
        <label>State or territory (two-letter code) <span aria-hidden="true">*</span>
          <input name="state" required maxLength={2} minLength={2} pattern="[A-Za-z]{2}" placeholder="e.g., CA" autoCapitalize="characters" />
        </label>
        {chamber === "HOUSE" ? (
          <label>Congressional district <span aria-hidden="true">*</span>
            <input name="district" required maxLength={15} placeholder="e.g., 3 or At-large" />
          </label>
        ) : <input name="district" type="hidden" value="" />}
      </div>
      <div className="studio-field-pair">
        <label>Contact person's name <span aria-hidden="true">*</span>
          <input name="contactName" required minLength={2} maxLength={120} autoComplete="name" />
        </label>
        <label>Contact's role <span aria-hidden="true">*</span>
          <select name="contactRole" required>
            <option value="STAFF">Congressional staff member</option>
            <option value="MEMBER">Member of Congress</option>
          </select>
        </label>
      </div>
      <div className="studio-field-pair">
        <label>Official congressional email <span aria-hidden="true">*</span>
          <input name="contactEmail" required type="email" maxLength={250} placeholder={chamber === "HOUSE" ? "name@mail.house.gov" : "name@senate.gov"} autoComplete="email" />
          <small>Use your official House or Senate office email address.</small>
        </label>
        <label>Phone (optional)
          <input name="phone" type="tel" maxLength={60} autoComplete="tel" />
        </label>
      </div>
      <label>What kind of show are you considering? <span aria-hidden="true">*</span>
        <select name="productionFormat" required defaultValue="UNDECIDED">
          <option value="UNDECIDED">I'd like guidance</option>
          <option value="INTERVIEWS">Interview and conversation show</option>
          <option value="SOLO">Solo commentary or briefings</option>
          <option value="MIXED">A mix of formats</option>
        </select>
      </label>
      <label>What would you like help producing? <span aria-hidden="true">*</span>
        <textarea name="message" required minLength={15} maxLength={2000} rows={6}
          placeholder="Tell us about your audience, topics, launch timeline, production needs, or any questions." />
      </label>
      <div className="studio-consents">
        <label><input name="noPodcast" type="checkbox" required /> This member of Congress does not currently have a podcast and is exploring one.</label>
        <label><input name="authorized" type="checkbox" required /> I am the member or am authorized to inquire on behalf of the office.</label>
        <label><input name="consent" type="checkbox" required /> I agree to have these details used to respond to this production-services inquiry.</label>
      </div>
      <div className="studio-honeypot" aria-hidden="true"><label>Leave this field blank <input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {failure ? <p className="studio-error" role="alert">{failure}</p> : null}
      <button className="studio-submit" type="submit" disabled={sending}>{sending ? "Submitting securely…" : "Request a production consultation"}</button>
      <p className="studio-privacy-note">Fireside Chat is an independent service, not a government website. Your office/contact information and private message are encrypted in our database and visible only to authorized staff. Basic office identification may be shown in our private operations dashboard. A request is not a service agreement.</p>
    </form>
  );
}
