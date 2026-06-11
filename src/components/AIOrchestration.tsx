"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AIOrchestration() {
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
    
    // Perspective Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true, // Transparent clear color for background glow
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Physics-Based Node Simulation Setup
    // Node representation: basePosition (floating origin), currentPosition (actual), velocities, dimensions
    const nodeCount = 6; // 0: Core, 1-5: Agents
    const nodes: {
      id: number;
      name: string;
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      scale: number;
      scaleTarget: number;
      scaleV: number;
      mesh: THREE.Mesh;
      glowMesh?: THREE.Mesh;
    }[] = [];

    // Colors: Ivory/White
    const colorIvory = 0xeae5c9;

    // Create AI Core (Center Node)
    const coreGeom = new THREE.SphereGeometry(0.32, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    // AI Core Outer Pulsing Glow
    const glowGeom = new THREE.SphereGeometry(0.48, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: colorIvory,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowMat);
    scene.add(glowMesh);

    nodes.push({
      id: 0,
      name: "Core",
      baseX: 0,
      baseY: 0,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      scale: 1,
      scaleTarget: 1,
      scaleV: 0,
      mesh: coreMesh,
      glowMesh: glowMesh,
    });

    // Create 5 Agent Nodes arranged in a circle
    const agentNames = [
      "Research Agent",
      "Analysis Agent",
      "Automation Agent",
      "Memory Agent",
      "Execution Agent",
    ];
    const radius = 1.35;

    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 + Math.PI / 2;
      const bx = radius * Math.cos(angle);
      const by = radius * Math.sin(angle);

      const agentGeom = new THREE.SphereGeometry(0.065, 16, 16);
      const agentMat = new THREE.MeshBasicMaterial({
        color: colorIvory,
        transparent: true,
        opacity: 0.75,
      });
      const agentMesh = new THREE.Mesh(agentGeom, agentMat);
      agentMesh.position.set(bx, by, 0);
      scene.add(agentMesh);

      nodes.push({
        id: i + 1,
        name: agentNames[i],
        baseX: bx,
        baseY: by,
        x: bx,
        y: by,
        z: 0,
        vx: 0,
        vy: 0,
        scale: 1,
        scaleTarget: 1,
        scaleV: 0,
        mesh: agentMesh,
      });
    }

    // 3. Connections Setup (Curves that bend on mouse proximity)
    // Render lines from Core (0) to all Agents (1-5) and also between adjacent Agents in the ring
    const connectionPairs: [number, number][] = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], // Center to Agents
      [1, 2], [2, 3], [3, 4], [4, 5], [5, 1], // Ring edges
    ];

    const connections: {
      pair: [number, number];
      curve: THREE.QuadraticBezierCurve3;
      geom: THREE.BufferGeometry;
      line: THREE.Line;
      mat: THREE.LineBasicMaterial;
      pulseWeight: number;
    }[] = [];

    connectionPairs.forEach((pair) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      );

      // Create BufferGeometry initialized with 17 vertices (16 segments)
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(17 * 3);
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.LineBasicMaterial({
        color: colorIvory,
        transparent: true,
        opacity: 0.12,
      });

      const line = new THREE.Line(geom, mat);
      scene.add(line);

      connections.push({
        pair,
        curve,
        geom,
        line,
        mat,
        pulseWeight: 0,
      });
    });

    // 4. Data Packets (Traveling glowing points along paths)
    const packetGeom = new THREE.SphereGeometry(0.02, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });

    interface Packet {
      mesh: THREE.Mesh;
      connectionIndex: number;
      reverse: boolean; // direction: true if travelling from endNode to startNode
      progress: number;
      speed: number;
    }
    const packets: Packet[] = [];

    // Helper to spawn a packet along a specific connection path
    const spawnPacket = (startNode: number, endNode: number, speed = 0.012) => {
      // Find connection index matching startNode and endNode
      const index = connections.findIndex(
        (c) =>
          (c.pair[0] === startNode && c.pair[1] === endNode) ||
          (c.pair[0] === endNode && c.pair[1] === startNode)
      );
      if (index === -1) return;

      const connection = connections[index];
      const reverse = connection.pair[0] !== startNode;

      const pMesh = new THREE.Mesh(packetGeom, packetMat);
      scene.add(pMesh);

      packets.push({
        mesh: pMesh,
        connectionIndex: index,
        reverse,
        progress: 0,
        speed,
      });

      // Momentarily flare connection line opacity
      connection.pulseWeight = 1.0;
    };

    // 5. Background Dust Particles (Atmospheric depth)
    const particleCount = 35;
    const particlesGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: { x: number; y: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 4;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2 - 0.8;
      
      particleSpeeds.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
      });
    }

    particlesGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particlesMat = new THREE.PointsMaterial({
      color: colorIvory,
      size: 0.016,
      transparent: true,
      opacity: 0.2,
    });
    const particleSystem = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particleSystem);

    // 6. Interaction Setup (Projecting mouse coordinates to 3D plane)
    const mouse2D = new THREE.Vector2(0, 0);
    const mouse3D = new THREE.Vector3(0, 0, 0);
    let isHovered = false;

    // visible height at z=0 for perspective camera with fov=45 at z=4.5
    const H_visible = 2 * 4.5 * Math.tan((45 * Math.PI) / 360);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouse2D.set(x, y);
      
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

    // 7. Workflow Scheduler
    // Cycle through agent orchestration tasks dynamically
    let workflowTimer = 0;
    let currentStep = 0;
    let activeWorkflow = 0;

    const runOrchestratorLogic = (delta: number) => {
      workflowTimer += delta;

      // Every 3.5 seconds, start a new workflow loop if idle
      if (packets.length === 0 && workflowTimer > 3.0) {
        workflowTimer = 0;
        activeWorkflow = Math.floor(Math.random() * 3); // Pick a workflow (0, 1, 2)
        currentStep = 0;
        
        // Trigger first step
        if (activeWorkflow === 0) {
          // Ingest Research (Core -> Research)
          spawnPacket(0, 1);
        } else if (activeWorkflow === 1) {
          // Analyze and Store (Core -> Research -> Analysis -> Memory)
          spawnPacket(0, 1);
        } else {
          // Automation loop (Core -> Memory -> Automation -> Execution -> Core)
          spawnPacket(0, 4);
        }
      }
    };

    const handlePacketArrival = (p: Packet) => {
      const connection = connections[p.connectionIndex];
      const startNodeIdx = connection.pair[0];
      const endNodeIdx = connection.pair[1];
      const arrivedNodeIdx = p.reverse ? startNodeIdx : endNodeIdx;

      // Pulse the arrived node scale target
      const node = nodes[arrivedNodeIdx];
      node.scaleTarget = 1.6;

      // Advance Workflow steps
      if (activeWorkflow === 0) {
        if (arrivedNodeIdx === 1) {
          // Research completed, send back to Core
          setTimeout(() => spawnPacket(1, 0, 0.015), 200);
        }
      } else if (activeWorkflow === 1) {
        if (arrivedNodeIdx === 1) {
          // Research -> Analysis
          setTimeout(() => spawnPacket(1, 2, 0.015), 200);
        } else if (arrivedNodeIdx === 2) {
          // Analysis -> Memory
          setTimeout(() => spawnPacket(2, 4, 0.015), 200);
        }
      } else if (activeWorkflow === 2) {
        if (arrivedNodeIdx === 4) {
          // Memory -> Automation
          setTimeout(() => spawnPacket(4, 3, 0.015), 200);
        } else if (arrivedNodeIdx === 3) {
          // Automation -> Execution
          setTimeout(() => spawnPacket(3, 5, 0.015), 200);
        } else if (arrivedNodeIdx === 5) {
          // Execution -> Core
          setTimeout(() => spawnPacket(5, 0, 0.015), 200);
        }
      }
    };

    // 8. Render & Physics Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    // Spring Constants for organic motion
    const springStiffness = 0.08;
    const springDamping = 0.74;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Run orchestrator state machine
      runOrchestratorLogic(delta);

      // Node Physics & Floating
      nodes.forEach((n) => {
        // Floating drift offset
        let fx = 0;
        let fy = 0;
        if (n.id === 0) {
          // Core slow float
          fx = Math.sin(elapsed * 0.7) * 0.03;
          fy = Math.cos(elapsed * 0.5) * 0.03;
        } else {
          // Agent node small hover
          fx = Math.sin(elapsed * 1.2 + n.id) * 0.04;
          fy = Math.cos(elapsed * 0.9 + n.id) * 0.04;
        }

        // Pull towards mouse based on cursor proximity (attraction radius: 1.2 units)
        let targetX = n.baseX + fx;
        let targetY = n.baseY + fy;

        if (isHovered) {
          const baseVec = new THREE.Vector3(n.baseX, n.baseY, 0);
          const distToMouse = mouse3D.distanceTo(baseVec);
          if (distToMouse < 1.4) {
            const pull = (1.4 - distToMouse) * 0.35;
            const dir = new THREE.Vector3().subVectors(mouse3D, baseVec).normalize();
            targetX += dir.x * pull;
            targetY += dir.y * pull;
          }
        }

        // Update Position using Spring Damping Physics
        const ax = (targetX - n.x) * springStiffness;
        n.vx += ax;
        n.vx *= springDamping;
        n.x += n.vx;

        const ay = (targetY - n.y) * springStiffness;
        n.vy += ay;
        n.vy *= springDamping;
        n.y += n.vy;

        // Apply positions
        n.mesh.position.set(n.x, n.y, 0);
        if (n.glowMesh) {
          n.glowMesh.position.set(n.x, n.y, 0);
          // Pulse the outer glow
          const coreGlowScale = 1.0 + 0.08 * Math.sin(elapsed * 2.8);
          n.glowMesh.scale.set(coreGlowScale, coreGlowScale, coreGlowScale);
        }

        // Update Scale target interpolation using Spring Damping
        const scaleForce = (n.scaleTarget - n.scale) * 0.12;
        n.scaleV += scaleForce;
        n.scaleV *= 0.78;
        n.scale += n.scaleV;

        n.mesh.scale.set(n.scale, n.scale, n.scale);

        // Gradually decay target scale back to 1.0
        n.scaleTarget += (1.0 - n.scaleTarget) * 0.08;
      });

      // Update Connection Paths and Bend Lines on Cursor Proximity
      connections.forEach((c) => {
        const nodeA = nodes[c.pair[0]];
        const nodeB = nodes[c.pair[1]];

        const posA = new THREE.Vector3(nodeA.x, nodeA.y, 0);
        const posB = new THREE.Vector3(nodeB.x, nodeB.y, 0);

        // Calculate midpoint
        const mid = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);

        // Bending vector calculation
        let controlPoint = mid.clone();
        if (isHovered) {
          const distToMouse = mouse3D.distanceTo(mid);
          if (distToMouse < 1.2) {
            const bendStrength = (1.2 - distToMouse) * 0.38;
            const dir = new THREE.Vector3().subVectors(mouse3D, mid).normalize();
            controlPoint.addScaledVector(dir, bendStrength);
          }
        }

        c.curve.v0.copy(posA);
        c.curve.v1.copy(controlPoint);
        c.curve.v2.copy(posB);

        // Update geometry vertices from curve
        const points = c.curve.getPoints(16); // 17 points total
        const posAttr = c.geom.attributes.position;
        const array = posAttr.array as Float32Array;

        for (let i = 0; i < points.length; i++) {
          array[i * 3] = points[i].x;
          array[i * 3 + 1] = points[i].y;
          array[i * 3 + 2] = points[i].z;
        }
        posAttr.needsUpdate = true;

        // Animate line opacity and pulse weights decay
        c.pulseWeight += (0.0 - c.pulseWeight) * 0.05;
        c.mat.opacity = 0.09 + c.pulseWeight * 0.38;
      });

      // Update Data Packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1.0) {
          // Packet arrived
          handlePacketArrival(p);
          
          // Delete packet mesh and remove from list
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          packets.splice(i, 1);
        } else {
          // Calculate curve coordinate matching current progress
          const connection = connections[p.connectionIndex];
          const tVal = p.reverse ? 1.0 - p.progress : p.progress;
          const pos = connection.curve.getPointAt(tVal);
          p.mesh.position.copy(pos);
        }
      }

      // Float background particles
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Move particles
        positions[i * 3] += particleSpeeds[i].x;
        positions[i * 3 + 1] += particleSpeeds[i].y;

        // Wrap boundaries
        if (Math.abs(positions[i * 3]) > 2.2) {
          positions[i * 3] = -positions[i * 3];
        }
        if (Math.abs(positions[i * 3 + 1]) > 2.2) {
          positions[i * 3 + 1] = -positions[i * 3 + 1];
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Update Floating Labels
      const time = elapsed;
      activeLabels.forEach((al) => {
        const node = nodes[al.nodeIdx];
        if (!node) return;

        const tempV = new THREE.Vector3();
        if (node.mesh) {
          node.mesh.getWorldPosition(tempV);
        } else {
          tempV.set(node.baseX, node.baseY, 0);
        }

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
          al.nodeIdx = Math.floor(Math.random() * nodes.length);
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
          if (node.mesh) node.mesh.getWorldPosition(nodePos);
          else nodePos.set(node.baseX, node.baseY, 0);

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
      "Reasoning Core",
      "Memory Layer",
      "Planning Agent",
      "Execution Node",
      "Knowledge Mesh",
      "Agent Link",
      "Cognitive Route",
      "Inference Path",
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
        const nodeIdx = Math.floor(Math.random() * nodes.length);
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

    // 9. Resize Handler
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
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose of resources
      renderer.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      glowGeom.dispose();
      glowMat.dispose();
      packetGeom.dispose();
      packetMat.dispose();
      particlesGeom.dispose();
      particlesMat.dispose();

      nodes.forEach((n) => {
        n.mesh.geometry.dispose();
        (n.mesh.material as THREE.Material).dispose();
      });

      connections.forEach((c) => {
        c.geom.dispose();
        c.mat.dispose();
      });

      packets.forEach((p) => {
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
      {/* Volumetric glowing background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,229,201,0.055)_0%,transparent_75%)] pointer-events-none" />
      
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
