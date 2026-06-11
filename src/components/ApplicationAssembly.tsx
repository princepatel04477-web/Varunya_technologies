"use client";

import { useEffect, useRef, useState } from "react";

interface ApplicationAssemblyProps {
  stepBody?: string;
}

export default function ApplicationAssembly({ stepBody }: ApplicationAssemblyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Parallax offsets
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const parallaxX = useRef(0);
  const parallaxY = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.current = x * 20; // Max 10px drift
    mouseY.current = y * 20;
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const resizeCanvas = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Color tokens
    const colorIvory = "rgba(234, 229, 201, 1)"; // #eae5c9
    const colorTeal = "rgba(61, 165, 138, 1)";    // #3da58a

    // 1. Core System Modules structure
    interface SystemModule {
      id: number;
      name: string;
      relX: number; // relative to center
      relY: number;
      w: number;
      h: number;
      opacity: number;
      constructionProgress: number;
      isActive: boolean;
    }

    const staticModules: SystemModule[] = [
      { id: 0, name: "Frontend", relX: -45, relY: -48, w: 32, h: 22, opacity: 0.15, constructionProgress: 0, isActive: true },
      { id: 1, name: "Backend", relX: 18, relY: -48, w: 32, h: 22, opacity: 0.15, constructionProgress: 0, isActive: true },
      { id: 2, name: "Database", relX: 18, relY: 18, w: 32, h: 22, opacity: 0.15, constructionProgress: 0, isActive: true },
      { id: 3, name: "Authentication", relX: -45, relY: 18, w: 32, h: 22, opacity: 0.15, constructionProgress: 0, isActive: true },
    ];

    // Dynamic Evolution Module ("Integration Hub")
    let dynamicModule: SystemModule = {
      id: 4,
      name: "Integration Hub",
      relX: -16,
      relY: -11,
      w: 32,
      h: 20,
      opacity: 0,
      constructionProgress: 0,
      isActive: false,
    };

    // 2. Data signal paths & connections
    interface PathSegment {
      fromId: number;
      toId: number;
      coords: { x: number; y: number }[];
    }

    // 3. Signal particles traveling along paths
    interface Particle {
      pathIdx: number;
      progress: number;
      speed: number;
      size: number;
      color: string;
    }

    const particles: Particle[] = [];

    // 4. Floating labels candidates
    const labelCandidates = [
      "Frontend",
      "Backend",
      "API Layer",
      "Database",
      "Authentication",
      "Services",
      "Infrastructure",
      "Event Stream",
      "Application Core",
      "Deployment Layer",
      "Queue System",
      "Integration Hub",
    ];

    interface FloatingLabel {
      elem: HTMLDivElement;
      moduleIdx: number; // index in [staticModules, dynamicModule]
      textIdx: number;
      state: "fadeIn" | "hold" | "fadeOut" | "dead";
      life: number;
      maxLife: number;
      opacity: number;
      driftX: number;
      driftY: number;
      phase: number;
      scaleModifier: number;
    }

    const activeLabels: FloatingLabel[] = [];
    if (labelsContainerRef.current) {
      const children = labelsContainerRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const elem = children[i] as HTMLDivElement;
        const moduleIdx = Math.floor(Math.random() * 5); // 0 to 4
        const textIdx = Math.floor(Math.random() * labelCandidates.length);
        const maxLife = 4.0 + Math.random() * 2.0;

        elem.querySelector("span")!.innerText = labelCandidates[textIdx];

        activeLabels.push({
          elem,
          moduleIdx,
          textIdx,
          state: "fadeIn",
          life: maxLife,
          maxLife,
          opacity: 0,
          driftX: (Math.random() - 0.5) * 8,
          driftY: (Math.random() - 0.5) * 8,
          phase: Math.random() * Math.PI * 2,
          scaleModifier: 1.0,
        });
      }
    }

    let loopTimer = 0;
    const loopDuration = 15.0; // 15s assembly cycle

    let dynamicEvolutionTimer = 0;
    const dynamicEvolutionCycle = 10.0; // Dynamic module appears every 10s

    let animationFrameId: number;
    let lastTime = performance.now();

    // Render loop
    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Smooth parallax interpolation
      parallaxX.current += (mouseX.current - parallaxX.current) * 0.08;
      parallaxY.current += (mouseY.current - parallaxY.current) * 0.08;

      const cx = width / 2;
      const cy = height / 2 - 10;

      loopTimer = (loopTimer + delta) % loopDuration;
      dynamicEvolutionTimer += delta;

      // Handle the dynamic spawning module lifecycle (every 10s)
      const evoTime = dynamicEvolutionTimer % dynamicEvolutionCycle;
      if (evoTime < 4.0) {
        // Spawning: Fade in & construct
        dynamicModule.isActive = true;
        dynamicModule.opacity = Math.min(1.0, evoTime / 0.8) * 0.5;
        dynamicModule.constructionProgress = Math.min(1.0, evoTime / 2.0);
      } else if (evoTime >= 4.0 && evoTime < 8.0) {
        // Operational/Connected: Solid
        dynamicModule.isActive = true;
        dynamicModule.opacity = 0.5;
        dynamicModule.constructionProgress = 1.0;
      } else {
        // Fading out
        dynamicModule.opacity = Math.max(0, 1.0 - (evoTime - 8.0) / 1.5) * 0.5;
        if (dynamicModule.opacity <= 0.01) {
          dynamicModule.isActive = false;
        }
      }

      // Loop phase stages:
      // 0.0 - 3.0s: Foundation (Grid, Core frame drawings)
      // 3.0 - 6.0s: Components (Modules building)
      // 6.0 - 9.0s: Connections (Pathways trace-in)
      // 9.0 - 12.0s: Data Flow (Signal particles flow)
      // 12.0 - 15.0s: Operational System (Pulse glow, fully functional)
      const stage = Math.floor(loopTimer / 3.0);
      const stageTime = loopTimer % 3.0;

      // --------------------------------------------------
      // LAYER 1: Assembly Grid (Slowest Parallax)
      // --------------------------------------------------
      const gridOffsetLimit = 0.18;
      const gx = parallaxX.current * gridOffsetLimit;
      const gy = parallaxY.current * gridOffsetLimit;

      ctx.strokeStyle = "rgba(234, 229, 201, 0.014)";
      ctx.lineWidth = 0.55;
      const gridSize = 32;

      for (let x = gx % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = gy % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --------------------------------------------------
      // LAYER 2: Core Frame & Architecture Window (Medium Parallax)
      // --------------------------------------------------
      const frameOffsetLimit = 0.45;
      const fx = cx + parallaxX.current * frameOffsetLimit;
      const fy = cy + parallaxY.current * frameOffsetLimit;

      const windowW = 120;
      const windowH = 135;
      const wx = fx - windowW / 2;
      const wy = fy - windowH / 2;

      // Draw outer window border
      let frameDrawProgress = 1.0;
      if (stage === 0) {
        frameDrawProgress = Math.min(1.0, stageTime / 1.5);
      }

      ctx.strokeStyle = `rgba(234, 229, 201, ${isHovered ? 0.095 : 0.045})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      // Draw border starting from top-left corner
      const perimeter = 2 * (windowW + windowH);
      const activeLength = frameDrawProgress * perimeter;
      ctx.setLineDash([4, 4]); // Engineering style dash
      ctx.roundRect(wx, wy, windowW, windowH, 4);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Corner coordinate tick marks
      ctx.strokeStyle = "rgba(234, 229, 201, 0.08)";
      ctx.lineWidth = 0.5;
      // top-left
      ctx.beginPath();
      ctx.moveTo(wx - 4, wy); ctx.lineTo(wx + 8, wy);
      ctx.moveTo(wx, wy - 4); ctx.lineTo(wx, wy + 8);
      ctx.stroke();
      // bottom-right
      ctx.beginPath();
      ctx.moveTo(wx + windowW - 8, wy + windowH); ctx.lineTo(wx + windowW + 4, wy + windowH);
      ctx.moveTo(wx + windowW, wy + windowH - 8); ctx.lineTo(wx + windowW, wy + windowH + 4);
      ctx.stroke();

      // --------------------------------------------------
      // LAYER 3: Connections & Routing Pathways (Medium Parallax)
      // --------------------------------------------------
      // Node position helpers
      const getModuleCenter = (mod: SystemModule) => {
        return {
          x: fx + mod.relX + mod.w / 2,
          y: fy + mod.relY + mod.h / 2,
        };
      };

      const centers = staticModules.map(getModuleCenter);
      const evoCenter = getModuleCenter(dynamicModule);

      // We establish routing pathways
      const routes: PathSegment[] = [
        {
          fromId: 0, // Frontend
          toId: 1,   // Backend
          coords: [centers[0], { x: centers[1].x, y: centers[0].y }, centers[1]],
        },
        {
          fromId: 1, // Backend
          toId: 2,   // Database
          coords: [centers[1], { x: centers[1].x, y: centers[2].y }, centers[2]],
        },
        {
          fromId: 2, // Database
          toId: 3,   // Auth
          coords: [centers[2], { x: centers[3].x, y: centers[2].y }, centers[3]],
        },
        {
          fromId: 3, // Auth
          toId: 0,   // Frontend
          coords: [centers[3], { x: centers[3].x, y: centers[0].y }, centers[0]],
        },
      ];

      // If evolution module is active, add connection paths dynamically
      if (dynamicModule.isActive) {
        routes.push({
          fromId: 4, // Integration Hub
          toId: 0,   // to Frontend
          coords: [evoCenter, { x: centers[0].x, y: evoCenter.y }, centers[0]],
        });
        routes.push({
          fromId: 4, // Integration Hub
          toId: 1,   // to Backend
          coords: [evoCenter, { x: centers[1].x, y: evoCenter.y }, centers[1]],
        });
      }

      // Draw routing paths based on progress
      let routeProgress = 1.0;
      if (stage === 0) {
        routeProgress = 0;
      } else if (stage === 1) {
        routeProgress = 0.1;
      } else if (stage === 2) {
        routeProgress = Math.min(1.0, stageTime / 1.5);
      }

      routes.forEach((route) => {
        if (routeProgress <= 0) return;

        ctx.beginPath();
        ctx.moveTo(route.coords[0].x, route.coords[0].y);

        const totalSegments = route.coords.length - 1;
        const segmentProgress = routeProgress * totalSegments;

        for (let s = 0; s < totalSegments; s++) {
          const start = route.coords[s];
          const end = route.coords[s + 1];
          const currentSegProgress = Math.max(0, Math.min(1.0, segmentProgress - s));

          if (currentSegProgress > 0) {
            ctx.lineTo(
              start.x + (end.x - start.x) * currentSegProgress,
              start.y + (end.y - start.y) * currentSegProgress
            );
          }
        }

        const isDynamicPath = route.fromId === 4;
        const baseOp = isDynamicPath ? dynamicModule.opacity * 0.25 : 0.045;
        const hoverOp = isDynamicPath ? dynamicModule.opacity * 0.45 : 0.16;

        ctx.strokeStyle = `rgba(234, 229, 201, ${isHovered ? hoverOp : baseOp})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // --------------------------------------------------
      // LAYER 4: Signal Particles Flow (Medium Parallax)
      // --------------------------------------------------
      const signalActive = stage >= 3 || isHovered;

      if (signalActive && routes.length > 0) {
        // Spawning frequency of particles
        const spawnChance = isHovered ? 0.095 : 0.035;

        // Dynamic extra burst of signals when evolution integration occurs
        const evoBurst = dynamicModule.isActive && evoTime >= 3.5 && evoTime < 5.0;
        const finalSpawnChance = evoBurst ? spawnChance * 3 : spawnChance;

        if (Math.random() < finalSpawnChance) {
          const pathIdx = Math.floor(Math.random() * routes.length);
          particles.push({
            pathIdx,
            progress: 0,
            speed: 0.12 + Math.random() * 0.1,
            size: 0.8 + Math.random() * 0.8,
            color: Math.random() < 0.12 ? colorTeal : colorIvory,
          });
        }
      }

      // Animate and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed * delta * (isHovered ? 1.5 : 1.0);

        if (p.progress >= 1.0 || p.pathIdx >= routes.length) {
          particles.splice(i, 1);
          continue;
        }

        const route = routes[p.pathIdx];
        if (!route) continue;

        // Calculate current particle coordinate on bent path
        const totalSegs = route.coords.length - 1;
        const targetSeg = Math.floor(p.progress * totalSegs);
        const segProgress = (p.progress * totalSegs) % 1.0;

        if (targetSeg < totalSegs) {
          const start = route.coords[targetSeg];
          const end = route.coords[targetSeg + 1];
          const px = start.x + (end.x - start.x) * segProgress;
          const py = start.y + (end.y - start.y) * segProgress;

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          const baseColor = p.color;
          const op = p.color === colorTeal ? 0.75 : 0.45;
          ctx.fillStyle = baseColor.replace("1)", `${op.toFixed(3)})`);
          ctx.fill();

          // Particle trail glow
          ctx.beginPath();
          ctx.arc(px, py, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = baseColor.replace("1)", `${(op * 0.35).toFixed(3)})`);
          ctx.fill();
        }
      }

      // --------------------------------------------------
      // LAYER 5: System Modules & Build Nodes (Fastest Parallax)
      // --------------------------------------------------
      const moduleOffsetLimit = 0.9;
      const mx = cx + parallaxX.current * moduleOffsetLimit;
      const my = cy + parallaxY.current * moduleOffsetLimit;

      // Update static modules geometry construction state
      staticModules.forEach((mod) => {
        if (stage === 0) {
          // Wireframe appearance
          const delay = mod.id * 0.15;
          mod.opacity = Math.max(0.045, Math.min(0.15, (stageTime - delay) * 0.15));
          mod.constructionProgress = 0;
        } else if (stage === 1) {
          // Building modules structure
          const delay = mod.id * 0.15;
          mod.opacity = 0.15 + (0.4 - 0.15) * Math.min(1.0, stageTime / 1.5);
          mod.constructionProgress = Math.max(0, Math.min(1.0, (stageTime - delay) * 1.2));
        } else {
          // Fully built & active
          mod.opacity = 0.4;
          mod.constructionProgress = 1.0;
        }

        const ex = mx + mod.relX;
        const ey = my + mod.relY;

        // Render card borders
        const finalOp = mod.opacity * (isHovered ? 1.4 : 1.0);
        ctx.strokeStyle = `rgba(234, 229, 201, ${finalOp.toFixed(3)})`;
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.roundRect(ex, ey, mod.w, mod.h, 3);
        ctx.stroke();

        // Draw internal wireframe details based on construction progress
        if (mod.constructionProgress > 0) {
          ctx.strokeStyle = "rgba(234, 229, 201, 0.04)";
          ctx.lineWidth = 0.4;

          // horizontal divider
          const borderProgressW = mod.w * mod.constructionProgress;
          ctx.beginPath();
          ctx.moveTo(ex, ey + 6);
          ctx.lineTo(ex + borderProgressW, ey + 6);
          ctx.stroke();

          // micro-details: internal status dashes
          if (mod.constructionProgress >= 0.5) {
            ctx.fillStyle = `rgba(61, 165, 138, ${(finalOp * 0.45).toFixed(3)})`;
            ctx.fillRect(ex + 4, ey + 11, 4, 1.5);
            ctx.fillRect(ex + 10, ey + 11, 7, 1.5);
            ctx.fillRect(ex + 4, ey + 15, 10, 1.5);
          }
        }

        // Draw build activation nodes at corners in Operational State (Stage 4)
        if (stage === 4 || isHovered) {
          const pulse = 1.0 + 0.18 * Math.sin(now * 0.003 + mod.id);
          const nodeRadius = 1.6 * pulse;

          ctx.beginPath();
          ctx.arc(ex + mod.w, ey + mod.h, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = colorTeal;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(ex + mod.w, ey + mod.h, nodeRadius * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(61, 165, 138, ${(0.35 * (isHovered ? 1.5 : 1.0)).toFixed(3)})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      });

      // Render Dynamic Module ("Integration Hub") if active
      if (dynamicModule.isActive) {
        const ex = mx + dynamicModule.relX;
        const ey = my + dynamicModule.relY;

        ctx.strokeStyle = `rgba(234, 229, 201, ${dynamicModule.opacity.toFixed(3)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.roundRect(ex, ey, dynamicModule.w, dynamicModule.h, 3);
        ctx.stroke();

        // Draw extra connection signal ring around it
        if (dynamicModule.constructionProgress > 0.4) {
          const ringProgress = (evoTime * 0.6) % 1.0;
          ctx.beginPath();
          ctx.arc(ex + dynamicModule.w / 2, ey + dynamicModule.h / 2, 8 + ringProgress * 15, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(61, 165, 138, ${(0.16 * (1.0 - ringProgress) * dynamicModule.opacity * 2).toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // --------------------------------------------------
      // LAYER 6: Update DOM HTML Floating Labels
      // --------------------------------------------------
      const time = now * 0.001;
      activeLabels.forEach((al) => {
        // Resolve target module position
        let targetMod = staticModules[al.moduleIdx];
        if (al.moduleIdx === 4) {
          targetMod = dynamicModule;
        }

        if (!targetMod || (al.moduleIdx === 4 && !dynamicModule.isActive)) {
          // If referencing dynamic module which is inactive, assign to random static module
          al.moduleIdx = Math.floor(Math.random() * 4);
          targetMod = staticModules[al.moduleIdx];
        }

        al.life -= delta;

        // Lifecycle transitions
        if (al.state === "fadeIn") {
          const targetOp = 0.35 * (al.moduleIdx === 4 ? dynamicModule.opacity * 2 : 1.0);
          al.opacity += (targetOp - al.opacity) * 0.05;
          if (al.opacity >= targetOp - 0.02) {
            al.opacity = targetOp;
            al.state = "hold";
          }
        } else if (al.state === "hold") {
          if (al.life <= 1.0) {
            al.state = "fadeOut";
          }
        } else if (al.state === "fadeOut") {
          al.opacity += (0.0 - al.opacity) * 0.08;
          if (al.opacity <= 0.01) {
            al.opacity = 0;
            al.state = "dead";
          }
        } else if (al.state === "dead") {
          al.moduleIdx = Math.floor(Math.random() * (dynamicModule.isActive ? 5 : 4));
          const activeTextIdxs = activeLabels.map((l) => l.textIdx);
          let newTextIdx = Math.floor(Math.random() * labelCandidates.length);
          for (let attempt = 0; attempt < 5; attempt++) {
            if (!activeTextIdxs.includes(newTextIdx)) break;
            newTextIdx = Math.floor(Math.random() * labelCandidates.length);
          }
          al.textIdx = newTextIdx;
          al.elem.querySelector("span")!.innerText = labelCandidates[newTextIdx];
          al.maxLife = 4.0 + Math.random() * 2.0;
          al.life = al.maxLife;
          al.state = "fadeIn";
          al.driftX = (Math.random() - 0.5) * 8;
          al.driftY = (Math.random() - 0.5) * 8;
          al.phase = Math.random() * Math.PI * 2;
        }

        // Apply drift
        const driftDist = 3.5;
        const currDriftX = al.driftX + Math.sin(time * 0.75 + al.phase) * driftDist;
        const currDriftY = al.driftY + Math.cos(time * 0.6 + al.phase) * driftDist;

        // Position DOM element relative to module center
        const targetX = mx + targetMod.relX + targetMod.w / 2;
        const targetY = my + targetMod.relY + targetMod.h / 2;

        al.elem.style.left = `${targetX + currDriftX}px`;
        al.elem.style.top = `${targetY + currDriftY - 14}px`;

        let finalOpacity = al.opacity;
        if (isHovered) {
          const dx = mouseX.current * 1.5 - (targetMod.relX + targetMod.w / 2);
          const dy = mouseY.current * 1.5 - (targetMod.relY + targetMod.h / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 35) {
            finalOpacity = 1.0;
            al.scaleModifier += (1.12 - al.scaleModifier) * 0.1;
          } else {
            al.scaleModifier += (1.0 - al.scaleModifier) * 0.1;
          }
        } else {
          al.scaleModifier += (1.0 - al.scaleModifier) * 0.1;
        }

        al.elem.style.opacity = finalOpacity.toFixed(3);
        al.elem.style.transform = `translate(-50%, -50%) scale(${al.scaleModifier.toFixed(3)})`;
      });

      // Request next frame
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-[#050507] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.current = 0;
        mouseY.current = 0;
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Radial ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,229,201,0.035)_0%,transparent_80%)] pointer-events-none" />

      {/* Floating Labels Overlay */}
      <div ref={labelsContainerRef} className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            data-label-idx={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center select-none"
            style={{ left: 0, top: 0, opacity: 0 }}
          >
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#eae5c9]/60 px-1.5 py-0.5 rounded border border-white/5 bg-[#050507]/40 backdrop-blur-[1px]">
              {/* Text set dynamically */}
            </span>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10" />

      {/* Unified HUD Panel */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-7 md:p-8 pointer-events-none text-[#eae5c9]">
        
        {/* Top Header */}
        <div className="flex justify-between items-start w-full">
          <div>
            <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
              SYSTEM ASSEMBLY
            </span>
            <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
              Application Construction Active
            </div>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3da58a] animate-pulse mt-1" />
        </div>



        {/* Bottom Section */}
        <div className="flex flex-col gap-3 w-full">
          {stepBody && (
            <p className="text-[11px] text-[#eae5c9]/50 font-light leading-relaxed max-w-sm font-satoshi pr-4">
              {stepBody}
            </p>
          )}

          <div className="w-full">
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-[#eae5c9]/60 animate-[loadingBar_3.5s_infinite_ease-in-out]" />
            </div>
            <div className="flex justify-between items-center mt-2 font-mono text-[9px] uppercase tracking-wider opacity-45">
              <span>Engineering Systems Converging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
