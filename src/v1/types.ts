import type { infer as z_infer } from "zod/mini";
import * as v1 from "./index";

// # Enums and Constants

export type WebhookEventType = z_infer<typeof v1.WebhookEventTypeSchema>;
export type ProjectType = z_infer<typeof v1.ProjectTypeSchema>;
export type ProjectPlatformType = z_infer<typeof v1.ProjectPlatformTypeSchema>;
export type UserSource = z_infer<typeof v1.UserSourceSchema>;
export type IntegrationSupportedWebhookScopes = z_infer<
  typeof v1.IntegrationSupportedWebhookScopesSchema
>;

// # General and Base Types

export type Error = z_infer<typeof v1.ErrorSchema>;
export type User = z_infer<typeof v1.UserSchema>;
export type BaseProject = z_infer<typeof v1.BaseProjectSchema>;
export type Vote = z_infer<typeof v1.VoteSchema>;
export type ProjectVote = z_infer<typeof v1.ProjectVoteSchema>;

// # Integration Types

export type IntegrationCreateData = z_infer<typeof v1.IntegrationCreateDataSchema>;
export type IntegrationCreateWebhookPayload = z_infer<
  typeof v1.IntegrationCreateWebhookPayloadSchema
>;
export type InteractionCreateResponse = z_infer<typeof v1.InteractionCreateResponseSchema>;
export type IntegrationDeleteData = z_infer<typeof v1.IntegrationDeleteDataSchema>;
export type IntegrationDeleteWebhookPayload = z_infer<
  typeof v1.IntegrationDeleteWebhookPayloadSchema
>;

// # Vote Types

export type VoteCreateData = z_infer<typeof v1.VoteCreateDataSchema>;
export type VoteCreateWebhookPayload = z_infer<typeof v1.VoteCreateWebhookPayloadSchema>;

// # Webhook Test Types

export type WebhookTestData = z_infer<typeof v1.WebhookTestDataSchema>;
export type WebhookTestWebhookPayload = z_infer<typeof v1.WebhookTestWebhookPayloadSchema>;

// # Project Types

export type GetProjectResponse = z_infer<typeof v1.GetProjectResponseSchema>;
export type GetProjectVotesQuery = z_infer<typeof v1.GetProjectVotesQuerySchema>;
export type GetProjectVotesResponse = z_infer<typeof v1.GetProjectVotesResponseSchema>;
export type GetVoteStatusByUserQuery = z_infer<typeof v1.GetVoteStatusByUserQuerySchema>;
export type GetVoteStatusByUserResponse = z_infer<typeof v1.GetVoteStatusByUserResponseSchema>;
