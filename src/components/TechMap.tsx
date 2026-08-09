"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useMotionConfig } from "@/context/MotionConfigContext";

interface TechNode {
  id: string;
  name: string;
  color: string;
  category: "inner" | "middle" | "outer";
  angle: number; // in degrees
  svgPath: React.ReactNode;
}

interface Connection {
  from: string;
  to: string;
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

const techConnections: Connection[] = [
  // Next.js connections
  { from: "nextjs", to: "react" },
  { from: "nextjs", to: "typescript" },
  { from: "nextjs", to: "tailwind" },
  { from: "nextjs", to: "framer" },
  { from: "nextjs", to: "vercel" },
  // React connections
  { from: "react", to: "r3f" },
  { from: "react", to: "threejs" },
  // R3F connections
  { from: "r3f", to: "drei" },
  { from: "r3f", to: "threejs" },
  // ThreeJS connections
  { from: "threejs", to: "glsl" },
  { from: "threejs", to: "webgpu" },
  // WebGPU connections
  { from: "webgpu", to: "pytorch" },
  // TypeScript connections
  { from: "typescript", to: "nodejs" },
  // Node.js connections
  { from: "nodejs", to: "postgres" },
  { from: "nodejs", to: "redis" },
  { from: "nodejs", to: "graphql" },
  { from: "nodejs", to: "supabase" },
  // Python connections
  { from: "python", to: "pytorch" },
  { from: "python", to: "openai" },
  { from: "python", to: "anthropic" },
  { from: "python", to: "gemini" },
  { from: "python", to: "langchain" },
  // Go connections
  { from: "go", to: "postgres" },
  { from: "go", to: "redis" },
  { from: "go", to: "k8s" },
  // AI integrations
  { from: "openai", to: "langchain" },
  { from: "anthropic", to: "langchain" },
  { from: "gemini", to: "langchain" },
  { from: "openai", to: "vectordbs" },
  { from: "anthropic", to: "vectordbs" },
  { from: "gemini", to: "vectordbs" },
  { from: "langchain", to: "vectordbs" },
  // DB & Cloud integrations
  { from: "supabase", to: "postgres" },
  { from: "supabase", to: "vercel" },
  { from: "aws", to: "docker" },
  { from: "aws", to: "k8s" },
  { from: "aws", to: "cloudflare" },
  { from: "docker", to: "k8s" },
  { from: "vercel", to: "cloudflare" },
  { from: "cloudflare", to: "edge" },
  { from: "vercel", to: "edge" },
];

const techDetails: { [key: string]: { purpose: string; whyVarunya: string; projects: string[]; role: string } } = {
  varunyacore: {
    purpose: "Unified Neural Command Center",
    whyVarunya: "The central hub of our digital architecture. Varunya Core orchestrates data streams, coordinates AI agents, integrates cloud resources, and maps all service layers into a single interoperable, self-repairing ecosystem.",
    projects: ["Varunya Core AI OS", "Omni-Channel Synchronization Bridge"],
    role: "System Anchor & Orchestrator"
  },
  nextjs: {
    purpose: "React Framework for the Web",
    whyVarunya: "Next.js provides hybrid static/server rendering, optimized image handling, and effortless routing, forming the foundation of our high-speed, SEO-optimal web architectures.",
    projects: ["Varunya Corporate Portal", "Aether AI Dashboard", "Project Synthesis UI"],
    role: "Application Core Layer"
  },
  react: {
    purpose: "Component-Driven UI Library",
    whyVarunya: "React allows us to build stateful, highly interactive user interfaces with reusable component trees and optimized rendering paradigms.",
    projects: ["Client Management Systems", "Spatial Configuration Tools"],
    role: "User Interface Library"
  },
  typescript: {
    purpose: "Typed JavaScript Superset",
    whyVarunya: "Ensures type safety, eliminates runtime exceptions, and improves developer velocity through self-documenting codebases and robust IDE autocompletion.",
    projects: ["All Internal & Client Software Core Libraries"],
    role: "Language Standard"
  },
  tailwind: {
    purpose: "Utility-First CSS Framework",
    whyVarunya: "Enables rapid styling with zero layout thrashing, strict design system tokens, and streamlined build bundles.",
    projects: ["Varunya Tech Website", "Aether Dashboard UI"],
    role: "Styling Framework"
  },
  framer: {
    purpose: "Fluid Animation Library for React",
    whyVarunya: "Framer Motion powers the natural micro-interactions, exit animations, and physics-based gestures that make our layouts feel responsive and organic.",
    projects: ["Interactive Showcases", "Custom Transition Engines"],
    role: "Interactive Motion Engine"
  },
  vite: {
    purpose: "Ultra-Fast Next-Gen Frontend Tooling",
    whyVarunya: "Provides instantaneous Hot Module Replacement (HMR) and optimized Rollup bundles for non-SSR standalone web tools.",
    projects: ["Internal Tools Dashboard", "3D Sandbox Canvas"],
    role: "Development Tooling"
  },
  threejs: {
    purpose: "WebGL 3D Rendering Library",
    whyVarunya: "Allows us to render hardware-accelerated 3D graphics directly in the browser, bypassing heavy plugins or native builds.",
    projects: ["Exhibition Hall 3D Map", "Immersive Landing Showcase"],
    role: "WebGL Graphics Layer"
  },
  r3f: {
    purpose: "React Wrapper for Three.js",
    whyVarunya: "Bridges React's declarative component structure with Three.js's imperative 3D scene graphs, enabling reactive, state-bound 3D elements.",
    projects: ["Interactive Chamber Canvas", "Volumetric Data Graphs"],
    role: "3D Component Bridge"
  },
  drei: {
    purpose: "Three.js Helpers & Shader Utilities",
    whyVarunya: "Provides pre-tested controls, loaders, and shaders that speed up complex WebGL scene construction.",
    projects: ["Chamber Camera Motion Engine", "Refraction Shader Presets"],
    role: "3D Helper Library"
  },
  glsl: {
    purpose: "OpenGL Shading Language",
    whyVarunya: "Enables custom GPU-level compute shaders for visual effects, particle simulations, and materials that run at 60+ FPS.",
    projects: ["Cosmic Particle Grid", "Glass Refraction Shaders"],
    role: "GPU Programming"
  },
  webgpu: {
    purpose: "Next-Gen Browser Graphics API",
    whyVarunya: "Unlocks modern GPU capabilities for high-performance compute shaders, deep learning inference, and complex 3D scenes in-browser.",
    projects: ["Neural Network Map Visualizer", "Fluid Dynamics Simulation"],
    role: "GPU Compute Standard"
  },
  nodejs: {
    purpose: "Server-Side JavaScript Runtime",
    whyVarunya: "Powers our fast, non-blocking I/O microservices and API gateways using a unified language stack.",
    projects: ["Unified Gateway API", "Notification Microservice"],
    role: "Backend Runtime"
  },
  python: {
    purpose: "Scientific Computing & Scripting",
    whyVarunya: "The industry standard for data science and AI. Python runs our neural model orchestrations and data pipelines.",
    projects: ["Autonomous Agent Core", "Data Extraction Engine"],
    role: "AI & Data Runtime"
  },
  go: {
    purpose: "Compiled Systems Language",
    whyVarunya: "Selected for high-throughput, low-latency microservices that require rapid concurrency and minimal memory overhead.",
    projects: ["Real-time Sync Server", "Telemetry Ingestion Agent"],
    role: "High-Performance System Backend"
  },
  openai: {
    purpose: "Enterprise LLM Provider",
    whyVarunya: "We integrate GPT models for advanced reasoning, complex text synthesis, and logical agent decision paths.",
    projects: ["Aether Smart Agent", "Automated Knowledge Synthesizer"],
    role: "Cognitive AI Model"
  },
  anthropic: {
    purpose: "Safety-First Conversational Models",
    whyVarunya: "Claude models provide high-fidelity reasoning, long context windows, and exceptional code generation capabilities.",
    projects: ["Internal Code Copilot", "Deep Document Analyzer"],
    role: "Cognitive AI Model"
  },
  gemini: {
    purpose: "Multimodal AI Foundation Model",
    whyVarunya: "Google's Gemini models allow us to process text, image, audio, and video natively in a single context window.",
    projects: ["Multimodal Search Indexer", "Live Screen Analysis Suite"],
    role: "Cognitive AI Model"
  },
  langchain: {
    purpose: "AI Agent Orchestration Framework",
    whyVarunya: "LangChain structures our LLM chains, history buffers, and tool-calling flows into manageable, deterministic agents.",
    projects: ["Aether Agent Logic", "Customer Service Broker"],
    role: "AI Orchestration Layer"
  },
  vectordbs: {
    purpose: "Semantic Vector Embeddings Database",
    whyVarunya: "Enables instant similarity searches and Retrieval-Augmented Generation (RAG) across millions of corporate documents.",
    projects: ["Aether Knowledge Base", "Semantic Code Search Hub"],
    role: "AI Database Layer"
  },
  pytorch: {
    purpose: "Deep Learning Tensor Framework",
    whyVarunya: "Used to train, fine-tune, and evaluate our custom visual and linguistic models before server deployment.",
    projects: ["Custom Image Recognition Pipeline", "Neural Pattern Analyzer"],
    role: "AI Model Development"
  },
  postgres: {
    purpose: "Relational SQL Database Engine",
    whyVarunya: "The standard for structured relational data. PostgreSQL ensures transaction compliance (ACID) and robust indices.",
    projects: ["Varunya Core Ledger", "Client Account Databases"],
    role: "Structured Storage Layer"
  },
  redis: {
    purpose: "In-Memory Key-Value Store & Cache",
    whyVarunya: "Powers our active user session caches, message queues, and rate-limiting blocks with sub-millisecond latencies.",
    projects: ["Session Cache Manager", "Real-Time WebSocket Broker"],
    role: "Caching & In-Memory Store"
  },
  graphql: {
    purpose: "Declarative API Query Language",
    whyVarunya: "Allows clients to request exactly the data they need, reducing payload sizes and consolidating multi-database fetches.",
    projects: ["Unified Platform Gateway", "Mobile App Feed Provider"],
    role: "API Query Layer"
  },
  supabase: {
    purpose: "Serverless Backend-as-a-Service",
    whyVarunya: "Combines PostgreSQL with instant auth, storage, and real-time listeners, speeding up prototype-to-prod cycles.",
    projects: ["Internal Employee Hub", "Collaborative Workspaces"],
    role: "Serverless Platform"
  },
  aws: {
    purpose: "Global Cloud Infrastructure",
    whyVarunya: "Houses our production loads across globally distributed availability zones with unmatched scalability.",
    projects: ["Production Cluster Node Setup", "Asset Blob Storage (S3)"],
    role: "Cloud Provider"
  },
  vercel: {
    purpose: "Frontend Edge Deployment Platform",
    whyVarunya: "Enables instant global edge deployments, serverless functions, and automated visual preview branches.",
    projects: ["Varunya Tech Website", "Client Portal Frontends"],
    role: "Edge Hosting Platform"
  },
  cloudflare: {
    purpose: "DNS, CDN, & Security Edge Network",
    whyVarunya: "Cloudflare provides global DDoS protection, ultra-fast DNS routing, and worker-based edge logic.",
    projects: ["Global DNS Routing", "Web Application Firewall (WAF)"],
    role: "Edge Routing & Security"
  },
  docker: {
    purpose: "Containerization Platform",
    whyVarunya: "Ensures parity between local development and cloud production systems by packaging code with dependencies.",
    projects: ["All Microservices Deployment Containers"],
    role: "Container Standardization"
  },
  k8s: {
    purpose: "Container Orchestration Engine",
    whyVarunya: "Manages container clusters, handles auto-scaling, and automatically restarts failed nodes in real time.",
    projects: ["Production Kubernetes Microservices Cluster"],
    role: "Infrastructure Orchestration"
  },
  edge: {
    purpose: "Distributed Client-Proximity Computing",
    whyVarunya: "Runs lightweight compute functions at the nearest network hop to minimize network lag for global users.",
    projects: ["Real-time Asset Optimization Workers"],
    role: "Compute Location Layer"
  }
};

const phaseNodes = {
  1: ["aws", "docker", "cloudflare", "k8s", "vercel", "edge"],
  2: ["nodejs", "python", "go", "postgres", "redis", "graphql", "supabase", "vectordbs"],
  3: ["openai", "anthropic", "gemini", "langchain", "pytorch", "vectordbs"],
  4: ["nextjs", "react", "threejs", "tailwind", "framer", "vite", "r3f", "drei", "glsl", "webgpu"],
  5: [
    "nextjs", "react", "typescript", "tailwind", "framer", "vite", "threejs", "r3f",
    "drei", "glsl", "webgpu", "nodejs", "python", "go", "openai", "anthropic", "gemini", "langchain",
    "vectordbs", "pytorch", "postgres", "redis", "graphql", "supabase", "aws", "vercel", "cloudflare", "docker", "k8s", "edge"
  ]
};

const phases = [
  {
    id: 1,
    title: "Infrastructure",
    subtitle: "High-Performance Cloud Bedrock",
    description: "The resilient, globally distributed backbone of Varunya's digital ecosystems. Engineered with secure cloud routing, microservice containers, and auto-scaling platforms to support high availability.",
    tags: ["AWS", "Docker", "Cloudflare", "K8s", "Vercel", "Edge"]
  },
  {
    id: 2,
    title: "Backend",
    subtitle: "Robust API & Logic Layer",
    description: "Powering secure transactions, data persistence, and low-latency microservices. We utilize specialized runtimes and modern query layers to deliver stable database transactions and fast API endpoints.",
    tags: ["Node.js", "Python", "Go", "PostgreSQL", "Redis", "GraphQL", "Supabase"]
  },
  {
    id: 3,
    title: "AI Layer",
    subtitle: "Cognitive Intelligence Engine",
    description: "Integrating cognitive reasoning, semantic search, and autonomous workflows. We orchestrate large language models with vector databases and machine learning libraries to build self-learning tools.",
    tags: ["OpenAI", "Anthropic", "Gemini", "LangChain", "PyTorch", "Vector DBs"]
  },
  {
    id: 4,
    title: "Frontend",
    subtitle: "Immersive User Interfaces",
    description: "Crafting hardware-accelerated user experiences. Blending component-based web architectures with 3D graphics and custom shaders to deliver highly performant, visual applications.",
    tags: ["Next.js", "React", "Three.js", "Tailwind", "Framer Motion", "Vite", "R3F", "Drei", "GLSL", "WebGPU"]
  },
  {
    id: 5,
    title: "Varunya Core",
    subtitle: "Unified Technology Ecosystem",
    description: "The complete, interconnected technology stack. All systems converge here, linking cloud networks, intelligent backends, and spatial frontends into a single cohesive, living command center.",
    tags: ["Full Stack", "Interoperable", "GPU Accelerated", "AI Augmented"]
  }
];


const techNodes: TechNode[] = [
  // --- INNER ELLIPSE (8 core client platforms) ---
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

export default function TechMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(1);
  const { isMobile } = useMotionConfig();

  // References for DOM elements in the animation loop
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const lineRefs = useRef<{ [key: string]: SVGPathElement | null }>({});

  // Dynamic values saved in refs to bypass React rendering cycles
  const baseCoordsRef = useRef<{ [key: string]: { x: number; y: number; rad: number } }>({});
  const dynamicCoordsRef = useRef<{
    [key: string]: {
      x: number;
      y: number;
      floatX: number;
      floatY: number;
      displaceX: number;
      displaceY: number;
      parallaxX: number;
      parallaxY: number;
      opacity?: number;
      scale?: number;
    };
  }>({});
  const floatConfigRef = useRef<{
    [key: string]: {
      speedX: number;
      speedY: number;
      ampX: number;
      ampY: number;
      phaseX: number;
      phaseY: number;
    };
  }>({});

  const mouseXRef = useRef<number>(500);
  const mouseYRef = useRef<number>(375);
  const mouseActiveRef = useRef<boolean>(false);

  const parallaxTargetXRef = useRef<number>(0);
  const parallaxTargetYRef = useRef<number>(0);
  const parallaxCurrentXRef = useRef<number>(0);
  const parallaxCurrentYRef = useRef<number>(0);

  const activePhaseRef = useRef<number>(1);
  const hoveredNodeRef = useRef<string | null>(null);

  // Keep state refs in sync
  useEffect(() => {
    activePhaseRef.current = activePhase;
  }, [activePhase]);

  useEffect(() => {
    hoveredNodeRef.current = hoveredNode;
  }, [hoveredNode]);

  // Viewport dimensions & scaling
  const canvasWidth = 1000;
  const canvasHeight = 750;
  const centerX = canvasWidth / 2; // 500
  const centerY = canvasHeight / 2; // 375

  const innerRx = 185;
  const innerRy = 125;
  const middleRx = 305;
  const middleRy = 205;
  const outerRx = 430;
  const outerRy = 290;

  // Track scroll position of the sticky runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const timelineHeight = useTransform(scrollYProgress, [0.08, 0.92], ["0%", "100%"], { clamp: true });
  const cardsY = useTransform(scrollYProgress, [0, 1], ["200px", "-650px"]);

  // Set active scroll phase
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let phase = 1;
      if (latest < 0.2) phase = 1;
      else if (latest < 0.4) phase = 2;
      else if (latest < 0.6) phase = 3;
      else if (latest < 0.8) phase = 4;
      else phase = 5;
      setActivePhase(phase);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Responsive scale handler
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) setScale(0.32);
      else if (w < 640) setScale(0.42);
      else if (w < 768) setScale(0.55);
      else if (w < 1024) setScale(0.68);
      else if (w < 1280) setScale(0.8);
      else setScale(0.9);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Helper bindings for refs
  const setNodeRef = (id: string, el: HTMLDivElement | null) => {
    nodeRefs.current[id] = el;
  };
  const setLineRef = (id: string, el: SVGPathElement | null) => {
    lineRefs.current[id] = el;
  };

  // Setup Base Coordinates, Dynamic Coord Structures & Unique Seeded Floats
  useEffect(() => {
    // 1. Calculate static base coordinates
    techNodes.forEach((node) => {
      baseCoordsRef.current[node.id] = getNodeCoords(
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
    });
    baseCoordsRef.current["varunyacore"] = { x: centerX, y: centerY, rad: 0 };

    // 2. Initialize dynamic states
    const allNodeIds = [...techNodes.map((n) => n.id), "varunyacore"];
    allNodeIds.forEach((id) => {
      dynamicCoordsRef.current[id] = {
        x: baseCoordsRef.current[id].x,
        y: baseCoordsRef.current[id].y,
        floatX: 0,
        floatY: 0,
        displaceX: 0,
        displaceY: 0,
        parallaxX: 0,
        parallaxY: 0,
        opacity: 0,
        scale: 0.9,
      };
    });

    // 3. Setup float speed configs (duration range: 6 - 15 seconds)
    techNodes.forEach((node, idx) => {
      const durationX = 6 + (idx % 7) * 1.5;
      const durationY = 6 + ((idx + 3) % 7) * 1.5;
      const speedX = (2 * Math.PI) / durationX;
      const speedY = (2 * Math.PI) / durationY;

      // Subtle float magnitude: 8px to 20px
      const ampX = 8 + (idx % 5) * 3;
      const ampY = 8 + ((idx + 2) % 5) * 3;

      const phaseX = (idx * 0.7) % (2 * Math.PI);
      const phaseY = (idx * 1.3) % (2 * Math.PI);

      floatConfigRef.current[node.id] = { speedX, speedY, ampX, ampY, phaseX, phaseY };
    });

    floatConfigRef.current["varunyacore"] = {
      speedX: (2 * Math.PI) / 12,
      speedY: (2 * Math.PI) / 15,
      ampX: 4,
      ampY: 4,
      phaseX: 0,
      phaseY: Math.PI / 2,
    };
  }, [centerX, centerY, innerRx, innerRy, middleRx, middleRy, outerRx, outerRy]);

  // Capture mouse events for repulsion and parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = canvasRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // Correct mouse position scaling to fit 1000x750 canvas coordinate space
    const mx = ((e.clientX - rect.left) / rect.width) * canvasWidth;
    const my = ((e.clientY - rect.top) / rect.height) * canvasHeight;

    mouseXRef.current = mx;
    mouseYRef.current = my;
    mouseActiveRef.current = true;

    // Track centered offset ratios (-1 to 1) for camera depth parallax
    const px = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const py = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    parallaxTargetXRef.current = px;
    parallaxTargetYRef.current = py;
  };

  const handleMouseLeave = () => {
    mouseActiveRef.current = false;
    parallaxTargetXRef.current = 0;
    parallaxTargetYRef.current = 0;
  };

  // Core high-performance animation render loop
  useEffect(() => {
    let animId: number;
    let t = 0;

    const update = () => {
      t += 0.015; // standard incremental step

      // 1. Smoothly update global parallax coordinate drifts (ease-out lerp)
      const parallaxLerp = 0.06;
      parallaxCurrentXRef.current += (parallaxTargetXRef.current - parallaxCurrentXRef.current) * parallaxLerp;
      parallaxCurrentYRef.current += (parallaxTargetYRef.current - parallaxCurrentYRef.current) * parallaxLerp;

      const currentPhase = activePhaseRef.current;
      const currentHovered = hoveredNodeRef.current;
      const isMouseActive = mouseActiveRef.current;
      const mx = mouseXRef.current;
      const my = mouseYRef.current;

      const repulsionRadius = 120;
      const maxPush = 16;
      const lerpSpeed = 0.1;

      const allNodes = [...techNodes, { id: "varunyacore", category: "core" as const }];

      // 2. Animate and position technology node cards
      allNodes.forEach((node) => {
        const id = node.id;
        const el = nodeRefs.current[id];
        if (!el) return;

        const base = baseCoordsRef.current[id];
        const dynamic = dynamicCoordsRef.current[id];
        const floatCfg = floatConfigRef.current[id];
        if (!base || !dynamic || !floatCfg) return;

        // A. Subtle float oscillation offsets
        dynamic.floatX = Math.sin(t * floatCfg.speedX + floatCfg.phaseX) * floatCfg.ampX;
        dynamic.floatY = Math.cos(t * floatCfg.speedY + floatCfg.phaseY) * floatCfg.ampY;

        // B. Dynamic cursor repulsion push-away
        let targetPushX = 0;
        let targetPushY = 0;

        if (isMouseActive && id !== "varunyacore") {
          const dx = base.x + dynamic.floatX - mx;
          const dy = base.y + dynamic.floatY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repulsionRadius && dist > 0) {
            const force = 1 - dist / repulsionRadius;
            targetPushX = (dx / dist) * force * maxPush;
            targetPushY = (dy / dist) * force * maxPush;
          }
        }

        dynamic.displaceX += (targetPushX - dynamic.displaceX) * lerpSpeed;
        dynamic.displaceY += (targetPushY - dynamic.displaceY) * lerpSpeed;

        // C. Camera depth parallax shifts (3 layers)
        let parallaxMult = 0;
        if (node.category === "outer") parallaxMult = 8;
        else if (node.category === "middle") parallaxMult = 14;
        else if (node.category === "inner") parallaxMult = 20;
        else if (id === "varunyacore") parallaxMult = 4; // stable core anchor

        dynamic.parallaxX = parallaxCurrentXRef.current * parallaxMult;
        dynamic.parallaxY = parallaxCurrentYRef.current * parallaxMult;

        // D. Combine vectors to get final coordinate
        dynamic.x = base.x + dynamic.floatX + dynamic.displaceX + dynamic.parallaxX;
        dynamic.y = base.y + dynamic.floatY + dynamic.displaceY + dynamic.parallaxY;

        // E. State evaluation for scroll storytelling & hovers
        let isNodeActive = false;
        if (currentPhase === 5) {
          isNodeActive = true;
        } else {
          const list = phaseNodes[currentPhase as 1 | 2 | 3 | 4 | 5];
          if (list && list.includes(id)) isNodeActive = true;
        }
        if (id === "varunyacore") isNodeActive = true;

        let state: "highlighted" | "normal" | "dimmed" = "normal";

        if (!isNodeActive) {
          state = "dimmed";
        } else if (currentHovered) {
          const isNeighbor =
            id === currentHovered ||
            id === "varunyacore" ||
            techConnections.some(
              (c) => (c.from === id && c.to === currentHovered) || (c.to === id && c.from === currentHovered)
            );

          state = isNeighbor ? "highlighted" : "dimmed";
        }

        // Apply attribute indicator (supports styling state modifiers)
        if (el.getAttribute("data-state") !== state) {
          el.setAttribute("data-state", state);
        }

        // F. Calculate target opacity & scale
        let targetOpacity = 1.0;
        let targetScale = 1.0;

        if (id === "varunyacore") {
          targetOpacity = 1.0;
          targetScale = currentHovered === "varunyacore" ? 1.04 : 1.0;
        } else if (state === "dimmed") {
          targetOpacity = 0.08;
          targetScale = 0.88;
        } else if (state === "highlighted") {
          targetOpacity = 1.0;
          targetScale = id === currentHovered ? 1.08 : 1.03;
        } else {
          targetOpacity = 1.0;
          targetScale = 1.0;
        }

        // G. Lerp style transitions
        if (dynamic.opacity === undefined || dynamic.scale === undefined) {
          dynamic.opacity = targetOpacity;
          dynamic.scale = targetScale;
        } else {
          dynamic.opacity += (targetOpacity - dynamic.opacity) * lerpSpeed;
          dynamic.scale += (targetScale - dynamic.scale) * lerpSpeed;
        }

        // H. Update DOM elements directly for 60fps performance
        el.style.transform = `translate3d(${dynamic.x.toFixed(1)}px, ${dynamic.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${dynamic.scale.toFixed(3)})`;
        el.style.opacity = dynamic.opacity.toFixed(3);
      });

      // 3. Draw inter-node connection lines (the web)
      techConnections.forEach((conn) => {
        const lineId = `${conn.from}-${conn.to}`;
        const lineEl = lineRefs.current[lineId];
        if (!lineEl) return;

        const fromNode = dynamicCoordsRef.current[conn.from];
        const toNode = dynamicCoordsRef.current[conn.to];
        if (!fromNode || !toNode) return;

        // Draw smooth Bezier curve
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const px = -dy / dist;
        const py = dx / dist;
        const ctrlX = midX + px * (dist * 0.1);
        const ctrlY = midY + py * (dist * 0.1);

        lineEl.setAttribute("d", `M ${fromNode.x.toFixed(1)} ${fromNode.y.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${toNode.x.toFixed(1)} ${toNode.y.toFixed(1)}`);

        // Compute curve opacity
        const fromActive = currentPhase === 5 || phaseNodes[currentPhase as 1 | 2 | 3 | 4 | 5]?.includes(conn.from);
        const toActive = currentPhase === 5 || phaseNodes[currentPhase as 1 | 2 | 3 | 4 | 5]?.includes(conn.to);

        let targetOpacity = 0.0;
        let isHighlighted = false;

        if (fromActive && toActive) {
          if (!currentHovered) {
            targetOpacity = 0.05; // faint network web
          } else if (conn.from === currentHovered || conn.to === currentHovered) {
            targetOpacity = 0.7; // highlight connection path
            isHighlighted = true;
          } else {
            targetOpacity = 0.0; // fade out unrelated paths
          }
        }

        const prevOpacity = parseFloat(lineEl.style.opacity) || 0;
        const newOpacity = prevOpacity + (targetOpacity - prevOpacity) * lerpSpeed;
        lineEl.style.opacity = newOpacity.toFixed(3);

        // Apply running shimmer pulse along highlighted connection paths
        if (isHighlighted) {
          lineEl.style.strokeDasharray = "5 10";
          lineEl.style.strokeDashoffset = (t * -25).toFixed(1);
        } else {
          lineEl.style.strokeDasharray = "none";
          lineEl.style.strokeDashoffset = "0";
        }
      });

      // 4. Draw radial connections to center core
      techNodes.forEach((node) => {
        const lineId = `radial-${node.id}`;
        const lineEl = lineRefs.current[lineId];
        if (!lineEl) return;

        const nodeCoords = dynamicCoordsRef.current[node.id];
        const centerCoords = dynamicCoordsRef.current["varunyacore"];
        if (!nodeCoords || !centerCoords) return;

        const midX = (centerCoords.x + nodeCoords.x) / 2;
        const midY = (centerCoords.y + nodeCoords.y) / 2;
        const dx = nodeCoords.x - centerCoords.x;
        const dy = nodeCoords.y - centerCoords.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const px = -dy / dist;
        const py = dx / dist;
        const ctrlX = midX + px * 32;
        const ctrlY = midY + py * 32;

        lineEl.setAttribute("d", `M ${centerCoords.x.toFixed(1)} ${centerCoords.y.toFixed(1)} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${nodeCoords.x.toFixed(1)} ${nodeCoords.y.toFixed(1)}`);

        // Compute radial path opacity
        const nodeActive = currentPhase === 5 || phaseNodes[currentPhase as 1 | 2 | 3 | 4 | 5]?.includes(node.id);

        let targetOpacity = 0.0;
        let isHighlighted = false;

        if (nodeActive) {
          if (!currentHovered) {
            targetOpacity = 0.08; // normal radial lines
          } else if (node.id === currentHovered) {
            targetOpacity = 0.8; // active focus node connection
            isHighlighted = true;
          } else if (
            techConnections.some(
              (c) => (c.from === node.id && c.to === currentHovered) || (c.to === node.id && c.from === currentHovered)
            )
          ) {
            targetOpacity = 0.2; // neighbors are semi-dimmed
          } else {
            targetOpacity = 0.01;
          }
        }

        const prevOpacity = parseFloat(lineEl.style.opacity) || 0;
        const newOpacity = prevOpacity + (targetOpacity - prevOpacity) * lerpSpeed;
        lineEl.style.opacity = newOpacity.toFixed(3);

        if (isHighlighted) {
          lineEl.style.strokeDasharray = "5 10";
          lineEl.style.strokeDashoffset = (t * -25).toFixed(1);
        } else {
          lineEl.style.strokeDasharray = "none";
          lineEl.style.strokeDashoffset = "0";
        }
      });

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      id="tech-map"
      className="relative w-full bg-[#040404]"
      style={{ height: "400vh" }} // Sticky scroll runway height (4 screen heights)
    >
      {/* Sticky full-screen view wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col lg:flex-row justify-center items-center z-10 py-12 lg:py-0">
        
        {/* Glow backdrop behind Varunya Core */}
        <motion.div
          animate={{ scale: [1.0, 1.04, 1.0] }}
          transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/[0.04] blur-[120px] pointer-events-none z-0"
        />

        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row h-full items-center justify-between py-12 lg:py-0 gap-8">
          
          {/* Scroll Storytelling Section (Left Column) - Desktop only */}
          <div className="hidden lg:flex w-full lg:w-5/12 flex-col justify-start relative z-20 pointer-events-none lg:pl-16">
            
            {/* Symmetrical High-End Title */}
            <div className="flex flex-col gap-2 mb-10 text-left pointer-events-auto">
              <span className="text-xs tracking-[0.35em] text-[#888893] font-semibold uppercase font-mono">
                Technology Stack
              </span>
              <h2
                className="font-normal text-3xl xl:text-4xl tracking-tight text-white leading-[1.15]"
                style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
              >
                Engineered for absolute performance.
              </h2>
            </div>

            {/* Timeline progress tracker */}
            <div className="absolute -left-6 top-1/4 bottom-1/4 w-[1px] bg-white/5 flex flex-col justify-between items-center py-2">
              <motion.div
                style={{ height: timelineHeight }}
                className="absolute top-0 w-[1px] bg-gradient-to-b from-cyan-400 to-indigo-500 origin-top"
              />
              {[1, 2, 3, 4, 5].map((ph) => (
                <div
                  key={ph}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-mono tracking-tighter border transition-all duration-500 relative -left-[13px] z-10 cursor-pointer pointer-events-auto shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                  style={{
                    backgroundColor: activePhase === ph ? "#080808" : "rgba(4,4,4,0.9)",
                    borderColor: activePhase === ph ? "#22d3ee" : "rgba(255,255,255,0.05)",
                    color: activePhase === ph ? "#22d3ee" : "rgba(255,255,255,0.3)"
                  }}
                  onClick={() => {
                    const container = containerRef.current;
                    if (container) {
                      const start = container.offsetTop;
                      const height = container.offsetHeight;
                      // Line up centered targets for scroll locations
                      const targetScroll = start + height * (0.05 + (ph - 1) * 0.22);
                      window.scrollTo({ top: targetScroll, behavior: "smooth" });
                    }
                  }}
                >
                  0{ph}
                </div>
              ))}
            </div>

            {/* Fading sliding storytelling cards container */}
            <div className="relative h-[480px] overflow-hidden">
              <motion.div
                style={{ y: cardsY }}
                className="flex flex-col gap-8 absolute w-full"
              >
                {phases.map((ph, idx) => {
                  const active = activePhase === ph.id;
                  return (
                    <div
                      key={ph.id}
                      className="px-6 py-6 rounded-2xl border transition-all duration-500 backdrop-blur-md flex flex-col pointer-events-auto cursor-pointer select-none"
                      style={{
                        opacity: active ? 1.0 : 0.12,
                        scale: active ? 1.02 : 0.96,
                        borderColor: active ? "rgba(22, 182, 212, 0.2)" : "rgba(255,255,255,0.02)",
                        backgroundColor: active ? "rgba(4, 4, 4, 0.55)" : "rgba(4, 4, 4, 0.1)",
                        boxShadow: active ? "0 4px 30px rgba(0, 0, 0, 0.5)" : "none",
                        transformOrigin: "left center",
                        height: "210px",
                      }}
                      onClick={() => {
                        const container = containerRef.current;
                        if (container) {
                          const start = container.offsetTop;
                          const height = container.offsetHeight;
                          const targetScroll = start + height * (0.05 + idx * 0.22);
                          window.scrollTo({ top: targetScroll, behavior: "smooth" });
                        }
                      }}
                    >
                      <span className="text-[9px] font-mono tracking-[0.2em] text-cyan-400 font-bold uppercase mb-1">
                        PHASE 0{ph.id} {" // "} {ph.title}
                      </span>
                      <h3
                        className="text-lg text-white font-normal mb-2"
                        style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                      >
                        {ph.subtitle}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#888893] mb-3 font-light">
                        {ph.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {ph.tags.map((t, tIdx) => (
                          <span key={tIdx} className="text-[7.5px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/40 uppercase tracking-wider">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Interactive Network Map Container (Right Column) */}
          {!isMobile && (
            <div
              ref={canvasRef}
              className="w-full lg:w-7/12 flex items-center justify-center relative overflow-visible pb-16 lg:pb-0 h-3/4 lg:h-full cursor-grab active:cursor-grabbing"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setClickedNode(null);
                }
              }}
            >
            {/* 1000x750 coordinate canvas scaled responsively */}
            <div
              style={{
                width: `${canvasWidth * scale}px`,
                height: `${canvasHeight * scale}px`,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible",
              }}
              className="flex-shrink-0 transition-all duration-300 ease-out pointer-events-none"
            >
              <div
                className="relative flex-shrink-0 transition-transform duration-100 ease-out origin-center absolute pointer-events-auto"
                style={{
                  width: `${canvasWidth}px`,
                  height: `${canvasHeight}px`,
                  transform: `scale(${scale})`,
                }}
              >
                {/* SVG Connections Layer */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                >
                  {/* Concentric Reference Rings */}
                  <ellipse
                    cx={centerX}
                    cy={centerY}
                    rx={innerRx}
                    ry={innerRy}
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.02)"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                  <ellipse
                    cx={centerX}
                    cy={centerY}
                    rx={middleRx}
                    ry={middleRy}
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.015)"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                  />
                  <ellipse
                    cx={centerX}
                    cy={centerY}
                    rx={outerRx}
                    ry={outerRy}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.01)"
                    strokeWidth="1"
                    strokeDasharray="5 7"
                  />

                  {/* Inter-Node Connections */}
                  {techConnections.map((conn) => {
                    const id = `${conn.from}-${conn.to}`;
                    const fromNode = techNodes.find((n) => n.id === conn.from);
                    return (
                      <path
                        key={id}
                        ref={(el) => setLineRef(id, el)}
                        fill="none"
                        stroke={fromNode?.color || "rgba(255, 255, 255, 0.06)"}
                        strokeWidth="1.2"
                        className="transition-colors duration-300"
                        style={{ willChange: "transform, opacity, stroke-dashoffset" }}
                      />
                    );
                  })}

                  {/* Radial Center Anchor Connections */}
                  {techNodes.map((node) => {
                    const id = `radial-${node.id}`;
                    return (
                      <path
                        key={id}
                        ref={(el) => setLineRef(id, el)}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="1.2"
                        className="transition-colors duration-300"
                        style={{ willChange: "transform, opacity, stroke-dashoffset" }}
                      />
                    );
                  })}
                </svg>

                {/* Tech Node Cards */}
                {techNodes.map((node) => {
                  const active = hoveredNode === node.id;
                  const clicked = clickedNode === node.id;
                  const isNodeActive = activePhase === 5 || phaseNodes[activePhase as 1|2|3|4|5]?.includes(node.id);

                  return (
                    <div
                      key={node.id}
                      ref={(el) => setNodeRef(node.id, el)}
                      className="absolute origin-center select-none cursor-pointer"
                      style={{
                        left: 0,
                        top: 0,
                        position: "absolute",
                        willChange: "transform, opacity",
                        zIndex: active ? 40 : clicked ? 35 : 10,
                        pointerEvents: isNodeActive ? "auto" : "none",
                      }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setClickedNode(node.id)}
                    >
                      <div
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 border backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                        style={{
                          borderColor: active ? node.color : "rgba(255,255,255,0.04)",
                          backgroundColor: active ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.015)",
                          boxShadow: active ? `0 0 20px ${node.color}25` : "none",
                        }}
                      >
                        <div
                          className="w-7 h-7 flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                          style={{
                            color: active ? "#ffffff" : node.color,
                            filter: active ? `drop-shadow(0 0 4px ${node.color})` : "none",
                          }}
                        >
                          {node.svgPath}
                        </div>
                        <span
                          className="text-[10px] uppercase tracking-[0.16em] font-semibold font-mono transition-colors duration-300"
                          style={{
                            color: active ? "#ffffff" : "rgba(255,255,255,0.5)",
                            textShadow: active ? `0 0 4px ${node.color}40` : "none",
                          }}
                        >
                          {node.name}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Central Permanent Anchor Node (Varunya Core) */}
                <div
                  ref={(el) => setNodeRef("varunyacore", el)}
                  className="absolute origin-center pointer-events-auto select-none cursor-pointer"
                  style={{
                    left: 0,
                    top: 0,
                    position: "absolute",
                    willChange: "transform, opacity",
                    zIndex: 25,
                  }}
                  onClick={() => setClickedNode("varunyacore")}
                  onMouseEnter={() => setHoveredNode("varunyacore")}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="w-48 h-48 rounded-2xl bg-neutral-950/90 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center relative shadow-[0_0_60px_rgba(6,182,212,0.12)] hover:border-cyan-400/40 hover:shadow-[0_0_80px_rgba(6,182,212,0.22)] transition-all duration-500">
                    <motion.div
                      className="absolute inset-3 rounded-full border border-dashed border-cyan-400/20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    />
                    <Image
                      src="/VT_logo.png"
                      alt="Varunya Core Logo"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    />

                    <span className="text-[10px] uppercase tracking-[0.25em] text-white mt-3.5 font-bold font-mono relative z-10">
                      Varunya Core
                    </span>
                    <span className="text-[7.5px] uppercase tracking-[0.16em] text-[#888893] mt-1 font-semibold font-mono relative z-10">
                      AI OS Ecosystem
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          )}

          {/* Mobile-Optimized Grid & Telemetry layout */}
          {isMobile && (
            <div className="w-full h-full flex flex-col justify-between py-4 text-white relative z-10">
              {/* Title & Phase Header */}
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-[10px] tracking-[0.3em] text-[#888893] font-bold uppercase font-mono">
                  Technology Stack
                </span>
                <h2 
                  className="text-xl font-normal tracking-tight text-white"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Phase 0{activePhase}: {phases[activePhase - 1].title}
                </h2>
              </div>

              {/* Center visual: Varunya Core Hub and connecting grid */}
              <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
                {/* Glow backdrop behind Varunya Core */}
                <div className="absolute w-24 h-24 rounded-full bg-cyan-500/[0.08] blur-xl animate-pulse" />
                
                {/* Central Core Node */}
                <div 
                  onClick={() => setClickedNode("varunyacore")}
                  className="w-16 h-16 rounded-xl bg-neutral-950/90 border border-cyan-400/30 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer active:scale-95 transition-transform"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-cyan-400 fill-current drop-shadow-[0_0_4px_rgba(6,182,212,0.5)]">
                    <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" className="fill-none stroke-current" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                  <span className="text-[6.5px] uppercase tracking-widest text-white mt-0.5 font-bold font-mono">Core</span>
                </div>

                <div className="w-full max-w-xs h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent my-4" />
                
                {/* Active Phase Nodes Grid */}
                <div className="w-full max-h-[35vh] overflow-y-auto px-1 py-1 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                    <AnimatePresence mode="popLayout">
                      {techNodes
                        .filter(node => phaseNodes[activePhase as 1|2|3|4|5].includes(node.id))
                        .map((node, idx) => (
                          <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.2) }}
                            onClick={() => setClickedNode(node.id)}
                            className="flex items-center gap-2 p-2.5 rounded-xl border bg-neutral-900/30 backdrop-blur-md cursor-pointer active:scale-95 transition-transform"
                            style={{
                              borderColor: `${node.color}20`,
                              boxShadow: `0 2px 6px rgba(0,0,0,0.3)`,
                            }}
                          >
                            <div 
                              className="w-4.5 h-4.5 flex items-center justify-center flex-shrink-0"
                              style={{ color: node.color }}
                            >
                              {node.svgPath}
                            </div>
                            <span className="text-[8.5px] uppercase tracking-wider font-semibold font-mono text-white/80 truncate">
                              {node.name}
                            </span>
                          </motion.div>
                        ))
                      }
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Bottom active description panel */}
              <div className="w-full bg-neutral-950/80 border border-white/5 backdrop-blur-md p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-mono tracking-[0.25em] text-[#888893] font-bold uppercase">
                    PHASE 0{activePhase} {" // "} {phases[activePhase - 1].title}
                  </span>
                  <span className="text-[7.5px] font-mono text-cyan-400 animate-pulse">Scroll to navigate</span>
                </div>
                <h3
                  className="text-xs text-white font-normal mb-1"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  {phases[activePhase - 1].subtitle}
                </h3>
                <p className="text-[9.5px] leading-relaxed text-[#888893] font-light">
                  {phases[activePhase - 1].description}
                </p>
              </div>
            </div>
          )}

          {/* Symmetrical Guide Footer (Desktop) */}
          <div className="hidden lg:flex absolute bottom-8 left-16 right-16 justify-between items-center font-mono text-[9px] tracking-[0.25em] text-[#888893] uppercase pointer-events-none">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.0, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              />
              <span>Scroll to explore phases</span>
            </div>
            <span>Click nodes to expand detailed telemetry</span>
          </div>

        </div>
      </div>

      {/* Mobile/Tablet Active Story Overlay (Bottom Overlay Card) - Hidden in favor of inline mobile layout */}
      {!isMobile && (
        <div className="lg:hidden absolute bottom-6 left-6 right-6 z-30 pointer-events-auto">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-neutral-950/90 border border-white/10 backdrop-blur-md p-5 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-mono tracking-[0.2em] text-cyan-400 font-bold uppercase">
                PHASE 0{activePhase} {" // "} {phases[activePhase - 1].title}
              </span>
              <span className="text-[8px] font-mono text-white/40">Scroll to explore</span>
            </div>
            <h3
              className="text-base text-white font-normal mb-1.5"
              style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
            >
              {phases[activePhase - 1].subtitle}
            </h3>
            <p className="text-[11px] leading-relaxed text-[#888893] mb-3">
              {phases[activePhase - 1].description}
            </p>
            <div className="flex flex-wrap gap-1">
              {phases[activePhase - 1].tags.map((t, idx) => (
                <span key={idx} className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/50 uppercase tracking-wider">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Details Side Panel Overlay */}
      <AnimatePresence>
        {clickedNode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed top-0 right-0 w-full sm:w-[420px] h-screen bg-neutral-950/85 backdrop-blur-2xl border-l border-white/10 p-8 flex flex-col justify-between z-50 shadow-[0_0_50px_rgba(0,0,0,0.85)] overflow-y-auto"
          >
            <div>
              {/* Panel Header */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] tracking-[0.25em] text-cyan-400 font-bold uppercase font-mono">
                  {clickedNode === "varunyacore" ? "core orchestrator" : `${techNodes.find((n) => n.id === clickedNode)?.category} layer`}
                </span>
                <button
                  onClick={() => setClickedNode(null)}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer text-white/60 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Brand logo/icon & Name */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10"
                  style={{
                    color: clickedNode === "varunyacore" ? "#22d3ee" : techNodes.find((n) => n.id === clickedNode)?.color
                  }}
                >
                  {clickedNode === "varunyacore" ? (
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                      <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" className="fill-none stroke-current" strokeWidth="1.2" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  ) : (
                    techNodes.find((n) => n.id === clickedNode)?.svgPath
                  )}
                </div>
                <div>
                  <h3
                    className="text-2xl font-normal text-white tracking-wide"
                    style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                  >
                    {clickedNode === "varunyacore" ? "Varunya Core" : techNodes.find((n) => n.id === clickedNode)?.name}
                  </h3>
                  <span className="text-[11px] text-white/50 tracking-wider uppercase font-mono">
                    {techDetails[clickedNode]?.purpose}
                  </span>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full my-6" />

              {/* Specific Content Blocks */}
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#888893] font-mono block mb-1">
                    Role in Architecture
                  </span>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-semibold"
                    style={{
                      backgroundColor: clickedNode === "varunyacore" ? "rgba(34,211,238,0.1)" : `${techNodes.find((n) => n.id === clickedNode)?.color}10`,
                      color: clickedNode === "varunyacore" ? "#22d3ee" : techNodes.find((n) => n.id === clickedNode)?.color,
                      border: `1px solid ${clickedNode === "varunyacore" ? "rgba(34,211,238,0.3)" : `${techNodes.find((n) => n.id === clickedNode)?.color}30`}`
                    }}
                  >
                    {techDetails[clickedNode]?.role}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#888893] font-mono block mb-1">
                    Why Varunya Uses It
                  </span>
                  <p className="text-sm leading-relaxed text-white/80 font-sans font-light">
                    {techDetails[clickedNode]?.whyVarunya}
                  </p>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#888893] font-mono block mb-1">
                    Active Deployments
                  </span>
                  <ul className="space-y-2 mt-2">
                    {techDetails[clickedNode]?.projects.map((proj, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-white/70 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                        {proj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="mt-12 text-[8px] tracking-[0.3em] uppercase text-[#888893] font-mono border-t border-white/5 pt-4 text-center">
              Varunya Technology Stack • Telemetry System
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
