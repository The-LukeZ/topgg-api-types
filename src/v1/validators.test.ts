import { describe, expect, it } from "vitest";
import {
  BaseProjectSchema,
  CreateProjectWebhookBodySchema,
  CreateProjectWebhookResponseSchema,
  ErrorSchema,
  ListProjectIntegrationsResponseSchema,
  UpdateProjectBodySchema,
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

describe("ErrorSchema", () => {
  // Example error response from https://docs.top.gg/api/v1/introduction
  const unauthorized = {
    type: "https://tools.ietf.org/html/rfc9110#section-15.5.2",
    title: "Unauthorized",
    status: 401,
    detail: "The provided token is missing or invalid.",
    code: "UNAUTHORIZED",
  };

  it("accepts a problem+json error with a code", () => {
    expect(ErrorSchema.safeParse(unauthorized).success).toBe(true);
  });

  it("rejects an error without a code", () => {
    const { code: _code, ...withoutCode } = unauthorized;
    expect(ErrorSchema.safeParse(withoutCode).success).toBe(false);
  });
});

describe("UpdateProjectBodySchema", () => {
  it("accepts additional_data for a Minecraft server", () => {
    const result = UpdateProjectBodySchema.safeParse({
      additional_data: { minecraft_server: { host: "play.example.com", port: 25565 } },
    });
    expect(result.success).toBe(true);
  });

  it("accepts partial minecraft_server data", () => {
    const result = UpdateProjectBodySchema.safeParse({
      additional_data: { minecraft_server: { port: 25565 } },
    });
    expect(result.success).toBe(true);
  });

  it.each([0, 65536, 25565.5])("rejects port %s", (port) => {
    const result = UpdateProjectBodySchema.safeParse({
      additional_data: { minecraft_server: { host: "play.example.com", port } },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty body", () => {
    expect(UpdateProjectBodySchema.safeParse({}).success).toBe(false);
  });
});

describe("BaseProjectSchema", () => {
  it("accepts a Minecraft game server project", () => {
    const result = BaseProjectSchema.safeParse({
      id: "218109768489992192",
      platform: "minecraft",
      platform_id: "218109768489992192",
      type: "game_server",
    });
    expect(result.success).toBe(true);
  });
});
