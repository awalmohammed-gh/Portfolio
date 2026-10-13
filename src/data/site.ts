import type { NavLink, SocialLink } from "@/types/content";

export const site = {
  name: "Mohammed Awal",
  title: "Full-Stack Web Developer & Software Engineer",
  heroIntro:
    "Hello, I'm Mohammed Awal, a Full-Stack Web Developer passionate about building modern websites, powerful web applications, and scalable digital solutions.",
  heroHeading: "Building Digital Experiences From Frontend to Backend.",
  heroDescription:
    "I develop responsive, user-friendly web applications and full-stack software solutions, combining modern frontend technologies with reliable backend systems to solve real-world problems.",
  email: "awalm8043@gmail.com",
  // Ghanaian numbers: shown in local format, dialled with the +233 country code.
  phones: [
    { display: "053 863 2229", href: "tel:+233538632229" },
    { display: "020 125 9784", href: "tel:+233201259784" },
  ],
  profileImage: {
    src: "/images/mohammed-awal.jpg",
    width: 1920,
    height: 2560,
    alt: "Mohammed Awal working on a laptop at his desk",
  },
} as const;

/** Technologies highlighted across the site (hero, skills preview). */
export const coreStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "MongoDB",
  "REST APIs",
  "Authentication",
];

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

/** Add profiles here (e.g. GitHub, LinkedIn) once the URLs are confirmed. Empty entries are not rendered. */
export const socialLinks: SocialLink[] = [];
