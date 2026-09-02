import { defineConfig } from "svelte-docsmith";

// The whole-site config passed to DocsShell. Set your title, links, and the
// SEO/social defaults here. See https://docsmith.geodask.com.
export const siteConfig = defineConfig({
  title: "Docs Site",
  nav: [
    { label: "API Reference", href: "/docs/api" },
    { label: "LLMs", href: "/llms.txt", external: true },
  ],
  description:
    "TypeScript types and zod/mini runtime validators for the Top.gg API, plus optional REST, OAuth, and webhook clients.",
  url: "https://topgg-api-types.thelukez.com",
  github: "https://github.com/The-LukeZ/topgg-api-types",
  editUrl: "https://github.com/The-LukeZ/topgg-api-types/edit/main/docs-site/src/routes/docs/",
  footer: {
    copyright: `© ${new Date().getFullYear()} The-LukeZ`,
  },
});
