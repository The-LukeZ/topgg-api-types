# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`topgg-api-types` — TypeScript type definitions + `zod/mini` runtime validators for the Top.gg API. No runtime logic beyond validation; it's a types/schema package published to npm.

## Commands

Package manager is **pnpm**. Per user global config, do not run pnpm/npm/bun commands from WSL — ask the user to run them in a native (Windows) terminal instead.

- `pnpm run build` — build via tsdown (esm + cjs + dts) into `dist/`
- `pnpm run dev` — tsdown in watch mode
- `pnpm run format` — prettier write
- `pnpm run lint` — prettier check
- `pnpm test` — run unit tests via vitest (`*.test.ts` files, e.g. `src/v1/validators.test.ts`)
- `pnpm changeset` — record a changeset for the current change (bump type + summary); required on every PR that changes published code, see `RELEASING.md`
- `pnpm run docs` (repo root) — generate TypeDoc output: HTML to `docs/`, JSON to `docs/typedoc.json`, and markdown into `docs-site/generated/api-md`, then sync that markdown into `docs-site/src/routes/docs/api/` as SvelteKit pages. Also runs automatically via `predev`/`prebuild` in `docs-site/`.

"Testing changes" means: build succeeds, `pnpm test` passes, and types/schemas match the real Top.gg API shape. Prefer real (or realistic) sample payloads over synthetic edge cases when adding validator tests.

Versioning/publishing is handled by Changesets (see `RELEASING.md`) — don't hand-bump `package.json` version or publish manually.

## Architecture

Source lives in `src/`, organized by API version:

- `src/v0/` — legacy Top.gg API (v0): `index.ts` (types), `validators.ts` (zod/mini schemas). Small enough to stay as single files.
- `src/v1/` — current Top.gg API (v1): `index.ts`/`validators.ts` are barrels only (`export type * from "./types/<topic>"` / `export * from "./schemas/<topic>"`); the actual definitions live one topic per file under `src/v1/types/` and `src/v1/schemas/`, e.g. `types/oauth.ts` ↔ `schemas/oauth.ts`. Current topics: `base` (shared enums/constants, `User`, `BaseProject`, `Vote`, webhook payload base), `integrations`, `votes` (vote payloads + `WebhookPayload` union), `projects` (project reads + writes: announcements, metrics, commands), `oauth`. Topic files import from each other with relative imports (e.g. `./base`), never through the `index.ts`/`validators.ts` barrel, to avoid circular imports.
- `src/utils/` — shared primitives used by both versions: `index.ts` has `Snowflake`/`ISO8601Date` type aliases, `validators.ts` has the corresponding `SnowflakeSchema`/`ISO8601DateSchema`
- `src/index.ts` — re-exports v1 as the "latest" default (`export type * from "@v1/index"` + `export * from "@v1/validators"`)

Path aliases (defined in both `tsconfig.json` and `tsdown.config.ts` — keep them in sync): `@src`, `@utils`, `@v0`, `@v1`. `tsdown.config.ts`'s public entry points still point at `src/v1/index.ts`/`src/v1/validators.ts` (the barrels) — the `types/`/`schemas/` split is an internal implementation detail, not a new public entry surface.

**Each version's `validators.ts` re-exports from `@utils/validators`**, so importing `topgg-api-types/v1/validators` also gives you `SnowflakeSchema`/`ISO8601DateSchema`.

### Type/schema pairing convention

Every exported type has a matching zod/mini schema of the same name + `Schema` suffix, kept in the same file (same topic file for v1, same file for v0) in the same order and with the same JSDoc comment. E.g. `User` type in `v1/types/base.ts` ↔ `UserSchema` in `v1/schemas/base.ts`. When adding or editing one, update the other to match. Types are hand-written rather than derived from schemas (`z.infer`) — schema-derived types lose per-field JSDoc on hover (no declaration-level link from the inferred object-literal type back to the schema's comments) and would downgrade types that intentionally use a more precise external type than their schema (e.g. `UpdateProjectCommandsBody` uses `discord-api-types`'s exact command type while `ApplicationCommandSchema` is a deliberately loose runtime check).

### Build/export surface

`tsdown.config.ts` defines the public entry points (`index`, `v0`, `v1`, `v0/validators`, `v1/validators`) and generates `package.json`'s `exports` field automatically (`exports: true`). **Never hand-edit the `exports` field in `package.json`** — add new entry points in `tsdown.config.ts` instead and let tsdown regenerate it on build.

## Docs site

`docs-site/` is a separate SvelteKit package (its own `package.json`, deployed to Cloudflare
Workers via `wrangler`/`adapter-cloudflare`), built on `svelte-docsmith`. Hand-authored pages live
under `docs-site/src/routes/docs/*/+page.md` (e.g. `docs/introduction`); `docs-site/src/routes/docs/+layout.svelte`
and the root `+layout.svelte`/`+page.svelte` are hand-authored too — **never let the API-doc sync
step touch anything outside `docs-site/src/routes/docs/api/`**.

- `docs-site/src/routes/docs/api/` is **fully generated** (from `typedoc.json` → `docs-site/scripts/sync-api-docs.mjs`), gitignored, and gets `rm -rf`'d and rewritten on every `docs:api` run. Never hand-edit files there.
- `typedoc.json` (repo root) configures TypeDoc's `outputs` array (html/json/markdown) — not the legacy `out`/`json` shortcuts, which silently overwrite `outputs` if both are present. The markdown output uses `typedoc-plugin-markdown` with `mergeReadme: true` (folds the auto-generated modules-index page into the README page — without it you get a duplicate "API Reference" sidebar entry).
- `tooling/typedoc/frontmatter-plugin.mjs` is a local TypeDoc plugin that sets `title`/`section: "API Reference"`/`order` frontmatter on every generated page (docsmith's sidebar groups by `section` and sorts by `order`). It also renames the `src/index.ts` entry point's page from typedoc's default "index" title to "Root" to avoid a confusing duplicate-looking sidebar entry.
- `typedoc-plugin-markdown`/`typedoc-plugin-frontmatter` are ESM-only; `typedoc.json`'s `plugin` entries point at their explicit `dist/index.js` files (not the package directory), since TypeDoc's plugin loader falls back to CJS `require()` for directory paths and that fails on ESM-only packages.
- `sync-api-docs.mjs` also escapes literal `{`/`}` outside fenced code blocks (via `{String.fromCharCode(123/125)}`) — mdsvex/Svelte's compiler otherwise reads a bare `{` in prose (e.g. from a generated object-type signature) as the start of a mustache expression and fails to parse.

## Conventions (from CONTRIBUTING.md)

- New types need JSDoc comments; keep them reusable if used in multiple places
- New API endpoints/payloads should get a corresponding `zod/mini` validator (not full `zod`)
- Anything shared between v0 and v1 goes in `src/utils/`
- Use the `@src`/`@utils`/`@v0`/`@v1` path aliases, not relative imports across directories
- Commit messages: present tense, one focused change per commit
