import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Web Development Company in Surat | Varunya Technologies",
  description: "Looking for a top-tier web development company in Surat? Varunya Technologies builds high-performance Next.js websites, WebGL experiences, and custom 3D web applications. Serving Adajan, Vesu, and globally.",
  keywords: [
    "web development company in surat",
    "website development company surat",
    "web developers in Surat",
    "best website design Surat",
    "Next.js agency Surat",
    "Varunya Technologies web development"
  ],
  alternates: {
    canonical: "https://varunyatechnologies.com/web-development-company-surat"
  }
};

export default function WebPage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Varunya Technologies",
    "image": "https://varunyatechnologies.com/VT_logo.png",
    "@id": "https://varunyatechnologies.com/#localbusiness",
    "url": "https://varunyatechnologies.com",
    "telephone": "+919900000000",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rajhans Olimpia, Adajan-Hazira Road, Adajan",
      "addressLocality": "Surat",
      "addressRegion": "Gujarat",
      "postalCode": "395009",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.1960,
      "longitude": 72.7933
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Adajan" },
      { "@type": "AdministrativeArea", "name": "Vesu" },
      { "@type": "AdministrativeArea", "name": "Pal" },
      { "@type": "AdministrativeArea", "name": "Katargam" },
      { "@type": "AdministrativeArea", "name": "Varachha" },
      { "@type": "AdministrativeArea", "name": "Mota Varachha" },
      { "@type": "AdministrativeArea", "name": "Bhatar" },
      { "@type": "AdministrativeArea", "name": "Althan" },
      { "@type": "AdministrativeArea", "name": "Piplod" },
      { "@type": "AdministrativeArea", "name": "Surat" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why choose a web development company in Surat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Choosing a local web development company in Surat like Varunya Technologies allows for direct collaboration, timezone alignment, and local market insight, while delivering international-grade spatial design and robust software systems."
        }
      },
      {
        "@type": "Question",
        "name": "How much does website development cost in Surat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The cost of website development in Surat varies based on complexity, ranging from budget-friendly informational websites to premium custom 3D web experiences, bespoke software solutions, and advanced AI agent architectures tailored to business needs."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to develop a website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A standard Next.js website takes 2-4 weeks, while complex 3D experiences, custom software dashboards, or enterprise agentic AI systems can take 1-3 months of focused design and engineering."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide mobile app development services in Surat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Varunya Technologies provides high-performance native and cross-platform mobile app development services in Surat using React Native and Flutter, tailored to users across major hubs like Adajan, Vesu, and Piplod."
        }
      },
      {
        "@type": "Question",
        "name": "Do you work with clients outside Surat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. While we are proud to be a premier software company in Surat, Gujarat, we architect and deploy digital platforms for ambitious clients across India, North America, Europe, and the Middle East."
        }
      }
    ]
  };

  const features = [
    {
      title: "High-End Next.js Apps",
      desc: "Built for speed, instant hydration, maximum search indexability, and absolute rendering fluidity."
    },
    {
      title: "WebGL & 3D Webspaces",
      desc: "Immersive spatial visual narratives directly in the browser. Allow customers to interact with your physical products natively."
    },
    {
      title: "SEO & Core Web Vitals",
      desc: "Fully optimized for Google PageSpeed, mobile accessibility, structured schema data, and local crawlability."
    },
    {
      title: "Tailored CMS Integrations",
      desc: "Flexible, secure content management systems that empower local Surat businesses to scale operations without sacrificing performance."
    }
  ];

  const techStack = [
    "Next.js", "React", "TypeScript", "WebGL", "Three.js", "GSAP", "TailwindCSS", "Vercel", "Node.js"
  ];

  const faqs = [
    {
      q: "Why choose a web development company in Surat?",
      a: "Choosing a local web development company in Surat like Varunya Technologies allows for direct collaboration, timezone alignment, and local market insight, while delivering international-grade spatial design and robust software systems."
    },
    {
      q: "How much does website development cost in Surat?",
      a: "The cost of website development in Surat varies based on complexity, ranging from budget-friendly informational websites to premium custom 3D web experiences, bespoke software solutions, and advanced AI agent architectures tailored to business needs."
    },
    {
      q: "How long does it take to develop a website?",
      a: "A standard Next.js website takes 2-4 weeks, while complex 3D experiences, custom software dashboards, or enterprise agentic AI systems can take 1-3 months of focused design and engineering."
    },
    {
      q: "Do you provide mobile app development services in Surat?",
      a: "Yes, Varunya Technologies provides high-performance native and cross-platform mobile app development services in Surat using React Native and Flutter, tailored to users across major hubs like Adajan, Vesu, and Piplod."
    },
    {
      q: "Do you work with clients outside Surat?",
      a: "Absolutely. While we are proud to be a premier software company in Surat, Gujarat, we architect and deploy digital platforms for ambitious clients across India, North America, Europe, and the Middle East."
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServicePageTemplate
        serviceKey="web"
        serviceName="Web Development"
        metaTitle="Web Development Company in Surat | Varunya Technologies"
        metaDescription="Looking for a top-tier web development company in Surat? Varunya Technologies builds high-performance Next.js websites, WebGL experiences, and custom 3D web applications. Serving Adajan, Vesu, and globally."
        heroHeadline="Web Development Company in Surat"
        introText="We design and engineer bespoke web experiences that combine aesthetic editorial craftsmanship with uncompromising frontend and backend performance. From Surat to the world, we launch digital assets that convert."
        features={features}
        techStack={techStack}
        faqs={faqs}
      />
    </>
  );
}
