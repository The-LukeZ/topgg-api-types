// # Project Schemas

import * as z from "zod/mini";
import { ISO8601DateSchema } from "@utils/validators";
import { BaseProjectSchema, LocaleSchema, ProjectVoteSchema, UserSourceSchema } from "./base";

/**
 * A project covered by the current credential, as returned by the project list endpoint.
 */
export const ListedProjectSchema = z.extend(BaseProjectSchema, {
  /**
   * The project's name.
   */
  name: z.string(),
});

/**
 * Query parameters for listing the projects covered by the current credential.
 *
 * - GET `/v1/projects`
 *
 * @see https://docs.top.gg/api/v1/projects#get-projects
 */
export const GetProjectsQuerySchema = z.object({
  /**
   * Pagination cursor for fetching the next page. Only meaningful with an application token.
   *
   * From the previous response.
   */
  cursor: z.optional(z.string()),
});

/**
 * Response schema for listing the projects covered by the current credential.
 *
 * With an OAuth access token this is the single project of the authorization. With an
 * application token this is every project granted to the application, 100 per page.
 * Not available with project tokens.
 *
 * - GET `/v1/projects`
 *
 * @see https://docs.top.gg/api/v1/projects#get-projects
 */
export const GetProjectsResponseSchema = z.object({
  /**
   * The covered projects.
   */
  projects: z.array(ListedProjectSchema),
  /**
   * Pagination cursor for fetching the next page. Present while more pages exist. Only
   * meaningful with an application token.
   */
  cursor: z.optional(z.string()),
});

/**
 * Response schema for getting the authenticated project.
 *
 * - GET `/v1/projects/@me`
 *
 * @see https://docs.top.gg/api/v1/projects#get-projectsme
 */
export const GetProjectResponseSchema = z.extend(BaseProjectSchema, {
  /**
   * The project's name.
   */
  name: z.string(),
  /**
   * The project's headline/tagline.
   */
  headline: z.string(),
  /**
   * Tags associated with the project.
   */
  tags: z.array(z.string()),
  /**
   * The number of votes this month.
   */
  votes: z.number(),
  /**
   * The total number of votes all time.
   */
  votes_total: z.number(),
  /**
   * The average review score.
   */
  review_score: z.number(),
  /**
   * The number of reviews.
   */
  review_count: z.number(),
});

/**
 * Query parameters for getting project votes.
 *
 * - GET `/v1/projects/@me/votes`
 *
 * Either `cursor` or `startDate` must be provided.
 *
 * @see https://docs.top.gg/api/v1/votes#get-projectsme-votes
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
     *
     * ISO 8601 date string.
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
 * @see https://docs.top.gg/api/v1/votes#get-projectsme-votes
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
 * Query parameters for getting vote status by user.
 *
 * - GET `/v1/projects/@me/votes/:user_id`
 *
 * @see https://docs.top.gg/api/v1/votes#get-projectsme-votesuser_id
 */
export const GetVoteStatusByUserQuerySchema = z.object({
  /**
   * The source of the user ID. Defaults to "topgg".
   */
  source: z.optional(UserSourceSchema),
});

/**
 * Response schema for the Get Vote Status By User endpoint.
 *
 * - GET `/v1/projects/@me/votes/:user_id`
 *
 * @see https://docs.top.gg/api/v1/votes#get-projectsme-votesuser_id
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

// ## Project Management Schemas

/**
 * Request body for updating the authenticated project's headline and/or page content.
 * At least one of `headline` or `page_content` must be provided.
 *
 * - PATCH `/v1/projects/@me`
 *
 * @see https://docs.top.gg/api/v1/projects#patch-projectsme
 */
export const UpdateProjectBodySchema = z
  .object({
    /**
     * Locale-keyed headline/tagline strings.
     */
    headline: z.optional(
      z.partialRecord(LocaleSchema, z.string().check(z.minLength(3), z.maxLength(140)))
    ),
    /**
     * Locale-keyed page content in Markdown.
     */
    page_content: z.optional(
      z.partialRecord(LocaleSchema, z.string().check(z.minLength(300), z.maxLength(50000)))
    ),
  })
  .check(
    z.refine(
      (data) => Boolean(data.headline) || Boolean(data.page_content),
      "Either headline or page_content must be provided"
    )
  );

/**
 * The category of a project announcement.
 */
export const AnnouncementCategorySchema = z.enum(["announcement", "event", "new_feature"]);

/**
 * Request body for creating a project announcement.
 *
 * - POST `/v1/projects/@me/announcements`
 *
 * @see https://docs.top.gg/api/v1/projects#post-projectsmeannouncements
 */
export const CreateProjectAnnouncementBodySchema = z.object({
  /**
   * The announcement title.
   */
  title: z.string().check(z.minLength(3), z.maxLength(100)),
  /**
   * The announcement content.
   */
  content: z.string().check(z.minLength(10), z.maxLength(2000)),
  /**
   * The announcement category. Defaults to "announcement".
   */
  category: z.optional(AnnouncementCategorySchema),
});

/**
 * Response for creating a project announcement.
 *
 * - POST `/v1/projects/@me/announcements`
 *
 * @see https://docs.top.gg/api/v1/projects#post-projectsmeannouncements
 */
export const CreateProjectAnnouncementResponseSchema = z.object({
  /**
   * The announcement title.
   */
  title: z.string(),
  /**
   * The announcement content.
   */
  content: z.string(),
  /**
   * The timestamp of when the announcement was created.
   */
  created_at: ISO8601DateSchema,
});

/**
 * Metrics payload for a Discord bot project.
 * At least one of `server_count` or `shard_count` must be provided.
 */
export const DiscordBotMetricsSchema = z
  .object({
    /**
     * The amount of servers the bot is in.
     */
    server_count: z.optional(z.number().check(z.minimum(0))),
    /**
     * The amount of shards the bot has.
     */
    shard_count: z.optional(z.number().check(z.minimum(0))),
  })
  .check(
    z.refine(
      (data) => data.server_count !== undefined || data.shard_count !== undefined,
      "Either server_count or shard_count must be provided"
    )
  );

/**
 * Metrics payload for a Discord server project.
 * At least one of `member_count` or `online_count` must be provided.
 * `online_count` cannot exceed `member_count` when both are provided.
 */
export const DiscordServerMetricsSchema = z
  .object({
    /**
     * The amount of members in the server.
     */
    member_count: z.optional(z.number().check(z.minimum(0))),
    /**
     * The amount of online members in the server.
     */
    online_count: z.optional(z.number().check(z.minimum(0))),
  })
  .check(
    z.refine(
      (data) => data.member_count !== undefined || data.online_count !== undefined,
      "Either member_count or online_count must be provided"
    ),
    z.refine(
      (data) =>
        data.member_count === undefined ||
        data.online_count === undefined ||
        data.online_count <= data.member_count,
      "online_count cannot exceed member_count"
    )
  );

/**
 * Metrics payload for a Roblox game project.
 */
export const RobloxGameMetricsSchema = z.object({
  /**
   * The amount of players currently in the game.
   */
  player_count: z.number().check(z.minimum(0)),
});

/**
 * Request body for updating the authenticated project's current metrics.
 * The shape used must match the project's own `platform`/`type` combination -
 * the API does not accept a discriminant field to disambiguate.
 *
 * - PATCH `/v1/projects/@me/metrics`
 *
 * @see https://docs.top.gg/api/v1/projects#patch-projectsmemetrics
 */
export const UpdateProjectMetricsBodySchema = z.union([
  DiscordBotMetricsSchema,
  DiscordServerMetricsSchema,
  RobloxGameMetricsSchema,
]);

/**
 * A single entry in a metrics batch submission.
 */
export const ProjectMetricsBatchEntrySchema = z.object({
  /**
   * The metrics payload for this entry. Must match the project's `platform`/`type`.
   */
  metrics: UpdateProjectMetricsBodySchema,
  /**
   * The timestamp this entry applies to, for backfilling. Cannot exceed 5 minutes in the future.
   */
  timestamp: z.optional(ISO8601DateSchema),
});

/**
 * Request body for submitting up to 100 metrics entries in a single batch.
 *
 * - POST `/v1/projects/@me/metrics/batch`
 *
 * @see https://docs.top.gg/api/v1/projects#post-projectsmemetricsbatch
 */
export const UpdateProjectMetricsBatchBodySchema = z.object({
  /**
   * The metrics entries to submit.
   */
  data: z.array(ProjectMetricsBatchEntrySchema).check(z.minLength(1), z.maxLength(100)),
});

/**
 * Permissive schema for a single Discord slash command definition.
 * Intentionally does not replicate Discord's full application command spec -
 * the source of truth for exact shape is `discord-api-types`/Discord's own docs.
 */
export const ApplicationCommandSchema = z.looseObject({
  name: z.string(),
  description: z.optional(z.string()),
  type: z.optional(z.number()),
  options: z.optional(z.array(z.unknown())),
  default_member_permissions: z.optional(z.nullable(z.string())),
  dm_permission: z.optional(z.nullable(z.boolean())),
  nsfw: z.optional(z.boolean()),
});

/**
 * Request body for overwriting the authenticated Discord bot project's slash commands.
 * Only applicable to projects with `platform: "discord"` and `type: "bot"`.
 * Pass an empty array to clear all commands.
 *
 * - PUT `/v1/projects/@me/commands`
 *
 * @see https://docs.top.gg/api/v1/projects#put-projectsmecommands
 */
export const UpdateProjectCommandsBodySchema = z.array(ApplicationCommandSchema);
