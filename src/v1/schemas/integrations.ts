// # Integration Schemas

import * as z from "zod/mini";
import { SnowflakeSchema } from "@utils/validators";
import {
  BaseProjectSchema,
  IntegrationWebhookEventTypeSchema,
  UserSchema,
  WebhookPayloadBaseSchema,
} from "./base";

/**
 * Data included when an integration connection is created.
 */
export const IntegrationCreateDataSchema = z.object({
  /**
   * The unique identifier for this integration connection.
   */
  connection_id: SnowflakeSchema,
  /**
   * The webhook secret used to verify webhook requests from Top.gg for this connection.
   */
  webhook_secret: z.string().check(z.regex(/^whs_[a-zA-Z0-9]+$/, "Invalid webhook secret")),
  /**
   * The project this integration is connected to.
   */
  project: BaseProjectSchema,
  /**
   * The user who created this integration connection.
   */
  user: UserSchema,
});

/**
 * The payload delivered to your webhook endpoint when an integration connection is created.
 * This will be sent if a user clicks "Connect" for your integration on the dashboard.
 *
 * @see https://docs.top.gg/webhooks/integrations#the-handshake-flow
 */
export const IntegrationCreateWebhookPayloadSchema = WebhookPayloadBaseSchema(
  "integration.create",
  IntegrationCreateDataSchema
);

/**
 * The response you must return from your webhook endpoint when you receive an `integration.create` event.
 * This tells Top.gg where to deliver webhook events for this integration connection and which events to deliver.
 *
 * @see https://docs.top.gg/webhooks/integrations#the-handshake-flow
 */
export const IntegrationCreateResponseSchema = z.object({
  /**
   * The URL where Top.gg should deliver webhook events for this connection.
   */
  webhook_url: z.url(),
  /**
   * An array of webhook scopes to subscribe to.
   *
   * @see https://docs.top.gg/webhooks/events
   */
  routes: z
    .array(IntegrationWebhookEventTypeSchema)
    .check(
      z.refine(
        (arr) => arr.length === new Set(arr).size,
        "Duplicate webhook scopes are not allowed"
      )
    ),
});

/**
 * Data included when an integration connection is deleted.
 */
export const IntegrationDeleteDataSchema = z.object({
  /**
   * The unique identifier for the integration connection that was deleted.
   */
  connection_id: SnowflakeSchema,
});

/**
 * The payload delivered to your webhook endpoint when an integration connection is deleted.
 */
export const IntegrationDeleteWebhookPayloadSchema = WebhookPayloadBaseSchema(
  "integration.delete",
  IntegrationDeleteDataSchema
);
