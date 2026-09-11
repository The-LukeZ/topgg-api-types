import { describe, expect, it } from "vitest";
import {
  CreateProjectWebhookBodySchema,
  CreateProjectWebhookResponseSchema,
  ListProjectIntegrationsResponseSchema,
  VoteCreateWebhookPayloadSchema,
} from "@v1/validators";

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

describe("CreateProjectWebhookBodySchema", () => {
  it("accepts a valid label and https url", () => {
    const result = CreateProjectWebhookBodySchema.safeParse({
      label: "Production webhook",
      url: "https://example.com/webhooks/topgg",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a non-https url", () => {
    const result = CreateProjectWebhookBodySchema.safeParse({
      label: "Production webhook",
      url: "http://example.com/webhooks/topgg",
    });

    expect(result.success).toBe(false);
  });
});

describe("CreateProjectWebhookResponseSchema", () => {
  it("accepts a create response with a whs_-prefixed secret", () => {
    const result = CreateProjectWebhookResponseSchema.safeParse({
      id: "wh_123456789",
      label: "Production webhook",
      url: "https://example.com/webhooks/topgg",
      secret: "whs_abcDEF123456",
    });

    expect(result.success).toBe(true);
  });
});

describe("ListProjectIntegrationsResponseSchema", () => {
  it("accepts a list of integrations with mixed connection status", () => {
    const result = ListProjectIntegrationsResponseSchema.safeParse([
      {
        id: "sentry",
        name: "Sentry",
        description: "Get vote and error alerts in Sentry.",
        icon_url: "https://example.com/icons/sentry.png",
        connected: true,
      },
      {
        id: "discord-webhooks",
        name: "Discord Webhooks",
        description: "Deliver vote events to a Discord channel.",
        icon_url: "https://example.com/icons/discord.png",
        connected: false,
      },
    ]);

    expect(result.success).toBe(true);
  });
});
