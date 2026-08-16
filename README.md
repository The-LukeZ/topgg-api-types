# topgg-api-types

A lightweight collection of TypeScript types and runtime validators for the Top.gg API.
This package provides type definitions for the various endpoints and data structures used in the Top.gg API,
making it easier for developers to work with the API in a type-safe manner.

> [!NOTE]
> This package is currently in development and not all comments and documentation are complete. The types and validators should be complete and accurate though.
> It is not yet uploaded to npm, but you can clone the repository and use it locally in your projects.

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

### Routes

Both client subpaths also export a `Routes` object — a mapping of functions that build the relative REST path for each endpoint, in the same style as `discord-api-types`' `Routes`. Useful if you want to make requests yourself without pulling in the full client:

```ts
import { Routes } from "topgg-api-types/v1/routes";

Routes.project(); // "/projects/@me"
Routes.projectVoteStatus("1234567890"); // "/projects/@me/votes/1234567890"
```

## Available Exports

- `topgg-api-types/v1` - Version 1 types (current)
- `topgg-api-types/v1/validators` - Version 1 Zod validators
- `topgg-api-types/v1/client` - Version 1 REST client (`TopGGClient`) and `Routes`
- `topgg-api-types/v1/routes` - Version 1 `Routes` path builders (standalone, no client)
- `topgg-api-types/v0` - Version 0 types
- `topgg-api-types/v0/validators` - Version 0 Zod validators
- `topgg-api-types/v0/client` - Version 0 REST client (`TopGGLegacyClient`, deprecated) and `Routes`
- `topgg-api-types/v0/routes` - Version 0 `Routes` path builders (standalone, no client)

## Why Two Approaches?

- **Types only**: Smaller bundle size, better IntelliSense, no runtime overhead - perfect for most users
- **Validators**: Runtime validation with Zod - use when you need to validate API responses or webhook payloads
- **Client**: Skip writing your own fetch wrapper - use when you want a ready-made REST client with auth, error handling, and optional validation built in

Choose the approach that fits your needs, or use both together!
