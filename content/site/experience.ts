export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location?: string;
  /** Path under /public; the timeline falls back to initials when missing. */
  logo?: string;
  summary?: string;
  contributions: string[];
  caseStudySlug?: string;
}

export const experiences: ExperienceItem[] = [
  {
    company: "Overlays Studio",
    role: "Lead Designer",
    period: "Dec 2025 — Present",
    location: "Kathmandu, Nepal",
    logo: "/images/logo/overlay-logo.webp",
    summary:
      "Working with startups and agencies to design and build websites and landing pages in Framer, focused on clarity, usability, and speed to launch.",
    contributions: [
      "Website and landing page design, from UX to UI.",
      "Design systems that keep pages consistent as they grow.",
      "Framer development from concept or Figma.",
      "Supporting agencies with scalable design capacity.",
    ],
  },
  {
    company: "Karobar",
    role: "Product Designer",
    period: "Apr 2023 — Present",
    location: "Lalitpur, Nepal",
    logo: "/images/logo/karobar-logo.webp",
    summary:
      "Creating user-friendly designs that make products easy to use and visually appealing, from understanding user needs to working closely with developers to bring everything together.",
    contributions: [
      "Conducted research to understand user problems and needs.",
      "Designed clear and engaging interfaces for web and mobile.",
      "Collaborated with developers to ensure smooth design handoff.",
    ],
    caseStudySlug: "briz-mobile-workflow",
  },
  {
    company: "InternSathi",
    role: "UI Designer",
    period: "Jan 2023 — Aug 2024",
    location: "Biratnagar, Nepal",
    summary:
      "Designed components for web and mobile apps, keeping them simple, modern, and easy to use, with a focus on usability and a seamless experience.",
    contributions: [
      "Designed clean and structured UI components for multiple platforms.",
      "Improved layouts to enhance user experience.",
      "Worked closely with developers to ensure smooth execution.",
    ],
  },
  {
    company: "Lanceme Up",
    role: "UI Designer",
    period: "Jan 2023 — Jun 2023",
    location: "Kathmandu, Nepal",
    summary:
      "Led the UI/UX redesign of Lanceme Up V3 across web and mobile, making it modern, functional, and easy to navigate.",
    contributions: [
      "Designed and improved the user interface for Lanceme Up V3.",
      "Created visually appealing and user-friendly layouts.",
      "Provided feedback to interns and collaborated with developers.",
    ],
  },
  {
    company: "Brand Builder",
    role: "UI Designer",
    period: "Jun 2022 — Jan 2023",
    contributions: [
      "Led design reviews and gave feedback to entry-level designers (interns).",
      "Helped create mobile app wireframes, mockups, and prototypes.",
    ],
  },
  {
    company: "Binwary",
    role: "Designer & HTML Developer",
    period: "Aug 2021 — Jan 2022",
    location: "Biratnagar, Nepal",
    summary:
      "Started my journey in web design and development, learning to create clean, structured, user-friendly interfaces and seeing how design and development connect.",
    contributions: [
      "Developed web pages using HTML and CSS.",
      "Designed simple, functional, and responsive layouts.",
      "Worked with teams to improve overall design quality.",
    ],
  },
];
