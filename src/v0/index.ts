// TODO: https://docs.top.gg/docs/Resources/webhooks#schema
// https://docs.top.gg/docs/API/v0/bot
// https://docs.top.gg/docs/API/v0/user

import type { ISO8601Date, Snowflake } from "@src/utils";

// # Bases and Constants

export type WebhookEventType = "upvote" | "test";

// # Webhooks - deprecated

/**
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
/**
 * Represents a bot listed on Top.gg
 * @interface Bot
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

// # Users
