# topgg-api-types

## 1.0.0

### Major Changes

- d25e6c4: Add v1 project management types/validators (headline & page content updates, announcements, metrics, metrics batching, slash command overwrite), add v0/v1 REST clients + routes, add webhook signature verification, and add pagination for project votes.

  **Breaking:** in the v0 API, `Bot.lib` is now required (was missing) and `User.defAvatar` is now required (was optional).
