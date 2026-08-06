export const PIN_HASH_COOKIE = "lumen-security-pin-hash";
export const CODE_WORD_HASH_COOKIE = "lumen-security-code-word-hash";
export const LAST_AUTH_COOKIE = "lumen-security-last-auth";

const DEMO_SALT = "lumen-banking-local-demo-v1";

export async function hashLocalSecret(secret: string) {
  const bytes = new TextEncoder().encode(`${DEMO_SALT}:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyLocalSecret(secret: string, expectedHash: string) {
  return (await hashLocalSecret(secret)) === expectedHash;
}
