"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ConversionFunnel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsContainerRef = useRef<HTMLDivElement>(null);

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
    const colorTeal = 0x3da58a; // Premium emerald/teal accent color

    // 2. Wireframe Funnel Geometry
    // Draw horizontal rings representing stages:
    // y = 0.4 (Acquisition), y = 0.15 (Awareness), y = -0.1 (Interest), y = -0.35 (Consideration), y = -0.6 (Conversion)
    const funnelStages = [
      { y: 0.5, r: 0.55, opacity: 0.1 },
      { y: 0.2, r: 0.42, opacity: 0.15 },
      { y: -0.1, r: 0.3, opacity: 0.2 },
      { y: -0.4, r: 0.18, opacity: 0.25 },
      { y: -0.65, r: 0.08, opacity: 0.35 },
    ];

    const funnelGroup = new THREE.Group();
    scene.add(funnelGroup);

    const funnelRings: THREE.Mesh[] = [];
    // Create horizontal rings
    funnelStages.forEach((stage) => {
      const ringGeom = new THREE.TorusGeometry(stage.r, 0.005, 8, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorIvory,
        transparent: true,
        opacity: stage.opacity,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(0, stage.y, 0);
      ring.rotation.x = Math.PI / 2;
      funnelGroup.add(ring);
      funnelRings.push(ring);
    });

    // Create vertical connecting generator lines
    const lineMat = new THREE.LineBasicMaterial({
      color: colorIvory,
      transparent: true,
      opacity: 0.1,
    });

    const verticalSegments = 8;
    for (let i = 0; i < verticalSegments; i++) {
      const angle = (i * 2 * Math.PI) / verticalSegments;
      const points: THREE.Vector3[] = [];
      
      funnelStages.forEach((stage) => {
        points.push(
          new THREE.Vector3(
            stage.r * Math.cos(angle),
            stage.y,
            stage.r * Math.sin(angle)
          )
        );
      });

      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeom, lineMat);
      funnelGroup.add(line);
    }

    // 3. Traffic Sources Setup (X-coordinates at the top)
    const sources = [
      { name: "Search", x: -1.2, y: 1.0 },
      { name: "Social", x: -0.4, y: 1.0 },
      { name: "Paid Ads", x: 0.4, y: 1.0 },
      { name: "Direct", x: 1.2, y: 1.0 },
    ];

    // Render tiny source indicators (minimal glowing points)
    const sourceGeom = new THREE.SphereGeometry(0.018, 8, 8);
    const sourceMat = new THREE.MeshBasicMaterial({
      color: colorIvory,
      transparent: true,
      opacity: 0.3,
    });

    const sourceMeshes: THREE.Mesh[] = [];
    sources.forEach((src) => {
      const mesh = new THREE.Mesh(sourceGeom, sourceMat);
      mesh.position.set(src.x, src.y, 0);
      scene.add(mesh);
      sourceMeshes.push(mesh);
    });

    // 4. Converted Premium Nodes Pool
    // Float slowly at the bottom and fade out
    interface ConvertedNode {
      mesh: THREE.Mesh;
      scale: number;
      opacity: number;
      vx: number;
      vy: number;
      life: number;
    }
    const convertedNodes: ConvertedNode[] = [];
    
    const nodeGeom = new THREE.SphereGeometry(0.024, 16, 16);
    const nodeMatTemplate = new THREE.MeshBasicMaterial({
      color: colorTeal,
      transparent: true,
      opacity: 0.9,
    });

    const spawnConvertedNode = (x: number, y: number) => {
      const mat = nodeMatTemplate.clone();
      const mesh = new THREE.Mesh(nodeGeom, mat);
      mesh.position.set(x, y, 0);
      scene.add(mesh);

      convertedNodes.push({
        mesh,
        scale: 0.1,
        opacity: 0.9,
        vx: (Math.random() - 0.5) * 0.005,
        vy: -0.004 - Math.random() * 0.004, // Float downwards slowly
        life: 1.0,
      });

      // Maintain a maximum of 25 nodes to ensure top performance
      if (convertedNodes.length > 25) {
        const old = convertedNodes.shift();
        if (old) {
          scene.remove(old.mesh);
          (old.mesh.material as THREE.Material).dispose();
        }
      }
    };

    // 5. High-Performance Particle Engine Setup
    // Renders thousands of tiny particles flowing down the funnel
    const maxParticles = 650;
    const particlesPositions = new Float32Array(maxParticles * 3);
    const particlesColors = new Float32Array(maxParticles * 3);

    // Particle state tracking
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      targetY: number; // Drop-off Y height
      state: number; // 0: Flowing, 1: Dropping off, 2: Inactive/Spawnable
      opacity: number;
      sourceIndex: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: 0, y: 0, z: 0,
        vx: 0, vy: 0, vz: 0,
        targetY: 0,
        state: 2, // Inactive initially
        opacity: 0,
        sourceIndex: 0,
      });
    }

    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(particlesPositions, 3)
    );
    particlesGeom.setAttribute(
      "color",
      new THREE.BufferAttribute(particlesColors, 3)
    );

    // Particles Material (using vertex colors)
    const particlesMat = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const particleSystem = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particleSystem);

    const spawnParticle = () => {
      const inactiveIdx = particles.findIndex((p) => p.state === 2);
      if (inactiveIdx === -1) return;

      const p = particles[inactiveIdx];
      const srcIdx = Math.floor(Math.random() * sources.length);
      const src = sources[srcIdx];

      p.x = src.x + (Math.random() - 0.5) * 0.08;
      p.y = src.y + (Math.random() - 0.5) * 0.05;
      p.z = (Math.random() - 0.5) * 0.08;
      
      p.vx = 0;
      p.vy = -0.22 - Math.random() * 0.12; // downward speed
      p.vz = 0;
      
      p.opacity = 0.65;
      p.state = 0; // Active/Flowing
      p.sourceIndex = srcIdx;

      // Determine drop-off threshold height based on funnel ratios:
      // ~35% drop in Awareness (y > 0.15)
      // ~30% drop in Interest (y: 0.15 to -0.1)
      // ~20% drop in Consideration (y: -0.1 to -0.4)
      // ~15% reach Conversion (y <= -0.6)
      const roll = Math.random();
      if (roll < 0.35) {
        p.targetY = 0.15 + Math.random() * 0.3; // Awareness leakage
      } else if (roll < 0.65) {
        p.targetY = -0.1 + Math.random() * 0.25; // Interest leakage
      } else if (roll < 0.85) {
        p.targetY = -0.4 + Math.random() * 0.3; // Consideration leakage
      } else {
        p.targetY = -0.62; // Conversion target!
      }
    };

    // 6. Interaction Setup (Cursor tracking)
    const mouse3D = new THREE.Vector3(0, 0, 0);
    let isHovered = false;

    // frustum visible height at z=0 for perspective camera with fov=45 at z=4.2
    const H_visible = 2 * 4.2 * Math.tan((45 * Math.PI) / 360);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      const aspect = rect.width / rect.height;
      mouse3D.set(x * (H_visible * aspect) / 2, y * H_visible / 2, 0);
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
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
      mouse3D.set(m2x * (H_visible * aspect) / 2, m2y * H_visible / 2, 0);
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchstart", handleMouseEnter, { passive: true });
    container.addEventListener("touchend", handleMouseLeave, { passive: true });

    // 7. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Spawn 3-5 new particles per frame
      const spawnCount = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < spawnCount; i++) {
        spawnParticle();
      }

      // Update Funnel mesh rotation & tilt from mouse parallax
      const targetRotY = mouse3D.x * 0.12;
      const targetRotX = -mouse3D.y * 0.08;
      funnelGroup.rotation.y += (targetRotY - funnelGroup.rotation.y) * 0.08;
      funnelGroup.rotation.x += (targetRotX - funnelGroup.rotation.x) * 0.08;

      // Update active converted nodes
      for (let i = convertedNodes.length - 1; i >= 0; i--) {
        const node = convertedNodes[i];
        node.life -= 0.35 * delta;

        if (node.life <= 0) {
          scene.remove(node.mesh);
          (node.mesh.material as THREE.Material).dispose();
          convertedNodes.splice(i, 1);
        } else {
          // Slowly sink and fade
          node.mesh.position.x += node.vx;
          node.mesh.position.y += node.vy;
          
          node.opacity = node.life * 0.8;
          (node.mesh.material as THREE.MeshBasicMaterial).opacity = node.opacity;

          // Bouncing spring scale entrance
          if (node.scale < 1.0) {
            node.scale += (1.0 - node.scale) * 0.12;
            node.mesh.scale.set(node.scale, node.scale, node.scale);
          }
        }
      }

      // Update Particles
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      const colors = particleSystem.geometry.attributes.color.array as Float32Array;

      // Color representations (Ivory highlight vs Teal converted)
      const rI = 234 / 255, gI = 229 / 255, bI = 201 / 255;
      const rT = 61 / 255, gT = 165 / 255, bT = 138 / 255;

      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];

        if (p.state === 2) {
          // Inactive particles stay hidden at origin
          positions[i * 3] = 0;
          positions[i * 3 + 1] = 0;
          positions[i * 3 + 2] = 0;
          
          colors[i * 3] = 0;
          colors[i * 3 + 1] = 0;
          colors[i * 3 + 2] = 0;
          continue;
        }

        // Particle dynamics
        if (p.state === 0) {
          // State 0: Flowing down the funnel
          // Target position based on current height y:
          // Convergence to neck (y = 0.5) from source coordinate
          let targetX = 0;
          let currentFunnelRadius = 0.55;

          if (p.y > 0.5) {
            // Converging to acquisition neck
            const t = (p.y - 0.5) / 0.5; // 1 to 0
            const src = sources[p.sourceIndex];
            targetX = THREE.MathUtils.lerp(0, src.x, t);
          } else {
            // Inside the funnel stages
            // Radius scales down as height decreases
            // y goes from 0.5 down to -0.65
            const t = (p.y - (-0.65)) / (0.5 - (-0.65)); // 0 to 1
            currentFunnelRadius = THREE.MathUtils.lerp(0.08, 0.55, t);
            
            // Constrain / push particles towards center
            targetX = 0;
          }

          // Move coordinates
          p.x += (targetX - p.x) * 0.08;
          p.y += p.vy * delta;

          // Limit sideways boundary to funnel shell (with swirl rotation)
          const angle = elapsed * 1.8 + i;
          p.z = currentFunnelRadius * 0.3 * Math.sin(angle);
          p.x += (currentFunnelRadius * 0.15 * Math.cos(angle) - p.x) * 0.05;

          // Proximity mouse push (hover pushes particles slightly)
          if (isHovered) {
            const dist = Math.abs(p.y - mouse3D.y);
            if (dist < 0.2) {
              p.x += (mouse3D.x - p.x) * 0.05;
            }
          }

          // Check if reached drop-off target height
          if (p.y <= p.targetY) {
            if (p.targetY <= -0.6) {
              // Convert!
              spawnConvertedNode(p.x, p.y);
              p.state = 2; // Recycle immediately
            } else {
              // Drop-off/Leak out horizontally
              p.state = 1;
              p.vx = Math.sign(p.x) * (0.12 + Math.random() * 0.08); // fly outwards
              p.vy = -0.06 - Math.random() * 0.08;
            }
          }

          // Color: Ivory
          colors[i * 3] = rI;
          colors[i * 3 + 1] = gI;
          colors[i * 3 + 2] = bI;

        } else if (p.state === 1) {
          // State 1: Dropping off (Leaking out and fading away)
          p.x += p.vx * delta * 5;
          p.y += p.vy * delta * 5;
          p.opacity -= 1.8 * delta;

          if (p.opacity <= 0) {
            p.state = 2; // Recycle
          }

          // Color shifts to a dimmer, fading ivory
          colors[i * 3] = rI * p.opacity;
          colors[i * 3 + 1] = gI * p.opacity;
          colors[i * 3 + 2] = bI * p.opacity;
        }

        // Apply updated coordinates to system positions
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.geometry.attributes.color.needsUpdate = true;

      // Update Floating Labels
      const time = elapsed;
      activeLabels.forEach((al) => {
        let targetObj: THREE.Object3D | null = null;
        if (al.nodeIdx < sourceMeshes.length) {
          targetObj = sourceMeshes[al.nodeIdx];
        } else {
          const rIdx = al.nodeIdx - sourceMeshes.length;
          if (rIdx < funnelRings.length) {
            targetObj = funnelRings[rIdx];
          }
        }

        if (!targetObj) return;

        const tempV = new THREE.Vector3();
        targetObj.getWorldPosition(tempV);

        tempV.project(camera);
        const x = (tempV.x * 0.5 + 0.5) * width;
        const y = (-tempV.y * 0.5 + 0.5) * height;

        al.life -= delta;
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
          al.nodeIdx = Math.floor(Math.random() * (sourceMeshes.length + funnelRings.length));
          const activeTextIdxs = activeLabels.map((l) => l.textIdx);
          let newTextIdx = Math.floor(Math.random() * labelCandidates.length);
          for (let attempt = 0; attempt < 5; attempt++) {
            if (!activeTextIdxs.includes(newTextIdx)) break;
            newTextIdx = Math.floor(Math.random() * labelCandidates.length);
          }
          al.textIdx = newTextIdx;
          al.elem.querySelector("span")!.innerText = labelCandidates[newTextIdx];
          al.maxLife = 4.0 + Math.random() * 4.0;
          al.life = al.maxLife;
          al.state = "fadeIn";
          al.driftX = (Math.random() - 0.5) * 8;
          al.driftY = (Math.random() - 0.5) * 8;
          al.phase = Math.random() * Math.PI * 2;
        }

        const driftDist = 5.0;
        const currDriftX = al.driftX + Math.sin(time * 0.8 + al.phase) * driftDist;
        const currDriftY = al.driftY + Math.cos(time * 0.6 + al.phase) * driftDist;

        al.elem.style.left = `${x + currDriftX}px`;
        al.elem.style.top = `${y + currDriftY - 20}px`;

        let finalOpacity = al.opacity;
        if (isHovered) {
          const nodePos = new THREE.Vector3();
          targetObj.getWorldPosition(nodePos);

          const dist = mouse3D.distanceTo(nodePos);
          if (dist < 0.6) {
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

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize labels
    const labelCandidates = [
      "Traffic",
      "Search",
      "Paid Media",
      "Content",
      "Conversion",
      "Retention",
      "Revenue",
      "Attribution",
      "Audience",
      "Growth",
    ];

    const activeLabels: {
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
    }[] = [];

    if (labelsContainerRef.current) {
      const children = labelsContainerRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const elem = children[i] as HTMLDivElement;
        const nodeIdx = Math.floor(Math.random() * (sourceMeshes.length + funnelRings.length));
        const textIdx = Math.floor(Math.random() * labelCandidates.length);
        const maxLife = 4.0 + Math.random() * 4.0;

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

    animate();

    // 8. Resize Handler
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
      sourceGeom.dispose();
      sourceMat.dispose();
      nodeGeom.dispose();
      nodeMatTemplate.dispose();
      particlesGeom.dispose();
      particlesMat.dispose();

      convertedNodes.forEach((node) => {
        scene.remove(node.mesh);
        (node.mesh.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#050507] overflow-hidden"
    >
      {/* Volumetric background radial grid glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,229,201,0.065)_0%,transparent_75%)] pointer-events-none" />

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

      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
    </div>
  );
}
