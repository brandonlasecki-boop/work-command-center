import { createHmac, timingSafeEqual } from "crypto";
import { SESSION_COOKIE, SESSION_PAYLOAD } from "@/lib/auth/constants";

export { SESSION_COOKIE } from "@/lib/auth/constants";

export function createSessionToken(): string {
  const secret = process.env.APP_PASSWORD;
  if (!secret) throw new Error("APP_PASSWORD is not configured");

  const signature = createHmac("sha256", secret).update(SESSION_PAYLOAD).digest("hex");
  return `${SESSION_PAYLOAD}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = process.env.APP_PASSWORD;
  if (!secret || !token) return false;

  const [payload, signature] = token.split(".");
  if (payload !== SESSION_PAYLOAD || !signature) return false;

  const expected = createHmac("sha256", secret).update(SESSION_PAYLOAD).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.APP_PASSWORD?.length);
}
