import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Software Development Company in Surat | Varunya Technologies",
  description: "Are you searching for a reliable software company in Surat? Varunya Technologies architects custom software, REST/gRPC API structures, and cloud solutions designed for speed and security. Serving Adajan, Vesu, and globally.",
  keywords: [
    "software company in surat",
    "software development company surat",
    "custom software development Surat",
    "IT company in Surat",
    "enterprise software development Surat",
    "Varunya Technologies software"
  ],
  alternates: {
    canonical: "https://varunyatechnologies.com/software-development-company-surat"
  }
};

export default function SoftwarePage() {
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
      title: "Bespoke System Architecture",
      desc: "Robust, scalable software platforms tailored for complex enterprise processes and high-throughput workflows."
    },
    {
      title: "High-Performance API Layers",
      desc: "Secure, low-latency REST and gRPC API layers designed to connect services seamlessly under high traffic."
    },
    {
      title: "Cloud Infrastructure Setup",
      desc: "Reliable AWS/GCP server deployments configured with CI/CD automation pipelines, zero-downtime, and high availability."
    },
    {
      title: "Enterprise Security Integrations",
      desc: "Top-tier database security protocols, OAuth authentication, and regulatory compliance standards built natively."
    }
  ];

  const techStack = [
    "Node.js", "TypeScript", "Python", "Go", "PostgreSQL", "MongoDB", "AWS", "Docker", "gRPC", "Next.js"
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
        serviceKey="software"
        serviceName="Software Development"
        metaTitle="Software Development Company in Surat | Varunya Technologies"
        metaDescription="Are you searching for a reliable software company in Surat? Varunya Technologies architects custom software, REST/gRPC API structures, and cloud solutions designed for speed and security. Serving Adajan, Vesu, and globally."
        heroHeadline="Software Development Company in Surat"
        introText="We build custom digital architectures that solve complex operational bottlenecks. Rigorous system design, clean databases, and zero-bloat code designed to help your enterprise grow."
        features={features}
        techStack={techStack}
        faqs={faqs}
      />
    </>
  );
}
