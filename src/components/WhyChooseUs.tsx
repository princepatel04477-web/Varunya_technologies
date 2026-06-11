"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useMotionConfig } from "@/context/MotionConfigContext";

const cardData = [
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
];export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  const { isMobile } = useMotionConfig();
  const [cardsRevealed, setCardsRevealed] = useState(false);

  // Desktop scroll progress (when section is pinned)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mobile scroll progress (as section scrolls naturally through viewport)
  const { scrollYProgress: elementScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const activeProgress = isMobile ? elementScrollProgress : scrollYProgress;

  // Marquee Horizontal Translate
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const marqueeXMobile = useTransform(elementScrollProgress, [0, 1], ["10%", "-50%"]);
  const activeMarqueeX = isMobile ? marqueeXMobile : marqueeX;

  // Star scale morph
  const starScale = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const starScaleMobile = useTransform(elementScrollProgress, [0, 1], [0.5, 1.2]);
  const activeStarScale = isMobile ? starScaleMobile : starScale;

  // Hero Text Parallax Translate Y
  const heroY = useTransform(scrollYProgress, [0, 1], ["0px", "-40px"]);
  const heroYMobile = useTransform(elementScrollProgress, [0, 1], ["20px", "-20px"]);
  const activeHeroY = isMobile ? heroYMobile : heroY;

  // Body Opacity Fade-in
  const bodyOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 0.8]);
  const bodyOpacityMobile = useTransform(elementScrollProgress, [0.1, 0.35], [0, 0.8]);
  const activeBodyOpacity = isMobile ? bodyOpacityMobile : bodyOpacity;

  useEffect(() => {
    const unsubscribe = activeProgress.on("change", (latest) => {
      // Trigger card reveal when scrolling enters the bottom half (only on desktop)
      if (!isMobile) {
        if (latest > 0.45) {
          setCardsRevealed(true);
        } else {
          setCardsRevealed(false);
        }
      }

      // Animate SVG distortion filter attributes directly for 60fps performance
      if (turbulenceRef.current) {
        const freq = 0.01 + latest * 0.035;
        turbulenceRef.current.setAttribute("baseFrequency", freq.toString());
      }
      if (displacementRef.current) {
        const scaleVal = latest * 60;
        displacementRef.current.setAttribute("scale", scaleVal.toString());
      }
    });

    return () => unsubscribe();
  }, [activeProgress, isMobile]);

  const marqueeRepeats = Array(5).fill("WHY VARUNYA");

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#050505] z-20 select-none overflow-visible"
      style={{ minHeight: isMobile ? "auto" : "300vh" }}
    >
      {/* SVG Displacement Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="distortionFilter">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="1"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Sticky full-screen view container */}
      <div className="relative md:sticky md:top-0 h-auto md:h-screen w-full overflow-visible md:overflow-hidden flex flex-col justify-between py-12 md:py-16">
        
        {/* ==========================================
            LAYER 2 — Background Distortion Video/Image
           ========================================== */}
        <div 
          className="absolute inset-0 z-0 bg-[#050505] pointer-events-none"
          style={{ filter: "url(#distortionFilter)" }}
        >
          {/* Subtle noise grid texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "45px 45px",
            }}
          />
          {/* Ambient center gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_75%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(224,32,32,0.04)_0%,transparent_60%)]" />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* ==========================================
            LAYER 1 — Sticky Horizontal Marquee Header
           ========================================== */}
        <div className="w-full bg-black py-4 border-y border-white/5 relative z-10 overflow-hidden select-none">
          <motion.div 
            style={{ x: activeMarqueeX }}
            className="flex items-center whitespace-nowrap gap-12 text-[100px] sm:text-[140px] md:text-[170px] font-black uppercase text-white tracking-tighter leading-none"
          >
            {marqueeRepeats.map((text, idx) => (
              <div key={idx} className="flex items-center gap-12">
                <span style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif", fontWeight: 900 }}>
                  {text}
                </span>
                <motion.svg
                  style={{ scale: activeStarScale }}
                  viewBox="0 0 24 24"
                  className="w-16 h-16 md:w-20 md:h-20 text-white fill-current flex-shrink-0"
                >
                  <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                </motion.svg>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ==========================================
            LAYER 3 — Centered Content (Pinned)
           ========================================== */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center mt-12 md:mt-8 flex-1 flex flex-col justify-center gap-4">
          <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-white opacity-70">
            LIFE WITHIN THE WORK / JUST BUILD IT.
          </span>
          
          <motion.h2 
            style={{ 
              y: activeHeroY,
              fontFamily: "var(--font-editorial), 'PP Editorial New', serif"
            }}
            className="text-4xl sm:text-5xl md:text-[56px] text-white leading-[1.1] tracking-tight font-normal"
          >
            Extraordinary Results<br />
            <span className="italic text-[#eae5c9]">That Feel Like Home.</span>
          </motion.h2>

          <motion.p 
            style={{ opacity: activeBodyOpacity }}
            className="text-[11px] sm:text-[13px] uppercase tracking-[0.15em] leading-relaxed max-w-[420px] mx-auto text-white/80 font-sans"
          >
            We translate high-level digital concepts into high-speed, scalable software systems built with mathematical precision.
          </motion.p>
        </div>

        {/* ==========================================
            LAYER 4 — 2×2 Feature Cards (Scroll-Revealed)
           ========================================== */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-12 md:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
            {cardData.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 80, opacity: 0 }}
                animate={isMobile ? undefined : { 
                  y: cardsRevealed ? 0 : 120, 
                  opacity: cardsRevealed ? 1 : 0 
                }}
                whileInView={isMobile ? { y: 0, opacity: 1 } : undefined}
                viewport={isMobile ? { once: true, amount: 0.15 } : undefined}
                transition={{ 
                  type: "spring", 
                  damping: 28, 
                  stiffness: 110, 
                  delay: isMobile ? idx * 0.05 : idx * 0.1 
                }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 w-full bg-white text-black p-5 rounded-xl border-b-4 border-transparent hover:border-[#E02020] transition-all duration-300 group shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-black/40">{card.num}</span>
                  <h4 className="font-sans font-extrabold text-[12.5px] uppercase tracking-wider text-black group-hover:text-[#E02020] transition-colors duration-300">
                    {card.title}
                  </h4>
                </div>
                <p className="font-sans text-[10px] uppercase tracking-wider leading-relaxed text-black/70 max-w-[260px] text-left sm:text-right ml-0 sm:ml-auto">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
