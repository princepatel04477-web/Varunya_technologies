"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const GREETINGS = [
  { threshold: 0, text: "Hello" },
  { threshold: 7, text: "नमस्ते" },
  { threshold: 14, text: "કેમ છો" },
  { threshold: 21, text: "खम्मा घणी" },
  { threshold: 28, text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
  { threshold: 35, text: "नमस्कार" },
  { threshold: 42, text: "নমস্কার" },
  { threshold: 49, text: "ନମସ୍କାର" },
  { threshold: 56, text: "নমস্কাৰ" },
  { threshold: 63, text: "నమస్కారం" },
  { threshold: 70, text: "ನಮಸ್ಕಾರ" },
  { threshold: 77, text: "வணக்கம்" },
  { threshold: 84, text: "നമസ്കാരം" },
  { threshold: 100, text: "स्वागत है" },
];

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Use a ref to track display progress in requestAnimationFrame to prevent state closures
  const progressRef = useRef(0);

  useEffect(() => {
    // If loader was already shown in this session, skip the animation
    if (sessionStorage.getItem("vt_loader_shown")) {
      setShouldRender(false);
      onComplete();
      return;
    }

    // Ensure scroll lock is active
    document.documentElement.classList.add("loading");
    document.body.classList.add("loading");

    const startTime = performance.now();
    let animationFrameId: number;

    let fontsLoaded = false;
    
    // Safe check for document.fonts presence on mobile browsers
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready
        .then(() => {
          fontsLoaded = true;
        })
        .catch(() => {
          fontsLoaded = true; // Fallback so loading is never blocked
        });
    } else {
      fontsLoaded = true;
    }

    const updateProgress = () => {
      const now = performance.now();
      const elapsed = now - startTime;

      // Enforce a minimum preloader duration of 5200ms to allow greetings to be readable
      const minDuration = 5200;
      const timeProgress = Math.min((elapsed / minDuration) * 100, 100);

      // Real Asset Progress
      let imageProgress = 100;
      const imgs = Array.from(document.images);
      if (imgs.length > 0) {
        imagesComplete = imgs.every((img) => img.complete);
      }
      var imagesComplete = true; // Fallback helper

      const docReady = document.readyState === "complete";
      
      // Safe check for document.fonts status
      let fontsReady = fontsLoaded;
      if (typeof document !== "undefined" && document.fonts) {
        fontsReady = document.fonts.status === "loaded" || fontsLoaded;
      }

      // Assets are fully ready if everything is loaded OR we hit the 6000ms safety limit
      const assetsReady = (imagesComplete && docReady && fontsReady) || elapsed >= 6000;

      let targetProgress = 0;
      if (assetsReady) {
        // Smoothly scale to 100% over minimum 5200ms
        targetProgress = Math.min((elapsed / minDuration) * 100, 100);
      } else {
        // Creep slowly up to 95% if assets are not fully ready yet
        targetProgress = Math.min((elapsed / 6000) * 95, 95);
      }

      // Smooth interpolation (lerp speed of 0.035 to feel premium and cinematic)
      const lerpSpeed = 0.035;
      const nextProgress = progressRef.current + (targetProgress - progressRef.current) * lerpSpeed;

      let finalNext = Math.min(nextProgress, 100);
      
      // Snap to 100 when target is reached and we are very close
      if (targetProgress >= 100 && 100 - finalNext < 0.2) {
        finalNext = 100;
      }

      progressRef.current = finalNext;
      setDisplayProgress(finalNext);

      if (finalNext < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  // Handle final state pause and exit animation
  useEffect(() => {
    if (displayProgress === 100) {
      // Pause for 800ms at 100% to let the user absorb the final greeting
      const exitTimer = setTimeout(() => {
        setIsExiting(true);

        // Slide upward and reveal website (takes 1200ms)
        const finalTimer = setTimeout(() => {
          sessionStorage.setItem("vt_loader_shown", "true");
          document.documentElement.classList.remove("loading");
          document.body.classList.remove("loading");
          onComplete();
          setShouldRender(false);
        }, 1200);

        return () => clearTimeout(finalTimer);
      }, 800);

      return () => clearTimeout(exitTimer);
    }
  }, [displayProgress, onComplete]);

  if (!shouldRender) return null;

  // Determine current active greeting text based on thresholds
  const activeGreeting = GREETINGS.reduce((acc, curr) => {
    if (displayProgress >= curr.threshold) {
      return curr;
    }
    return acc;
  }, GREETINGS[0]).text;

  const roundedPercent = Math.floor(displayProgress);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={isExiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 w-screen h-screen z-[999999] overflow-hidden select-none pointer-events-auto bg-black flex items-center justify-center"
      style={{
        background: "#000000",
      }}
    >
      {/* Balanced layout container with a premium fixed-height column spacing */}
      <div className="flex flex-col items-center justify-between h-[360px] md:h-[420px] w-full max-w-md px-6">
        
        {/* Logo Element with breathing scale, transitions to 1.08 on exit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={
            isExiting
              ? { scale: 1.08, opacity: 0 }
              : { scale: [1, 1.03, 1], opacity: 1 }
          }
          transition={
            isExiting
              ? { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
              : {
                  scale: { duration: 4, ease: "easeInOut", repeat: Infinity },
                  opacity: { duration: 0.5, ease: "easeOut" },
                }
          }
          className="flex justify-center items-center"
        >
          <Image
            src="/VT_logo.png"
            alt="Varunya Technologies"
            width={240}
            height={240}
            className="w-[180px] md:w-[220px] lg:w-[240px] h-auto object-contain"
            priority
          />
        </motion.div>

        {/* Floating Greeting Text block */}
        <div className="h-16 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {!isExiting && (
              <motion.span
                key={activeGreeting}
                variants={{
                  initial: { opacity: 0, y: 10, filter: "blur(3px)" },
                  animate: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                  },
                  exit: {
                    opacity: 0,
                    y: -10,
                    filter: "blur(3px)",
                    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                  }
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-white text-center font-medium tracking-wide font-sans"
                style={{
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  letterSpacing: "0.02em",
                }}
              >
                {activeGreeting}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Percentage & Progress Bar Block */}
        <div className="flex flex-col items-center gap-y-6">
          <motion.div
            animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-white font-bold leading-none font-mono tracking-tighter"
            style={{
              fontSize: "clamp(48px, 8vw, 72px)", // Premium, more balanced percentage typography size
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {roundedPercent.toString().padStart(2, "0")}%
          </motion.div>

          {/* Progress bar track & scaling fill */}
          <motion.div
            animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[1px] bg-white/15"
            style={{ width: "240px" }}
          >
            <div
              className="h-full bg-white origin-left"
              style={{
                transform: `scaleX(${displayProgress / 100})`,
                transition: "transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
