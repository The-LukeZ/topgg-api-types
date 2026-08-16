import type { Snowflake } from "@utils/index";

/**
 * A mapping of functions that return REST API route paths for the legacy Top.gg API (v0).
 * Paths are relative to the base URL (default `https://top.gg/api`).
 *
 * @deprecated Use `Routes` from `topgg-api-types/v1/routes` instead.
 */
export const Routes = {
  /**
   * Route for:
   * - GET `/bots`
   */
  searchBots() {
    return "/bots" as const;
  },
  /**
   * Route for:
   * - GET `/bots/{bot.id}`
   */
  bot(botId: Snowflake) {
    return `/bots/${botId}` as const;
  },
  /**
   * Route for:
   * - GET `/bots/{bot.id}/votes`
   */
  botVotes(botId: Snowflake) {
    return `/bots/${botId}/votes` as const;
  },
  /**
   * Route for:
   * - GET  `/bots/{bot.id}/stats`
   * - POST `/bots/{bot.id}/stats`
   */
  botStats(botId: Snowflake) {
    return `/bots/${botId}/stats` as const;
  },
  /**
   * Route for:
   * - GET `/bots/{bot.id}/check`
   */
  botCheck(botId: Snowflake) {
    return `/bots/${botId}/check` as const;
  },
  /**
   * Route for:
   * - GET `/users/{user.id}`
   */
  user(userId: Snowflake) {
    return `/users/${userId}` as const;
  },
} as const;
