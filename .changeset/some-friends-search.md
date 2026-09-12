---
"topgg-api-types": patch
---

fix: bind default fetch to globalThis to avoid illegal invocation on Workers

The default fetch fallback (`options.fetch ?? fetch`) stored an unbound
reference. performRequest calls it as `opts.fetchImpl(url, init)`, a
plain call with no receiver — Cloudflare Workers' native fetch requires
`this` to be the global scope and throws "Illegal invocation" otherwise.
