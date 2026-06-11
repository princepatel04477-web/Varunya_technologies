"use client";

import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
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

  // Mouse interpolation for interactive shifting
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

  // Update active index based on scroll timeline divisions
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let idx = 0;
      if (latest < 0.30) idx = 0;
      else if (latest < 0.50) idx = 1;
      else if (latest < 0.70) idx = 2;
      else if (latest < 0.90) idx = 3;
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
        // Slow organic turbulence movement
        const freq = 0.015 + latestScroll * 0.02 + Math.abs(currentMouse.current.x) * 0.005;
        turbulenceRef.current.setAttribute("baseFrequency", freq.toString());
      }

      if (displacementRef.current) {
        // Liquid distortion intensifies slightly on mouse shift or scroll progress
        const scaleVal = latestScroll * 45 + (Math.abs(currentMouse.current.x) + Math.abs(currentMouse.current.y)) * 25;
        displacementRef.current.setAttribute("scale", scaleVal.toString());
      }

      animationFrameId = requestAnimationFrame(updateFilter);
    };

    animationFrameId = requestAnimationFrame(updateFilter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [scrollYProgress, mouseXVal, mouseYVal]);

  // Layer 1 Parallax (Wordmark shifts independently and slower than foreground)
  const whyY = useTransform(scrollYProgress, [0, 1], ["0vh", "-25vh"]);
  const whyX = useTransform(scrollYProgress, [0, 1], ["-2vw", "8vw"]);

  const varunyaY = useTransform(scrollYProgress, [0, 1], ["10vh", "30vh"]);
  const varunyaX = useTransform(scrollYProgress, [0, 1], ["4vw", "-8vw"]);

  const techY = useTransform(scrollYProgress, [0, 1], ["-5vh", "-30vh"]);
  const techX = useTransform(scrollYProgress, [0, 1], ["0vw", "12vw"]);

  const mouseParallaxX = useTransform(mouseXVal, (val) => `${val}px`);
  const mouseParallaxY = useTransform(mouseYVal, (val) => `${val}px`);

  // Layer 3 Message Transitions (0% to 10% Intro / 20% Msg 1 / 40% Msg 2 / 60% Msg 3 / 80% Msg 4 / 100% Msg 5)
  // Ensures absolutely ZERO visual overlap between sequential messages.
  
  // Message 1 (Center 0.20)
  const op0 = useTransform(scrollYProgress, [0.00, 0.10, 0.18, 0.22, 0.30, 1.00], [0, 0, 1, 1, 0, 0]);
  const scale0 = useTransform(scrollYProgress, [0.00, 0.10, 0.18, 0.22, 0.30, 1.00], [0.95, 0.95, 1, 1, 1.05, 1.05]);
  const blur0 = useTransform(scrollYProgress, [0.00, 0.10, 0.18, 0.22, 0.30, 1.00], [20, 20, 0, 0, 20, 20]);
  const filter0 = useMotionTemplate`blur(${blur0}px)`;

  // Message 2 (Center 0.40)
  const op1 = useTransform(scrollYProgress, [0.00, 0.30, 0.38, 0.42, 0.50, 1.00], [0, 0, 1, 1, 0, 0]);
  const scale1 = useTransform(scrollYProgress, [0.00, 0.30, 0.38, 0.42, 0.50, 1.00], [0.95, 0.95, 1, 1, 1.05, 1.05]);
  const blur1 = useTransform(scrollYProgress, [0.00, 0.30, 0.38, 0.42, 0.50, 1.00], [20, 20, 0, 0, 20, 20]);
  const filter1 = useMotionTemplate`blur(${blur1}px)`;

  // Message 3 (Center 0.60)
  const op2 = useTransform(scrollYProgress, [0.00, 0.50, 0.58, 0.62, 0.70, 1.00], [0, 0, 1, 1, 0, 0]);
  const scale2 = useTransform(scrollYProgress, [0.00, 0.50, 0.58, 0.62, 0.70, 1.00], [0.95, 0.95, 1, 1, 1.05, 1.05]);
  const blur2 = useTransform(scrollYProgress, [0.00, 0.50, 0.58, 0.62, 0.70, 1.00], [20, 20, 0, 0, 20, 20]);
  const filter2 = useMotionTemplate`blur(${blur2}px)`;

  // Message 4 (Center 0.80)
  const op3 = useTransform(scrollYProgress, [0.00, 0.70, 0.78, 0.82, 0.90, 1.00], [0, 0, 1, 1, 0, 0]);
  const scale3 = useTransform(scrollYProgress, [0.00, 0.70, 0.78, 0.82, 0.90, 1.00], [0.95, 0.95, 1, 1, 1.05, 1.05]);
  const blur3 = useTransform(scrollYProgress, [0.00, 0.70, 0.78, 0.82, 0.90, 1.00], [20, 20, 0, 0, 20, 20]);
  const filter3 = useMotionTemplate`blur(${blur3}px)`;

  // Message 5 (Center 1.00)
  const op4 = useTransform(scrollYProgress, [0.00, 0.90, 0.98, 1.00], [0, 0, 1, 1]);
  const scale4 = useTransform(scrollYProgress, [0.00, 0.90, 0.98, 1.00], [0.95, 0.95, 1, 1]);
  const blur4 = useTransform(scrollYProgress, [0.00, 0.90, 0.98, 1.00], [20, 20, 0, 0]);
  const filter4 = useMotionTemplate`blur(${blur4}px)`;

  const statementStyles = [
    { opacity: op0, scale: scale0, filter: filter0 },
    { opacity: op1, scale: scale1, filter: filter1 },
    { opacity: op2, scale: scale2, filter: filter2 },
    { opacity: op3, scale: scale3, filter: filter3 },
    { opacity: op4, scale: scale4, filter: filter4 }
  ];

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
            LAYER 1 — Giant Background Typography
           ========================================== */}
        <motion.div 
          style={{ x: mouseParallaxX, y: mouseParallaxY }}
          className="background-wordmark absolute inset-0 z-[1] pointer-events-none select-none flex flex-col justify-between p-12 overflow-hidden"
        >
          {/* WHY */}
          <motion.div 
            style={{ 
              x: whyX, 
              y: whyY, 
              fontFamily: "var(--font-editorial), 'PP Editorial New', serif",
              fontSize: "clamp(14rem, 20vw, 28rem)"
            }}
            className="absolute top-[8%] left-[-5%] font-black uppercase text-white/5 tracking-tighter leading-none whitespace-nowrap"
          >
            WHY
          </motion.div>

          {/* VARUNYA */}
          <motion.div 
            style={{ 
              x: varunyaX, 
              y: varunyaY, 
              fontFamily: "var(--font-editorial), 'PP Editorial New', serif",
              fontSize: "clamp(14rem, 20vw, 28rem)"
            }}
            className="absolute top-[38%] left-[-10%] font-black uppercase text-white/5 tracking-tighter leading-none whitespace-nowrap"
          >
            VARUNYA
          </motion.div>

          {/* TECH */}
          <motion.div 
            style={{ 
              x: techX, 
              y: techY, 
              fontFamily: "var(--font-editorial), 'PP Editorial New', serif",
              fontSize: "clamp(14rem, 20vw, 28rem)"
            }}
            className="absolute top-[65%] right-[-5%] font-black uppercase text-white/5 tracking-tighter leading-none whitespace-nowrap"
          >
            TECH
          </motion.div>
        </motion.div>

        {/* ==========================================
            LAYER 2 — Liquid Distortion Layer
           ========================================== */}
        <div 
          className="liquid-layer absolute inset-0 z-[5] bg-[#050505] pointer-events-none overflow-hidden"
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
            LAYER 3 — Center Locked Message Stage
           ========================================== */}
        <div className="message-stage absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] text-center z-[20] px-6 pointer-events-none">
          {statements.map((statement, idx) => {
            const { opacity, scale, filter } = statementStyles[idx];
            return (
              <motion.div
                key={idx}
                style={{ 
                  opacity, 
                  scale,
                  filter,
                  pointerEvents: activeIndex === idx ? "auto" : "none"
                }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center text-center px-4"
              >
                {/* Index Monospace Label */}
                <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-[#E02020] mb-5">
                  {statement.index}
                </span>
                
                {/* Heading Serif */}
                <h2 
                  className="text-white font-normal leading-[1.1] tracking-tight"
                  style={{ 
                    fontFamily: "var(--font-editorial), 'PP Editorial New', serif",
                    fontSize: "clamp(3rem, 7vw, 7rem)"
                  }}
                >
                  {statement.heading}
                </h2>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
