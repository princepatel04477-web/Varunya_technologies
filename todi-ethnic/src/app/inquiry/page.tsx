import type { Metadata } from "next";
import { InquiryPageClient } from "./InquiryPageClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Send Wholesale Inquiry — Bulk Lehenga Orders | Todi Ethnic",
  description:
    "Submit your bulk lehenga requirements. Our team responds within 24 hours with curated options, pricing, and sample details. Bridal, party-wear, designer & ready-to-wear.",
};

export default async function InquiryPage(props: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <>
      <Navbar />
      <main>
        <InquiryPageClient
          initialCollection={searchParams.collection || ""}
        />
      </main>
      <Footer />
    </>
  );
}
