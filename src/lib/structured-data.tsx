import { aboutData } from "@site/profile";
import { experiences } from "@site/experience";
import { siteDescription, siteName, siteUrl } from "@/config/site";
import { insightPath } from "@/config/routes";
import type { BlogEntry } from "@/content/types";

/** schema.org JSON-LD for search engines. URLs must be absolute, so linked fields are only added when the site URL is known. */
type Thing = Record<string, unknown>;

const absolute = (path: string) => (siteUrl ? `${siteUrl}${path}` : undefined);
const personId = absolute("/#person");

export function personSchema(): Thing {
  const current = experiences.filter((item) => item.period.endsWith("Present"));
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    ...(personId ? { "@id": personId, url: siteUrl } : {}),
    name: aboutData.name,
    jobTitle: aboutData.role,
    description: aboutData.headline,
    ...(aboutData.portrait && siteUrl ? { image: absolute(aboutData.portrait) } : {}),
    ...(aboutData.email ? { email: `mailto:${aboutData.email}` } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
    worksFor: current.map((item) => ({ "@type": "Organization", name: item.company })),
    knowsAbout: ["Product design", "UX design", "UI design", "User research", "Interaction design", "Framer"],
    sameAs: Object.values(aboutData.socials).filter(Boolean),
  };
}

export function websiteSchema(): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: siteDescription,
    inLanguage: "en",
    ...(siteUrl ? { url: siteUrl, publisher: { "@id": personId } } : {}),
  };
}

export function articleSchema(post: BlogEntry): Thing {
  const url = absolute(insightPath(post.slug));
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "en",
    author: personId ? { "@id": personId, "@type": "Person", name: aboutData.name } : { "@type": "Person", name: aboutData.name },
    ...(url ? { url, mainEntityOfPage: url } : {}),
    ...(post.cover && siteUrl ? { image: absolute(post.cover) } : {}),
  };
}

/** Renders JSON-LD; `<` is escaped so content can never close the script tag early. */
export function JsonLd({ data }: { data: Thing | Thing[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
