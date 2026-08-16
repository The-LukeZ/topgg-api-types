import type {
  GetBotResponse,
  GetBotStatsResponse,
  GetLast1000BotVotesResponse,
  GetSearchBotsQuery,
  GetSearchBotsResponse,
  PostBotStatsBody,
  User,
} from "@v0/index";
import {
  GetBotResponseSchema,
  GetBotStatsResponseSchema,
  GetLast1000BotVotesResponseSchema,
  GetSearchBotsResponseSchema,
  GetUserVoteCheckResponseSchema,
  UserSchema,
} from "@v0/validators";
import type { Snowflake } from "@utils/index";
import { buildQueryString, performRequest, TopGGAPIError } from "@utils/http";
import { Routes } from "@v0/routes";

export { TopGGAPIError };
export { Routes };

export interface TopGGLegacyClientOptions {
  /**
   * Your bot's token, sent raw in the `Authorization` header (no `Bearer` prefix — matches the legacy API).
   */
  token: string;
  /**
   * @default "https://top.gg/api"
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
 * A thin REST client for the legacy Top.gg API (v0).
 *
 * @deprecated Use {@link TopGGClient} (v1) instead.
 */
export class TopGGLegacyClient {
  #token: string;
  #baseUrl: string;
  #validateResponses: boolean;
  #fetch: typeof fetch;

  constructor(options: TopGGLegacyClientOptions) {
    this.#token = options.token;
    this.#baseUrl = options.baseUrl ?? "https://top.gg/api";
    this.#validateResponses = options.validateResponses ?? false;
    this.#fetch = options.fetch ?? fetch;
  }

  #headers(): Record<string, string> {
    return { Authorization: this.#token };
  }

  /**
   * - GET `/bots`
   */
  async searchBots(query: GetSearchBotsQuery): Promise<GetSearchBotsResponse> {
    const qs = buildQueryString({
      limit: query.limit,
      offset: query.offset,
      sort: query.sort,
      fields: query.fields,
    });
    const data = await performRequest<GetSearchBotsResponse>({
      baseUrl: this.#baseUrl,
      path: `${Routes.searchBots()}${qs}`,
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) GetSearchBotsResponseSchema.parse(data);
    return data as GetSearchBotsResponse;
  }

  /**
   * - GET `/bots/:bot_id`
   */
  async getBot(botId: Snowflake): Promise<GetBotResponse> {
    const data = await performRequest<GetBotResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.bot(botId),
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) GetBotResponseSchema.parse(data);
    return data as GetBotResponse;
  }

  /**
   * - GET `/bots/:bot_id/votes`
   */
  async getBotVotes(botId: Snowflake): Promise<GetLast1000BotVotesResponse> {
    const data = await performRequest<GetLast1000BotVotesResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.botVotes(botId),
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) GetLast1000BotVotesResponseSchema.parse(data);
    return data as GetLast1000BotVotesResponse;
  }

  /**
   * - GET `/bots/:bot_id/stats`
   */
  async getBotStats(botId: Snowflake): Promise<GetBotStatsResponse> {
    const data = await performRequest<GetBotStatsResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.botStats(botId),
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) GetBotStatsResponseSchema.parse(data);
    return data as GetBotStatsResponse;
  }

  /**
   * - POST `/bots/:bot_id/stats`
   */
  async postBotStats(botId: Snowflake, body: PostBotStatsBody): Promise<void> {
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.botStats(botId),
      method: "POST",
      headers: this.#headers(),
      body,
      fetchImpl: this.#fetch,
    });
  }

  /**
   * - GET `/bots/:bot_id/check`
   */
  async checkUserVote(botId: Snowflake, userId: Snowflake): Promise<boolean> {
    const qs = buildQueryString({ userId });
    const data = await performRequest<{ voted: 0 | 1 }>({
      baseUrl: this.#baseUrl,
      path: `${Routes.botCheck(botId)}${qs}`,
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) GetUserVoteCheckResponseSchema.parse(data);
    return data?.voted === 1;
  }

  /**
   * - GET `/users/:user_id`
   */
  async getUser(userId: Snowflake): Promise<User> {
    const data = await performRequest<User>({
      baseUrl: this.#baseUrl,
      path: Routes.user(userId),
      method: "GET",
      headers: this.#headers(),
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) UserSchema.parse(data);
    return data as User;
  }
}
