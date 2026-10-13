import {
  FaCartShopping,
  FaCloud,
  FaGaugeHigh,
  FaGlobe,
  FaListCheck,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    title: "Website Development",
    description:
      "Fast, responsive websites for businesses and individuals, built with modern frontend technologies and clean, maintainable code.",
    icon: FaGlobe,
    includes: ["Responsive layouts", "Business & personal websites", "SEO-friendly structure"],
  },
  {
    title: "SaaS & Full-Stack Web Applications",
    description:
      "Subscription-based SaaS products and complete web applications, from the user interface to the server, API, and database behind them.",
    icon: FaCloud,
    includes: ["SaaS products & subscription workflows", "Node.js & Express.js APIs", "MongoDB data modelling"],
  },
  {
    title: "E-commerce System Development",
    description:
      "Online stores with product catalogues, shopping flows, order handling, and the admin tools to run them.",
    icon: FaCartShopping,
    includes: ["Product & category management", "Shopping & order workflows", "Store admin tools"],
  },
  {
    title: "Custom Management Systems",
    description:
      "Tailored systems for managing records, people, inventory, or bookings, shaped around how your organisation works.",
    icon: FaListCheck,
    includes: ["Record management", "Role-based access", "Workflow automation"],
  },
  {
    title: "Dashboard & Admin Panel Development",
    description:
      "Clear, data-driven dashboards and admin panels that make managing your platform straightforward.",
    icon: FaGaugeHigh,
    includes: ["Admin dashboards", "User & content management", "Role-specific views"],
  },
  {
    title: "Website Redesign & Optimisation",
    description:
      "Modernising existing websites with improved design, responsiveness, performance, and usability.",
    icon: FaWandMagicSparkles,
    includes: ["UI refresh", "Mobile responsiveness", "Performance improvements"],
  },
];
