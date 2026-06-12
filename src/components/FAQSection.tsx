"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    <section id="faq" className="py-28 md:py-36 w-full bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background radial gradient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.01) 0%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(80px)"
        }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.45em] text-[#888893] font-mono uppercase block mb-3">
            Local FAQ
          </span>
          <h2 
            className="text-4xl md:text-6xl font-normal text-white leading-[1.05]"
            style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-white/5 bg-white/[0.01] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/[0.01] transition-colors duration-300 focus:outline-none cursor-pointer"
              >
                <span className="text-sm font-medium tracking-wide text-white pr-4">
                  {faq.q}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-muted transition-transform duration-300 shrink-0 ${
                    openIndex === idx ? "rotate-180 text-white" : ""
                  }`} 
                />
              </button>
              
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-1 border-t border-white/5 text-xs md:text-sm text-muted leading-relaxed font-light">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
