"use client";

import { motion, useScroll, useMotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const statements = [
  {
    num: "(01)",
    title: "AI-FIRST DEVELOPMENT",
    desc: "We don't bolt on AI after the fact. Every system we build is designed from the architecture layer up for intelligent behavior."
  },
  {
    num: "(02)",
    title: "ZERO BLOAT, MAXIMUM SPEED",
    desc: "No vendor lock-in, no template drag. We write lean, production-grade code that scales without carrying dead weight."
  },
  {
    num: "(03)",
    title: "DESIGN THAT CONVERTS",
    desc: "Our UI/UX isn't decoration — it's engineered to reduce drop-off, increase trust, and drive your specific business outcome."
  },
  {
    num: "(04)",
    title: "FUELED BY OBSESSION",
    desc: "This isn't a job to us. We lose sleep over pixel gaps and latency budgets because your product reflects our name too."
  }
];

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll timeline over 500vh height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Update active index based on scroll progress (4 equal segments)
  useEffect(() => {
    const currentScroll = scrollYProgress.get();
    let initialIdx = 0;
    if (currentScroll < 0.25) initialIdx = 0;
    else if (currentScroll < 0.50) initialIdx = 1;
    else if (currentScroll < 0.75) initialIdx = 2;
    else initialIdx = 3;
    setActiveIndex(initialIdx);

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let idx = 0;
      if (latest < 0.25) idx = 0;
      else if (latest < 0.50) idx = 1;
      else if (latest < 0.75) idx = 2;
      else idx = 3;
      setActiveIndex(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Transform scroll progress to indicator width scale
  const scaleX = scrollYProgress;

  return (
    <section 
      ref={containerRef}
      className="why-choose-us relative w-full bg-[#050505] z-20 select-none overflow-visible h-[500vh]"
    >
      <div className="sticky-container sticky top-0 h-screen min-h-[100dvh] w-full overflow-hidden flex flex-col justify-center items-center">
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Progress Indicator */}
        <motion.div 
          style={{ scaleX, transformOrigin: "left" }}
          className="progress-indicator absolute top-0 left-0 right-0 h-1 bg-[#E02020] z-30"
        />

        {/* Content Stage */}
        <div className="content-stage w-full max-w-[900px] mx-auto text-center px-6 pointer-events-none relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 100, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -100, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col justify-center items-center text-center px-4"
            >
              {/* Number Label */}
              <span 
                className="font-mono text-white/40 mb-4 tracking-widest block"
                style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
              >
                {statements[activeIndex].num}
              </span>
              
              {/* Headline */}
              <h2 
                className="text-white uppercase tracking-tight mb-8"
                style={{ 
                  fontFamily: "var(--font-editorial), 'PP Editorial New', serif",
                  fontSize: "clamp(3rem, 7vw, 7rem)",
                  fontWeight: 700,
                  lineHeight: 0.95
                }}
              >
                {statements[activeIndex].title}
              </h2>
              
              {/* Description */}
              <p 
                className="text-white/70 max-w-2xl font-sans tracking-wide leading-relaxed"
                style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
              >
                {statements[activeIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
