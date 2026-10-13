import {
  FaBookOpen,
  FaCar,
  FaHouse,
  FaLeaf,
  FaShirt,
  FaUser,
  FaUsers,
  FaUserShield,
} from "react-icons/fa6";
import type { Project } from "@/types/project";

/*
 * Keep this file factual. Only add `technologies`, `image`, `liveUrl` or
 * `githubUrl` once they are confirmed. Cards hide anything left empty.
 */
export const projects: Project[] = [
  {
    slug: "greenfarm",
    title: "GreenFarm E-commerce System",
    category: "Full-Stack E-commerce",
    summary:
      "A full-stack e-commerce platform covering product management, customer shopping, order processing, and delivery workflows.",
    description:
      "A full-stack e-commerce platform designed around product management, customer shopping, order processing, administrative operations, and delivery workflows. It connects a customer-facing storefront with the backend operations that keep orders moving.",
    keyAreas: [
      "Product management",
      "Customer shopping experience",
      "Order processing",
      "Administrative operations",
      "Delivery workflows",
    ],
    technologies: [],
    status: "Live",
    icon: FaLeaf,
    image: "/images/projects/greenfarm.png",
    liveUrl: "https://fruit-ecommerce-two.vercel.app/",
    featured: true,
  },
  {
    slug: "real-estate",
    title: "Real Estate Management Platform",
    category: "Full-Stack Real Estate",
    summary:
      "A property management platform with listings, agent dashboards, admin management, agent subscriptions, and enquiries.",
    description:
      "A property management platform that brings together property listings, agent dashboards, administrative management, agent subscription workflows, and property enquiries, serving agents, administrators, and people enquiring about properties.",
    keyAreas: [
      "Property listings",
      "Agent dashboards",
      "Administrative management",
      "Agent subscription workflows",
      "Property enquiries",
    ],
    technologies: [],
    status: "Live",
    icon: FaHouse,
    image: "/images/projects/real-estate.png",
    liveUrl: "https://real-estate-home-phi.vercel.app/",
    featured: true,
  },
  {
    slug: "employee-management",
    title: "Employee Management System",
    category: "Full-Stack Management System",
    summary:
      "A web-based system for organising and managing employee records and administrative workflows.",
    description:
      "A web-based system for organising and managing employee records and the administrative workflows around them, giving administrators one place to keep staff information structured and up to date.",
    keyAreas: ["Employee records", "Record organisation", "Administrative workflows"],
    technologies: [],
    status: "Completed",
    icon: FaUsers,
    image: "/images/projects/employee-management.png",
    featured: true,
  },
  {
    slug: "car-rental",
    title: "Car Rental Management System",
    category: "Full-Stack Car Rental System",
    summary:
      "A car rental platform with three distinct user roles: Admin, Customer, and Dealer, each with its own interface.",
    description:
      "A car rental platform built around three distinct user roles. Administrators oversee the platform, customers browse cars and make rental requests, and dealers list and manage their vehicles, each through a dedicated interface.",
    // The three roles below describe this project's scope.
    keyAreas: [],
    roles: [
      {
        name: "Admin",
        icon: FaUserShield,
        responsibilities: [
          "Administrative dashboard",
          "Platform and user oversight",
          "Vehicle and rental management interfaces",
        ],
      },
      {
        name: "Customer",
        icon: FaUser,
        responsibilities: [
          "Customer-facing account interface",
          "Car browsing and rental request workflows",
          "Rental information and account management",
        ],
      },
      {
        name: "Dealer",
        icon: FaCar,
        responsibilities: [
          "Dedicated dealer dashboard",
          "Vehicle listing and management interfaces",
          "Rental-related management workflows",
        ],
      },
    ],
    technologies: [],
    status: "Completed",
    icon: FaCar,
    image: "/images/projects/car-rental.png",
    featured: true,
  },
  {
    slug: "village-store",
    title: "Village Store",
    category: "Full-Stack E-commerce",
    summary:
      "A clothing e-commerce platform featuring product discovery, category browsing, shopping functionality, and management workflows.",
    description:
      "A clothing e-commerce platform featuring product discovery, category browsing, shopping functionality, and management workflows.",
    keyAreas: ["Product discovery", "Category browsing", "Shopping", "Store management"],
    technologies: [],
    status: "Completed",
    icon: FaShirt,
    featured: false,
  },
  {
    slug: "learning-management-system",
    title: "Learning Management System",
    category: "Full-Stack Education Platform",
    summary:
      "A learning management system supporting educational content, learning workflows, and administrative management.",
    description:
      "A learning management system designed to support educational content, learning workflows, and administrative management.",
    keyAreas: ["Educational content", "Learning workflows", "Administrative management"],
    technologies: [],
    status: "Completed",
    icon: FaBookOpen,
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
