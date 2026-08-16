import type {
  CreateProjectAnnouncementBody,
  CreateProjectAnnouncementResponse,
  GetProjectResponse,
  GetProjectVotesQuery,
  GetProjectVotesResponse,
  GetVoteStatusByUserQuery,
  GetVoteStatusByUserResponse,
  UpdateProjectBody,
  UpdateProjectCommandsBody,
  UpdateProjectMetricsBatchBody,
  UpdateProjectMetricsBody,
} from "@v1/index";
import {
  CreateProjectAnnouncementResponseSchema,
  GetProjectResponseSchema,
  GetProjectVotesResponseSchema,
  GetVoteStatusByUserResponseSchema,
} from "@v1/validators";
import type { Snowflake } from "@utils/index";
import { buildQueryString, performRequest, TopGGAPIError } from "@utils/http";
import { Routes } from "@v1/routes";

export { TopGGAPIError };
export { Routes };

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
   */
  async getProjectVotes(query: GetProjectVotesQuery): Promise<GetProjectVotesResponse> {
    const qs = buildQueryString({ cursor: query.cursor, startDate: query.startDate });
    const data = await performRequest<GetProjectVotesResponse>({
      baseUrl: this.#baseUrl,
      path: `${Routes.projectVotes()}${qs}`,
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) GetProjectVotesResponseSchema.parse(data);
    return data as GetProjectVotesResponse;
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
}
