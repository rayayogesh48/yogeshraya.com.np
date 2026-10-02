"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { destinations } from "@/config/navigation";
import { Reveal } from "@/components/motion/portfolio-motion.client";
import { ChevronRightIcon, HomeIcon } from "@/components/ui/icons";
import { useToast } from "./toast.client";

export function TopNav({ contactHref, resume }: { contactHref: string; resume?: string }) {
  const path = usePathname();
  const { email, copyEmail } = useToast();
  const current = destinations.find((item) => item.href !== "/" && path.startsWith(item.href));
  const external = contactHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Reveal onMount as="header" className="topnav page-width" y={-6}>
      <nav aria-label="Breadcrumb" className="topnav-crumbs">
        <Link
          className="chip"
          href="/"
          aria-label="Yogesh Raya, home"
          onClick={(event) => {
            if (path !== "/") return;
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <HomeIcon size={13} filled />
          <span>Home</span>
        </Link>
        {current && (
          <>
            <ChevronRightIcon size={12} />
            <Link className="chip" href={current.href} aria-current={path === current.href ? "page" : undefined}>
              {current.label}
            </Link>
          </>
        )}
      </nav>
      <div className="topnav-right">
        {email ? (
          <button type="button" className="chip" onClick={copyEmail}>
            Contact Me
          </button>
        ) : (
          <a className="chip" href={contactHref} {...external}>
            Contact Me
          </a>
        )}
        {resume && (
          <a className="chip" href={resume} download>
            My CV
          </a>
        )}
      </div>
    </Reveal>
  );
}
