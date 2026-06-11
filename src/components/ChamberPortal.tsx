"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ChamberPortalProps {
  isHovered?: boolean;
}

export default function ChamberPortal({ isHovered = false }: ChamberPortalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync the hover prop using a ref to access it inside the animation loop safely
  const isHoveredRef = useRef(isHovered);
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const colorIvory = 0xeae5c9;

    // Create a shared group for portal elements to apply parallax transformations
    const portalGroup = new THREE.Group();
    scene.add(portalGroup);

    // 2. Concentric Depth Rings
    const ringCount = 5;
    const rings: { mesh: THREE.Mesh; baseZ: number; speedFactor: number }[] = [];

    const ringGeometry = new THREE.TorusGeometry(0.55, 0.003, 8, 48);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: colorIvory,
      transparent: true,
      opacity: 0.18,
    });

    for (let i = 0; i < ringCount; i++) {
      const mesh = new THREE.Mesh(ringGeometry, ringMaterial);
      
      // Position rings deeper along the Z-axis
      const baseZ = -i * 0.18;
      mesh.position.z = baseZ;

      // Scale each ring slightly outward to create a funnel/tunnel perspective
      const ringScale = 1.0 + i * 0.16;
      mesh.scale.set(ringScale, ringScale, 1.0);

      portalGroup.add(mesh);
      rings.push({
        mesh,
        baseZ,
        speedFactor: 0.3 + (ringCount - i) * 0.15,
      });
    }

    // 3. Volumetric Glow Disk (Far end of tunnel)
    // Draw a radial gradient onto an HTML canvas and load it as a texture
    const canvasGlow = document.createElement("canvas");
    canvasGlow.width = 64;
    canvasGlow.height = 64;
    const ctxGlow = canvasGlow.getContext("2d");
    if (ctxGlow) {
      const grad = ctxGlow.createRadialGradient(32, 32, 2, 32, 32, 30);
      grad.addColorStop(0, "rgba(234, 229, 201, 0.85)");
      grad.addColorStop(0.35, "rgba(234, 229, 201, 0.22)");
      grad.addColorStop(1, "rgba(5, 5, 7, 0)");
      ctxGlow.fillStyle = grad;
      ctxGlow.fillRect(0, 0, 64, 64);
    }
    const glowTexture = new THREE.CanvasTexture(canvasGlow);

    const glowGeom = new THREE.PlaneGeometry(1.6, 1.6);
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowMat);
    glowMesh.position.z = -0.92;
    portalGroup.add(glowMesh);

    // 4. Drifting Particles into Portal
    const particleCount = 180;
    interface PortalParticle {
      mesh: THREE.Mesh;
      radius: number;
      angle: number;
      z: number;
      speed: number;
      originalRadius: number;
    }

    const pGeom = new THREE.SphereGeometry(0.008, 4, 4);
    const pMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    });

    const particles: PortalParticle[] = [];

    const initParticle = (pMesh: THREE.Mesh, randomZ = false) => {
      const angle = Math.random() * Math.PI * 2;
      const originalRadius = 0.4 + Math.random() * 0.95;
      const z = randomZ ? (Math.random() * 1.6 - 0.8) : 0.8; // Spawn at front of camera
      const speed = 0.006 + Math.random() * 0.008;

      pMesh.position.set(Math.cos(angle) * originalRadius, Math.sin(angle) * originalRadius, z);
      return {
        mesh: pMesh,
        radius: originalRadius,
        angle,
        z,
        speed,
        originalRadius,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      const pMesh = new THREE.Mesh(pGeom, pMat);
      portalGroup.add(pMesh);
      particles.push(initParticle(pMesh, true)); // distribute initially
    }

    // 5. Interaction Setup
    const mouse3D = new THREE.Vector3(0, 0, 0);
    let isMouseActive = false;

    const H_visible = 2 * 4.2 * Math.tan((45 * Math.PI) / 360);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const aspect = rect.width / rect.height;
      mouse3D.set(x * (H_visible * aspect) / 2, y * H_visible / 2, 0.1);
      isMouseActive = true;
    };

    const handleMouseEnter = () => {
      isMouseActive = true;
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
      mouse3D.set(0, 0, 0);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Support mobile touch events
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = 1.0 - (touch.clientY - rect.top) / rect.height;

      const aspect = rect.width / rect.height;
      const m2x = x * 2 - 1;
      const m2y = -(y * 2 - 1);
      mouse3D.set(m2x * (H_visible * aspect) / 2, m2y * H_visible / 2, 0.1);
      isMouseActive = true;
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchstart", handleMouseEnter, { passive: true });
    container.addEventListener("touchend", handleMouseLeave, { passive: true });

    // 6. Animation Frame Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    let ctaSpeedWeight = 1.0;
    let ctaDepthWeight = 1.0;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const active = isHoveredRef.current;

      // Smooth interpolation of CTA speed and depth modifiers
      const targetSpeedFactor = active ? 2.8 : 1.0;
      const targetDepthFactor = active ? 1.6 : 1.0;

      ctaSpeedWeight += (targetSpeedFactor - ctaSpeedWeight) * 0.1;
      ctaDepthWeight += (targetDepthFactor - ctaDepthWeight) * 0.1;

      // Concentric rings rotation and depth shifts
      rings.forEach((r, idx) => {
        // Rotate rings around Z at speeds relative to indices
        const direction = idx % 2 === 0 ? 1 : -1;
        r.mesh.rotation.z += direction * r.speedFactor * delta * ctaSpeedWeight * 0.35;
        
        // Add a slight wobble/tilt
        r.mesh.rotation.y = Math.sin(elapsed * 0.4 + idx) * 0.05;

        // Depth intensifies on CTA hover (expansion of Z offsets)
        r.mesh.position.z = r.baseZ * ctaDepthWeight;
      });

      // Far glow disk breathing pulse
      const breathe = 0.28 + Math.sin(elapsed * 2.2) * 0.08;
      glowMat.opacity = breathe * (active ? 1.35 : 1.0);
      const glowScale = 1.6 + Math.sin(elapsed * 2.2) * 0.04;
      glowMesh.scale.set(glowScale, glowScale, 1.0);
      glowMesh.position.z = -0.92 * ctaDepthWeight;

      // Drifting particles integration
      particles.forEach((p) => {
        // Move particle towards the center-back along the Z-axis
        const currSpeed = p.speed * ctaSpeedWeight * 1.25;
        p.z -= currSpeed;

        // Shrink orbit radius as it approaches the core center
        const t = (p.z - (-0.9)) / (0.8 - (-0.9)); // normalized progress along tunnel (1 at front, 0 at core)
        const clampedT = Math.max(0, Math.min(1, t));
        p.radius = p.originalRadius * clampedT;

        // Update angle for circular drift spiral
        p.angle += 0.45 * delta * ctaSpeedWeight;

        // Calculate basic destination position
        const targetX = Math.cos(p.angle) * p.radius;
        const targetY = Math.sin(p.angle) * p.radius;

        // Mouse gravity pull (sucks nearby particles towards cursor)
        const pPos = new THREE.Vector3(targetX, targetY, p.z);
        if (isMouseActive) {
          const distToCursor = mouse3D.distanceTo(pPos);
          if (distToCursor < 0.95) {
            const pullForce = (0.95 - distToCursor) * 0.28;
            const pullDir = new THREE.Vector3().subVectors(mouse3D, pPos).normalize();
            pPos.addScaledVector(pullDir, pullForce);
          }
        }

        p.mesh.position.copy(pPos);

        // Fade out particle as it enters the volumetric core
        p.mesh.scale.setScalar(clampedT);

        // Respawn particle if it travels behind the core center
        if (p.z <= -0.9) {
          const fresh = initParticle(p.mesh, false);
          p.radius = fresh.radius;
          p.angle = fresh.angle;
          p.z = fresh.z;
          p.speed = fresh.speed;
          p.originalRadius = fresh.originalRadius;
        }
      });

      // Parallax Scene Tilt (reactions with depth)
      const targetRotY = mouse3D.x * 0.16;
      const targetRotX = -mouse3D.y * 0.16;
      portalGroup.rotation.y += (targetRotY - portalGroup.rotation.y) * 0.08;
      portalGroup.rotation.x += (targetRotX - portalGroup.rotation.x) * 0.08;

      // Slow drift
      portalGroup.position.x = Math.sin(elapsed * 0.3) * 0.035;
      portalGroup.position.y = Math.cos(elapsed * 0.4) * 0.035;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchstart", handleMouseEnter);
      container.removeEventListener("touchend", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      glowTexture.dispose();
      glowGeom.dispose();
      glowMat.dispose();
      pGeom.dispose();
      pMat.dispose();

      particles.forEach((p) => {
        portalGroup.remove(p.mesh);
      });
      rings.forEach((r) => {
        portalGroup.remove(r.mesh);
      });
      portalGroup.remove(glowMesh);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#050507] overflow-hidden"
    >
      {/* Volumetric background radial grid glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,229,201,0.06)_0%,transparent_75%)] pointer-events-none" />
      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
    </div>
  );
}
