# Releasing

This repo uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing.

---

## Day-to-day: making a change

Every PR that changes published code **must** include a changeset.

### 1. Make your changes as normal

```bash
git checkout -b my-feature
# ... make changes
```

### 2. Create a changeset

```bash
pnpm changeset
```

The interactive CLI will:

- Ask for a bump type:
  - `patch` — bug fixes, non-breaking tweaks
  - `minor` — new features, backwards compatible
  - `major` — breaking changes
- Ask for a short summary (this becomes the changelog entry)

This writes a `.changeset/some-random-name.md` file. **Commit it with your changes.**

```bash
git add .changeset/
git commit -m "feat: add new thing"
```

### 3. Open a PR as normal

The changeset file is part of the PR. Reviewers can see what bump is intended and what the changelog will say.

---

## When changesets are merged to main

The release GitHub Action runs on every push to `main`:

### If there are pending changesets → opens/updates a "Version Packages" PR

The PR bumps `package.json` and updates `CHANGELOG.md`. Keep merging feature PRs — the "Version Packages" PR updates itself each time, batching all pending changesets.

### If there are no pending changesets → does nothing

### The `changeset-release/main` branch

Fully managed by the Action — never push to it manually.

---

## Cutting a release

1. **Review the "Version Packages" PR** — check the version bump and changelog entry
2. **Merge it**
3. The action then automatically:
   - Publishes to npm (via OIDC trusted publishing — no token needed)
   - Creates a GitHub Release with the changelog as release notes
   - Creates a git tag (e.g. `v1.2.0`)

There is nothing else to do manually.

---

## Cheat sheet

| Situation                                      | Command                                                  |
| ---------------------------------------------- | -------------------------------------------------------- |
| I changed code and need to document it         | `pnpm changeset`                                         |
| I only changed tests, docs, or CI              | No changeset needed                                      |
| I want to see what would be released right now | `pnpm changeset status`                                  |
| I want to release immediately without waiting  | Merge the "Version Packages" PR                          |
| I made a mistake in a changeset                | Edit or delete the `.changeset/*.md` file and amend/push |

---

## Rules of thumb

- **One changeset per PR**, not per commit. The PR is the unit of change.
- **Don't manually edit `package.json` version** — Changesets owns that.
- **Don't manually publish** — the CI action owns that.
