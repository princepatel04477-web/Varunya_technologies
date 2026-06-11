"use client";

import { useEffect, useRef, useState } from "react";

interface EvolutionEngineProps {
  stepBody?: string;
}

export default function EvolutionEngine({ stepBody }: EvolutionEngineProps) {
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

    // 1. Orbiting nodes setup
    interface OrbitingNode {
      id: number;
      angle: number;
      speed: number;
      rx: number;
      ry: number;
      relX: number;
      relY: number;
      size: number;
      opacity: number;
    }

    const staticOrbiters: OrbitingNode[] = [
      { id: 0, angle: 0, speed: 0.65, rx: 50, ry: 20, relX: 0, relY: 0, size: 1.8, opacity: 0.4 },
      { id: 1, angle: Math.PI / 2, speed: 0.45, rx: 56, ry: 24, relX: 0, relY: 0, size: 2.2, opacity: 0.3 },
      { id: 2, angle: Math.PI, speed: 0.8, rx: 44, ry: 18, relX: 0, relY: 0, size: 1.5, opacity: 0.5 },
    ];

    interface DynamicOrbitingNode extends OrbitingNode {
      isActive: boolean;
      state: string;
      timer: number;
      burstRadius: number;
      burstOpacity: number;
    }

    let dynamicNode: DynamicOrbitingNode = {
      id: 3,
      angle: 0,
      speed: 1.1,
      rx: 50,
      ry: 20,
      relX: 0,
      relY: 0,
      size: 2.0,
      opacity: 0,
      isActive: false,
      state: "spawn", // "spawn" | "orbit" | "spiral" | "merge"
      timer: 0,
      burstRadius: 0,
      burstOpacity: 0,
    };

    // 2. Performance Baseline tuning status
    let baselineGlowProgress = 0.3; // Starts at 30% glow segment
    let baselineTargetGlow = 0.3;

    // 3. Central Core breathe scale
    let corePulseScale = 1.0;
    let coreTargetPulse = 1.0;
    let coreGlowIntensity = 0; // extra glow flash on integration

    // 4. Floating Labels candidates
    const labelCandidates = [
      "Optimization",
      "Performance",
      "Iteration",
      "Enhancement",
      "Scalability",
      "Monitoring",
      "Refinement",
      "User Feedback",
      "Maintenance",
      "Hotfix",
      "Feature Growth",
      "System Health",
    ];

    interface FloatingLabel {
      elem: HTMLDivElement;
      orbiterIdx: number; // 0 to 2 (static), 3 (dynamic)
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
        const orbiterIdx = Math.floor(Math.random() * 3); // static orbiters
        const textIdx = Math.floor(Math.random() * labelCandidates.length);
        const maxLife = 4.0 + Math.random() * 2.0;

        elem.querySelector("span")!.innerText = labelCandidates[textIdx];

        activeLabels.push({
          elem,
          orbiterIdx,
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
    const loopDuration = 15.0; // 15s evolution cycle

    let evolutionCycleTimer = 0;
    const evolutionCycle = 12.0; // Integration happens every 12s

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
      evolutionCycleTimer += delta;

      // Handle the dynamic evolution node lifecycle (every 12s)
      const evoTime = evolutionCycleTimer % evolutionCycle;
      if (evoTime < 1.0) {
        // Spawning dynamic node
        if (!dynamicNode.isActive) {
          dynamicNode.isActive = true;
          dynamicNode.state = "spawn";
          dynamicNode.angle = Math.random() * Math.PI * 2;
          dynamicNode.rx = 50;
          dynamicNode.ry = 20;
          dynamicNode.opacity = 0;
          dynamicNode.burstRadius = 0;
          dynamicNode.burstOpacity = 0;
        }
        dynamicNode.opacity = evoTime / 1.0;
      } else if (evoTime >= 1.0 && evoTime < 5.0) {
        // Orbit state: orbits the core normally
        dynamicNode.state = "orbit";
        dynamicNode.opacity = 1.0;
        dynamicNode.angle += dynamicNode.speed * delta * (isHovered ? 1.6 : 1.0);
      } else if (evoTime >= 5.0 && evoTime < 8.0) {
        // Spiral state: decays inward towards center
        dynamicNode.state = "spiral";
        dynamicNode.opacity = 1.0;
        dynamicNode.angle += (dynamicNode.speed * 1.5) * delta * (isHovered ? 1.6 : 1.0);
        
        const spiralProgress = (evoTime - 5.0) / 3.0;
        dynamicNode.rx = 50 * (1.0 - spiralProgress);
        dynamicNode.ry = 20 * (1.0 - spiralProgress);
      } else if (evoTime >= 8.0 && evoTime < 10.0) {
        // Merge state: integrates into core
        if (dynamicNode.state !== "merge") {
          dynamicNode.state = "merge";
          dynamicNode.opacity = 0;
          coreTargetPulse = 1.25; // momentary core pulse swell
          coreGlowIntensity = 1.0; // trigger core flash
          dynamicNode.burstRadius = 0;
          dynamicNode.burstOpacity = 0.8;

          // Increase target baseline progress on successful integration
          baselineTargetGlow = Math.min(1.0, baselineTargetGlow + 0.14);
        }
      } else {
        dynamicNode.isActive = false;
      }

      // Smooth step up baseline tuning progress
      baselineGlowProgress += (baselineTargetGlow - baselineGlowProgress) * 0.05;

      // Smooth core scale recovery
      coreTargetPulse += (1.0 - coreTargetPulse) * 0.08;
      corePulseScale += (coreTargetPulse - corePulseScale) * 0.1;

      // Decay extra core flash intensity
      coreGlowIntensity = Math.max(0, coreGlowIntensity - 1.5 * delta);

      // Decay burst wave
      if (dynamicNode.burstOpacity > 0.01) {
        dynamicNode.burstRadius += 45 * delta;
        dynamicNode.burstOpacity -= 1.6 * delta;
      }

      // --------------------------------------------------
      // LAYER 1: Architectural Grid (Slowest Parallax)
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
      // LAYER 2: Performance Baseline path (Medium Parallax)
      // --------------------------------------------------
      const baselineOffsetLimit = 0.45;
      const bx = cx + parallaxX.current * baselineOffsetLimit;
      const by = cy + parallaxY.current * baselineOffsetLimit;

      const baselineY = by + 45;
      const baselineHalfW = 75;

      // Draw overall low-opacity baseline
      ctx.strokeStyle = "rgba(234, 229, 201, 0.04)";
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(bx - baselineHalfW, baselineY);
      ctx.lineTo(bx + baselineHalfW, baselineY);
      ctx.stroke();

      // Draw active illuminated tuned baseline segment (never decreases)
      const tunedW = (baselineHalfW * 2) * baselineGlowProgress;
      ctx.strokeStyle = colorTeal.replace("1)", "0.22)");
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(bx - baselineHalfW, baselineY);
      ctx.lineTo(bx - baselineHalfW + tunedW, baselineY);
      ctx.stroke();

      // baseline endpoints coordinate marks
      ctx.fillStyle = "rgba(234, 229, 201, 0.22)";
      ctx.font = "normal 5px monospace";
      ctx.fillText("L_TUNED", bx - baselineHalfW - 22, baselineY + 1.5);
      ctx.fillText(`${(baselineGlowProgress * 100).toFixed(0)}%`, bx + baselineHalfW + 6, baselineY + 1.5);

      // --------------------------------------------------
      // LAYER 3: Concentric Refinement Field & Evolution Orbit (Medium Parallax)
      // --------------------------------------------------
      const coreX = bx;
      const coreY = by - 16;

      // Refinement field radial glow (increases with hover and dynamic integration flash)
      const baseFieldOpacity = isHovered ? 0.04 : 0.02;
      const finalFieldOpacity = baseFieldOpacity + coreGlowIntensity * 0.055;
      const fieldPulseRadius = 45 + Math.sin(now * 0.002) * (isHovered ? 8 : 4) + coreGlowIntensity * 12;

      const fieldGrad = ctx.createRadialGradient(coreX, coreY, 5, coreX, coreY, fieldPulseRadius);
      fieldGrad.addColorStop(0, `rgba(61, 165, 138, ${finalFieldOpacity.toFixed(3)})`);
      fieldGrad.addColorStop(1, "rgba(61, 165, 138, 0)");
      ctx.beginPath();
      ctx.arc(coreX, coreY, fieldPulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = fieldGrad;
      ctx.fill();

      // Draw dynamic node integration burst wave
      if (dynamicNode.burstOpacity > 0.01) {
        ctx.beginPath();
        ctx.arc(coreX, coreY, dynamicNode.burstRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(61, 165, 138, ${Math.max(0, dynamicNode.burstOpacity).toFixed(3)})`;
        ctx.lineWidth = 0.55;
        ctx.stroke();
      }

      // Dashed elliptical orbital ring wrapping around core
      ctx.save();
      ctx.translate(coreX, coreY);
      ctx.rotate(Math.PI / 15); // tilt orbit slightly
      ctx.beginPath();
      ctx.ellipse(0, 0, 52, 22, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(234, 229, 201, ${isHovered ? 0.085 : 0.04})`;
      ctx.lineWidth = 0.55;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.restore();

      // --------------------------------------------------
      // LAYER 4: Central Optimization Core / Nucleus (Medium Parallax)
      // --------------------------------------------------
      const coreBaseR = 14;
      const coreH = 9;

      // Core breathes slowly (scale shift)
      const breathe = 1.0 + 0.05 * Math.sin(now * 0.0025);
      const scaleX = corePulseScale * breathe;
      const scaleY = corePulseScale * breathe;

      // Draw concentric core rings
      const glowScaleOffset = isHovered ? 1.4 : 1.0;
      ctx.beginPath();
      ctx.ellipse(coreX, coreY, coreBaseR * scaleX * 1.5, coreH * scaleY * 1.5, Math.PI / 15, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(234, 229, 201, ${(0.035 * glowScaleOffset).toFixed(3)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Solid central core ellipse
      ctx.beginPath();
      ctx.ellipse(coreX, coreY, coreBaseR * scaleX, coreH * scaleY, Math.PI / 15, 0, Math.PI * 2);
      ctx.fillStyle = coreGlowIntensity > 0.01 ? "#ffffff" : colorIvory;
      ctx.strokeStyle = `rgba(234, 229, 201, ${(0.6 * glowScaleOffset).toFixed(3)})`;
      ctx.lineWidth = 0.55;
      ctx.stroke();
      ctx.fillStyle = `rgba(234, 229, 201, ${(0.15 + coreGlowIntensity * 0.35).toFixed(3)})`;
      ctx.fill();

      // Center sharp focus point
      ctx.beginPath();
      ctx.arc(coreX, coreY, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // --------------------------------------------------
      // LAYER 5: Orbiting Nodes (Fastest Parallax)
      // --------------------------------------------------
      const orbiterOffsetLimit = 0.9;
      const ox = cx + parallaxX.current * orbiterOffsetLimit;
      const oy = cy + parallaxY.current * orbiterOffsetLimit;

      // Tilt angle helper for orbit mapping
      const tiltRad = Math.PI / 15;

      const updateOrbiterCoords = (node: typeof staticOrbiters[0]) => {
        // Orbit speed increases slightly on hover
        node.angle += node.speed * delta * (isHovered ? 1.6 : 1.0);
        
        // Map tilted ellipse coordinates locally
        const lx = Math.cos(node.angle) * node.rx;
        const ly = Math.sin(node.angle) * node.ry;

        // Apply tilt rotation
        node.relX = lx * Math.cos(tiltRad) - ly * Math.sin(tiltRad);
        node.relY = lx * Math.sin(tiltRad) + ly * Math.cos(tiltRad);
      };

      // Draw static orbiters
      staticOrbiters.forEach((node) => {
        updateOrbiterCoords(node);
        const nodex = ox + node.relX;
        const nodey = oy - 16 + node.relY;

        // Pulse scale
        const pulse = 1.0 + 0.14 * Math.sin(now * 0.0035 + node.id);
        const radius = node.size * pulse;

        // Outer glow
        ctx.beginPath();
        ctx.arc(nodex, nodey, radius * 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(61, 165, 138, ${(0.12 * (isHovered ? 1.5 : 1.0)).toFixed(3)})`;
        ctx.lineWidth = 0.45;
        ctx.stroke();

        // Node center
        ctx.beginPath();
        ctx.arc(nodex, nodey, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 229, 201, ${(node.opacity * 1.5).toFixed(3)})`;
        ctx.fill();
      });

      // Draw dynamic evolution orbiter if active
      if (dynamicNode.isActive && dynamicNode.state !== "merge") {
        // Map tilted coordinates
        const lx = Math.cos(dynamicNode.angle) * dynamicNode.rx;
        const ly = Math.sin(dynamicNode.angle) * dynamicNode.ry;

        dynamicNode.relX = lx * Math.cos(tiltRad) - ly * Math.sin(tiltRad);
        dynamicNode.relY = lx * Math.sin(tiltRad) + ly * Math.cos(tiltRad);

        const nodex = ox + dynamicNode.relX;
        const nodey = oy - 16 + dynamicNode.relY;

        // Pulse scale
        const pulse = 1.0 + 0.15 * Math.sin(now * 0.004);
        const radius = dynamicNode.size * pulse;

        // Draw vertical measurement tick marks linking dynamic node to core plane
        if (dynamicNode.state === "orbit" || dynamicNode.state === "spiral") {
          ctx.strokeStyle = "rgba(61, 165, 138, 0.065)";
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          ctx.moveTo(nodex, nodey);
          ctx.lineTo(nodex, coreY);
          ctx.stroke();
        }

        // Outer glow
        ctx.beginPath();
        ctx.arc(nodex, nodey, radius * 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(61, 165, 138, ${(0.45 * dynamicNode.opacity).toFixed(3)})`;
        ctx.lineWidth = 0.45;
        ctx.stroke();

        // Node center
        ctx.beginPath();
        ctx.arc(nodex, nodey, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dynamicNode.opacity.toFixed(3)})`;
        ctx.fill();
      }

      // --------------------------------------------------
      // LAYER 6: Update DOM HTML Floating Labels
      // --------------------------------------------------
      const time = now * 0.001;
      activeLabels.forEach((al) => {
        // Resolve target orbiter position
        let targetNode = staticOrbiters[al.orbiterIdx];
        if (al.orbiterIdx === 3) {
          targetNode = dynamicNode;
        }

        if (!targetNode || (al.orbiterIdx === 3 && !dynamicNode.isActive)) {
          al.orbiterIdx = Math.floor(Math.random() * 3);
          targetNode = staticOrbiters[al.orbiterIdx];
        }

        al.life -= delta;

        // Lifecycle transitions
        if (al.state === "fadeIn") {
          const targetOp = 0.35 * (al.orbiterIdx === 3 ? dynamicNode.opacity : 1.0);
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
          al.orbiterIdx = Math.floor(Math.random() * (dynamicNode.isActive ? 4 : 3));
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
        const currDriftX = al.driftX + Math.sin(time * 0.72 + al.phase) * driftDist;
        const currDriftY = al.driftY + Math.cos(time * 0.54 + al.phase) * driftDist;

        // Position DOM element relative to checkpoint
        const targetX = ox + targetNode.relX;
        const targetY = oy - 16 + targetNode.relY;

        al.elem.style.left = `${targetX + currDriftX}px`;
        al.elem.style.top = `${targetY + currDriftY - 14}px`;

        let finalOpacity = al.opacity;
        if (isHovered) {
          const dx = mouseX.current * 1.5 - targetNode.relX;
          const dy = mouseY.current * 1.5 - targetNode.relY;
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,229,201,0.035)_0%,transparent_75%)] pointer-events-none" />

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

      {/* Unified System Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-7 md:p-8 pointer-events-none text-[#eae5c9]">
        
        {/* Top Header */}
        <div className="flex justify-between items-start w-full">
          <div>
            <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
              EVOLUTION ENGINE
            </span>
            <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
              Continuous Improvement Active
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
              <span>Platform Efficiency Increasing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
