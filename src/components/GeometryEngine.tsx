"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GeometryEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Perspective Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true, // Allow background radial gradient glow to show through
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Geometry Setup (Sphere as base mesh)
    // 48x48 resolution gives us a dense but highly performant wireframe
    const geometry = new THREE.SphereGeometry(1.2, 48, 48);

    // Keep a cache of the initial vertex positions to calculate spherical coordinates
    const positionAttribute = geometry.attributes.position;
    const vertexCount = positionAttribute.count;
    const sphericalCoords: { theta: number; phi: number }[] = [];

    for (let i = 0; i < vertexCount; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      // Normalize position to unit sphere
      const len = Math.sqrt(x * x + y * y + z * z);
      const ux = x / (len || 1);
      const uy = y / (len || 1);
      const uz = z / (len || 1);

      const phi = Math.atan2(uy, ux);
      const theta = Math.acos(Math.max(-1, Math.min(1, uz)));

      sphericalCoords.push({ theta, phi });
    }

    // 3. Material Setup
    // Thin ivory wireframe, transparent and elegant
    const material = new THREE.MeshBasicMaterial({
      color: 0xeae5c9,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      depthWrite: false, // Cleaner lines intersection
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. Mouse Tracking & Damped Inertia variables
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      targetMouseX = x;
      targetMouseY = y;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // 5. Render & Morph Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth Mouse Inertia interpolation (damping: 0.08)
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Extremely slow rotation on all axes, influenced by mouse
      const baseRotationX = elapsed * 0.03;
      const baseRotationY = elapsed * 0.05;
      const baseRotationZ = elapsed * 0.015;

      mesh.rotation.x = baseRotationX + mouseY * 0.35;
      mesh.rotation.y = baseRotationY + mouseX * 0.35;
      mesh.rotation.z = baseRotationZ;

      // Volumetric breathing pulse
      const breathingScale = 1.0 + 0.03 * Math.sin(elapsed * 0.7);
      mesh.scale.set(breathingScale, breathingScale, breathingScale);

      // Morph Weights calculation (8-12 seconds cycle, let's use 9 seconds)
      const cycleDuration = 9;
      const phase = (elapsed / cycleDuration) % 3;
      let w0 = 0; // Sphere weight
      let w1 = 0; // Torus weight
      let w2 = 0; // Blob weight

      if (phase < 1) {
        // Sphere to Torus
        const tTrans = phase;
        const s = Math.sin(tTrans * Math.PI / 2);
        w0 = 1 - s * s;
        w1 = s * s;
        w2 = 0;
      } else if (phase < 2) {
        // Torus to Blob
        const tTrans = phase - 1;
        const s = Math.sin(tTrans * Math.PI / 2);
        w0 = 0;
        w1 = 1 - s * s;
        w2 = s * s;
      } else {
        // Blob to Sphere
        const tTrans = phase - 2;
        const s = Math.sin(tTrans * Math.PI / 2);
        w0 = s * s;
        w1 = 0;
        w2 = 1 - s * s;
      }

      // Torus parameters
      const rMajor = 0.85;
      const rMinor = 0.32;

      // Update positions attribute
      const pos = geometry.attributes.position;
      for (let i = 0; i < vertexCount; i++) {
        const { theta, phi } = sphericalCoords[i];

        // 1. Sphere position
        const xSph = 1.2 * Math.sin(theta) * Math.cos(phi);
        const ySph = 1.2 * Math.sin(theta) * Math.sin(phi);
        const zSph = 1.2 * Math.cos(theta);

        // 2. Torus position
        // Map theta [0, PI] to tube angle u [0, 2*PI]
        const u = 2 * theta;
        const v = phi;
        const xTor = (rMajor + rMinor * Math.cos(u)) * Math.cos(v);
        const yTor = (rMajor + rMinor * Math.cos(u)) * Math.sin(v);
        const zTor = rMinor * Math.sin(u);

        // 3. Blob position (organic displacement)
        const displacement = 0.28 * Math.cos(3 * theta + elapsed * 0.8) * Math.sin(3 * phi - elapsed * 0.6) +
                             0.1 * Math.sin(7 * theta - elapsed * 1.2) * Math.cos(5 * phi + elapsed * 1.0);
        const rBlob = 1.1 + displacement;
        const xBlob = rBlob * Math.sin(theta) * Math.cos(phi);
        const yBlob = rBlob * Math.sin(theta) * Math.sin(phi);
        const zBlob = rBlob * Math.cos(theta);

        // Interpolated vertex
        const xTarget = w0 * xSph + w1 * xTor + w2 * xBlob;
        const yTarget = w0 * ySph + w1 * yTor + w2 * zBlob; // Wait, zBlob or yBlob? Let's use yBlob to avoid glitching!
        const zTarget = w0 * zSph + w1 * zTor + w2 * zBlob;

        // In the previous line, I accidentally put zBlob on the y-coordinate. Let's fix that:
        // xTarget = w0 * xSph + w1 * xTor + w2 * xBlob
        // yTarget = w0 * ySph + w1 * yTor + w2 * yBlob
        // zTarget = w0 * zSph + w1 * zTor + w2 * zBlob
        
        pos.setXYZ(
          i,
          w0 * xSph + w1 * xTor + w2 * xBlob,
          w0 * ySph + w1 * yTor + w2 * yBlob,
          w0 * zSph + w1 * zTor + w2 * zBlob
        );
      }

      pos.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Resize handler
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
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#050507] overflow-hidden"
    >
      {/* Volumetric ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,229,201,0.065)_0%,transparent_70%)] pointer-events-none" />
      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
    </div>
  );
}