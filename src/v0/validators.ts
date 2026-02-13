import * as z from "zod/mini";
import { ISO8601DateSchema, SnowflakeSchema } from "@utils/validators";
export * from "@utils/validators";

// # Bases and Constants

/**
 * The type of a webhook event.
 */
export const WebhookEventTypeSchema = z.enum(["upvote", "test"]);

// # Webhooks - deprecated

/**
 * Webhook payload for bot votes (deprecated).
 *
 * @deprecated Use `v1` types instead.
 */
export const BotWebhookPayloadSchema = z.object({
  /**
   * Discord ID of the bot that received a vote.
   */
  bot: SnowflakeSchema,
  /**
   * Discord ID of the user that voted.
   */
  user: SnowflakeSchema,
  /**
   * The type of the vote (should always be "upvote" except when using the test button it's "test").
   */
  type: WebhookEventTypeSchema,
  /**
   * Whether the weekend multiplier is in effect, meaning users votes count as two.
   */
  isWeekend: z.boolean(),
  /**
   * Query string params found on the /bot/:ID/vote page.
   *
   * @example
   * "?a=1&b=2&c=3"
   */
  query: z.optional(z.string()),
});

/**
 * Webhook payload for server votes (deprecated).
 *
 * @deprecated Use `v1` types instead.
 */
export const ServerWebhookPayloadSchema = z.object({
  /**
   * Discord ID of the server that received a vote.
   */
  guild: SnowflakeSchema,
  /**
   * Discord ID of the user that voted.
   */
  user: SnowflakeSchema,
  /**
   * The type of the vote (should always be "upvote" except when using the test button it's "test").
   */
  type: WebhookEventTypeSchema,
  /**
   * Whether the weekend multiplier is in effect, meaning users votes count as two.
   */
  query: z.optional(z.string()),
});

// # Bots

/**
 * A bot listed on Top.gg.
 */
export const BotSchema = z.object({
  /**
   * The Discord ID of the bot
   */
  id: SnowflakeSchema,
  /**
   * The username of the bot
   */
  username: z.string(),
  /**
   * The discriminator of the bot (legacy Discord feature)
   */
  discriminator: z.string(),
  /**
   * The avatar hash of the bot's avatar
   */
  avatar: z.optional(z.string()),
  /**
   * The cdn hash of the bot's avatar if the bot has none
   */
  defAvatar: z.optional(z.string()),
  /**
   * The command prefix of the bot
   */
  prefix: z.string(),
  /**
   * The short description of the bot
   */
  shortdesc: z.string(),
  /**
   * The detailed long description of the bot
   */
  longdesc: z.optional(z.string()),
  /**
   * Array of tags associated with the bot
   */
  tags: z.array(z.string()),
  /**
   * The official website URL of the bot
   */
  website: z.optional(z.string()),
  /**
   * The support server URL for the bot
   */
  support: z.optional(z.string()),
  /**
   * The GitHub repository URL of the bot
   */
  github: z.optional(z.string()),
  /**
   * Array of snowflake identifiers of the bot owners
   */
  owners: z.array(SnowflakeSchema),
  /**
   * Array of guild snowflake identifiers where the bot is present
   */
  guilds: z.array(SnowflakeSchema),
  /**
   * The OAuth2 invite URL of the bot
   */
  invite: z.optional(z.string()),
  /**
   * The date when the bot was approved on Top.gg in ISO 8601 format
   */
  date: ISO8601DateSchema,
  /**
   * The amount of servers the bot has according to posted stats.
   */
  server_count: z.optional(z.number()),
  /**
   * The amount of shards the bot has according to posted stats.
   */
  shard_count: z.optional(z.number()),
  /**
   * Whether the bot is certified on Top.gg
   */
  certifiedBot: z.boolean(),
  /**
   * The vanity URL of the bot on Top.gg
   */
  vanity: z.optional(z.string()),
  /**
   * The amount of upvotes the bot has
   */
  points: z.number(),
  /**
   * The amount of upvotes the bot has this month
   */
  monthlyPoints: z.number(),
  /**
   * The guild id for the donatebot setup
   */
  donatebotguildid: SnowflakeSchema,
});

/**
 * Query parameters for searching bots on Top.gg.
 *
 * @see https://docs.top.gg/docs/API/v0/bot#search-bots
 */
export const GetSearchBotsQuerySchema = z.object({
  /**
   * The amount of bots to return.
   *
   * @minimum 1
   * @maximum 500
   * @default 50
   */
  limit: z.optional(z.number().check(z.minimum(1)).check(z.maximum(500))),
  /**
   * The amount of bots to skip (for pagination).
   *
   * @minimum 0
   * @default 0
   */
  offset: z.optional(z.number().check(z.minimum(0))),
  /**
   * The field to sort the bots by. Prefix with `-` for descending order.
   *
   * There is no documented default.
   */
  sort: z.string(),
  /**
   * Comma separated list of fields to include in the response. If not provided, all fields will be included.
   */
  fields: z.optional(z.string()),
});

/**
 * Response for searching bots on Top.gg.
 */
export const GetSearchBotsResponseSchema = z.object({
  /**
   * The array of bots that match the search query.
   */
  results: z.array(BotSchema),
  /**
   * The total number of bots that match the search query.
   */
  total: z.number(),
  /**
   * The limit used in the query.
   */
  limit: z.number(),
  /**
   * The amount of bots skipped (for pagination).
   */
  offset: z.number(),
  /**
   * The amount of items in the current page of results.
   */
  count: z.number(),
});

/**
 * Response for getting a bot.
 *
 * - GET `/bots/:bot_id`
 */
export const GetBotResponseSchema = BotSchema;

/**
 * A bot voter.
 */
export const BotVoterSchema = z.object({
  /**
   * The Discord ID of the user that voted.
   */
  id: SnowflakeSchema,
  /**
   * The username of the user that voted, including discriminator (e.g., "wumpus#0000").
   */
  username: z.string(),
  /**
   * The avatar hash of the user that voted.
   */
  avatar: z.optional(z.string()),
});

/**
 * Gets the last 1000 voters for your bot.
 *
 * - GET `/bots/:bot_id/votes`
 */
export const GetLast1000BotVotesResponseSchema = z.array(BotVoterSchema);

/**
 * Specific stats about a bot.
 *
 * - GET `/bots/:bot_id/stats`
 */
export const GetBotStatsResponseSchema = z.object({
  /**
   * The amount of servers the bot is in
   */
  server_count: z.optional(z.number()),
  /**
   * The amount of servers the bot is in per shard. Always present but can be empty.
   */
  shards: z.array(z.number()),
  /**
   * The amount of shards a bot has according to posted stats.
   */
  shard_count: z.optional(z.number()),
});

/**
 * Query parameters for checking whether or not a user has voted for your bot.
 *
 * - GET `/bots/:bot_id/check`
 */
export const GetUserVoteCheckQuerySchema = z.object({
  /**
   * The Discord ID of the user to check for a vote.
   */
  userId: SnowflakeSchema,
});

/**
 * Response for checking whether or not a user has voted for your bot.
 *
 * - GET `/bots/:bot_id/check`
 */
export const GetUserVoteCheckResponseSchema = z.object({
  /**
   * 0 if the user has not voted for this bot in the last 12 hours, 1 if they have.
   */
  voted: z.xor([z.literal(0), z.literal(1)]),
});

/**
 * Request body for posting bot stats.
 */
export const PostBotStatsBodySchema = z.object({
  /**
   * The amount of servers the bot is in. Required if the bot has less than 100 servers, otherwise optional but recommended.
   *
   * If an Array, it acts like shards.
   */
  server_count: z.xor([z.number(), z.array(z.number())]),
  /**
   * Amount of servers the bot is in per shard.
   */
  shards: z.optional(z.array(z.number())),
  /**
   * The zero-indexed id of the shard posting. Makes server_count set the shard specific server count.
   */
  shard_id: z.optional(z.number()),
  /**
   * The amount of shards the bot has.
   */
  shard_count: z.optional(z.number()),
});

// # Users

/**
 * A user on Top.gg.
 *
 * - GET `/users/:user_id`
 */
export const UserSchema = z.object({
  /**
   * The Discord ID for this user.
   */
  id: SnowflakeSchema,
  /**
   * The username of the user, not including discriminator (e.g., "wumpus").
   */
  username: z.string(),
  /**
   * The discriminator of the user (legacy Discord feature, e.g., "0000").
   */
  discriminator: z.string(),
  /**
   * The avatar hash of the user's avatar.
   */
  avatar: z.optional(z.string()),
  /**
   * The cdn hash of the user's avatar if the user has none.
   */
  defAvatar: z.optional(z.string()),
  /**
   * The bio of the user. This is a short description that the user can set on their profile. It may be empty or null if the user has not set a bio.
   *
   * This is NOT their in-discord bio.
   */
  bio: z.optional(z.string()),
  /**
   * The banner image URL of the user.
   */
  banner: z.optional(z.string()),
  /**
   * The social usernames of the user
   */
  social: z.object({
    /**
     * The YouTube channel ID of the user. This is not the full URL, just the channel ID (e.g., "UC_x5XG1OV2P6uZZ5FSM9Ttw").
     */
    youtube: z.optional(z.string()),
    /**
     * The Reddit username of the user (e.g., "spez"). This is not the full URL, just the username.
     */
    reddit: z.optional(z.string()),
    /**
     * The Twitter username of the user (e.g., "jack"). This is not the full URL, just the username.
     */
    twitter: z.optional(z.string()),
    /**
     * The Instagram username of the user (e.g., "instagram"). This is not the full URL, just the username.
     */
    instagram: z.optional(z.string()),
    /**
     * The GitHub username of the user (e.g., "torvalds"). This is not the full URL, just the username.
     */
    github: z.optional(z.string()),
  }),
  /**
   * The custom hex color of the user (not guaranteed to be valid hex). This is a color that the user can set on their profile.
   */
  color: z.optional(z.string()),
  /**
   * The supporter status of the user. This is true if the user has voted for any bot in the last month.
   */
  supporter: z.boolean(),
  /**
   * The certified status of the user.
   */
  certifiedDev: z.boolean(),
  /**
   * The mod status of the user. This is true if the user is a moderator on Top.gg.
   */
  mod: z.boolean(),
  /**
   * The website moderator status of the user. This is true if the user is a website moderator on Top.gg.
   */
  webMod: z.boolean(),
  /**
   * The admin status of the user.
   */
  admin: z.boolean(),
});
