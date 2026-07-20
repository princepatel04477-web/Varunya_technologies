"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui";

const faqs = [
  {
    q: "What is the minimum order quantity?",
    a: "Minimums vary by collection. Our Bridal and Designer collections start at 6–12 pieces, while Ready-to-Wear and Semi-Stitched lines start at 36–48 pieces. We work with boutique owners and bulk distributors alike.",
  },
  {
    q: "Can I get samples before placing a bulk order?",
    a: "Yes. We can send 2–3 design samples representative of your chosen collection. A sample fee applies (deducted from the first bulk order). Samples ship within 5–7 business days.",
  },
  {
    q: "What is your typical delivery timeline?",
    a: "Standard production takes 21–28 days from order confirmation. Express orders (12–16 days) are available for certain collections at a 10% premium. We maintain a 97% on-time dispatch rate.",
  },
  {
    q: "Do you offer private labeling?",
    a: "Yes. Our Premium Boutique line and bulk orders above 100 pieces qualify for private labeling. We can attach your store's brand labels, care instructions, and packaging at no additional cost for orders above 150 pieces.",
  },
  {
    q: "What payment terms do you offer?",
    a: "We accept advance payments via bank transfer, UPI, and cards. For repeat clients and bulk orders above ₹2,00,000, we offer a 40% advance + 60% on dispatch model. All prices are GST-inclusive.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We currently export to 12 countries including UAE, USA, UK, Canada, Australia, and Singapore. We handle all export documentation and customs clearance support. International shipping typically takes 10–14 days.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-white border-t border-border-subtle">
      <div className="container-page section-padding">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <Badge>FAQs</Badge>
            <h2 className="headline-xl mt-3 text-ink">
              Questions? We&apos;ve Got Answers.
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border-subtle/60 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left hover:bg-silk transition-colors"
      >
        <span className="text-sm md:text-base font-medium text-ink">{question}</span>
        <ChevronDown
          size={16}
          className="shrink-0 text-warm-gray transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-4 md:px-5 pb-4 md:pb-5">
          <p className="body-base text-warm-gray">{answer}</p>
        </div>
      )}
    </div>
  );
}
