"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function PortfolioMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type RevealTag = "div" | "p" | "span" | "nav" | "footer" | "section" | "ul" | "header";

const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

/** Fades and un-blurs its children upward, on mount or when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  as = "div",
  onMount = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: RevealTag;
  onMount?: boolean;
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      {...(onMount ? { animate: shown } : { whileInView: shown, viewport: { once: true, amount: 0.2 } })}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

const wordContainer = (delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: delay } },
});
const word: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

/** A heading whose words blur in one after another. */
export function WordReveal({
  text,
  as = "h2",
  className,
  delay = 0,
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
  id?: string;
}) {
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      id={id}
      className={className}
      variants={wordContainer(delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      aria-label={text}
    >
      {words.map((value, index) => (
        <motion.span key={index} variants={word} className="word" aria-hidden="true">
          {value}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </Tag>
  );
}

/** Staggers children that use `staggerItem` as their variants. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  as?: "div" | "ul";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Tag>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};
