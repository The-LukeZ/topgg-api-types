import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyWebhookSignature } from "@v1/webhook";

const secret = "whs_test_secret";
const rawBody = JSON.stringify({ type: "webhook.test", data: {} });

async function sign(timestamp: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`)
  );
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `t=${timestamp},v1=${hex}`;
}

describe("verifyWebhookSignature", () => {
  const now = 1_800_000_000;

  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts a fresh signature", async () => {
    vi.useFakeTimers({ now: now * 1000 });
    const signatureHeader = await sign(now);
    expect(await verifyWebhookSignature({ rawBody, signatureHeader, secret })).toBe(true);
  });

  it("rejects a signature older than 5 minutes by default", async () => {
    vi.useFakeTimers({ now: now * 1000 });
    const signatureHeader = await sign(now - 301);
    expect(await verifyWebhookSignature({ rawBody, signatureHeader, secret })).toBe(false);
  });

  it("accepts an old signature when toleranceSeconds is false", async () => {
    vi.useFakeTimers({ now: now * 1000 });
    const signatureHeader = await sign(now - 301);
    expect(
      await verifyWebhookSignature({ rawBody, signatureHeader, secret, toleranceSeconds: false })
    ).toBe(true);
  });

  it("rejects a tampered body", async () => {
    vi.useFakeTimers({ now: now * 1000 });
    const signatureHeader = await sign(now);
    expect(await verifyWebhookSignature({ rawBody: `${rawBody} `, signatureHeader, secret })).toBe(
      false
    );
  });
});
