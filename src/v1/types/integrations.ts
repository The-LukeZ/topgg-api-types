// # Integration Types

import type { BaseProject, User, WebhookEventType, WebhookPayloadBase } from "./base";

/**
 * Data included when an integration connection is created.
 */
export interface IntegrationCreateData {
  /**
   * The unique identifier for this integration connection.
   */
  connection_id: string;
  /**
   * The webhook secret used to verify webhook requests from Top.gg for this connection.
   */
  webhook_secret: string;
  /**
   * The project this integration is connected to.
   */
  project: BaseProject;
  /**
   * The user who created this integration connection.
   */
  user: User;
}

/**
 * The payload delivered to your webhook endpoint when an integration connection is created.
 * This will be sent if a user clicks "Connect" for your integration on the dashboard.
 *
 * @see https://docs.top.gg/webhooks/integrations#the-handshake-flow
 */
export type IntegrationCreateWebhookPayload = WebhookPayloadBase<
  "integration.create",
  IntegrationCreateData
>;

/**
 * The response you must return from your webhook endpoint when you receive an `integration.create` event.
 * This tells Top.gg where to deliver webhook events for this integration connection and which events to deliver.
 *
 * @see https://docs.top.gg/webhooks/integrations#the-handshake-flow
 */
export interface IntegrationCreateResponse {
  /**
   * The URL where Top.gg should deliver webhook events for this connection.
   */
  webhook_url: string;
  /**
   * An array of webhook scopes to subscribe to.
   *
   * @see https://docs.top.gg/webhooks/events
   */
  routes: WebhookEventType[];
}

/**
 * Data included when an integration connection is deleted.
 */
export interface IntegrationDeleteData {
  /**
   * The unique identifier for the integration connection that was deleted.
   */
  connection_id: string;
}

/**
 * The payload delivered to your webhook endpoint when an integration connection is deleted.
 */
export type IntegrationDeleteWebhookPayload = WebhookPayloadBase<
  "integration.delete",
  IntegrationDeleteData
>;

/**
 * An integration available for a project, as returned by the list endpoint.
 *
 * - GET `/v1/projects/:project_id/integrations`
 *
 * @see https://docs.top.gg/api/v1/project-integrations#get-projectsproject_idintegrations
 */
export interface ListedIntegration {
  /**
   * The integration's unique identifier.
   */
  id: string;
  /**
   * The integration's display name.
   */
  name: string;
  /**
   * Short description of what the integration does.
   */
  description: string;
  /**
   * URL of the integration's icon.
   */
  icon_url: string;
  /**
   * Whether the integration is currently connected to the project.
   */
  connected: boolean;
}

/**
 * Response for listing the integrations available for a project and whether each one is connected.
 *
 * - GET `/v1/projects/:project_id/integrations`
 *
 * @see https://docs.top.gg/api/v1/project-integrations#get-projectsproject_idintegrations
 */
export type ListProjectIntegrationsResponse = ListedIntegration[];
