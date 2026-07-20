"use client";

import { useEffect, useRef } from "react";

interface ChamberCanvasProps {
  activeChamber: number;
}

export default function ChamberCanvas({ activeChamber }: ChamberCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeChamberRef = useRef(activeChamber);

  useEffect(() => {
    activeChamberRef.current = activeChamber;
  }, [activeChamber]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isMobile = window.innerWidth < 768;

    // Mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 200,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDust();
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    // Particle definitions
    interface Particle {
      x: number;
      y: number;
      ox: number; // original x
      oy: number; // original y
      vx: number;
      vy: number;
      size: number;
      color: string;
      angle?: number;
      speed?: number;
      orbitRadius?: number;
      phase?: number;
      amplitude?: number;
    }

    const particles: Particle[] = [];
    const dustParticles: Particle[] = [];

    const initDust = () => {
      dustParticles.length = 0;
      const count = isMobile ? 30 : 100;
      for (let i = 0; i < count; i++) {
        dustParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          ox: Math.random() * width,
          oy: Math.random() * height,
          vx: Math.random() * 0.1 - 0.05,
          vy: -Math.random() * 0.1 - 0.02, // slow upward drift
          size: Math.random() * 0.8 + 0.3,
          color: `rgba(212, 175, 55, ${Math.random() * 0.15 + 0.03})`,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.002 + 0.001,
        });
      }
    };

    const initParticles = () => {
      particles.length = 0;
      const chamber = activeChamberRef.current;

      if (chamber === 0) {
        // Aether OS: Rotating orbit rings (vector fields)
        const count = isMobile ? 40 : 120;
        const centerX = width / 2;
        const centerY = height / 2;
        for (let i = 0; i < count; i++) {
          const orbitRadius = Math.random() * (Math.min(width, height) * 0.35) + 50;
          const angle = Math.random() * Math.PI * 2;
          particles.push({
            x: centerX + Math.cos(angle) * orbitRadius,
            y: centerY + Math.sin(angle) * orbitRadius,
            ox: centerX,
            oy: centerY,
            vx: 0,
            vy: 0,
            size: Math.random() * 2 + 0.5,
            color: "rgba(212, 175, 55, 0.4)", // gold
            angle: angle,
            speed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
            orbitRadius: orbitRadius,
          });
        }
      } else if (chamber === 1) {
        // Lumen Network: Grid nodes with connection pulses
        const spacing = isMobile ? 120 : 60;
        for (let x = spacing; x < width; x += spacing) {
          for (let y = spacing; y < height; y += spacing) {
            if (Math.random() > 0.4) {
              particles.push({
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                ox: x,
                oy: y,
                vx: 0,
                vy: 0,
                size: Math.random() * 1.5 + 0.5,
                color: "rgba(255, 255, 255, 0.15)",
                phase: Math.random() * Math.PI * 2,
              });
            }
          }
        }
      } else if (chamber === 2) {
        // Solas Spatial: 3D Wave points
        const cols = isMobile ? 12 : 25;
        const rows = isMobile ? 8 : 15;
        const spacingVal = isMobile ? 50 : 35;
        const startX = (width - cols * spacingVal) / 2;
        const startY = (height - rows * spacingVal) / 2;
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            particles.push({
              x: startX + c * spacingVal,
              y: startY + r * spacingVal,
              ox: startX + c * spacingVal,
              oy: startY + r * spacingVal,
              vx: 0,
              vy: 0,
              size: 1.2,
              color: "rgba(212, 175, 55, 0.25)",
              phase: (c * 0.2 + r * 0.3),
            });
          }
        }
      } else if (chamber === 4) {
        // Todi Ethnic: Golden flowing fabric-like sine threads
        const count = isMobile ? 30 : 80;
        for (let i = 0; i < count; i++) {
          const isRed = Math.random() < 0.12;
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            ox: Math.random() * width,
            oy: Math.random() * height,
            vx: Math.random() * 0.15 - 0.075,
            vy: -(Math.random() * 0.3 + 0.1),
            size: Math.random() * 1.5 + 1,
            color: isRed
              ? `rgba(139, 26, 43, ${Math.random() * 0.15 + 0.1})`
              : `rgba(184, 138, 11, ${Math.random() * 0.2 + 0.15})`,
            amplitude: Math.random() * 40 + 20,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.002 + 0.001,
          });
        }
      } else if (currentChamber === 4) {
        // Render Todi Ethnic golden thread particles
        particles.forEach((p) => {
          p.y += p.vy;
          p.x += Math.sin((Date.now() * 0.001) * (p.speed || 1) + (p.phase || 0)) * (p.amplitude || 40);

          // Screen wrapping
          if (p.y < 0) { p.y = height; p.x = Math.random() * width; }
          if (p.y > height) { p.y = 0; p.x = Math.random() * width; }

          // Soft breathing pulse
          const pulse = Math.sin((Date.now() * 0.001) * 1.2 + (p.phase || 0)) * 0.05 + 0.12;
          const match = p.color.match(/rgba\((\d+), (\d+), (\d+), /);
          ctx.beginPath();
          ctx.fillStyle = match && parseInt(match[1]) === 139
            ? `rgba(139, 26, 43, ${pulse})`
            : `rgba(184, 138, 11, ${pulse})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Capabilities & Contact: Ambient drifting stars
        const count = isMobile ? 25 : 80;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            ox: Math.random() * width,
            oy: Math.random() * height,
            vx: Math.random() * 0.2 - 0.1,
            vy: Math.random() * 0.2 - 0.1,
            size: Math.random() * 1.5 + 0.5,
            color: "rgba(255, 255, 255, 0.1)",
          });
        }
      }
    };

    initDust();
    initParticles();

    // Track active chamber changes inside loop to trigger transition
    let currentChamber = activeChamberRef.current;

    // Animation Loop
    const animate = () => {
      const time = Date.now() * 0.001;
      // Smooth mouse coordinates interpolation
      if (mouse.targetX !== -1000) {
        if (mouse.x === -1000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // Check if chamber changed
      if (currentChamber !== activeChamberRef.current) {
        currentChamber = activeChamberRef.current;
        initParticles();
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Deep black foundation (#050505)
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // 2. Barely visible slow gold ambient glow in the center behind active project
      const breathingGlow = Math.sin(time * 0.4) * 0.008 + 0.022; // extremely subtle: 0.014 to 0.03
      const centerGlow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.min(width, height) * 0.65
      );
      centerGlow.addColorStop(0, `rgba(212, 175, 55, ${breathingGlow})`);
      centerGlow.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Faint drifting atmospheric clouds for layered depth
      const cloud1X = width / 2 + Math.cos(time * 0.08) * (width * 0.12);
      const cloud1Y = height / 2 + Math.sin(time * 0.12) * (height * 0.12);
      const cloudGrad1 = ctx.createRadialGradient(
        cloud1X, cloud1Y, 10,
        cloud1X, cloud1Y, Math.min(width, height) * 0.45
      );
      cloudGrad1.addColorStop(0, "rgba(212, 175, 55, 0.006)");
      cloudGrad1.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = cloudGrad1;
      ctx.fillRect(0, 0, width, height);

      // 4. Soft vignette around section edges
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, "rgba(5, 5, 5, 0)");
      vignette.addColorStop(1, "rgba(2, 2, 2, 0.96)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // 5. Render global floating dust particles (layered depth & texture)
      dustParticles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(time + (p.phase || 0)) * 0.05;

        // Screen wrapping
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Breathing/twinkling effect
        const opacity = (Math.sin(time * 1.5 + (p.phase || 0)) * 0.05 + 0.12) * 0.35;

        ctx.beginPath();
        ctx.fillStyle = `rgba(212, 175, 55, ${opacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw active chamber graphics
      if (currentChamber === 0) {
        // Render Aether OS Particle Orbits
        particles.forEach((p) => {
          if (p.angle !== undefined && p.speed !== undefined && p.orbitRadius !== undefined) {
            p.angle += p.speed;
            
            // Orbit calculation
            let targetX = p.ox + Math.cos(p.angle) * p.orbitRadius;
            let targetY = p.oy + Math.sin(p.angle) * p.orbitRadius * 0.5; // flatten for 3D perspective

            // Mouse displacement
            if (mouse.x !== -1000) {
              const dx = mouse.x - targetX;
              const dy = mouse.y - targetY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                targetX -= (dx / dist) * force * 30;
                targetY -= (dy / dist) * force * 15;
              }
            }

            p.x += (targetX - p.x) * 0.1;
            p.y += (targetY - p.y) * 0.1;

            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      } else if (currentChamber === 1) {
        // Render Lumen Network Nodes & Pulses
        ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
        ctx.lineWidth = 0.5;

        // Draw connections
        particles.forEach((p, idx) => {
          // Connect to nearby nodes
          for (let j = idx + 1; j < Math.min(idx + 10, particles.length); j++) {
            const other = particles[j];
            const dist = Math.sqrt(Math.pow(p.x - other.x, 2) + Math.pow(p.y - other.y, 2));
            if (dist < 80) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }

          // Node displacement
          let targetX = p.ox;
          let targetY = p.oy;

          if (mouse.x !== -1000) {
            const dx = mouse.x - p.ox;
            const dy = mouse.y - p.oy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              targetX -= (dx / dist) * force * 20;
              targetY -= (dy / dist) * force * 20;
            }
          }

          p.x += (targetX - p.x) * 0.1;
          p.y += (targetY - p.y) * 0.1;

          // Draw node
          ctx.beginPath();
          const pulse = Math.sin(time * 2 + (p.phase || 0)) * 0.05 + 0.1;
          ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (currentChamber === 2) {
        // Render Solas Spatial 3D Wave
        particles.forEach((p) => {
          const z = Math.sin(time * 1.5 + (p.phase || 0)) * 12;
          
          const targetX = p.ox;
          let targetY = p.oy + z;

          // Mouse influence
          if (mouse.x !== -1000) {
            const dx = mouse.x - p.ox;
            const dy = mouse.y - p.oy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              targetY += force * 25;
            }
          }

          p.x += (targetX - p.x) * 0.1;
          p.y += (targetY - p.y) * 0.1;

          ctx.beginPath();
          // Fade nodes based on height
          const alpha = 0.15 + (z + 12) / 24 * 0.2;
          ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.arc(p.x, p.y, p.size + (z > 0 ? z * 0.04 : 0), 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Render ambient stars
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          // Screen wrapping
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Gentle breathing
          const pulse = Math.sin(time + p.x * 0.01) * 0.03 + 0.08;

          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none block z-0"
    />
  );
}
