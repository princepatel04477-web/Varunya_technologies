"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useMotionConfig } from "@/context/MotionConfigContext";

const GeometryEngine = dynamic(() => import("./GeometryEngine"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-white/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const WebGLDistortion = dynamic(() => import("./WebGLDistortion"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-neutral-50 flex items-center justify-center text-[10px] tracking-widest text-[#050507]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const AIOrchestration = dynamic(() => import("./AIOrchestration"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-white/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const AIToolFactory = dynamic(() => import("./AIToolFactory"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-white/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const SoftwareArchitecture = dynamic(() => import("./SoftwareArchitecture"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-white/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const ConversionFunnel = dynamic(() => import("./ConversionFunnel"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-white/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const AutomationEngine = dynamic(() => import("./AutomationEngine"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-white/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const WorkflowMap = dynamic(() => import("./WorkflowMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#26292b] flex items-center justify-center text-[10px] tracking-widest text-[#eae5c9]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const ChamberPortal = dynamic(() => import("./ChamberPortal"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-[#eae5c9]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});




interface CapabilitiesProps {
  onEnterExhibition?: () => void;
}

export default function Capabilities({ onEnterExhibition }: CapabilitiesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isChamberCtaHovered, setIsChamberCtaHovered] = useState(false);
  const { isMobile } = useMotionConfig();
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Scroll-linked tracking for Card Stacking Deck
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let index = 0;
      if (latest < 0.12) index = 0;
      else if (latest < 0.25) index = 1;
      else if (latest < 0.38) index = 2;
      else if (latest < 0.51) index = 3;
      else if (latest < 0.64) index = 4;
      else if (latest < 0.77) index = 5;
      else if (latest < 0.89) index = 6;
      else if (latest < 0.95) index = 7;
      else index = 8;
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Mouse Parallax drift for floating 3D chrome assets
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Staggered Stacking Math for 8 Capability Cards + 1 Testimonial Card (9 total)
  // Runway is increased to 900vh to accommodate the deck layout smoothly.

  // Card 1: 3D Websites (Cream Yellow) - scale/fade as Card 2 enters
  const card1Scale = useTransform(scrollYProgress, [0.05, 0.16], [1, 0.93]);
  const card1Opacity = useTransform(scrollYProgress, [0.12, 0.18], [1, 0.6]);

  // Card 2: WebGL Experience (White) - enters [0.06, 0.18], scales [0.18, 0.29], fades [0.25, 0.31]
  const card2Y = useTransform(scrollYProgress, [0.06, 0.18], ["100vh", "0vh"]);
  const card2Scale = useTransform(scrollYProgress, [0.18, 0.29], [1, 0.93]);
  const card2Opacity = useTransform(scrollYProgress, [0.25, 0.31], [1, 0.6]);

  // Card 3: AI SaaS Development (Teal-Green) - enters [0.19, 0.31], scales [0.31, 0.42], fades [0.38, 0.44]
  const card3Y = useTransform(scrollYProgress, [0.19, 0.31], ["100vh", "0vh"]);
  const card3Scale = useTransform(scrollYProgress, [0.31, 0.42], [1, 0.93]);
  const card3Opacity = useTransform(scrollYProgress, [0.38, 0.44], [1, 0.6]);

  // Card 4: AI Micro SaaS (Warm Sand) - enters [0.32, 0.44], scales [0.44, 0.55], fades [0.51, 0.57]
  const card4Y = useTransform(scrollYProgress, [0.32, 0.44], ["100vh", "0vh"]);
  const card4Scale = useTransform(scrollYProgress, [0.44, 0.55], [1, 0.93]);
  const card4Opacity = useTransform(scrollYProgress, [0.51, 0.57], [1, 0.6]);

  // Card 5: Custom Software (White) - enters [0.45, 0.57], scales [0.57, 0.68], fades [0.64, 0.70]
  const card5Y = useTransform(scrollYProgress, [0.45, 0.57], ["100vh", "0vh"]);
  const card5Scale = useTransform(scrollYProgress, [0.57, 0.68], [1, 0.93]);
  const card5Opacity = useTransform(scrollYProgress, [0.64, 0.70], [1, 0.6]);

  // Card 6: Performance Marketing (Charcoal Dark Card) - enters [0.58, 0.70], scales [0.70, 0.81], fades [0.77, 0.83]
  const card6Y = useTransform(scrollYProgress, [0.58, 0.70], ["100vh", "0vh"]);
  const card6Scale = useTransform(scrollYProgress, [0.70, 0.81], [1, 0.93]);
  const card6Opacity = useTransform(scrollYProgress, [0.77, 0.83], [1, 0.6]);

  // Card 7: AI Automation (Warm Stone) - enters [0.71, 0.83], scales [0.83, 0.92], fades [0.89, 0.94]
  const card7Y = useTransform(scrollYProgress, [0.71, 0.83], ["100vh", "0vh"]);
  const card7Scale = useTransform(scrollYProgress, [0.83, 0.92], [1, 0.93]);
  const card7Opacity = useTransform(scrollYProgress, [0.89, 0.94], [1, 0.6]);

  // Card 8: Custom Workflows (Deep Slate Metallic) - enters [0.84, 0.94], scales [0.94, 0.98], fades [0.97, 0.99]
  const card8Y = useTransform(scrollYProgress, [0.84, 0.94], ["100vh", "0vh"]);
  const card8Scale = useTransform(scrollYProgress, [0.94, 0.98], [1, 0.95]);
  const card8Opacity = useTransform(scrollYProgress, [0.97, 0.99], [1, 0.7]);

  // Card 9: Testimonial Quote (White) - enters [0.92, 0.995]
  const card9Y = useTransform(scrollYProgress, [0.92, 0.995], ["100vh", "0vh"]);

  return (
    <div 
      id="capabilities"
      ref={containerRef} 
      className="relative w-full bg-[#040404] py-0"
      style={{ height: "900vh" }} // Deep vertical scrolling track for 9 locked stacked panels
    >
      <div className="sticky top-0 h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* =========================================================================
            Atmospheric Floating 3D Chrome Assets (Parallax mouse reaction)
           ========================================================================= */}
        
        {/* Chrome Flame - Bottom Left */}
        <div 
          className="absolute left-[4%] bottom-[12%] w-[120px] h-[120px] pointer-events-none z-0 hidden lg:block"
          style={{
            transform: `translate3d(${mousePos.x * -0.7}px, ${mousePos.y * -0.7}px, 0)`,
            transition: "transform 1.2s cubic-bezier(0.1, 0.8, 0.2, 1)",
            mixBlendMode: "screen",
          }}
        >
          <Image 
            src="/images/chrome_3d_flame.png" 
            alt="3D Chrome Flame" 
            width={120} 
            height={120} 
            className="opacity-[0.35]"
          />
        </div>

        {/* Chrome Dove / Bird - Top Right */}
        <div 
          className="absolute right-[5%] top-[12%] w-[160px] h-[160px] pointer-events-none z-0 hidden lg:block"
          style={{
            transform: `translate3d(${mousePos.x * 0.9}px, ${mousePos.y * 0.9}px, 0)`,
            transition: "transform 1.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
            mixBlendMode: "screen",
          }}
        >
          <Image 
            src="/images/chrome_3d_bird.png" 
            alt="3D Chrome Dove" 
            width={160} 
            height={160} 
            className="opacity-[0.4]"
          />
        </div>

        {/* Chrome Heart - Middle Left */}
        <div 
          className="absolute left-[3%] top-[25%] w-[110px] h-[110px] pointer-events-none z-0 hidden lg:block"
          style={{
            transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * -0.5}px, 0)`,
            transition: "transform 1s cubic-bezier(0.1, 0.8, 0.2, 1)",
            mixBlendMode: "screen",
          }}
        >
          <Image 
            src="/images/chrome_3d_heart.png" 
            alt="3D Chrome Heart" 
            width={110} 
            height={110} 
            className="opacity-[0.3]"
          />
        </div>

        {/* Chrome Microphone - Lower Right */}
        <div 
          className="absolute right-[4%] bottom-[15%] w-[130px] h-[130px] pointer-events-none z-0 hidden lg:block"
          style={{
            transform: `translate3d(${mousePos.x * -0.6}px, ${mousePos.y * 0.6}px, 0)`,
            transition: "transform 1.3s cubic-bezier(0.1, 0.8, 0.2, 1)",
            mixBlendMode: "screen",
          }}
        >
          <Image 
            src="/images/chrome_3d_microphone.png" 
            alt="3D Chrome Microphone" 
            width={130} 
            height={130} 
            className="opacity-[0.3]"
          />
        </div>

        {/* Static Header Centered at the top */}
        <div className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2 text-center z-10">
          <h3 
            className="text-xs uppercase tracking-[0.45em] text-[#888893] font-bold"
            style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif", fontWeight: 400 }}
          >
            Our Capabilities
          </h3>
        </div>

        {/* =========================================================================
            Capabilities Stacking Sticky Card Deck
           ========================================================================= */}
        <div className="relative w-full max-w-5xl h-[65vh] md:h-[68vh] px-4 md:px-0 flex items-center justify-center">
          
          {/* --------------------------------------------------
              CARD 01: 3D WEBSITES (Cream Yellow)
             -------------------------------------------------- */}
          <motion.div 
            style={{ scale: card1Scale, opacity: card1Opacity }}
            className="absolute w-full h-full bg-[#eae5c9] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col md:flex-row justify-between items-stretch overflow-hidden shadow-2xl border border-white/5 origin-bottom"
          >
            <div className="flex-[1.4] flex flex-col justify-between text-[#050507] z-10">
              <div>
                <div className="flex justify-between items-center w-full">
                  <h2 
                    className="text-4xl md:text-[3.25rem] font-normal leading-[1.05] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    3D Websites
                  </h2>
                  <span className="font-mono text-sm tracking-widest font-semibold opacity-70">01</span>
                </div>
                <h4 
                  className="text-base md:text-lg font-light leading-snug mt-4 opacity-90 max-w-lg"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Step into spatial web narratives.
                </h4>
              </div>

              <div className="mt-8 md:mt-0 max-w-lg">
                <p 
                  className="text-xs md:text-sm leading-relaxed opacity-75 font-light"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  We design and build gorgeous three-dimensional web spaces that combine physical realism, elegant transitions, and spatial depth, allowing users to interact with your physical products natively in the browser.
                </p>
              </div>
            </div>

            {/* Card Right Portrait Graphic Block - Redesigned into Geometry Engine */}
            {(!isMobile || activeIndex === 0) && (
              <div className="flex flex-1 mt-4 md:mt-0 md:ml-10 rounded-xl bg-[#050507] border border-white/10 relative overflow-hidden flex-col justify-between p-4 md:p-6 h-[22vh] md:h-auto md:min-h-[300px]">
                {/* Header Info */}
                <div className="w-full flex justify-between items-start z-20">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/50" style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}>Geometry Engine</span>
                    <span className="text-xs font-mono font-bold text-white">Active Mesh</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mt-1" />
                </div>

                {/* 3D Render Area */}
                <div className="absolute inset-0 z-10 w-full h-full pt-16">
                  <GeometryEngine />
                </div>
              </div>
            )}
          </motion.div>

          {/* --------------------------------------------------
              CARD 02: WEBGL EXPERIENCE (White bg)
             -------------------------------------------------- */}
          <motion.div 
            style={{ y: card2Y, scale: card2Scale, opacity: card2Opacity }}
            className="absolute w-full h-full bg-[#ffffff] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col md:flex-row justify-between items-stretch overflow-hidden shadow-2xl border border-white/5 origin-bottom"
          >
            <div className="flex-[1.4] flex flex-col justify-between text-[#050507] z-10">
              <div>
                <div className="flex justify-between items-center w-full">
                  <h2 
                    className="text-4xl md:text-[3.25rem] font-normal leading-[1.05] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    WebGL Experience
                  </h2>
                  <span className="font-mono text-sm tracking-widest font-semibold opacity-70">02</span>
                </div>
                <h4 
                  className="text-base md:text-lg font-light leading-snug mt-4 opacity-90 max-w-lg"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  High-performance shader graphics at 60 FPS.
                </h4>
              </div>

              <div className="mt-8 md:mt-0 max-w-lg">
                <p 
                  className="text-xs md:text-sm leading-relaxed opacity-75 font-light"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Choreographed creative applications powered by custom Fragment and Vertex shaders. We build interactive WebGL storytelling spaces that operate flawlessly on mobile, tablet, and high-DPI desktop environments.
                </p>
              </div>
            </div>

            {/* Card Right Portrait Graphic Block - WebGL Fluid Simulation */}
            {(!isMobile || activeIndex === 1) && (
              <div className="flex flex-1 mt-4 md:mt-0 md:ml-10 rounded-xl bg-[#050507] border border-white/10 relative overflow-hidden h-[22vh] md:h-auto md:min-h-[300px]">
                <WebGLDistortion />
              </div>
            )}
          </motion.div>

          {/* --------------------------------------------------
              CARD 03: AI SAAS DEVELOPMENT (Teal-green bg)
             -------------------------------------------------- */}
          <motion.div 
            style={{ y: card3Y, scale: card3Scale, opacity: card3Opacity }}
            className="absolute w-full h-full bg-[#3da58a] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col md:flex-row justify-between items-stretch overflow-hidden shadow-2xl border border-white/5 origin-bottom"
          >
            <div className="flex-[1.4] flex flex-col justify-between text-[#050507] z-10">
              <div>
                <div className="flex justify-between items-center w-full">
                  <h2 
                    className="text-4xl md:text-[3.25rem] font-normal leading-[1.05] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    AI SaaS Development
                  </h2>
                  <span className="font-mono text-sm tracking-widest font-semibold opacity-70">03</span>
                </div>
                <h4 
                  className="text-base md:text-lg font-light leading-snug mt-4 opacity-90 max-w-lg"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Agentic pipelines engineered for scale.
                </h4>
              </div>

              <div className="mt-8 md:mt-0 max-w-lg">
                <p 
                  className="text-xs md:text-sm leading-relaxed opacity-75 font-light"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Robust agentic pipelines engineered for scalable digital products. We develop secure AI SaaS applications complete with semantic vector indexing, postgres embeddings, multi-model orchestrators, and automated agent pools.
                </p>
              </div>
            </div>

            {/* Card Right Portrait Graphic Block - AI Orchestration */}
            {(!isMobile || activeIndex === 2) && (
              <div className="flex flex-1 mt-4 md:mt-0 md:ml-10 rounded-xl bg-[#050507] border border-white/10 relative overflow-hidden h-[22vh] md:h-auto md:min-h-[300px]">
                <AIOrchestration />
                {/* Unified System Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6 pointer-events-none text-[#eae5c9]">
                  <div>
                    <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
                      AGENT ORCHESTRATOR
                    </span>
                    <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
                      Multi-Agent Network Online
                    </div>
                  </div>



                  <div className="w-full flex flex-col gap-1.5">
                    <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-[45%] bg-[#eae5c9]/35 animate-pulse" />
                    </div>
                    <span className="font-mono text-[8px] tracking-widest opacity-40 uppercase">
                      Agent Coordination Stable
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* --------------------------------------------------
              CARD 04: AI MICRO SAAS (Warm Sand/Clay bg)
             -------------------------------------------------- */}
          <motion.div 
            style={{ y: card4Y, scale: card4Scale, opacity: card4Opacity }}
            className="absolute w-full h-full bg-[#dfdbd4] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col md:flex-row justify-between items-stretch overflow-hidden shadow-2xl border border-white/5 origin-bottom"
          >
            <div className="flex-[1.4] flex flex-col justify-between text-[#050507] z-10">
              <div>
                <div className="flex justify-between items-center w-full">
                  <h2 
                    className="text-4xl md:text-[3.25rem] font-normal leading-[1.05] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    AI Micro SaaS
                  </h2>
                  <span className="font-mono text-sm tracking-widest font-semibold opacity-70">04</span>
                </div>
                <h4 
                  className="text-base md:text-lg font-light leading-snug mt-4 opacity-90 max-w-lg"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Lightweight, highly optimized AI tools.
                </h4>
              </div>

              <div className="mt-8 md:mt-0 max-w-lg">
                <p 
                  className="text-xs md:text-sm leading-relaxed opacity-75 font-light"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Fast-to-market AI micro-services, secure browser extensions, and niche API applications engineered to solve singular vertical problems with absolute efficiency, minimal overhead, and massive performance.
                </p>
              </div>
            </div>

            {/* Card Right Portrait Graphic Block - AI Tool Factory */}
            {(!isMobile || activeIndex === 3) && (
              <div className="flex flex-1 mt-4 md:mt-0 md:ml-10 rounded-xl bg-[#050507] border border-white/10 relative overflow-hidden h-[22vh] md:h-auto md:min-h-[300px]">
                <AIToolFactory />
                {/* Unified System Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6 pointer-events-none text-[#eae5c9]">
                  <div>
                    <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
                      PRODUCT ECOSYSTEM
                    </span>
                    <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
                      Micro Products Active
                    </div>
                  </div>



                  <div className="w-full flex flex-col gap-1.5">
                    <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-[45%] bg-[#eae5c9]/35 animate-pulse" />
                    </div>
                    <span className="font-mono text-[8px] tracking-widest opacity-40 uppercase">
                      Product Network Expanding
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* --------------------------------------------------
              CARD 05: CUSTOM SOFTWARE (White bg)
             -------------------------------------------------- */}
          <motion.div 
            style={{ y: card5Y, scale: card5Scale, opacity: card5Opacity }}
            className="absolute w-full h-full bg-[#ffffff] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col md:flex-row justify-between items-stretch overflow-hidden shadow-2xl border border-white/5 origin-bottom"
          >
            <div className="flex-[1.4] flex flex-col justify-between text-[#050507] z-10">
              <div>
                <div className="flex justify-between items-center w-full">
                  <h2 
                    className="text-4xl md:text-[3.25rem] font-normal leading-[1.05] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    Custom Software
                  </h2>
                  <span className="font-mono text-sm tracking-widest font-semibold opacity-70">05</span>
                </div>
                <h4 
                  className="text-base md:text-lg font-light leading-snug mt-4 opacity-90 max-w-lg"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Rigorous system architectures.
                </h4>
              </div>

              <div className="mt-8 md:mt-0 max-w-lg">
                <p 
                  className="text-xs md:text-sm leading-relaxed opacity-75 font-light"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  High-performance custom software systems designed for reliability and speed. From secure REST/gRPC architectures, low-latency API layers, and secure cloud environments to specialized desktop-and-spatial tools.
                </p>
              </div>
            </div>

            {/* Card Right Portrait Graphic Block - Custom Software Architecture */}
            {(!isMobile || activeIndex === 4) && (
              <div className="flex flex-1 mt-4 md:mt-0 md:ml-10 rounded-xl bg-[#050507] border border-white/10 relative overflow-hidden h-[22vh] md:h-auto md:min-h-[300px]">
                <SoftwareArchitecture />
                {/* Unified System Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6 pointer-events-none text-[#eae5c9]">
                  <div>
                    <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
                      SYSTEM ARCHITECTURE
                    </span>
                    <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
                      Blueprint Engine Loaded
                  </div>
                </div>



                <div className="w-full flex flex-col gap-1.5">
                  <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-[45%] bg-[#eae5c9]/35 animate-pulse" />
                  </div>
                  <span className="font-mono text-[8px] tracking-widest opacity-40 uppercase">
                    Architecture Integrity Stable
                  </span>
                </div>
              </div>
            </div>
            )}
          </motion.div>

          {/* --------------------------------------------------
              CARD 06: PERFORMANCE MARKETING (Dark Charcoal)
             -------------------------------------------------- */}
          <motion.div 
            style={{ y: card6Y, scale: card6Scale, opacity: card6Opacity }}
            className="absolute w-full h-full bg-[#141415] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col md:flex-row justify-between items-stretch overflow-hidden shadow-2xl border border-white/5 origin-bottom"
          >
            <div className="flex-[1.4] flex flex-col justify-between text-[#eae5c9] z-10">
              <div>
                <div className="flex justify-between items-center w-full">
                  <h2 
                    className="text-4xl md:text-[3.25rem] font-normal leading-[1.05] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    Performance Marketing
                  </h2>
                  <span className="font-mono text-sm tracking-widest font-semibold opacity-70 text-white">06</span>
                </div>
                <h4 
                  className="text-base md:text-lg font-light leading-snug mt-4 opacity-90 max-w-lg"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Metric-driven conversion performance.
                </h4>
              </div>

              <div className="mt-8 md:mt-0 max-w-lg">
                <p 
                  className="text-xs md:text-sm leading-relaxed opacity-75 font-light"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  We scale modern digital brands through data-backed performance campaigns, conversion rate optimization (CRO), high-fidelity programmatic landing pages, and advanced search engine optimization (SEO) networks.
                </p>
              </div>
            </div>

            {/* Card Right Portrait Graphic Block - Conversion Funnel */}
            {(!isMobile || activeIndex === 5) && (
              <div className="flex flex-1 mt-4 md:mt-0 md:ml-10 rounded-xl bg-[#050507] border border-white/10 relative overflow-hidden h-[22vh] md:h-auto md:min-h-[300px]">
                <ConversionFunnel />
                {/* Unified System Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6 pointer-events-none text-[#eae5c9]">
                  <div>
                    <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
                      GROWTH ENGINE
                    </span>
                    <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
                      Conversion Signals Flowing
                    </div>
                  </div>



                  <div className="w-full flex flex-col gap-1.5">
                    <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-[45%] bg-[#eae5c9]/35 animate-pulse" />
                    </div>
                    <span className="font-mono text-[8px] tracking-widest opacity-40 uppercase">
                      Growth Momentum Increasing
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* --------------------------------------------------
              CARD 07: AI AUTOMATION (Warm Stone) - RESTORED
             -------------------------------------------------- */}
          <motion.div 
            style={{ y: card7Y, scale: card7Scale, opacity: card7Opacity }}
            className="absolute w-full h-full bg-[#eae0d5] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col md:flex-row justify-between items-stretch overflow-hidden shadow-2xl border border-white/5 origin-bottom"
          >
            <div className="flex-[1.4] flex flex-col justify-between text-[#050507] z-10">
              <div>
                <div className="flex justify-between items-center w-full">
                  <h2 
                    className="text-4xl md:text-[3.25rem] font-normal leading-[1.05] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    AI Automation
                  </h2>
                  <span className="font-mono text-sm tracking-widest font-semibold opacity-70">07</span>
                </div>
                <h4 
                  className="text-base md:text-lg font-light leading-snug mt-4 opacity-90 max-w-lg"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Intelligent autonomous operations.
                </h4>
              </div>

              <div className="mt-8 md:mt-0 max-w-lg">
                <p 
                  className="text-xs md:text-sm leading-relaxed opacity-75 font-light"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  We engineer autonomous agents and cognitive systems that automate complex corporate operations, from dynamic content pipelines to self-optimizing database tasks, slashing operational latency.
                </p>
              </div>
            </div>

            {/* Card Right Portrait Graphic Block - Automation Engine */}
            {(!isMobile || activeIndex === 6) && (
              <div className="flex flex-1 mt-4 md:mt-0 md:ml-10 rounded-xl bg-[#050507] border border-white/10 relative overflow-hidden h-[22vh] md:h-auto md:min-h-[300px]">
                <AutomationEngine />
                {/* Unified System Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6 pointer-events-none text-[#eae5c9]">
                  <div>
                    <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
                      AUTONOMOUS EXECUTION
                    </span>
                    <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
                      Workflow Engine Running
                    </div>
                  </div>



                  <div className="w-full flex flex-col gap-1.5">
                    <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-[45%] bg-[#eae5c9]/35 animate-pulse" />
                    </div>
                    <span className="font-mono text-[8px] tracking-widest opacity-40 uppercase">
                      Operational Latency Reduced
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* --------------------------------------------------
              CARD 08: CUSTOM WORKFLOWS (Deep Slate Metallic) - RESTORED
             -------------------------------------------------- */}
          <motion.div 
            style={{ y: card8Y, scale: card8Scale, opacity: card8Opacity }}
            className="absolute w-full h-full bg-[#26292b] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col md:flex-row justify-between items-stretch overflow-hidden shadow-2xl border border-white/5 origin-bottom"
          >
            <div className="flex-[1.4] flex flex-col justify-between text-[#eae5c9] z-10">
              <div>
                <div className="flex justify-between items-center w-full">
                  <h2 
                    className="text-4xl md:text-[3.25rem] font-normal leading-[1.05] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    Custom Workflows
                  </h2>
                  <span className="font-mono text-sm tracking-widest font-semibold opacity-70 text-white">08</span>
                </div>
                <h4 
                  className="text-base md:text-lg font-light leading-snug mt-4 opacity-90 max-w-lg"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Choreographed business logic.
                </h4>
              </div>

              <div className="mt-8 md:mt-0 max-w-lg">
                <p 
                  className="text-xs md:text-sm leading-relaxed opacity-75 font-light"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Architecting bespoke digital pathways that connect your legacy databases, modern APIs, and proprietary AI agents. We construct fluid, high-throughput workflows that orchestrate complex systems flawlessly.
                </p>
              </div>
            </div>

            {/* Card Right Portrait Graphic Block - Workflow Map */}
            {(!isMobile || activeIndex === 7) && (
              <div className="flex flex-1 mt-4 md:mt-0 md:ml-10 rounded-xl bg-[#26292b] border border-white/10 relative overflow-hidden h-[22vh] md:h-auto md:min-h-[300px]">
                <WorkflowMap />
                {/* Unified System Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 md:p-6 pointer-events-none text-[#eae5c9]">
                  <div>
                    <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
                      BUSINESS CHOREOGRAPHY
                    </span>
                    <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
                      Workflow Synchronization Active
                    </div>
                  </div>



                  <div className="w-full flex flex-col gap-1.5">
                    <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-[45%] bg-[#eae5c9]/35 animate-pulse" />
                    </div>
                    <span className="font-mono text-[8px] tracking-widest opacity-40 uppercase">
                      Pipeline Harmony Maintained
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* --------------------------------------------------
              CARD 09: CLIENT SHOWCASE (Dark bg) - living portal experience
             -------------------------------------------------- */}
          <motion.div 
            style={{ y: card9Y }}
            className="absolute w-full h-full bg-[#050507] rounded-2xl md:rounded-3xl p-6 md:p-14 flex flex-col md:flex-row justify-between items-stretch overflow-hidden shadow-2xl border border-white/10 origin-bottom text-[#eae5c9]"
          >
            <div className="flex-[1.2] flex flex-col justify-between text-[#eae5c9] z-10">
              <div>
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span 
                      className="text-[10px] tracking-[0.25em] text-[#eae5c9]/60 font-bold uppercase"
                      style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif", fontWeight: 400 }}
                    >
                      Interactive Showcase
                    </span>
                    <span className="font-mono text-xs text-[#eae5c9]/50 mt-1">WebGL 3D Experience</span>
                  </div>
                  <span className="font-mono text-sm tracking-widest font-semibold opacity-70 text-[#eae5c9]/60">09</span>
                </div>

                <div className="mt-8 md:mt-12">
                  <h2 
                    className="text-4xl md:text-[3.5rem] font-normal leading-[1.05] tracking-[-0.01em] text-[#eae5c9] mb-4"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    Project Chamber
                  </h2>
                  <p 
                    className="text-base md:text-lg font-light leading-relaxed text-[#eae5c9]/80 max-w-lg mt-6"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    Step into our hardware-accelerated 3D museum. Walk through spatial case studies, dynamic agent interactions, and custom user interface systems designed for high-performance impact.
                  </p>
                </div>
              </div>

              <div className="mt-8 md:mt-0 flex justify-between items-center border-t border-white/10 pt-6">
                <button 
                  onClick={onEnterExhibition}
                  onMouseEnter={() => setIsChamberCtaHovered(true)}
                  onMouseLeave={() => setIsChamberCtaHovered(false)}
                  className="px-6 py-3 bg-[#eae5c9] text-[#050507] text-xs font-semibold rounded-lg flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif", fontWeight: 400 }}
                >
                  Open Exhibition Chamber
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </button>
              </div>
            </div>

            {/* Card Right Portrait Graphic Block - Living Portal */}
            {(!isMobile || activeIndex === 8) && (
              <div className="flex flex-1 mt-4 md:mt-0 md:ml-10 rounded-xl bg-[#050507] border border-white/10 relative overflow-hidden h-[22vh] md:h-auto md:min-h-[300px]">
                <ChamberPortal isHovered={isChamberCtaHovered} />
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
