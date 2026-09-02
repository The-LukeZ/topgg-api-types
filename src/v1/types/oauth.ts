// # OAuth
//
// Types based on Top.gg's published OAuth 2.1 documentation (2026-09).

import type { Snowflake } from "@src/utils";
import type { BaseProject, ProjectPlatformType } from "./base";

/**
 * Scopes that can be requested when registering an OAuth app and sending users through the consent screen.
 * Access is scoped - only request the scopes you actually use. A `write` scope includes its `read`
 * counterpart (e.g. `project.webhooks.write` also allows listing webhooks).
 *
 * `user.*` scopes apply to the authorizing user. `project.*` scopes apply to every project the user
 * selected during authorization.
 */
export type OAuthScope =
  | "user.identify"
  | "user.projects.read"
  | "user.projects.write"
  | "project.information.read"
  | "project.information.write"
  | "project.votes.read"
  | "project.metrics.write"
  | "project.announcements.write"
  | "project.webhooks.read"
  | "project.webhooks.write"
  | "project.integrations.read"
  | "project.integrations.write";

/**
 * Query parameters for sending a user to the Top.gg OAuth authorization page.
 *
 * - GET `https://top.gg/oauth2/authorize`
 *
 * @see https://docs.top.gg/oauth/authorization
 */
export interface OAuthAuthorizeQuery {
  /**
   * Your OAuth app's client ID.
   */
  client_id: string;
  /**
   * Must be `code`.
   */
  response_type: "code";
  /**
   * One of the redirect URIs registered for your application. Must match exactly.
   */
  redirect_uri: string;
  /**
   * The scopes to request, space-separated. Request only what your application uses.
   */
  scope: string;
  /**
   * An opaque value you generate per authorization request. Echoed back unchanged on the callback -
   * verify it to prevent CSRF.
   */
  state: string;
  /**
   * PKCE challenge: `base64url(sha256(code_verifier))` without padding, where `code_verifier` is a
   * random string of 43 to 128 characters.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7636
   */
  code_challenge: string;
  /**
   * Must be `S256`.
   */
  code_challenge_method: "S256";
  /**
   * Top.gg project ID to preselect on the consent screen. The user can change the selection.
   */
  project_id?: Snowflake;
  /**
   * Platform for `platform_id`, e.g. `discord`. Use both together when you know the external ID but
   * not the Top.gg project ID.
   */
  platform?: ProjectPlatformType;
  /**
   * External ID on `platform`, e.g. a Discord bot ID. The matching project is preselected on the
   * consent screen, same behavior as `project_id`. Unknown IDs are ignored.
   */
  platform_id?: Snowflake;
}

/**
 * The OAuth 2.1 grant type used for a token request.
 */
export type OAuthGrantType = "authorization_code" | "refresh_token";

/**
 * Request body for exchanging an authorization code for an access token (Authorization Code + PKCE flow).
 * `client_secret` may be omitted if sent instead as HTTP Basic authentication.
 *
 * - POST `/v1/oauth2/token`
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7636
 */
export interface OAuthAuthorizationCodeTokenRequestBody {
  grant_type: "authorization_code";
  /**
   * The authorization code returned from the consent screen redirect. Single use, expires after 60 seconds.
   */
  code: string;
  /**
   * Must match the `redirect_uri` used in the initial authorization request.
   */
  redirect_uri: string;
  /**
   * Your OAuth app's client ID.
   */
  client_id: string;
  /**
   * Your OAuth app's client secret. Can be sent as HTTP Basic authentication instead.
   */
  client_secret?: string;
  /**
   * The PKCE code verifier corresponding to the `code_challenge` sent in the initial authorization request.
   */
  code_verifier: string;
}

/**
 * Request body for exchanging a refresh token for a new access token.
 * Refresh tokens rotate on use - store the new `refresh_token` from the response and discard the old one.
 * `client_secret` may be omitted if sent instead as HTTP Basic authentication.
 *
 * - POST `/v1/oauth2/token`
 */
export interface OAuthRefreshTokenRequestBody {
  grant_type: "refresh_token";
  /**
   * The refresh token from a previous token response.
   */
  refresh_token: string;
  /**
   * Your OAuth app's client ID.
   */
  client_id: string;
  /**
   * Your OAuth app's client secret. Can be sent as HTTP Basic authentication instead.
   */
  client_secret?: string;
  /**
   * Space-separated subset of the granted scopes to narrow the new access token. Defaults to all
   * granted scopes.
   */
  scope?: string;
}

/**
 * Request body for the OAuth token endpoint. Shape depends on `grant_type`.
 *
 * - POST `/v1/oauth2/token`
 */
export type OAuthTokenRequestBody =
  OAuthAuthorizationCodeTokenRequestBody | OAuthRefreshTokenRequestBody;

/**
 * The project an OAuth authorization was granted for, as included in the initial code exchange response.
 */
export interface OAuthProject extends BaseProject {
  /**
   * The project's name.
   */
  name: string;
}

/**
 * Response from the OAuth token endpoint.
 *
 * - POST `/v1/oauth2/token`
 */
export interface OAuthTokenResponse {
  /**
   * The access token to use as a `Bearer` token for API requests. Valid for 7 days.
   */
  access_token: string;
  token_type: "Bearer";
  /**
   * Seconds until `access_token` expires.
   */
  expires_in: number;
  /**
   * Rotates on every use - the previous refresh token is invalidated once a new one is issued.
   */
  refresh_token: string;
  /**
   * Space-separated list of scopes actually granted, which may be narrower than what was requested
   * if the user declined some scopes on the consent screen.
   */
  scope: string;
  /**
   * The project the user granted. Not present on refresh responses.
   */
  project?: OAuthProject;
}

/**
 * Request body for revoking an OAuth authorization by its refresh token. Revokes the whole
 * authorization and every access token issued for it.
 *
 * - POST `/v1/oauth2/revoke`
 */
export interface OAuthRevokeRequestBody {
  /**
   * The refresh token identifying the authorization to revoke.
   */
  token: string;
  /**
   * Accepted for compatibility with RFC 7009. Must be `refresh_token` when present.
   */
  token_type_hint?: "refresh_token";
  /**
   * Your OAuth app's client ID.
   */
  client_id: string;
  /**
   * Your OAuth app's client secret.
   */
  client_secret: string;
}

/**
 * Error response from the OAuth token endpoint, per RFC 6749 Section 5.2.
 * Distinct from `ErrorResponse`, which covers the rest of the API.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-5.2
 */
export interface OAuthErrorResponse {
  error: string;
  error_description?: string;
  error_uri?: string;
}
