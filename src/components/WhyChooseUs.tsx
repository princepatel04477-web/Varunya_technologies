"use client";

import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const statements = [
  { index: "01", heading: "We Build For Business Outcomes" },
  { index: "02", heading: "Not Templates. Digital Experiences." },
  { index: "03", heading: "Performance First. Animations Second." },
  { index: "04", heading: "Built To Scale. Built To Last." },
  { index: "05", heading: "Design That Converts." }
];

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll timeline over 500vh height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Mouse coordinate interpolation values
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const mouseXVal = useMotionValue(0);
  const mouseYVal = useMotionValue(0);

  // Track mouse coordinates normalized between -0.5 and 0.5
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

  // Update active index based on scroll timeline divisions:
  // 0% -> 20% Msg 1 (idx: 0)
  // 20% -> 40% Msg 2 (idx: 1)
  // 40% -> 60% Msg 3 (idx: 2)
  // 60% -> 80% Msg 4 (idx: 3)
  // 80% -> 100% Msg 5 (idx: 4)
  useEffect(() => {
    // Read and set the initial position on mount
    const currentScroll = scrollYProgress.get();
    let initialIdx = 0;
    if (currentScroll < 0.20) initialIdx = 0;
    else if (currentScroll < 0.40) initialIdx = 1;
    else if (currentScroll < 0.60) initialIdx = 2;
    else if (currentScroll < 0.80) initialIdx = 3;
    else initialIdx = 4;
    setActiveIndex(initialIdx);

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let idx = 0;
      if (latest < 0.20) idx = 0;
      else if (latest < 0.40) idx = 1;
      else if (latest < 0.60) idx = 2;
      else if (latest < 0.80) idx = 3;
      else idx = 4;
      setActiveIndex(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // requestAnimationFrame loop to directly animate SVG filter attributes and update mouse position
  useEffect(() => {
    let animationFrameId: number;

    const updateFilter = () => {
      // Smooth lerp on mouse coords
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.08;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.08;

      mouseXVal.set(currentMouse.current.x * 20); // max 20px offset
      mouseYVal.set(currentMouse.current.y * 20);

      const latestScroll = scrollYProgress.get();

      if (turbulenceRef.current) {
        const freq = 0.015 + latestScroll * 0.02 + Math.abs(currentMouse.current.x) * 0.005;
        turbulenceRef.current.setAttribute("baseFrequency", freq.toString());
      }

      if (displacementRef.current) {
        const scaleVal = latestScroll * 45 + (Math.abs(currentMouse.current.x) + Math.abs(currentMouse.current.y)) * 25;
        displacementRef.current.setAttribute("scale", scaleVal.toString());
      }

      animationFrameId = requestAnimationFrame(updateFilter);
    };

    animationFrameId = requestAnimationFrame(updateFilter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollYProgress, mouseXVal, mouseYVal]);

  // Layer 1 Parallax (Wordmark shifts independently and slower than foreground)
  const whyY = useTransform(scrollYProgress, [0, 1], ["0vh", "-20vh"]);
  const whyX = useTransform(scrollYProgress, [0, 1], ["-2vw", "6vw"]);

  const varunyaY = useTransform(scrollYProgress, [0, 1], ["5vh", "25vh"]);
  const varunyaX = useTransform(scrollYProgress, [0, 1], ["3vw", "-6vw"]);

  const techY = useTransform(scrollYProgress, [0, 1], ["-5vh", "-25vh"]);
  const techX = useTransform(scrollYProgress, [0, 1], ["0vw", "10vw"]);

  const mouseParallaxX = useTransform(mouseXVal, (val) => `${val}px`);
  const mouseParallaxY = useTransform(mouseYVal, (val) => `${val}px`);

  return (
    <section className="why-cinematic relative w-full bg-[#050505] z-20 select-none overflow-visible h-[500vh]">
      
      {/* Styles for organic liquid blobs */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-mesh-1 {
          0% { transform: translate(-5%, -5%) scale(1); }
          50% { transform: translate(10%, 8%) scale(1.15); }
          100% { transform: translate(-5%, -5%) scale(1); }
        }
        @keyframes float-mesh-2 {
          0% { transform: translate(5%, 10%) scale(1.1); }
          50% { transform: translate(-10%, -8%) scale(0.9); }
          100% { transform: translate(5%, 10%) scale(1.1); }
        }
        @keyframes float-mesh-3 {
          0% { transform: translate(-10%, 5%) scale(0.9); }
          50% { transform: translate(8%, -10%) scale(1.12); }
          100% { transform: translate(-10%, 5%) scale(0.9); }
        }
        @keyframes float-mesh-4 {
          0% { transform: translate(10%, -10%) scale(1.15); }
          50% { transform: translate(-5%, 8%) scale(0.88); }
          100% { transform: translate(10%, -10%) scale(1.15); }
        }
      `}} />

      <div className="sticky-wrapper sticky top-0 h-screen min-h-[100dvh] w-full overflow-hidden flex flex-col justify-center items-center">
        
        {/* ==========================================
            BACKGROUND LAYER (Color & Gradients & Grid)
           ========================================== */}
        <div className="absolute inset-0 bg-[#050505] z-[1] pointer-events-none overflow-hidden">
          {/* Shifting mesh blobs */}
          <div className="absolute -top-1/4 -left-1/4 w-[75vw] h-[75vw] rounded-full bg-[#E02020]/6 blur-[100px] pointer-events-none" style={{ animation: "float-mesh-1 24s infinite ease-in-out" }} />
          <div className="absolute -bottom-1/4 -right-1/4 w-[65vw] h-[65vw] rounded-full bg-[#eae5c9]/4 blur-[110px] pointer-events-none" style={{ animation: "float-mesh-2 29s infinite ease-in-out" }} />
          <div className="absolute top-1/4 right-1/4 w-[55vw] h-[55vw] rounded-full bg-[#0a1b3a]/15 blur-[90px] pointer-events-none" style={{ animation: "float-mesh-3 20s infinite ease-in-out" }} />
          <div className="absolute bottom-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-[#200025]/10 blur-[120px] pointer-events-none" style={{ animation: "float-mesh-4 27s infinite ease-in-out" }} />

          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "55px 55px",
            }}
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        {/* ==========================================
            LAYER 1 — Giant Background Typography
           ========================================== */}
        <motion.div 
          style={{ x: mouseParallaxX, y: mouseParallaxY }}
          className="background-wordmark absolute inset-0 z-[2] pointer-events-none select-none flex flex-col justify-between p-12 overflow-hidden"
        >
          {/* WHY */}
          <motion.div 
            style={{ 
              x: whyX, 
              y: whyY, 
              fontFamily: "var(--font-editorial), 'PP Editorial New', serif",
              fontSize: "clamp(12rem, 16vw, 24rem)",
              opacity: 0.05
            }}
            className="absolute top-[12%] left-[2%] font-black uppercase text-white tracking-tighter leading-none whitespace-nowrap"
          >
            WHY
          </motion.div>

          {/* VARUNYA */}
          <motion.div 
            style={{ 
              x: varunyaX, 
              y: varunyaY, 
              fontFamily: "var(--font-editorial), 'PP Editorial New', serif",
              fontSize: "clamp(12rem, 16vw, 24rem)",
              opacity: 0.05
            }}
            className="absolute top-[40%] left-[5%] font-black uppercase text-white tracking-tighter leading-none whitespace-nowrap"
          >
            VARUNYA
          </motion.div>

          {/* TECH */}
          <motion.div 
            style={{ 
              x: techX, 
              y: techY, 
              fontFamily: "var(--font-editorial), 'PP Editorial New', serif",
              fontSize: "clamp(12rem, 16vw, 24rem)",
              opacity: 0.05
            }}
            className="absolute top-[68%] right-[2%] font-black uppercase text-white tracking-tighter leading-none whitespace-nowrap"
          >
            TECH
          </motion.div>
        </motion.div>

        {/* ==========================================
            LAYER 2 — Liquid Distortion Layer
           ========================================== */}
        <div 
          className="liquid-layer absolute inset-0 z-[5] bg-transparent pointer-events-none overflow-hidden"
          style={{ filter: "url(#liquidFilter)" }}
        >
          {/* SVG Displacement Filter definition */}
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
        </div>

        {/* ==========================================
            LAYER 3 — Center Locked Message Stage
           ========================================== */}
        <div className="message-stage absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] text-center z-[20] px-6 pointer-events-none">
          <AnimatePresence mode="wait">
            {activeIndex >= 0 && (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col justify-center items-center text-center px-4"
              >
                {/* Index Monospace Label */}
                <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-[#E02020] mb-5">
                  {statements[activeIndex].index}
                </span>
                
                {/* Heading Serif */}
                <h2 
                  className="text-white font-normal leading-[1.1] tracking-tight relative"
                  style={{ 
                    fontFamily: "var(--font-editorial), 'PP Editorial New', serif",
                    fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                    zIndex: 20
                  }}
                >
                  {statements[activeIndex].heading}
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
