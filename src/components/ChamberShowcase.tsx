"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Send, Sparkles, Check, ArrowRight } from "lucide-react";
import Image from "next/image";

interface Hotspot {
  id: number;
  top: string;
  left: string;
  label: { en: string; fr: string };
  desc: { en: string; fr: string };
}

interface ProjectData {
  num: string;
  title: string;
  metadata: {
    author: string;
    work: { en: string; fr: string };
    date: string;
    location: string;
    movement: { en: string; fr: string };
  };
  desc: { en: string; fr: string };
  chamber: string;
  image: string;
  hotspots: Hotspot[];
}

interface ChamberShowcaseProps {
  activeChamber: number;
  language: "en" | "fr";
}

export default function ChamberShowcase({ activeChamber, language }: ChamberShowcaseProps) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", project: "", budget: "" });
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for inertial motion
  const springConfig = { damping: 45, stiffness: 90, mass: 0.8 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Calculate parallax offsets
  const bgX = useTransform(smoothMouseX, [-1, 1], ["-1.5%", "1.5%"]);
  const bgY = useTransform(smoothMouseY, [-1, 1], ["-1.5%", "1.5%"]);

  const frameX = useTransform(smoothMouseX, [-1, 1], ["-3%", "3%"]);
  const frameY = useTransform(smoothMouseY, [-1, 1], ["-3%", "3%"]);

  const artworkX = useTransform(smoothMouseX, [-1, 1], ["-5%", "5%"]);
  const artworkY = useTransform(smoothMouseY, [-1, 1], ["-5%", "5%"]);

  const lightX = useTransform(smoothMouseX, [-1, 1], ["-7%", "7%"]);
  const lightY = useTransform(smoothMouseY, [-1, 1], ["-7%", "7%"]);

  // Track window mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Track container-relative spotlight coordinates
  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });
  };

  // Reset active hotspot on chamber change
  useEffect(() => {
    setActiveHotspot(null);
  }, [activeChamber]);

  const projects: ProjectData[] = [
    {
      num: "I",
      title: "AETHER OS",
      metadata: {
        author: "VARUNYA LABS",
        work: { en: "SPATIAL OPERATING SYSTEM", fr: "SYSTÈME D'EXPLOITATION SPATIAL" },
        date: "2026",
        location: "SAN FRANCISCO, CA",
        movement: { en: "AI-NATIVE SYSTEMS", fr: "SYSTÈMES IA-NATIFS" },
      },
      desc: {
        en: "A spatial operating system that reimagines machine-human workflow orchestration using localized LLM vectors and physical-canvas UI layers. Human-concept editorial art meets solid code.",
        fr: "Un système d'exploitation spatial qui réimagine l'orchestration des flux de travail homme-machine en utilisant des vecteurs LLM localisés et des couches d'interface utilisateur sur canevas physique.",
      },
      chamber: "CHAMBER I",
      image: "/aether_os.png",
      hotspots: [
        {
          id: 1,
          top: "20%",
          left: "35%",
          label: { en: "Localized Vector DB", fr: "BDD Vectorielle Localisée" },
          desc: {
            en: "Runs private, localized LLM context directly in-browser via GPU acceleration.",
            fr: "Exécute un contexte LLM privé et localisé directement dans le navigateur via l'accélération GPU.",
          },
        },
        {
          id: 2,
          top: "50%",
          left: "50%",
          label: { en: "Human-Machine Canvas", fr: "Canevas Homme-Machine" },
          desc: {
            en: "An infinite node-based spatial canvas replacing rigid file hierarchies.",
            fr: "Un canevas spatial infini basé sur des nœuds remplaçant les hiérarchies de fichiers rigides.",
          },
        },
        {
          id: 3,
          top: "72%",
          left: "65%",
          label: { en: "Low-Latency Orchestration", fr: "Orchestration Basse Latence" },
          desc: {
            en: "Real-time task scheduling matching system threads to user intent.",
            fr: "Planification des tâches en temps réel alignant les threads du système sur l'intention de l'utilisateur.",
          },
        },
      ],
    },
    {
      num: "II",
      title: "LUMEN NETWORK",
      metadata: {
        author: "VARUNYA SYSTEM",
        work: { en: "COMPUTE INFRASTRUCTURE", fr: "INFRASTRUCTURE DE CALCUL" },
        date: "2025",
        location: "BERLIN, DE",
        movement: { en: "DECENTRALIZED AUTOMATION", fr: "AUTOMATISATION DÉCENTRALISÉE" },
      },
      desc: {
        en: "High-throughput automation networks linking distributed serverless tasks with mathematical consistency, built for enterprise scalability and zero-knowledge data pipelines.",
        fr: "Réseaux d'automatisation à haut débit reliant les tâches sans serveur distribuées avec une cohérence mathématique, conçus pour l'évolutivité des entreprises.",
      },
      chamber: "CHAMBER II",
      image: "/lumen_network.png",
      hotspots: [
        {
          id: 1,
          top: "28%",
          left: "62%",
          label: { en: "Decentralized Compute", fr: "Calcul Décentralisé" },
          desc: {
            en: "Distributes serverless task execution across thousands of peer-to-peer client nodes.",
            fr: "Distribue l'exécution des tâches sans serveur sur des milliers de nœuds clients peer-to-peer.",
          },
        },
        {
          id: 2,
          top: "58%",
          left: "38%",
          label: { en: "Zero-Knowledge Consensus", fr: "Consensus Zero-Knowledge" },
          desc: {
            en: "Validates task output accuracy without exposing private transaction payloads.",
            fr: "Validates task output accuracy without exposing private transaction payloads.",
          },
        },
        {
          id: 3,
          top: "78%",
          left: "68%",
          label: { en: "Dynamic Scale Engine", fr: "Moteur d'Échelle Dynamique" },
          desc: {
            en: "Autoscales to handle 100k+ parallel executions per second with microsecond latency.",
            fr: "S'adapte dynamiquement pour gérer plus de 100k exécutions parallèles par seconde avec une latence en microseconds.",
          },
        },
      ],
    },
    {
      num: "III",
      title: "SOLAS SPATIAL",
      metadata: {
        author: "VARUNYA SPATIAL",
        work: { en: "INTERACTIVE LAYER", fr: "COUCHE INTERACTIVE" },
        date: "2026",
        location: "TOKYO, JP",
        movement: { en: "WEB3D ARCHITECTURE", fr: "ARCHITECTURE WEB3D" },
      },
      desc: {
        en: "Next-generation web environments exploring spatial UI coordinates, semantic layout engines, and interactive editorial design systems running on custom GPU shaders.",
        fr: "Environnements web de nouvelle génération explorant les coordonnées d'interface utilisateur spatiales, les moteurs de mise en page sémantiques et les systèmes de design éditorial interactifs.",
      },
      chamber: "CHAMBER III",
      image: "/solas_spatial.png",
      hotspots: [
        {
          id: 1,
          top: "25%",
          left: "48%",
          label: { en: "WebGL Layout Engine", fr: "Moteur de Layout WebGL" },
          desc: {
            en: "A layout system that translates standard HTML DOM into 3D spatial grids.",
            fr: "Un système de mise en page qui traduit le DOM HTML standard en grilles spatiales 3D.",
          },
        },
        {
          id: 2,
          top: "55%",
          left: "58%",
          label: { en: "Interactive Materials", fr: "Matériaux Interactifs" },
          desc: {
            en: "Custom GLSL shaders reacting to scroll depth, mouse hover, and viewport drag.",
            fr: "Shaders GLSL personnalisés réagissant à la profondeur de défilement, au survol de la souris et au glissement de l'écran.",
          },
        },
        {
          id: 3,
          top: "74%",
          left: "38%",
          label: { en: "Editorial Typography", fr: "Typographie Éditoriale" },
          desc: {
            en: "Dynamically aligned typographic systems optimized for spatial immersion.",
            fr: "Systèmes typographiques alignés dynamiquement et optimisés pour l'immersion spatiale.",
          },
        },
      ],
    },
    {
      num: "IV",
      title: "CAPABILITIES",
      metadata: {
        author: "VARUNYA CORE",
        work: { en: "CORE SPECIALIZATIONS", fr: "SPÉCIALISATIONS PRINCIPALES" },
        date: "ESTABLISHED",
        location: "GLOBAL NET",
        movement: { en: "CREATIVE TECHNOLOGY", fr: "TECHNOLOGIE CRÉATIVE" },
      },
      desc: {
        en: "Our architectural design philosophy fuses robust systems engineering with editorial-grade design aesthetics. We construct digital monuments to stand the test of time.",
        fr: "Notre philosophie de conception architecturale fusionne une ingénierie système robuste avec une esthétique de conception de niveau éditorial. Nous construisons des monuments numériques.",
      },
      chamber: "CHAMBER IV",
      image: "/solas_spatial.png",
      hotspots: [
        {
          id: 1,
          top: "28%",
          left: "32%",
          label: { en: "Systems & Infrastructure", fr: "Systèmes & Infrastructure" },
          desc: {
            en: "Distributed networks, edge computing nodes, and automated telemetry systems built with Rust and Go.",
            fr: "Réseaux distribués, nœuds d'edge computing et systèmes de télémétrie automatisés construits avec Rust et Go.",
          },
        },
        {
          id: 2,
          top: "50%",
          left: "62%",
          label: { en: "Creative Engineering", fr: "Ingénierie Créative" },
          desc: {
            en: "WebGL experiences, interactive shaders, custom physics canvases, and dynamic high-performance frontends.",
            fr: "Expériences WebGL, shaders interactifs, canevas physiques personnalisés et front-ends dynamiques à haute performance.",
          },
        },
        {
          id: 3,
          top: "70%",
          left: "48%",
          label: { en: "AI Architectures", fr: "Architectures d'IA" },
          desc: {
            en: "In-browser transformer pipelines, local vector stores, and custom LLM agent systems integrated into production canvas interfaces.",
            fr: "Pipelines de-transformers intégrés au navigateur, bases de données vectorielles locales et systèmes d'agents intégrés.",
          },
        },
      ],
    },
    {
      num: "V",
      title: "STUDIO INTAKE",
      metadata: {
        author: "VARUNYA INTAKE",
        work: { en: "PARTNERSHIPS", fr: "PARTENARIATS" },
        date: "PRESENT",
        location: "TRANSMISSION PORTAL",
        movement: { en: "EDITORIAL INQUIRY", fr: "DEMANDE ÉDITORIALE" },
      },
      desc: {
        en: "Enter your coordinates to initiate connection. Our team monitors global incoming transmissions and responds selectively to high-concept partnerships.",
        fr: "Saisissez vos coordonnées pour initier la connexion. Notre équipe surveille les transmissions mondiales entrantes et répond de manière sélective.",
      },
      chamber: "CHAMBER V",
      image: "",
      hotspots: [],
    },
  ];

  const p = projects[activeChamber];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", project: "", budget: "" });
    }, 4000);
  };

  const formText = {
    en: {
      name: "NAME / ORGANISATION",
      email: "EMAIL ADDRESS",
      project: "PROJECT CONCEPT",
      budget: "BUDGET RANGE",
      send: "TRANSMIT COORDINATES",
      success: "TRANSMISSION RECEIVED IN SILENCE",
      submitting: "SENDING...",
    },
    fr: {
      name: "NOM / ORGANISATION",
      email: "ADRESSE E-MAIL",
      project: "CONCEPT DU PROJET",
      budget: "FOURCHETTE DE BUDGET",
      send: "TRANSMETTRE LES COORDONNÉES",
      success: "TRANSMISSION REÇUE DANS LE SILENCE",
      submitting: "ENVOI EN COURS...",
    },
  };

  const ft = formText[language];

  return (
    <div className="relative w-full h-screen overflow-y-auto lg:overflow-y-hidden flex items-start lg:items-center justify-center py-28 lg:py-20 px-6 md:px-16 lg:px-24 select-none overflow-x-hidden">
      {/* 1. Large backdrop ghostly chamber numbers to set atmospheric scale */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <span className="font-display font-black text-[20vw] text-white/[0.007] tracking-tighter leading-none select-none uppercase transition-all duration-1000 mix-blend-overlay">
          CHAMBER {p.num}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeChamber}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[85vw] xl:max-w-[80vw] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 xl:gap-28 items-center z-10 pb-12 lg:pb-0"
        >
          {/* LEFT COLUMN: Metadata - Refined editorial typography */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 flex flex-col justify-center h-full border-l lg:border-l-0 lg:border-r border-[#eae6df]/5 lg:pr-12 pl-4 lg:pl-0 order-2 lg:order-none"
          >
            <span className="text-[8.5px] tracking-[0.4em] text-[#d4af37] font-semibold block mb-8 uppercase select-none">
              EXHIBIT {p.num}
            </span>

            <div className="space-y-5 text-[8.5px] tracking-[0.3em] font-medium text-[#eae6df]/45">
              <div className="border-b border-[#eae6df]/5 pb-3">
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">
                  {language === "en" ? "AUTHOR" : "AUTEUR"}
                </span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.author}</span>
              </div>
              <div className="border-b border-[#eae6df]/5 pb-3">
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">
                  {language === "en" ? "WORK" : "ŒUVRE"}
                </span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.work[language]}</span>
              </div>
              <div className="border-b border-[#eae6df]/5 pb-3">
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">DATE</span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.date}</span>
              </div>
              <div className="border-b border-[#eae6df]/5 pb-3">
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">
                  {language === "en" ? "LOCATION" : "LIEU"}
                </span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.location}</span>
              </div>
              <div>
                <span className="text-[#d4af37]/70 block font-semibold mb-1 text-[7.5px]">
                  {language === "en" ? "MOVEMENT" : "MOUVEMENT"}
                </span>
                <span className="text-[#eae6df]/90 text-[10.5px] font-sans font-light tracking-widest uppercase block mt-0.5">{p.metadata.movement[language]}</span>
              </div>
            </div>
          </motion.div>

          {/* CENTER COLUMN: Masterpiece artwork presentation container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -35 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 flex justify-center items-center relative aspect-[4/3] lg:aspect-square xl:aspect-[4/3] w-full order-1 lg:order-none"
          >
            {/* 2. Radial breathing gold glow behind active project frame */}
            <motion.div
              style={{ x: bgX, y: bgY }}
              className="absolute -inset-12 md:-inset-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none z-0 blur-3xl"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />

            {activeChamber < 4 ? (
              // Exhibit Chamber (I, II, III, IV)
              <motion.div
                ref={containerRef}
                onMouseMove={handleContainerMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setActiveHotspot(null);
                }}
                style={{ x: frameX, y: frameY }}
                className="relative w-full h-full rounded-md border border-[#d4af37]/20 bg-[#080808]/90 p-4 md:p-6 shadow-[0_35px_95px_rgba(0,0,0,0.95)] backdrop-blur-sm group overflow-hidden transition-all duration-700 ease-out hover:border-[#d4af37]/35 hover:shadow-[0_45px_110px_rgba(0,0,0,0.98),0_0_40px_rgba(212,175,55,0.03)]"
              >
                {/* Matte mount board (passe-partout) with thin inner gold border */}
                <div className="relative w-full h-full rounded border border-black/80 bg-zinc-950/90 overflow-hidden flex items-center justify-center">
                  
                  {/* 3. Deep-seated parallax artwork image */}
                  {p.image && (
                    <motion.div
                      style={{ x: artworkX, y: artworkY, scale: 1.05 }}
                      className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none"
                    >
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover opacity-[0.45] mix-blend-lighten pointer-events-none transition-all duration-1000 ease-out group-hover:opacity-[0.62] group-hover:scale-[1.01]"
                        priority
                      />
                    </motion.div>
                  )}

                  {/* Inner hairline border directly enclosing image box */}
                  <div className="absolute inset-0 border border-[#d4af37]/10 pointer-events-none z-10" />

                  {/* Ambient inner shadow mask */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.85)_100%)] z-10 pointer-events-none" />

                  {/* 4. Spotlight Cursor Light revealed on hover */}
                  <div
                    className="absolute inset-0 pointer-events-none z-15 mix-blend-screen transition-opacity duration-700 ease-out opacity-30 group-hover:opacity-100"
                    style={{
                      "--mouse-x": `${spotlightPos.x}%`,
                      "--mouse-y": `${spotlightPos.y}%`,
                      background: `radial-gradient(320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, ${isHovered ? 0.07 : 0.035}), transparent 80%)`,
                    } as React.CSSProperties}
                  />

                  {/* Fine diagonal sheen sweeping on hover */}
                  <div className="absolute inset-0 pointer-events-none z-15 bg-[linear-gradient(135deg,transparent_35%,rgba(255,255,255,0.015)_50%,transparent_65%)] -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-out" />

                  {/* 5. Glowing Hotspots (Interactive nodes) - Quietly visible on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 z-20"
                  >
                    {p.hotspots.map((hs) => {
                      const isActive = activeHotspot === hs.id;
                      return (
                        <div
                          key={hs.id}
                          className="absolute z-20"
                          style={{ top: hs.top, left: hs.left }}
                        >
                          {/* Pulse circle trigger */}
                          <button
                            onClick={() => setActiveHotspot(isActive ? null : hs.id)}
                            onMouseEnter={() => setActiveHotspot(hs.id)}
                            className="relative w-8 h-8 flex items-center justify-center group focus:outline-none pointer-events-auto cursor-pointer"
                          >
                            <span className="absolute w-full h-full rounded-full bg-[#d4af37]/15 animate-ping opacity-60" />
                            <span className="absolute w-4 h-4 rounded-full bg-black border border-[#d4af37]/60 group-hover:bg-[#d4af37] group-hover:scale-110 transition-all duration-300" />
                            <span className="absolute w-1.5 h-1.5 rounded-full bg-[#d4af37] group-hover:bg-black transition-colors duration-300" />
                          </button>

                          {/* Tooltip detail overlay */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 8 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute left-1/2 -translate-x-1/2 bottom-10 w-56 p-4 rounded bg-[#070709]/98 border border-[#d4af37]/35 shadow-2xl text-center pointer-events-none z-30"
                              >
                                <span className="text-[9px] tracking-[0.25em] text-[#d4af37] font-bold block mb-1.5 uppercase">
                                  {hs.label[language]}
                                </span>
                                <p className="text-[10.5px] text-[#eae6df]/75 leading-relaxed font-sans font-light">
                                  {hs.desc[language]}
                                </p>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#d4af37]/35" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              // Contact Chamber (V) - Refined as a luxury gallery registry
              <motion.div
                style={{ x: frameX, y: frameY }}
                className="w-full max-w-lg p-8 md:p-10 rounded-md border border-[#d4af37]/20 bg-[#080808]/95 shadow-[0_35px_95px_rgba(0,0,0,0.95)] relative z-20 backdrop-blur-sm transition-all duration-700 ease-out hover:border-[#d4af37]/35"
              >
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-14"
                  >
                     <div className="w-10 h-10 rounded-full border border-[#d4af37]/50 flex items-center justify-center mb-6">
                       <Check className="w-4 h-4 text-[#d4af37]" />
                     </div>
                     <span className="text-[10px] tracking-[0.3em] font-bold text-[#d4af37] mb-3 uppercase">
                       {ft.success}
                     </span>
                     <span className="text-[9px] tracking-widest text-[#eae6df]/35 font-medium">
                       {language === "en" ? "TRANSMISSION PORT CLOSING" : "FERMETURE DU PORT DE TRANSMISSION"}
                     </span>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-7 pointer-events-auto">
                    <div className="space-y-1.5">
                      <label className="text-[8px] tracking-[0.35em] font-semibold text-[#d4af37] uppercase block">
                        {ft.name}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-b border-[#eae6df]/10 focus:border-[#d4af37] py-2 text-xs text-[#eae6df] outline-none transition-colors duration-300 font-sans tracking-wide uppercase"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] tracking-[0.35em] font-semibold text-[#d4af37] uppercase block">
                        {ft.email}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-transparent border-b border-[#eae6df]/10 focus:border-[#d4af37] py-2 text-xs text-[#eae6df] outline-none transition-colors duration-300 font-sans tracking-wide uppercase"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] tracking-[0.35em] font-semibold text-[#d4af37] uppercase block">
                        {ft.project}
                      </label>
                      <input
                        type="text"
                        value={formData.project}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        className="w-full bg-transparent border-b border-[#eae6df]/10 focus:border-[#d4af37] py-2 text-xs text-[#eae6df] outline-none transition-colors duration-300 font-sans tracking-wide uppercase"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] tracking-[0.35em] font-semibold text-[#d4af37] uppercase block">
                        {ft.budget}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. $25k - $50k"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-transparent border-b border-[#eae6df]/10 focus:border-[#d4af37] py-2 text-xs text-[#eae6df] outline-none transition-colors duration-300 font-sans placeholder-white/5 uppercase tracking-wide"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 border border-[#d4af37]/20 hover:border-[#d4af37] bg-transparent text-[9px] tracking-[0.3em] font-bold text-[#eae6df] transition-all duration-500 flex items-center justify-center gap-2 hover:bg-[#d4af37]/5 hover:tracking-[0.35em] cursor-pointer"
                    >
                      {ft.send}
                      <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: Editorial Narrative Description */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 flex flex-col justify-between h-full border-l border-[#eae6df]/5 pl-4 lg:pl-8 py-2 order-3 lg:order-none"
          >
            <div>
              <span className="text-[8px] tracking-[0.4em] font-bold text-[#d4af37] block mb-6 uppercase">
                {language === "en" ? "EXHIBIT NARRATIVE" : "RÉCIT DE L'EXPOSITION"}
              </span>
              <p className="text-[12px] md:text-[13px] text-[#eae6df]/60 leading-loose font-sans font-light tracking-wide text-justify">
                {p.desc[language]}
              </p>
            </div>

            <div className="mt-12 border-t border-[#eae6df]/5 pt-5 flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="text-[9px] tracking-[0.35em] font-bold text-[#eae6df]/85 uppercase">
                {p.chamber}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

