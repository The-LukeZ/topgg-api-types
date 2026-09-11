// # Project Webhook Schemas

import * as z from "zod/mini";

const ProjectWebhookUrlSchema = z.url().check(
  z.maxLength(2048),
  z.refine((value) => value.startsWith("https://"), "url must be an absolute https URL")
);

// TODO: verify the actual character set/length constraints on the secret - only the `whs_` prefix
// is confirmed, so this only checks that.
const ProjectWebhookSecretSchema = z.string().check(z.regex(/^whs_/, "Invalid webhook secret"));

/**
 * A webhook registered for a project, as returned by the list endpoint. The signing `secret` is
 * only included in the create and rotate responses - it is never returned here.
 *
 * - GET `/v1/projects/:project_id/webhooks`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#get-projectsproject_idwebhooks
 */
export const ProjectWebhookSchema = z.object({
  /**
   * The webhook's unique identifier.
   */
  id: z.string(),
  /**
   * The dashboard label for this webhook.
   */
  label: z.string(),
  /**
   * The HTTPS URL Top.gg delivers webhook events to.
   */
  url: ProjectWebhookUrlSchema,
});

/**
 * Response schema for listing the webhooks your application created for a project.
 *
 * - GET `/v1/projects/:project_id/webhooks`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#get-projectsproject_idwebhooks
 */
export const ListProjectWebhooksResponseSchema = z.array(ProjectWebhookSchema);

/**
 * Request body schema for creating a project webhook.
 *
 * - POST `/v1/projects/:project_id/webhooks`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#post-projectsproject_idwebhooks
 */
export const CreateProjectWebhookBodySchema = z.object({
  /**
   * The dashboard label for this webhook.
   */
  label: z.string().check(z.minLength(1), z.maxLength(100)),
  /**
   * The absolute `https` URL to deliver webhook events to.
   */
  url: ProjectWebhookUrlSchema,
});

/**
 * Response schema for creating a project webhook. `secret` is only returned here and on
 * rotation - store it immediately, it cannot be retrieved again.
 *
 * - POST `/v1/projects/:project_id/webhooks`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#post-projectsproject_idwebhooks
 */
export const CreateProjectWebhookResponseSchema = z.extend(ProjectWebhookSchema, {
  /**
   * The signing secret used to verify the `x-topgg-signature` header on delivered webhook
   * requests. Prefixed with `whs_`.
   */
  secret: ProjectWebhookSecretSchema,
});

/**
 * Response schema for rotating a project webhook's signing secret. The previous secret is
 * invalidated immediately.
 *
 * - POST `/v1/projects/:project_id/webhooks/:webhook_id/rotate`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#post-projectsproject_idwebhookswebhook_idrotate
 */
export const RotateProjectWebhookResponseSchema = z.object({
  /**
   * The new signing secret. Prefixed with `whs_`.
   */
  secret: ProjectWebhookSecretSchema,
});
