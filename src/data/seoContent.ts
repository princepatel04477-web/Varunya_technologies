export interface ServicePageData {
  slug: string;
  serviceKey: string;
  serviceName: string;
  cityName: string | null;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  introText: string;
  features: { title: string; desc: string }[];
  techStack: string[];
  faqs: { q: string; a: string }[];
  localAddress?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
    latitude: number;
    longitude: number;
  };
  localHubs?: string[];
}

const servicesConfig: Record<string, {
  name: string;
  headline: string;
  intro: string;
  features: { title: string; desc: string }[];
  techStack: string[];
  genericFaqs: { q: string; a: string }[];
}> = {
  "web": {
    name: "Web Development",
    headline: "Web Development Company",
    intro: "We design and engineer bespoke web experiences that combine premium editorial art direction with high-performance frontend and backend codebases.",
    techStack: ["Next.js", "React", "TypeScript", "WebGL", "Three.js", "GSAP", "TailwindCSS", "Node.js", "Vercel"],
    features: [
      { title: "Next.js Architecture", desc: "Server-side rendering, instant page hydration, and maximum search engine crawlability." },
      { title: "WebGL & 3D Visuals", desc: "Interactive spatial product displays and creative layouts built directly in the browser." },
      { title: "Core Web Vitals Focus", desc: "Pre-rendering, sub-second latency budgets, and mobile accessibility optimizations." },
      { title: "Scalable Headless CMS", desc: "Content management solutions designed to run quickly without dragging performance down." }
    ],
    genericFaqs: [
      { q: "Why choose a custom web development company?", a: "Custom web development ensures your site is designed for your specific brand identity and business outcomes, without the templates, slow loading speeds, or security holes of basic builders." },
      { q: "How much does custom website development cost?", a: "Costs are calculated based on complexity, from clean corporate marketing sites to custom WebGL 3D galleries, software dashboards, or enterprise systems." },
      { q: "How long does it take to build a website?", a: "Standard production sites take 2-4 weeks, while custom WebGL animations, portals, or advanced web integrations range between 1-3 months." }
    ]
  },
  "mobile": {
    name: "Mobile App Development",
    headline: "Mobile App Development Company",
    intro: "We engineer high-performance native and cross-platform mobile app environments built for speed, offline synchronization, and rich animations.",
    techStack: ["React Native", "Flutter", "TypeScript", "Dart", "Swift", "Kotlin", "Firebase", "GraphQL", "App Store Connect"],
    features: [
      { title: "Native iOS & Android", desc: "Tailored Swift and Kotlin structures built to leverage native device features." },
      { title: "Cross-Platform Efficiency", desc: "React Native and Flutter pipelines delivering single-codebase velocity with native quality." },
      { title: "Offline Sync Architectures", desc: "Robust local databases that automatically synchronize once internet connectivity restores." },
      { title: "API Gateway Connections", desc: "High-throughput APIs connecting mobile applications to core secure backend software." }
    ],
    genericFaqs: [
      { q: "Do you develop for both iOS and Android?", a: "Yes, we build native applications in Swift and Kotlin, and cross-platform mobile apps using Flutter and React Native that operate perfectly across both ecosystems." },
      { q: "How do you handle mobile app store submissions?", a: "We handle the complete release workflow, from TestFlight beta builds, App Store and Google Play submissions, to ongoing maintenance updates." },
      { q: "Can the app sync data when offline?", a: "Yes, we architect local storage sync layers that queue user operations offline and sync securely once a connection is established." }
    ]
  },
  "uiux": {
    name: "UI/UX Design",
    headline: "UI/UX Design Studio",
    intro: "We construct editorial digital interfaces and conversion-led layouts based on user psychology and modern web design guidelines.",
    techStack: ["Figma", "Adobe Creative Cloud", "Cinema 4D", "Spline 3D", "Framer Motion", "Typography Design", "Interaction Systems"],
    features: [
      { title: "Psychology-Led UX", desc: "User flows and wireframes designed to reduce friction, keep visitors engaged, and guide actions." },
      { title: "Editorial UI Systems", desc: "Clean visual hierarchies, custom layout rules, and premium typography settings." },
      { title: "Interactive Mockups", desc: "High-fidelity prototypes that map transitions and animations precisely before coding." },
      { title: "Component Libraries", desc: "Custom structured design systems built in Figma to streamline coding and future expansion." }
    ],
    genericFaqs: [
      { q: "What is your UI/UX design methodology?", a: "We study user behaviors, define information hierarchies, build interactive layouts, and test flows to ensure the design is conversion-driven." },
      { q: "Do you design from existing templates?", a: "No, every design is crafted from scratch to match the brand parameters, ensuring premium and unique digital assets." },
      { q: "How do you handle developer handoffs?", a: "We provide complete design tokens, structured component styles, and precise animation specifications in Figma." }
    ]
  },
  "software": {
    name: "Software Development",
    headline: "Software Development Company",
    intro: "We design and develop custom software architectures, REST/gRPC API structures, and secure cloud databases engineered for enterprise growth.",
    techStack: ["Node.js", "TypeScript", "Python", "Go", "PostgreSQL", "MongoDB", "AWS", "Docker", "gRPC", "Kubernetes"],
    features: [
      { title: "Custom Codebases", desc: "Lean backend engines built in Go, Node.js, or Python to process operations without lag." },
      { title: "High-Throughput APIs", desc: "Secure RESTful and gRPC API layers designed to transfer data reliably under load." },
      { title: "Cloud Systems & CI/CD", desc: "Containerized deployments via Docker and Kubernetes with automated integration steps." },
      { title: "Database Architecture", desc: "Optimized PostgreSQL and MongoDB databases structured for query speed and data safety." }
    ],
    genericFaqs: [
      { q: "What technologies do you use for backend software?", a: "We write backends in Node.js, Go, or Python, backed by PostgreSQL, MongoDB, or Redis, depending on the performance requirements." },
      { q: "How do you secure custom software integrations?", a: "We deploy standard encryption protocols, secure API keys, OAuth access layers, and host code on AWS/GCP servers." },
      { q: "Do you provide legacy software migration?", a: "Yes, we audit old systems, draft transition blueprints, and transfer data securely with minimal system downtime." }
    ]
  },
  "ai": {
    name: "AI Development",
    headline: "AI Development Company",
    intro: "We construct custom AI agent networks, cognitive data pipelines, and large language model integrations that automate workflows.",
    techStack: ["OpenAI API", "Anthropic Claude", "Gemini API", "LangChain", "LlamaIndex", "PgVector", "Python", "FastAPI", "Hugging Face"],
    features: [
      { title: "Autonomous AI Agents", desc: "Cognitive workflows capable of reasoning, handling customer queues, and executing tasks." },
      { title: "LLM Pipeline Integration", desc: "Secure pipelines connecting models to your databases to automate analysis and indexing." },
      { title: "Semantic Vector Search", desc: "Database query upgrades using PgVector embeddings for natural language search." },
      { title: "AI Search Optimization", desc: "Data structures designed to ensure your site is recognized correctly by AI search engines." }
    ],
    genericFaqs: [
      { q: "How can my business integrate AI solutions?", a: "We identify manual data tasks, customer support queues, or search bottlenecks, then integrate custom AI pipelines and models." },
      { q: "Are my business databases safe during LLM training?", a: "Yes, we secure data connections using isolated APIs. We do not use proprietary data to train public models." },
      { q: "What are autonomous AI agents?", a: "AI agents are loops capable of completing multi-step tasks (like research or drafting) using custom tool libraries." }
    ]
  },
  "ecommerce": {
    name: "E-Commerce Development",
    headline: "E-Commerce Development Company",
    intro: "We construct premium online storefronts and bespoke commerce integrations designed to elevate customer retention and average order values.",
    techStack: ["Next.js Commerce", "Shopify API", "GraphQL", "Stripe", "PostgreSQL", "Node.js", "Tailwind CSS", "Vercel"],
    features: [
      { title: "Instant Page Speeds", desc: "Storefronts optimized for sub-second load times to directly reduce shopping cart drop-off." },
      { title: "Bespoke Checkouts", desc: "Integrated payment gateways, smooth animations, and optimized checkout pages." },
      { title: "Inventory Sync Pipelines", desc: "Databases that sync stock levels across sales channels in real time." },
      { title: "Programmatic Landing Pages", desc: "Store pages that dynamically load localized deals and catalog selections." }
    ],
    genericFaqs: [
      { q: "Which e-commerce platforms do you support?", a: "We develop headless storefronts using Next.js linked to Shopify APIs, and custom database-driven shopping cart platforms." },
      { q: "Can you link storefronts to payment gateways in India?", a: "Yes, we integrate secure payment gateways including Razorpay, PayU, and international portals like Stripe." },
      { q: "How do you optimize online store search engine ranking?", a: "We build static product pages, add Schema markups, optimize loading speeds, and write clean URLs." }
    ]
  },
  "marketing": {
    name: "Digital Marketing",
    headline: "Digital Marketing Agency",
    intro: "We design and execute data-backed conversion campaigns and performance marketing strategies that scale brands.",
    techStack: ["Google Ads", "Meta Business Suite", "Google Analytics 4", "Conversion Optimization", "Landing Page Funnels"],
    features: [
      { title: "Metric-Driven Ad Campaigns", desc: "Paid search and social campaigns optimized for low customer acquisition costs." },
      { title: "High-Fidelity Funnels", desc: "Visual landing pages designed to convert high-intent ad traffic into customers." },
      { title: "Analytics tracking", desc: "Accurate tracking setups that monitor conversion signals across user interactions." },
      { title: "Conversion Rate Audit (CRO)", desc: "Continuous testing of headings, colors, and button placements to maximize click-throughs." }
    ],
    genericFaqs: [
      { q: "How do you calculate digital marketing ROI?", a: "We configure tracking pixels to map conversion steps, calculating ad spend return against actual lead actions." },
      { q: "Do you build the landing pages for campaigns?", a: "Yes, we build optimized, fast-loading landing pages designed to keep CPC bounces low." },
      { q: "How long does it take to see results from paid ads?", a: "Paid campaigns show traffic immediately, and we optimize click metrics over the initial 2-4 weeks." }
    ]
  },
  "seo": {
    name: "SEO Services",
    headline: "SEO Company",
    intro: "We build technical search engine optimization architectures and topical authority models that scale organic visibility.",
    techStack: ["Technical SEO", "Google Search Console", "Schema Markup", "Topical Mapping", "Sitemap Generation", "Web Vitals Optimization"],
    features: [
      { title: "Technical Site Audits", desc: "Correcting crawl errors, indexing redirects, and site architecture roadblocks." },
      { title: "Topical Mapping", desc: "Content clusters designed to answer niche user queries and prove database authority." },
      { title: "Rich Schema Markups", desc: "Structured data (FAQ, LocalBusiness, Product) designed for rich search features." },
      { title: "Web Vitals Optimization", desc: "Slashing page size, optimizing assets, and accelerating server response times." }
    ],
    genericFaqs: [
      { q: "What is the difference between technical and on-page SEO?", a: "Technical SEO optimizes site indexing and speeds, while on-page SEO targets content keywords and heading structures." },
      { q: "How long does it take to rank on Google?", a: "Technical fixes can show results in weeks, while competitive topical ranking builds over 3-6 months." },
      { q: "Do you optimize sites for AI search engines?", a: "Yes, we structure content so AI models (ChatGPT, Perplexity) easily extract answers and list citations." }
    ]
  },
  "custom-software": {
    name: "Custom Software Development",
    headline: "Custom Software Development Company",
    intro: "We engineer proprietary digital systems and web portals that automate manual business processes and securely sync data.",
    techStack: ["TypeScript", "Go", "Python", "AWS", "PostgreSQL", "Docker", "REST API", "gRPC", "React Dashboard"],
    features: [
      { title: "Tailored Business Portals", desc: "Private dashboard portals designed for user access, reporting, and admin tasks." },
      { title: "System Automation Engine", desc: "Custom scripts and workflows that automate manual office procedures and notifications." },
      { title: "Secure Data Warehouses", desc: "Normalized database structures with strict access limits and safety backups." },
      { title: "Microservices Architectures", desc: "Software modules that operate independently to prevent complete system drops." }
    ],
    genericFaqs: [
      { q: "Why build custom software over SaaS alternatives?", a: "Custom software eliminates monthly subscription costs, is built for your exact workflow, and ensures you own your databases." },
      { q: "Can custom software integrate with existing tools?", a: "Yes, we construct custom API pipelines linking your databases to existing ERP, CRM, or accounting systems." },
      { q: "How do you handle future software support?", a: "We write clean documentation, structure clean code repositories, and offer flexible support agreements." }
    ]
  }
};

const citiesConfig: Record<string, {
  name: string;
  region: string;
  street: string;
  zip: string;
  lat: number;
  lng: number;
  hubs: string[];
}> = {
  "surat": {
    name: "Surat", region: "Gujarat", street: "Rajhans Olimpia, Adajan-Hazira Road, Adajan", zip: "395009",
    lat: 21.1960, lng: 72.7933,
    hubs: ["Adajan", "Vesu", "Pal", "Palanpur", "Katargam", "Varachha", "Mota Varachha", "Bhatar", "Althan", "Piplod", "Athwa", "Udhna", "Rander", "Dindoli", "Amroli", "Sarthana"]
  },
  "ahmedabad": {
    name: "Ahmedabad", region: "Gujarat", street: "Mondeal Heights, S.G. Highway, Prahladnagar", zip: "380015",
    lat: 23.0225, lng: 72.5714,
    hubs: ["S.G. Highway", "Prahladnagar", "Satellite", "Bodakdev", "Vastrapur", "C.G. Road", "Ashram Road", "Gota", "Nikol"]
  },
  "vadodara": {
    name: "Vadodara", region: "Gujarat", street: "Race Course Road, Alkapuri", zip: "390007",
    lat: 22.3072, lng: 73.1812,
    hubs: ["Alkapuri", "Akota", "Gotri", "Vasna Road", "Fatehgunj", "Sayajigunj"]
  },
  "rajkot": {
    name: "Rajkot", region: "Gujarat", street: "Imperial Heights, Kalawad Road", zip: "360005",
    lat: 22.3039, lng: 70.8022,
    hubs: ["Yagnik Road", "Kalawad Road", "Race Course Road", "Amin Marg", "Kuvadva"]
  },
  "mumbai": {
    name: "Mumbai", region: "Maharashtra", street: "Maker Chambers, Nariman Point", zip: "400021",
    lat: 18.9220, lng: 72.8273,
    hubs: ["Bandra Kurla Complex (BKC)", "Andheri East", "Lower Parel", "Powai", "Nariman Point", "Worli", "Thane", "Navi Mumbai"]
  },
  "bangalore": {
    name: "Bangalore", region: "Karnataka", street: "Prestige Trade Tower, Palace Road", zip: "560001",
    lat: 12.9716, lng: 77.5946,
    hubs: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Electronic City", "Jayanagar", "Marathahalli"]
  },
  "delhi": {
    name: "Delhi", region: "NCR", street: "Statesman House, Barakhamba Road, Connaught Place", zip: "110001",
    lat: 28.6139, lng: 77.2090,
    hubs: ["Connaught Place", "Nehru Place", "Okhla", "Saket", "Dwarka", "Karol Bagh", "Gurgaon", "Noida"]
  }
};

const slugMapping: Record<string, { service: string; city: string | null }> = {
  // Generic Service Pages
  "web-development": { service: "web", city: null },
  "mobile-app-development": { service: "mobile", city: null },
  "ui-ux-design": { service: "uiux", city: null },
  "software-development": { service: "software", city: null },
  "ai-development": { service: "ai", city: null },
  "ecommerce-development": { service: "ecommerce", city: null },
  "digital-marketing": { service: "marketing", city: null },
  "seo-services": { service: "seo", city: null },
  "custom-software-development": { service: "custom-software", city: null },

  // Surat Pages
  "web-development-company-surat": { service: "web", city: "surat" },
  "mobile-app-development-company-surat": { service: "mobile", city: "surat" },
  "software-development-company-surat": { service: "software", city: "surat" },
  "ui-ux-design-company-surat": { service: "uiux", city: "surat" },
  "seo-company-surat": { service: "seo", city: "surat" },
  "ai-development-company-surat": { service: "ai", city: "surat" },

  // Ahmedabad Pages
  "web-development-company-ahmedabad": { service: "web", city: "ahmedabad" },
  "software-development-company-ahmedabad": { service: "software", city: "ahmedabad" },
  "mobile-app-development-company-ahmedabad": { service: "mobile", city: "ahmedabad" },

  // Vadodara Pages
  "web-development-company-vadodara": { service: "web", city: "vadodara" },
  "software-development-company-vadodara": { service: "software", city: "vadodara" },

  // Rajkot Pages
  "web-development-company-rajkot": { service: "web", city: "rajkot" },
  "software-development-company-rajkot": { service: "software", city: "rajkot" },

  // Mumbai Pages
  "web-development-company-mumbai": { service: "web", city: "mumbai" },
  "software-development-company-mumbai": { service: "software", city: "mumbai" },

  // Bangalore Pages
  "web-development-company-bangalore": { service: "web", city: "bangalore" },
  "software-development-company-bangalore": { service: "software", city: "bangalore" },

  // Delhi Pages
  "web-development-company-delhi": { service: "web", city: "delhi" },
  "software-development-company-delhi": { service: "software", city: "delhi" }
};

export const allowedSlugs = Object.keys(slugMapping);

export function getSeoPageData(slug: string): ServicePageData | null {
  const mapping = slugMapping[slug];
  if (!mapping) return null;

  const service = servicesConfig[mapping.service];
  const city = mapping.city ? citiesConfig[mapping.city] : null;
  if (!service) return null;

  const citySuffix = city ? ` in ${city.name}` : "";
  const cityMetaSuffix = city ? ` Company in ${city.name}, ${city.region}, India` : " Services";
  const cityKeywords = city ? [
    `${service.name.toLowerCase()} company ${city.name.toLowerCase()}`,
    `${service.name.toLowerCase()} services in ${city.name.toLowerCase()}`,
    `best ${service.name.toLowerCase()} agency ${city.name.toLowerCase()}`
  ] : [];

  const metaTitle = city 
    ? `${service.headline} in ${city.name} | Varunya Technologies`
    : `${service.name} Services | Varunya Technologies`;

  const metaDescription = city
    ? `Looking for a top-tier ${service.name.toLowerCase()} company in ${city.name}? Varunya Technologies provides bespoke ${service.name.toLowerCase()} solutions, serving ${city.hubs.slice(0, 3).join(", ")}, and surrounding regions.`
    : `Varunya Technologies provides high-performance, custom ${service.name.toLowerCase()} services. Explore our technical expertise, case studies, and scalable client systems.`;

  const heroHeadline = city
    ? `${service.headline} in ${city.name}`
    : service.name;

  const introText = city
    ? `We design and engineer bespoke solutions that connect your business to clients across ${city.name} and globally. Partner with Varunya Technologies in ${city.name} to deploy modern digital assets.`
    : service.intro;

  // Localized FAQs
  const localizedFaqs = [
    {
      q: `Why choose a ${service.name.toLowerCase()} company${city ? ` in ${city.name}` : ""}?`,
      a: city 
        ? `Choosing a local ${service.name.toLowerCase()} partner in ${city.name} like Varunya Technologies allows for direct cooperation, local market insights, and easy on-site consultations, backed by international standards of quality.`
        : `Choosing a custom provider like Varunya Technologies guarantees that your product is built for your business outcomes, without templates or slow site speeds.`
    },
    {
      q: `How much does ${service.name.toLowerCase()} cost${city ? ` in ${city.name}` : ""}?`,
      a: `The budget varies based on complexity, custom integrations, and data scopes. We structure customized specifications and price estimations based on the exact features your business requires.`
    },
    {
      q: `How long does it take to deploy a ${service.name.toLowerCase()} system?`,
      a: `Standard projects take 2-4 weeks. Complex database syncs, AI integrations, or custom business software layouts typically require 1-3 months of design and engineering.`
    },
    {
      q: `Do you work with clients outside ${city ? city.name : "your local area"}?`,
      a: `Absolutely. While we are proud of our IT roots in ${city ? `${city.name}, ${city.region}` : "India"}, we serve ambitious start-ups and enterprise brands across India, North America, Europe, and the Middle East.`
    },
    {
      q: `Do you provide support after launch in ${city ? city.name : "our area"}?`,
      a: `Yes, we offer ongoing performance monitoring, server optimizations, and system feature updates, keeping your platform secure and fast.`
    }
  ];

  const result: ServicePageData = {
    slug,
    serviceKey: mapping.service,
    serviceName: service.name,
    cityName: city ? city.name : null,
    metaTitle,
    metaDescription,
    heroHeadline,
    introText,
    features: service.features,
    techStack: service.techStack,
    faqs: localizedFaqs
  };

  if (city) {
    result.localAddress = {
      streetAddress: city.street,
      addressLocality: city.name,
      addressRegion: city.region,
      postalCode: city.zip,
      addressCountry: "IN",
      latitude: city.lat,
      longitude: city.lng
    };
    result.localHubs = city.hubs;
  }

  return result;
}
