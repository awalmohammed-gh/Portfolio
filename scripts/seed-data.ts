/*
 * The portfolio's original content, moved here from the hardcoded arrays in
 * src/data/* and the page components. It is only used by scripts/seed.ts to
 * populate an empty database; the live site reads from MongoDB.
 */

export const settings = {
  siteName: "Mohammed Awal",
  jobTitle: "Web Developer",
  siteDescription:
    "I build both sides of a product: responsive, user-friendly interfaces on the frontend, and the servers, APIs, and databases that power them on the backend, from business websites to subscription-based SaaS platforms.",
  seoTitle: "Mohammed Awal | Web Developer",
  seoDescription:
    "I build both sides of a product: responsive, user-friendly interfaces on the frontend, and the servers, APIs, and databases that power them on the backend, from business websites to subscription-based SaaS platforms.",
  keywords: [
    "Mohammed Awal",
    "Web Developer",
    "Full-Stack Development",
    "SaaS Developer",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
  ],
  canonicalUrl: "",
  logo: null,
  favicon: null,
  ogImage: {
    url: "/images/mohammed-awal.jpg",
    width: 1920,
    height: 2560,
    alt: "Mohammed Awal working on a laptop at his desk",
  },
  email: "awalm8043@gmail.com",
  // Ghanaian numbers: shown in local format, dialled with the +233 country code.
  phones: [
    { display: "053 863 2229", number: "+233538632229" },
    { display: "020 125 9784", number: "+233201259784" },
  ],
  location: "",
  socialLinks: [],
  contactFormEnabled: true,
};

const profileImage = {
  url: "/images/mohammed-awal.jpg",
  width: 1920,
  height: 2560,
  alt: "Mohammed Awal working on a laptop at his desk",
};

export const projects = [
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
    roles: [],
    technologies: [],
    status: "Live",
    icon: "FaLeaf",
    tint: "emerald",
    coverImage: { url: "/images/projects/greenfarm.png", alt: "Screenshot of GreenFarm E-commerce System" },
    liveUrl: "https://fruit-ecommerce-two.vercel.app/",
    githubUrl: "",
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
    roles: [],
    technologies: [],
    status: "Live",
    icon: "FaHouse",
    tint: "violet",
    coverImage: { url: "/images/projects/real-estate.png", alt: "Screenshot of Real Estate Management Platform" },
    liveUrl: "https://real-estate-home-phi.vercel.app/",
    githubUrl: "",
    featured: true,
  },
  {
    slug: "employee-management",
    title: "Employee Management System",
    category: "Full-Stack Management System",
    summary: "A web-based system for organising and managing employee records and administrative workflows.",
    description:
      "A web-based system for organising and managing employee records and the administrative workflows around them, giving administrators one place to keep staff information structured and up to date.",
    keyAreas: ["Employee records", "Record organisation", "Administrative workflows"],
    roles: [],
    technologies: [],
    status: "Completed",
    icon: "FaUsers",
    tint: "blue",
    coverImage: {
      url: "/images/projects/employee-management.png",
      alt: "Screenshot of Employee Management System",
    },
    liveUrl: "",
    githubUrl: "",
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
        icon: "FaUserShield",
        responsibilities: [
          "Administrative dashboard",
          "Platform and user oversight",
          "Vehicle and rental management interfaces",
        ],
      },
      {
        name: "Customer",
        icon: "FaUser",
        responsibilities: [
          "Customer-facing account interface",
          "Car browsing and rental request workflows",
          "Rental information and account management",
        ],
      },
      {
        name: "Dealer",
        icon: "FaCar",
        responsibilities: [
          "Dedicated dealer dashboard",
          "Vehicle listing and management interfaces",
          "Rental-related management workflows",
        ],
      },
    ],
    technologies: [],
    status: "Completed",
    icon: "FaCar",
    tint: "amber",
    coverImage: { url: "/images/projects/car-rental.png", alt: "Screenshot of Car Rental Management System" },
    liveUrl: "",
    githubUrl: "",
    featured: true,
  },
  {
    slug: "village-store",
    title: "Village Store",
    category: "Full-Stack E-commerce & CMS",
    summary:
      "A clothing e-commerce platform with a customer storefront and an admin side that works as a content management system, controlling every section of the store.",
    description:
      "A clothing e-commerce platform with two sides. Customers discover products, browse categories, and shop. The admin side is built as a content management system: the admin controls every section of the store and can update the interface without touching the codebase.",
    keyAreas: [
      "Product discovery",
      "Category browsing",
      "Shopping",
      "Content management system (CMS)",
      "Interface updates without code changes",
    ],
    roles: [
      {
        name: "Customer",
        icon: "FaUser",
        responsibilities: [
          "Customer-facing storefront",
          "Product discovery and category browsing",
          "Shopping functionality",
        ],
      },
      {
        name: "Admin",
        icon: "FaUserShield",
        responsibilities: [
          "Full control over every section of the store",
          "Content management system for updating the storefront",
          "Changes the interface without touching the codebase",
        ],
      },
    ],
    technologies: [],
    status: "Completed",
    icon: "FaShirt",
    tint: "rose",
    coverImage: null,
    liveUrl: "",
    githubUrl: "",
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
    roles: [],
    technologies: [],
    status: "Completed",
    icon: "FaBookOpen",
    tint: "cyan",
    coverImage: null,
    liveUrl: "",
    githubUrl: "",
    featured: false,
  },
];

export const skillGroups = [
  {
    title: "Frontend Development",
    description: "Responsive, accessible interfaces that feel fast and intuitive.",
    icon: "FaLaptopCode",
    skills: [
      { name: "HTML5", icon: "SiHtml5" },
      { name: "CSS3", icon: "SiCss" },
      { name: "JavaScript", icon: "SiJavascript" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "React.js", icon: "SiReact" },
      { name: "Next.js", icon: "SiNextdotjs" },
      { name: "Tailwind CSS", icon: "SiTailwindcss" },
    ],
  },
  {
    title: "Backend Development",
    description: "Server-side logic, APIs, and secure access control.",
    icon: "FaServer",
    skills: [
      { name: "Node.js", icon: "SiNodedotjs" },
      { name: "Express.js", icon: "SiExpress" },
      { name: "REST APIs", icon: "TbApi" },
      { name: "Authentication & Authorization", icon: "TbShieldLock" },
    ],
  },
  {
    title: "Database",
    description: "Structured data models that keep applications reliable.",
    icon: "FaDatabase",
    skills: [
      { name: "MongoDB", icon: "SiMongodb" },
      { name: "Mongoose", icon: "SiMongoose" },
    ],
  },
  {
    title: "Development Tools",
    description: "Version control, editing, and deployment workflow.",
    icon: "FaToolbox",
    skills: [
      { name: "Git", icon: "SiGit" },
      { name: "GitHub", icon: "SiGithub" },
      { name: "VS Code", icon: "VscVscode" },
      { name: "Vercel", icon: "SiVercel" },
    ],
  },
];

export const services = [
  {
    title: "Website Development",
    description:
      "Fast, responsive websites for businesses and individuals, built with modern frontend technologies and clean, maintainable code.",
    icon: "FaGlobe",
    includes: ["Responsive layouts", "Business & personal websites", "SEO-friendly structure"],
  },
  {
    title: "SaaS & Full-Stack Web Applications",
    description:
      "Subscription-based SaaS products and complete web applications, from the user interface to the server, API, and database behind them.",
    icon: "FaCloud",
    includes: ["SaaS products & subscription workflows", "Node.js & Express.js APIs", "MongoDB data modelling"],
  },
  {
    title: "E-commerce System Development",
    description:
      "Online stores with product catalogues, shopping flows, order handling, and the admin tools to run them.",
    icon: "FaCartShopping",
    includes: ["Product & category management", "Shopping & order workflows", "Store admin tools"],
  },
  {
    title: "Custom Management Systems",
    description:
      "Tailored systems for managing records, people, inventory, or bookings, shaped around how your organisation works.",
    icon: "FaListCheck",
    includes: ["Record management", "Role-based access", "Workflow automation"],
  },
  {
    title: "Dashboard & Admin Panel Development",
    description: "Clear, data-driven dashboards and admin panels that make managing your platform straightforward.",
    icon: "FaGaugeHigh",
    includes: ["Admin dashboards", "User & content management", "Role-specific views"],
  },
  {
    title: "Website Redesign & Optimisation",
    description:
      "Modernising existing websites with improved design, responsiveness, performance, and usability.",
    icon: "FaWandMagicSparkles",
    includes: ["UI refresh", "Mobile responsiveness", "Performance improvements"],
  },
];

// Ordered most recent first.
export const education = [
  {
    level: "University",
    icon: "LuGraduationCap",
    institution: "Accra Institute of Technology",
    institutionShort: "AIT",
    qualification: {
      title: "Bachelor of Information Technology",
      shortTitle: "BIT",
      status: "graduation-pending",
      statusLabel: "Coursework completed · Awaiting graduation",
    },
    completionYear: null,
    note: "All programme coursework has been completed. The degree will be conferred at graduation.",
  },
  {
    level: "Senior High School",
    icon: "LuSchool",
    institution: "Otumfuo Osei Tutu II",
    institutionShort: "",
    qualification: {
      title: "West African Senior School Certificate Examination",
      shortTitle: "WASSCE",
      status: "completed",
      statusLabel: "Completed 2017",
    },
    completionYear: 2017,
    note: "",
  },
];

/** Page copy that was hardcoded in components. */
export const content = {
  hero: {
    badge: "Web Developer",
    heading: { lead: "Building Digital Experiences From", highlight: "Frontend to Backend." },
    intro:
      "Hello, I'm Mohammed Awal, a Web Developer who builds SaaS products, powerful web applications, and complete full-stack systems.",
    description:
      "I build both sides of a product: responsive, user-friendly interfaces on the frontend, and the servers, APIs, and databases that power them on the backend, from business websites to subscription-based SaaS platforms.",
    primaryCta: { label: "View Projects", href: "/projects" },
    secondaryCta: { label: "Contact Me", href: "/contact" },
    image: profileImage,
    coreStackTitle: "Core stack",
    coreStack: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "REST APIs"],
    projectsCardLabel: "Portfolio",
    projectsCardCaption: "Full-stack projects",
  },

  home: {
    featuredProjects: {
      eyebrow: "Selected work",
      title: "Full-stack projects",
      description: "Systems that combine frontend interfaces, backend functionality, and data management.",
      buttonLabel: "All {count} projects",
    },
    servicesPreview: {
      eyebrow: "Services",
      title: "How I can help",
      description: "From a single website to a complete web application with its own backend and database.",
      buttonLabel: "Explore services",
    },
  },

  about: {
    seo: {
      title: "About",
      description:
        "About Mohammed Awal, a Web Developer who builds SaaS products and full-stack systems: background, skills, education and qualifications.",
    },
    header: {
      eyebrow: "About me",
      title: { lead: "Web Developer building", highlight: "SaaS & full-stack systems." },
      description:
        "I design and build web applications and SaaS products end to end, covering the user interface, the backend services, and the database.",
    },
    photo: profileImage,
    photoCaption: "At work",
    eyebrow: "Who I am",
    title: { lead: "I build complete software,", highlight: "from interface to database." },
    paragraphs: [
      "I’m Mohammed Awal, a Web Developer. I build SaaS products and full-stack systems, taking an idea beyond the screen: the interface people interact with, the backend logic behind each action, and the database that holds it all together.",
      "I’ve completed my coursework for a Bachelor of Information Technology at Accra Institute of Technology, with graduation pending. Alongside that foundation, I’ve built e-commerce platforms, a real estate management platform, an employee management system, a car rental system with role-based dashboards, and a learning management system.",
      "On the frontend I work with React, Next.js, TypeScript and Tailwind CSS. On the backend I use Node.js, Express.js and MongoDB to build REST APIs, authentication and data-driven features. My focus is simple: clear interfaces, maintainable code, and software that solves real problems.",
    ],
    facts: [
      { icon: "LuLaptop", label: "Focus", value: "Full-stack web development" },
      { icon: "LuGraduationCap", label: "Education", value: "BIT, Accra Institute of Technology" },
      { icon: "LuLayers", label: "Portfolio", value: "{count} full-stack projects" },
    ],
    primaryCta: { label: "View my projects", href: "/projects" },
    secondaryCta: { label: "Get in touch", href: "/contact" },
    resumeUrl: "",
    resumeLabel: "Download résumé",
  },

  skills: {
    eyebrow: "Skills",
    title: "Technologies I work with",
    description: "Grouped across the full stack, from the browser to the server and the database.",
  },

  fullStack: {
    eyebrow: "What I build",
    title: "Complete systems, from the interface to the database",
    description:
      "Every project can cover the full stack: what users see, the server behind it, and the data underneath.",
    layers: [
      {
        category: "Frontend Development",
        label: "Frontend",
        heading: "Interfaces people enjoy using",
        text: "Responsive, accessible user interfaces that make browsing, buying, and managing feel straightforward.",
      },
      {
        category: "Backend Development",
        label: "Backend",
        heading: "Logic that powers the product",
        text: "Server-side applications, REST APIs, and authentication that connect every action to what happens next.",
      },
      {
        category: "Database",
        label: "Database",
        heading: "Data that stays organised",
        text: "Structured data models for the products, people, and records an application depends on.",
      },
    ],
  },

  education: {
    eyebrow: "Education",
    title: "Education & Qualifications",
    description: "My academic background in information technology, from senior high school to university.",
    qualificationsTitle: "Qualifications",
    qualificationsNote: "The Bachelor of Information Technology will be formally conferred upon graduation.",
  },

  experience: {
    eyebrow: "Experience",
    title: "Work experience",
    description: "Roles where I’ve designed, built, and shipped software.",
  },

  projects: {
    seo: {
      title: "Projects",
      description:
        "Full-stack projects by Mohammed Awal: e-commerce, real estate, employee management, car rental, and learning management systems.",
    },
    header: {
      eyebrow: "Projects",
      title: { lead: "Full-stack software,", highlight: "built end to end." },
      description:
        "{count} complete systems that bring together frontend interfaces, backend functionality, data management, and real business workflows.",
    },
    cta: {
      title: "Want something similar built?",
      description: "I can build systems like these for your business, from the interface to the backend and database.",
    },
  },

  services: {
    seo: {
      title: "Services",
      description:
        "Website development, SaaS products, full-stack web applications, e-commerce systems, custom management systems, dashboards, and website redesign.",
    },
    header: {
      eyebrow: "Services",
      title: { lead: "Frontend interfaces", highlight: "and the backend behind them." },
      description:
        "I build both what your users see and the systems that power it, from business websites to SaaS products, so everything works as one complete product.",
    },
    process: {
      eyebrow: "How we’ll work",
      title: "A practical approach",
      description: "First understand, then build. Each project moves through three simple stages.",
      steps: [
        {
          title: "Understand the problem",
          text: "We discuss your users, your goals, and the workflows the product needs to support.",
        },
        {
          title: "Build the full system",
          text: "I bring the interface, application logic, and data model together around those needs.",
        },
        {
          title: "Refine the experience",
          text: "We review the result, work through feedback, and check the details across screen sizes.",
        },
      ],
    },
    cta: { title: "Let’s build your project", description: "" },
  },

  contact: {
    seo: {
      title: "Contact",
      description: "Get in touch with Mohammed Awal about websites, web applications, and full-stack projects.",
    },
    header: {
      eyebrow: "Contact",
      title: { lead: "Let’s build", highlight: "something together." },
      description:
        "Tell me about your website, SaaS product, web application, or system idea, and I’ll get back to you.",
    },
    note: {
      title: "No finished brief needed",
      text: "A problem to solve or an idea to explore is a good place to start. Websites, SaaS products, web applications, e-commerce, management systems, dashboards, and redesigns.",
    },
    form: {
      title: "Send a message",
      description: "Tell me about your project. I’ll reply by email.",
      submitLabel: "Send message",
      hint: "Submitting opens your email app with this message pre-filled, so you can review it before sending.",
      successMessage:
        "Your email app should now be open with the message ready to send. If it didn’t open, email {email} directly.",
    },
  },

  cta: {
    title: "Have a project in mind? Let’s build it together.",
    description:
      "Whether you need a website, a SaaS product, a full-stack web application, or a custom management system, I’d love to hear what you’re planning.",
    primaryLabel: "Start a conversation",
    secondaryLabel: "Email me",
  },

  footer: {
    tagline:
      "Web Developer. Building SaaS products and complete full-stack systems, from user interfaces to backend services and databases.",
  },
};
