import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { after, before, test } from "node:test";
import {
  authorizedInternalToken, digestIdentifier, officialEmail, protectDetails, revealDetails, validateInquiry,
} from "./production-inquiries";

const oldKey = process.env.PODCAST_INQUIRY_ENCRYPTION_KEY;
const oldToken = process.env.ENGINE_ROOM_INQUIRY_TOKEN;

before(() => {
  process.env.PODCAST_INQUIRY_ENCRYPTION_KEY = randomBytes(32).toString("hex");
  process.env.ENGINE_ROOM_INQUIRY_TOKEN = randomBytes(32).toString("hex");
});
after(() => {
  if (oldKey === undefined) delete process.env.PODCAST_INQUIRY_ENCRYPTION_KEY;
  else process.env.PODCAST_INQUIRY_ENCRYPTION_KEY = oldKey;
  if (oldToken === undefined) delete process.env.ENGINE_ROOM_INQUIRY_TOKEN;
  else process.env.ENGINE_ROOM_INQUIRY_TOKEN = oldToken;
});

const good = {
  memberName: "Jane Example", chamber: "HOUSE", state: "CA", district: "5",
  contactName: "Alex Staff", contactRole: "STAFF",
  contactEmail: "alex@mail.house.gov", phone: "(202) 555-0100",
  productionFormat: "INTERVIEWS", message: "We would like to launch an interview show for constituents.",
  authorized: true, noPodcast: true, consent: true, website: "",
};

test("House and Senate official email policy", () => {
  assert.equal(officialEmail("alex@mail.house.gov", "HOUSE"), true);
  assert.equal(officialEmail("alex@house.gov", "HOUSE"), true);
  assert.equal(officialEmail("alex@senate.gov", "SENATE"), true);
  assert.equal(officialEmail("alex@fakehouse.gov", "HOUSE"), false);
  assert.equal(officialEmail("alex@gmail.com", "HOUSE"), false);
  assert.equal(officialEmail("alex@house.gov.attack.example", "HOUSE"), false);
  assert.equal(officialEmail("alex@senate.gov", "HOUSE"), false);
});

test("public inquiry data is checked and bounded", () => {
  const valid = validateInquiry(good);
  assert.equal(valid.ok, true);
  if (!valid.ok) return;
  assert.equal(valid.value.officeKey, "HOUSE:CA:5:jane-example");
  assert.equal(valid.value.contactEmail, "alex@mail.house.gov");
  assert.equal(validateInquiry({ ...good, district: "not-a-district" }).ok, false);
  assert.equal(validateInquiry({ ...good, website: "https://spam.example" }).ok, false);
  assert.equal(validateInquiry({ ...good, consent: false }).ok, false);
  assert.equal(validateInquiry({ ...good, memberName: "X".repeat(300) }).ok, false);
  assert.equal(validateInquiry({ ...good, chamber: "SENATE", district: "" }).ok, false);
  assert.equal(validateInquiry({ ...good, chamber: "SENATE", district: "", contactEmail: "alex@senate.gov" }).ok, true);
});

test("private details round trip under AES-GCM and tampering fails closed", () => {
  const validated = validateInquiry(good);
  assert.equal(validated.ok, true);
  if (!validated.ok) return;
  const value = validated.value;
  const details = {
    contactName: value.contactName, contactRole: value.contactRole, contactEmail: value.contactEmail,
    phone: value.phone, productionFormat: value.productionFormat, message: value.message,
  };
  const packed = protectDetails(details);
  assert.match(packed, /^v1\./);
  assert.equal(packed.includes(value.contactEmail), false);
  assert.deepEqual(revealDetails(packed), details);
  const parts = packed.split(".");
  const ciphertext = Buffer.from(parts[3], "base64url");
  ciphertext[0] ^= 0x01;
  parts[3] = ciphertext.toString("base64url");
  assert.throws(() => revealDetails(parts.join(".")));
  assert.equal(digestIdentifier("alex@mail.house.gov", "contact"), digestIdentifier("alex@mail.house.gov", "contact"));
  assert.notEqual(digestIdentifier("alex@mail.house.gov", "contact"), digestIdentifier("alex@mail.house.gov", "ip"));
});

test("internal Room token must be exact", () => {
  const token = process.env.ENGINE_ROOM_INQUIRY_TOKEN;
  assert.ok(token);
  assert.equal(authorizedInternalToken("Bearer " + token), true);
  assert.equal(authorizedInternalToken("Bearer bad"), false);
  assert.equal(authorizedInternalToken("Basic " + token), false);
  assert.equal(authorizedInternalToken(null), false);
});
