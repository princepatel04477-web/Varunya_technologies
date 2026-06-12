import type { Metadata } from "next";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata: Metadata = {
  title: "UI/UX Design Company in Surat | Varunya Technologies",
  description: "Are you looking for an elite UI/UX design company in Surat? Varunya Technologies designs digital products that merge modern aesthetics with conversion-oriented user psychology. Serving Adajan, Vesu, and globally.",
  keywords: [
    "UI UX design company surat",
    "UI UX designers in Surat",
    "web design company Surat",
    "mobile app UI UX Surat",
    "creative design studio Surat",
    "Varunya Technologies UI UX design"
  ],
  alternates: {
    canonical: "https://varunyatechnologies.com/ui-ux-design-company-surat"
  }
};

export default function UIUXPage() {
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
      title: "Conversion-Led UX Architecture",
      desc: "Interface blueprints engineered to minimize bounce rates, reduce task completion friction, and optimize user flows."
    },
    {
      title: "High-Concept Editorial UI",
      desc: "Distinct, premium typography styles and balanced layouts that make your brand stand out from generic competitors."
    },
    {
      title: "Interactive Prototyping",
      desc: "High-fidelity clickable previews matching precise transition timings before we write a single line of code."
    },
    {
      title: "Brand Asset Packaging",
      desc: "Custom design tokens, design systems, layouts, icons, and components tailored to scale your product seamlessly."
    }
  ];

  const techStack = [
    "Figma", "Adobe CC", "Framer Motion", "Cinema 4D", "Spline", "Typography Design", "Tailwind CSS", "Interaction Design"
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
        serviceKey="uiux"
        serviceName="UI/UX Design"
        metaTitle="UI/UX Design Company in Surat | Varunya Technologies"
        metaDescription="Are you looking for an elite UI/UX design company in Surat? Varunya Technologies designs digital products that merge modern aesthetics with conversion-oriented user psychology. Serving Adajan, Vesu, and globally."
        heroHeadline="UI/UX Design Company in Surat"
        introText="We compose premium interfaces that connect your brand message directly to user actions. No lazy layouts or generic templates — we engineer custom visual systems built on behavioral design guidelines."
        features={features}
        techStack={techStack}
        faqs={faqs}
      />
    </>
  );
}
