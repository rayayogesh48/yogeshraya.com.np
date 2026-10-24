"use client";

import { Share2 } from "lucide-react";
import { useToast } from "@/components/site/toast.client";

/** Opens the device share sheet where there is one, otherwise copies the page link. */
export function ShareButton({ title }: { title: string }) {
  const { showToast } = useToast();
  const share = async () => {
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Closing the share sheet isn't an error worth reporting.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    } catch {
      showToast(url);
    }
  };
  return (
    <button type="button" className="article-action" onClick={() => void share()}>
      <Share2 size={14} aria-hidden="true" />
      Share
    </button>
  );
}
