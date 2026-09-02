---
title: Introduction
description: TypeScript types and zod/mini validators for the Top.gg API.
section: Getting Started
order: 1
---

`topgg-api-types` is a TypeScript types and validators package for the [Top.gg](https://top.gg)
API. It has no runtime logic beyond validation, so it's a good fit whether you're calling the API
yourself, verifying incoming webhooks, or just want accurate types.

## Installation

```bash
npm install topgg-api-types
# or
pnpm add topgg-api-types
```

## What's included

- **Types** — `topgg-api-types/v1` and `topgg-api-types/v0` for the current and legacy API.
- **Validators** — `topgg-api-types/v1/validators` and `topgg-api-types/v0/validators`, zod/mini
  schemas matching every exported type one-to-one.
- **REST clients** — `topgg-api-types/v1/client` (`TopGGClient`) and `topgg-api-types/v0/client`
  (`TopGGLegacyClient`), thin wrappers over native `fetch`.
- **OAuth client** — `topgg-api-types/v1/oauth` (`TopGGOAuthClient`) for the OAuth 2.1
  authorization code + PKCE flow.
- **Webhook verification** — `topgg-api-types/v1/webhook` (`verifyWebhookSignature`) for the
  `x-topgg-signature` header on vote/integration webhooks.
- **Route builders** — `topgg-api-types/v1/routes` and `topgg-api-types/v0/routes`, standalone if
  you want to make requests yourself.

## Types only

Most projects just need the types, for static checking and IntelliSense — no runtime overhead:

```ts
import type { User, VoteCreateWebhookPayload, GetProjectResponse } from "topgg-api-types/v1";
```

## Runtime validation

Import from the `validators` subpath when you need to check a response or webhook payload at
runtime:

```ts
import { UserSchema, VoteCreateWebhookPayloadSchema } from "topgg-api-types/v1/validators";

const validatedPayload = VoteCreateWebhookPayloadSchema.parse(req.body);
```

The validators are written with **zod/mini**, not full zod — a lighter-weight functional-API
variant with a smaller bundle size.

## REST client

Skip writing your own fetch wrapper:

```ts
import { TopGGClient } from "topgg-api-types/v1/client";

const client = new TopGGClient({ token: process.env.TOPGG_TOKEN! });

const project = await client.getProject();
const status = await client.getVoteStatus("1234567890"); // null if user hasn't voted
await client.updateMetrics({ server_count: 1234 });
```

Pass `validateResponses: true` to validate responses against this package's own zod/mini schemas
before they're returned:

```ts
const client = new TopGGClient({ token, validateResponses: true });
```

**Errors:** non-2xx responses throw `TopGGAPIError` (`status`, `type`, `title`, `detail`, and
`retryAfter` when the API sends a `Retry-After` header). `getVoteStatus` is the one exception — a
404 there resolves to `null` instead of throwing, since that's the documented "user hasn't voted"
response.

**`getProjects()`** lists every project covered by the current credential, paginated the same way
as `getProjectVotes` below. It needs an OAuth access token or
[application token](https://docs.top.gg/oauth/application-token) — unlike every other
`TopGGClient` method, it does **not** work with a plain project token:

```ts
const client = new TopGGClient({ token: process.env.TOPGG_APPLICATION_TOKEN! });
const { projects, cursor } = await client.getProjects();
```

**Pagination:** vote and project listings are paginated by cursor. The returned page has a
`next()` method for fetching the following page; `cursor` is always present, even on the last
page, so stop paging once `data` comes back empty rather than checking `cursor`:

```ts
const firstPage = await client.getProjectVotes({ startDate: "2026-01-01T00:00:00Z" });
const secondPage = await firstPage.next();
```

For the deprecated legacy API, use `TopGGLegacyClient` from `topgg-api-types/v0/client` — same
shape, but the `Authorization` header is sent raw (no `Bearer` prefix), matching the v0 API.

## OAuth client

For apps that act on behalf of Top.gg users (OAuth 2.1 authorization code + PKCE), use
`TopGGOAuthClient` from `topgg-api-types/v1/oauth`. It builds the authorization URL,
exchanges/refreshes tokens, and revokes authorizations. It holds your client secret, so use it
only from a backend:

```ts
import { TopGGOAuthClient } from "topgg-api-types/v1/oauth";

const oauth = new TopGGOAuthClient({
  clientId: process.env.TOPGG_CLIENT_ID!,
  clientSecret: process.env.TOPGG_CLIENT_SECRET!,
});

const authorizeUrl = oauth.buildAuthorizeUrl({
  redirect_uri: "https://example.com/oauth/callback",
  scope: "project.votes.read project.webhooks.write",
  state,
  code_challenge,
});

const tokens = await oauth.exchangeCode({ code, redirect_uri, code_verifier });
const refreshed = await oauth.refreshToken({ refresh_token: tokens.refresh_token });
await oauth.revoke({ token: refreshed.refresh_token });
```

See the [authorization guide](https://docs.top.gg/oauth/authorization) for the full flow,
including PKCE `code_verifier`/`code_challenge` generation.

## Routes

Both client subpaths also export a `Routes` object — functions building the relative REST path for
each endpoint, in the same style as `discord-api-types`'s `Routes`. Useful if you want to make
requests yourself without pulling in the full client:

```ts
import { Routes } from "topgg-api-types/v1/routes";

Routes.project(); // "/projects/@me"
Routes.projectVoteStatus("1234567890"); // "/projects/@me/votes/1234567890"
```

## Webhook signature verification

`topgg-api-types/v1/webhook` exports `verifyWebhookSignature`, for the `x-topgg-signature` header
Top.gg sends with `vote.create`/`integration.*` webhook requests (HMAC-SHA256 over
`{timestamp}.{rawBody}`, keyed with your integration's `webhook_secret`). It needs the **raw**
request body — verify before you parse it as JSON:

```ts
import { verifyWebhookSignature } from "topgg-api-types/v1/webhook";

// e.g. in an Express handler with a raw body buffer/string, NOT req.body
const ok = await verifyWebhookSignature({
  rawBody,
  signatureHeader: req.headers["x-topgg-signature"],
  secret: process.env.TOPGG_WEBHOOK_SECRET!,
  toleranceSeconds: 300, // optional replay protection
});

if (!ok) return res.status(401).end();
```

It's built on the Web Crypto API (`crypto.subtle`), so it runs unmodified in Node 19+, browsers,
Deno, Bun, and Workers — no `node:crypto` dependency.

For the deprecated v0 API, webhook auth is a raw string comparison instead: Top.gg sends your
configured secret back in the `Authorization` header, so check
`req.headers.authorization === yourSecret` yourself — no crypto involved.

## Choosing an approach

- **Types only** — smallest bundle, best IntelliSense, no runtime overhead. Right for most users.
- **+ Validators** — adds runtime validation, for when API drift or malformed webhook payloads
  need to be caught at runtime, not just compile time.
- **+ Client** — skip writing your own fetch wrapper; auth, error handling, and pagination come
  built in.

They compose — use just types, or types + validators + client together.

## Next

Browse the generated [API Reference](/docs/api) for every exported type, schema, and client
method.
