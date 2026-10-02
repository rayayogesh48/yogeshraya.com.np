"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { EASE } from "@/components/motion/portfolio-motion.client";

type ToastContextValue = { showToast: (text: string) => void; copyEmail: () => void; email: string };
const ToastContext = createContext<ToastContextValue | null>(null);

function isEditable(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || Boolean(target.closest("input, textarea, select, [role='textbox']")));
}

/** Shows short confirmations above the dock and owns the site-wide M-to-copy-email shortcut. */
export function ToastProvider({ email, children }: { email: string; children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((text: string) => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), text });
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const copyEmail = useCallback(async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied to clipboard");
    } catch {
      showToast(email);
    }
  }, [email, showToast]);

  useEffect(() => {
    if (!email) return;
    function onKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "m" || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      if (event.defaultPrevented || isEditable(event.target)) return;
      void copyEmail();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [copyEmail, email]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ showToast, copyEmail: () => void copyEmail(), email }), [showToast, copyEmail, email]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="dock-toast"
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.96, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -6, scale: 0.98, x: "-50%" }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <span className="dock-toast-check">
              <CheckIcon size={13} />
            </span>
            <span>{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}
