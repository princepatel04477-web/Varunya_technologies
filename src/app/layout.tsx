import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MotionConfigProvider } from "@/context/MotionConfigContext";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Varunya Technologies — High-End Digital Production Agency",
  description: "We design and engineer spatial web experiences, AI systems, and custom software for ambitious brands. Based in Surat, India.",
  keywords: ["Digital Agency India", "WebGL Agency", "AI SaaS Development", "Next.js Agency", "Creative Technology", "Surat Tech Agency"],
  openGraph: {
    title: "Varunya Technologies",
    description: "High-concept editorial aesthetics. Solid engineering.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      }
    ],
    url: "https://www.varunyatechnologies.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Varunya Technologies",
    description: "High-concept editorial aesthetics. Solid engineering.",
    images: ["/og-image.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plusJakartaSans.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (!sessionStorage.getItem("vt_loader_shown")) {
                  document.documentElement.classList.add("loading");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-dark text-fg-light font-sans selection:bg-white selection:text-black" suppressHydrationWarning>
        <MotionConfigProvider>
          <NoiseOverlay />
          {children}
        </MotionConfigProvider>
      </body>
    </html>
  );
}
