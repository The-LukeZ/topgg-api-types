// # Projects

import type { ISO8601Date } from "@src/utils";
import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import type { BaseProject, Locale, ProjectVote, UserSource } from "./base";

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
