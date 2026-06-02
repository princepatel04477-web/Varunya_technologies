"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const steps = [
  {
    roman: "I",
    title: "Discover",
    tagline: "Understanding before building.",
    body: "Every engagement begins with immersion. We analyze your business model, workflows, bottlenecks, audience behavior, and growth objectives. The goal is not to collect requirements—it is to uncover opportunities that technology can amplify.",
    deliverables: [
      "Stakeholder workshops",
      "Process mapping",
      "Technical assessment",
      "Opportunity identification",
      "Strategic roadmap",
    ],
    // Abstract SVG visual for the right panel
    visual: "discover",
  },
  {
    roman: "II",
    title: "Architect",
    tagline: "Designing systems, not features.",
    body: "Once the problem is understood, we architect the solution. From AI workflows and automation pipelines to user experiences and infrastructure decisions, every component is designed for scalability, performance, and longevity.",
    deliverables: [
      "Solution architecture",
      "User journeys",
      "AI workflow design",
      "Technical specifications",
      "Product blueprint",
    ],
    visual: "architect",
  },
  {
    roman: "III",
    title: "Prototype",
    tagline: "Turning ideas into tangible experiences.",
    body: "Before full development begins, we create interactive prototypes that validate assumptions and refine direction. This stage transforms concepts into something stakeholders can see, test, and experience.",
    deliverables: [
      "Interactive prototypes",
      "AI proof-of-concepts",
      "Experience validation",
      "Feedback cycles",
      "Design refinement",
    ],
    visual: "prototype",
  },
  {
    roman: "IV",
    title: "Engineer",
    tagline: "Building with precision.",
    body: "Our team develops production-grade systems using modern engineering practices and AI-native workflows. Every component is optimized for speed, maintainability, security, and scale.",
    deliverables: [
      "Full-stack development",
      "AI integration",
      "Automation systems",
      "Infrastructure setup",
      "Quality assurance",
    ],
    visual: "engineer",
  },
  {
    roman: "V",
    title: "Deploy",
    tagline: "Launching with confidence.",
    body: "Deployment is treated as a controlled release rather than a handoff. Infrastructure, monitoring, analytics, and operational workflows are configured to ensure a smooth transition into production.",
    deliverables: [
      "Production deployment",
      "Performance optimization",
      "Monitoring setup",
      "Security validation",
      "Launch support",
    ],
    visual: "deploy",
  },
  {
    roman: "VI",
    title: "Evolve",
    tagline: "Continuous improvement through intelligence.",
    body: "Technology should improve after launch, not stagnate. We analyze usage, collect insights, and iteratively enhance systems to keep them aligned with business growth and changing market demands.",
    deliverables: [
      "Performance reviews",
      "AI model optimization",
      "Feature expansion",
      "Workflow enhancements",
      "Long-term partnership",
    ],
    visual: "evolve",
  },
];

// Abstract SVG visuals for each step's right panel
function StepVisual({ type }: { type: string }) {
  const visuals: Record<string, React.ReactNode> = {
    discover: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        {/* Magnifying glass / target crosshair */}
        <circle cx="100" cy="100" r="70" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="45" />
        <circle cx="100" cy="100" r="22" />
        <line x1="100" y1="10" x2="100" y2="190" strokeDasharray="3 5" />
        <line x1="10" y1="100" x2="190" y2="100" strokeDasharray="3 5" />
        <circle cx="100" cy="100" r="5" fill="rgba(255,255,255,0.4)" stroke="none" />
        {/* Corner markers */}
        <line x1="20" y1="20" x2="40" y2="20" /><line x1="20" y1="20" x2="20" y2="40" />
        <line x1="180" y1="20" x2="160" y2="20" /><line x1="180" y1="20" x2="180" y2="40" />
        <line x1="20" y1="180" x2="40" y2="180" /><line x1="20" y1="180" x2="20" y2="160" />
        <line x1="180" y1="180" x2="160" y2="180" /><line x1="180" y1="180" x2="180" y2="160" />
      </svg>
    ),
    architect: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        {/* Blueprint grid nodes */}
        <rect x="20" y="20" width="160" height="160" strokeDasharray="3 5" />
        <rect x="50" y="50" width="100" height="100" />
        {/* Node connections */}
        <circle cx="50" cy="50" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="150" cy="50" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="50" cy="150" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="150" cy="150" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="100" cy="100" r="6" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
        <line x1="50" y1="50" x2="100" y2="100" />
        <line x1="150" y1="50" x2="100" y2="100" />
        <line x1="50" y1="150" x2="100" y2="100" />
        <line x1="150" y1="150" x2="100" y2="100" />
        {/* Axis lines */}
        <line x1="100" y1="20" x2="100" y2="50" strokeDasharray="2 4" />
        <line x1="100" y1="150" x2="100" y2="180" strokeDasharray="2 4" />
        <line x1="20" y1="100" x2="50" y2="100" strokeDasharray="2 4" />
        <line x1="150" y1="100" x2="180" y2="100" strokeDasharray="2 4" />
      </svg>
    ),
    prototype: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        {/* Device wireframe */}
        <rect x="55" y="30" width="90" height="140" rx="6" />
        <line x1="55" y1="50" x2="145" y2="50" />
        <line x1="55" y1="155" x2="145" y2="155" />
        <circle cx="100" cy="170" r="5" />
        {/* Screen content wireframes */}
        <rect x="65" y="60" width="70" height="15" rx="2" />
        <rect x="65" y="82" width="50" height="8" rx="1" />
        <rect x="65" y="96" width="60" height="8" rx="1" />
        <rect x="65" y="110" width="45" height="8" rx="1" />
        <rect x="65" y="130" width="70" height="14" rx="3" />
      </svg>
    ),
    engineer: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        {/* Code terminal */}
        <rect x="20" y="40" width="160" height="120" rx="4" />
        <line x1="20" y1="58" x2="180" y2="58" />
        <circle cx="36" cy="49" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <circle cx="52" cy="49" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <circle cx="68" cy="49" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        {/* Code lines */}
        <line x1="36" y1="75" x2="90" y2="75" />
        <line x1="36" y1="88" x2="120" y2="88" />
        <line x1="48" y1="101" x2="100" y2="101" />
        <line x1="48" y1="114" x2="140" y2="114" />
        <line x1="36" y1="127" x2="80" y2="127" />
        <line x1="36" y1="140" x2="110" y2="140" />
        {/* cursor blink */}
        <rect x="112" y="136" width="8" height="10" fill="rgba(255,255,255,0.3)" stroke="none" />
      </svg>
    ),
    deploy: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        {/* Launch / rocket orbital */}
        <circle cx="100" cy="100" r="75" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="50" strokeDasharray="2 5" />
        <circle cx="100" cy="100" r="25" />
        {/* Upward arrow */}
        <line x1="100" y1="75" x2="100" y2="30" />
        <line x1="100" y1="30" x2="88" y2="48" />
        <line x1="100" y1="30" x2="112" y2="48" />
        {/* Orbit dots */}
        <circle cx="175" cy="100" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="25" cy="100" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
        <circle cx="100" cy="25" r="4" fill="rgba(255,255,255,0.4)" stroke="none" />
      </svg>
    ),
    evolve: (
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-25" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
        {/* Infinite loop / growth spiral */}
        <path d="M100,100 m-50,0 a50,30 0 1,1 100,0 a50,30 0 1,1 -100,0" strokeDasharray="3 4" />
        <path d="M100,100 m-35,0 a35,20 0 1,0 70,0 a35,20 0 1,0 -70,0" />
        {/* Growth bars */}
        <rect x="40" y="130" width="12" height="30" />
        <rect x="60" y="118" width="12" height="42" />
        <rect x="80" y="108" width="12" height="52" />
        <rect x="100" y="98" width="12" height="62" />
        <rect x="120" y="88" width="12" height="72" />
        <rect x="140" y="75" width="12" height="85" />
        {/* Baseline */}
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

// Individual step — used as a full-screen sticky section
function ProcessStep({
  step,
  index,
  totalSteps,
}: {
  step: (typeof steps)[0];
  index: number;
  totalSteps: number;
}) {
  const stepRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start end", "end start"],
  });

  const leftOpacity = useTransform(scrollYProgress, [0.1, 0.28, 0.72, 0.9], [0, 1, 1, 0]);
  const leftY = useTransform(scrollYProgress, [0.1, 0.28, 0.72, 0.9], [40, 0, 0, -40]);
  const rightOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.88], [0, 1, 1, 0]);
  const rightX = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.88], [60, 0, 0, 60]);

  return (
    <div
      ref={stepRef}
      className="relative"
      style={{ height: "200vh" }} // Each step occupies 2 viewport heights
    >
      {/* Sticky viewport-filling panel */}
      <div className="sticky top-0 h-screen w-full flex items-stretch overflow-hidden">

        {/* ── LEFT SIDE: Step number indicator on far edge ── */}
        <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
          <motion.div
            style={{ opacity: leftOpacity }}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/30 flex items-center justify-center"
          >
            <span
              className="text-[10px] md:text-xs text-white/70 font-mono"
              style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
            >
              {index + 1}
            </span>
          </motion.div>

          {/* Progress dots for all steps */}
          <div className="flex flex-col gap-1.5 mt-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: i === index ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── LEFT PANEL: Text content ── */}
        <motion.div
          style={{ opacity: leftOpacity, y: leftY }}
          className="w-full md:w-[52%] flex flex-col justify-center pl-16 pr-8 md:pl-28 md:pr-16 py-16 relative z-10"
        >
          {/* Roman numeral + dash + title */}
          <div className="mb-8 md:mb-10">
            <p
              className="text-xs tracking-[0.4em] text-white/35 uppercase mb-4 font-mono"
            >
              {step.roman} — {step.title.toUpperCase()}
            </p>
            <h2
              className="text-[2.6rem] md:text-[3.5rem] lg:text-[4rem] font-normal text-white leading-[1.05] tracking-tight mb-5"
              style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
            >
              {step.tagline}
            </h2>
            <div className="w-8 h-[1px] bg-white/20 mb-6" />
            <p className="text-[15px] md:text-base text-white/45 leading-[1.75] font-light max-w-lg">
              {step.body}
            </p>
          </div>

          {/* Deliverables */}
          <div>
            <p className="text-[10px] tracking-[0.35em] text-white/30 uppercase mb-4 font-mono">
              Deliverables
            </p>
            <ul className="flex flex-col gap-2">
              {step.deliverables.map((d, i) => (
                <motion.li
                  key={d}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-80px" }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 text-[13px] md:text-sm text-white/50"
                >
                  <span className="w-[3px] h-[3px] rounded-full bg-white/30 flex-shrink-0" />
                  {d}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ── RIGHT PANEL: Visual card (dark textured with abstract art + step name) ── */}
        <motion.div
          style={{ opacity: rightOpacity, x: rightX }}
          className="hidden md:flex md:w-[48%] relative bg-[#0a0a0a] border-l border-white/5 flex-col justify-end p-10 overflow-hidden"
        >
          {/* Background texture grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-[0.04]"
              style={{ backgroundColor: "white" }}
            />
          </div>

          {/* Abstract SVG visual centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72">
              <StepVisual type={step.visual} />
            </div>
          </div>

          {/* Bottom: Big serif step name */}
          <div className="relative z-10">
            <p className="text-[10px] tracking-[0.4em] text-white/20 uppercase font-mono mb-3">
              Phase {step.roman}
            </p>
            <h3
              className="text-[3.5rem] md:text-[4.5rem] font-normal text-white/80 leading-none tracking-tight"
              style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
            >
              {step.title}
            </h3>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Process() {
  return (
    <section
      id="process"
      className="w-full bg-[#040404] relative"
    >
      {/* ── Section header — scrolls away above the steps ── */}
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

      {/* ── The 6 scroll-driven steps ── */}
      {steps.map((step, i) => (
        <div key={step.roman}>
          <ProcessStep step={step} index={i} totalSteps={steps.length} />
          {/* Thin separator between steps */}
          {i < steps.length - 1 && (
            <div className="border-t border-white/[0.04]" />
          )}
        </div>
      ))}

      {/* ── Closing line ── */}
      <div className="border-t border-white/[0.06] py-20 px-8 md:pl-28 flex items-center gap-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-white/20 text-sm font-light tracking-widest font-mono uppercase"
        >
          End-to-end. Intelligence-first.
        </motion.p>
        <div className="flex-1 h-[1px] bg-white/[0.06]" />
      </div>
    </section>
  );
}
