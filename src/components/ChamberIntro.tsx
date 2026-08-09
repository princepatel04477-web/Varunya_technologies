"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

interface ChamberIntroProps {
  soundOn: boolean;
  setSoundOn: (sound: boolean) => void;
  onEnter: () => void;
  onClose: () => void;
}

export default function ChamberIntro({
  soundOn,
  setSoundOn,
  onEnter,
  onClose,
}: ChamberIntroProps) {
  const t = {
    headline: "Our projects. One digital ecosystem.",
    sub: "Each chamber reveals a unique product, platform, or business solution. Explore the architecture, technology, and impact behind every project engineered by Varunya Technologies.",
    enter: "ENTER",
    soundWarning: "ACTIVATE SOUND TO ENTER IN SILENCE",
    soundActive: "SOUND ON",
    soundMute: "MUTE",
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 bg-[#050507] text-[#eae6df] overflow-hidden select-none"
    >
      {/* Top Header controls */}
      <div className="flex justify-between items-center w-full z-10">
        <button
          onClick={onClose}
          className="flex items-center gap-3 group focus:outline-none -my-8 cursor-pointer text-left"
          title="Exit to Site"
        >
          <Image
            src="/VT_logo.png"
            alt="Varunya Logo"
            width={112}
            height={112}
            className="h-16 w-16 sm:h-28 sm:w-28 object-contain group-hover:scale-105 transition-transform duration-300 invert hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            priority
          />
          <span className="hidden sm:inline-block h-[1px] w-6 bg-[#d4af37]/35" />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] tracking-widest text-[#d4af37] font-semibold uppercase leading-tight">
              VARUNYA TECHNOLOGIES
            </span>
            <span className="text-[8px] tracking-widest text-[#eae6df]/45 uppercase mt-0.5 font-medium">
              Interactive Project Chambers
            </span>
          </div>
        </button>

        <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-medium tracking-widest">
          {/* Exit / Close button */}
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors duration-300 cursor-pointer font-bold uppercase text-[9px] sm:text-[10px] tracking-widest"
          >
            <span className="sm:hidden">EXIT</span>
            <span className="hidden sm:inline">EXIT TO SITE</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="flex items-center gap-2 text-white/50 hover:text-[#eae6df] transition-colors duration-300 group"
          >
            <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
            {soundOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="group-hover:text-[#eae6df]">{t.soundActive}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="group-hover:text-[#eae6df]">{t.soundMute}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Intro content */}
      <div className="max-w-xl mx-auto flex flex-col items-center text-center justify-center flex-grow z-10 px-4">
        {/* Editorial Sub */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-[10px] tracking-[0.3em] font-bold text-[#d4af37] mb-6 uppercase"
        >
          VARUNYA TECHNOLOGIES — DIGITAL EXHIBITION
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="font-serif italic text-4xl md:text-6xl text-[#eae6df] tracking-tight mb-8"
        >
          {t.headline}
        </motion.h1>

        {/* Divider line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="h-[1px] bg-[#d4af37]/40 mb-8"
        />

        {/* Narrative */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.9, duration: 1.2 }}
          className="text-[#eae6df] text-xs md:text-sm leading-relaxed font-light font-sans tracking-wide mb-12 max-w-lg"
        >
          {t.sub}
        </motion.p>

        {/* Enter Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          onClick={onEnter}
          className="relative group py-4 px-12 border border-[#d4af37]/30 hover:border-[#d4af37] bg-transparent text-xs tracking-[0.25em] font-semibold text-[#eae6df] transition-all duration-500 hover:tracking-[0.35em]"
        >
          {/* Accent hover glow */}
          <div className="absolute inset-0 bg-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {t.enter}
        </motion.button>
      </div>

      {/* Bottom status */}
      <div className="w-full flex flex-col items-center z-10">
        <span className="text-[9px] tracking-[0.2em] text-white/30 font-bold uppercase mb-2">
          {t.soundWarning}
        </span>
        <div className="flex gap-1.5 justify-center">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full border border-white/20 ${
                i === 0 ? "bg-[#d4af37] border-[#d4af37]" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
