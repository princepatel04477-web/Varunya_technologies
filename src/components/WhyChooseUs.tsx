"use client";

import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useMotionConfig } from "@/context/MotionConfigContext";

const statements = [
  {
    index: "01",
    heading: "We Build For",
    headingAccent: "Business Outcomes.",
    tagline: "Our engineering is driven by metrics, not templates."
  },
  {
    index: "02",
    heading: "Not Templates.",
    headingAccent: "Digital Experiences.",
    tagline: "Custom architecture designed to capture attention and build trust."
  },
  {
    index: "03",
    heading: "Performance First.",
    headingAccent: "Animations Second.",
    tagline: "We deliver liquid-smooth fluid motion without sacrificing speed."
  },
  {
    index: "04",
    heading: "Built To Scale.",
    headingAccent: "Built To Last.",
    tagline: "Lean codebases constructed with mathematical, long-term precision."
  },
  {
    index: "05",
    heading: "Design That",
    headingAccent: "Converts.",
    tagline: "Visual narratives engineered to optimize user flow and drive actions."
  }
];

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  const { isMobile } = useMotionConfig();
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll tracking across the 400vh section height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mouse coordinate interpolation values
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const mouseXVal = useMotionValue(0);
  const mouseYVal = useMotionValue(0);

  // Listen to mouse movement and map to normalized viewport offsets
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Update active index based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let idx = 0;
      if (latest < 0.22) idx = 0;
      else if (latest < 0.42) idx = 1;
      else if (latest < 0.62) idx = 2;
      else if (latest < 0.82) idx = 3;
      else idx = 4;
      setActiveIndex(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Direct DOM manipulation of SVG filter attributes in a requestAnimationFrame loop
  // This combines scroll progress and mouse coordinates with lerp interpolation for 60fps performance
  useEffect(() => {
    let animationFrameId: number;

    const updateFilter = () => {
      // Lerp mouse coordinates
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.08;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.08;

      // Update Framer Motion values for mouse position
      mouseXVal.set(currentMouse.current.x * 25); // max 25px offset
      mouseYVal.set(currentMouse.current.y * 25);

      const latestScroll = scrollYProgress.get();

      if (turbulenceRef.current) {
        // baseFrequency moves organic-style based on scroll progress and mouse coordinates
        const freq = 0.015 + latestScroll * 0.025 + Math.abs(currentMouse.current.x) * 0.005;
        turbulenceRef.current.setAttribute("baseFrequency", freq.toString());
      }

      if (displacementRef.current) {
        // scale intensifies at higher scroll progress and during rapid mouse movements
        const scaleVal = latestScroll * 60 + (Math.abs(currentMouse.current.x) + Math.abs(currentMouse.current.y)) * 40;
        displacementRef.current.setAttribute("scale", scaleVal.toString());
      }

      animationFrameId = requestAnimationFrame(updateFilter);
    };

    animationFrameId = requestAnimationFrame(updateFilter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollYProgress, mouseXVal, mouseYVal]);

  // Layer 1 — Giant Parallax Background Typography
  const whyY = useTransform(scrollYProgress, [0, 1], ["-5vh", "-35vh"]);
  const whyX = useTransform(scrollYProgress, [0, 1], ["-5vw", "10vw"]);

  const varunyaY = useTransform(scrollYProgress, [0, 1], ["15vh", "45vh"]);
  const varunyaX = useTransform(scrollYProgress, [0, 1], ["8vw", "-12vw"]);

  const techY = useTransform(scrollYProgress, [0, 1], ["-10vh", "-40vh"]);
  const techX = useTransform(scrollYProgress, [0, 1], ["0vw", "18vw"]);

  const mouseParallaxX = useTransform(mouseXVal, (val) => `${val}px`);
  const mouseParallaxY = useTransform(mouseYVal, (val) => `${val}px`);

  // Layer 3 — Statement Scroll Mappings (hardcoded precision arrays)
  // Statement 0 (Center at 0.1)
  const op0 = useTransform(scrollYProgress, [0.0, 0.0, 0.15, 0.22], [1, 1, 1, 0]);
  const y0 = useTransform(scrollYProgress, [0.0, 0.0, 0.15, 0.22], ["0px", "0px", "0px", "-50px"]);

  // Statement 1 (Center at 0.3)
  const op1 = useTransform(scrollYProgress, [0.15, 0.22, 0.38, 0.42], [0, 1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0.15, 0.22, 0.38, 0.42], ["50px", "0px", "0px", "-50px"]);

  // Statement 2 (Center at 0.5)
  const op2 = useTransform(scrollYProgress, [0.38, 0.42, 0.58, 0.62], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.38, 0.42, 0.58, 0.62], ["50px", "0px", "0px", "-50px"]);

  // Statement 3 (Center at 0.7)
  const op3 = useTransform(scrollYProgress, [0.58, 0.62, 0.78, 0.82], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.58, 0.62, 0.78, 0.82], ["50px", "0px", "0px", "-50px"]);

  // Statement 4 (Center at 0.9)
  const op4 = useTransform(scrollYProgress, [0.78, 0.82, 1.0, 1.0], [0, 1, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.78, 0.82, 1.0, 1.0], ["50px", "0px", "0px", "0px"]);

  const statementStyles = [
    { opacity: op0, y: y0 },
    { opacity: op1, y: y1 },
    { opacity: op2, y: y2 },
    { opacity: op3, y: y3 },
    { opacity: op4, y: y4 }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#050505] z-20 select-none overflow-visible"
      style={{ minHeight: "400vh" }}
    >
      {/* Styles for the animated gradient background blobs */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-blob-1 {
          0% { transform: translate(-10%, -10%) scale(1); }
          50% { transform: translate(15%, 12%) scale(1.2); }
          100% { transform: translate(-10%, -10%) scale(1); }
        }
        @keyframes float-blob-2 {
          0% { transform: translate(8%, 15%) scale(1.1); }
          50% { transform: translate(-12%, -10%) scale(0.9); }
          100% { transform: translate(8%, 15%) scale(1.1); }
        }
        @keyframes float-blob-3 {
          0% { transform: translate(-12%, 8%) scale(0.9); }
          50% { transform: translate(12%, -12%) scale(1.15); }
          100% { transform: translate(-12%, 8%) scale(0.9); }
        }
        @keyframes float-blob-4 {
          0% { transform: translate(12%, -12%) scale(1.2); }
          50% { transform: translate(-8%, 12%) scale(0.85); }
          100% { transform: translate(12%, -12%) scale(1.2); }
        }
      `}} />

      {/* SVG Distortion Filter definitions */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="liquidFilter">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
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
            <feColorMatrix
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 18 -7
              "
            />
          </filter>
        </defs>
      </svg>

      {/* Pinned main view container */}
      <div className="sticky top-0 h-screen min-h-[100dvh] w-full overflow-hidden flex flex-col justify-center items-center">
        
        {/* ==========================================
            LAYER 2 — Liquid Distortion Background Mesh
           ========================================== */}
        <div 
          className="absolute inset-0 z-0 bg-[#050505] pointer-events-none overflow-hidden"
          style={{ filter: "url(#liquidFilter)" }}
        >
          {/* Animated gradient mesh blobs */}
          <div className="absolute -top-1/4 -left-1/4 w-[75vw] h-[75vw] rounded-full bg-[#E02020]/8 blur-[90px] pointer-events-none" style={{ animation: "float-blob-1 22s infinite ease-in-out" }} />
          <div className="absolute -bottom-1/4 -right-1/4 w-[65vw] h-[65vw] rounded-full bg-[#eae5c9]/5 blur-[100px] pointer-events-none" style={{ animation: "float-blob-2 28s infinite ease-in-out" }} />
          <div className="absolute top-1/4 right-1/4 w-[55vw] h-[55vw] rounded-full bg-[#0a1b3a]/20 blur-[80px] pointer-events-none" style={{ animation: "float-blob-3 18s infinite ease-in-out" }} />
          <div className="absolute bottom-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-[#200025]/12 blur-[110px] pointer-events-none" style={{ animation: "float-blob-4 25s infinite ease-in-out" }} />

          {/* Subtle noise texturing */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* ==========================================
            LAYER 1 — Giant Background Typography (Parallax)
           ========================================== */}
        <motion.div 
          style={{ x: mouseParallaxX, y: mouseParallaxY }}
          className="absolute inset-0 z-10 pointer-events-none select-none flex flex-col justify-between p-12 overflow-hidden"
        >
          {/* WHY */}
          <motion.div 
            style={{ x: whyX, y: whyY, fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
            className="absolute top-[18%] left-[5%] text-[14vw] sm:text-[16vw] font-black uppercase text-white/5 tracking-tighter leading-none whitespace-nowrap"
          >
            WHY
          </motion.div>

          {/* VARUNYA */}
          <motion.div 
            style={{ x: varunyaX, y: varunyaY, fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
            className="absolute top-[43%] left-[10%] text-[14vw] sm:text-[16vw] font-black uppercase text-white/5 tracking-tighter leading-none whitespace-nowrap"
          >
            VARUNYA
          </motion.div>

          {/* TECH */}
          <motion.div 
            style={{ x: techX, y: techY, fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
            className="absolute top-[68%] right-[8%] text-[14vw] sm:text-[16vw] font-black uppercase text-white/5 tracking-tighter leading-none whitespace-nowrap"
          >
            TECH
          </motion.div>
        </motion.div>

        {/* ==========================================
            LAYER 3 — Center Pinned Content Sequence
           ========================================== */}
        <div className="relative z-20 w-full max-w-4xl h-full flex items-center justify-center px-6 pointer-events-none">
          {statements.map((statement, idx) => {
            const { opacity, y } = statementStyles[idx];
            return (
              <motion.div
                key={idx}
                style={{ 
                  opacity, 
                  y,
                  pointerEvents: activeIndex === idx ? "auto" : "none"
                }}
                className="absolute inset-0 flex flex-col justify-center items-center text-center max-w-2xl mx-auto px-6"
              >
                {/* Index Number */}
                <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-[#E02020] mb-4">
                  {statement.index}
                </span>
                
                {/* Heading */}
                <h2 
                  className="text-4xl sm:text-5xl md:text-6xl text-white font-black leading-[1.15] tracking-tight mb-6"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  {statement.heading} <br className="hidden sm:inline" />
                  <span className="italic text-[#eae5c9] font-normal">{statement.headingAccent}</span>
                </h2>
                
                {/* Tagline */}
                <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] leading-relaxed max-w-md text-white/70">
                  {statement.tagline}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
