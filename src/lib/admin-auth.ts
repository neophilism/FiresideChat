import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "fireside_admin_session";
const SESSION_LABEL = "fireside-admin-v1";

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function adminIsConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function createAdminSessionToken(secret: string) {
  return createHmac("sha256", secret).update(SESSION_LABEL).digest("hex");
}

export function verifyAdminSessionToken(token: string, secret: string) {
  return safeEqual(token, createAdminSessionToken(secret));
}

export function verifyAdminPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && safeEqual(candidate, expected));
}

export async function isAdminAuthenticated() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return Boolean(token && verifyAdminSessionToken(token, secret));
}
