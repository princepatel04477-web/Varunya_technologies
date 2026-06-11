"use client";

import { useEffect, useRef, useState } from "react";

interface ValidationEngineProps {
  stepBody?: string;
}

export default function ValidationEngine({ stepBody }: ValidationEngineProps) {
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

    // Color tokens
    const colorIvory = "rgba(234, 229, 201, 1)"; // #eae5c9
    const colorTeal = "rgba(61, 165, 138, 1)";    // #3da58a

    // 1. Checkpoint nodes around shield perimeter
    interface CheckpointNode {
      id: number;
      angle: number; // in radians
      radius: number;
      relX: number; // calculated relative coordinate
      relY: number;
      opacity: number;
      pulse: number;
      label: string;
      state: "IDLE" | "TESTING" | "PASSED";
    }

    const checkpointNodes: CheckpointNode[] = [
      { id: 0, angle: 0, radius: 56, relX: 0, relY: 0, opacity: 0.25, pulse: 0, label: "Security", state: "IDLE" },
      { id: 1, angle: Math.PI / 3, radius: 56, relX: 0, relY: 0, opacity: 0.25, pulse: 0, label: "Reliability", state: "IDLE" },
      { id: 2, angle: (2 * Math.PI) / 3, radius: 56, relX: 0, relY: 0, opacity: 0.25, pulse: 0, label: "Performance", state: "IDLE" },
      { id: 3, angle: Math.PI, radius: 56, relX: 0, relY: 0, opacity: 0.25, pulse: 0, label: "Compatibility", state: "IDLE" },
      { id: 4, angle: (4 * Math.PI) / 3, radius: 56, relX: 0, relY: 0, opacity: 0.25, pulse: 0, label: "Regression", state: "IDLE" },
      { id: 5, angle: (5 * Math.PI) / 3, radius: 56, relX: 0, relY: 0, opacity: 0.25, pulse: 0, label: "Load Testing", state: "IDLE" },
    ];

    // 2. Imperfection detection state (Every 11s)
    let imperfection = {
      relX: -16,
      relY: -8,
      active: false,
      detected: false,
      repaired: false,
      opacity: 0,
      scale: 1.0,
      timer: 0,
      repairProgress: 0,
      burstRadius: 0,
      burstOpacity: 0,
    };

    // 3. Floating label candidates
    const labelCandidates = [
      "Security",
      "Validation",
      "Reliability",
      "Performance",
      "Compatibility",
      "Load Testing",
      "Stress Testing",
      "Quality Gate",
      "Audit Layer",
      "Regression",
      "Verification",
      "Production Ready",
    ];

    interface FloatingLabel {
      elem: HTMLDivElement;
      checkpointIdx: number;
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
        const checkpointIdx = Math.floor(Math.random() * checkpointNodes.length);
        const textIdx = Math.floor(Math.random() * labelCandidates.length);
        const maxLife = 4.0 + Math.random() * 2.0;

        elem.querySelector("span")!.innerText = labelCandidates[textIdx];

        activeLabels.push({
          elem,
          checkpointIdx,
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
    const loopDuration = 15.0; // 15s inspection loop cycle

    let imperfectionCycleTimer = 0;
    const imperfectionCycle = 11.0; // Imperfection appears every 11 seconds

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
      imperfectionCycleTimer += delta;

      // Handle loop states:
      // 0.0 - 3.5s (Inspect): scanner actively rotates, checks nodes.
      // 3.5 - 7.0s (Validate): internal grid flashes, verification scans.
      // 7.0 - 10.5s (Approve): outer rings and nodes stabilize to solid.
      // 10.5 - 15.0s (Monitor): calm, running check status.
      const stage = Math.floor(loopTimer / 3.75);
      const stageTime = loopTimer % 3.75;

      // --------------------------------------------------
      // LAYER 1: Grid System background (Slowest Parallax)
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
      // LAYER 2: Verification Ring & Inspection Sweep (Medium Parallax)
      // --------------------------------------------------
      const frameOffsetLimit = 0.45;
      const rx = cx + parallaxX.current * frameOffsetLimit;
      const ry = cy + parallaxY.current * frameOffsetLimit;

      // Rotate verification ring slowly
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(now * 0.0002);
      ctx.beginPath();
      ctx.arc(0, 0, 72, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(234, 229, 201, ${isHovered ? 0.08 : 0.04})`;
      ctx.lineWidth = 0.55;
      ctx.setLineDash([3, 5]); // dashed inspection ring
      ctx.stroke();
      ctx.restore();

      // Inspection sweep angle (rotates clockwise)
      const sweepSpeed = isHovered ? 0.95 : 0.55;
      const sweepAngle = (now * 0.001 * sweepSpeed) % (Math.PI * 2);

      // Draw inspection sweep line
      const sweepLen = 72;
      const sx = rx + Math.cos(sweepAngle) * sweepLen;
      const sy = ry + Math.sin(sweepAngle) * sweepLen;

      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `rgba(61, 165, 138, ${isHovered ? 0.22 : 0.095})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Sweep trailing shadow gradient
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.arc(rx, ry, sweepLen, sweepAngle - 0.2, sweepAngle);
      ctx.lineTo(rx, ry);
      const sweepGrad = ctx.createRadialGradient(rx, ry, 5, rx, ry, sweepLen);
      sweepGrad.addColorStop(0, "rgba(61, 165, 138, 0.08)");
      sweepGrad.addColorStop(1, "rgba(61, 165, 138, 0)");
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // --------------------------------------------------
      // LAYER 3: Confidence Field glow (Medium Parallax)
      // --------------------------------------------------
      const baseFieldRadius = stage === 2 ? 55 : 44;
      const fieldPulse = baseFieldRadius + Math.sin(now * 0.0025) * (isHovered ? 6 : 4);
      const fieldOpacity = stage === 2 ? (isHovered ? 0.095 : 0.06) : (isHovered ? 0.045 : 0.025);

      const fieldGrad = ctx.createRadialGradient(rx, ry, 5, rx, ry, fieldPulse);
      fieldGrad.addColorStop(0, `rgba(61, 165, 138, ${fieldOpacity.toFixed(3)})`);
      fieldGrad.addColorStop(1, "rgba(61, 165, 138, 0)");
      ctx.beginPath();
      ctx.arc(rx, ry, fieldPulse, 0, Math.PI * 2);
      ctx.fillStyle = fieldGrad;
      ctx.fill();

      // --------------------------------------------------
      // LAYER 4: Validation Core Shield (Medium Parallax)
      // --------------------------------------------------
      // Handle shield adaptation during imperfection repair
      let shieldAdaptOffset = 0;
      const evoTime = imperfectionCycleTimer % imperfectionCycle;

      if (evoTime < 1.8) {
        imperfection.active = true;
        imperfection.repaired = false;
        imperfection.opacity = Math.min(0.6, evoTime / 0.5);
      } else if (evoTime >= 1.8 && evoTime < 4.5) {
        // Sweep passing & detecting imperfection
        const imperfAngle = Math.atan2(imperfection.relY, imperfection.relX) + Math.PI * 2;
        const normalizedSweep = sweepAngle % (Math.PI * 2);
        
        // Scan detects angle alignment
        if (Math.abs(normalizedSweep - imperfAngle) < 0.28 && !imperfection.detected) {
          imperfection.detected = true;
          imperfection.repairProgress = 0;
        }

        if (imperfection.detected && !imperfection.repaired) {
          imperfection.repairProgress += 0.8 * delta;
          shieldAdaptOffset = Math.sin(imperfection.repairProgress * Math.PI * 2) * 1.5;

          if (imperfection.repairProgress >= 1.0) {
            imperfection.repaired = true;
            imperfection.active = false;
            imperfection.detected = false;
            imperfection.burstRadius = 0;
            imperfection.burstOpacity = 0.8;
          }
        }
      } else {
        imperfection.active = false;
        imperfection.detected = false;
      }

      // Draw burst wave if recently repaired
      if (imperfection.burstOpacity > 0.01) {
        imperfection.burstRadius += 68 * delta;
        imperfection.burstOpacity -= 1.8 * delta;

        ctx.beginPath();
        ctx.arc(rx + imperfection.relX, ry + imperfection.relY, Math.max(0, imperfection.burstRadius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(61, 165, 138, ${Math.max(0, imperfection.burstOpacity).toFixed(3)})`;
        ctx.lineWidth = 0.55;
        ctx.stroke();
      }

      // Base coordinates for the Shield relative to center (rx, ry)
      // Modify left/right points slightly when adapting/repairing
      const shTL = { x: -26, y: -30 };
      const shTC = { x: 0, y: -38 + shieldAdaptOffset };
      const shTR = { x: 26, y: -30 };
      const shML = { x: -28 + shieldAdaptOffset, y: -2 };
      const shMR = { x: 28 - shieldAdaptOffset, y: -2 };
      const shBC = { x: 0, y: 38 };

      const drawShieldPath = () => {
        ctx.moveTo(rx + shTL.x, ry + shTL.y);
        ctx.quadraticCurveTo(rx + shTC.x, ry + shTC.y, rx + shTR.x, ry + shTR.y);
        ctx.quadraticCurveTo(rx + shMR.x, ry + shMR.y, rx + shBC.x, ry + shBC.y);
        ctx.quadraticCurveTo(rx + shML.x, ry + shML.y, rx + shTL.x, ry + shTL.y);
      };

      // Outer Shield Wireframe outline
      ctx.beginPath();
      drawShieldPath();
      ctx.closePath();
      const baseShieldOp = stage === 2 ? 0.35 : 0.18;
      ctx.strokeStyle = `rgba(234, 229, 201, ${(baseShieldOp * (isHovered ? 1.4 : 1.0)).toFixed(3)})`;
      ctx.lineWidth = 0.65;
      ctx.stroke();

      // Inner Shield Wireframe outline (representing structural depth)
      ctx.save();
      ctx.translate(rx, ry);
      ctx.scale(0.74, 0.74);
      ctx.beginPath();
      // redraw path locally centered at 0, 0
      ctx.moveTo(shTL.x, shTL.y);
      ctx.quadraticCurveTo(shTC.x, shTC.y, shTR.x, shTR.y);
      ctx.quadraticCurveTo(shMR.x, shMR.y, shBC.x, shBC.y);
      ctx.quadraticCurveTo(shML.x, shML.y, shTL.x, shTL.y);
      ctx.closePath();
      ctx.strokeStyle = `rgba(234, 229, 201, ${(baseShieldOp * 0.4 * (isHovered ? 1.4 : 1.0)).toFixed(3)})`;
      ctx.lineWidth = 0.45;
      ctx.stroke();

      // System audit vertical scan bar in Stage 1
      if (stage === 1) {
        const auditProgress = stageTime / 3.75;
        const scanY = -38 + auditProgress * 76;

        ctx.strokeStyle = "rgba(61, 165, 138, 0.12)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(shTL.x, scanY);
        ctx.lineTo(shTR.x, scanY);
        ctx.stroke();

        // Illuminate inner wireframe fill on audit scan intersection
        ctx.fillStyle = "rgba(61, 165, 138, 0.018)";
        ctx.fill();
      }
      ctx.restore();

      // Draw Imperfection node if active
      if (imperfection.active) {
        const pulse = 1.0 + 0.28 * Math.sin(now * 0.005);
        const radius = (imperfection.detected ? 2.2 : 1.5) * pulse;

        ctx.beginPath();
        ctx.arc(rx + imperfection.relX, ry + imperfection.relY, radius, 0, Math.PI * 2);
        // low warning highlight, colored teal as we don't use red alerts per specs
        ctx.fillStyle = `rgba(61, 165, 138, ${imperfection.opacity.toFixed(3)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rx + imperfection.relX, ry + imperfection.relY, radius * 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(61, 165, 138, ${(imperfection.opacity * 0.4).toFixed(3)})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // --------------------------------------------------
      // LAYER 5: Checkpoint Nodes (Fastest Parallax)
      // --------------------------------------------------
      const nodeOffsetLimit = 0.9;
      const nx = cx + parallaxX.current * nodeOffsetLimit;
      const ny = cy + parallaxY.current * nodeOffsetLimit;

      checkpointNodes.forEach((node) => {
        // Calculate dynamic relative coordinates around shield
        node.relX = Math.cos(node.angle) * node.radius;
        node.relY = Math.sin(node.angle) * node.radius * 0.72; // slight ellipse mapping

        const nodex = nx + node.relX;
        const nodey = ny + node.relY;

        // Resolve checkpoint state relative to sweep angle proximity
        const nodeAnglePos = (node.angle + Math.PI * 2) % (Math.PI * 2);
        const sweepAnglePos = sweepAngle % (Math.PI * 2);
        const diff = Math.abs(sweepAnglePos - nodeAnglePos);

        if (diff < 0.28) {
          node.state = "TESTING";
          node.opacity += (0.9 - node.opacity) * 0.08;
        } else {
          node.state = "PASSED"; // default validation passes continuously
          const targetOp = stage === 2 ? 0.9 : 0.4;
          node.opacity += (targetOp - node.opacity) * 0.05;
        }

        node.pulse += 3.5 * delta;
        const scale = node.state === "TESTING" ? 1.0 + 0.16 * Math.sin(node.pulse) : 1.0;
        const r = 2.2 * scale;

        // Outer pulse circle
        ctx.beginPath();
        ctx.arc(nodex, nodey, r * 2.2, 0, Math.PI * 2);
        const circleOp = node.state === "TESTING" ? 0.45 : (stage === 2 ? 0.35 : 0.08);
        ctx.strokeStyle = `rgba(61, 165, 138, ${(circleOp * (isHovered ? 1.5 : 1.0)).toFixed(3)})`;
        ctx.lineWidth = 0.45;
        ctx.stroke();

        // Node center
        ctx.beginPath();
        ctx.arc(nodex, nodey, r, 0, Math.PI * 2);
        ctx.fillStyle = node.state === "TESTING" ? "#ffffff" : `rgba(61, 165, 138, ${node.opacity.toFixed(3)})`;
        ctx.fill();
      });

      // --------------------------------------------------
      // LAYER 6: Update DOM HTML Floating Labels
      // --------------------------------------------------
      const time = now * 0.001;
      activeLabels.forEach((al) => {
        const targetNode = checkpointNodes[al.checkpointIdx];
        if (!targetNode) return;

        al.life -= delta;

        // Lifecycle transitions
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
          al.checkpointIdx = Math.floor(Math.random() * checkpointNodes.length);
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
        const targetX = nx + targetNode.relX;
        const targetY = ny + targetNode.relY;

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
      {/* Volumetric background radial grid glow */}
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
              VALIDATION ENGINE
            </span>
            <div className="font-mono font-bold text-[11px] mt-1 text-[#eae5c9] opacity-90">
              System Integrity Verified
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
              <span>Release Confidence Established</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
