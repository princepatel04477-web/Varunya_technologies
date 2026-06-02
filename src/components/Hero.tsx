"use client";

import { motion } from "framer-motion";
import HeroCanvas from "./HeroCanvas";
import { ArrowDown } from "lucide-react";
import { AnimatedLayerButton } from "@/components/ui/button";

interface HeroProps {
  onEnterExhibition: () => void;
}

export default function Hero({ onEnterExhibition }: HeroProps) {
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
        ease: [0.16, 1, 0.3, 1] as any,
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
        ease: [0.16, 1, 0.3, 1] as any,
        delay: 0.8,
      },
    },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-bg-dark">
      {/* Background Canvas */}
      <HeroCanvas />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col justify-between h-[75vh] mt-24">
        {/* Empty space or top subheader */}
        <div className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
            className="flex items-center gap-3 text-xs tracking-[0.25em] text-muted font-semibold uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            VARUNYA STUDIO — CREATIVE TECHNOLOGY
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
            className="hidden sm:block text-xs tracking-widest text-muted text-right max-w-[200px]"
          >
            AESTHETIC CODING & ENGINEERING SOLUTIONS
          </motion.div>
        </div>

        {/* Main Editorial Headlines */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
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
            animate="visible"
            className="flex flex-col items-start gap-6"
          >
            <p className="text-muted text-base md:text-lg max-w-md leading-relaxed font-light tracking-wide">
              We design and engineer high-end digital products, spatial web architectures, and advanced AI systems. High-concept editorial art meets solid code.
            </p>
            <AnimatedLayerButton
              onClick={onEnterExhibition}
              className="w-[180px] h-[50px] text-xs font-bold tracking-widest bg-bg-dark shadow-[6px_6px_0px_var(--foreground)] hover:translate-y-[4px] hover:shadow-[2px_2px_0px_var(--foreground)] rounded-[25px]"
            >
              PROJECTS
            </AnimatedLayerButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center gap-4 group cursor-pointer self-start sm:self-auto"
            onClick={() => {
              const statementSection = document.getElementById("statement");
              statementSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] tracking-[0.3em] font-semibold text-muted uppercase group-hover:text-white transition-colors duration-300">
                SCROLL DOWN
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
    </section>
  );
}
