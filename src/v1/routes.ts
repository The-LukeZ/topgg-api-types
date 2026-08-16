import type { Snowflake } from "@utils/index";

/**
 * A mapping of functions that return REST API route paths for the Top.gg API (v1).
 * Paths are relative to the base URL (default `https://top.gg/api/v1`).
 */
export const Routes = {
  /**
   * Route for:
   * - GET `/projects/@me`
   * - PATCH `/projects/@me`
   */
  project() {
    return "/projects/@me" as const;
  },
  /**
   * Route for:
   * - GET `/projects/@me/votes`
   */
  projectVotes() {
    return "/projects/@me/votes" as const;
  },
  /**
   * Route for:
   * - GET `/projects/@me/votes/{user.id}`
   */
  projectVoteStatus(userId: Snowflake) {
    return `/projects/@me/votes/${userId}` as const;
  },
  /**
   * Route for:
   * - POST `/projects/@me/announcements`
   */
  projectAnnouncements() {
    return "/projects/@me/announcements" as const;
  },
  /**
   * Route for:
   * - PATCH `/projects/@me/metrics`
   */
  projectMetrics() {
    return "/projects/@me/metrics" as const;
  },
  /**
   * Route for:
   * - POST `/projects/@me/metrics/batch`
   */
  projectMetricsBatch() {
    return "/projects/@me/metrics/batch" as const;
  },
  /**
   * Route for:
   * - PUT `/projects/@me/commands`
   */
  projectCommands() {
    return "/projects/@me/commands" as const;
  },
} as const;
