<script lang="ts">
  import { docs } from "svelte-docsmith/content";
  import { DocsShell, Hero, FeatureGrid, Feature, CTA, Action } from "svelte-docsmith";
  import { siteConfig } from "$lib/site-config";
</script>

<DocsShell config={siteConfig} content={docs} layout="page" pattern>
  <Hero
    title="topgg-api-types"
    description="TypeScript types and zod/mini runtime validators for the Top.gg API, plus optional REST, OAuth, and webhook clients."
  >
    {#snippet actions()}
      <Action href="/docs/introduction">Get started</Action>
      <Action href="/docs/api" variant="secondary">API Reference</Action>
    {/snippet}
  </Hero>

  <FeatureGrid
    background="muted"
    title="One package, every layer"
    description="Use as much or as little as you need — types alone, or the full client."
  >
    <Feature title="TypeScript types">
      Full type coverage for Top.gg's v1 API and the legacy v0 API, kept in sync with the real
      response shapes.
    </Feature>
    <Feature title="zod/mini validators">
      A matching validator for every type, for parsing API responses and verifying incoming webhook
      payloads at runtime.
    </Feature>
    <Feature title="REST client">
      A thin, dependency-free wrapper over native fetch — projects, votes, metrics, and pagination
      handled for you.
    </Feature>
    <Feature title="OAuth 2.1 client">
      Authorization URL building, code/PKCE exchange, token refresh, and revocation for user-facing
      integrations.
    </Feature>
    <Feature title="Webhook verification">
      HMAC signature verification for vote and integration webhooks, built on Web Crypto so it runs
      anywhere.
    </Feature>
    <Feature title="v0 and v1, side by side">
      The deprecated legacy API stays fully typed and supported alongside the current one — no need
      to drop it to upgrade.
    </Feature>
  </FeatureGrid>

  <CTA
    title="Start building"
    description="Install the package and pick the subpath you need — types, validators, or a client."
  >
    {#snippet actions()}
      <Action href="/docs/introduction">Read the docs</Action>
    {/snippet}
  </CTA>
</DocsShell>
