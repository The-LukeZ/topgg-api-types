// # Project Webhooks

/**
 * A webhook registered for a project, as returned by the list endpoint. The signing `secret` is
 * only included in the create and rotate responses - it is never returned here.
 *
 * - GET `/v1/projects/:project_id/webhooks`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#get-projectsproject_idwebhooks
 */
export interface ProjectWebhook {
  /**
   * The webhook's unique identifier.
   */
  id: string;
  /**
   * The dashboard label for this webhook.
   */
  label: string;
  /**
   * The HTTPS URL Top.gg delivers webhook events to.
   */
  url: string;
}

/**
 * Response for listing the webhooks your application created for a project.
 *
 * - GET `/v1/projects/:project_id/webhooks`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#get-projectsproject_idwebhooks
 */
export type ListProjectWebhooksResponse = ProjectWebhook[];

/**
 * Request body for creating a project webhook.
 *
 * - POST `/v1/projects/:project_id/webhooks`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#post-projectsproject_idwebhooks
 */
export interface CreateProjectWebhookBody {
  /**
   * The dashboard label for this webhook.
   *
   * @minimum 1
   * @maximum 100
   */
  label: string;
  /**
   * The absolute `https` URL to deliver webhook events to.
   *
   * @maximum 2048
   */
  url: string;
}

/**
 * Response for creating a project webhook. `secret` is only returned here and on rotation -
 * store it immediately, it cannot be retrieved again.
 *
 * - POST `/v1/projects/:project_id/webhooks`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#post-projectsproject_idwebhooks
 */
export interface CreateProjectWebhookResponse extends ProjectWebhook {
  /**
   * The signing secret used to verify the `x-topgg-signature` header on delivered webhook
   * requests. Prefixed with `whs_`.
   */
  secret: string;
}

/**
 * Response for rotating a project webhook's signing secret. The previous secret is invalidated
 * immediately.
 *
 * - POST `/v1/projects/:project_id/webhooks/:webhook_id/rotate`
 *
 * @see https://docs.top.gg/api/v1/project-webhooks#post-projectsproject_idwebhookswebhook_idrotate
 */
export interface RotateProjectWebhookResponse {
  /**
   * The new signing secret. Prefixed with `whs_`.
   */
  secret: string;
}
