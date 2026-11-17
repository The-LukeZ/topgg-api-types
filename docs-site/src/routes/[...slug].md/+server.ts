import { agentMarkdown } from "svelte-docsmith/server";

export const prerender = true;

// `entries` enumerates every page so the `.md` twins prerender even if nothing links to them.
export const { GET, entries } = agentMarkdown();
