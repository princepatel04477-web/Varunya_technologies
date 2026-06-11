"use client";

import { useEffect, useRef } from "react";

export default function HeroFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with target-based lerp (smooth inertia)
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Flow line configuration
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const lineCount = isMobile ? 8 : 28;
    const segmentsPerLine = isMobile ? 45 : 120;
    
    // Animate loop variables
    let time = 0;

    const animate = () => {
      // 1. Slow time increment for fluid motion
      time += 0.002;

      // 2. Clear canvas with very dark slate-grey/black background matching the theme
      ctx.fillStyle = "#050507";
      ctx.fillRect(0, 0, width, height);

      // 3. Smoothly interpolate mouse coordinates (inertia)
      if (mouse.active && !isMobile) {
        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;
      } else {
        // When mouse leaves or is inactive, drift towards the center
        const centerX = width / 2;
        const centerY = height / 2;
        mouse.x += (centerX - mouse.x) * 0.02;
        mouse.y += (centerY - mouse.y) * 0.02;
      }

      // 4. Calculate camera drift + mouse parallax
      const driftX = Math.sin(time * 2) * 15;
      const driftY = Math.cos(time * 1.5) * 15;
      const parallaxX = !isMobile ? (mouse.x - width / 2) * 0.05 : 0;
      const parallaxY = !isMobile ? (mouse.y - height / 2) * 0.05 : 0;
      const cameraX = driftX + parallaxX;
      const cameraY = driftY + parallaxY;

      // 5. Draw flow lines
      for (let j = 0; j < lineCount; j++) {
        // Determine line color: 20% of lines are subtle gold, 80% are subtle white/grey
        const isGold = j % 6 === 0;
        const color = isGold 
          ? "rgba(212, 175, 55, 0.06)" 
          : "rgba(255, 255, 255, 0.045)";
        
        ctx.beginPath();
        ctx.lineWidth = isGold ? 0.75 : 0.5;

        // Base Y position for this line
        const baseY = (j / (lineCount - 1)) * (height + 200) - 100;

        for (let i = 0; i <= segmentsPerLine; i++) {
          // X-coordinate across the screen
          const x = (i / segmentsPerLine) * (width + 100) - 50;

          // Wave equation using multiple frequencies for organic complexity
          const wave1 = Math.sin(x * 0.0012 + time * 1.8 + j * 0.45) * 75;
          const wave2 = Math.cos(x * 0.0032 - time * 2.2 + j * 0.8) * 35;
          const wave3 = Math.sin(x * 0.0065 + time * 3.5 + j * 1.2) * 12;
          
          let y = baseY + wave1 + wave2 + wave3;

          // Mouse reactive warping (lines bend around the cursor)
          if (!isMobile) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 250;

            if (dist < repelRadius) {
              // Quadratic falloff for smooth force dissipation
              const force = Math.pow((repelRadius - dist) / repelRadius, 2.5);
              // Push away from mouse
              const angle = Math.atan2(dy, dx);
              y += Math.sin(angle) * force * 70;
            }
          }

          // Apply camera offset
          const drawX = x + cameraX;
          const drawY = y + cameraY;

          if (i === 0) {
            ctx.moveTo(drawX, drawY);
          } else {
            ctx.lineTo(drawX, drawY);
          }
        }

        // Calculate highlight factor based on vertical distance to mouse Y
        const distY = Math.abs(baseY - mouse.y);
        const repelRadius = 250;
        const highlightFactor = (mouse.active && !isMobile) ? Math.max(0, 1 - distY / repelRadius) : 0;

        // Interpolate colors towards a luxury glowing red when near the cursor
        let r, g, b, a;
        if (isGold) {
          r = 212 + (255 - 212) * highlightFactor;
          g = 175 + (45 - 175) * highlightFactor;
          b = 55 + (45 - 55) * highlightFactor;
          a = 0.06 + (0.35 - 0.06) * highlightFactor;
        } else {
          r = 255;
          g = 255 + (45 - 255) * highlightFactor;
          b = 255 + (45 - 255) * highlightFactor;
          a = 0.045 + (0.30 - 0.045) * highlightFactor;
        }

        // Draw the line with a dynamic gradient centered at mouse X position
        const lineGrad = ctx.createLinearGradient(0, 0, width, 0);
        const mid = (mouse.active && !isMobile) ? Math.max(0.1, Math.min(0.9, mouse.x / width)) : 0.5;
        const glowSpan = 0.12;

        lineGrad.addColorStop(0, "rgba(0,0,0,0)");
        lineGrad.addColorStop(Math.max(0.01, mid - glowSpan * 2), color);
        lineGrad.addColorStop(mid, `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${a})`);
        lineGrad.addColorStop(Math.min(0.99, mid + glowSpan * 2), color);
        lineGrad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.strokeStyle = lineGrad;
        ctx.stroke();
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
      className="absolute inset-0 w-full h-full pointer-events-none block z-0"
    />
  );
}
