---
"topgg-api-types": minor
---

Sync with the latest Top.gg API docs:

- `ErrorResponse`/`ErrorSchema` gain the `code` field (e.g. `PROJECT_NOT_FOUND`), and `TopGGAPIError` exposes it as `code`.
- `UpdateProjectBody` gains `additional_data` (new `ProjectAdditionalData` and `MinecraftServerAdditionalData` types and schemas). `additional_data` only works with an OAuth access token on `/projects/:project_id`, so `TopGGClient.updateProject()` and `Routes.project()` now take an optional `projectId` (default `@me`).
- `ProjectPlatformType` gains `"minecraft"` and `ProjectType` gains `"game_server"`. Exhaustive `switch`es over these unions need a new case.
- **Behavior change:** `verifyWebhookSignature` now rejects signatures whose timestamp is more than 5 minutes old by default (`toleranceSeconds` defaults to `300`). Pass `toleranceSeconds: false` to restore the old behavior.
