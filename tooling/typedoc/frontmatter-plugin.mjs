import { ReflectionKind } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

/** @param {import("typedoc-plugin-markdown").MarkdownApplication} app */
export function load(app) {
  let order = 0;

  app.renderer.on(MarkdownPageEvent.BEGIN, (page) => {
    const reflection = page.model;
    const rawName =
      reflection && "name" in reflection ? reflection.name : page.url.replace(/\.md$/, "");
    // src/index.ts has no meaningful directory to derive a module name from, so
    // typedoc names it "index" — same as the readme/project index page's own
    // default, which reads as a duplicate sidebar entry. Give it a real name.
    const title = rawName === "index" ? "Root" : rawName;
    const isIndex = reflection?.kind === ReflectionKind.Project;

    page.frontmatter = {
      title: isIndex ? "API Reference" : title,
      section: "API Reference",
      order: order++,
      ...page.frontmatter,
    };
  });
}
