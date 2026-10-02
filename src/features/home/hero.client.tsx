"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useState, type ReactNode } from "react";
import { aboutData, type InlineMark } from "@site/profile";
import { EASE, Reveal } from "@/components/motion/portfolio-motion.client";
import { TopoField } from "@/components/visual/topo-field.client";
import { useToast } from "@/components/site/toast.client";
import { ArrowUpRightIcon, DownloadIcon, Mark, NepalFlagIcon } from "@/components/ui/icons";

function InlineLink({ item }: { item: InlineMark }) {
  const content: ReactNode = (
    <>
      <span className="hero-icon">
        <Mark label={item.mark} color={item.color} size={18} />
      </span>
      <span className="hero-link-text">{item.name}</span>
    </>
  );
  if (!item.href) return <span className="hero-inline-tag hl">{content}</span>;
  return (
    <Link className="hero-link" href={item.href}>
      {content}
    </Link>
  );
}

function joinProducts(products: InlineMark[]) {
  return products.flatMap((product, index) => [
    index > 0 && <span key={`and-${product.name}`}>{index === products.length - 1 ? " and " : ", "}</span>,
    <InlineLink key={product.name} item={product} />,
  ]);
}

export function Hero() {
  const { email, copyEmail } = useToast();
  const [showNative, setShowNative] = useState(false);
  const { scrollY } = useScroll();
  const bannerY = useTransform(scrollY, [0, 400], [0, 60]);
  const bannerOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const { name, nativeName, role, country, company, products, portrait, resume } = aboutData;
  const [firstName, ...otherNames] = name.split(" ");

  return (
    <section className="hero" id="top" data-dock="home" aria-labelledby="profile-name">
      <Reveal onMount className="banner-wrap">
        <motion.div className="banner" style={{ y: bannerY, opacity: bannerOpacity }}>
          <TopoField />
        </motion.div>
        <motion.button
          type="button"
          className="avatar"
          aria-label={nativeName ? "Show my name in Nepali" : name}
          aria-pressed={nativeName ? showNative : undefined}
          onClick={() => setShowNative((value) => !value)}
          whileHover={{ scale: 1.04, rotate: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          {portrait ? <img src={portrait} alt="" /> : <span className="avatar-mono">{firstName[0]}</span>}
        </motion.button>
      </Reveal>

      <div className="hero-text">
        <h1 className="hero-name" id="profile-name">
          <Reveal onMount delay={0.1} as="span" className="name-part">
            {firstName}
          </Reveal>
          <AnimatePresence initial={false}>
            {showNative && nativeName && (
              <motion.span
                className="name-hidden"
                lang="ne"
                initial={{ width: 0, opacity: 0, filter: "blur(6px)" }}
                animate={{ width: "auto", opacity: 1, filter: "blur(0px)" }}
                exit={{ width: 0, opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {" · "}
                {nativeName}
              </motion.span>
            )}
          </AnimatePresence>
          {otherNames.length > 0 && (
            <Reveal onMount delay={0.15} as="span" className="name-part">
              {" "}
              {otherNames.join(" ")}
            </Reveal>
          )}
        </h1>
        <Reveal onMount delay={0.18} as="p" className="hero-subtitle">
          {role}
        </Reveal>
        <Reveal onMount delay={0.26} as="p" className="hero-bio">
          Hey, I&apos;m {firstName}, a {role} based in{" "}
          <span className="hero-inline-tag">
            <span className="hero-icon">
              <NepalFlagIcon size={15} />
            </span>
            <span className="hl">{country}</span>
          </span>
          . I turn user problems into clear flows and thoughtful interfaces
          {company && (
            <>
              . I currently design at <InlineLink item={company} />
            </>
          )}
          {products.length > 0 && <>, working on products like {joinProducts(products)}</>}.
        </Reveal>
        {email && (
          <Reveal onMount delay={0.34} className="hero-hint">
            Press{" "}
            <button type="button" onClick={copyEmail} aria-label="Copy email" aria-keyshortcuts="m">
              <kbd>M</kbd>
            </button>{" "}
            to copy my email
          </Reveal>
        )}
        <Reveal onMount delay={0.4} className="hero-ctas">
          <a
            className="chip"
            href="#work"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <span>View work</span>
            <ArrowUpRightIcon size={13} />
          </a>
          {resume && (
            <a className="chip" href={resume} download>
              <span>Download CV</span>
              <DownloadIcon size={13} />
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
