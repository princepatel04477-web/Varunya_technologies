"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three"; // Used for basic Vector math if needed, but we'll use vanilla JS for lightweight canvas rendering

interface DiscoveryEngineProps {
  stepBody?: string;
}

export default function DiscoveryEngine({ stepBody }: DiscoveryEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Parallax mouse offsets
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const parallaxX = useRef(0);
  const parallaxY = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalized cursor coordinate from -0.5 to 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.current = x * 18; // Max 9px drift left/right
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

    // Color definitions matching the luxury agency palette
    const colorIvory = "rgba(234, 229, 201, 1)"; // #eae5c9
    const colorTeal = "rgba(61, 165, 138, 1)";    // #3da58a

    // 1. Discovery Nodes Polar Coordinates Setup (gradually unlocked by sweep)
    interface SignalNode {
      label: string;
      angle: number; // Polar coordinate angle (0 to 2*PI)
      distance: number; // Radius from center
      size: number;
      opacity: number;
      targetOpacity: number;
      pulsePhase: number;
      activeTimer: number;
    }

    const nodes: SignalNode[] = [
      { label: "Stakeholder Mapping", angle: 0.4, distance: 75, size: 2.5, opacity: 0, targetOpacity: 0, pulsePhase: 0, activeTimer: 0 },
      { label: "User Alignment Analysis", angle: 1.2, distance: 95, size: 2.2, opacity: 0, targetOpacity: 0, pulsePhase: Math.PI / 4, activeTimer: 0 },
      { label: "Opportunity Scan", angle: 2.1, distance: 65, size: 2.8, opacity: 0, targetOpacity: 0, pulsePhase: Math.PI / 2, activeTimer: 0 },
      { label: "Technical Audit", angle: 2.8, distance: 110, size: 2.0, opacity: 0, targetOpacity: 0, pulsePhase: Math.PI, activeTimer: 0 },
      { label: "Roadmap Scope", angle: 3.6, distance: 80, size: 2.6, opacity: 0, targetOpacity: 0, pulsePhase: 1.5 * Math.PI, activeTimer: 0 },
      { label: "Signal Detected", angle: 4.4, distance: 125, size: 1.8, opacity: 0, targetOpacity: 0, pulsePhase: 0.5 * Math.PI, activeTimer: 0 },
      { label: "Target Profile Mapping", angle: 5.1, distance: 70, size: 2.4, opacity: 0, targetOpacity: 0, pulsePhase: Math.PI * 0.3, activeTimer: 0 },
      { label: "Core Requirements", angle: 5.9, distance: 100, size: 2.3, opacity: 0, targetOpacity: 0, pulsePhase: Math.PI * 0.7, activeTimer: 0 },
    ];

    // 2. Info gathering particles (drifting inward toward core)
    interface Particle {
      angle: number;
      distance: number;
      speed: number;
      size: number;
      opacity: number;
    }

    const particleCount = 20;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 120 + Math.random() * 80,
        speed: 0.35 + Math.random() * 0.5,
        size: 0.6 + Math.random() * 0.8,
        opacity: 0,
      });
    }

    // 3. Ring propagation waves (soft expanding concentric pulses)
    interface Wave {
      radius: number;
      maxRadius: number;
      speed: number;
      opacity: number;
    }

    const waves: Wave[] = [
      { radius: 10, maxRadius: 130, speed: 0.6, opacity: 0 },
      { radius: 70, maxRadius: 130, speed: 0.6, opacity: 0 },
    ];

    // Discovery Sweep Angle
    let sweepAngle = 0;

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
      const cy = height / 2 - 10; // offset slightly upward to accommodate description spacing

      const sweepSpeedMultiplier = isHovered ? 0.62 : 0.44;
      sweepAngle = (sweepAngle + sweepSpeedMultiplier * delta) % (Math.PI * 2);

      // --------------------------------------------------
      // LAYER 1: Blueprint grid background (Slowest Parallax)
      // --------------------------------------------------
      const gridOffsetLimit = 0.2; // Grid has lowest parallax offset
      const gx = parallaxX.current * gridOffsetLimit;
      const gy = parallaxY.current * gridOffsetLimit;

      ctx.strokeStyle = "rgba(234, 229, 201, 0.012)";
      ctx.lineWidth = 0.5;
      const gridSize = 35;

      // Vertical lines
      for (let x = gx % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // Horizontal lines
      for (let y = gy % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --------------------------------------------------
      // LAYER 2: Concentric rings and sweep (Medium Parallax)
      // --------------------------------------------------
      const ringOffsetLimit = 0.5;
      const rx = cx + parallaxX.current * ringOffsetLimit;
      const ry = cy + parallaxY.current * ringOffsetLimit;

      // Base concentric rings
      const ringsRadii = [45, 80, 115];
      ringsRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(rx, ry, r, 0, Math.PI * 2);
        ctx.lineWidth = 0.5;
        // Make the middle ring dashed
        if (idx === 1) {
          ctx.setLineDash([4, 8]);
          ctx.strokeStyle = isHovered ? "rgba(234, 229, 201, 0.075)" : "rgba(234, 229, 201, 0.04)";
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = isHovered ? "rgba(234, 229, 201, 0.05)" : "rgba(234, 229, 201, 0.025)";
        }
        ctx.stroke();
      });
      ctx.setLineDash([]); // Reset dash

      // Expanding wave propagation
      waves.forEach((w) => {
        w.radius += w.speed * 60 * delta;
        if (w.radius > w.maxRadius) {
          w.radius = 10;
        }
        const progress = w.radius / w.maxRadius;
        const waveBaseOp = isHovered ? 0.16 : 0.09;
        w.opacity = (1.0 - progress) * waveBaseOp;

        ctx.beginPath();
        ctx.arc(rx, ry, Math.max(0, w.radius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(234, 229, 201, ${w.opacity.toFixed(3)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // Rotating discovery radial sweep
      const sweepRadius = 140;
      const sweepEndX = rx + Math.cos(sweepAngle) * sweepRadius;
      const sweepEndY = ry + Math.sin(sweepAngle) * sweepRadius;

      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(sweepEndX, sweepEndY);
      const sweepOpacity = isHovered ? "0.075" : "0.035";
      ctx.strokeStyle = `rgba(234, 229, 201, ${sweepOpacity})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Soft trailing sweep gradient cone (barely visible)
      const segments = 24;
      for (let i = 0; i < segments; i++) {
        const segAngle = sweepAngle - (i * 0.014);
        const trailEndX = rx + Math.cos(segAngle) * sweepRadius;
        const trailEndY = ry + Math.sin(segAngle) * sweepRadius;
        const segOpacity = (1.0 - i / segments) * (isHovered ? 0.03 : 0.015);

        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(trailEndX, trailEndY);
        ctx.strokeStyle = `rgba(234, 229, 201, ${segOpacity.toFixed(4)})`;
        ctx.stroke();
      }

      // --------------------------------------------------
      // LAYER 3: Particles flow (Inward)
      // --------------------------------------------------
      particles.forEach((p) => {
        p.distance -= p.speed * 60 * delta;
        if (p.distance < 12) {
          // Reset to outer boundary
          p.distance = 130 + Math.random() * 60;
          p.angle = Math.random() * Math.PI * 2;
          p.opacity = 0;
        }

        // Calculate opacity based on distance (fade in, hold, fade out near center)
        if (p.distance > 150) {
          p.opacity += (0.28 - p.opacity) * 0.08;
        } else if (p.distance < 40) {
          p.opacity += (0.0 - p.opacity) * 0.15;
        } else {
          p.opacity = 0.28;
        }

        // Apply hover increase
        const finalOp = p.opacity * (isHovered ? 1.5 : 1.0);

        const px = rx + Math.cos(p.angle) * p.distance;
        const py = ry + Math.sin(p.angle) * p.distance;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 229, 201, ${finalOp.toFixed(3)})`;
        ctx.fill();
      });

      // --------------------------------------------------
      // LAYER 4: Discovery Nodes & Connection Lines (Fastest Parallax)
      // --------------------------------------------------
      const nodeOffsetLimit = 1.0; // Nodes have maximum parallax movement
      const nx = cx + parallaxX.current * nodeOffsetLimit;
      const ny = cy + parallaxY.current * nodeOffsetLimit;

      // Project nodes coordinates to screen position
      const screenNodes = nodes.map((node) => {
        const x = nx + Math.cos(node.angle) * node.distance;
        const y = ny + Math.sin(node.angle) * node.distance;
        return { ...node, x, y };
      });

      // Discovery trigger check (when sweep passes node polar angle)
      screenNodes.forEach((node) => {
        const diff = Math.abs(sweepAngle - node.angle);
        const normalizedDiff = Math.min(diff, Math.PI * 2 - diff);

        if (normalizedDiff < 0.08) {
          node.targetOpacity = 0.75;
          node.activeTimer = 4.5; // Stay active for 4.5 seconds
        }

        if (node.activeTimer > 0) {
          node.activeTimer -= delta;
          if (node.activeTimer <= 0.8) {
            node.targetOpacity = 0.0;
          }
        }

        node.opacity += (node.targetOpacity - node.opacity) * 0.06;
      });

      // Draw Connection Lines between close discovered active nodes
      for (let i = 0; i < screenNodes.length; i++) {
        for (let j = i + 1; j < screenNodes.length; j++) {
          const n1 = screenNodes[i];
          const n2 = screenNodes[j];

          if (n1.opacity > 0.1 && n2.opacity > 0.1) {
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Connect if nodes are close enough
            if (dist < 80) {
              const lineBaseOp = isHovered ? 0.24 : 0.12;
              const lineOpacity = Math.min(n1.opacity, n2.opacity) * lineBaseOp;

              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = `rgba(234, 229, 201, ${lineOpacity.toFixed(3)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Draw Nodes & Labels
      screenNodes.forEach((node) => {
        if (node.opacity <= 0.005) return;

        node.pulsePhase += 2.5 * delta;
        const pulse = 1.0 + 0.18 * Math.sin(node.pulsePhase);
        const radius = node.size * pulse;

        // Outer signal ring glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(61, 165, 138, ${(node.opacity * 0.15).toFixed(3)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Node center core point
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity.toFixed(3)})`;
        ctx.fill();

        // Mini metadata annotation text label next to the node
        ctx.font = "normal 8px monospace";
        ctx.fillStyle = `rgba(234, 229, 201, ${(node.opacity * 0.55).toFixed(3)})`;
        ctx.fillText(node.label, node.x + 8, node.y + 3);
      });

      // --------------------------------------------------
      // LAYER 5: Strategic vision Center Core (Deepest Parallax)
      // --------------------------------------------------
      const coreOffsetLimit = 0.85;
      const ccx = cx + parallaxX.current * coreOffsetLimit;
      const ccy = cy + parallaxY.current * coreOffsetLimit;

      const coreGlowScale = 1.0 + 0.06 * Math.sin(now * 0.0022);

      // Radial glowing core gradient
      const coreGrad = ctx.createRadialGradient(ccx, ccy, 1, ccx, ccy, 24 * coreGlowScale);
      const coreBaseGlow = isHovered ? 0.3 : 0.16;
      coreGrad.addColorStop(0, `rgba(255, 255, 255, ${coreBaseGlow})`);
      coreGrad.addColorStop(0.3, `rgba(234, 229, 201, ${(coreBaseGlow * 0.4).toFixed(3)})`);
      coreGrad.addColorStop(1, "rgba(234, 229, 201, 0)");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(ccx, ccy, 24 * coreGlowScale, 0, Math.PI * 2);
      ctx.fill();

      // Sharp central white nucleus
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ccx, ccy, 3, 0, Math.PI * 2);
      ctx.fill();

      // --------------------------------------------------
      // LAYER 6: Focus Markers / Framing Brackets
      // --------------------------------------------------
      const inset = 16;
      const bSize = 6;
      ctx.strokeStyle = isHovered ? "rgba(234, 229, 201, 0.24)" : "rgba(234, 229, 201, 0.12)";
      ctx.lineWidth = 0.7;

      // Top-Left corner bracket
      ctx.beginPath();
      ctx.moveTo(inset + bSize, inset);
      ctx.lineTo(inset, inset);
      ctx.lineTo(inset, inset + bSize);
      ctx.stroke();

      // Top-Right corner bracket
      ctx.beginPath();
      ctx.moveTo(width - inset - bSize, inset);
      ctx.lineTo(width - inset, inset);
      ctx.lineTo(width - inset, inset + bSize);
      ctx.stroke();

      // Bottom-Left corner bracket
      ctx.beginPath();
      ctx.moveTo(inset + bSize, height - inset);
      ctx.lineTo(inset, height - inset);
      ctx.lineTo(inset, height - inset + bSize);
      ctx.stroke();

      // Bottom-Right corner bracket
      ctx.beginPath();
      ctx.moveTo(width - inset - bSize, height - inset);
      ctx.lineTo(width - inset, height - inset);
      ctx.lineTo(width - inset, height - inset + bSize);
      ctx.stroke();

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

      {/* Render Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10" />

      {/* Unified System Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-7 md:p-8 pointer-events-none text-[#eae5c9]">
        
        {/* Top Header */}
        <div className="flex justify-between items-start w-full">
          <div>
            <span className="font-serif italic uppercase text-[9px] tracking-[0.25em] opacity-40">
              DISCOVERY ENGINE
            </span>
            <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
              Strategic Analysis Active
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
              <span>Research Signals Processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
