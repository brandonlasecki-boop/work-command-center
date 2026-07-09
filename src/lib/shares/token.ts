import { randomBytes } from "crypto";

export function generateShareToken(): string {
  return randomBytes(32).toString("base64url");
}

export function buildShareUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${base}/share/${token}`;
}

export function isShareActive(share: {
  revoked_at: string | null;
  expires_at: string | null;
}): boolean {
  if (share.revoked_at) return false;
  if (share.expires_at && new Date(share.expires_at) < new Date()) return false;
  return true;
}
