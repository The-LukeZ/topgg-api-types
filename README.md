# topgg-api-types

[![npm version](https://badgen.net/npm/v/topgg-api-types)](https://www.npmjs.com/package/topgg-api-types)
[![License](https://badgen.net/badge/license/MIT/blue?4)](https://www.npmjs.com/package/@the-lukez/li18n)

A lightweight collection of TypeScript types and runtime validators for the Top.gg API.
This package provides type definitions for the various endpoints and data structures used in the Top.gg API,
making it easier for developers to work with the API in a type-safe manner.

## Installation

```bash
npm install topgg-api-types
# or
pnpm add topgg-api-types
# or
yarn add topgg-api-types
# or
bun add topgg-api-types
# or
poop add topgg-api-types
```

## Usage

### TypeScript Types (Recommended for most users)

Import TypeScript types for static type checking and IntelliSense:

```ts
import type { User, VoteCreateWebhookPayload, GetProjectResponse } from "topgg-api-types/v1";

// Use types in your code
const user: User = {
  id: "1234567890",
  platform_id: "9876543210",
  name: "MyUser",
  avatar_url: "https://example.com/avatar.png",
};
```

### Runtime Validators

If you need runtime validation with Zod, import from the validators subpath:

```ts
import { UserSchema, VoteCreateWebhookPayloadSchema } from "topgg-api-types/v1/validators";

// Validate incoming webhook data
try {
  const validatedPayload = VoteCreateWebhookPayloadSchema.parse(req.body);
  console.log("Valid vote webhook:", validatedPayload);
} catch (error) {
  console.error("Invalid webhook payload:", error);
}
```

The validators are written with zod/mini, which is a lightweight version of Zod that provides basic validation functionality with a smaller bundle size.

### REST Client

For a thin, ready-to-use HTTP client on top of native `fetch` (no dependencies), import from the `client` subpath:

```ts
import { TopGGClient } from "topgg-api-types/v1/client";

const client = new TopGGClient({ token: process.env.TOPGG_TOKEN! });

const project = await client.getProject();
const status = await client.getVoteStatus("1234567890"); // null if user hasn't voted
await client.updateMetrics({ server_count: 1234 });
```

Pass `validateResponses: true` to validate responses against this package's own zod/mini schemas before returning them:

```ts
const client = new TopGGClient({ token, validateResponses: true });
```

Non-2xx responses throw `TopGGAPIError` (`status`, `type`, `title`, `detail`, and `retryAfter` when the API sends a `Retry-After` header). `getVoteStatus` is the one exception — a 404 there resolves to `null` instead of throwing, since that's the documented "user hasn't voted" response.

For the deprecated legacy API, use `TopGGLegacyClient` from `topgg-api-types/v0/client` — same shape, but the `Authorization` header is sent raw (no `Bearer` prefix), matching the v0 API.

Votes are paginated by cursor. `getProjectVotes` returns a page with a `next()` method for fetching the following page:

```ts
const firstPage = await client.getProjectVotes({ startDate: "2026-01-01T00:00:00Z" });
console.log(firstPage.data);

const secondPage = await firstPage.next();
console.log(secondPage.data);
```

`cursor` is always present on a page, even the last one — stop paging once `data` comes back empty.

### Routes

Both client subpaths also export a `Routes` object — a mapping of functions that build the relative REST path for each endpoint, in the same style as `discord-api-types`' `Routes`. Useful if you want to make requests yourself without pulling in the full client:

```ts
import { Routes } from "topgg-api-types/v1/routes";

Routes.project(); // "/projects/@me"
Routes.projectVoteStatus("1234567890"); // "/projects/@me/votes/1234567890"
```

### Webhook Signature Verification

`topgg-api-types/v1/webhook` exports `verifyWebhookSignature`, for verifying the `x-topgg-signature` header Top.gg sends with `vote.create`/`integration.*` webhook requests (HMAC-SHA256 over `{timestamp}.{rawBody}`, keyed with your integration's `webhook_secret`). Requires the **raw** request body — verify before you parse it as JSON:

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

Uses the Web Crypto API (`crypto.subtle`), so it works unmodified in Node 19+, browsers, Deno, Bun, and Workers — no `node:crypto` dependency.

For the deprecated v0 API, webhook auth is just a raw string comparison: Top.gg sends your configured secret back in the `Authorization` header, so check `req.headers.authorization === yourSecret` yourself — no crypto involved.

## Available Exports

- `topgg-api-types/v1` - Version 1 types (current)
- `topgg-api-types/v1/validators` - Version 1 Zod validators
- `topgg-api-types/v1/client` - Version 1 REST client (`TopGGClient`) and `Routes`
- `topgg-api-types/v1/routes` - Version 1 `Routes` path builders (standalone, no client)
- `topgg-api-types/v1/webhook` - Version 1 webhook signature verification (`verifyWebhookSignature`)
- `topgg-api-types/v0` - Version 0 types
- `topgg-api-types/v0/validators` - Version 0 Zod validators
- `topgg-api-types/v0/client` - Version 0 REST client (`TopGGLegacyClient`, deprecated) and `Routes`
- `topgg-api-types/v0/routes` - Version 0 `Routes` path builders (standalone, no client)

## Why Two Approaches?

- **Types only**: Smaller bundle size, better IntelliSense, no runtime overhead - perfect for most users
- **Validators**: Runtime validation with Zod - use when you need to validate API responses or webhook payloads
- **Client**: Skip writing your own fetch wrapper - use when you want a ready-made REST client with auth, error handling, and optional validation built in

Choose the approach that fits your needs, or use both together!

## vs. `@top-gg/sdk`

Top.gg's own [`@top-gg/sdk`](https://www.npmjs.com/package/@top-gg/sdk) is a solid all-in-one client (REST + webhook Express middleware + widget URL builders), and its docs live at [topgg.js.org](https://topgg.js.org). This package solves a narrower problem:

- **Types/validators are usable on their own.** No need to buy into their client or Node's `express`-flavored webhook listener if you already have your own HTTP layer, use a different framework, or run on Workers/Deno/Bun.
- **Runtime validation.** `@top-gg/sdk` has none — no schema check on API responses or incoming webhook payloads. This package's zod/mini validators catch API drift or malformed webhook bodies at runtime, not just compile time.
- **v0 and v1 both first-class**, exported side by side rather than only the latest.
- **Zero dependencies**, native `fetch` + Web Crypto, tree-shakeable per-subpath exports.

What it doesn't do (by design — pull in `@top-gg/sdk` too if you need these): widget URL builders (these aren't documented anywhere in Top.gg's docs — the only reference is the widget config on the bot's edit page on top.gg itself, so this package doesn't attempt to keep them in sync) and cursor-pagination beyond `getProjectVotes`'s built-in `next()`.

Not a replacement for their SDK — a leaner option if you want strict, API-accurate types and optional runtime safety without the rest of it.
