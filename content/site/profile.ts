export interface InlineMark {
  name: string;
  logo: string;
  href?: string;
}

export interface AboutData {
  name: string;
  /** Shown beside the first name when the avatar is pressed. */
  nativeName?: string;
  country: string;
  timeZone: string;
  company?: InlineMark;
  products: InlineMark[];
  /** Independent studio for websites and Framer work. */
  studio?: InlineMark;
  role: string;
  headline: string;
  intro: string;
  approach: string;
  email: string;
  resume?: string;
  portrait?: string;
  /** Right-sized copies of the portrait for the hero avatar (`srcset` widths); the full portrait stays for sharing. */
  portraitSizes?: { src: string; width: number }[];
  socials: {
    github?: string;
    twitter?: string;
    dribbble?: string;
    linkedin?: string;
  };
}

export const aboutData: AboutData = {
  name: "Yogesh Raya",
  nativeName: "योगेश",
  country: "Nepal",
  portrait: "/images/profile.webp",
  portraitSizes: [
    { src: "/images/profile-92.webp", width: 92 },
    { src: "/images/profile-184.webp", width: 184 },
    { src: "/images/profile-276.webp", width: 276 },
  ],
  timeZone: "Asia/Kathmandu",
  company: { name: "Bytecare Technology", logo: "/images/logo/bytecare-logo.webp", href: "https://www.bytecaretech.com/" },
  products: [
    { name: "Karobar", logo: "/images/logo/karobar-logo.webp", href: "https://www.karobarapp.com/" },
    { name: "Briz", logo: "/images/logo/briz-logo.webp", href: "https://www.brizmarket.com/en" },
  ],
  studio: { name: "Overlays Studio", logo: "/images/logo/overlay-logo.webp", href: "https://overlays-studio.framer.website/" },
  role: "Product Designer",
  headline: "Product designer focused on making complex tasks feel simple.",
  intro:
    "I’m Yogesh, a product designer based in Nepal. I turn user problems into clear flows and thoughtful interfaces for digital products.",
  approach:
    "I care about the decisions behind the screen: what people need to do, where they get stuck, and how a design can help them move forward. My work focuses on understanding the problem, exploring practical solutions, and making the next step clear.",
  email: "yogeshraya01@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/yogeshraya01/",
    dribbble: "https://dribbble.com/yogeshraya0",
  },
};

export const principles = [
  "Start with the user's task and the product's constraints.",
  "Explain decisions with evidence and clear reasoning.",
  "Keep improving after the first version ships.",
];

export const strengths = [
  {
    title: "Find the real problem",
    description:
      "I start with what people need to do, where they get stuck, and the constraints behind the product.",
  },
  {
    title: "Make the next step clear",
    description:
      "I turn complex tasks into flows that help people understand what to do and what happens next.",
  },
  {
    title: "Design beyond the happy path",
    description:
      "I consider empty states, errors, permissions, and recovery alongside the main journey.",
  },
  {
    title: "Connect decisions to delivery",
    description:
      "I explain the reasoning behind the design and work through details with the people building it.",
  },
];

/** Companies and products shown in the About page logo strip. Entries without a logo show their initials. */
export const workedWith: { name: string; logo?: string }[] = [
  { name: "Overlays Studio", logo: "/images/logo/overlay-logo.webp" },
  { name: "Karobar", logo: "/images/logo/karobar-logo.webp" },
  { name: "Bytecare Technology", logo: "/images/logo/bytecare-logo.webp" },
  { name: "Briz", logo: "/images/logo/briz-logo.webp" },
  { name: "InternSathi" },
  { name: "Lanceme Up" },
  { name: "Brand Builder" },
  { name: "Binwary" },
];

export const personal = {
  tools: [
    { name: "Figma", icon: "figma", use: "Interface design, prototyping, and handoff" },
    { name: "Framer", icon: "framer", use: "Websites and landing pages, from design to launch" },
    { name: "Mixpanel", icon: "mixpanel", use: "Product analytics and funnels" },
    { name: "Microsoft Clarity", icon: "clarity", use: "Session recordings and heatmaps" },
    { name: "Google Analytics", icon: "googleAnalytics", use: "Traffic and acquisition" },
  ] as const,
  philosophy:
    "I want people to spend less effort understanding the interface and more time doing what they came to do. Clear flows, useful feedback, and thoughtful details matter because they help people move forward.",
};
