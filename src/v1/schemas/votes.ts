// # Vote Schemas

import * as z from "zod/mini";
import { ISO8601DateSchema, SnowflakeSchema } from "@utils/validators";
import { BaseProjectSchema, UserSchema, WebhookPayloadBaseSchema } from "./base";
import {
  IntegrationCreateWebhookPayloadSchema,
  IntegrationDeleteWebhookPayloadSchema,
} from "./integrations";

/**
 * Data included when a vote is created.
 */
export const VoteCreateDataSchema = z.object({
  /**
   * The unique identifier for this vote.
   */
  id: SnowflakeSchema,
  /**
   * The amount of votes this vote counted for.
   */
  weight: z.number(),
  /**
   * The timestamp of when the user voted.
   */
  created_at: ISO8601DateSchema,
  /**
   * The timestamp of when the vote expires (i.e., when the user can vote again).
   * This is typically 12 hours after the `created_at` timestamp, but may vary based on the user's voting history and other factors.
   */
  expires_at: ISO8601DateSchema,
  /**
   * The project that was voted for.
   */
  project: BaseProjectSchema,
  /**
   * The parsed query string parameters found on the `/:id/vote` page.
   *
   * @example
   * // for `/:id/vote?key1=value&key2=value2`
   * { key1: "value", key2: "value2" }
   */
  query: z.optional(z.record(z.string(), z.string())),
  /**
   * The user who voted.
   */
  user: UserSchema,
});

/**
 * The payload delivered to your webhook endpoint when a user votes for your project and you have subscribed to the `vote.create` event.
 */
export const VoteCreateWebhookPayloadSchema = WebhookPayloadBaseSchema(
  "vote.create",
  VoteCreateDataSchema
);

// ## Webhook Test Schema

/**
 * Data included in a webhook test event.
 */
export const WebhookTestDataSchema = z.object({
  /**
   * A test user.
   */
  user: UserSchema,
  /**
   * A test project.
   */
  project: BaseProjectSchema,
});

/**
 * The payload delivered to your webhook endpoint when you send a test webhook from the dashboard or via the API.
 */
export const WebhookTestWebhookPayloadSchema = WebhookPayloadBaseSchema(
  "webhook.test",
  WebhookTestDataSchema
);

// ## Webhook

export const WebhookPayloadSchema = z.discriminatedUnion("type", [
  IntegrationCreateWebhookPayloadSchema,
  IntegrationDeleteWebhookPayloadSchema,
  VoteCreateWebhookPayloadSchema,
  WebhookTestWebhookPayloadSchema,
]);
