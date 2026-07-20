import Hero from "@/components/Hero";
import CollectionGrid from "@/components/CollectionGrid";
import WhyTodi from "@/components/WhyTodi";
import Testimonials from "@/components/Testimonials";
import InquirySection from "@/components/InquirySection";
import FAQSection from "@/components/FAQSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CollectionGrid />
        <WhyTodi />
        <Testimonials />
        <InquirySection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
