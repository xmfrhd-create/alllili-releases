"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function track(event: string, data: Record<string, string | undefined> = {}) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, path: location.pathname, ...data }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the page */
  }
}

// Sends a page view on every navigation and records clicks on outside links
// (for example a visitor opening an organizer's Instagram), which is our
// best signal that someone actually plans to go dancing.
export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    const city = pathname.startsWith("/city/") ? pathname.split("/")[2] : undefined;
    track("pageview", { city, referrer: document.referrer || undefined });
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as HTMLElement).closest("a");
      if (!a || !a.href.startsWith("http")) return;
      const url = new URL(a.href);
      if (url.host === location.host) return;
      const city = location.pathname.startsWith("/city/") ? location.pathname.split("/")[2] : undefined;
      track("outbound", { target: url.host + url.pathname, city });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
