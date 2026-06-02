"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 180,
    };

    // Listen to mouse movement
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

    // Grid points
    interface Point {
      x: number;
      y: number;
      ox: number; // original x
      oy: number; // original y
      vx: number; // velocity x
      vy: number; // velocity y
      size: number;
    }

    const points: Point[] = [];
    const spacing = 45; // grid spacing

    const initGrid = () => {
      points.length = 0;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      for (let x = 0; x < width + spacing; x += spacing) {
        for (let y = 0; y < height + spacing; y += spacing) {
          points.push({
            x: x,
            y: y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 0.5,
          });
        }
      }
    };

    initGrid();

    // Handle resize
    const handleResize = () => {
      initGrid();
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinates interpolation
      if (mouse.targetX !== -1000) {
        if (mouse.x === -1000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.1;
          mouse.y += (mouse.targetY - mouse.y) * 0.1;
        }
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // Draw subtle background vignette
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, "#08080a");
      gradient.addColorStop(1, "#020203");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 0.5;

      // Draw interactive flow points
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      
      const len = points.length;
      for (let i = 0; i < len; i++) {
        const p = points[i];

        // Apply noise and mouse distortion
        let dx = 0;
        let dy = 0;
        let dist = 0;

        if (mouse.x !== -1000) {
          dx = mouse.x - p.ox;
          dy = mouse.y - p.oy;
          dist = Math.sqrt(dx * dx + dy * dy);
        }

        let targetX = p.ox;
        let targetY = p.oy;

        if (dist > 0 && dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Warp grid points away from mouse
          targetX = p.ox - (dx / dist) * force * 15;
          targetY = p.oy - (dy / dist) * force * 15;
        }

        // Return force to original position
        p.vx += (targetX - p.x) * 0.08;
        p.vy += (targetY - p.y) * 0.08;

        // Apply friction
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        // Draw particle dot
        ctx.beginPath();
        // Dot opacity depends on mouse distance to feel alive
        let alpha = 0.04;
        if (dist > 0 && dist < mouse.radius) {
          alpha = 0.04 + (1 - dist / mouse.radius) * 0.18;
        }
        
        // Add a gentle global wave
        const wave = Math.sin(p.ox * 0.005 + Date.now() * 0.001) * Math.cos(p.oy * 0.005 + Date.now() * 0.001);
        alpha += wave * 0.02;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.01, alpha)})`;
        ctx.arc(p.x, p.y, p.size + (dist > 0 && dist < mouse.radius ? (1 - dist / mouse.radius) * 0.5 : 0), 0, Math.PI * 2);
        ctx.fill();
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none block z-0" />;
}
