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

/*
| Field             | Type        | Description                                                       |
| ----------------- | ----------- | ----------------------------------------------------------------- |
| id                | `snowflake` | The id of the user                                                |
| username          | `string`    | The username of the user                                          |
| discriminator     | `string`    | The discriminator of the user                                     |
| avatar?           | `string`    | The avatar hash of the user's avatar                              |
| defAvatar         | `string`    | The cdn hash of the user's avatar if the user has none            |
| bio?              | `string`    | The bio of the user                                               |
| banner?           | `string`    | The banner image url of the user                                  |
| social            | `object`    | The social usernames of the user                                  |
| social.youtube?   | `string`    | The youtube channel id of the user                                |
| social.reddit?    | `string`    | The reddit username of the user                                   |
| social.twitter?   | `string`    | The twitter username of the user                                  |
| social.instagram? | `string`    | The instagram username of the user                                |
| social.github?    | `string`    | The github username of the user                                   |
| color?            | `string`    | The custom hex color of the user (not guaranteed to be valid hex) |
| supporter         | `boolean`   | The supporter status of the user                                  |
| certifiedDev      | `boolean`   | The certified status of the user                                  |
| mod               | `boolean`   | The mod status of the user                                        |
| webMod            | `boolean`   | The website moderator status of the user                          |
| admin             | `boolean`   | The admin status of the user                                      |
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
