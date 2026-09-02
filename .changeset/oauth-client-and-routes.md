---
"topgg-api-types": minor
---

Add `TopGGOAuthClient` (`topgg-api-types/v1/oauth`) for the OAuth 2.1 authorization flow: builds the authorization URL, exchanges/refreshes tokens, and revokes authorizations. Add matching `oauth2Token`/`oauth2Revoke` route builders to `v1/routes`, and support `application/x-www-form-urlencoded` request bodies in the shared HTTP client used by both v0 and v1.

Add `GetProjectsQuery`/`GetProjectsResponse`/`ListedProject` types and schemas, a `Routes.projects()` route builder, and a `TopGGClient#getProjects()` method for the `GET /projects` list endpoint (OAuth access token or application token only — not available with a project token).
