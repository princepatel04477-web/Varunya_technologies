"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AIToolFactory() {
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

    // 2. Conveyor Belt Setup (Horizontal track and moving guide dots)
    const trackWidth = 4.4;
    const dotCount = 18;
    const conveyorDots: THREE.Mesh[] = [];
    const dotGeom = new THREE.SphereGeometry(0.008, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({
      color: colorIvory,
      transparent: true,
      opacity: 0.15,
    });

    for (let i = 0; i < dotCount; i++) {
      const dot = new THREE.Mesh(dotGeom, dotMat);
      scene.add(dot);
      conveyorDots.push(dot);
    }

    // 3. Processing Stations Setup
    // Three scanning rings situated along the horizontal axis
    const stationPositions = [-1.1, 0.0, 1.1];
    const stations: {
      x: number;
      ring: THREE.Mesh;
      scale: number;
      scaleTarget: number;
      scaleV: number;
      rotSpeed: number;
      rotTarget: number;
      rotV: number;
      pulseMat: THREE.MeshBasicMaterial;
    }[] = [];

    stationPositions.forEach((xPos) => {
      // Station outer scan ring
      const ringGeom = new THREE.TorusGeometry(0.25, 0.008, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorIvory,
        transparent: true,
        opacity: 0.2,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(xPos, 0, 0);
      ring.rotation.y = Math.PI / 2; // Face along the conveyor path
      scene.add(ring);

      stations.push({
        x: xPos,
        ring,
        scale: 1,
        scaleTarget: 1,
        scaleV: 0,
        rotSpeed: 0.8,
        rotTarget: 0.8,
        rotV: 0,
        pulseMat: ringMat,
      });
    });

    // 4. Conveyor Modules Setup (Products being assembled)
    // We maintain 3 active modules spaced out
    interface ConveyorModule {
      progress: number;
      group: THREE.Group;
      // Morph states geometries
      state1: THREE.Mesh; // Low poly wireframe Sphere (Idea)
      state2: THREE.Mesh; // Wireframe Box (Processing)
      state3: THREE.Mesh; // Octahedron + Ring (Product)
      currentState: number; // 1, 2, 3
      yOffset: number;
      vy: number;
    }
    const modules: ConveyorModule[] = [];

    // Geometries for morphing
    const geomSphere = new THREE.IcosahedronGeometry(0.065, 1);
    const geomBox = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const geomOct = new THREE.OctahedronGeometry(0.08, 0);
    const geomProductRing = new THREE.TorusGeometry(0.12, 0.005, 4, 24);

    const matWireframe = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });

    const matSolid = new THREE.MeshBasicMaterial({
      color: colorIvory,
      transparent: true,
      opacity: 0.8,
    });

    const createModuleGroup = (): {
      group: THREE.Group;
      state1: THREE.Mesh;
      state2: THREE.Mesh;
      state3: THREE.Mesh;
    } => {
      const group = new THREE.Group();

      // State 1: Idea (Wireframe Sphere)
      const state1 = new THREE.Mesh(geomSphere, matWireframe);
      group.add(state1);

      // State 2: Processing (Wireframe Box)
      const state2 = new THREE.Mesh(geomBox, matWireframe);
      state2.visible = false;
      group.add(state2);

      // State 3: Product (Solid Octahedron with rotating ring)
      const state3 = new THREE.Group() as any;
      const core = new THREE.Mesh(geomOct, matSolid);
      const outerRing = new THREE.Mesh(geomProductRing, matWireframe);
      outerRing.name = "productRing";
      state3.add(core);
      state3.add(outerRing);
      state3.visible = false;
      group.add(state3);

      scene.add(group);

      return { group, state1, state2, state3 };
    };

    // Instantiate 3 modules spaced out along progress [0.0, 0.33, 0.66]
    for (let i = 0; i < 3; i++) {
      const { group, state1, state2, state3 } = createModuleGroup();
      modules.push({
        progress: i * 0.33,
        group,
        state1,
        state2,
        state3,
        currentState: 1,
        yOffset: 0,
        vy: 0,
      });
    }

    // 5. Puff Particle System Setup
    // Emitted when a module transitions at a station
    const maxParticles = 40;
    const particleGeom = new THREE.SphereGeometry(0.012, 4, 4);
    const particleMat = new THREE.MeshBasicMaterial({
      color: colorIvory,
      transparent: true,
      opacity: 0.8,
    });

    interface PuffParticle {
      mesh: THREE.Mesh;
      vx: number;
      vy: number;
      vz: number;
      life: number;
    }
    const puffParticles: PuffParticle[] = [];

    const emitPuff = (x: number, y: number, z: number) => {
      const count = 6;
      for (let i = 0; i < count; i++) {
        if (puffParticles.length >= maxParticles) {
          const old = puffParticles.shift();
          if (old) {
            scene.remove(old.mesh);
            old.mesh.geometry.dispose();
          }
        }

        const mesh = new THREE.Mesh(particleGeom, particleMat);
        mesh.position.set(
          x + (Math.random() - 0.5) * 0.05,
          y + (Math.random() - 0.5) * 0.05,
          z + (Math.random() - 0.5) * 0.05
        );
        scene.add(mesh);

        puffParticles.push({
          mesh,
          vx: (Math.random() - 0.5) * 0.02,
          vy: Math.random() * 0.016 + 0.005, // Float upwards
          vz: (Math.random() - 0.5) * 0.02,
          life: 1.0, // starts full life
        });
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
      
      // Map to WebGL space coordinates
      const aspect = rect.width / rect.height;
      const m2x = x * 2 - 1;
      const m2y = -(y * 2 - 1);
      mouse3D.set(m2x * (H_visible * aspect) / 2, m2y * H_visible / 2, 0);
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchstart", handleMouseEnter, { passive: true });
    container.addEventListener("touchend", handleMouseLeave, { passive: true });

    // 7. Render & Physics Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const speed = 0.16; // Conveyor speed constant

    const springStiffness = 0.08;
    const springDamping = 0.76;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Update Conveyor Guide Dots
      conveyorDots.forEach((dot, index) => {
        const dotProgress = ((index / dotCount) + elapsed * 0.08) % 1.0;
        const xPos = -trackWidth / 2 + dotProgress * trackWidth;
        dot.position.set(xPos, -0.05, 0);
      });

      // Update Processing Stations (Scale & Rotation Springs)
      stations.forEach((station) => {
        // Spring simulation for scale
        const forceScale = (station.scaleTarget - station.scale) * springStiffness;
        station.scaleV += forceScale;
        station.scaleV *= springDamping;
        station.scale += station.scaleV;
        station.ring.scale.set(station.scale, station.scale, station.scale);

        // Spring simulation for rotation speed
        const forceRot = (station.rotTarget - station.rotSpeed) * springStiffness;
        station.rotV += forceRot;
        station.rotV *= springDamping;
        station.rotSpeed += station.rotV;

        // Apply rotation
        station.ring.rotation.z += station.rotSpeed * delta;

        // Decay targets back to normal
        station.scaleTarget += (1.0 - station.scaleTarget) * 0.08;
        station.rotTarget += (0.8 - station.rotTarget) * 0.05;

        // Flare scan line opacity decay
        const opacityDecay = (0.2 - station.pulseMat.opacity) * 0.06;
        station.pulseMat.opacity += opacityDecay;
      });

      // Update Conveyor Modules
      modules.forEach((m) => {
        // Increment progress (wrap around at 1.0)
        m.progress += speed * delta;
        
        let justSpawned = false;
        if (m.progress >= 1.0) {
          m.progress = 0;
          m.currentState = 1;
          justSpawned = true;
        }

        // Map progress to X position (-2.2 to 2.2)
        const xPos = -trackWidth / 2 + m.progress * trackWidth;

        // Trigger Station Scanning check
        // Station 1: x = -1.1 (Idea ➔ Processing transition)
        if (m.currentState === 1 && xPos >= -1.1) {
          m.currentState = 2;
          m.state1.visible = false;
          m.state2.visible = true;

          // Flare Station 1
          stations[0].scaleTarget = 1.35;
          stations[0].rotTarget = 6.0;
          stations[0].pulseMat.opacity = 0.75;
          emitPuff(xPos, 0, 0);
        }

        // Station 2: x = 0.0 (Processing ➔ Product transition)
        if (m.currentState === 2 && xPos >= 0.0) {
          m.currentState = 3;
          m.state2.visible = false;
          m.state3.visible = true;

          // Flare Station 2
          stations[1].scaleTarget = 1.35;
          stations[1].rotTarget = 6.0;
          stations[1].pulseMat.opacity = 0.75;
          emitPuff(xPos, 0, 0);
        }

        // Station 3: x = 1.1 (Product final scan flare)
        if (m.currentState === 3 && xPos >= 1.1 && xPos < 1.15) {
          // Double flare to mark completed inspection
          if (stations[2].scaleTarget === 1.0) {
            stations[2].scaleTarget = 1.35;
            stations[2].rotTarget = 6.0;
            stations[2].pulseMat.opacity = 0.75;
            emitPuff(xPos, 0, 0);
          }
        }

        // Reset visible state on wrap
        if (justSpawned) {
          m.state1.visible = true;
          m.state2.visible = false;
          m.state3.visible = false;
        }

        // Rotate individual module geometries
        m.state1.rotation.x += 0.4 * delta;
        m.state1.rotation.y += 0.6 * delta;

        m.state2.rotation.x -= 0.5 * delta;
        m.state2.rotation.y += 0.3 * delta;

        if (m.currentState === 3) {
          const core = m.state3.children[0];
          const ring = m.state3.children[1];
          core.rotation.y += 0.8 * delta;
          core.rotation.x += 0.4 * delta;
          ring.rotation.x += 1.5 * delta;
        }

        // Proximity y-drift: pull module upwards if mouse is near
        let targetY = 0;
        if (isHovered) {
          const distToMouse = Math.abs(xPos - mouse3D.x);
          if (distToMouse < 0.6) {
            const pull = (0.6 - distToMouse) * 0.45;
            // Float higher if cursor is vertically above
            targetY = Math.sign(mouse3D.y) * pull;
          }
        }

        // Spring update for Y position
        const forceY = (targetY - m.yOffset) * springStiffness;
        m.vy += forceY;
        m.vy *= springDamping;
        m.yOffset += m.vy;

        // Set group position
        m.group.position.set(xPos, m.yOffset, 0);

        // Fade out slightly when approaching boundaries
        let opacity = 0.75;
        if (m.progress < 0.1) {
          opacity = (m.progress / 0.1) * 0.75;
        } else if (m.progress > 0.9) {
          opacity = ((1.0 - m.progress) / 0.1) * 0.75;
        }

        // Set materials opacity
        matWireframe.opacity = opacity;
        matSolid.opacity = opacity + 0.05;
      });

      // Update Floating Labels
      const time = elapsed;
      activeLabels.forEach((al) => {
        let targetObj: THREE.Object3D | null = null;
        let attachType: "module" | "station" = "module";
        const nodeIndex = al.nodeIdx;

        if (nodeIndex < modules.length) {
          targetObj = modules[nodeIndex].group;
          attachType = "module";
        } else {
          const sIdx = nodeIndex - modules.length;
          if (sIdx < stations.length) {
            targetObj = stations[sIdx].ring;
            attachType = "station";
          }
        }

        if (!targetObj) return;

        const tempV = new THREE.Vector3();
        targetObj.getWorldPosition(tempV);

        tempV.project(camera);
        const x = (tempV.x * 0.5 + 0.5) * width;
        const y = (-tempV.y * 0.5 + 0.5) * height;

        al.life -= delta;

        if (attachType === "module") {
          const m = modules[nodeIndex];
          if (m.progress < 0.05 || m.progress > 0.95) {
            al.life = -1;
          }
        }

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
          al.nodeIdx = Math.floor(Math.random() * (modules.length + stations.length));
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
          if (dist < 0.65) {
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
      "Idea",
      "Prototype",
      "Validation",
      "Automation",
      "API Layer",
      "Launch",
      "Distribution",
      "User Signal",
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
        const nodeIdx = Math.floor(Math.random() * (modules.length + stations.length));
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

      // Dispose of static resources
      renderer.dispose();
      dotGeom.dispose();
      dotMat.dispose();
      geomSphere.dispose();
      geomBox.dispose();
      geomOct.dispose();
      geomProductRing.dispose();
      matWireframe.dispose();
      matSolid.dispose();
      particleGeom.dispose();
      particleMat.dispose();

      stations.forEach((s) => {
        s.ring.geometry.dispose();
        (s.ring.material as THREE.Material).dispose();
      });

      modules.forEach((m) => {
        scene.remove(m.group);
      });

      puffParticles.forEach((p) => {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
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
