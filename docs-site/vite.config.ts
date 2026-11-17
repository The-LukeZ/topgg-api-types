import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { docsmith } from "svelte-docsmith/vite";

export default defineConfig({
  // `docsmith()` is the one place the site is configured: it builds the content +
  // search indexes, compiles `.md` pages, and powers LiveExample. It must come
  // before sveltekit(). See https://docsmith.geodask.com.
  plugins: [
    docsmith({
      site: {
        title: "topgg-api-types",
        nav: [
          { label: "API Reference", href: "/docs/api" },
          { label: "LLMs", href: "/llms.txt", external: true },
        ],
        description:
          "TypeScript types and zod/mini runtime validators for the Top.gg API, plus optional REST, OAuth, and webhook clients.",
        url: "https://topgg-api-types.thelukez.com",
        github: "https://github.com/The-LukeZ/topgg-api-types",
        editUrl:
          "https://github.com/The-LukeZ/topgg-api-types/edit/main/docs-site/src/routes/docs/",
        footer: {
          copyright: `© ${new Date().getFullYear()} The-LukeZ`,
        },
      },
      theme: "bubblegum",
    }),
    tailwindcss(),
    sveltekit({
      // `.md` files are compiled as routes by the docsmith() Vite plugin.
      extensions: [".svelte", ".md"],
      preprocess: [vitePreprocess()],
      adapter: adapter(),
    }),
  ],
});
