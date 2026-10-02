export interface InlineMark {
  name: string;
  mark: string;
  color: string;
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
  role: string;
  headline: string;
  intro: string;
  approach: string;
  email: string;
  resume?: string;
  portrait?: string;
  socials: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const aboutData: AboutData = {
  name: "Yogesh Raya",
  nativeName: "योगेश",
  country: "Nepal",
  timeZone: "Asia/Kathmandu",
  company: { name: "Bytecare Technology", mark: "B", color: "#e2483d" },
  products: [{ name: "Briz", mark: "B", color: "#4f46e5", href: "/work/briz-mobile-workflow" }],
  role: "Product Designer",
  headline: "Product designer focused on making complex tasks feel simple.",
  intro:
    "I’m Yogesh, a product designer based in Nepal. I turn user problems into clear flows and thoughtful interfaces for digital products.",
  approach:
    "I care about the decisions behind the screen: what people need to do, where they get stuck, and how a design can help them move forward. My work focuses on understanding the problem, exploring practical solutions, and making the next step clear.",
  email: "",
  socials: {
    linkedin: "https://www.linkedin.com/in/yogeshraya01/",
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

export const personal = {
  focus: "Clear flows & thoughtful interfaces",
  languages: ["English", "Nepali"],
  reading: "Not shared yet",
  activity: "Not shared yet",
  tools: ["Figma", "Mixpanel", "Microsoft Clarity", "Google Analytics"],
  philosophy:
    "I want people to spend less effort understanding the interface and more time doing what they came to do. Clear flows, useful feedback, and thoughtful details matter because they help people move forward.",
};
