export interface Project {
  id: string;
  number: string;
  client: string;
  shortDesc: string;
  tags: string[];
  year: number;
  duration: string;
  role: string;
  outcome: string;
  heroImage: string;
  slug: string;
  overview: string;
  problem: string;
  solution: string;
  result: string;
  techStack: string[];
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: "vt-dashboard-os",
    number: "01",
    client: "VT Dashboard OS",
    shortDesc: "Internal Command Centre & Real-time Telemetry System",
    tags: ["Next.js", "WebAudio", "Tailwind CSS"],
    year: 2026,
    duration: "6 weeks",
    role: "Full-Stack Development & Design",
    outcome: "Sub-50ms Telemetry Load",
    heroImage: "/aether_os.png",
    slug: "vt-dashboard-os",
    overview: "We built an internal operations command centre to monitor all our active serverless deployments, agentic pipelines, and system telemetry in real time.",
    problem: "Managing multiple decoupled serverless services, log outputs, and deployment status updates in separate dashboards was causing operational friction and slow response times.",
    solution: "We engineered a unified WebGL and React-based real-time dashboard that aggregates cloud logs, agent performance, and serverless health into a single high-performance cockpit.",
    result: "Reduced system monitoring overhead by 40% and improved response time to pipeline exceptions with sub-50ms live telemetry updates.",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Node.js", "WebSockets"],
    liveUrl: "https://www.varunyatechnologies.com"
  },
  {
    id: "solenne-jewelry",
    number: "02",
    client: "Solenne Jewelry",
    shortDesc: "3D Product Configurator & Immersive Spatial Web Showcase",
    tags: ["WebGL", "Three.js", "React Three Fiber"],
    year: 2025,
    duration: "10 weeks",
    role: "WebGL Engineering & Creative Direction",
    outcome: "+312% User Engagement",
    heroImage: "/solas_spatial.png",
    slug: "solenne-jewelry",
    overview: "A high-concept luxury jewelry brand required a digital experience that could replicate the tactile elegance of their bespoke, physical pieces in the web browser.",
    problem: "Standard 2D product photos failed to convey the premium craftsmanship, material reflections, and detailed geometry of high-end custom jewelry.",
    solution: "We designed a hardware-accelerated 3D product configurator using custom WebGL shaders and React Three Fiber, allowing users to customize and view jewelry in real-time with realistic ray-traced reflections.",
    result: "Achieved a 312% increase in average time spent on the product page and a 34% lift in custom design inquiries.",
    techStack: ["Three.js", "React Three Fiber", "GLSL Shaders", "Next.js", "Tailwind CSS"],
    liveUrl: "https://www.varunyatechnologies.com"
  },
  {
    id: "axiom-vc",
    number: "03",
    client: "Axiom VC",
    shortDesc: "AI Deal Flow Dashboard & Agentic Research Pipeline",
    tags: ["AI Pipeline", "Vector DB", "PostgreSQL"],
    year: 2026,
    duration: "8 weeks",
    role: "AI Pipeline Engineering",
    outcome: "92% Fast-Track Screening",
    heroImage: "/lumen_network.png",
    slug: "axiom-vc",
    overview: "An early-stage venture capital firm needed to automate the initial stages of pitch-deck screening, market mapping, and competitive intelligence gathering.",
    problem: "The investment team spent over 30 hours weekly manually reviewing pitch decks, resulting in slower response times to high-quality startups.",
    solution: "We engineered an autonomous research pipeline using LLM agents and pgvector semantic indexing to automatically parse, classify, and perform initial research on incoming pitch decks.",
    result: "Automated 92% of initial deal-flow screenings, reducing the screening lifecycle from 5 days to under 15 minutes per pitch.",
    techStack: ["Node.js", "Python", "LangChain", "PostgreSQL", "pgvector", "Next.js"],
    liveUrl: "https://www.varunyatechnologies.com"
  },
  {
    id: "trivoxa-group",
    number: "04",
    client: "Trivoxa Group",
    shortDesc: "Multi-Sector Corporate Portal & Enterprise Management Ecosystem",
    tags: ["Next.js 16", "TypeScript", "PostgreSQL", "Docker"],
    year: 2026,
    duration: "12 weeks",
    role: "Enterprise Architecture & Full-Stack Development",
    outcome: "+180% Cross-Division Sync",
    heroImage: "/aether_os.png",
    slug: "trivoxa-group",
    overview: "A multi-sector corporate portal and enterprise management ecosystem powering Trivoxa Group's diversified global business operations.",
    problem: "Managing multiple business verticals, multi-subsidiary compliance, and global supply chain logistics across separate legacy systems created operational siloing.",
    solution: "We engineered a unified Next.js 16 corporate gateway with role-based access control, real-time telemetry pipelines, and integrated subsidiary reporting.",
    result: "Achieved sub-50ms telemetry load times, +180% cross-division synchronization efficiency, and 99.99% enterprise uptime.",
    techStack: ["Next.js 16", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Docker"],
    liveUrl: "https://www.trivoxagroup.com"
  },
  {
    id: "nuvent",
    number: "05",
    client: "Nuvent",
    shortDesc: "Agentic Event Management & Live Ticketing Suite",
    tags: ["Next.js 16", "WebSockets", "Redis", "Stripe"],
    year: 2026,
    duration: "10 weeks",
    role: "Full-Stack Development & Real-Time Engineering",
    outcome: "<18ms QR Check-In Latency",
    heroImage: "/solas_spatial.png",
    slug: "nuvent",
    overview: "An all-in-one event management software platform engineering real-time ticketing, attendee analytics, and automated spatial venue scheduling.",
    problem: "Event organizers faced high latency during peak ticket sales and slow entrance check-in bottlenecks during large-scale conferences and expos.",
    solution: "We built an offline-first QR check-in engine with Redis-backed ticket queues, live WebSocket attendee telemetry, and dynamic spatial venue floorplan mapping.",
    result: "Reduced entrance check-in latency to under 18ms and handled over 50,000 concurrent ticket checkouts without downtime.",
    techStack: ["Next.js 16", "WebSockets", "Redis", "PostgreSQL", "Tailwind CSS", "Stripe API"],
    liveUrl: "https://www.nuvent.app"
  }
];
