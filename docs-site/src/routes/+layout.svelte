<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();

  // Site-wide: any link to a different origin opens in a new tab.
  function handleClick(e: MouseEvent) {
    const link = (e.target as HTMLElement)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!link || !/^https?:$/.test(link.protocol)) return;
    if (link.origin !== window.location.origin) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  }
</script>

<svelte:document onclick={handleClick} />

{@render children()}
