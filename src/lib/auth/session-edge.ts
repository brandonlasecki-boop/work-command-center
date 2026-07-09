import { SESSION_PAYLOAD } from "@/lib/auth/constants";

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifySessionTokenEdge(
  token: string | undefined,
  secret: string | undefined
): Promise<boolean> {
  if (!secret || !token) return false;

  const [payload, signature] = token.split(".");
  if (payload !== SESSION_PAYLOAD || !signature) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, enc.encode(SESSION_PAYLOAD));
  const expected = bufferToHex(signed);

  return signature === expected;
}
