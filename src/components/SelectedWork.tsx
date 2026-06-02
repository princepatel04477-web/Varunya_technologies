"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function SelectedWork() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // Map vertical scroll progress to horizontal translation
  // 4 panels = translate from 0 to -75%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  const projects = [
    {
      num: "01",
      title: "NEBULA FINANCE",
      category: "AI-NATIVE ANALYSIS",
      year: "2026",
      desc: "An intelligent analysis platform combining multi-agent logic networks with custom vector indexes to automate pipeline reporting. Achieved +412% MRR growth.",
      image: "/aether_os.png",
      color: "#0f0f12",
    },
    {
      num: "02",
      title: "LUMEN STUDIOS",
      category: "WEB3D SHOWCASE",
      year: "2025",
      desc: "A scroll-driven immersive brand showcase utilizing advanced WebGL shaders and GPU physics to drive customer storytelling. Awarded 3x Awwwards.",
      image: "/lumen_network.png",
      color: "#08090c",
    },
    {
      num: "03",
      title: "SYNTHWAVE COMMERCE",
      category: "EDGE EXPERIENCE",
      year: "2026",
      desc: "An edge-delivered headless commerce solution running dynamic middleware pipelines to personalize content. Increased conversion rate by +247%.",
      image: "/solas_spatial.png",
      color: "#0c0d10",
    },
    {
      num: "04",
      title: "AETHER ROBOTICS",
      category: "SPATIAL SYSTEMS",
      year: "2025",
      desc: "An interactive spatial interface and web launch built for the next generation of robotic automation systems, driving over +890% qualified leads.",
      image: "/aether_os.png",
      color: "#0b0c0f",
    },
  ];

  return (
    <div ref={containerRef} id="works" className="relative h-[400vh] bg-bg-dark">
      {/* Sticky screen container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Header indicator */}
        <div className="absolute top-28 left-6 md:left-12 z-20 flex justify-between w-[calc(100%-48px)] md:w-[calc(100%-96px)]">
          <span className="text-xs tracking-[0.25em] text-muted font-semibold uppercase">
            SELECTED WORK
          </span>
          <span className="text-xs tracking-[0.25em] text-white/40 font-semibold uppercase">
            SCROLL TO EXPLORE
          </span>
        </div>

        {/* Horizontal moving container */}
        <motion.div style={{ x }} className="flex h-full w-[400vw]">
          {projects.map((project, index) => (
            <section
              key={index}
              className="relative w-screen h-screen flex-shrink-0 flex items-center px-6 md:px-12 pt-20"
              style={{ backgroundColor: project.color }}
            >
              {/* Subtle background lines */}
              <div className="absolute inset-0 grid grid-cols-12 pointer-events-none z-0">
                <div className="col-start-2 border-l border-white/[0.02] h-full" />
                <div className="col-start-7 border-l border-white/[0.02] h-full" />
                <div className="col-start-11 border-l border-white/[0.02] h-full" />
              </div>

              {/* Grid content */}
              <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Text details */}
                <div className="md:col-span-5 flex flex-col justify-center h-full">
                  <span className="font-display font-bold text-5xl md:text-7xl text-white/10 mb-4 block select-none">
                    {project.num}
                  </span>

                  <span className="text-xs tracking-[0.2em] text-white/50 font-bold uppercase mb-2">
                    {project.category}
                  </span>

                  <h3 className="font-display font-extrabold text-4xl md:text-6xl tracking-tighter text-fg-light mb-6">
                    {project.title}
                  </h3>

                  <p className="text-muted text-sm md:text-base leading-relaxed font-light mb-8 max-w-md">
                    {project.desc}
                  </p>

                  {/* Metadata fields */}
                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 max-w-md mb-8">
                    <div>
                      <span className="text-[10px] tracking-widest text-muted block mb-1">SERVICE</span>
                      <span className="text-xs text-white/80 font-medium">
                        {project.category.split(" ")[1] || "ENGINEERING"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-widest text-muted block mb-1">YEAR</span>
                      <span className="text-xs text-white/80 font-medium">{project.year}</span>
                    </div>
                  </div>

                  <a
                    href="#contact"
                    className="flex items-center gap-2 group self-start text-xs tracking-widest text-white hover:text-muted font-bold transition-colors duration-300"
                  >
                    VIEW PROJECT DETAILS
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </a>
                </div>

                {/* Big Showcase Image */}
                <div className="md:col-span-7 flex justify-center items-center">
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/5 shadow-2xl bg-zinc-950 group">
                    {/* Parallax mask element */}
                    <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />

                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      sizes="(max-width: 768px) 100vw, 55vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
