import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeoPageData, allowedSlugs } from "@/data/seoContent";
import ServicePageTemplate from "@/components/ServicePageTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allowedSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getSeoPageData(slug);
  if (!data) return {};

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: [
      data.serviceName.toLowerCase(),
      data.cityName ? `${data.serviceName.toLowerCase()} ${data.cityName.toLowerCase()}` : "",
      data.cityName ? `best ${data.serviceName.toLowerCase()} company ${data.cityName.toLowerCase()}` : "",
      "Varunya Technologies",
      "software development agency India"
    ].filter(Boolean),
    alternates: {
      canonical: `https://varunyatechnologies.com/${slug}`
    }
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = getSeoPageData(slug);
  if (!data) notFound();

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Varunya Technologies",
    "url": "https://varunyatechnologies.com",
    "logo": "https://varunyatechnologies.com/VT_logo.png",
    "sameAs": [
      "https://github.com/varunya-technologies",
      "https://twitter.com/varunya_tech",
      "https://linkedin.com/company/varunya-technologies"
    ]
  };

  // LocalBusiness Schema (only if localAddress is set)
  const localBusinessSchema = data.localAddress ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Varunya Technologies",
    "image": "https://varunyatechnologies.com/VT_logo.png",
    "@id": `https://varunyatechnologies.com/#localbusiness-${data.cityName?.toLowerCase()}`,
    "url": "https://varunyatechnologies.com",
    "telephone": "+919900000000",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.localAddress.streetAddress,
      "addressLocality": data.localAddress.addressLocality,
      "addressRegion": data.localAddress.addressRegion,
      "postalCode": data.localAddress.postalCode,
      "addressCountry": data.localAddress.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": data.localAddress.latitude,
      "longitude": data.localAddress.longitude
    },
    "areaServed": data.localHubs?.map(hub => ({
      "@type": "AdministrativeArea",
      "name": hub
    }))
  } : null;

  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": data.serviceName,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Varunya Technologies",
      "image": "https://varunyatechnologies.com/VT_logo.png",
      "telephone": "+919900000000",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rajhans Olimpia, Adajan-Hazira Road, Adajan",
        "addressLocality": "Surat",
        "addressRegion": "Gujarat",
        "postalCode": "395009",
        "addressCountry": "IN"
      }
    },
    "areaServed": data.cityName ? {
      "@type": "AdministrativeArea",
      "name": data.cityName
    } : {
      "@type": "Country",
      "name": "IN"
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://varunyatechnologies.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": data.serviceName + (data.cityName ? ` in ${data.cityName}` : ""),
        "item": `https://varunyatechnologies.com/${slug}`
      }
    ]
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServicePageTemplate
        serviceKey={data.serviceKey}
        serviceName={data.serviceName}
        metaTitle={data.metaTitle}
        metaDescription={data.metaDescription}
        heroHeadline={data.heroHeadline}
        introText={data.introText}
        features={data.features}
        techStack={data.techStack}
        faqs={data.faqs}
      />
    </>
  );
}
