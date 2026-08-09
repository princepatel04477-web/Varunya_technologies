"use client";

import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

interface ChamberControlsProps {
  soundOn: boolean;
  setSoundOn: (sound: boolean) => void;
  activeChamber: number;
  setActiveChamber: (idx: number) => void;
  onExit: () => void;
}

export default function ChamberControls({
  soundOn,
  setSoundOn,
  activeChamber,
  setActiveChamber,
  onExit,
}: ChamberControlsProps) {
  const t = {
    exhibition: "STUDIO EXHIBITION",
    soundActive: "SOUND ON",
    soundMute: "MUTE",
    next: "NEXT CHAMBER",
    prev: "PREV CHAMBER",
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-40 select-none">
      {/* Top Header controls */}
      <div className="flex justify-between items-center w-full pointer-events-auto">
        {/* Brand Logo Link to exit/reset */}
        <button
          onClick={onExit}
          className="flex items-center gap-3 group focus:outline-none -my-8 cursor-pointer text-left"
          title="Return to Entrance"
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
              Digital Project Exhibition
            </span>
          </div>
        </button>

        <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-semibold tracking-widest">
          {/* Exit / Return to Site button */}
          <button
            onClick={onExit}
            className="text-white/40 hover:text-white transition-colors duration-300 cursor-pointer font-bold uppercase text-[9px] sm:text-[10px] tracking-widest"
          >
            <span className="sm:hidden">EXIT</span>
            <span className="hidden sm:inline">EXIT TO SITE</span>
          </button>
          <span className="text-white/10">|</span>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="flex items-center gap-2 text-[#eae6df]/50 hover:text-[#eae6df] transition-colors duration-300 group"
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

      {/* Bottom Pagination & Nav controls */}
      <div className="w-full flex justify-between items-center pointer-events-auto">
        {/* Prev button */}
        <button
          onClick={() => setActiveChamber((activeChamber - 1 + 5) % 5)}
          className="text-[9px] tracking-[0.2em] font-bold text-white/30 hover:text-[#eae6df] transition-colors duration-300"
        >
          {t.prev}
        </button>

        {/* Center Roman Numeral Indicators */}
        <div className="flex items-center gap-3 justify-center">
          {["I", "II", "III", "IV", "V"].map((num, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                onClick={() => setActiveChamber(i)}
                className={`text-[10px] tracking-widest font-bold transition-all duration-500 cursor-pointer focus:outline-none ${
                  i === activeChamber
                    ? "text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] scale-110 opacity-100"
                    : "text-white/10 hover:text-white/40 opacity-30"
                }`}
              >
                {num}
              </button>
              {i < 4 && (
                <span className="text-[6px] text-white/5 opacity-20 select-none">•</span>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => setActiveChamber((activeChamber + 1) % 5)}
          className="text-[9px] tracking-[0.2em] font-bold text-white/30 hover:text-[#eae6df] transition-colors duration-300"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
}

