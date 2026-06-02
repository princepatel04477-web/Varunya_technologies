"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface TechNode {
  id: string;
  name: string;
  color: string;
  category: "inner" | "middle" | "outer";
  angle: number; // in degrees
  svgPath: React.ReactNode;
}

// Separate coordinate calculator
const getNodeCoords = (
  node: TechNode,
  centerX: number,
  centerY: number,
  innerRx: number,
  innerRy: number,
  middleRx: number,
  middleRy: number,
  outerRx: number,
  outerRy: number
) => {
  let rx = innerRx;
  let ry = innerRy;

  if (node.category === "middle") {
    rx = middleRx;
    ry = middleRy;
  } else if (node.category === "outer") {
    rx = outerRx;
    ry = outerRy;
  }

  const rad = (node.angle * Math.PI) / 180;
  return {
    x: centerX + rx * Math.cos(rad),
    y: centerY + ry * Math.sin(rad),
    rad,
  };
};

interface TechCardProps {
  node: TechNode;
  idx: number;
  scrollYProgress: any;
  centerX: number;
  centerY: number;
  innerRx: number;
  innerRy: number;
  middleRx: number;
  middleRy: number;
  outerRx: number;
  outerRy: number;
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
}

// Dedicated sub-component for React Rules of Hooks compliance
function TechCard({
  node,
  idx,
  scrollYProgress,
  centerX,
  centerY,
  innerRx,
  innerRy,
  middleRx,
  middleRy,
  outerRx,
  outerRy,
  hoveredNode,
  setHoveredNode,
}: TechCardProps) {
  const coords = getNodeCoords(
    node,
    centerX,
    centerY,
    innerRx,
    innerRy,
    middleRx,
    middleRy,
    outerRx,
    outerRy
  );

  // Define Hook transforms at the functional component level (perfectly legal!)
  // Shifting the range earlier so all 30 elements are 100% visible by progress = 0.6
  const start = 0.15 + idx * 0.012;
  const end = 0.25 + idx * 0.012;
  
  // Clamped outputs to guarantee elements NEVER fade out or hide when scroll is complete (progress >= end)
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const scale = useTransform(scrollYProgress, [start, end], [0.9, 1]);

  const active = hoveredNode === node.id;
  const floatDuration = 4 + (idx % 3) * 1.2;
  const floatDelay = (idx % 4) * 0.75;

  return (
    <motion.div
      className="absolute origin-center"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        x: "-50%",
        y: "-50%",
        opacity,
        scale,
        zIndex: active ? 25 : 10,
      }}
      animate={{
        y: ["-50%", "-52%", "-48%", "-50%"],
        x: ["-50%", "-49%", "-51%", "-50%"],
      }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: floatDelay,
      }}
    >
      <motion.div
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border backdrop-blur-md cursor-pointer select-none"
        style={{
          backgroundColor: active ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.01)",
          borderColor: active ? node.color : "rgba(255,255,255,0.04)",
          boxShadow: active ? `0 0 18px ${node.color}25` : "none",
        }}
        whileHover={{ scale: 1.06 }}
      >
        {/* Enlarged brand icon (Bigger and clearer as requested: w-7 h-7) */}
        <div
          className="w-7 h-7 flex items-center justify-center flex-shrink-0"
          style={{
            color: active ? "#ffffff" : node.color,
            filter: active ? `drop-shadow(0 0 4px ${node.color})` : "none",
          }}
        >
          {node.svgPath}
        </div>

        {/* Compact Label (Scaled up to match the larger icon) */}
        <span
          className="text-[10px] uppercase tracking-[0.16em] font-semibold font-mono"
          style={{
            color: active ? "#ffffff" : "rgba(255,255,255,0.5)",
            textShadow: active ? `0 0 4px ${node.color}40` : "none",
          }}
        >
          {node.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function TechMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Dynamic responsive viewport scale to ensure no boundary clippings
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) setScale(0.35);
      else if (w < 640) setScale(0.45);
      else if (w < 768) setScale(0.58);
      else if (w < 1024) setScale(0.72);
      else if (w < 1280) setScale(0.85);
      else setScale(0.95);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const canvasWidth = 1000;
  const canvasHeight = 750;
  const centerX = canvasWidth / 2; // 500
  const centerY = canvasHeight / 2; // 375

  // Ellipse Radius Dimensions tailored for widescreen spacing
  const innerRx = 185;
  const innerRy = 125;
  const middleRx = 305;
  const middleRy = 205;
  const outerRx = 430;
  const outerRy = 290;

  // Track the scroll progress of the sticky container (runway of 200vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Step-by-step Scroll Reveal Transforms - Clamped to 100% so it remains visible at the end of the runway
  const centerNodeOpacity = useTransform(scrollYProgress, [0.0, 0.1], [0, 1]);
  const centerNodeScale = useTransform(scrollYProgress, [0.0, 0.1], [0.9, 1]);
  const centerGlowOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 0.8]);
  const connectionDraw = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  // Exactly 30 technologies mapped into 3 logical concentric rings:
  const techNodes: TechNode[] = [
    // --- INNER ELLIPSE (8 core client platform platforms) ---
    {
      id: "nextjs",
      name: "Next.js",
      color: "#ffffff",
      category: "inner",
      angle: 0,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M14.5 9.5l-5 5.5v-5.5h-1v7h1l5-5.5v5.5h1v-7h-1z" />
        </svg>
      ),
    },
    {
      id: "react",
      name: "React",
      color: "#61dafb",
      category: "inner",
      angle: 45,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full stroke-current fill-none" strokeWidth="1.8">
          <ellipse rx="10" ry="3.8" cx="12" cy="12" transform="rotate(0 12 12)" />
          <ellipse rx="10" ry="3.8" cx="12" cy="12" transform="rotate(60 12 12)" />
          <ellipse rx="10" ry="3.8" cx="12" cy="12" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "typescript",
      name: "TypeScript",
      color: "#3178c6",
      category: "inner",
      angle: 90,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M14.5 12h-3v4h-1.5v-4h-3V10.5h7.5V12z" />
        </svg>
      ),
    },
    {
      id: "tailwind",
      name: "Tailwind",
      color: "#38bdf8",
      category: "inner",
      angle: 135,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 6.09c-2.97 0-4.46 1.49-4.46 4.46h2.23c0-1.49.74-2.23 2.23-2.23s2.23.74 2.23 2.23-1.49 2.23-4.46 2.23v2.23c4.46 0 6.69-2.23 6.69-6.69S16.46 6.09 12 6.09z" />
        </svg>
      ),
    },
    {
      id: "framer",
      name: "Framer Motion",
      color: "#f43f5e",
      category: "inner",
      angle: 180,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M5 2h14v6H5V2zm0 6h7l7 7H12L5 8zm7 7h7v7l-7-7H12v7l-7-7h7z" />
        </svg>
      ),
    },
    {
      id: "vite",
      name: "Vite",
      color: "#bd34fe",
      category: "inner",
      angle: 225,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M2 3h20l-10 18L2 3zm10 4.5l-4 7h8l-4-7z" />
        </svg>
      ),
    },
    {
      id: "threejs",
      name: "Three.js",
      color: "#ffffff",
      category: "inner",
      angle: 270,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full stroke-current fill-none" strokeWidth="1.8">
          <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      ),
    },
    {
      id: "r3f",
      name: "R3F",
      color: "#61dafb",
      category: "inner",
      angle: 315,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full stroke-current fill-none" strokeWidth="1.8">
          <ellipse rx="9" ry="3.2" cx="12" cy="12" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      ),
    },

    // --- MIDDLE ELLIPSE (10 dynamic language / AI logic nodes) ---
    {
      id: "drei",
      name: "Drei",
      color: "#ff5e97",
      category: "middle",
      angle: 0,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      id: "glsl",
      name: "GLSL",
      color: "#a1a1aa",
      category: "middle",
      angle: 36,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full stroke-current fill-none" strokeWidth="1.8">
          <polygon points="12,2 2 22 22 22" />
          <circle cx="12" cy="14" r="3" />
        </svg>
      ),
    },
    {
      id: "webgpu",
      name: "WebGPU",
      color: "#8b5cf6",
      category: "middle",
      angle: 72,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
        </svg>
      ),
    },
    {
      id: "nodejs",
      name: "Node.js",
      color: "#339933",
      category: "middle",
      angle: 108,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full stroke-current fill-none" strokeWidth="1.8">
          <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "python",
      name: "Python",
      color: "#3776ab",
      category: "middle",
      angle: 144,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2c-2.76 0-5 2.24-5 5v3H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-3h3c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5h-3zm-1 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
        </svg>
      ),
    },
    {
      id: "go",
      name: "Go",
      color: "#00add8",
      category: "middle",
      angle: 180,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M16 10h-3v2h3v1.5h-3v2h3V17h-4.5v-8.5H16V10z" />
        </svg>
      ),
    },
    {
      id: "openai",
      name: "OpenAI",
      color: "#10a37f",
      category: "middle",
      angle: 216,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6a3 3 0 013 3c0 .6-.2 1.1-.5 1.5M9 12a3 3 0 013-3" />
        </svg>
      ),
    },
    {
      id: "anthropic",
      name: "Anthropic",
      color: "#d07b50",
      category: "middle",
      angle: 252,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="8" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="16" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      ),
    },
    {
      id: "gemini",
      name: "Gemini",
      color: "#8e2de2",
      category: "middle",
      angle: 288,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2L9 9 2 12l7 3 3 7 3-7 7-3-7-3z" />
        </svg>
      ),
    },
    {
      id: "langchain",
      name: "LangChain",
      color: "#f59e0b",
      category: "middle",
      angle: 324,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth="1.8">
          <rect x="3" y="8" width="9" height="8" rx="1.5" />
          <rect x="12" y="8" width="9" height="8" rx="1.5" />
        </svg>
      ),
    },

    // --- OUTER ELLIPSE (12 advanced cloud / DB infrastructure nodes) ---
    {
      id: "vectordbs",
      name: "Vector DBs",
      color: "#06b6d4",
      category: "outer",
      angle: 0,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      ),
    },
    {
      id: "pytorch",
      name: "PyTorch",
      color: "#ee4c2c",
      category: "outer",
      angle: 30,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      ),
    },
    {
      id: "postgres",
      name: "PostgreSQL",
      color: "#336791",
      category: "outer",
      angle: 60,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth="1.8">
          <ellipse cx="12" cy="6" rx="6.5" ry="2.2" />
          <path d="M5.5 6v5c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2V6" />
          <path d="M5.5 11v5c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2v-5" />
        </svg>
      ),
    },
    {
      id: "redis",
      name: "Redis",
      color: "#dc382d",
      category: "outer",
      angle: 90,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M7 7h10v3.5H7V7zm0 6h10v3.5H7V13z" />
        </svg>
      ),
    },
    {
      id: "graphql",
      name: "GraphQL",
      color: "#e10098",
      category: "outer",
      angle: 120,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full stroke-current fill-none" strokeWidth="1.8">
          <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      ),
    },
    {
      id: "supabase",
      name: "Supabase",
      color: "#3ecf8e",
      category: "outer",
      angle: 150,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M19 2l-7 9h6l-8 11 2-9H6l10-11-3 9h6l-8 11" />
        </svg>
      ),
    },
    {
      id: "aws",
      name: "AWS",
      color: "#ff9900",
      category: "outer",
      angle: 180,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.88 12.44c-.72.63-1.68.96-2.88.96-2.14 0-3.32-1.22-3.32-3.2v-1.6h1.62v1.6c0 1.15.54 1.76 1.7 1.76.78 0 1.34-.23 1.7-.68v-2.68h1.62v3.7c0 .16.03.32.06.46h-1.7zm1.62-5.74c0-.5-.4-.9-.9-.9s-.9.4-.9.9.4.9.9.9.9-.4.9-.9z" />
        </svg>
      ),
    },
    {
      id: "vercel",
      name: "Vercel",
      color: "#ffffff",
      category: "outer",
      angle: 210,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M12 2L2 21h20L12 2z" />
        </svg>
      ),
    },
    {
      id: "cloudflare",
      name: "Cloudflare",
      color: "#f38020",
      category: "outer",
      angle: 240,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      ),
    },
    {
      id: "docker",
      name: "Docker",
      color: "#2496ed",
      category: "outer",
      angle: 270,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <rect x="2" y="8" width="5" height="5" rx="1" />
          <rect x="8" y="8" width="5" height="5" rx="1" />
          <rect x="14" y="8" width="5" height="5" rx="1" />
          <path d="M22 14c0 3.31-2.69 6-6 6H4c-1.1 0-2-.9-2-2V10h20v4z" />
        </svg>
      ),
    },
    {
      id: "k8s",
      name: "K8s",
      color: "#326ce5",
      category: "outer",
      angle: 300,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full stroke-current fill-none" strokeWidth="1.8">
          <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
          <circle cx="12" cy="12" r="3.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "edge",
      name: "Edge",
      color: "#0078d4",
      category: "outer",
      angle: 330,
      svgPath: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 7.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5V7.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      id="tech-map"
      className="relative w-full bg-[#040404]"
      style={{ height: "200vh" }} // 2-screen scroll pinning runway
    >
      {/* Sticky centered screen layout */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center z-10">
        {/* Step 2: Glowing core behind center hero card with slow breathing (3-5%) */}
        <motion.div
          style={{ opacity: centerGlowOpacity }}
          animate={{ scale: [1.0, 1.04, 1.0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[650px] h-[650px] rounded-full bg-cyan-500/[0.045] blur-[130px] pointer-events-none z-0"
        />

        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 relative z-10 flex flex-col h-full justify-between py-16">
          {/* Symmetrical High-End Title */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <span
              className="text-xs tracking-[0.35em] text-[#888893] font-semibold uppercase"
              style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
            >
              Technology Stack
            </span>
            <h2
              className="font-normal text-4xl md:text-5xl tracking-tight text-white leading-[1.1]"
              style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
            >
              Engineered for absolute performance.
            </h2>
          </div>

          {/* Centralized Fixed Starburst Map Viewport */}
          <div className="relative w-full flex items-center justify-center flex-grow overflow-visible">
            {/* Standardized 1000x750 canvas container dynamically scaled to be fully responsive */}
            <div
              style={{
                width: `${canvasWidth * scale}px`,
                height: `${canvasHeight * scale}px`,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible"
              }}
              className="flex-shrink-0 transition-all duration-300 ease-out"
            >
              <div
                className="relative flex-shrink-0 transition-transform duration-100 ease-out origin-center absolute"
                style={{
                  width: `${canvasWidth}px`,
                  height: `${canvasHeight}px`,
                  transform: `scale(${scale})`,
                }}
              >
              {/* SVG Connecting Paths Layer */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              >
                {/* 3 Concentric Reference Ellipses */}
                <ellipse
                  cx={centerX}
                  cy={centerY}
                  rx={innerRx}
                  ry={innerRy}
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.03)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
                <ellipse
                  cx={centerX}
                  cy={centerY}
                  rx={middleRx}
                  ry={middleRy}
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.02)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
                <ellipse
                  cx={centerX}
                  cy={centerY}
                  rx={outerRx}
                  ry={outerRy}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.015)"
                  strokeWidth="1"
                  strokeDasharray="5 7"
                />

                {techNodes.map((node) => {
                  const coords = getNodeCoords(
                    node,
                    centerX,
                    centerY,
                    innerRx,
                    innerRy,
                    middleRx,
                    middleRy,
                    outerRx,
                    outerRy
                  );
                  const active = hoveredNode === node.id;

                  // Midpoints for smooth Bezier control offsets
                  const midX = (centerX + coords.x) / 2;
                  const midY = (centerY + coords.y) / 2;

                  // Draw organic curved guide perpendicular to the radial direction
                  const dx = coords.x - centerX;
                  const dy = coords.y - centerY;
                  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                  const px = -dy / dist;
                  const py = dx / dist;

                  // Curved offset for gorgeous organic lines
                  const ctrlX = midX + px * 32;
                  const ctrlY = midY + py * 32;

                  return (
                    <g key={`link-${node.id}`}>
                      {/* Baseline curved cable path */}
                      <motion.path
                        d={`M ${centerX} ${centerY} Q ${ctrlX} ${ctrlY} ${coords.x} ${coords.y}`}
                        fill="none"
                        stroke={active ? node.color : "rgba(6, 182, 212, 0.06)"}
                        strokeWidth={active ? 1.6 : 0.85}
                        style={{ pathLength: connectionDraw }}
                        className="transition-colors duration-300"
                      />

                      {/* Shimmering active running pulse path */}
                      {active && (
                        <motion.path
                          d={`M ${centerX} ${centerY} Q ${ctrlX} ${ctrlY} ${coords.x} ${coords.y}`}
                          fill="none"
                          stroke={node.color}
                          strokeWidth="2.0"
                          strokeDasharray="6 15"
                          initial={{ strokeDashoffset: 0 }}
                          animate={{ strokeDashoffset: -40 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          style={{ filter: `drop-shadow(0 0 4px ${node.color})` }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Center Dominated VARUNYA OS Hub (1.5x larger scale breathing) */}
              <motion.div
                style={{
                  left: `${centerX}px`,
                  top: `${centerY}px`,
                  x: "-50%",
                  y: "-50%",
                  opacity: centerNodeOpacity,
                  scale: centerNodeScale,
                  zIndex: 20,
                }}
                animate={{ scale: [1.0, 1.025, 1.0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute origin-center flex items-center justify-center pointer-events-auto"
              >
                <div className="w-48 h-48 rounded-2xl bg-neutral-950/85 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center relative shadow-[0_0_60px_rgba(6,182,212,0.12)] cursor-pointer select-none">
                  {/* Slow spinning interior dynamic ring */}
                  <motion.div
                    className="absolute inset-3 rounded-full border border-dashed border-cyan-400/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Varunya core visually enlarged icon (Significantly bigger: w-18 h-18!) */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-18 h-18 text-cyan-400 fill-current relative z-10 drop-shadow-[0_0_12px_rgba(6,182,212,0.75)]"
                  >
                    <polygon
                      points="12,2 22,8 22,16 12,22 2,16 2,8"
                      className="fill-none stroke-current"
                      strokeWidth="1.2"
                    />
                    <polygon
                      points="12,5 19,9 19,15 12,19 5,15 5,9"
                      className="fill-none stroke-cyan-500/30"
                      strokeWidth="0.8"
                    />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>

                  <span className="text-[10px] uppercase tracking-[0.25em] text-white mt-3.5 font-bold font-mono relative z-10">
                    Varunya Core
                  </span>
                  <span className="text-[7.5px] uppercase tracking-[0.16em] text-[#888893] mt-1 font-semibold font-mono relative z-10">
                    AI OS Ecosystem
                  </span>
                </div>
              </motion.div>

              {/* Fixed Staggered Surrounding Outer Cards */}
              {techNodes.map((node, idx) => (
                <TechCard
                  key={node.id}
                  node={node}
                  idx={idx}
                  scrollYProgress={scrollYProgress}
                  centerX={centerX}
                  centerY={centerY}
                  innerRx={innerRx}
                  innerRy={innerRy}
                  middleRx={middleRx}
                  middleRy={middleRy}
                  outerRx={outerRx}
                  outerRy={outerRy}
                  hoveredNode={hoveredNode}
                  setHoveredNode={setHoveredNode}
                />
              ))}
              </div>
            </div>
          </div>

          {/* Symmetrical Interaction Guide Footer */}
          <div className="flex justify-center items-center gap-6 mt-16 font-mono text-[9px] tracking-[0.25em] text-[#888893] uppercase">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.0, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            />
            <span>Scroll to explore architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
