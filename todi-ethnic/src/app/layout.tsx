import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Todi Ethnic — Premium B2B Lehenga Manufacturer & Wholesaler",
    template: "%s | Todi Ethnic",
  },
  description:
    "India's trusted wholesale lehenga manufacturer supplying premium bridal, party-wear, and designer lehengas to retailers, boutiques, and distributors worldwide. B2B bulk orders welcome.",
  keywords: [
    "lehenga manufacturer",
    "wholesale lehengas",
    "bridal lehenga supplier",
    "ethnic wear bulk orders",
    "Indian wedding wear manufacturer",
    "lehenga wholesaler India",
    "B2B ethnic wear supplier",
    "designer lehenga wholesale",
  ],
  openGraph: {
    title: "Todi Ethnic — B2B Lehenga Manufacturer & Wholesale Supplier",
    description:
      "India's premier wholesale lehenga manufacturer. Bulk bridal, party-wear & designer lehengas for retailers & distributors worldwide.",
    url: "https://todiethnic.com",
    siteName: "Todi Ethnic",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todi Ethnic — B2B Lehenga Manufacturer & Wholesale Supplier",
    description:
      "India's premier wholesale lehenga manufacturer. Bulk bridal, party-wear & designer lehengas for retailers & distributors worldwide.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://todiethnic.com"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
