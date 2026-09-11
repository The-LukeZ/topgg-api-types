import type {
  CreateProjectAnnouncementBody,
  CreateProjectAnnouncementResponse,
  CreateProjectWebhookBody,
  CreateProjectWebhookResponse,
  GetProjectResponse,
  GetProjectsQuery,
  GetProjectsResponse,
  GetProjectVotesQuery,
  GetProjectVotesResponse,
  GetVoteStatusByUserQuery,
  GetVoteStatusByUserResponse,
  ListProjectIntegrationsResponse,
  ListProjectWebhooksResponse,
  ProjectVote,
  RotateProjectWebhookResponse,
  UpdateProjectBody,
  UpdateProjectCommandsBody,
  UpdateProjectMetricsBatchBody,
  UpdateProjectMetricsBody,
} from "@v1/index";
import {
  CreateProjectAnnouncementResponseSchema,
  CreateProjectWebhookResponseSchema,
  GetProjectResponseSchema,
  GetProjectsResponseSchema,
  GetProjectVotesResponseSchema,
  GetVoteStatusByUserResponseSchema,
  ListProjectIntegrationsResponseSchema,
  ListProjectWebhooksResponseSchema,
  RotateProjectWebhookResponseSchema,
} from "@v1/validators";
import type { Snowflake } from "@utils/index";
import { buildQueryString, performRequest, TopGGAPIError } from "@utils/http";
import { Routes } from "@v1/routes";

export { TopGGAPIError };
export { Routes };

/**
 * A page of project votes, with a `next()` method for fetching the following page.
 * `cursor` is always present, even on the last page — stop paging once `data` comes back empty.
 */
export interface PaginatedProjectVotes {
  /**
   * The votes in this page.
   */
  data: ProjectVote[];
  /**
   * Opaque cursor for fetching the next page.
   */
  cursor: string;
  /**
   * Fetches the next page of votes using `cursor`.
   */
  next(): Promise<PaginatedProjectVotes>;
}

export interface TopGGClientOptions {
  /**
   * Your project's API token.
   */
  token: string;
  /**
   * @default "https://top.gg/api/v1"
   */
  baseUrl?: string;
  /**
   * Validate responses against this package's zod/mini schemas before returning them.
   *
   * @default false
   */
  validateResponses?: boolean;
  /**
   * Custom `fetch` implementation, e.g. for testing or non-standard runtimes.
   *
   * @default globalThis.fetch
   */
  fetch?: typeof fetch;
}

/**
 * A thin REST client for the current Top.gg API (v1).
 */
export class TopGGClient {
  #token: string;
  #baseUrl: string;
  #validateResponses: boolean;
  #fetch: typeof fetch;

  constructor(options: TopGGClientOptions) {
    this.#token = options.token;
    this.#baseUrl = options.baseUrl ?? "https://top.gg/api/v1";
    this.#validateResponses = options.validateResponses ?? false;
    this.#fetch = options.fetch ?? fetch;
  }

  #headers(): Record<string, string> {
    return { Authorization: `Bearer ${this.#token}` };
  }

  /**
   * - GET `/v1/projects`
   *
   * Lists the projects covered by the current credential. Requires an OAuth access token or
   * application token — not available with a project token (`@me`-style requests below).
   */
  async getProjects(query?: GetProjectsQuery): Promise<GetProjectsResponse> {
    const qs = buildQueryString({ cursor: query?.cursor });
    const data = await performRequest<GetProjectsResponse>({
      baseUrl: this.#baseUrl,
      path: `${Routes.projects()}${qs}`,
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) GetProjectsResponseSchema.parse(data);
    return data as GetProjectsResponse;
  }

  /**
   * - GET `/v1/projects/@me`
   */
  async getProject(): Promise<GetProjectResponse> {
    const data = await performRequest<GetProjectResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.project(),
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) GetProjectResponseSchema.parse(data);
    return data as GetProjectResponse;
  }

  /**
   * - PATCH `/v1/projects/@me`
   */
  async updateProject(body: UpdateProjectBody): Promise<void> {
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.project(),
      method: "PATCH",
      headers: this.#headers(),
      body,
      fetchImpl: this.#fetch,
    });
  }

  /**
   * - GET `/v1/projects/@me/votes`
   *
   * Returns a page of votes along with a `next()` method for fetching the following page via its cursor.
   */
  async getProjectVotes(query: GetProjectVotesQuery): Promise<PaginatedProjectVotes> {
    const qs = buildQueryString({ cursor: query.cursor, startDate: query.startDate });
    const data = await performRequest<GetProjectVotesResponse>({
      baseUrl: this.#baseUrl,
      path: `${Routes.projectVotes()}${qs}`,
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) GetProjectVotesResponseSchema.parse(data);
    const page = data as GetProjectVotesResponse;
    return {
      data: page.data,
      cursor: page.cursor,
      next: () => this.getProjectVotes({ cursor: page.cursor }),
    };
  }

  /**
   * - GET `/v1/projects/@me/votes/:user_id`
   *
   * Resolves to `null` if the user has not voted (404).
   */
  async getVoteStatus(
    userId: Snowflake,
    query?: GetVoteStatusByUserQuery
  ): Promise<GetVoteStatusByUserResponse | null> {
    const qs = buildQueryString({ source: query?.source });
    try {
      const data = await performRequest<GetVoteStatusByUserResponse>({
        baseUrl: this.#baseUrl,
        path: `${Routes.projectVoteStatus(userId)}${qs}`,
        method: "GET",
        headers: this.#headers(),
        fetchImpl: this.#fetch,
      });
      if (this.#validateResponses) GetVoteStatusByUserResponseSchema.parse(data);
      return data as GetVoteStatusByUserResponse;
    } catch (err) {
      if (err instanceof TopGGAPIError && err.status === 404) return null;
      throw err;
    }
  }

  /**
   * - POST `/v1/projects/@me/announcements`
   */
  async createAnnouncement(
    body: CreateProjectAnnouncementBody
  ): Promise<CreateProjectAnnouncementResponse> {
    const data = await performRequest<CreateProjectAnnouncementResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.projectAnnouncements(),
      method: "POST",
      headers: this.#headers(),
      body,
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) CreateProjectAnnouncementResponseSchema.parse(data);
    return data as CreateProjectAnnouncementResponse;
  }

  /**
   * - PATCH `/v1/projects/@me/metrics`
   */
  async updateMetrics(body: UpdateProjectMetricsBody): Promise<void> {
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.projectMetrics(),
      method: "PATCH",
      headers: this.#headers(),
      body,
      fetchImpl: this.#fetch,
    });
  }

  /**
   * - POST `/v1/projects/@me/metrics/batch`
   */
  async updateMetricsBatch(body: UpdateProjectMetricsBatchBody): Promise<void> {
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.projectMetricsBatch(),
      method: "POST",
      headers: this.#headers(),
      body,
      fetchImpl: this.#fetch,
    });
  }

  /**
   * - PUT `/v1/projects/@me/commands`
   */
  async updateCommands(body: UpdateProjectCommandsBody): Promise<void> {
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.projectCommands(),
      method: "PUT",
      headers: this.#headers(),
      body,
      fetchImpl: this.#fetch,
    });
  }

  /**
   * - GET `/v1/projects/{project_id}/webhooks`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  async listProjectWebhooks(projectId: Snowflake | "@me"): Promise<ListProjectWebhooksResponse> {
    const data = await performRequest<ListProjectWebhooksResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.projectWebhooks(projectId),
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) ListProjectWebhooksResponseSchema.parse(data);
    return data as ListProjectWebhooksResponse;
  }

  /**
   * - POST `/v1/projects/{project_id}/webhooks`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  async createProjectWebhook(
    projectId: Snowflake | "@me",
    body: CreateProjectWebhookBody
  ): Promise<CreateProjectWebhookResponse> {
    const data = await performRequest<CreateProjectWebhookResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.projectWebhooks(projectId),
      method: "POST",
      headers: this.#headers(),
      body,
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) CreateProjectWebhookResponseSchema.parse(data);
    return data as CreateProjectWebhookResponse;
  }

  /**
   * - DELETE `/v1/projects/{project_id}/webhooks/{webhook_id}`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  async deleteProjectWebhook(projectId: Snowflake | "@me", webhookId: string): Promise<void> {
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.projectWebhook(projectId, webhookId),
      method: "DELETE",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
  }

  /**
   * - POST `/v1/projects/{project_id}/webhooks/{webhook_id}/rotate`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  async rotateProjectWebhookSecret(
    projectId: Snowflake | "@me",
    webhookId: string
  ): Promise<RotateProjectWebhookResponse> {
    const data = await performRequest<RotateProjectWebhookResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.projectWebhookRotate(projectId, webhookId),
      method: "POST",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) RotateProjectWebhookResponseSchema.parse(data);
    return data as RotateProjectWebhookResponse;
  }

  /**
   * - POST `/v1/projects/{project_id}/webhooks/{webhook_id}/test`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  async testProjectWebhook(projectId: Snowflake | "@me", webhookId: string): Promise<void> {
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.projectWebhookTest(projectId, webhookId),
      method: "POST",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
  }

  /**
   * - GET `/v1/projects/{project_id}/integrations`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  async listProjectIntegrations(
    projectId: Snowflake | "@me"
  ): Promise<ListProjectIntegrationsResponse> {
    const data = await performRequest<ListProjectIntegrationsResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.projectIntegrations(projectId),
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) ListProjectIntegrationsResponseSchema.parse(data);
    return data as ListProjectIntegrationsResponse;
  }

  /**
   * - PUT `/v1/projects/{project_id}/integrations/{integration_id}`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  async connectProjectIntegration(
    projectId: Snowflake | "@me",
    integrationId: string
  ): Promise<void> {
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.projectIntegration(projectId, integrationId),
      method: "PUT",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
  }

  /**
   * - DELETE `/v1/projects/{project_id}/integrations/{integration_id}`
   *
   * `projectId` is `@me` for legacy project tokens, or the project's ID for OAuth access tokens.
   */
  async disconnectProjectIntegration(
    projectId: Snowflake | "@me",
    integrationId: string
  ): Promise<void> {
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.projectIntegration(projectId, integrationId),
      method: "DELETE",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
  }
}
