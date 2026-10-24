"use client";

import { Mascot } from "page-mascot";
import { useEffect, useState } from "react";

/**
 * The owl (page-mascot, MIT) in the bottom corner of every page. It turns to follow the cursor on desktop and reacts
 * when clicked. It mounts once the browser is idle so its sprite sheets never compete with the page's first paint.
 */
export function SiteMascot() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(start, 1200);
    return () => clearTimeout(timer);
  }, []);
  if (!ready) return null;
  return (
    <div className="site-mascot">
      <Mascot directions="/mascots/owl-directions.webp" reactions="/mascots/owl-reactions.webp" size={112} label="owl" />
    </div>
  );
}
