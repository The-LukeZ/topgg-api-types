// # General and Base Schemas

import * as z from "zod/mini";
import { ISO8601DateSchema, SnowflakeSchema } from "@utils/validators";

// ## Enums and Constants

/**
 * The type of a webhook event. This is used to identify the type of the event that is being delivered to your webhook endpoint.
 *
 * Not all webhook events are allowed to be set by an integration - use the `IntegrationSupportedWebhookScopesSchema` to find out which events you can subscribe to as an integration.
 */
export const IntegrationWebhookEventTypeSchema = z.enum([
  "integration.create",
  "integration.delete",
]);

/**
 * The type of a project helps top.gg synchronize features.
 * For example, a discord bot may have a support server, but this would not make any sense for a discord server.
 *
 * You can use this to further find out the specificity of the project.
 */
export const ProjectTypeSchema = z.enum(["bot", "server", "game"]);

/**
 * A Platform is used to identify where the corresponding ID links towards.
 */
export const ProjectPlatformTypeSchema = z.enum(["discord", "roblox"]);

/**
 * A User Source is an enum that represents a user account from an external platform that is linked to a Top.gg user account.
 * Each source has a unique identifer type that we might validate against.
 *
 * If none is passed to any endpoint that accepts a source parameter, it will default to topgg.
 */
export const UserSourceSchema = z.enum(["discord", "topgg"]);

/**
 * Webhook scopes that are supported for integrations.
 */
export const WebhookEventTypeSchema = z.enum(["webhook.test", "vote.create"]);

export const WebhookEventTypesSchema = z.union([
  WebhookEventTypeSchema,
  IntegrationWebhookEventTypeSchema,
]);

/**
 * A locale supported for translated project fields (e.g., `headline`, `page_content`).
 */
export const LocaleSchema = z.enum([
  "en",
  "de",
  "fr",
  "pt",
  "tr",
  "hi",
  "ja",
  "ar",
  "nl",
  "ko",
  "it",
  "es",
  "ru",
  "uk",
  "vi",
  "zh",
]);

/**
 * All error responses follow the [`application/problem+json`](https://datatracker.ietf.org/doc/html/rfc7807) specification.
 */
export const ErrorSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
});

/**
 * Represents a user on Top.gg.
 */
export const UserSchema = z.object({
  /**
   * The user's Top.gg ID.
   */
  id: SnowflakeSchema,
  /**
   * The user's platform ID (e.g., Discord ID).
   */
  platform_id: SnowflakeSchema,
  /**
   * The user's username.
   */
  name: z.string(),
  /**
   * The URL of the user's avatar.
   */
  avatar_url: z.url(),
});

/**
 * Base project information shared across all project-related responses.
 */
export const BaseProjectSchema = z.object({
  /**
   * The project's Top.gg ID.
   */
  id: SnowflakeSchema,
  /**
   * The platform the project is on (e.g., "discord").
   */
  platform: ProjectPlatformTypeSchema,
  /**
   * The platform-specific ID of the project (e.g., Discord Bot ID).
   */
  platform_id: SnowflakeSchema,
  /**
   * The type of project (e.g., "bot").
   */
  type: ProjectTypeSchema,
});

/**
 * Represents a vote on Top.gg.
 */
export const VoteSchema = z.object({
  /**
   * The Top.gg ID of the user who voted.
   */
  user_id: SnowflakeSchema,
  /**
   * The user's ID on the project's platform (e.g., Discord ID).
   */
  platform_id: SnowflakeSchema,
  /**
   * The amount of votes this vote counted for.
   */
  weight: z.number(),
  /**
   * The timestamp of when the user voted.
   */
  created_at: ISO8601DateSchema,
  /**
   * The timestamp of when the vote expires (i.e., when the user can vote again).
   * This is typically 12 hours after the `created_at` timestamp, but may vary based on the user's voting history and other factors.
   */
  expires_at: ISO8601DateSchema,
});

/**
 * Represents a vote for a specific project.
 */
export const ProjectVoteSchema = z.clone(VoteSchema);

export const WebhookPayloadBaseSchema = <
  T extends z.infer<typeof WebhookEventTypesSchema>,
  Data extends z.ZodMiniObject,
>(
  type: T,
  data: Data
) =>
  z.object({
    type: z.literal(type),
    data: data,
  });
