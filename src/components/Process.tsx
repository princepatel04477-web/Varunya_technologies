"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useMotionConfig } from "@/context/MotionConfigContext";

const DiscoveryEngine = dynamic(() => import("./DiscoveryEngine"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-[#eae5c9]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const StrategyBlueprint = dynamic(() => import("./StrategyBlueprint"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-[#eae5c9]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const ExperienceLab = dynamic(() => import("./ExperienceLab"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-[#eae5c9]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const ApplicationAssembly = dynamic(() => import("./ApplicationAssembly"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-[#eae5c9]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const ValidationEngine = dynamic(() => import("./ValidationEngine"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-[#eae5c9]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const GlobalExpansion = dynamic(() => import("./GlobalExpansion"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-[#eae5c9]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});

const EvolutionEngine = dynamic(() => import("./EvolutionEngine"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#050507] flex items-center justify-center text-[10px] tracking-widest text-[#eae5c9]/20 uppercase font-mono">
      Initializing...
    </div>
  ),
});






const steps = [
  {
    roman: "I",
    title: "Discovery & Consultation",
    tagline: "Understanding before building.",
    body: "We begin by understanding your business goals, challenges, target audience, and project requirements. This helps us define a clear roadmap and project scope.",
    visual: "discover",
    details: {
      outcome: "A clearly defined project scope and a validated strategic roadmap.",
      process: "Deep-dive stakeholder interviews, technical mapping, and opportunity audits.",
      rule: "Listen first, define clearly, eliminate all technical assumptions.",
      deliverables: "Scope blueprint, strategic roadmap document, and resource estimates.",
    },
  },
  {
    roman: "II",
    title: "Strategy & Planning",
    tagline: "Designing systems, not features.",
    body: "Our team creates a detailed strategy covering project architecture, timelines, technology stack, milestones, and resource allocation to ensure smooth execution.",
    visual: "architect",
    details: {
      outcome: "High-fidelity system architecture diagram and execution plan.",
      process: "Database structure planning, API routing, and technology stack selection.",
      rule: "Build for maximum throughput; document system dependencies.",
      deliverables: "Architecture schematics, milestone timelines, and stack design.",
    },
  },
  {
    roman: "III",
    title: "Design & Prototyping",
    tagline: "Turning ideas into tangible experiences.",
    body: "We design intuitive user experiences and visually engaging interfaces. Interactive prototypes allow stakeholders to review and validate the solution before development begins.",
    visual: "prototype",
    details: {
      outcome: "Verified user experience patterns and interactive design flows.",
      process: "High-fidelity UI layouts, interactive staging flows, and user testing.",
      rule: "Aesthetics are functional; prioritize frictionless transitions.",
      deliverables: "Figma interactive prototype, style guides, and assets inventory.",
    },
  },
  {
    roman: "IV",
    title: "Development",
    tagline: "Building with precision.",
    body: "Using modern technologies and agile methodologies, our developers build secure, scalable, and high-performance solutions while maintaining transparency throughout the process.",
    visual: "engineer",
    details: {
      outcome: "Fully integrated staging environment with functional API endpoints.",
      process: "Full-stack codebase development, automated pipelines, and testing suites.",
      rule: "Write clean, self-documenting code with unit test coverage.",
      deliverables: "Staged application, GitHub repository, and API specifications.",
    },
  },
  {
    roman: "V",
    title: "Testing & Quality Assurance",
    tagline: "Ensuring stable, secure products.",
    body: "Every feature undergoes rigorous testing to ensure functionality, security, performance, and compatibility across devices and platforms.",
    visual: "qa",
    details: {
      outcome: "Zero-vulnerability security scan and stable cross-platform build.",
      process: "Integration tests, compatibility checks, and load/stress testing.",
      rule: "Never push to production without a clean lint and test run.",
      deliverables: "Quality assurance report, bug tracker logs, and speed audit.",
    },
  },
  {
    roman: "VI",
    title: "Deployment & Launch",
    tagline: "Launching with confidence.",
    body: "Once approved, we deploy the solution in a secure production environment, ensuring a seamless launch with minimal disruption.",
    visual: "deploy",
    details: {
      outcome: "Application live in production on global edge networks.",
      process: "Serverless hosting setup, live traffic deployment, and DNS routing.",
      rule: "Zero downtime deployment; monitor logs actively for 48 hours.",
      deliverables: "Live production website URL, build configuration, and SSL certs.",
    },
  },
  {
    roman: "VII",
    title: "Support & Optimization",
    tagline: "Iterative enhancements post-launch.",
    body: "Our partnership continues after launch. We provide ongoing maintenance, performance monitoring, updates, and enhancements to keep your solution running efficiently.",
    visual: "evolve",
    details: {
      outcome: "Continual performance enhancements and database optimization.",
      process: "Speed audit reviews, feature iteration, and cloud log analysis.",
      rule: "Performance is a feature; refine and optimize continuously.",
      deliverables: "Monthly optimization review, analytical dashboards, and hotfixes.",
    },
  },
];

function StepVisual({ type }: { type: string }) {
  const visuals: Record<string, React.ReactNode> = {
    discover: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        <circle cx="100" cy="100" r="70" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="45" />
        <circle cx="100" cy="100" r="22" />
        <line x1="100" y1="10" x2="100" y2="190" strokeDasharray="3 5" />
        <line x1="10" y1="100" x2="190" y2="100" strokeDasharray="3 5" />
        <circle cx="100" cy="100" r="5" fill="rgba(255,255,255,0.4)" stroke="none" />
        <line x1="20" y1="20" x2="40" y2="20" /><line x1="20" y1="20" x2="20" y2="40" />
        <line x1="180" y1="20" x2="160" y2="20" /><line x1="180" y1="20" x2="180" y2="40" />
      </svg>
    ),
    architect: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        <rect x="20" y="20" width="160" height="160" strokeDasharray="3 5" />
        <rect x="50" y="50" width="100" height="100" />
        <circle cx="50" cy="50" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="150" cy="50" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="50" cy="150" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="150" cy="150" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="100" cy="100" r="6" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
        <line x1="50" y1="50" x2="100" y2="100" />
        <line x1="150" y1="50" x2="100" y2="100" />
        <line x1="50" y1="150" x2="100" y2="100" />
        <line x1="150" y1="150" x2="100" y2="100" />
      </svg>
    ),
    prototype: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        <rect x="55" y="30" width="90" height="140" rx="6" />
        <line x1="55" y1="50" x2="145" y2="50" />
        <line x1="55" y1="155" x2="145" y2="155" />
        <circle cx="100" cy="170" r="5" />
        <rect x="65" y="60" width="70" height="15" rx="2" />
        <rect x="65" y="82" width="50" height="8" rx="1" />
        <rect x="65" y="96" width="60" height="8" rx="1" />
        <rect x="65" y="110" width="45" height="8" rx="1" />
      </svg>
    ),
    engineer: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        <rect x="20" y="40" width="160" height="120" rx="4" />
        <line x1="20" y1="58" x2="180" y2="58" />
        <circle cx="36" cy="49" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <circle cx="52" cy="49" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <circle cx="68" cy="49" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <line x1="36" y1="75" x2="90" y2="75" />
        <line x1="36" y1="88" x2="120" y2="88" />
        <line x1="48" y1="101" x2="100" y2="101" />
        <line x1="48" y1="114" x2="140" y2="114" />
        <rect x="112" y="136" width="8" height="10" fill="rgba(255,255,255,0.3)" stroke="none" />
      </svg>
    ),
    qa: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        <path d="M100,30 L160,50 L160,110 C160,150 100,180 100,180 C100,180 40,150 40,110 L40,50 Z" />
        <path d="M75,100 L92,117 L132,77" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="75" strokeDasharray="3 5" />
      </svg>
    ),
    deploy: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        <circle cx="100" cy="100" r="75" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="50" strokeDasharray="2 5" />
        <circle cx="100" cy="100" r="25" />
        <line x1="100" y1="75" x2="100" y2="30" />
        <line x1="100" y1="30" x2="88" y2="48" />
        <line x1="100" y1="30" x2="112" y2="48" />
      </svg>
    ),
    evolve: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        <path d="M100,100 m-50,0 a50,30 0 1,1 100,0 a50,30 0 1,1 -100,0" strokeDasharray="3 4" />
        <path d="M100,100 m-35,0 a35,20 0 1,0 70,0 a35,20 0 1,0 -70,0" />
        <line x1="30" y1="160" x2="170" y2="160" />
      </svg>
    ),
  };
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {visuals[type] || null}
    </div>
  );
}

function ProcessStep({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const stepRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start end", "end start"],
  });
  const { isMobile } = useMotionConfig();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setIsActive(latest > 0.15 && latest < 0.85);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const leftOpacity = useTransform(scrollYProgress, [0.1, 0.28, 0.72, 0.9], [0, 1, 1, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.88], [0, 1, 1, 0]);
  
  const isEven = index % 2 === 0;
  const leftXOffset = isEven ? -40 : 40;
  const rightXOffset = isEven ? 40 : -40;
  
  const textX = useTransform(scrollYProgress, [0.1, 0.28, 0.72, 0.9], [leftXOffset, 0, 0, leftXOffset]);
  const cardX = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.88], [rightXOffset, 0, 0, rightXOffset]);

  const detailsList = [
    { label: "Outcome", val: step.details.outcome },
    { label: isEven ? "Process" : "Constraints", val: step.details.process },
    { label: "Rule", val: step.details.rule },
    { label: "Deliverables", val: step.details.deliverables },
  ];

  return (
    <div
      ref={stepRef}
      className="relative"
      style={{ height: "180vh" }}
    >
      <div className="sticky top-0 h-screen w-full flex items-stretch overflow-hidden">
        <div className={`w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center justify-between gap-8 md:gap-16 h-full`}>
          
          {/* ── TEXT DETAILS PANEL ── */}
          <motion.div
            style={{ opacity: leftOpacity, x: textX }}
            className="w-full md:w-[48%] flex flex-col justify-center py-6 md:py-0 z-10"
          >
            <div className="mb-6">
              <span className="text-[10px] tracking-[0.4em] text-white/35 font-mono uppercase block mb-2">
                {step.roman} — Phase {index + 1}
              </span>
              <h2
                className="text-3xl md:text-5xl font-normal text-white leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
              >
                {step.title}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-5">
              {detailsList.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="text-[9px] tracking-[0.25em] text-white/30 uppercase font-mono">
                    ✦ {item.label}
                  </span>
                  <p className="text-xs md:text-[13px] text-white/70 leading-relaxed font-light">
                    {item.val}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── TIMELINE TRACK (Middle) ── */}
          <div className="hidden md:flex w-1 h-2/3 flex-col items-center justify-center relative">
            <div className="absolute top-0 bottom-0 w-[1px] bg-white/10" />
            <motion.div
              style={{ opacity: leftOpacity }}
              className="w-10 h-10 rounded-full border border-white/30 bg-[#050507] flex items-center justify-center relative z-10 shadow-lg"
            >
              <span className="text-xs font-mono text-white/80">{index + 1}</span>
            </motion.div>
          </div>

          {/* ── VISUAL CARD PANEL ── */}
          <motion.div
            style={{ opacity: rightOpacity, x: cardX }}
            className="w-full md:w-[46%] h-[45vh] md:h-[62vh] relative bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col justify-end p-8 md:p-10 overflow-hidden shadow-2xl"
          >
            {(!isMobile || isActive) ? (
              index === 0 ? (
                <DiscoveryEngine stepBody={step.body} />
              ) : index === 1 ? (
                <StrategyBlueprint stepBody={step.body} />
              ) : index === 2 ? (
                <ExperienceLab stepBody={step.body} />
              ) : index === 3 ? (
                <ApplicationAssembly stepBody={step.body} />
              ) : index === 4 ? (
                <ValidationEngine stepBody={step.body} />
              ) : index === 5 ? (
                <GlobalExpansion stepBody={step.body} />
              ) : index === 6 ? (
                <EvolutionEngine stepBody={step.body} />
              ) : null
            ) : (
              <>
                {/* Background texture grid */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-[0.03]"
                    style={{ backgroundColor: "white" }}
                  />
                </div>

                {/* Abstract SVG visual centered */}
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="w-48 h-48 md:w-56 md:h-56">
                    <StepVisual type={step.visual} />
                  </div>
                </div>

                {/* Bottom: Title & description */}
                <div className="relative z-10 mt-auto">
                  <p className="text-xs text-white/55 font-light leading-relaxed max-w-sm">
                    {step.body}
                  </p>
                </div>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default function Process() {
  return (
    <section id="process" className="w-full bg-[#040404] relative">
      
      {/* ── Section header ── */}
      <div className="relative z-10 pt-28 pb-20 px-8 md:pl-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] tracking-[0.45em] text-white/30 uppercase font-mono mb-5"
        >
          How we work
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="text-[3rem] md:text-[4rem] lg:text-[5rem] font-normal text-white leading-[1.0] tracking-tight max-w-2xl"
          style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
        >
          How we<br />do it.
        </motion.h2>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── The Scroll-Driven steps ── */}
      {steps.map((step, i) => (
        <div key={step.roman}>
          <ProcessStep step={step} index={i} />
          {i < steps.length - 1 && (
            <div className="border-t border-white/[0.04]" />
          )}
        </div>
      ))}

      {/* ── Final Summary Card: "Why Choose Varunya Technologies?" ── */}
      <div className="relative min-h-screen py-20 w-full flex items-center justify-center overflow-hidden bg-[#040404] border-t border-white/[0.04]">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl md:rounded-3xl p-8 md:p-14 overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-stretch gap-10"
          >
            {/* Left Column: Philosophical summary */}
            <div className="flex-[1.2] flex flex-col justify-between text-[#eae6df]">
              <div>
                <span className="text-[10px] tracking-[0.4em] text-white/35 font-mono uppercase block mb-3">
                  Conclusion
                </span>
                <h3
                  className="text-3xl md:text-[3rem] font-normal text-white leading-tight tracking-tight mb-6"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Why Choose<br />Varunya Technologies?
                </h3>
              </div>

              <p className="text-sm md:text-base text-white/60 leading-relaxed font-light font-satoshi max-w-lg mt-6 md:mt-0">
                From concept to completion, Varunya Technologies delivers innovative technology solutions that help businesses grow, adapt, and succeed in a digital-first world.
              </p>
            </div>

            {/* Right Column: Values & Key Pillars */}
            <div className="flex-1 rounded-xl bg-neutral-900/50 border border-white/5 relative overflow-hidden flex flex-col justify-between p-6 md:p-8">
              <div className="w-full flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest font-bold opacity-60 text-white" style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}>
                    Delivery Model
                  </span>
                  <span className="text-xs font-mono font-bold text-white/80">Varunya Partnership Engine</span>
                </div>
                <span className="text-[10px] font-mono border border-white/10 px-2 py-0.5 rounded text-white/40">Active / Production</span>
              </div>

              <div className="my-auto flex flex-col gap-3 font-satoshi text-xs md:text-sm text-white/70">
                <div className="p-3 rounded border border-white/5 bg-white/[0.02] flex items-center gap-3">
                  <span className="text-[#3da58a] font-bold">✦</span>
                  <span>Client-focused approach</span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-white/[0.02] flex items-center gap-3">
                  <span className="text-[#3da58a] font-bold">✦</span>
                  <span>Transparent communication</span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-white/[0.02] flex items-center gap-3">
                  <span className="text-[#3da58a] font-bold">✦</span>
                  <span>Agile development process</span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-white/[0.02] flex items-center gap-3">
                  <span className="text-[#3da58a] font-bold">✦</span>
                  <span>Quality-driven delivery</span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-white/[0.02] flex items-center gap-3">
                  <span className="text-[#3da58a] font-bold">✦</span>
                  <span>Long-term technical support</span>
                </div>
              </div>

              <div className="w-full h-1 bg-white/5 rounded overflow-hidden mt-6">
                <div className="w-full h-full bg-[#3da58a]" />
              </div>
            </div>

          </motion.div>
        </div>
      </div>

    </section>
  );
}

