# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`topgg-api-types` — TypeScript type definitions + `zod/mini` runtime validators for the Top.gg API. No runtime logic beyond validation; it's a types/schema package published to npm.

## Commands

Package manager is **pnpm**. Per user global config, do not run pnpm/npm/bun commands from WSL — ask the user to run them in a native (Windows) terminal instead.

- `pnpm run build` — build via tsdown (esm + cjs + dts) into `dist/`
- `pnpm run dev` — tsdown in watch mode
- `pnpm run format` — prettier write
- `pnpm run lint` — prettier check (this is the only lint step; no test suite exists)
- `pnpm changeset` — record a changeset for the current change (bump type + summary); required on every PR that changes published code, see `RELEASING.md`

There are no automated tests. "Testing changes" means: build succeeds and types/schemas match the real Top.gg API shape.

Versioning/publishing is handled by Changesets (see `RELEASING.md`) — don't hand-bump `package.json` version or publish manually.

## Architecture

Source lives in `src/`, organized by API version:

- `src/v0/` — legacy Top.gg API (v0): `index.ts` (types), `validators.ts` (zod/mini schemas)
- `src/v1/` — current Top.gg API (v1): same split
- `src/utils/` — shared primitives used by both versions: `index.ts` has `Snowflake`/`ISO8601Date` type aliases, `validators.ts` has the corresponding `SnowflakeSchema`/`ISO8601DateSchema`
- `src/index.ts` — re-exports v1 as the "latest" default (`export type * from "@v1/index"` + `export * from "@v1/validators"`)

Path aliases (defined in both `tsconfig.json` and `tsdown.config.ts` — keep them in sync): `@src`, `@utils`, `@v0`, `@v1`.

**Each version's `validators.ts` re-exports from `@utils/validators`**, so importing `topgg-api-types/v1/validators` also gives you `SnowflakeSchema`/`ISO8601DateSchema`.

### Type/schema pairing convention

Every exported type in `index.ts` has a matching zod/mini schema of the same name + `Schema` suffix in `validators.ts`, kept in the same file order and with the same JSDoc comment. E.g. `User` type ↔ `UserSchema`. When adding or editing one, update the other to match.

### Build/export surface

`tsdown.config.ts` defines the public entry points (`index`, `v0`, `v1`, `v0/validators`, `v1/validators`) and generates `package.json`'s `exports` field automatically (`exports: true`). **Never hand-edit the `exports` field in `package.json`** — add new entry points in `tsdown.config.ts` instead and let tsdown regenerate it on build.

## Conventions (from CONTRIBUTING.md)

- New types need JSDoc comments; keep them reusable if used in multiple places
- New API endpoints/payloads should get a corresponding `zod/mini` validator (not full `zod`)
- Anything shared between v0 and v1 goes in `src/utils/`
- Use the `@src`/`@utils`/`@v0`/`@v1` path aliases, not relative imports across directories
- Commit messages: present tense, one focused change per commit
