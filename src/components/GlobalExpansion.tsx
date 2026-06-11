"use client";

import { useEffect, useRef, useState } from "react";

interface GlobalExpansionProps {
  stepBody?: string;
}

export default function GlobalExpansion({ stepBody }: GlobalExpansionProps) {
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

    // 1. Concentric Expansion Rings setup
    interface ExpansionRing {
      radius: number;
      maxRadius: number;
      speed: number;
      opacity: number;
    }

    const expansionRings: ExpansionRing[] = [
      { radius: 10, maxRadius: 120, speed: 28, opacity: 1 },
      { radius: 45, maxRadius: 120, speed: 28, opacity: 1 },
      { radius: 80, maxRadius: 120, speed: 28, opacity: 1 },
    ];

    // 2. Peripheral Endpoint Nodes
    interface EndpointNode {
      id: number;
      angle: number;
      radius: number;
      relX: number;
      relY: number;
      opacity: number;
      pulse: number;
      isActive: boolean;
    }

    const staticEndpoints: EndpointNode[] = [
      { id: 0, angle: -Math.PI / 2 + Math.PI / 5, radius: 66, relX: 0, relY: 0, opacity: 0.2, pulse: 0, isActive: false },
      { id: 1, angle: -Math.PI / 2 + (3 * Math.PI) / 5, radius: 66, relX: 0, relY: 0, opacity: 0.2, pulse: 0, isActive: false },
      { id: 2, angle: -Math.PI / 2 + (5 * Math.PI) / 5, radius: 66, relX: 0, relY: 0, opacity: 0.2, pulse: 0, isActive: false },
      { id: 3, angle: -Math.PI / 2 + (7 * Math.PI) / 5, radius: 66, relX: 0, relY: 0, opacity: 0.2, pulse: 0, isActive: false },
      { id: 4, angle: -Math.PI / 2 + (9 * Math.PI) / 5, radius: 66, relX: 0, relY: 0, opacity: 0.2, pulse: 0, isActive: false },
    ];

    interface DynamicEndpointNode extends EndpointNode {
      signalProgress: number;
      pulseRadius: number;
      pulseOpacity: number;
    }

    let dynamicEndpoint: DynamicEndpointNode = {
      id: 5,
      angle: Math.random() * Math.PI * 2,
      radius: 80,
      relX: 0,
      relY: 0,
      opacity: 0,
      pulse: 0,
      isActive: false,
      signalProgress: 0,
      pulseRadius: 0,
      pulseOpacity: 0,
    };

    // 3. Traffic / Distribution Signal Particles
    interface SignalParticle {
      angle: number;
      distance: number;
      speed: number;
      size: number;
      color: string;
    }

    const signalParticles: SignalParticle[] = [];

    // 4. Floating Labels candidates
    const labelCandidates = [
      "Production",
      "Edge Network",
      "CDN",
      "Global Reach",
      "Live Traffic",
      "Endpoint",
      "DNS",
      "User Access",
      "Distribution Layer",
      "Public Network",
      "Availability",
      "Launch Channel",
    ];

    interface FloatingLabel {
      elem: HTMLDivElement;
      endpointIdx: number; // 0 to 4 (static), 5 (dynamic)
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
        const endpointIdx = Math.floor(Math.random() * 5); // 0 to 4
        const textIdx = Math.floor(Math.random() * labelCandidates.length);
        const maxLife = 4.0 + Math.random() * 2.0;

        elem.querySelector("span")!.innerText = labelCandidates[textIdx];

        activeLabels.push({
          elem,
          endpointIdx,
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
    const loopDuration = 15.0; // 15s sequence loop

    let dynamicNodeTimer = 0;
    const dynamicNodeCycle = 12.0; // Dynamic node appears every 12s

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
      dynamicNodeTimer += delta;

      // Handle the dynamic node deployment sequence (every 12s)
      const nodeTime = dynamicNodeTimer % dynamicNodeCycle;
      if (nodeTime < 1.0) {
        // Reset dynamic node at random angle
        if (!dynamicEndpoint.isActive) {
          dynamicEndpoint.isActive = true;
          dynamicEndpoint.angle = Math.random() * Math.PI * 2;
          dynamicEndpoint.signalProgress = 0;
          dynamicEndpoint.opacity = 0;
          dynamicEndpoint.pulseRadius = 0;
          dynamicEndpoint.pulseOpacity = 0;
        }
        dynamicEndpoint.opacity = nodeTime / 1.0;
      } else if (nodeTime >= 1.0 && nodeTime < 2.5) {
        // Send signal packet from core to dynamic node
        dynamicEndpoint.signalProgress = (nodeTime - 1.0) / 1.5;
        dynamicEndpoint.opacity = 1.0;
      } else if (nodeTime >= 2.5 && nodeTime < 5.0) {
        // Connected! Emit pulse waves
        dynamicEndpoint.signalProgress = 1.0;
        dynamicEndpoint.opacity = 1.0;
        
        const pulseTime = nodeTime - 2.5;
        dynamicEndpoint.pulseRadius = pulseTime * 24;
        dynamicEndpoint.pulseOpacity = Math.max(0, 1.0 - pulseTime / 1.5);
      } else if (nodeTime >= 5.0 && nodeTime < 7.0) {
        // Solid active state
        dynamicEndpoint.opacity = Math.max(0, 1.0 - (nodeTime - 5.0) / 2.0);
      } else {
        // Reset state
        dynamicEndpoint.isActive = false;
        dynamicEndpoint.opacity = 0;
      }

      // Live status loop phase stages:
      // 0.0 - 3.0s: System Activation (Core slowly brightens)
      // 3.0 - 7.0s: Expansion Waves (Concentric rings propagate)
      // 7.0 - 11.0s: Network Online (Endpoints connect to core)
      // 11.0 - 15.0s: Signal Distribution (Traffic particles flow)
      const stage = Math.floor(loopTimer / 3.0);
      const stageTime = loopTimer % 3.0;

      // --------------------------------------------------
      // LAYER 1: Global Field radial grid (Slowest Parallax)
      // --------------------------------------------------
      const gridOffsetLimit = 0.18;
      const gx = cx + parallaxX.current * gridOffsetLimit;
      const gy = cy + parallaxY.current * gridOffsetLimit;

      ctx.strokeStyle = "rgba(234, 229, 201, 0.015)";
      ctx.lineWidth = 0.5;
      const fieldRadii = [35, 70, 105, 140, 175];
      fieldRadii.forEach((r) => {
        ctx.beginPath();
        ctx.arc(gx, gy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Axis lines crossing through the field
      ctx.setLineDash([2, 8]);
      ctx.beginPath();
      ctx.moveTo(gx - 190, gy); ctx.lineTo(gx + 190, gy);
      ctx.moveTo(gx, gy - 190); ctx.lineTo(gx, gy + 190);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // --------------------------------------------------
      // LAYER 2: Expansion Waves & Activation Vector (Medium Parallax)
      // --------------------------------------------------
      const waveOffsetLimit = 0.45;
      const wx = cx + parallaxX.current * waveOffsetLimit;
      const wy = cy + parallaxY.current * waveOffsetLimit;

      // Animate and draw expansion waves (concentric rings)
      if (stage >= 1) {
        expansionRings.forEach((ring) => {
          // speed up ring expansion on hover
          ring.radius += ring.speed * delta * (isHovered ? 1.6 : 1.0);
          if (ring.radius >= ring.maxRadius) {
            ring.radius = 10;
          }

          // Calculate fade opacity based on radius progression
          const progress = ring.radius / ring.maxRadius;
          const finalOpacity = (1.0 - progress) * (isHovered ? 0.095 : 0.045);

          ctx.beginPath();
          ctx.arc(wx, wy, Math.max(0, ring.radius), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(234, 229, 201, ${finalOpacity.toFixed(3)})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        });
      }

      // Draw vertical Activation Vector pointing upwards
      ctx.strokeStyle = "rgba(234, 229, 201, 0.035)";
      ctx.lineWidth = 0.55;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(wx, wy - 10);
      ctx.lineTo(wx, wy - 75);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Glowing dot traveling up the activation vector
      const vectorYProgress = (now * 0.04) % 65;
      const vy = wy - 10 - vectorYProgress;
      ctx.beginPath();
      ctx.arc(wx, vy, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = colorTeal.replace("1)", "0.6)");
      ctx.fill();

      // --------------------------------------------------
      // LAYER 3: Distribution Network Connection Lines (Medium Parallax)
      // --------------------------------------------------
      // Calculate coordinates of static endpoints relative to center (wx, wy)
      staticEndpoints.forEach((end) => {
        end.relX = Math.cos(end.angle) * end.radius;
        end.relY = Math.sin(end.angle) * end.radius * 0.72; // ellipsis mapping
      });

      // Update dynamic endpoint coordinates
      dynamicEndpoint.relX = Math.cos(dynamicEndpoint.angle) * dynamicEndpoint.radius;
      dynamicEndpoint.relY = Math.sin(dynamicEndpoint.angle) * dynamicEndpoint.radius * 0.72;

      // Draw connection lines to endpoints
      let connectionProgress = 1.0;
      if (stage === 0 || stage === 1) {
        connectionProgress = 0;
      } else if (stage === 2) {
        connectionProgress = Math.min(1.0, stageTime / 1.5);
      }

      staticEndpoints.forEach((end) => {
        if (connectionProgress <= 0) return;

        const endx = wx + end.relX;
        const endy = wy + end.relY;

        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(
          wx + (end.relX * connectionProgress),
          wy + (end.relY * connectionProgress)
        );

        ctx.strokeStyle = `rgba(234, 229, 201, ${isHovered ? 0.075 : 0.03})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Draw connection line to dynamic endpoint if active
      if (dynamicEndpoint.isActive && dynamicEndpoint.signalProgress > 0) {
        const dNodeX = wx + dynamicEndpoint.relX;
        const dNodeY = wy + dynamicEndpoint.relY;

        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(
          wx + (dynamicEndpoint.relX * dynamicEndpoint.signalProgress),
          wy + (dynamicEndpoint.relY * dynamicEndpoint.signalProgress)
        );
        ctx.strokeStyle = `rgba(61, 165, 138, ${(0.15 * dynamicEndpoint.opacity).toFixed(3)})`;
        ctx.lineWidth = 0.55;
        ctx.stroke();

        // Signal packet dot on path
        const px = wx + dynamicEndpoint.relX * dynamicEndpoint.signalProgress;
        const py = wy + dynamicEndpoint.relY * dynamicEndpoint.signalProgress;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      // --------------------------------------------------
      // LAYER 4: Signal Particles Distribution (Medium Parallax)
      // --------------------------------------------------
      const particlesActive = stage >= 3 || isHovered;

      if (particlesActive) {
        const spawnChance = isHovered ? 0.12 : 0.04;
        if (Math.random() < spawnChance) {
          // Spawn particle traveling outward
          const randAngle = Math.random() * Math.PI * 2;
          signalParticles.push({
            angle: randAngle,
            distance: 5,
            speed: 38 + Math.random() * 25,
            size: 0.8 + Math.random() * 0.8,
            color: Math.random() < 0.16 ? colorTeal : colorIvory,
          });
        }
      }

      // Update and draw particles
      for (let i = signalParticles.length - 1; i >= 0; i--) {
        const p = signalParticles[i];
        p.distance += p.speed * delta * (isHovered ? 1.4 : 1.0);

        if (p.distance >= 115) {
          signalParticles.splice(i, 1);
          continue;
        }

        // Ellipsis radial projection
        const px = wx + Math.cos(p.angle) * p.distance;
        const py = wy + Math.sin(p.angle) * p.distance * 0.72;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        const baseColor = p.color;
        const op = p.color === colorTeal ? 0.75 : 0.4;
        ctx.fillStyle = baseColor.replace("1)", `${op.toFixed(3)})`);
        ctx.fill();
      }

      // --------------------------------------------------
      // LAYER 5: Activation Core & Endpoints (Fastest Parallax)
      // --------------------------------------------------
      const coreOffsetLimit = 0.9;
      const cxPos = cx + parallaxX.current * coreOffsetLimit;
      const cyPos = cy + parallaxY.current * coreOffsetLimit;

      // Update core activation state
      let coreOpacity = 0.35;
      if (stage === 0) {
        coreOpacity = 0.15 + (0.35 - 0.15) * (stageTime / 3.0);
      } else {
        coreOpacity = 0.35 + 0.12 * Math.sin(now * 0.0035); // breathe pulse
      }

      // Draw Central Activation Core (completed product)
      const coreRadius = 4.2;
      const coreOp = coreOpacity * (isHovered ? 1.5 : 1.0);

      // Core glow ring
      ctx.beginPath();
      ctx.arc(cxPos, cyPos, coreRadius * 2.2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(234, 229, 201, ${(coreOp * 0.15).toFixed(3)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Core center solid
      ctx.beginPath();
      ctx.arc(cxPos, cyPos, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Update and draw static perimeter endpoints
      staticEndpoints.forEach((end) => {
        if (stage === 0 || stage === 1) {
          end.isActive = false;
          end.opacity = 0.15;
        } else if (stage === 2) {
          const delay = end.id * 0.15;
          const activateProgress = Math.max(0, Math.min(1.0, (stageTime - delay) * 1.5));
          end.isActive = activateProgress > 0.8;
          end.opacity = 0.15 + (0.55 - 0.15) * activateProgress;
        } else {
          end.isActive = true;
          end.opacity = 0.55;
        }

        const endx = cxPos + end.relX;
        const endy = cyPos + end.relY;

        end.pulse += 3.0 * delta;
        const scale = end.isActive ? 1.0 + 0.15 * Math.sin(end.pulse) : 1.0;
        const radius = 2.0 * scale;

        // Outer endpoint ring
        ctx.beginPath();
        ctx.arc(endx, endy, radius * 2.2, 0, Math.PI * 2);
        const nodeGlowOp = end.isActive ? 0.38 : 0.08;
        ctx.strokeStyle = `rgba(61, 165, 138, ${(nodeGlowOp * (isHovered ? 1.5 : 1.0)).toFixed(3)})`;
        ctx.lineWidth = 0.45;
        ctx.stroke();

        // Center endpoint dot
        ctx.beginPath();
        ctx.arc(endx, endy, radius, 0, Math.PI * 2);
        ctx.fillStyle = end.isActive ? "#ffffff" : `rgba(234, 229, 201, ${end.opacity.toFixed(3)})`;
        ctx.fill();
      });

      // Draw dynamic deployed endpoint if active
      if (dynamicEndpoint.isActive && dynamicEndpoint.opacity > 0.01) {
        const dx = cxPos + dynamicEndpoint.relX;
        const dy = cyPos + dynamicEndpoint.relY;

        const radius = 2.0;

        // Draw connection signal pulse wave
        if (dynamicEndpoint.pulseOpacity > 0.01) {
          ctx.beginPath();
          ctx.arc(dx, dy, Math.max(0, dynamicEndpoint.pulseRadius), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(61, 165, 138, ${dynamicEndpoint.pulseOpacity.toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Outer ring
        ctx.beginPath();
        ctx.arc(dx, dy, radius * 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(61, 165, 138, ${(0.4 * dynamicEndpoint.opacity).toFixed(3)})`;
        ctx.lineWidth = 0.45;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(dx, dy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dynamicEndpoint.opacity.toFixed(3)})`;
        ctx.fill();
      }

      // --------------------------------------------------
      // LAYER 6: Update DOM HTML Floating Labels
      // --------------------------------------------------
      const time = now * 0.001;
      activeLabels.forEach((al) => {
        // Resolve target endpoint position
        let targetNode = staticEndpoints[al.endpointIdx];
        if (al.endpointIdx === 5) {
          targetNode = dynamicEndpoint;
        }

        if (!targetNode || (al.endpointIdx === 5 && !dynamicEndpoint.isActive)) {
          al.endpointIdx = Math.floor(Math.random() * 5);
          targetNode = staticEndpoints[al.endpointIdx];
        }

        al.life -= delta;

        // Lifecycle transitions
        if (al.state === "fadeIn") {
          const targetOp = 0.35 * (al.endpointIdx === 5 ? dynamicEndpoint.opacity : 1.0);
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
          al.endpointIdx = Math.floor(Math.random() * (dynamicEndpoint.isActive ? 6 : 5));
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
        const targetX = cxPos + targetNode.relX;
        const targetY = cyPos + targetNode.relY;

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
              LAUNCH SEQUENCE
            </span>
            <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
              Production Network Active
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
              <span>System Reach Expanding</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
