"use client";

import { useEffect, useState } from "react";

/**
 * Event fired by SearchLoadMore after each successful Load More click,
 * carrying the number of Wikipedia cards currently on screen.
 *
 * The /search page is a server component: its header, badges, and section
 * notes render once with the initial batch. This event is the bridge that
 * lets those server-rendered counts stay in sync with the client-side
 * appends — it carries display counts only and touches no search,
 * ranking, filtering, or pagination logic.
 */
export const WIKI_SHOWN_EVENT = "pb:wiki-shown";

export function notifyWikiShown(shown: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(WIKI_SHOWN_EVENT, { detail: { shown } })
  );
}

interface Props {
  /** Wikipedia results shown at first render (server-rendered batch). */
  initial: number;
  /** Static results already counted in the total (e.g. local profiles). */
  base?: number;
}

/**
 * Displays a result count that updates live as Load More appends cards.
 * Renders the server-provided initial value first (no hydration
 * mismatch), then updates whenever SearchLoadMore reports a new
 * shown count.
 */
export default function ShownCounter({ initial, base = 0 }: Props) {
  const [shown, setShown] = useState(initial);

  useEffect(() => {
    const onShown = (e: Event) => {
      const detail = (e as CustomEvent<{ shown: number }>).detail;
      if (typeof detail?.shown === "number") setShown(detail.shown);
    };
    window.addEventListener(WIKI_SHOWN_EVENT, onShown);
    return () => window.removeEventListener(WIKI_SHOWN_EVENT, onShown);
  }, []);

  return <>{base + shown}</>;
}
