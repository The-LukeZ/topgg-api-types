import type { ISO8601Date, Snowflake } from "@src/utils";

// # Bases and Constants

export type WebhookEventType = "upvote" | "test";

// # Webhooks - deprecated

/**
 * @see https://docs.top.gg/docs/Resources/webhooks#bot-webhooks
 * @deprecated Use `v1` types instead.
 */
export interface BotWebhookPayload {
  /**
   * Discord ID of the bot that received a vote.
   */
  bot: Snowflake;
  /**
   * Discord ID of the user that voted.
   */
  user: Snowflake;
  /**
   * The type of the vote (should always be "upvote" except when using the test button it's "test").
   */
  type: WebhookEventType;
  /**
   * Whether the weekend multiplier is in effect, meaning users votes count as two.
   */
  isWeekend: boolean;
  /**
   * Query string params found on the /bot/:ID/vote page.
   *
   * @example
   * "?a=1&b=2&c=3"
   */
  query?: string;
}

/**
 * @see https://docs.top.gg/docs/Resources/webhooks#server-webhooks
 * @deprecated Use `v1` types instead.
 */
export interface ServerWebhookPayload {
  /**
   * Discord ID of the server that received a vote.
   */
  guild: Snowflake;
  /**
   * Discord ID of the user that voted.
   */
  user: Snowflake;
  /**
   * The type of the vote (should always be "upvote" except when using the test button it's "test").
   */
  type: WebhookEventType;
  /**
   * Whether the weekend multiplier is in effect, meaning users votes count as two.
   */
  query?: string;
}

// # Bots

/**
 * A bot listed on Top.gg.
 */
export interface Bot {
  /**
   * The Discord ID of the bot
   */
  id: Snowflake;
  /**
   * The username of the bot
   */
  username: string;
  /**
   * The discriminator of the bot (legacy Discord feature)
   */
  discriminator: string;
  /**
   * The avatar hash of the bot's avatar
   */
  avatar?: string;
  /**
   * The cdn hash of the bot's avatar if the bot has none
   */
  defAvatar?: string;
  /**
   * The command prefix of the bot
   */
  prefix: string;
  /**
   * The short description of the bot
   */
  shortdesc: string;
  /**
   * The detailed long description of the bot
   */
  longdesc?: string;
  /**
   * Array of tags associated with the bot
   */
  tags: string[];
  /**
   * The official website URL of the bot
   */
  website?: string;
  /**
   * The support server URL for the bot
   */
  support?: string;
  /**
   * The GitHub repository URL of the bot
   */
  github?: string;
  /**
   * Array of snowflake identifiers of the bot owners
   */
  owners: Snowflake[];
  /**
   * Array of guild snowflake identifiers where the bot is present
   */
  guilds: Snowflake[];
  /**
   * The OAuth2 invite URL of the bot
   */
  invite?: string;
  /**
   * The date when the bot was approved on Top.gg in ISO 8601 format
   */
  date: ISO8601Date;
  /**
   * The amount of servers the bot has according to posted stats.
   */
  server_count?: number;
  /**
   * The amount of shards the bot has according to posted stats.
   */
  shard_count?: number;
  /**
   * Whether the bot is certified on Top.gg
   */
  certifiedBot: boolean;
  /**
   * The vanity URL of the bot on Top.gg
   */
  vanity?: string;
  /**
   * The amount of upvotes the bot has
   */
  points: number;
  /**
   * The amount of upvotes the bot has this month
   */
  monthlyPoints: number;
  /**
   * The guild id for the donatebot setup
   */
  donatebotguildid: Snowflake;
}

/**
 * Query parameters for searching bots on Top.gg.
 *
 * TODO: there is no documentation on a "search" parameter, but the endpoint is called "search bots" and it would make sense for there to be a search parameter. Need to confirm if this is the case and if so, add it to the types.
 *
 * @see https://docs.top.gg/docs/API/v0/bot#search-bots
 */
export interface GetSearchBotsQuery {
  /**
   * The amount of bots to return.
   *
   * @minimum 1
   * @maximum 500
   * @default 50
   */
  limit?: number;
  /**
   * The amount of bots to skip (for pagination).
   *
   * @minimum 0
   * @default 0
   */
  offset?: number;
  /**
   * The field to sort the bots by. Prefix with `-` for descending order.
   *
   * There is no documented default.
   */
  sort: keyof Bot | `-${keyof Bot}`;
  /**
   * Comma separated list of fields to include in the response. If not provided, all fields will be included.
   */
  fields?: string;
}

export interface GetSearchBotsResponse {
  /**
   * The array of bots that match the search query.
   */
  results: Bot[];
  /**
   * The total number of bots that match the search query.
   */
  total: number;
  /**
   * The limit used in the query.
   */
  limit: number;
  /**
   * The amount of bots skipped (for pagination).
   */
  offset: number;
  /**
   * The amount of items in the current page of results.
   */
  count: number;
}

/**
 * ### Routes
 *
 * - GET `/bots/:bot_id`
 */
export type GetBotResponse = Bot;

/**
 * Gets the last 1000 voters for your bot.
 *
 * If your bot receives more than 1000 votes monthly you cannot use this endpoints and must use webhooks and implement your own caching instead.
 *
 * This endpoint only returns unique votes, it does not include double votes (weekend votes).
 *
 * ### Routes
 *
 * - GET `/bots/:bot_id/votes`
 */
export type GetLast1000BotVotesResponse = {
  /**
   * The Discord ID of the user that voted.
   */
  id: Snowflake;
  /**
   * The username of the user that voted, including discriminator (e.g., "wumpus#0000").
   *
   * TODO: It's called "username" but can be uppsercase?? It would be the global_name then.
   */
  username: string;
  /**
   * The avatar hash of the user that voted.
   *
   * TODO: Can be null? Can be undefined? Is it always present? Need to confirm.
   */
  avatar?: string;
}[];

/**
 * Specific stats about a bot.
 *
 * ### Routes
 *
 * - GET `/bots/:bot_id/stats`
 */
export interface GetBotStatsResponse {
  /**
   * The amount of servers the bot is in
   */
  server_count?: number;
  /**
   * The amount of servers the bot is in per shard. Always present but can be empty.
   */
  shards: number[];
  /**
   * The amount of shards a bot has according to posted stats.
   */
  shard_count?: number;
}

/**
 * Checking whether or not a user has voted for your bot. Safe to use even if you have over 1k monthly votes.
 *
 * ### Routes
 *
 * - GET `/bots/:bot_id/check`
 */
export interface GetUserVoteCheckQuery {
  /**
   * The Discord ID of the user to check for a vote.
   */
  userId: Snowflake;
}

/**
 * The response from checking whether or not a user has voted for your bot.
 *
 * ### Routes
 *
 * - GET `/bots/:bot_id/check`
 */
export interface GetUserVoteCheckResponse {
  /**
   * 0 if the user has not voted for this bot in the last 12 hours, 1 if they have.
   */
  voted: 0 | 1;
}

export interface PostBotStatsBody {
  /**
   * The amount of servers the bot is in. Required if the bot has less than 100 servers, otherwise optional but recommended.
   *
   * If an Array, it acts like shards.
   */
  server_count: number | number[];
  /**
   * Amount of servers the bot is in per shard.
   */
  shards?: number[];
  /**
   * The zero-indexed id of the shard posting. Makes server_count set the shard specific server count.
   */
  shard_id?: number;
  /**
   * The amount of shards the bot has.
   */
  shard_count?: number;
}

// # Users

/**
 * A user on Top.gg
 *
 * ### Routes
 *
 * - GET `/users/:user_id`
 */
export interface User {
  /**
   * The Discord ID for this user.
   */
  id: Snowflake;
  /**
   * The username of the user, not including discriminator (e.g., "wumpus").
   */
  username: string;
  /**
   * The discriminator of the user (legacy Discord feature, e.g., "0000").
   */
  discriminator: string;
  /**
   * The avatar hash of the user's avatar.
   */
  avatar?: string;
  /**
   * The cdn hash of the user's avatar if the user has none.
   */
  defAvatar?: string;
  /**
   * The bio of the user. This is a short description that the user can set on their profile. It may be empty or null if the user has not set a bio.
   *
   * This is NOT their in-discord bio.
   */
  bio?: string;
  /**
   * The banner image URL of the user.
   */
  banner?: string;
  /**
   * The social usernames of the user
   */
  social: {
    /**
     * The YouTube channel ID of the user. This is not the full URL, just the channel ID (e.g., "UC_x5XG1OV2P6uZZ5FSM9Ttw").
     */
    youtube?: string;
    /**
     * The Reddit username of the user (e.g., "spez"). This is not the full URL, just the username.
     */
    reddit?: string;
    /**
     * The Twitter username of the user (e.g., "jack"). This is not the full URL, just the username.
     */
    twitter?: string;
    /**
     * The Instagram username of the user (e.g., "instagram"). This is not the full URL, just the username.
     */
    instagram?: string;
    /**
     * The GitHub username of the user (e.g., "torvalds"). This is not the full URL, just the username.
     */
    github?: string;
  };
  /**
   * The custom hex color of the user (not guaranteed to be valid hex). This is a color that the user can set on their profile.
   */
  color?: string;
  /**
   * The supporter status of the user. This is true if the user has voted for any bot in the last month.
   *
   * TODO: Clarify what "supporter" means in this context. It may refer to users who have voted for any bot in the last month, but this is not explicitly stated in the documentation.
   */
  supporter: boolean;
  /**
   * The certified status of the user.
   *
   * TODO: Clarify what "certified" means in this context. It may refer to users who are certified bot developers or top.gg staff, but this is not explicitly stated in the documentation.
   */
  certifiedDev: boolean;
  /**
   * The mod status of the user. This is true if the user is a moderator on Top.gg.
   */
  mod: boolean;
  /**
   * The website moderator status of the user. This is true if the user is a website moderator on Top.gg.
   */
  webMod: boolean;
  /**
   * The admin status of the user.
   *
   * TODO: Clarify what "admin" means in this context. It may refer to users who are administrators on Top.gg, but this is not explicitly stated in the documentation.
   */
  admin: boolean;
}
