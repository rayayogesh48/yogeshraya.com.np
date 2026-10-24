import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { aboutData } from "@site/profile";
import { ShareButton } from "./share-button.client";

/** End-of-article card: who made it, with Share and a way to get in touch (email when set, otherwise LinkedIn). */
export function ArticleSignoff({ title, label = "Written by" }: { title: string; label?: string }) {
  const avatar = aboutData.portraitSizes?.[1]?.src ?? aboutData.portrait;
  const contactHref = aboutData.email ? `mailto:${aboutData.email}` : (aboutData.socials.linkedin ?? "/about#contact");
  const external = contactHref.startsWith("http");
  return (
    <aside className="article-signoff" aria-label="About the author">
      {avatar && <img className="article-signoff-avatar" src={avatar} alt="" width={56} height={56} />}
      <div className="article-signoff-text">
        <p className="article-signoff-label">{label}</p>
        <Link href="/about" className="article-signoff-name">
          {aboutData.name}
        </Link>
        <p className="article-signoff-bio">{aboutData.headline}</p>
      </div>
      <div className="article-signoff-actions">
        <ShareButton title={title} />
        <a className="article-action article-action-primary" href={contactHref} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          Get in touch
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
