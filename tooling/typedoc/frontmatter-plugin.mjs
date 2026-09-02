import { ReflectionKind } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

/** @param {import("typedoc-plugin-markdown").MarkdownApplication} app */
export function load(app) {
  let order = 0;

  app.renderer.on(MarkdownPageEvent.BEGIN, (page) => {
    const reflection = page.model;
    const title =
      reflection && "name" in reflection ? reflection.name : page.url.replace(/\.md$/, "");
    const isIndex = reflection?.kind === ReflectionKind.Project;

    page.frontmatter = {
      title: isIndex ? "API Reference" : title,
      section: "API Reference",
      order: order++,
      ...page.frontmatter,
    };
  });
}
