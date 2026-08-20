/**
 * Options for {@link verifyWebhookSignature}.
 */
export interface VerifyWebhookSignatureOptions {
  /**
   * The raw, unparsed request body. Signatures computed over a re-serialized JSON body will not match.
   */
  rawBody: string;
  /**
   * The `x-topgg-signature` header value from the incoming request.
   */
  signatureHeader: string | null | undefined;
  /**
   * Your integration's `webhook_secret` (see {@link IntegrationCreateData}).
   */
  secret: string;
  /**
   * If provided, requests whose `t=` timestamp is further than this many seconds from now are rejected.
   * Omit to skip timestamp/replay checking entirely.
   */
  toleranceSeconds?: number;
}

const SIGNATURE_HEADER_PATTERN = /^t=(\d+),v1=([0-9a-f]+)$/;

/**
 * Verifies the `x-topgg-signature` header sent with Top.gg v1 webhook requests.
 *
 * The header has the form `t={unix timestamp},v1={hex-encoded HMAC-SHA256}`, where the signature
 * is computed over `{timestamp}.{rawBody}` using your integration's `webhook_secret`.
 *
 * @see https://docs.top.gg/webhooks/overview#signature-verification-v1
 */
export async function verifyWebhookSignature(
  options: VerifyWebhookSignatureOptions
): Promise<boolean> {
  const { rawBody, signatureHeader, secret } = options;
  if (!signatureHeader) return false;

  const match = SIGNATURE_HEADER_PATTERN.exec(signatureHeader);
  if (!match) return false;
  const timestampStr = match[1]!;
  const signature = match[2]!;

  if (options.toleranceSeconds !== undefined) {
    const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestampStr));
    if (ageSeconds > options.toleranceSeconds) return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestampStr}.${rawBody}`)
  );
  const expected = Array.from(new Uint8Array(signatureBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return timingSafeEqualHex(expected, signature);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
