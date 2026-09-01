// # General and Base Types

import type { ISO8601Date, Snowflake } from "@src/utils";

// ## Bases and Constants

/**
 * The type of a webhook event sent by Top.gg to your integration webhook endpoint.
 *
 * These are for events related to the integration connection itself (e.g., when it's created or deleted).
 */
export type IntegrationWebhookEventType = "integration.create" | "integration.delete";

/**
 * The type of a project helps top.gg synchronize features.
 * For example, a discord bot may have a support server, but this would not make any sense for a discord server.
 *
 * You can use this to further find out the specificity of the project.
 */
export type ProjectType = "bot" | "server" | "game";

/**
 * A Platform is used to identify where the corresponding ID links towards.
 */
export type ProjectPlatformType = "discord" | "roblox";

/**
 * A User Source is an enum that represents a user account from an external platform that is linked to a Top.gg user account.
 * Each source has a unique identifer type that we might validate against.
 *
 * If none is passed to any endpoint that accepts a source parameter, it will default to topgg.
 */
export type UserSource = "discord" | "topgg";

/**
 * Webhook scopes that are supported for integrations.
 *
 * These differ from integration webhook event types - these are the events that a user or you can subscribe to for an integration connection,
 * while the integration webhook event types are the events that are sent to your webhook endpoint when something happens with your integration connection (e.g., it's created or deleted).
 */
export type WebhookEventType = "webhook.test" | "vote.create";

export type WebhookEventTypes = WebhookEventType | IntegrationWebhookEventType;

/**
 * A locale supported for translated project fields (e.g., `headline`, `page_content`).
 */
export type Locale =
  | "en"
  | "de"
  | "fr"
  | "pt"
  | "tr"
  | "hi"
  | "ja"
  | "ar"
  | "nl"
  | "ko"
  | "it"
  | "es"
  | "ru"
  | "uk"
  | "vi"
  | "zh";

/**
 * All error responses follow the [`application/problem+json`](https://datatracker.ietf.org/doc/html/rfc7807) specification.
 */
export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
}

/**
 * Represents a user on Top.gg.
 */
export interface User {
  /**
   * The user's Top.gg ID.
   */
  id: Snowflake;
  /**
   * The user's platform ID (e.g., Discord ID).
   */
  platform_id: Snowflake;
  /**
   * The user's username.
   */
  name: string;
  /**
   * The URL of the user's avatar.
   */
  avatar_url: string;
}

/**
 * Base project information shared across all project-related responses.
 */
export interface BaseProject {
  /**
   * The project's Top.gg ID.
   */
  id: Snowflake;
  /**
   * The platform the project is on (e.g., "discord").
   */
  platform: ProjectPlatformType;
  /**
   * The platform-specific ID of the project (e.g., Discord Bot ID).
   */
  platform_id: Snowflake;
  /**
   * The type of project (e.g., "bot").
   */
  type: ProjectType;
}

/**
 * Represents a vote on Top.gg.
 */
export interface Vote {
  /**
   * The Top.gg ID of the user who voted.
   */
  user_id: Snowflake;
  /**
   * The user's ID on the project's platform (e.g., Discord ID).
   */
  platform_id: Snowflake;
  /**
   * The amount of votes this vote counted for.
   */
  weight: number;
  /**
   * The timestamp of when the user voted.
   */
  created_at: ISO8601Date;
  /**
   * The timestamp of when the vote expires (i.e., when the user can vote again).
   * This is typically 12 hours after the `created_at` timestamp, but may vary based on the user's voting history and other factors.
   */
  expires_at: ISO8601Date;
}

/**
 * Represents a vote for a specific project.
 */
export type ProjectVote = Vote;

/**
 * Base structure for webhook payloads.
 */
export interface WebhookPayloadBase<T extends WebhookEventTypes, Data extends object> {
  type: T;
  data: Data;
}
