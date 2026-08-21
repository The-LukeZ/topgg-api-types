---
"topgg-api-types": patch
---

Fix `ISO8601DateSchema` rejecting real Top.gg timestamps. It previously only accepted a plain `YYYY-MM-DD` date, so any `created_at`/`expires_at` value with a time component (e.g. `2026-08-21T22:02:18.0014413+00:00`, as sent in `vote.create` webhook payloads) failed validation. It now accepts either a plain ISO 8601 date or a full ISO 8601 datetime with an optional timezone offset and arbitrary fractional-second precision.
