import { describe, expect, it } from "vitest";
import { VoteCreateWebhookPayloadSchema } from "@v1/validators";

describe("VoteCreateWebhookPayloadSchema", () => {
  it("accepts a vote.create payload with fractional-second offset timestamps", () => {
    const payload = {
      type: "vote.create",
      data: {
        id: "123456789012345678",
        weight: 1,
        created_at: "2025-03-11T09:14:02.5321890+00:00",
        expires_at: "2025-03-11T21:14:02.5321890+00:00",
        project: {
          id: "234567890123456789",
          type: "bot",
          platform: "discord",
          platform_id: "345678901234567890",
        },
        user: {
          id: "456789012345678901",
          platform_id: "567890123456789012",
          name: "example-user",
          avatar_url: "https://cdn.discordapp.com/avatars/567890123456789012/abcdef1234567890.png",
        },
        query: {
          guild: "678901234567890123",
        },
      },
    };

    const result = VoteCreateWebhookPayloadSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("also accepts a UTC 'Z' timestamp without a fractional offset", () => {
    const payload = {
      type: "vote.create",
      data: {
        id: "123456789012345678",
        weight: 2,
        created_at: "2025-03-11T09:14:02.000Z",
        expires_at: "2025-03-11T21:14:02.000Z",
        project: {
          id: "234567890123456789",
          type: "bot",
          platform: "discord",
          platform_id: "345678901234567890",
        },
        user: {
          id: "456789012345678901",
          platform_id: "567890123456789012",
          name: "example-user",
          avatar_url: "https://cdn.discordapp.com/avatars/567890123456789012/abcdef1234567890.png",
        },
      },
    };

    const result = VoteCreateWebhookPayloadSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });
});
