"use client";

import { useEffect, useRef, useState } from "react";

interface ExperienceLabProps {
  stepBody?: string;
}

export default function ExperienceLab({ stepBody }: ExperienceLabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Parallax mouse offsets
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const parallaxX = useRef(0);
  const parallaxY = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.current = x * 18; // Max 9px parallax drift
    mouseY.current = y * 18;
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

    // 1. UI Components base geometry
    interface UIComponent {
      name: string;
      relX: number;
      relY: number;
      w: number;
      h: number;
      targetW: number;
      targetH: number;
      targetRelY: number;
      opacity: number;
      pulse: number;
    }

    const uiElements: UIComponent[] = [
      { name: "Header", relX: -44, relY: -78, w: 88, h: 10, targetW: 88, targetH: 10, targetRelY: -78, opacity: 0.1, pulse: 0 },
      { name: "Hero", relX: -44, relY: -63, w: 88, h: 36, targetW: 88, targetH: 36, targetRelY: -63, opacity: 0.1, pulse: 0 },
      { name: "Card1", relX: -44, relY: -21, w: 41, h: 26, targetW: 41, targetH: 26, targetRelY: -21, opacity: 0.1, pulse: 0 },
      { name: "Card2", relX: 3, relY: -21, w: 41, h: 26, targetW: 41, targetH: 26, targetRelY: -21, opacity: 0.1, pulse: 0 },
      { name: "Block1", relX: -44, relY: 11, w: 88, h: 14, targetW: 88, targetH: 14, targetRelY: 11, opacity: 0.1, pulse: 0 },
      { name: "Block2", relX: -44, relY: 30, w: 88, h: 14, targetW: 88, targetH: 14, targetRelY: 30, opacity: 0.1, pulse: 0 },
      { name: "CTA", relX: -32, relY: 52, w: 64, h: 12, targetW: 64, targetH: 12, targetRelY: 52, opacity: 0.1, pulse: 0 },
    ];

    // 2. Floating labels setup
    const labelCandidates = [
      "Navigation",
      "Layout Grid",
      "User Flow",
      "Interaction Point",
      "Component",
      "Prototype",
      "Design Token",
      "Visual Hierarchy",
      "Micro Interaction",
      "Experience Layer",
      "Accessibility",
      "Motion System",
    ];

    interface FloatingLabel {
      elem: HTMLDivElement;
      compIdx: number;
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
        const compIdx = Math.floor(Math.random() * uiElements.length);
        const textIdx = Math.floor(Math.random() * labelCandidates.length);
        const maxLife = 4.0 + Math.random() * 2.0;

        elem.querySelector("span")!.innerText = labelCandidates[textIdx];

        activeLabels.push({
          elem,
          compIdx,
          textIdx,
          state: "fadeIn",
          life: maxLife,
          maxLife,
          opacity: 0,
          driftX: (Math.random() - 0.5) * 10,
          driftY: (Math.random() - 0.5) * 10,
          phase: Math.random() * Math.PI * 2,
          scaleModifier: 1.0,
        });
      }
    }

    let loopTimer = 0;
    const loopDuration = 16.0; // 16s cycle for Wireframe ➔ Layout ➔ Prototype ➔ Refinement

    let animationFrameId: number;
    let lastTime = performance.now();

    // Render loop
    const animate = (now: number) => {
      const delta = Math.max(0, Math.min(0.1, (now - lastTime) / 1000));
      lastTime = now;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Smooth parallax interpolation
      parallaxX.current += (mouseX.current - parallaxX.current) * 0.08;
      parallaxY.current += (mouseY.current - parallaxY.current) * 0.08;

      const cx = width / 2;
      const cy = height / 2 - 10;

      loopTimer = (loopTimer + delta) % loopDuration;

      // Determine current design system state loop:
      // 0.0 - 4.0s: Wireframe Construction
      // 4.0 - 8.0s: Component Refinement
      // 8.0 - 12.0s: Prototype Flow / Interaction States
      // 12.0 - 16.0s: Design Iteration
      const stage = Math.floor(loopTimer / 4.0);
      const stageTime = loopTimer % 4.0;

      // --------------------------------------------------
      // LAYER 1: Blueprint grid background (Slowest Parallax)
      // --------------------------------------------------
      const gridOffsetLimit = 0.18;
      const gx = parallaxX.current * gridOffsetLimit;
      const gy = parallaxY.current * gridOffsetLimit;

      ctx.strokeStyle = "rgba(234, 229, 201, 0.012)";
      ctx.lineWidth = 0.5;
      const gridSize = 35;

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
      // LAYER 2: Concentric design rings behind viewport (Medium Parallax)
      // --------------------------------------------------
      const ringOffsetLimit = 0.35;
      const rx = cx + parallaxX.current * ringOffsetLimit;
      const ry = cy + parallaxY.current * ringOffsetLimit;

      // Concentric circles representing design iteration phases
      const ringRadii = [80, 120];
      ringRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(rx, ry, r, 0, Math.PI * 2);
        ctx.lineWidth = 0.5;
        const ringBaseOp = idx === 0 ? 0.025 : 0.015;
        const ringGlowOp = isHovered ? ringBaseOp * 2.2 : ringBaseOp;
        ctx.strokeStyle = `rgba(234, 229, 201, ${ringGlowOp})`;
        ctx.stroke();
      });

      // --------------------------------------------------
      // LAYER 3: Device Frame silhouette (Medium Parallax)
      // --------------------------------------------------
      const devW = 100;
      const devH = 175;
      const devX = rx - devW / 2;
      const devY = ry - devH / 2;

      // Wireframe construction draw-in animation
      let drawProgress = 1.0;
      if (stage === 0) {
        drawProgress = Math.min(1.0, stageTime / 1.5);
      }

      ctx.strokeStyle = `rgba(234, 229, 201, ${isHovered ? 0.095 : 0.05})`;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      // Draw rounded rectangle frame based on progress
      const totalLen = 2 * (devW + devH);
      const activeLen = drawProgress * totalLen;
      ctx.setLineDash([3, 4]); // Device has blueprint dash outline
      
      // Draw device outline
      ctx.roundRect(devX, devY, devW, devH, 8);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Device indicators (Notch and Home line)
      ctx.strokeStyle = "rgba(234, 229, 201, 0.03)";
      ctx.lineWidth = 0.6;
      // top notch
      ctx.beginPath();
      ctx.moveTo(rx - 14, devY + 4);
      ctx.lineTo(rx - 14, devY + 8);
      ctx.lineTo(rx + 14, devY + 8);
      ctx.lineTo(rx + 14, devY + 4);
      ctx.stroke();

      // bottom bar
      ctx.beginPath();
      ctx.moveTo(rx - 18, devY + devH - 5);
      ctx.lineTo(rx + 18, devY + devH - 5);
      ctx.stroke();

      // --------------------------------------------------
      // LAYER 4: UI Components (Fastest Parallax)
      // --------------------------------------------------
      const compOffsetLimit = 0.8;
      const ux = cx + parallaxX.current * compOffsetLimit;
      const uy = cy + parallaxY.current * compOffsetLimit;

      // Stage dynamics updates
      uiElements.forEach((el) => {
        // Stage 0: Wireframe (fade in from top to bottom)
        if (stage === 0) {
          const delay = (el.targetRelY + 80) / 160; // 0 to 1 delay based on Y coordinate
          const visibleProgress = Math.max(0, Math.min(1.0, (stageTime - delay * 1.5) * 2));
          el.opacity = visibleProgress * 0.22;
          el.relY = el.targetRelY;
          el.w = el.targetW;
          el.h = el.targetH;
        }
        // Stage 1: Component Refinement (Margins self-correct, Lays solidify)
        else if (stage === 1) {
          // Add a subtle deliberate alignment correction offset
          const correction = (1.0 - Math.min(1.0, stageTime / 1.5));
          const offset = el.name.startsWith("Card") ? 4 * correction : 2.5 * correction;
          
          el.opacity = 0.22 + (0.42 - 0.22) * Math.min(1.0, stageTime / 1.5);
          el.relY = el.targetRelY + (el.name.startsWith("Block") ? offset : -offset);
          el.w = el.targetW;
          el.h = el.targetH;
        }
        // Stage 2: Prototyping Active state
        else if (stage === 2) {
          el.opacity = 0.42;
          el.relY = el.targetRelY;
          el.w = el.targetW;
          el.h = el.targetH;
        }
        // Stage 3: Design Iteration Adaptation
        else if (stage === 3) {
          el.opacity = 0.42;
          
          // We trigger layout adjustment: Card1 expands downwards, Block1/Block2 push down!
          const adaptProgress = Math.min(1.0, stageTime / 1.2);
          const easedAdapt = adaptProgress < 0.5 ? 2 * adaptProgress * adaptProgress : 1 - Math.pow(-2 * adaptProgress + 2, 2) / 2;

          if (el.name === "Card1") {
            el.h = el.targetH + 12 * easedAdapt;
          }
          if (el.name === "Block1") {
            el.relY = el.targetRelY + 12 * easedAdapt;
          }
          if (el.name === "Block2") {
            el.relY = el.targetRelY + 12 * easedAdapt;
          }
        }

        // Apply hover visibility
        const finalOp = el.opacity * (isHovered ? 1.4 : 1.0);

        // Draw component shape
        ctx.strokeStyle = `rgba(234, 229, 201, ${finalOp.toFixed(3)})`;
        ctx.lineWidth = el.name === "CTA" ? 0.8 : 0.55;

        const ex = ux + el.relX;
        const ey = uy + el.relY;

        ctx.beginPath();
        // Rounded corners for cards
        if (el.name === "Hero" || el.name.startsWith("Card") || el.name === "CTA") {
          ctx.roundRect(ex, ey, el.w, el.h, 3.5);
        } else {
          ctx.rect(ex, ey, el.w, el.h);
        }
        ctx.stroke();

        // Subtle fill for CTA
        if (el.name === "CTA") {
          const hoverFillOp = isHovered ? 0.06 : 0.025;
          ctx.fillStyle = `rgba(234, 229, 201, ${(el.opacity * hoverFillOp * 4).toFixed(3)})`;
          ctx.fill();
        }

        // Draw alignment markers/reference guides during refinement state
        if (stage === 1 && isHovered) {
          ctx.strokeStyle = "rgba(61, 165, 138, 0.08)";
          ctx.lineWidth = 0.4;
          // horizontal markers
          ctx.beginPath();
          ctx.moveTo(ex - 8, ey);
          ctx.lineTo(ex + el.w + 8, ey);
          ctx.stroke();
        }
      });

      // --------------------------------------------------
      // LAYER 5: Prototype hotspots & User Journey signals
      // --------------------------------------------------
      const hotspots = [
        { x: ux - 30, y: uy - 73 }, // Header link (Node 0)
        { x: ux, y: uy - 45 },      // Hero center (Node 1)
        { x: ux - 23, y: uy - 8 },  // Card 1 center (Node 2)
        { x: ux, y: uy + 58 },      // CTA Button center (Node 3)
      ];

      // Draw active prototype hotspots (pulse glow)
      if (stage === 2 || isHovered) {
        hotspots.forEach((hs, idx) => {
          const pulsePhase = now * 0.003 + idx;
          const pulse = 1.0 + 0.25 * Math.sin(pulsePhase);
          const hsOpacity = (stage === 2) ? 0.4 : 0.16;

          // outer ring
          ctx.beginPath();
          ctx.arc(hs.x, hs.y, 4.5 * pulse, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(61, 165, 138, ${(hsOpacity * 0.6).toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // center dot
          ctx.beginPath();
          ctx.arc(hs.x, hs.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(61, 165, 138, ${hsOpacity.toFixed(3)})`;
          ctx.fill();
        });
      }

      // Animate user journey flow line (running between hotspots)
      if (stage === 2) {
        const journeySpeed = 0.35;
        const progress = (stageTime * journeySpeed) % 1.0;

        // Path indices sequence: 0 ➔ 1 ➔ 2 ➔ 3
        const pathSegments = [
          [hotspots[0], hotspots[1]],
          [hotspots[1], hotspots[2]],
          [hotspots[2], hotspots[3]],
        ];

        // Determine which segment is active based on progress
        const segmentCount = pathSegments.length;
        const totalProgress = progress * segmentCount;
        const currentSegIdx = Math.floor(totalProgress);
        const segProgress = totalProgress % 1.0;

        if (currentSegIdx < segmentCount) {
          const start = pathSegments[currentSegIdx][0];
          const end = pathSegments[currentSegIdx][1];

          // Draw active path trail
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.strokeStyle = "rgba(61, 165, 138, 0.16)";
          ctx.lineWidth = 0.75;
          ctx.stroke();

          // Draw signal dot
          const px = start.x + (end.x - start.x) * segProgress;
          const py = start.y + (end.y - start.y) * segProgress;

          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          // soft glow
          const grad = ctx.createRadialGradient(px, py, 1, px, py, 5);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
          grad.addColorStop(1, "rgba(61, 165, 138, 0)");
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // --------------------------------------------------
      // LAYER 6: Update DOM HTML Floating Labels
      // --------------------------------------------------
      const time = now * 0.001;
      activeLabels.forEach((al) => {
        const targetComp = uiElements[al.compIdx];
        if (!targetComp) return;

        al.life -= delta;

        // Lifecycle state transitions
        if (al.state === "fadeIn") {
          const targetOp = 0.35;
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
          al.compIdx = Math.floor(Math.random() * uiElements.length);
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

        // Apply drifting offsets
        const driftDist = 4.0;
        const currDriftX = al.driftX + Math.sin(time * 0.7 + al.phase) * driftDist;
        const currDriftY = al.driftY + Math.cos(time * 0.5 + al.phase) * driftDist;

        // Position DOM element relative to card center + component offset
        const targetX = ux + targetComp.relX + targetComp.w / 2;
        const targetY = uy + targetComp.relY + targetComp.h / 2;

        al.elem.style.left = `${targetX + currDriftX}px`;
        al.elem.style.top = `${targetY + currDriftY - 14}px`;

        let finalOpacity = al.opacity;
        // Raise opacity to 100% on mouse proximity
        if (isHovered) {
          const dx = mouseX.current * 1.5 - (targetComp.relX + targetComp.w / 2);
          const dy = mouseY.current * 1.5 - (targetComp.relY + targetComp.h / 2);
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
      {/* Volumetric background radial grid glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,229,201,0.04)_0%,transparent_75%)] pointer-events-none" />

      {/* Floating Labels Overlay */}
      <div ref={labelsContainerRef} className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            data-label-idx={i}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center select-none"
            style={{ left: 0, top: 0, opacity: 0 }}
          >
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#eae5c9]/60 px-1.5 py-0.5 rounded border border-white/5 bg-[#050507]/40 backdrop-blur-[1px]">
              {/* Text will be set dynamically */}
            </span>
          </div>
        ))}
      </div>

      {/* Render Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10" />

      {/* Unified System Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-7 md:p-8 pointer-events-none text-[#eae5c9]">
        
        {/* Top Header */}
        <div className="flex justify-between items-start w-full">
          <div>
            <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
              EXPERIENCE LAB
            </span>
            <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
              Prototype System Active
            </div>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#3da58a] animate-pulse mt-1" />
        </div>



        {/* Bottom Section: Description + Progress line + Status */}
        <div className="flex flex-col gap-3 w-full">
          {/* stepBody text */}
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
              <span>Experience Architecture Evolving</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
