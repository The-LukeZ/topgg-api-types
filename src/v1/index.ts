import * as z from "zod/mini";
import { ISO8601DateSchema, SnowflakeSchema } from "@utils/index";

// # General and Base Schemas

// ## Enums and Constants

/**
 * The type of a webhook event. This is used to identify the type of the event that is being delivered to your webhook endpoint.
 *
 * Not all webhook events are allowed to be set by an integration - use the `SupportedWebhookScopes` enum to find out which events you can subscribe to as an integration.
 */
export const WebhookEventTypeSchema = z.enum([
  "webhook.test",
  "integration.create",
  "integration.delete",
  "vote.create",
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

export const IntegrationSupportedWebhookScopesSchema = z.enum(["webhook.test", "vote.create"]);

/**
 * All error responses follow the [`application/problem+json`](https://datatracker.ietf.org/doc/html/rfc7807) specification.
 */
export const ErrorSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
});

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
 *
 */
export const ProjectVoteSchema = z.clone(VoteSchema);

export const WebhookPayloadBaseSchema = <
  T extends z.infer<typeof WebhookEventTypeSchema>,
  Data extends z.ZodMiniObject,
>(
  type: T,
  data: Data
) =>
  z.object({
    type: z.literal(type),
    data: data,
  });

// # Specific Schemas

// ## Integration Schemas

export const IntegrationCreateDataSchema = z.object({
  connection_id: SnowflakeSchema,
  webhook_secret: z.string().check(z.regex(/^whs_[a-zA-Z0-9]+$/, "Invalid webhook secret")),
  project: BaseProjectSchema,
  user: UserSchema,
});

/**
 * The payload delivered to your webhook endpoint when an integration connection is created.
 * This will be sent if a user clicks "Connect" for your integration on the dashboard.
 *
 * @see https://docs.top.gg/docs/API/v1/integrations#2-topgg-sends-integrationcreate
 */
export const IntegrationCreateWebhookPayloadSchema = WebhookPayloadBaseSchema(
  "integration.create",
  IntegrationCreateDataSchema
);

/**
 * The response you must return from your webhook endpoint when you receive an `integration.create` event.
 * This tells Top.gg where to deliver webhook events for this integration connection and which events to deliver.
 *
 * @see https://docs.top.gg/docs/API/v1/integrations#3-respond-with-configuration
 */
export const IntegrationCreateResponseSchema = z.object({
  /**
   * The URL where Top.gg should deliver webhook events for this connection.
   */
  webhook_url: z.url(),
  /**
   * An array of webhook scopes to subscribe to.
   *
   * @see https://docs.top.gg/docs/API/v1/webhooks#supported-scopes
   */
  routes: z
    .array(IntegrationSupportedWebhookScopesSchema)
    .check(
      z.refine(
        (arr) => arr.length === new Set(arr).size,
        "Duplicate webhook scopes are not allowed"
      )
    ),
});

export const IntegrationDeleteDataSchema = z.object({
  connection_id: SnowflakeSchema,
});

/**
 * The payload delivered to your webhook endpoint when an integration connection is deleted.
 */
export const IntegrationDeleteWebhookPayloadSchema = WebhookPayloadBaseSchema(
  "integration.delete",
  IntegrationDeleteDataSchema
);

// ## Vote Schemas

export const VoteCreateDataSchema = z.extend(VoteSchema, {
  project: BaseProjectSchema,
  user: UserSchema,
});

/**
 * The payload delivered to your webhook endpoint when a user votes for your project and you have subscribed to the `vote.create` event.
 */
export const VoteCreateWebhookPayloadSchema = WebhookPayloadBaseSchema(
  "vote.create",
  VoteCreateDataSchema
);

// ## Webhook Test Schemas

export const WebhookTestDataSchema = z.object({
  user: UserSchema,
  project: BaseProjectSchema,
});

/**
 * The payload delivered to your webhook endpoint when you send a test webhook from the dashboard or via the API.
 */
export const WebhookTestWebhookPayloadSchema = WebhookPayloadBaseSchema(
  "webhook.test",
  WebhookTestDataSchema
);

// ## Projects

/**
 * Gets the authenticated project.
 *
 * - GET `/v1/projects/@me`
 *
 * @see https://docs.top.gg/docs/API/v1/projects#get-current-project
 */
export const GetProjectResponseSchema = z.extend(BaseProjectSchema, {
  name: z.string(),
  headline: z.string(),
  tags: z.array(z.string()),
  votes: z.number(),
  votes_total: z.number(),
  review_score: z.number(),
  review_count: z.number(),
});

/**
 * Gets a cursor-based paginated list of votes for the authenticated project, ordered by creation date.
 *
 * - GET `/v1/projects/@me/votes`
 *
 * @see https://docs.top.gg/docs/API/v1/projects/#get-votes
 */
export const GetProjectVotesQuerySchema = z
  .object({
    /**
     * Pagination cursor for fetching the next page of votes. if provided, `startDate` is ignored.
     *
     * From the previous response.
     */
    cursor: z.optional(z.string()),
    /**
     * The start date for fetching votes. Only votes created after this date will be returned. Required if `cursor` is not provided.
     *
     * Maximum 1 year in the past.
     */
    startDate: z.optional(ISO8601DateSchema),
  })
  .check(
    z.refine((data) => data.cursor || data.startDate, "Either cursor or startDate must be provided")
  );

/**
 * Response schema for the Get Project Votes endpoint.
 *
 * - GET `/v1/projects/@me/votes`
 *
 * @see https://docs.top.gg/docs/API/v1/projects/#get-votes
 */
export const GetProjectVotesResponseSchema = z.object({
  /**
   * Cursor for fetching the next page of votes.
   */
  cursor: z.string(),
  /**
   * An array of votes for the project.
   */
  data: z.array(ProjectVoteSchema),
});

/**
 * Gets the vote status of a user for the authenticated project.
 *
 * - GET `/v1/projects/@me/votes/:user_id`
 *
 * @see https://docs.top.gg/docs/API/v1/projects/#get-vote-status-by-user
 */
export const GetVoteStatusByUserQuerySchema = z.object({
  source: z.optional(UserSourceSchema),
});

/**
 * Response schema for the Get Vote Status By User endpoint.
 *
 * - GET `/v1/projects/@me/votes/:user_id`
 *
 * @see https://docs.top.gg/docs/API/v1/projects/#get-vote-status-by-user
 */
export const GetVoteStatusByUserResponseSchema = z.object({
  /**
   * The timestamp of when the user last voted.
   */
  created_at: ISO8601DateSchema,
  /**
   * The timestamp of when the user's vote expires (i.e., when they can vote again).
   */
  expires_at: ISO8601DateSchema,
  /**
   * The amount of votes this vote counted for.
   */
  weight: z.number(),
});
