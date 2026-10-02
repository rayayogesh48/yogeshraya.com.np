"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { destinations, type DestinationIcon } from "@/config/navigation";
import { useTheme } from "@/components/theme/theme-provider.client";
import type { Theme } from "@/components/theme/theme-init";
import { EASE } from "@/components/motion/portfolio-motion.client";
import { useToast } from "./toast.client";
import {
  BookIcon,
  GearIcon,
  HomeIcon,
  MailIcon,
  MonitorIcon,
  MoonIcon,
  PersonIcon,
  ProjectsIcon,
  SparkleIcon,
  SunIcon,
} from "@/components/ui/icons";

type IconComponent = ComponentType<{ size?: number; filled?: boolean }>;

const icons: Record<DestinationIcon, IconComponent> = {
  home: HomeIcon,
  work: ProjectsIcon,
  about: PersonIcon,
  craft: SparkleIcon,
  insights: BookIcon,
};

const themes: [Theme, string, IconComponent][] = [
  ["system", "System", MonitorIcon],
  ["light", "Light", SunIcon],
  ["dark", "Dark", MoonIcon],
];

/** On the home page, the active item follows whichever `[data-dock]` section is near the top of the viewport. */
function useHomeSection(enabled: boolean) {
  const [section, setSection] = useState<string>("home");
  useEffect(() => {
    if (!enabled) return;
    const update = () => {
      const threshold = window.innerHeight * 0.4;
      const sections = [...document.querySelectorAll<HTMLElement>("[data-dock]")];
      let current = "home";
      for (const element of sections) {
        if (element.getBoundingClientRect().top <= threshold) current = element.dataset.dock ?? current;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && sections.length) current = sections[sections.length - 1].dataset.dock ?? current;
      setSection(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);
  return section;
}

function scrollToSection(id: string) {
  if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
  else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function DockLabel({ label, active, Icon }: { label: string; active: boolean; Icon: IconComponent }) {
  return (
    <>
      {active && (
        <motion.span layoutId="dock-pill" className="dock-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
      )}
      <motion.span
        className="dock-icon"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      >
        <Icon size={16} filled={active} />
      </motion.span>
      <AnimatePresence initial={false}>
        {active && (
          <motion.span
            className="dock-label"
            aria-hidden="true"
            initial={{ width: 0, opacity: 0, filter: "blur(4px)" }}
            animate={{ width: "auto", opacity: 1, filter: "blur(0px)" }}
            exit={{ width: 0, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <span>{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
}

function SettingsPanel({ id }: { id: string }) {
  const { theme, setTheme } = useTheme();
  const [tip, setTip] = useState(false);
  return (
    <motion.div
      key="settings"
      id={id}
      className="dock-settings"
      role="group"
      aria-label="Settings"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="dock-settings-inner">
        <div className="dock-panel-section">
          <span className="dock-panel-label" id={`${id}-theme`}>Theme</span>
          <div className="dock-panel-options" role="group" aria-labelledby={`${id}-theme`}>
            {themes.map(([value, label, Icon]) => {
              const selected = theme === value;
              return (
                <button
                  type="button"
                  key={value}
                  className={`dock-option ${selected ? "is-selected" : ""}`}
                  aria-pressed={selected}
                  onClick={() => setTheme(value)}
                >
                  {selected && (
                    <motion.span layoutId="theme-pill" className="dock-option-pill" transition={{ type: "spring", stiffness: 500, damping: 36 }} />
                  )}
                  <motion.span animate={{ rotate: selected ? 0 : -30, scale: selected ? 1 : 0.85 }}>
                    <Icon size={13} />
                  </motion.span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="dock-panel-section">
          <span className="dock-panel-label" id={`${id}-language`}>Language</span>
          <div className="dock-panel-options" role="group" aria-labelledby={`${id}-language`}>
            <button type="button" className="dock-option is-selected" aria-pressed="true">
              <span className="dock-option-pill" />
              <span>English</span>
            </button>
            <button
              type="button"
              className="dock-option is-disabled"
              aria-disabled="true"
              aria-describedby={tip ? `${id}-soon` : undefined}
              onMouseEnter={() => setTip(true)}
              onMouseLeave={() => setTip(false)}
              onFocus={() => setTip(true)}
              onBlur={() => setTip(false)}
              onClick={() => {
                setTip(true);
                setTimeout(() => setTip(false), 1400);
              }}
            >
              <span lang="ne">नेपाली</span>
              <AnimatePresence>
                {tip && (
                  <motion.span
                    id={`${id}-soon`}
                    className="dock-tip"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Coming soon
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DockItem({
  href,
  onHome,
  section,
  onNavigate,
  className,
  current,
  label,
  children,
}: {
  href: string;
  onHome: boolean;
  section: string;
  onNavigate: () => void;
  className: string;
  current: boolean;
  label: string;
  children: ReactNode;
}) {
  if (onHome) {
    return (
      <button
        type="button"
        className={className}
        aria-label={label}
        aria-current={current ? "true" : undefined}
        onClick={() => {
          onNavigate();
          scrollToSection(section);
        }}
      >
        {children}
      </button>
    );
  }
  return (
    <Link href={href} className={className} aria-label={label} aria-current={current ? "page" : undefined} onClick={onNavigate}>
      {children}
    </Link>
  );
}

export function Dock({ contactHref }: { contactHref: string }) {
  const path = usePathname();
  const onHome = path === "/";
  const homeSection = useHomeSection(onHome);
  const { email, copyEmail } = useToast();
  const [open, setOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointer = (event: PointerEvent) => {
      if (!dockRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const isActive = (href: string, icon: DestinationIcon) => {
    if (onHome) return homeSection === icon;
    return href !== "/" && path.startsWith(href);
  };

  return (
    <>
      <div className="dock-blur" aria-hidden="true" />
      <motion.div
        ref={dockRef}
        className="dock"
        initial={{ y: 40, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
      >
        <motion.div layout className="dock-container" transition={{ duration: 0.35, ease: EASE }}>
          <AnimatePresence initial={false}>{open && <SettingsPanel id="dock-settings" />}</AnimatePresence>
          <nav className="dock-bar" aria-label="Main navigation">
            {destinations.map(({ href, label, icon, section }) => {
              const active = isActive(href, icon) && !open;
              return (
                <DockItem
                  key={href}
                  href={href}
                  onHome={onHome}
                  section={section}
                  label={label}
                  current={isActive(href, icon)}
                  className={`dock-item ${active ? "is-active" : ""}`}
                  onNavigate={() => setOpen(false)}
                >
                  <DockLabel label={label} active={active} Icon={icons[icon]} />
                </DockItem>
              );
            })}
            <span className="dock-separator" aria-hidden="true" />
            {email ? (
              <button type="button" className="dock-item" aria-label="Copy email" onClick={copyEmail}>
                <DockLabel label="Contact" active={false} Icon={MailIcon} />
              </button>
            ) : (
              <a
                className="dock-item"
                href={contactHref}
                aria-label="Contact"
                {...(contactHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <DockLabel label="Contact" active={false} Icon={MailIcon} />
              </a>
            )}
            <span className="dock-separator" aria-hidden="true" />
            <button
              ref={triggerRef}
              type="button"
              className={`dock-item ${open ? "is-open" : ""}`}
              aria-label="Settings"
              aria-expanded={open}
              aria-controls="dock-settings"
              onClick={() => setOpen((value) => !value)}
            >
              <motion.span
                className="dock-icon"
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <GearIcon size={16} />
              </motion.span>
            </button>
          </nav>
        </motion.div>
      </motion.div>
    </>
  );
}
