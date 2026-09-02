import type {
  OAuthAuthorizeQuery,
  OAuthRevokeRequestBody,
  OAuthTokenRequestBody,
  OAuthTokenResponse,
} from "@v1/index";
import { OAuthTokenResponseSchema } from "@v1/validators";
import { buildQueryString, performRequest, TopGGAPIError } from "@utils/http";
import { Routes } from "@v1/routes";

export { TopGGAPIError };
export { Routes };

export interface TopGGOAuthClientOptions {
  /**
   * Your OAuth app's client ID.
   */
  clientId: string;
  /**
   * Your OAuth app's client secret. Keep it server-side only — never ship it to a browser or
   * client-side bundle.
   */
  clientSecret: string;
  /**
   * @default "https://top.gg/api/v1"
   */
  baseUrl?: string;
  /**
   * Base URL used by {@link TopGGOAuthClient.buildAuthorizeUrl}. The authorization page is served
   * from the bare Top.gg domain, not the API's `baseUrl`.
   *
   * @default "https://top.gg"
   */
  authorizeBaseUrl?: string;
  /**
   * Validate token responses against this package's zod/mini schemas before returning them.
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
 * A thin OAuth 2.1 client for the Top.gg API (v1): builds the authorization URL, exchanges
 * authorization codes and refresh tokens for access tokens, and revokes authorizations.
 *
 * Holds your client secret, so only use this from a backend — never in a browser or other
 * client-side bundle.
 *
 * @see https://docs.top.gg/oauth/authorization
 */
export class TopGGOAuthClient {
  #clientId: string;
  #clientSecret: string;
  #baseUrl: string;
  #authorizeBaseUrl: string;
  #validateResponses: boolean;
  #fetch: typeof fetch;

  constructor(options: TopGGOAuthClientOptions) {
    this.#clientId = options.clientId;
    this.#clientSecret = options.clientSecret;
    this.#baseUrl = options.baseUrl ?? "https://top.gg/api/v1";
    this.#authorizeBaseUrl = options.authorizeBaseUrl ?? "https://top.gg";
    this.#validateResponses = options.validateResponses ?? false;
    this.#fetch = options.fetch ?? fetch;
  }

  /**
   * Builds the URL to redirect a user to for the Top.gg OAuth consent screen.
   *
   * - GET `https://top.gg/oauth2/authorize`
   */
  buildAuthorizeUrl(
    query: Omit<OAuthAuthorizeQuery, "client_id" | "response_type" | "code_challenge_method">
  ): string {
    const qs = buildQueryString({
      client_id: this.#clientId,
      response_type: "code",
      redirect_uri: query.redirect_uri,
      scope: query.scope,
      state: query.state,
      code_challenge: query.code_challenge,
      code_challenge_method: "S256",
      project_id: query.project_id,
      platform: query.platform,
      platform_id: query.platform_id,
    });
    return `${this.#authorizeBaseUrl}/oauth2/authorize${qs}`;
  }

  async #token(body: OAuthTokenRequestBody): Promise<OAuthTokenResponse> {
    const data = await performRequest<OAuthTokenResponse>({
      baseUrl: this.#baseUrl,
      path: Routes.oauth2Token(),
      method: "POST",
      headers: {},
      body,
      bodyType: "form",
      fetchImpl: this.#fetch,
    });
    if (this.#validateResponses) OAuthTokenResponseSchema.parse(data);
    return data as OAuthTokenResponse;
  }

  /**
   * Exchanges an authorization code for an access token and refresh token.
   *
   * - POST `/oauth2/token`
   */
  async exchangeCode(params: {
    code: string;
    redirect_uri: string;
    code_verifier: string;
  }): Promise<OAuthTokenResponse> {
    return this.#token({
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: params.redirect_uri,
      code_verifier: params.code_verifier,
      client_id: this.#clientId,
      client_secret: this.#clientSecret,
    });
  }

  /**
   * Exchanges a refresh token for a new access token. Refresh tokens rotate on use — store the
   * new `refresh_token` from the response and discard the old one.
   *
   * - POST `/oauth2/token`
   */
  async refreshToken(params: {
    refresh_token: string;
    scope?: string;
  }): Promise<OAuthTokenResponse> {
    return this.#token({
      grant_type: "refresh_token",
      refresh_token: params.refresh_token,
      client_id: this.#clientId,
      client_secret: this.#clientSecret,
      ...(params.scope !== undefined ? { scope: params.scope } : {}),
    });
  }

  /**
   * Revokes an authorization by its refresh token. Revokes the whole authorization and every
   * access token issued for it. Always resolves, even if the token was already revoked or unknown.
   *
   * - POST `/oauth2/revoke`
   */
  async revoke(params: { token: string; token_type_hint?: "refresh_token" }): Promise<void> {
    const body: OAuthRevokeRequestBody = {
      token: params.token,
      ...(params.token_type_hint !== undefined ? { token_type_hint: params.token_type_hint } : {}),
      client_id: this.#clientId,
      client_secret: this.#clientSecret,
    };
    await performRequest({
      baseUrl: this.#baseUrl,
      path: Routes.oauth2Revoke(),
      method: "POST",
      headers: {},
      body,
      bodyType: "form",
      fetchImpl: this.#fetch,
    });
  }
}
