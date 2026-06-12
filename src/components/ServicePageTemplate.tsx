"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import SmoothScroll from "@/components/SmoothScroll";
import { ChevronDown, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Feature {
  title: string;
  desc: string;
}

interface FAQ {
  q: string;
  a: string;
}

interface ServicePageTemplateProps {
  serviceKey: string; // e.g., "web", "mobile", "uiux", "software", "ai"
  serviceName: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  introText: string;
  features: Feature[];
  techStack: string[];
  faqs: FAQ[];
}

// Framer Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
};

export default function ServicePageTemplate({
  serviceKey,
  serviceName,
  heroHeadline,
  introText,
  features,
  techStack,
  faqs
}: ServicePageTemplateProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const otherServices = [
    { name: "Web Development", path: "/web-development-company-surat", key: "web" },
    { name: "Mobile App Development", path: "/mobile-app-development-company-surat", key: "mobile" },
    { name: "UI/UX Design", path: "/ui-ux-design-company-surat", key: "uiux" },
    { name: "Software Development", path: "/software-development-company-surat", key: "software" },
    { name: "AI Development", path: "/ai-development-company-surat", key: "ai" }
  ].filter(s => s.key !== serviceKey);

  const suratHubs = [
    "Adajan", "Vesu", "Pal", "Katargam", "Varachha", 
    "Mota Varachha", "Bhatar", "Althan", "Piplod"
  ];

  return (
    <SmoothScroll>
      <div className="bg-[#050507] text-[#eae6df] font-sans antialiased selection:bg-white/10 selection:text-white min-h-screen flex flex-col justify-between relative overflow-hidden">
        
        {/* Dynamic breathing background atmosphere */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-red-950/[0.03] blur-[130px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: "14s" }} />
        <div className="absolute top-[35%] right-1/4 w-[700px] h-[700px] rounded-full bg-[#3da58a]/[0.02] blur-[150px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: "18s" }} />

        {/* Noise overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.012] mix-blend-overlay z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <Navbar />

        {/* Main Content */}
        <main className="flex-grow pt-36 pb-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            
            {/* Breadcrumb back navigation with subtle slide-in */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10"
            >
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] text-white/40 hover:text-white hover:translate-x-[-4px] transition-all duration-300 font-mono uppercase"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to home</span>
              </Link>
            </motion.div>

            {/* Hero Section */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col gap-6 mb-20 md:mb-28"
            >
              <motion.span 
                variants={fadeInUp}
                className="text-[10px] tracking-[0.45em] text-[#d4af37] font-mono uppercase"
              >
                Premium {serviceName} Solutions
              </motion.span>
              <motion.h1 
                variants={fadeInUp}
                className="font-display font-bold text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-white max-w-4xl"
                style={{ fontFamily: "var(--font-norway), 'Norway', sans-serif" }}
              >
                {heroHeadline}
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-muted text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed font-light mt-4"
              >
                {introText}
              </motion.p>
            </motion.div>

            {/* Content Stacking Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start mb-28">
              
              {/* Left Column: Local business focus & deliverables */}
              <div className="lg:col-span-7 flex flex-col gap-12">
                
                {/* Local market narrative */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="flex flex-col gap-5 border border-white/5 bg-white/[0.01] rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl"
                >
                  <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#3da58a]" />
                    <span>Serving Surat&apos;s Growing Enterprise Sectors</span>
                  </h2>
                  <p className="text-muted text-sm leading-relaxed font-light">
                    Surat is rapidly evolving from a traditional mercantile diamond and textile hub into a digital-first metropolis. At Varunya Technologies, we align our high-end engineering standards with the specific needs of local business communities. Whether you are based in the high-rise commercial areas of <strong className="text-white font-medium">Vesu</strong> and <strong className="text-white font-medium">Piplod</strong>, the bustling markets of <strong className="text-white font-medium">Varachha</strong> and <strong className="text-white font-medium">Mota Varachha</strong>, the historic industrial centers of <strong className="text-white font-medium">Katargam</strong>, or residential/office hubs like <strong className="text-white font-medium">Adajan</strong>, <strong className="text-white font-medium">Pal</strong>, <strong className="text-white font-medium">Bhatar</strong>, and <strong className="text-white font-medium">Althan</strong> — we build digital platforms that establish competitive authority.
                  </p>
                </motion.div>

                {/* Key Deliverables Cards Staggered */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-xs uppercase tracking-[0.25em] text-[#888893] font-bold font-mono opacity-60 mb-2">
                    Key Deliverables
                  </h3>
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {features.map((feature, idx) => (
                      <motion.div 
                        key={idx}
                        variants={scaleIn}
                        whileHover={{ 
                          scale: 1.02, 
                          borderColor: "rgba(61, 165, 138, 0.25)",
                          backgroundColor: "rgba(255, 255, 255, 0.02)",
                          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)"
                        }}
                        transition={{ duration: 0.3 }}
                        className="border border-white/5 bg-white/[0.01] rounded-2xl p-6 transition-colors duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="text-xs font-semibold tracking-wider uppercase text-white mb-3 font-mono flex items-center gap-2">
                            <span className="text-[#3da58a] text-[10px]">0{idx + 1}.</span>
                            {feature.title}
                          </h4>
                          <p className="text-muted text-xs leading-relaxed font-light">
                            {feature.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Right Column: Tech Stack & Cross-Linking */}
              <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-28">
                
                {/* Tech Stack Box */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="border border-white/5 bg-white/[0.01] rounded-2xl p-6 shadow-xl backdrop-blur-sm"
                >
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-semibold mb-5 font-mono">
                    Engineered With
                  </h3>
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-wrap gap-2"
                  >
                    {techStack.map((tech, idx) => (
                      <motion.span 
                        variants={scaleIn}
                        whileHover={{ scale: 1.05, borderColor: "rgba(212, 175, 55, 0.3)" }}
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-white/[0.03] text-[9px] font-mono tracking-widest text-[#eae5c9] border border-white/5 uppercase cursor-default transition-all duration-300"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Explore Other Services */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="border border-white/5 bg-white/[0.01] rounded-2xl p-6 shadow-xl backdrop-blur-sm"
                >
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[#888893] font-semibold mb-4 font-mono">
                    Explore Other Solutions
                  </h3>
                  <div className="flex flex-col gap-3">
                    {otherServices.map((service, idx) => (
                      <Link 
                        key={idx} 
                        href={service.path}
                        className="group flex justify-between items-center py-2.5 border-b border-white/5 text-xs text-muted hover:text-white transition-colors duration-300"
                      >
                        <span className="font-mono">{service.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300" />
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Local hubs summary */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="border border-white/5 bg-white/[0.01] rounded-2xl p-6 shadow-xl backdrop-blur-sm"
                >
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[#888893] font-semibold mb-3 font-mono">
                    Coverage Areas in Surat
                  </h3>
                  <p className="text-[10px] leading-relaxed text-muted font-light font-mono">
                    {suratHubs.join(" · ")}
                  </p>
                </motion.div>

              </div>

            </div>

            {/* FAQ Accordion */}
            <div className="mb-28">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="text-center mb-14"
              >
                <span className="text-[10px] tracking-[0.45em] text-[#888893] font-mono uppercase block mb-3">
                  INTELLIGENT FAQS
                </span>
                <h2 
                  className="text-3xl md:text-5xl font-normal text-white"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Frequently Asked Questions
                </h2>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-3xl mx-auto flex flex-col gap-3.5"
              >
                {faqs.map((faq, idx) => (
                  <motion.div 
                    variants={fadeInUp}
                    key={idx}
                    className="border border-white/5 bg-white/[0.01] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/12"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-white/[0.01] transition-colors duration-300 focus:outline-none cursor-pointer"
                    >
                      <span className="text-sm font-medium tracking-wide text-white pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 text-muted transition-transform duration-300 shrink-0 ${
                          openFaqIndex === idx ? "rotate-180 text-white" : ""
                        }`} 
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {openFaqIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-1 border-t border-white/5 text-xs md:text-sm text-muted leading-relaxed font-light">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Contact Section Direct Render */}
            <motion.div 
              id="contact-wrapper"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <Contact />
            </motion.div>

          </div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
