---
"topgg-api-types": major
---

Sync webhook types with the documented Top.gg payloads.

- **Removed all v0 webhook types.** Webhooks are v1-only now. `WebhookEventType`, `BotWebhookPayload`, `ServerWebhookPayload` and their schemas are gone from `topgg-api-types/v0` and `topgg-api-types/v0/validators`. Migrate to `WebhookPayload`/`VoteCreateWebhookPayload` from `topgg-api-types/v1`.
- `VoteCreateData` no longer extends `Vote`: the `vote.create` payload does not include top-level `user_id`/`platform_id` (that data lives in `data.user`). It now declares `id`, `weight`, `created_at`, `expires_at`, `project`, `query` and `user` directly.
- Added `data.query` (parsed `/:id/vote` query string params) to `VoteCreateData`/`VoteCreateDataSchema`. `VoteCreateDataSchema` previously stripped it, and was also missing the `id` field that the type declared.
- Updated all `@see` links to the new docs.top.gg URL structure (`/docs/API/v1/*` → `/api/v1/*`, webhooks/integrations moved to `/webhooks/*`).
