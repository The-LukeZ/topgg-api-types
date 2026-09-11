import type { Snowflake } from "@utils/index";

/**
 * A mapping of functions that return REST API route paths for the Top.gg API (v1).
 * Paths are relative to the base URL (default `https://top.gg/api/v1`).
 */
export const Routes = {
  /**
   * Route for:
   * - GET `/projects`
   */
  projects() {
    return "/projects" as const;
  },
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
  /**
   * Route for:
   * - GET `/projects/{project_id}/webhooks`
   * - POST `/projects/{project_id}/webhooks`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  projectWebhooks(projectId: Snowflake | "@me") {
    return `/projects/${projectId}/webhooks` as const;
  },
  /**
   * Route for:
   * - DELETE `/projects/{project_id}/webhooks/{webhook_id}`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  projectWebhook(projectId: Snowflake | "@me", webhookId: string) {
    return `/projects/${projectId}/webhooks/${webhookId}` as const;
  },
  /**
   * Route for:
   * - POST `/projects/{project_id}/webhooks/{webhook_id}/rotate`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  projectWebhookRotate(projectId: Snowflake | "@me", webhookId: string) {
    return `/projects/${projectId}/webhooks/${webhookId}/rotate` as const;
  },
  /**
   * Route for:
   * - POST `/projects/{project_id}/webhooks/{webhook_id}/test`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  projectWebhookTest(projectId: Snowflake | "@me", webhookId: string) {
    return `/projects/${projectId}/webhooks/${webhookId}/test` as const;
  },
  /**
   * Route for:
   * - GET `/projects/{project_id}/integrations`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  projectIntegrations(projectId: Snowflake | "@me") {
    return `/projects/${projectId}/integrations` as const;
  },
  /**
   * Route for:
   * - PUT `/projects/{project_id}/integrations/{integration_id}`
   * - DELETE `/projects/{project_id}/integrations/{integration_id}`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  projectIntegration(projectId: Snowflake | "@me", integrationId: string) {
    return `/projects/${projectId}/integrations/${integrationId}` as const;
  },
  /**
   * Route for:
   * - POST `/oauth2/token`
   */
  oauth2Token() {
    return "/oauth2/token" as const;
  },
  /**
   * Route for:
   * - POST `/oauth2/revoke`
   */
  oauth2Revoke() {
    return "/oauth2/revoke" as const;
  },
} as const;
