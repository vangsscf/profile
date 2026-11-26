export const profile = {
  name: "Vagner Caldeira",
  linkedIn: "https://www.linkedin.com/in/vagner-caldeira/",
  email: "vagnerdesouza11@hotmail.com",
  resume: "/vagner-caldeira-resume.pdf",
};

export const skills = ["TypeScript", "Node.js", "React", "PostgreSQL", "RabbitMQ", "Redis", "Docker", "Kubernetes", "AWS"];

type Experience = {
  company: string;
  title: string;
  period: string;
  summary: string;
  result?: string;
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: "Alias Tecnologia",
    title: "Senior Full-Stack Software Engineer",
    period: "Jul 2025 – Oct 2026",
    summary:
      "Built vehicle debt notification workflows that connected financial institutions with Brazilian vehicle agencies. Delivered live status updates with Server-Sent Events and used OpenAI APIs to automate classification and text generation.",
    stack: ["TypeScript", "SOAP & REST", "SSE", "OpenAI APIs"],
  },
  {
    company: "Neoconsig",
    title: "Senior Full-Stack Software Engineer",
    period: "Jun 2024 – Jul 2025",
    summary:
      "Built a rewards redemption platform integrated with a payroll-loan product. Introduced Docker-based infrastructure, integrated facial biometrics for registration and login, and simplified the relational database schema.",
    stack: ["Node.js", "React", "Docker", "SQL"],
  },
  {
    company: "BitcoinToYou",
    title: "Founding Software Engineer",
    period: "Dec 2018 – Jun 2024",
    summary:
      "Scaled a cryptocurrency exchange with Kubernetes and Docker. Designed multi-instance order processing with RabbitMQ, built live order books and dashboards, and integrated banking APIs for deposits and payments. Added role-based access and two-factor authentication.",
    result: "Reduced response times by approximately 40% in targeted operations using Redis caching.",
    stack: ["Node.js", "RabbitMQ", "Kubernetes", "Redis", "WebSockets"],
  },
  {
    company: "VSC Desenvolvimento",
    title: "Full-Stack Software Engineer",
    period: "Jan 2018 – Nov 2019",
    summary:
      "Built a mobile event ticketing app, developed ERP interfaces, and added reservation and announcement features to a condominium management system.",
    stack: ["Node.js", "React Native", "Vue.js"],
  },
  {
    company: "Wiser Place",
    title: "Full-Stack Software Engineer",
    period: "Mar 2016 – Jan 2018",
    summary: "Developed mobile applications with Ionic, integrating them with Java backend APIs.",
    stack: ["Ionic", "Java"],
  },
];

type Project = {
  title: string;
  category: string;
  description: string;
  icon: "layers" | "card" | "pulse";
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Exchange order processing",
    category: "BitcoinToYou",
    description: "Scaling order processing across instances and delivering real-time trading updates.",
    icon: "layers",
  },
  {
    title: "Payroll lending and rewards",
    category: "Neoconsig",
    description: "Connecting rewards redemption with a payroll-loan platform and improving identity verification.",
    icon: "card",
  },
  {
    title: "Real-time debt notifications",
    category: "Alias Tecnologia",
    description: "Passing status updates from public vehicle agencies to financial institutions as they happen.",
    icon: "pulse",
  },
];
