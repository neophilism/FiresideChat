import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type InquiryFormValues = Record<string, unknown>;
export type ValidInquiry = {
  memberName: string;
  chamber: "HOUSE" | "SENATE";
  state: string;
  district: string | null;
  officeKey: string;
  contactName: string;
  contactRole: "MEMBER" | "STAFF";
  contactEmail: string;
  phone: string | null;
  productionFormat: "INTERVIEWS" | "SOLO" | "MIXED" | "UNDECIDED";
  message: string;
};
export type ProtectedInquiry = Pick<ValidInquiry, "contactName" | "contactRole" | "contactEmail" | "phone" | "productionFormat" | "message">;

const STATES = new Set(["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VT","VA","VI","WA","WV","WI","WY"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").slice(0, max + 1);
}

export function officialEmail(email: string, chamber: "HOUSE" | "SENATE"): boolean {
  if (!EMAIL.test(email) || email.length > 250) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  const suffix = chamber === "HOUSE" ? "house.gov" : "senate.gov";
  return domain === suffix || Boolean(domain?.endsWith("." + suffix));
}

export function validateInquiry(values: InquiryFormValues):
  | { ok: true; value: ValidInquiry }
  | { ok: false; error: string } {
  if (field(values.website, 300)) return { ok: false, error: "Submission rejected." };
  const memberName = field(values.memberName, 120);
  const chamber = field(values.chamber, 20);
  const state = field(values.state, 5).toUpperCase();
  const district = field(values.district, 15);
  const contactName = field(values.contactName, 120);
  const contactRole = field(values.contactRole, 20);
  const contactEmail = field(values.contactEmail, 250).toLowerCase();
  const phone = field(values.phone, 60);
  const productionFormat = field(values.productionFormat, 20);
  const message = field(values.message, 2000);
  if (chamber !== "HOUSE" && chamber !== "SENATE")
    return { ok: false, error: "Select the House or Senate." };
  if (!STATES.has(state)) return { ok: false, error: "Select a valid state or territory." };
  if (chamber === "HOUSE" && !/^(?:\d{1,2}|at-large)$/i.test(district))
    return { ok: false, error: "Enter a House district number or At-large." };
  if (chamber === "SENATE" && district)
    return { ok: false, error: "Senate offices do not have districts." };
  if (memberName.length < 3 || memberName.length > 120 || contactName.length < 2 || contactName.length > 120)
    return { ok: false, error: "Enter the officeholder's and contact person's names." };
  if (contactRole !== "MEMBER" && contactRole !== "STAFF")
    return { ok: false, error: "Select your role." };
  if (!officialEmail(contactEmail, chamber))
    return { ok: false, error: "Use an official House or Senate office email address." };
  if (!["INTERVIEWS", "SOLO", "MIXED", "UNDECIDED"].includes(productionFormat))
    return { ok: false, error: "Select the preferred format." };
  if (phone.length > 60 || message.length < 15 || message.length > 2000)
    return { ok: false, error: "Enter a description of 15–2,000 characters." };
  if (values.authorized !== true || values.noPodcast !== true || values.consent !== true)
    return { ok: false, error: "Confirm office authorization, podcast status, and consent." };
  const normalizedName = memberName.toLowerCase().normalize("NFKC").replace(/[^a-z0-9]+/g, "-").slice(0, 140);
  const officeKey = [chamber, state, chamber === "HOUSE" ? district.toLowerCase() : "-", normalizedName].join(":");
  return {
    ok: true,
    value: { memberName, chamber, state, district: chamber === "HOUSE" ? district : null, officeKey,
      contactName, contactRole, contactEmail, phone: phone || null, productionFormat: productionFormat as ValidInquiry["productionFormat"], message },
  };
}

function encryptionKey(): Buffer {
  const raw = process.env.PODCAST_INQUIRY_ENCRYPTION_KEY ?? "";
  if (!/^[0-9a-f]{64}$/i.test(raw)) throw new Error("Podcast inquiry encryption is not configured.");
  return Buffer.from(raw, "hex");
}

export function protectDetails(details: ProtectedInquiry): string {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), nonce);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(details), "utf8"), cipher.final()]);
  return "v1." + nonce.toString("base64url") + "." + cipher.getAuthTag().toString("base64url") +
    "." + ciphertext.toString("base64url");
}

export function revealDetails(packed: string): ProtectedInquiry {
  const [version, nonce, tag, ciphertext, extra] = packed.split(".");
  if (version !== "v1" || extra || !nonce || !tag || !ciphertext) throw new Error("Invalid protected inquiry.");
  const iv = Buffer.from(nonce, "base64url");
  const authTag = Buffer.from(tag, "base64url");
  if (iv.length !== 12 || authTag.length !== 16) throw new Error("Invalid protected inquiry.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(authTag);
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64url")), decipher.final()]).toString("utf8")) as ProtectedInquiry;
}

export function digestIdentifier(value: string, type: string): string {
  const key = encryptionKey();
  return createHmac("sha256", key).update(type + "\0" + value).digest("hex");
}

export function authorizedInternalToken(header: string | null): boolean {
  const expected = process.env.ENGINE_ROOM_INQUIRY_TOKEN ?? "";
  if (!/^[a-f0-9]{64}$/i.test(expected) || !header?.startsWith("Bearer ")) return false;
  const provided = header.slice(7);
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}
