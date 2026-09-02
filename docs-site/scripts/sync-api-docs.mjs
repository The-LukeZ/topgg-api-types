import { readdir, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { join, dirname, basename, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Copies typedoc-plugin-markdown's output (generated/api-md, one .md file per
// reflection) into src/routes/docs/api, renaming each file to the SvelteKit
// `+page.md` route convention docsmith expects (one dir per page).

const scriptDir = dirname(fileURLToPath(import.meta.url));
const srcDir = join(scriptDir, "..", "generated", "api-md");
const destDir = join(scriptDir, "..", "src", "routes", "docs", "api");

async function collectMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(full)));
    } else if (entry.isFile() && extname(entry.name) === ".md") {
      files.push(full);
    }
  }
  return files;
}

// typedoc emits object-type literals as backslash-escaped `\{ ... \}` (valid,
// inert CommonMark). Once remark decodes that escape, the literal `{`/`}`
// reaches Svelte's compiler unescaped, which reads it as a mustache/expression
// start and fails to parse (e.g. `{ foo: Bar; }` isn't valid JS). Braces
// aren't HTML-reserved, so entities don't survive serialization either — the
// only reliable fix is mdsvex's own escape hatch: inject a literal-string
// expression Svelte evaluates back to the same character. Left untouched
// inside fenced code blocks, which mdsvex already renders as raw text.
function escapeBraces(text) {
  // Quote characters ('/") get mangled by the markdown pipeline before Svelte
  // sees them, so avoid any quoting in the injected expression.
  return text.replace(/\\?[{}]/g, (match) =>
    match.endsWith("{") ? "{String.fromCharCode(123)}" : "{String.fromCharCode(125)}",
  );
}

function escapeBracesOutsideCodeFences(content) {
  return content
    .split(/(```[\s\S]*?```)/g)
    .map((part, i) => (i % 2 === 1 ? part : escapeBraces(part)))
    .join("");
}

async function main() {
  await rm(destDir, { recursive: true, force: true });

  const files = await collectMarkdownFiles(srcDir);
  for (const file of files) {
    const rel = relative(srcDir, file);
    const base = basename(rel, ".md");
    // typedoc-plugin-markdown names module/namespace index pages "README" or
    // "index"; both map to their containing directory's route.
    const isIndexFile = base === "index" || base === "README";
    const slug = isIndexFile ? dirname(rel) : join(dirname(rel), base);
    const outDir = join(destDir, slug === "." ? "" : slug);
    await mkdir(outDir, { recursive: true });

    const content = await readFile(file, "utf8");
    await writeFile(join(outDir, "+page.md"), escapeBracesOutsideCodeFences(content));
  }

  console.log(`Synced ${files.length} API doc page(s) into ${relative(process.cwd(), destDir)}`);
}

main();
