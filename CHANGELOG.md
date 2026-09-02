# topgg-api-types

## 2.1.0

### Minor Changes

- 7db3d9b: Add OAuth 2.1 types and zod/mini schemas: authorization query, token exchange/refresh, revoke, and error response shapes.

## 2.0.1

### Patch Changes

- da87942: Fix `ISO8601DateSchema` rejecting real Top.gg timestamps. It previously only accepted a plain `YYYY-MM-DD` date, so any `created_at`/`expires_at` value with a time component (e.g. `2026-08-21T22:02:18.0014413+00:00`, as sent in `vote.create` webhook payloads) failed validation. It now accepts either a plain ISO 8601 date or a full ISO 8601 datetime with an optional timezone offset and arbitrary fractional-second precision.

## 2.0.0

### Major Changes

- 5026694: Sync webhook types with the documented Top.gg payloads.

  - **Removed all v0 webhook types.** Webhooks are v1-only now. `WebhookEventType`, `BotWebhookPayload`, `ServerWebhookPayload` and their schemas are gone from `topgg-api-types/v0` and `topgg-api-types/v0/validators`. Migrate to `WebhookPayload`/`VoteCreateWebhookPayload` from `topgg-api-types/v1`.
  - `VoteCreateData` no longer extends `Vote`: the `vote.create` payload does not include top-level `user_id`/`platform_id` (that data lives in `data.user`). It now declares `id`, `weight`, `created_at`, `expires_at`, `project`, `query` and `user` directly.
  - Added `data.query` (parsed `/:id/vote` query string params) to `VoteCreateData`/`VoteCreateDataSchema`. `VoteCreateDataSchema` previously stripped it, and was also missing the `id` field that the type declared.
  - Updated all `@see` links to the new docs.top.gg URL structure (`/docs/API/v1/*` → `/api/v1/*`, webhooks/integrations moved to `/webhooks/*`).

## 1.0.0

### Major Changes

- d25e6c4: Add v1 project management types/validators (headline & page content updates, announcements, metrics, metrics batching, slash command overwrite), add v0/v1 REST clients + routes, add webhook signature verification, and add pagination for project votes.

  **Breaking:** in the v0 API, `Bot.lib` is now required (was missing) and `User.defAvatar` is now required (was optional).
