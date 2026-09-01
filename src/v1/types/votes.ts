// # Votes

import type { ISO8601Date, Snowflake } from "@src/utils";
import type { BaseProject, User, WebhookPayloadBase, WebhookEventTypes } from "./base";
import type {
  IntegrationCreateWebhookPayload,
  IntegrationDeleteWebhookPayload,
} from "./integrations";

/**
 * Data included when a vote is created.
 */
export interface VoteCreateData {
  /**
   * The unique identifier for this vote.
   */
  id: Snowflake;
  /**
   * The amount of votes this vote counted for.
   */
  weight: number;
  /**
   * The timestamp of when the user voted.
   */
  created_at: ISO8601Date;
  /**
   * The timestamp of when the vote expires (i.e., when the user can vote again).
   * This is typically 12 hours after the `created_at` timestamp, but may vary based on the user's voting history and other factors.
   */
  expires_at: ISO8601Date;
  /**
   * The project that was voted for.
   */
  project: BaseProject;
  /**
   * The parsed query string parameters found on the `/:id/vote` page.
   *
   * @example
   * // for `/:id/vote?key1=value&key2=value2`
   * { key1: "value", key2: "value2" }
   */
  query?: Record<string, string>;
  /**
   * The user who voted.
   */
  user: User;
}

/**
 * The payload delivered to your webhook endpoint when a user votes for your project and you have subscribed to the `vote.create` event.
 */
export type VoteCreateWebhookPayload = WebhookPayloadBase<"vote.create", VoteCreateData>;

// ## Webhook Test Types

/**
 * Data included in a webhook test event.
 */
export interface WebhookTestData {
  /**
   * A test user.
   */
  user: User;
  /**
   * A test project.
   */
  project: BaseProject;
}

/**
 * The payload delivered to your webhook endpoint when you send a test webhook from the dashboard or via the API.
 */
export type WebhookTestWebhookPayload = WebhookPayloadBase<"webhook.test", WebhookTestData>;

export type WebhookPayload<T extends WebhookEventTypes = WebhookEventTypes> = Extract<
  | IntegrationCreateWebhookPayload
  | IntegrationDeleteWebhookPayload
  | VoteCreateWebhookPayload
  | WebhookTestWebhookPayload,
  { type: T }
>;
