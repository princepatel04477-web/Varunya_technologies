"use client";

import { useEffect, useRef, useState } from "react";

interface StrategyBlueprintProps {
  stepBody?: string;
}

export default function StrategyBlueprint({ stepBody }: StrategyBlueprintProps) {
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
    mouseX.current = x * 18; // Max 9px drift
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

    // Color definitions
    const colorIvory = "rgba(234, 229, 201, 1)"; // #eae5c9
    const colorTeal = "rgba(61, 165, 138, 1)";    // #3da58a

    // 1. Structural blueprint frame settings
    const frameSize = 136;
    let drawingTimer = 0;
    const drawingCycle = 13.0; // Cycles drawing lines every 13s
    const drawingDrawTime = 2.0;

    // 2. Blueprint nodes setup
    interface PlanningNode {
      id: number;
      name: string;
      relX: number; // offset relative to center
      relY: number;
      scale: number;
      opacity: number;
      pulseFactor: number;
    }

    const planningNodes: PlanningNode[] = [
      { id: 0, name: "Top Node", relX: 0, relY: -55, scale: 1.0, opacity: 0.5, pulseFactor: 0 },
      { id: 1, name: "Right Node", relX: 55, relY: 0, scale: 1.0, opacity: 0.5, pulseFactor: Math.PI / 2 },
      { id: 2, name: "Bottom Node", relX: 0, relY: 55, scale: 1.0, opacity: 0.5, pulseFactor: Math.PI },
      { id: 3, name: "Left Node", relX: -55, relY: 0, scale: 1.0, opacity: 0.5, pulseFactor: 1.5 * Math.PI },
      { id: 4, name: "Core Node", relX: 0, relY: 0, scale: 1.0, opacity: 0.9, pulseFactor: 0 },
    ];

    // 3. Floating blueprint labels setup
    const labelCandidates = [
      "API Layer",
      "Core Logic",
      "Database",
      "Service Mesh",
      "Infrastructure",
      "Authentication",
      "Workflow Layer",
      "Integration Point",
      "Resource Flow",
      "System Boundary",
    ];

    interface FloatingLabel {
      elem: HTMLDivElement;
      nodeIdx: number;
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
        const nodeIdx = Math.floor(Math.random() * planningNodes.length);
        const textIdx = Math.floor(Math.random() * labelCandidates.length);
        const maxLife = 4.0 + Math.random() * 2.0; // 4 to 6 seconds visible

        elem.querySelector("span")!.innerText = labelCandidates[textIdx];

        activeLabels.push({
          elem,
          nodeIdx,
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

    // Alignment guides self-correction offset
    let alignmentSlide = 0;

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

      // Increment timers
      drawingTimer += delta;
      alignmentSlide = (alignmentSlide + 0.35 * delta) % 1.0;

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
      // LAYER 2: Architecture Frame Drawing (Medium Parallax)
      // --------------------------------------------------
      const frameOffsetLimit = 0.44;
      const fx = cx + parallaxX.current * frameOffsetLimit;
      const fy = cy + parallaxY.current * frameOffsetLimit;

      // Calculate perimeter drawing progress
      const timeInCycle = drawingTimer % drawingCycle;
      let drawProgress = 1.0;
      if (timeInCycle < drawingDrawTime) {
        drawProgress = timeInCycle / drawingDrawTime;
        // Ease in-out cubic
        drawProgress = drawProgress < 0.5 ? 4 * drawProgress * drawProgress * drawProgress : 1 - Math.pow(-2 * drawProgress + 2, 3) / 2;
      } else if (timeInCycle > drawingCycle - 0.6) {
        // fade out frame stroke before reset
        drawProgress = 1.0 - (timeInCycle - (drawingCycle - 0.6)) / 0.6;
      }

      const halfW = frameSize / 2;
      const halfH = frameSize / 2;
      const totalPerimeter = 2 * (frameSize + frameSize);
      const currentDrawLength = drawProgress * totalPerimeter;

      ctx.beginPath();
      let drawnLength = 0;
      const sX = fx - halfW;
      const sY = fy - halfH;
      ctx.moveTo(sX, sY);

      // Top line
      if (currentDrawLength > drawnLength) {
        const seg = Math.min(frameSize, currentDrawLength - drawnLength);
        ctx.lineTo(sX + seg, sY);
        drawnLength += seg;
      }
      // Right line
      if (currentDrawLength > drawnLength) {
        const seg = Math.min(frameSize, currentDrawLength - drawnLength);
        ctx.lineTo(sX + frameSize, sY + seg);
        drawnLength += seg;
      }
      // Bottom line
      if (currentDrawLength > drawnLength) {
        const seg = Math.min(frameSize, currentDrawLength - drawnLength);
        ctx.lineTo(sX + frameSize - seg, sY + frameSize);
        drawnLength += seg;
      }
      // Left line
      if (currentDrawLength > drawnLength) {
        const seg = Math.min(frameSize, currentDrawLength - drawnLength);
        ctx.lineTo(sX, sY + frameSize - seg);
        drawnLength += seg;
      }

      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = `rgba(234, 229, 201, ${isHovered ? 0.085 : 0.04})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // --------------------------------------------------
      // LAYER 3: Dependency paths & Routing (Geometric Circuit routing)
      // --------------------------------------------------
      // Coordinate shortcuts
      const nTop = { x: fx, y: fy - 55 };
      const nRight = { x: fx + 55, y: fy };
      const nBottom = { x: fx, y: fy + 55 };
      const nLeft = { x: fx - 55, y: fy };

      // We define 4 geometric L-routing paths connecting outer nodes
      const geometricRoutes = [
        [nLeft, { x: nLeft.x, y: nTop.y }, nTop],     // Left to Top
        [nTop, { x: nRight.x, y: nTop.y }, nRight],   // Top to Right
        [nRight, { x: nRight.x, y: nBottom.y }, nBottom], // Right to Bottom
        [nBottom, { x: nLeft.x, y: nBottom.y }, nLeft], // Bottom to Left
      ];

      // Draw routing paths
      geometricRoutes.forEach((route, idx) => {
        ctx.beginPath();
        ctx.moveTo(route[0].x, route[0].y);
        ctx.lineTo(route[1].x, route[1].y);
        ctx.lineTo(route[2].x, route[2].y);

        // Highlight active mapping route
        const activeRouteIdx = Math.floor(now * 0.0002) % 4;
        const isRouteActive = idx === activeRouteIdx;
        const pathOp = isRouteActive ? (isHovered ? 0.22 : 0.12) : 0.025;

        ctx.strokeStyle = `rgba(234, 229, 201, ${pathOp})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Animate a small signal packet traversing the active path
        if (isRouteActive) {
          const packetProgress = (now * 0.0008) % 1.0;
          const px = route[0].x + (route[1].x - route[0].x) * Math.min(1.0, packetProgress * 2);
          const py = route[0].y + (route[1].y - route[0].y) * Math.min(1.0, packetProgress * 2);

          let finalX = px;
          let finalY = py;

          if (packetProgress > 0.5) {
            const p2 = (packetProgress - 0.5) * 2;
            finalX = route[1].x + (route[2].x - route[1].x) * p2;
            finalY = route[1].y + (route[2].y - route[1].y) * p2;
          }

          ctx.beginPath();
          ctx.arc(finalX, finalY, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${isHovered ? 0.8 : 0.4})`;
          ctx.fill();
        }
      });

      // Straight connections Core <-> Symmetrical Nodes
      const outerNodes = [nTop, nRight, nBottom, nLeft];
      outerNodes.forEach((node) => {
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = isHovered ? "rgba(234, 229, 201, 0.06)" : "rgba(234, 229, 201, 0.025)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // --------------------------------------------------
      // LAYER 4: Alignment guides & construction guides
      // --------------------------------------------------
      // Clockwise sequence activation mapping
      const seqActiveIdx = Math.floor(now * 0.0006) % 4; // switches node focus every 1.6s

      // Draw alignment reference lines for the focused active node
      const activeNodePos = outerNodes[seqActiveIdx];

      ctx.strokeStyle = "rgba(234, 229, 201, 0.018)";
      ctx.setLineDash([2, 5]);
      ctx.lineWidth = 0.5;

      // Draw full horizontal blueprint guide through node
      ctx.beginPath();
      ctx.moveTo(fx - halfW - 20, activeNodePos.y);
      ctx.lineTo(fx + halfW + 20, activeNodePos.y);
      ctx.stroke();

      // Draw full vertical blueprint guide through node
      ctx.beginPath();
      ctx.moveTo(activeNodePos.x, fy - halfH - 20);
      ctx.lineTo(activeNodePos.x, fy + halfH + 20);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Small measurement alignment ticks
      ctx.fillStyle = "rgba(234, 229, 201, 0.16)";
      ctx.font = "normal 6px monospace";
      ctx.fillText("+ offset: 55.0", activeNodePos.x + 6, activeNodePos.y - 6);

      // Layout continuously self-corrects: sliding crosshair marker
      const crosshairX = fx - halfW + alignmentSlide * frameSize;
      ctx.strokeStyle = "rgba(234, 229, 201, 0.05)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(crosshairX, fy - halfH);
      ctx.lineTo(crosshairX, fy + halfH);
      ctx.stroke();

      // --------------------------------------------------
      // LAYER 5: Core & planning Nodes (Fastest Parallax)
      // --------------------------------------------------
      const nodeOffsetLimit = 0.9;
      const nx = cx + parallaxX.current * nodeOffsetLimit;
      const ny = cy + parallaxY.current * nodeOffsetLimit;

      // Update local positions of planningNodes matching node offset
      const nodePositions = planningNodes.map((n) => {
        const x = nx + n.relX;
        const y = ny + n.relY;
        return { ...n, x, y };
      });

      // System Synchronization Ring (emits from Core Node 4)
      const syncPulseSpeed = 0.5;
      const syncProgress = (now * 0.001 * syncPulseSpeed) % 1.0;
      const syncR = 10 + syncProgress * 75;
      const syncOp = (1.0 - syncProgress) * (isHovered ? 0.18 : 0.08);

      ctx.beginPath();
      ctx.arc(nodePositions[4].x, nodePositions[4].y, syncR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(234, 229, 201, ${syncOp.toFixed(3)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Draw nodes
      nodePositions.forEach((n) => {
        // Node state updates (sequence highlighted)
        const isCurrentSeq = n.id === seqActiveIdx;
        const baseOpacity = n.id === 4 ? 0.95 : 0.45; // Core node always high opacity
        const targetOp = isCurrentSeq ? 0.9 : baseOpacity;
        n.opacity += (targetOp - n.opacity) * 0.08;

        n.pulseFactor += 3.5 * delta;
        const nodePulse = isCurrentSeq ? 1.0 + 0.16 * Math.sin(n.pulseFactor) : 1.0;
        const baseRadius = n.id === 4 ? 4.5 : 2.5;
        const r = baseRadius * nodePulse;

        // Outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.2, 0, Math.PI * 2);
        const glowOp = n.id === 4 ? 0.08 : 0.035;
        ctx.strokeStyle = `rgba(234, 229, 201, ${(n.opacity * glowOp * (isHovered ? 1.5 : 1.0)).toFixed(3)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Node fill
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.id === 4 ? "#ffffff" : `rgba(234, 229, 201, ${n.opacity.toFixed(3)})`;
        ctx.fill();
      });

      // --------------------------------------------------
      // LAYER 6: Update DOM HTML Floating Labels
      // --------------------------------------------------
      const time = now * 0.001;
      activeLabels.forEach((al) => {
        const targetNode = nodePositions[al.nodeIdx];
        if (!targetNode) return;

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
          al.nodeIdx = Math.floor(Math.random() * planningNodes.length);
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

        // Position DOM element
        al.elem.style.left = `${targetNode.x + currDriftX}px`;
        al.elem.style.top = `${targetNode.y + currDriftY - 14}px`;

        let finalOpacity = al.opacity;
        // Raise opacity to 100% on mouse proximity
        if (isHovered) {
          const dx = mouseX.current * 1.5 - targetNode.relX;
          const dy = mouseY.current * 1.5 - targetNode.relY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40) {
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
              ARCHITECTURE BLUEPRINT
            </span>
            <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
              System Design In Progress
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
              <span>Blueprint Integrity Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
