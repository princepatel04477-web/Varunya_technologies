"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";
import { AnimatedLayerButton } from "@/components/ui/button";

// Dynamically load the HeroFlow canvas only on the client side to avoid SSR errors
const HeroFlow = dynamic(() => import("./HeroFlow"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050507]" />
});

interface HeroProps {
  onEnterExhibition: () => void;
  loaderFinished?: boolean;
}

export default function Hero({ onEnterExhibition, loaderFinished = true }: HeroProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const textRevealVariants = {
    hidden: { y: "105%" },
    visible: {
      y: "0%",
      transition: {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: 0.8,
      },
    },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-bg-dark">
      {/* Flow-Field Background Canvas */}
      <HeroFlow />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col justify-between h-[70vh] mt-20 mb-12">
        {/* Eyebrow / Top Subheader */}
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={loaderFinished ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex items-center gap-3 text-xs tracking-[0.25em] text-muted font-semibold uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            VARUNYA STUDIO — CREATIVE TECHNOLOGY
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={loaderFinished ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="hidden sm:block text-xs tracking-widest text-muted text-right max-w-[200px]"
          >
            AESTHETIC CODING & ENGINEERING SOLUTIONS
          </motion.div>
        </div>

        {/* Main Editorial Headlines */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={loaderFinished ? "visible" : "hidden"}
          className="flex flex-col select-none"
        >
          <div className="overflow-hidden reveal-text-parent mb-2 md:mb-0 py-3">
            <motion.h1
              variants={textRevealVariants}
              className="font-display font-extrabold text-[clamp(2rem,10vw,4.8rem)] sm:text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-tighter metallic-shine-text px-2"
            >
              ENGINEERING
            </motion.h1>
          </div>
          <div className="overflow-hidden reveal-text-parent self-end text-right md:-mt-4 py-3">
            <motion.h1
              variants={textRevealVariants}
              className="font-display font-extrabold text-[clamp(2rem,10vw,4.8rem)] sm:text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-tighter metallic-shine-text px-2"
            >
              TOMORROW.
            </motion.h1>
          </div>
        </motion.div>

        {/* Hero Footer: Description + Scroll Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate={loaderFinished ? "visible" : "hidden"}
            className="flex flex-col items-start gap-6"
          >
            <p className="text-muted text-base md:text-lg max-w-lg leading-relaxed font-light tracking-wide">
              Varunya Technologies is a premium web development company and software company in Surat. We design and engineer high-end mobile app development solutions, custom software, and advanced AI systems where art meets uncompromising code.
            </p>
            <AnimatedLayerButton
              onClick={onEnterExhibition}
              className="w-[200px] h-[50px] text-xs font-bold tracking-widest bg-bg-dark shadow-[6px_6px_0px_var(--foreground)] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_var(--foreground)] rounded-[25px]"
            >
              VIEW OUR WORK  →
            </AnimatedLayerButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={loaderFinished ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center gap-4 group cursor-pointer self-start sm:self-auto"
            onClick={() => {
              const statementSection = document.getElementById("statement");
              statementSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] tracking-[0.3em] font-semibold text-muted uppercase group-hover:text-white transition-colors duration-300">
                SCROLL DOWN{" "}
              </span>
              <span className="text-[9px] tracking-wider text-white/30 group-hover:text-white/60 transition-colors duration-300">
                TO DISCOVER
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white transition-colors duration-300 group-hover:bg-white/5">
              <ArrowDown className="w-4 h-4 text-muted group-hover:text-white group-hover:translate-y-0.5 transition-all duration-300" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Running Ticker */}
      <div className="absolute bottom-6 left-0 w-full overflow-hidden border-t border-b border-white/[0.03] py-2 bg-black/10 backdrop-blur-sm z-10">
        <div className="flex whitespace-nowrap animate-ticker">
          <div className="text-[10px] tracking-[0.3em] font-mono text-white/30 uppercase flex gap-8 shrink-0 justify-around min-w-full">
            <span>SPATIAL WEB</span>
            <span>·</span>
            <span>AI SYSTEMS</span>
            <span>·</span>
            <span>CUSTOM SOFTWARE</span>
            <span>·</span>
            <span>PERFORMANCE MARKETING</span>
            <span>·</span>
            <span>AUTOMATION</span>
            <span>·</span>
            <span>WEBGL EXPERIENCES</span>
            <span>·</span>
          </div>
          <div className="text-[10px] tracking-[0.3em] font-mono text-white/30 uppercase flex gap-8 shrink-0 justify-around min-w-full" aria-hidden="true">
            <span>SPATIAL WEB</span>
            <span>·</span>
            <span>AI SYSTEMS</span>
            <span>·</span>
            <span>CUSTOM SOFTWARE</span>
            <span>·</span>
            <span>PERFORMANCE MARKETING</span>
            <span>·</span>
            <span>AUTOMATION</span>
            <span>·</span>
            <span>WEBGL EXPERIENCES</span>
            <span>·</span>
          </div>
        </div>
      </div>
    </section>
  );
}
