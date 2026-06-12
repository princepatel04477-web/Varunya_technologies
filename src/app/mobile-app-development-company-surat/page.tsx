import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Mobile App Development Company in Surat | Varunya Technologies",
  description: "Are you searching for a top mobile app development company in Surat? Varunya Technologies designs and engineers high-performance iOS and Android apps using React Native and Flutter. Serving Adajan, Vesu, and globally.",
  keywords: [
    "mobile app development company surat",
    "mobile app development Surat",
    "iOS developer Surat",
    "Android app developers in Surat",
    "Flutter app company Surat",
    "Varunya Technologies mobile app"
  ],
  alternates: {
    canonical: "https://varunyatechnologies.com/mobile-app-development-company-surat"
  }
};

export default function MobilePage() {
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
      title: "iOS & Android Architectures",
      desc: "Native-grade iOS and Android mobile platforms designed for smooth performance and absolute reliability."
    },
    {
      title: "Flutter & React Native",
      desc: "Cross-platform mobile apps built from a single codebase to reduce development overhead while retaining premium user experience."
    },
    {
      title: "Offline-First Synchronization",
      desc: "Robust database sync pipelines that function seamlessly during network drops, perfect for field operations in Surat."
    },
    {
      title: "Seamless API Integration",
      desc: "High-throughput APIs linking mobile frontends directly to custom cloud architectures, CRM databases, or payment gateways."
    }
  ];

  const techStack = [
    "React Native", "Flutter", "TypeScript", "Dart", "Swift", "Kotlin", "Firebase", "Node.js", "GraphQL"
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
        serviceKey="mobile"
        serviceName="Mobile App Development"
        metaTitle="Mobile App Development Company in Surat | Varunya Technologies"
        metaDescription="Are you searching for a top mobile app development company in Surat? Varunya Technologies designs and engineers high-performance iOS and Android apps using React Native and Flutter. Serving Adajan, Vesu, and globally."
        heroHeadline="Mobile App Development Company in Surat"
        introText="We engineer premium native and cross-platform mobile solutions that connect your business directly to your users' devices. Scalable, secure, and visually stunning applications launched from Surat."
        features={features}
        techStack={techStack}
        faqs={faqs}
      />
    </>
  );
}
