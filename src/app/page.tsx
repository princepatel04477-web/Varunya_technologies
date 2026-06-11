"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import ChamberIntro from "@/components/ChamberIntro";
import ChamberShowcase from "@/components/ChamberShowcase";
import ChamberControls from "@/components/ChamberControls";
import ChamberCanvas from "@/components/ChamberCanvas";
import { AmbientSynth } from "@/utils/ambientSynth";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import LazySection from "@/components/LazySection";

// Dynamically load heavy components below the fold
const Statement = dynamic(() => import("@/components/Statement"), { ssr: false });
const Capabilities = dynamic(() => import("@/components/Capabilities"), { ssr: false });
const TechMap = dynamic(() => import("@/components/TechMap"), { ssr: false });
const Process = dynamic(() => import("@/components/Process"), { ssr: false });
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function Home() {
  const [exhibitionMode, setExhibitionMode] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [activeChamber, setActiveChamber] = useState(0);
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [soundOn, setSoundOn] = useState(false);
  const [loaderFinished, setLoaderFinished] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("vt_loader_shown")) {
      setLoaderFinished(true);
    }
  }, []);

  const synthRef = useRef<AmbientSynth | null>(null);

  // Initialize synth ref
  useEffect(() => {
    synthRef.current = new AmbientSynth();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Sync sound playback with state
  useEffect(() => {
    if (!synthRef.current) return;
    if (exhibitionMode && isEntered && soundOn) {
      synthRef.current.start();
    } else {
      synthRef.current.stop();
    }
  }, [exhibitionMode, isEntered, soundOn]);

  // Sync URL hash with exhibition mode
  useEffect(() => {
    const handleHashChange = () => {
      if (
        window.location.hash === "#3d" ||
        window.location.hash === "#exhibit" ||
        window.location.hash === "#exhibition"
      ) {
        setExhibitionMode(true);
      }
    };

    // Check on mount
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleEnter = () => {
    setIsEntered(true);
    if (soundOn && synthRef.current) {
      synthRef.current.start();
    }
  };

  const handleExit = () => {
    setIsEntered(false);
    setActiveChamber(0);
    setExhibitionMode(false);
    // Remove the hash
    if (
      window.location.hash === "#3d" ||
      window.location.hash === "#exhibit" ||
      window.location.hash === "#exhibition"
    ) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  // Capture vertical mouse wheel scroll to snap chambers, implementing scroll lock.
  useEffect(() => {
    if (!exhibitionMode || !isEntered) return;

    let lastScrollTime = Date.now();
    const scrollCooldown = 1100; // Perfect throttle timing to allow current chamber animation to exit and fade fully

    const handleWheel = (e: WheelEvent) => {
      // Prevent standard browser scrolling behavior
      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;

      // Ensure that we only register intentional, deliberate scrolls (ignore tiny trackpad jitter)
      if (Math.abs(e.deltaY) < 15) return;

      if (e.deltaY > 0) {
        // Scroll down
        if (activeChamber < 3) {
          setActiveChamber((prev) => prev + 1);
          lastScrollTime = now;
        } else {
          // Reached final chamber: Scroll down to exit exhibition and transition to Contact form section on landing page
          handleExit();
          setTimeout(() => {
            const contactSection = document.getElementById("contact");
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
          lastScrollTime = now;
        }
      } else if (e.deltaY < 0) {
        // Scroll up
        if (activeChamber > 0) {
          setActiveChamber((prev) => prev - 1);
          lastScrollTime = now;
        } else {
          // Reached first chamber: Scroll up to exit exhibition and transition back to Hero header on landing page
          handleExit();
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 100);
          lastScrollTime = now;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [exhibitionMode, isEntered, activeChamber]);

  const enterExhibition = () => {
    setExhibitionMode(true);
    window.location.hash = "3d";
  };

  if (!exhibitionMode) {
    return (
      <SmoothScroll>
        <div className="bg-[#050507] text-[#eae6df] font-sans antialiased selection:bg-white/10 selection:text-white">
          <Loader onComplete={() => setLoaderFinished(true)} />
          <Navbar />
          <Hero onEnterExhibition={enterExhibition} loaderFinished={loaderFinished} />
          <main>
            <LazySection>
              <Statement />
            </LazySection>
            <LazySection>
              <Capabilities onEnterExhibition={enterExhibition} />
            </LazySection>
            <LazySection>
              <TechMap />
            </LazySection>
            <LazySection>
              <Process />
            </LazySection>
            <LazySection>
              <WhyChooseUs />
            </LazySection>
            <LazySection>
              <Contact />
            </LazySection>
          </main>
          <LazySection>
            <Footer />
          </LazySection>
        </div>
      </SmoothScroll>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#eae6df] font-sans antialiased overflow-hidden">
      {/* Dynamic Background Canvas */}
      <ChamberCanvas activeChamber={isEntered ? activeChamber : 0} />

      <AnimatePresence mode="wait">
        {!isEntered ? (
          <ChamberIntro
            key="intro"
            language={language}
            setLanguage={setLanguage}
            soundOn={soundOn}
            setSoundOn={setSoundOn}
            onEnter={handleEnter}
            onClose={handleExit}
          />
        ) : (
          <div key="exhibition" className="relative min-h-screen w-full flex flex-col justify-between">
            {/* Header, Footer, and Pagination Controls */}
            <ChamberControls
              language={language}
              setLanguage={setLanguage}
              soundOn={soundOn}
              setSoundOn={setSoundOn}
              activeChamber={activeChamber}
              setActiveChamber={setActiveChamber}
              onExit={handleExit}
            />

            {/* Chamber Exhibition Content */}
            <ChamberShowcase
              activeChamber={activeChamber}
              language={language}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

