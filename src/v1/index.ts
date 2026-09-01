// # General and Base Types

import type { ISO8601Date, Snowflake } from "@src/utils";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

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
 * @see https://docs.top.gg/webhooks/integrations#the-handshake-flow
 */
export type IntegrationCreateWebhookPayload = WebhookPayloadBase<
  "integration.create",
  IntegrationCreateData
>;

/**
 * The response you must return from your webhook endpoint when you receive an `integration.create` event.
 * This tells Top.gg where to deliver webhook events for this integration connection and which events to deliver.
 *
 * @see https://docs.top.gg/webhooks/integrations#the-handshake-flow
 */
export interface IntegrationCreateResponse {
  /**
   * The URL where Top.gg should deliver webhook events for this connection.
   */
  webhook_url: string;
  /**
   * An array of webhook scopes to subscribe to.
   *
   * @see https://docs.top.gg/webhooks/events
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
export interface VoteCreateData {
  /**
   * The unique identifier for this vote.
   */
  id: Snowflake;
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
  /**
   * The project that was voted for.
   */
  project: BaseProject;
  /**
   * The parsed query string parameters found on the `/:id/vote` page.
   *
   * @example
   * // for `/:id/vote?key1=value&key2=value2`
   * { key1: "value", key2: "value2" }
   */
  query?: Record<string, string>;
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
 * @see https://docs.top.gg/api/v1/projects#get-projectsme
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
 * @see https://docs.top.gg/api/v1/votes#get-projectsme-votes
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
 * @see https://docs.top.gg/api/v1/votes#get-projectsme-votes
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
 * @see https://docs.top.gg/api/v1/votes#get-projectsme-votesuser_id
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
 * @see https://docs.top.gg/api/v1/votes#get-projectsme-votesuser_id
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

// # Project Management

/**
 * Request body for updating the authenticated project's headline and/or page content.
 * At least one of `headline` or `page_content` must be provided.
 *
 * - PATCH `/v1/projects/@me`
 *
 * @see https://docs.top.gg/api/v1/projects#patch-projectsme
 */
export interface UpdateProjectBody {
  /**
   * Locale-keyed headline/tagline strings.
   *
   * @minimum 3
   * @maximum 140
   */
  headline?: Partial<Record<Locale, string>>;
  /**
   * Locale-keyed page content in Markdown.
   *
   * @minimum 300
   * @maximum 50000
   */
  page_content?: Partial<Record<Locale, string>>;
}

/**
 * The category of a project announcement.
 */
export type AnnouncementCategory = "announcement" | "event" | "new_feature";

/**
 * Request body for creating a project announcement.
 *
 * - POST `/v1/projects/@me/announcements`
 *
 * @see https://docs.top.gg/api/v1/projects#post-projectsmeannouncements
 */
export interface CreateProjectAnnouncementBody {
  /**
   * The announcement title.
   *
   * @minimum 3
   * @maximum 100
   */
  title: string;
  /**
   * The announcement content.
   *
   * @minimum 10
   * @maximum 2000
   */
  content: string;
  /**
   * The announcement category. Defaults to "announcement".
   */
  category?: AnnouncementCategory;
}

/**
 * Response for creating a project announcement.
 *
 * - POST `/v1/projects/@me/announcements`
 *
 * @see https://docs.top.gg/api/v1/projects#post-projectsmeannouncements
 */
export interface CreateProjectAnnouncementResponse {
  /**
   * The announcement title.
   */
  title: string;
  /**
   * The announcement content.
   */
  content: string;
  /**
   * The timestamp of when the announcement was created.
   */
  created_at: ISO8601Date;
}

/**
 * Metrics payload for a Discord bot project.
 * At least one of `server_count` or `shard_count` must be provided.
 */
export interface DiscordBotMetrics {
  /**
   * The amount of servers the bot is in.
   *
   * @minimum 0
   */
  server_count?: number;
  /**
   * The amount of shards the bot has.
   *
   * @minimum 0
   */
  shard_count?: number;
}

/**
 * Metrics payload for a Discord server project.
 * At least one of `member_count` or `online_count` must be provided.
 * `online_count` cannot exceed `member_count` when both are provided.
 */
export interface DiscordServerMetrics {
  /**
   * The amount of members in the server.
   *
   * @minimum 0
   */
  member_count?: number;
  /**
   * The amount of online members in the server.
   *
   * @minimum 0
   */
  online_count?: number;
}

/**
 * Metrics payload for a Roblox game project.
 */
export interface RobloxGameMetrics {
  /**
   * The amount of players currently in the game.
   *
   * @minimum 0
   */
  player_count: number;
}

/**
 * Request body for updating the authenticated project's current metrics.
 * The shape used must match the project's own `platform`/`type` combination -
 * the API does not accept a discriminant field to disambiguate.
 *
 * - PATCH `/v1/projects/@me/metrics`
 *
 * @see https://docs.top.gg/api/v1/projects#patch-projectsmemetrics
 */
export type UpdateProjectMetricsBody = DiscordBotMetrics | DiscordServerMetrics | RobloxGameMetrics;

/**
 * A single entry in a metrics batch submission.
 */
export interface ProjectMetricsBatchEntry {
  /**
   * The metrics payload for this entry. Must match the project's `platform`/`type`.
   */
  metrics: UpdateProjectMetricsBody;
  /**
   * The timestamp this entry applies to, for backfilling. Cannot exceed 5 minutes in the future.
   * Entries without a timestamp are applied first, in request order; timestamped entries are
   * applied afterward, in chronological order.
   */
  timestamp?: ISO8601Date;
}

/**
 * Request body for submitting up to 100 metrics entries in a single batch.
 *
 * - POST `/v1/projects/@me/metrics/batch`
 *
 * @see https://docs.top.gg/api/v1/projects#post-projectsmemetricsbatch
 */
export interface UpdateProjectMetricsBatchBody {
  /**
   * The metrics entries to submit.
   *
   * @minimum 1
   * @maximum 100
   */
  data: ProjectMetricsBatchEntry[];
}

/**
 * Request body for overwriting the authenticated Discord bot project's slash commands.
 * Only applicable to projects with `platform: "discord"` and `type: "bot"`.
 * Pass an empty array to clear all commands.
 *
 * - PUT `/v1/projects/@me/commands`
 *
 * @see https://docs.top.gg/api/v1/projects#put-projectsmecommands
 */
export type UpdateProjectCommandsBody = RESTPostAPIApplicationCommandsJSONBody[];

// # OAuth
//
// Types based on Top.gg's published OAuth 2.1 documentation (2026-09).

/**
 * Scopes that can be requested when registering an OAuth app and sending users through the consent screen.
 * Access is scoped - only request the scopes you actually use. A `write` scope includes its `read`
 * counterpart (e.g. `project.webhooks.write` also allows listing webhooks).
 *
 * `user.*` scopes apply to the authorizing user. `project.*` scopes apply to every project the user
 * selected during authorization.
 */
export type OAuthScope =
  | "user.identify"
  | "user.projects.read"
  | "user.projects.write"
  | "project.information.read"
  | "project.information.write"
  | "project.votes.read"
  | "project.metrics.write"
  | "project.announcements.write"
  | "project.webhooks.read"
  | "project.webhooks.write"
  | "project.integrations.read"
  | "project.integrations.write";

/**
 * Query parameters for sending a user to the Top.gg OAuth authorization page.
 *
 * - GET `https://top.gg/oauth2/authorize`
 *
 * @see https://docs.top.gg/oauth/authorization
 */
export interface OAuthAuthorizeQuery {
  /**
   * Your OAuth app's client ID.
   */
  client_id: string;
  /**
   * Must be `code`.
   */
  response_type: "code";
  /**
   * One of the redirect URIs registered for your application. Must match exactly.
   */
  redirect_uri: string;
  /**
   * The scopes to request, space-separated. Request only what your application uses.
   */
  scope: string;
  /**
   * An opaque value you generate per authorization request. Echoed back unchanged on the callback -
   * verify it to prevent CSRF.
   */
  state: string;
  /**
   * PKCE challenge: `base64url(sha256(code_verifier))` without padding, where `code_verifier` is a
   * random string of 43 to 128 characters.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7636
   */
  code_challenge: string;
  /**
   * Must be `S256`.
   */
  code_challenge_method: "S256";
  /**
   * Top.gg project ID to preselect on the consent screen. The user can change the selection.
   */
  project_id?: Snowflake;
  /**
   * Platform for `platform_id`, e.g. `discord`. Use both together when you know the external ID but
   * not the Top.gg project ID.
   */
  platform?: ProjectPlatformType;
  /**
   * External ID on `platform`, e.g. a Discord bot ID. The matching project is preselected on the
   * consent screen, same behavior as `project_id`. Unknown IDs are ignored.
   */
  platform_id?: Snowflake;
}

/**
 * The OAuth 2.1 grant type used for a token request.
 */
export type OAuthGrantType = "authorization_code" | "refresh_token";

/**
 * Request body for exchanging an authorization code for an access token (Authorization Code + PKCE flow).
 * `client_secret` may be omitted if sent instead as HTTP Basic authentication.
 *
 * - POST `/v1/oauth2/token`
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7636
 */
export interface OAuthAuthorizationCodeTokenRequestBody {
  grant_type: "authorization_code";
  /**
   * The authorization code returned from the consent screen redirect. Single use, expires after 60 seconds.
   */
  code: string;
  /**
   * Must match the `redirect_uri` used in the initial authorization request.
   */
  redirect_uri: string;
  /**
   * Your OAuth app's client ID.
   */
  client_id: string;
  /**
   * Your OAuth app's client secret. Can be sent as HTTP Basic authentication instead.
   */
  client_secret?: string;
  /**
   * The PKCE code verifier corresponding to the `code_challenge` sent in the initial authorization request.
   */
  code_verifier: string;
}

/**
 * Request body for exchanging a refresh token for a new access token.
 * Refresh tokens rotate on use - store the new `refresh_token` from the response and discard the old one.
 * `client_secret` may be omitted if sent instead as HTTP Basic authentication.
 *
 * - POST `/v1/oauth2/token`
 */
export interface OAuthRefreshTokenRequestBody {
  grant_type: "refresh_token";
  /**
   * The refresh token from a previous token response.
   */
  refresh_token: string;
  /**
   * Your OAuth app's client ID.
   */
  client_id: string;
  /**
   * Your OAuth app's client secret. Can be sent as HTTP Basic authentication instead.
   */
  client_secret?: string;
}

/**
 * Request body for the OAuth token endpoint. Shape depends on `grant_type`.
 *
 * - POST `/v1/oauth2/token`
 */
export type OAuthTokenRequestBody =
  OAuthAuthorizationCodeTokenRequestBody | OAuthRefreshTokenRequestBody;

/**
 * The project an OAuth authorization was granted for, as included in the initial code exchange response.
 */
export interface OAuthProject extends BaseProject {
  /**
   * The project's name.
   */
  name: string;
}

/**
 * Response from the OAuth token endpoint.
 *
 * - POST `/v1/oauth2/token`
 */
export interface OAuthTokenResponse {
  /**
   * The access token to use as a `Bearer` token for API requests. Valid for 7 days.
   */
  access_token: string;
  token_type: "Bearer";
  /**
   * Seconds until `access_token` expires.
   */
  expires_in: number;
  /**
   * Rotates on every use - the previous refresh token is invalidated once a new one is issued.
   */
  refresh_token: string;
  /**
   * Space-separated list of scopes actually granted, which may be narrower than what was requested
   * if the user declined some scopes on the consent screen.
   */
  scope: string;
  /**
   * The project the user granted. Not present on refresh responses.
   */
  project?: OAuthProject;
}

/**
 * Request body for revoking an OAuth authorization by its refresh token. Revokes the whole
 * authorization and every access token issued for it.
 *
 * - POST `/v1/oauth2/revoke`
 */
export interface OAuthRevokeRequestBody {
  /**
   * The refresh token identifying the authorization to revoke.
   */
  token: string;
  /**
   * Your OAuth app's client ID.
   */
  client_id: string;
  /**
   * Your OAuth app's client secret.
   */
  client_secret: string;
}

/**
 * Error response from the OAuth token endpoint, per RFC 6749 Section 5.2.
 * Distinct from `ErrorResponse`, which covers the rest of the API.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
 */
export interface OAuthErrorResponse {
  error: string;
  error_description?: string;
  error_uri?: string;
}
