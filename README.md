# topgg-api-types

[![npm version](https://badgen.net/npm/v/topgg-api-types)](https://www.npmjs.com/package/topgg-api-types)
[![License](https://badgen.net/badge/license/MIT/blue?4)](https://www.npmjs.com/package/@the-lukez/li18n)

TypeScript types and zod/mini runtime validators for the [Top.gg](https://top.gg) API, plus
optional REST, OAuth, and webhook clients built on native `fetch` and Web Crypto — zero
dependencies.

Full guides (pagination, error handling, OAuth flow, webhook verification, v0 vs v1) live in the
docs site under `docs-site/`; this README covers the quick start.

## Installation

```bash
npm install topgg-api-types
# or
pnpm add topgg-api-types
```

## Usage

```ts
// Types only — no runtime overhead
import type { User, GetProjectResponse } from "topgg-api-types/v1";

// zod/mini validators, for parsing responses or verifying webhook payloads
import { UserSchema, VoteCreateWebhookPayloadSchema } from "topgg-api-types/v1/validators";

// A ready-made REST client
import { TopGGClient } from "topgg-api-types/v1/client";
const client = new TopGGClient({ token: process.env.TOPGG_TOKEN! });
const project = await client.getProject();
```

For the deprecated legacy API, use `topgg-api-types/v0` (types), `/v0/validators`, and
`/v0/client` (`TopGGLegacyClient`) — same shapes, both versions fully supported side by side.

## Available Exports

- `topgg-api-types/v1` / `/v0` — types (current / legacy)
- `topgg-api-types/v1/validators` / `/v0/validators` — zod/mini validators
- `topgg-api-types/v1/client` / `/v0/client` — REST client (`TopGGClient` / `TopGGLegacyClient`) + `Routes`
- `topgg-api-types/v1/oauth` — OAuth 2.1 client (`TopGGOAuthClient`)
- `topgg-api-types/v1/routes` / `/v0/routes` — standalone `Routes` path builders
- `topgg-api-types/v1/webhook` — webhook signature verification (`verifyWebhookSignature`)

## vs. `@top-gg/sdk`

Top.gg's own [`@top-gg/sdk`](https://www.npmjs.com/package/@top-gg/sdk) is a solid all-in-one
client (REST + Express webhook middleware + widget URL builders). This package is narrower and
framework-agnostic: types/validators usable standalone, runtime validation on responses and
webhooks (which `@top-gg/sdk` doesn't do), v0 and v1 both first-class, zero dependencies. It skips
widget URL builders (undocumented, so not worth keeping in sync) — pull in `@top-gg/sdk` too if
you need those.

## License

MIT
