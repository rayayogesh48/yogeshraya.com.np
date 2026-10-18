"use client";

import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { aboutData, type InlineMark } from "@site/profile";
import { EASE } from "@/components/motion/portfolio-motion.client";
import { RangeField } from "@/components/visual/range-field.client";
import { useToast } from "@/components/site/toast.client";
import { ArrowUpRightIcon, DownloadIcon, NepalFlagIcon } from "@/components/ui/icons";

/**
 * The hero fades in with a CSS animation rather than Motion, so it plays from the first paint without waiting for
 * JavaScript. The bio is the page's Largest Contentful Paint, so delays stay short.
 */
const heroDelay = (seconds: number) => ({ "--hero-delay": `${seconds}s` }) as CSSProperties;

function InlineLink({ item }: { item: InlineMark }) {
  const content: ReactNode = (
    <>
      <span className="hero-icon">
        <img className="hero-logo" src={item.logo} alt="" width={18} height={18} />
      </span>
      <span className="hero-link-text">{item.name}</span>
    </>
  );
  if (!item.href) return <span className="hero-inline-tag hl">{content}</span>;
  if (/^https?:\/\//.test(item.href)) {
    return (
      <a className="hero-link" href={item.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
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
  const { name, nativeName, role, country, company, products, studio, portrait, portraitSizes, resume } = aboutData;
  const [firstName, ...otherNames] = name.split(" ");

  return (
    <section className="hero" id="top" data-dock="home" aria-labelledby="profile-name">
      <div className="banner-wrap hero-in">
        <motion.div className="banner" style={{ y: bannerY, opacity: bannerOpacity }}>
          <RangeField />
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
          {portrait ? (
            <img
              src={portraitSizes?.[0]?.src ?? portrait}
              srcSet={portraitSizes?.map((size) => `${size.src} ${size.width}w`).join(", ")}
              sizes="(max-width: 640px) 72px, 92px"
              alt=""
              width={92}
              height={92}
            />
          ) : (
            <span className="avatar-mono">{firstName[0]}</span>
          )}
        </motion.button>
      </div>

      <div className="hero-text">
        <h1 className="hero-name" id="profile-name">
          <span className="name-part hero-in" style={heroDelay(0.04)}>
            {firstName}
          </span>
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
            <span className="name-part hero-in" style={heroDelay(0.06)}>
              {" "}
              {otherNames.join(" ")}
            </span>
          )}
        </h1>
        <p className="hero-subtitle hero-in" style={heroDelay(0.06)}>
          {role}
        </p>
        <p className="hero-bio hero-in" style={heroDelay(0.08)}>
          Hey, I&apos;m {firstName}, a {role} based in{" "}
          <span className="hero-inline-tag">
            <span className="hero-icon">
              <NepalFlagIcon size={15} />
            </span>
            <span className="hl">{country}</span>
          </span>
          .
          {products.length > 0 && <> I design {joinProducts(products)}</>}
          {company && (
            <>
              {" "}
              at <InlineLink item={company} />
            </>
          )}
          {studio && (
            <>
              , and build digital products, websites, and Framer experiences through <InlineLink item={studio} />
            </>
          )}
          .
        </p>
        {email && (
          <div className="hero-hint hero-in" style={heroDelay(0.12)}>
            Press{" "}
            <button type="button" onClick={copyEmail} aria-label="Copy email" aria-keyshortcuts="m">
              <kbd>M</kbd>
            </button>{" "}
            to copy my email
          </div>
        )}
        <div className="hero-ctas hero-in" style={heroDelay(0.14)}>
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
        </div>
      </div>
    </section>
  );
}
