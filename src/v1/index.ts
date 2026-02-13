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

// # Integration Types

/**
 * Data included when an integration connection is created.
 */
export interface IntegrationCreateData {
  /**
   * The unique identifier for this integration connection.
   */
  connection_id: string;
  /**
   * The webhook secret used to verify webhook requests from Top.gg for this connection.
   */
  webhook_secret: string;
  /**
   * The project this integration is connected to.
   */
  project: BaseProject;
  /**
   * The user who created this integration connection.
   */
  user: User;
}

/**
 * The payload delivered to your webhook endpoint when an integration connection is created.
 * This will be sent if a user clicks "Connect" for your integration on the dashboard.
 *
 * @see https://docs.top.gg/docs/API/v1/integrations#2-topgg-sends-integrationcreate
 */
export type IntegrationCreateWebhookPayload = WebhookPayloadBase<
  "integration.create",
  IntegrationCreateData
>;

/**
 * The response you must return from your webhook endpoint when you receive an `integration.create` event.
 * This tells Top.gg where to deliver webhook events for this integration connection and which events to deliver.
 *
 * @see https://docs.top.gg/docs/API/v1/integrations#3-respond-with-configuration
 */
export interface IntegrationCreateResponse {
  /**
   * The URL where Top.gg should deliver webhook events for this connection.
   */
  webhook_url: string;
  /**
   * An array of webhook scopes to subscribe to.
   *
   * @see https://docs.top.gg/docs/API/v1/webhooks#supported-scopes
   */
  routes: WebhookEventType[];
}

/**
 * Data included when an integration connection is deleted.
 */
export interface IntegrationDeleteData {
  /**
   * The unique identifier for the integration connection that was deleted.
   */
  connection_id: string;
}

/**
 * The payload delivered to your webhook endpoint when an integration connection is deleted.
 */
export type IntegrationDeleteWebhookPayload = WebhookPayloadBase<
  "integration.delete",
  IntegrationDeleteData
>;

// # Votes

/**
 * Data included when a vote is created.
 */
export interface VoteCreateData extends Vote {
  /**
   * The unique identifier for this vote.
   */
  id: Snowflake;
  /**
   * The project that was voted for.
   */
  project: BaseProject;
  /**
   * The user who voted.
   */
  user: User;
}

/**
 * The payload delivered to your webhook endpoint when a user votes for your project and you have subscribed to the `vote.create` event.
 */
export type VoteCreateWebhookPayload = WebhookPayloadBase<"vote.create", VoteCreateData>;

// ## Webhook Test Types

/**
 * Data included in a webhook test event.
 */
export interface WebhookTestData {
  /**
   * A test user.
   */
  user: User;
  /**
   * A test project.
   */
  project: BaseProject;
}

/**
 * The payload delivered to your webhook endpoint when you send a test webhook from the dashboard or via the API.
 */
export type WebhookTestWebhookPayload = WebhookPayloadBase<"webhook.test", WebhookTestData>;

export type WebhookPayload<T extends WebhookEventTypes = WebhookEventTypes> = Extract<
  | IntegrationCreateWebhookPayload
  | IntegrationDeleteWebhookPayload
  | VoteCreateWebhookPayload
  | WebhookTestWebhookPayload,
  { type: T }
>;

// # Projects

/**
 * Response for getting the authenticated project.
 *
 * - GET `/v1/projects/@me`
 *
 * @see https://docs.top.gg/docs/API/v1/projects#get-current-project
 */
export interface GetProjectResponse extends BaseProject {
  /**
   * The project's name.
   */
  name: string;
  /**
   * The project's headline/tagline.
   */
  headline: string;
  /**
   * Tags associated with the project.
   */
  tags: string[];
  /**
   * The number of votes this month.
   */
  votes: number;
  /**
   * The total number of votes all time.
   */
  votes_total: number;
  /**
   * The average review score.
   */
  review_score: number;
  /**
   * The number of reviews.
   */
  review_count: number;
}

/**
 * Query parameters for getting project votes.
 *
 * - GET `/v1/projects/@me/votes`
 *
 * Either `cursor` or `startDate` must be provided.
 *
 * @see https://docs.top.gg/docs/API/v1/projects/#get-votes
 */
export interface GetProjectVotesQuery {
  /**
   * Pagination cursor for fetching the next page of votes. if provided, `startDate` is ignored.
   *
   * From the previous response.
   */
  cursor?: string;
  /**
   * The start date for fetching votes. Only votes created after this date will be returned. Required if `cursor` is not provided.
   *
   * Maximum 1 year in the past.
   *
   * ISO 8601 date string.
   */
  startDate?: string;
}

/**
 * Response for the Get Project Votes endpoint.
 *
 * - GET `/v1/projects/@me/votes`
 *
 * @see https://docs.top.gg/docs/API/v1/projects/#get-votes
 */
export interface GetProjectVotesResponse {
  /**
   * Cursor for fetching the next page of votes.
   */
  cursor: string;
  /**
   * An array of votes for the project.
   */
  data: ProjectVote[];
}

/**
 * Query parameters for getting vote status by user.
 *
 * - GET `/v1/projects/@me/votes/:user_id`
 *
 * @see https://docs.top.gg/docs/API/v1/projects/#get-vote-status-by-user
 */
export interface GetVoteStatusByUserQuery {
  /**
   * The source of the user ID. Defaults to "topgg".
   */
  source?: UserSource;
}

/**
 * Response for the Get Vote Status By User endpoint.
 *
 * - GET `/v1/projects/@me/votes/:user_id`
 *
 * @see https://docs.top.gg/docs/API/v1/projects/#get-vote-status-by-user
 */
export interface GetVoteStatusByUserResponse {
  /**
   * The timestamp of when the user last voted.
   */
  created_at: ISO8601Date;
  /**
   * The timestamp of when the user's vote expires (i.e., when they can vote again).
   */
  expires_at: ISO8601Date;
  /**
   * The amount of votes this vote counted for.
   */
  weight: number;
}
