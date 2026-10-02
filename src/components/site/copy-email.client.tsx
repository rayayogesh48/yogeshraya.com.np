"use client";

import { Copy } from "lucide-react";
import { useToast } from "./toast.client";

/** The M shortcut itself lives in ToastProvider so it works on every page. */
export function CopyEmail() {
  const { copyEmail } = useToast();
  return (
    <button type="button" className="button secondary" onClick={copyEmail} aria-keyshortcuts="m">
      <Copy size={15} aria-hidden="true" />
      Copy Email<kbd>M</kbd>
    </button>
  );
}
