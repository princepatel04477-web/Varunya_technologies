"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SoftwareArchitecture() {
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
    camera.position.z = 4.4;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const colorIvory = 0xeae5c9;

    // 2. Blueprint Node Architecture
    // Define the custom software component layers, locations, and geometric designs
    interface BlueprintNode {
      id: number;
      name: string;
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      scale: number;
      scaleTarget: number;
      scaleV: number;
      group: THREE.Group;
      mats: THREE.MeshBasicMaterial[];
      dependencies: number[]; // Connected node IDs
    }

    const nodes: BlueprintNode[] = [];

    // Helper to create wireframe materials
    const createWireframeMat = (opacity = 0.25): THREE.MeshBasicMaterial => {
      return new THREE.MeshBasicMaterial({
        color: colorIvory,
        wireframe: true,
        transparent: true,
        opacity: opacity,
      });
    };

    // Node 0: Core Application Layer (Center) -> Box inside Sphere
    const coreGroup = new THREE.Group();
    const coreGeom1 = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const coreGeom2 = new THREE.SphereGeometry(0.2, 16, 16);
    const coreMat1 = createWireframeMat(0.85);
    const coreMat2 = createWireframeMat(0.35);
    coreGroup.add(new THREE.Mesh(coreGeom1, coreMat1));
    coreGroup.add(new THREE.Mesh(coreGeom2, coreMat2));
    scene.add(coreGroup);
    
    nodes.push({
      id: 0,
      name: "Core App",
      x: 0, y: -0.05, z: 0,
      baseX: 0, baseY: -0.05,
      vx: 0, vy: 0,
      scale: 1, scaleTarget: 1, scaleV: 0,
      group: coreGroup,
      mats: [coreMat1, coreMat2],
      dependencies: [1, 3, 5, 6],
    });

    // Node 1: API Gateway (Left Gateway) -> Cylinder
    const apiGroup = new THREE.Group();
    const apiGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 5, 1, true);
    const apiMat = createWireframeMat(0.5);
    const apiMesh = new THREE.Mesh(apiGeom, apiMat);
    apiMesh.rotation.x = Math.PI / 2;
    apiGroup.add(apiMesh);
    scene.add(apiGroup);

    nodes.push({
      id: 1,
      name: "API Gateway",
      x: -1.3, y: 0.0, z: 0,
      baseX: -1.3, baseY: 0.0,
      vx: 0, vy: 0,
      scale: 1, scaleTarget: 1, scaleV: 0,
      group: apiGroup,
      mats: [apiMat],
      dependencies: [0, 2],
    });

    // Node 2: Auth Service (Top Left) -> Tetrahedron
    const authGroup = new THREE.Group();
    const authGeom = new THREE.TetrahedronGeometry(0.13, 0);
    const authMat = createWireframeMat(0.5);
    authGroup.add(new THREE.Mesh(authGeom, authMat));
    scene.add(authGroup);

    nodes.push({
      id: 2,
      name: "Auth Service",
      x: -0.9, y: 0.8, z: 0,
      baseX: -0.9, baseY: 0.8,
      vx: 0, vy: 0,
      scale: 1, scaleTarget: 1, scaleV: 0,
      group: authGroup,
      mats: [authMat],
      dependencies: [1],
    });

    // Node 3: Primary Database (Bottom Right) -> Cylinder stack
    const dbGroup = new THREE.Group();
    const dbGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.22, 12, 2, true);
    const dbMat = createWireframeMat(0.5);
    const dbMesh = new THREE.Mesh(dbGeom, dbMat);
    dbGroup.add(dbMesh);
    scene.add(dbGroup);

    nodes.push({
      id: 3,
      name: "Primary DB",
      x: 0.8, y: -0.68, z: 0,
      baseX: 0.8, baseY: -0.68,
      vx: 0, vy: 0,
      scale: 1, scaleTarget: 1, scaleV: 0,
      group: dbGroup,
      mats: [dbMat],
      dependencies: [0, 4],
    });

    // Node 4: Replica Database (Far Bottom Right) -> Smaller Cylinder
    const dbRepGroup = new THREE.Group();
    const dbRepGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.16, 12, 1, true);
    const dbRepMat = createWireframeMat(0.4);
    const dbRepMesh = new THREE.Mesh(dbRepGeom, dbRepMat);
    dbRepGroup.add(dbRepMesh);
    scene.add(dbRepGroup);

    nodes.push({
      id: 4,
      name: "Replica DB",
      x: 1.4, y: -0.6, z: 0,
      baseX: 1.4, baseY: -0.6,
      vx: 0, vy: 0,
      scale: 1, scaleTarget: 1, scaleV: 0,
      group: dbRepGroup,
      mats: [dbRepMat],
      dependencies: [3],
    });

    // Node 5: Queue System (Bottom Center) -> Torus
    const qGroup = new THREE.Group();
    const qGeom = new THREE.TorusGeometry(0.12, 0.03, 8, 24);
    const qMat = createWireframeMat(0.5);
    const qMesh = new THREE.Mesh(qGeom, qMat);
    qMesh.rotation.x = Math.PI / 4;
    qGroup.add(qMesh);
    scene.add(qGroup);

    nodes.push({
      id: 5,
      name: "Queue System",
      x: 0.0, y: -0.85, z: 0,
      baseX: 0.0, baseY: -0.85,
      vx: 0, vy: 0,
      scale: 1, scaleTarget: 1, scaleV: 0,
      group: qGroup,
      mats: [qMat],
      dependencies: [0, 7],
    });

    // Node 6: Cloud Infrastructure / Storage (Top Center) -> Dodecahedron
    const cloudGroup = new THREE.Group();
    const cloudGeom = new THREE.DodecahedronGeometry(0.14, 0);
    const cloudMat = createWireframeMat(0.5);
    cloudGroup.add(new THREE.Mesh(cloudGeom, cloudMat));
    scene.add(cloudGroup);

    nodes.push({
      id: 6,
      name: "Cloud Storage",
      x: 0.2, y: 0.82, z: 0,
      baseX: 0.2, baseY: 0.82,
      vx: 0, vy: 0,
      scale: 1, scaleTarget: 1, scaleV: 0,
      group: cloudGroup,
      mats: [cloudMat],
      dependencies: [0],
    });

    // Node 7: External Integrations (Top Right) -> Octahedron
    const extGroup = new THREE.Group();
    const extGeom = new THREE.OctahedronGeometry(0.13, 0);
    const extMat = createWireframeMat(0.5);
    extGroup.add(new THREE.Mesh(extGeom, extMat));
    scene.add(extGroup);

    nodes.push({
      id: 7,
      name: "External API",
      x: 1.25, y: 0.58, z: 0,
      baseX: 1.25, baseY: 0.58,
      vx: 0, vy: 0,
      scale: 1, scaleTarget: 1, scaleV: 0,
      group: extGroup,
      mats: [extMat],
      dependencies: [5],
    });

    // 3. Routing Connections Setup
    // Pairs representing network routing blueprint connections
    const connectionPairs: [number, number][] = [
      [1, 2], // Gateway ➔ Auth
      [1, 0], // Gateway ➔ Core App
      [0, 3], // Core App ➔ Primary DB
      [3, 4], // Primary DB ➔ Replica DB (Replication sync)
      [0, 5], // Core App ➔ Queue
      [5, 7], // Queue ➔ External Integration
      [0, 6], // Core App ➔ Storage
    ];

    const connections: {
      pair: [number, number];
      curve: THREE.QuadraticBezierCurve3;
      geom: THREE.BufferGeometry;
      line: THREE.Line;
      mat: THREE.LineBasicMaterial;
      pulseWeight: number;
      targetPulseWeight: number;
    }[] = [];

    connectionPairs.forEach((pair) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      );

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
        targetPulseWeight: 0,
      });
    });

    // 4. Data Packets (Request/Response indicators)
    const packetGeom = new THREE.SphereGeometry(0.018, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });

    interface RequestPacket {
      mesh: THREE.Mesh;
      connectionIndex: number;
      reverse: boolean;
      progress: number;
      speed: number;
      onComplete?: () => void;
    }
    let packets: RequestPacket[] = [];

    const spawnPacket = (startNode: number, endNode: number, speed = 0.016, callback?: () => void) => {
      const idx = connections.findIndex(
        (c) =>
          (c.pair[0] === startNode && c.pair[1] === endNode) ||
          (c.pair[0] === endNode && c.pair[1] === startNode)
      );
      if (idx === -1) return;

      const connection = connections[idx];
      const reverse = connection.pair[0] !== startNode;

      const pMesh = new THREE.Mesh(packetGeom, packetMat);
      scene.add(pMesh);

      packets.push({
        mesh: pMesh,
        connectionIndex: idx,
        reverse,
        progress: 0,
        speed,
        onComplete: callback,
      });

      // Flare connection path
      connection.targetPulseWeight = 1.0;
    };

    // 5. Background Blueprint Grid Dots (Minimal atmosphere)
    const gridCount = 40;
    const gridGeom = new THREE.BufferGeometry();
    const gridPositions = new Float32Array(gridCount * 3);
    for (let i = 0; i < gridCount; i++) {
      gridPositions[i * 3] = (Math.random() - 0.5) * 5;
      gridPositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      gridPositions[i * 3 + 2] = -0.5; // Grid dots in background
    }
    gridGeom.setAttribute("position", new THREE.BufferAttribute(gridPositions, 3));
    const gridMat = new THREE.PointsMaterial({
      color: colorIvory,
      size: 0.008,
      transparent: true,
      opacity: 0.08,
    });
    const gridPoints = new THREE.Points(gridGeom, gridMat);
    scene.add(gridPoints);

    // 6. Interaction Tracking
    const mouse2D = new THREE.Vector2(0, 0);
    const mouse3D = new THREE.Vector3(0, 0, 0);
    let isHovered = false;
    let hoveredNodeId: number | null = null;

    // frustum visible height at z=0 for perspective camera with fov=45 at z=4.4
    const H_visible = 2 * 4.4 * Math.tan((45 * Math.PI) / 360);

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
      hoveredNodeId = null;
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

    // 7. Request Pipeline Simulation Scheduler
    // Simulates realistic request life-cycle flows continuously
    let requestTimer = 0;

    const runArchitectureSimulation = (delta: number) => {
      requestTimer += delta;

      if (packets.length === 0 && requestTimer > 2.2) {
        requestTimer = 0;
        
        // Randomly pick a request lifecycle workflow
        const cycle = Math.floor(Math.random() * 3);

        if (cycle === 0) {
          // Flow A: API request with auth check ➔ Core Ingest ➔ Database write
          // Gateway (1) ➔ Auth (2) ➔ Gateway (1) ➔ Core (0) ➔ Primary DB (3) ➔ Replica Sync (4)
          spawnPacket(1, 2, 0.024, () => {
            spawnPacket(2, 1, 0.024, () => {
              spawnPacket(1, 0, 0.02, () => {
                spawnPacket(0, 3, 0.022, () => {
                  spawnPacket(3, 4, 0.024);
                });
              });
            });
          });
        } else if (cycle === 1) {
          // Flow B: Ingestion triggering asynchronous queue job
          // Gateway (1) ➔ Core (0) ➔ Queue (5) ➔ External webhook (7)
          spawnPacket(1, 0, 0.02, () => {
            spawnPacket(0, 5, 0.018, () => {
              spawnPacket(5, 7, 0.02);
            });
          });
        } else {
          // Flow C: Static asset fetch / CDN cache check
          // Gateway (1) ➔ Core (0) ➔ Storage CDN (6) ➔ Gateway Response (1)
          spawnPacket(1, 0, 0.02, () => {
            spawnPacket(0, 6, 0.022, () => {
              spawnPacket(6, 0, 0.022, () => {
                spawnPacket(0, 1, 0.022);
              });
            });
          });
        }
      }
    };

    // 8. Render & Physics Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const springStiffness = 0.08;
    const springDamping = 0.74;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Run life-cycle simulator
      runArchitectureSimulation(delta);

      // Node Hover detection & raycasting
      let closestNodeId: number | null = null;
      let minDistance = 0.35; // Hover activation radius

      nodes.forEach((n) => {
        const baseVec = new THREE.Vector3(n.baseX, n.baseY, 0);
        const dist = mouse3D.distanceTo(baseVec);
        if (isHovered && dist < minDistance) {
          minDistance = dist;
          closestNodeId = n.id;
        }
      });
      hoveredNodeId = closestNodeId;

      // Update Node positions & rotations (Spring simulation + floats)
      nodes.forEach((n) => {
        let fx = 0;
        let fy = 0;

        // Slow calm background float
        if (n.id === 0) {
          fx = Math.sin(elapsed * 0.6) * 0.02;
          fy = Math.cos(elapsed * 0.4) * 0.02;
        } else {
          fx = Math.sin(elapsed * 1.0 + n.id) * 0.035;
          fy = Math.cos(elapsed * 0.8 + n.id) * 0.035;
        }

        let targetX = n.baseX + fx;
        let targetY = n.baseY + fy;

        // Interactive Pull (Node gets pulled slightly on hover)
        if (isHovered && hoveredNodeId === n.id) {
          const baseVec = new THREE.Vector3(n.baseX, n.baseY, 0);
          const pull = (0.35 - minDistance) * 0.45;
          const dir = new THREE.Vector3().subVectors(mouse3D, baseVec).normalize();
          targetX += dir.x * pull;
          targetY += dir.y * pull;
        }

        // Position Spring Integration
        const ax = (targetX - n.x) * springStiffness;
        n.vx += ax;
        n.vx *= springDamping;
        n.x += n.vx;

        const ay = (targetY - n.y) * springStiffness;
        n.vy += ay;
        n.vy *= springDamping;
        n.y += n.vy;

        n.group.position.set(n.x, n.y, 0);

        // Rotation
        if (n.id === 0) {
          n.group.children[0].rotation.y += 0.4 * delta;
          n.group.children[0].rotation.x += 0.2 * delta;
          n.group.children[1].rotation.z -= 0.15 * delta;
        } else {
          n.group.children[0].rotation.y += 0.5 * delta;
          n.group.children[0].rotation.z += 0.3 * delta;
        }

        // Node Scale updates based on hover state (Highlight focused node)
        if (isHovered && (hoveredNodeId === n.id || n.dependencies.includes(hoveredNodeId!))) {
          n.scaleTarget = hoveredNodeId === n.id ? 1.35 : 1.12;
        } else {
          n.scaleTarget = 1.0;
        }

        // Scale Spring Integration
        const forceScale = (n.scaleTarget - n.scale) * 0.12;
        n.scaleV += forceScale;
        n.scaleV *= 0.78;
        n.scale += n.scaleV;
        n.group.scale.set(n.scale, n.scale, n.scale);

        // Material Opacities (Core nodes light up when focused / dependent)
        const isTarget = isHovered && (hoveredNodeId === n.id || n.dependencies.includes(hoveredNodeId!));
        n.mats.forEach((m, idx) => {
          const baseOpacity = idx === 0 ? 0.48 : 0.22;
          const targetOpacity = isTarget ? (hoveredNodeId === n.id ? 0.95 : 0.65) : baseOpacity;
          m.opacity += (targetOpacity - m.opacity) * 0.08;
        });
      });

      // Update Connection Paths (Bends on hover and highlights paths)
      connections.forEach((c) => {
        const nodeA = nodes[c.pair[0]];
        const nodeB = nodes[c.pair[1]];

        const posA = new THREE.Vector3(nodeA.x, nodeA.y, 0);
        const posB = new THREE.Vector3(nodeB.x, nodeB.y, 0);

        // Calculate midpoint
        const mid = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);

        // Connection line bends towards cursor if hovered close by
        let controlPoint = mid.clone();
        if (isHovered) {
          // Bend connection if the mouse is near the path's midpoint
          const distToMouse = mouse3D.distanceTo(mid);
          if (distToMouse < 1.1) {
            const bend = (1.1 - distToMouse) * 0.35;
            const dir = new THREE.Vector3().subVectors(mouse3D, mid).normalize();
            controlPoint.addScaledVector(dir, bend);
          }
        }

        c.curve.v0.copy(posA);
        c.curve.v1.copy(controlPoint);
        c.curve.v2.copy(posB);

        // Update line vertices
        const points = c.curve.getPoints(16);
        const posAttr = c.geom.attributes.position;
        const array = posAttr.array as Float32Array;

        for (let i = 0; i < points.length; i++) {
          array[i * 3] = points[i].x;
          array[i * 3 + 1] = points[i].y;
          array[i * 3 + 2] = points[i].z;
        }
        posAttr.needsUpdate = true;

        // Path illumination (Highlights paths connected to hovered nodes)
        const isPathConnected = isHovered && (c.pair[0] === hoveredNodeId || c.pair[1] === hoveredNodeId);
        const activeTarget = isPathConnected ? 0.62 : 0.0;

        c.targetPulseWeight += (activeTarget - c.targetPulseWeight) * 0.08;
        c.pulseWeight += (c.targetPulseWeight - c.pulseWeight) * 0.05;

        // Set connection line opacity
        c.mat.opacity = 0.09 + c.pulseWeight * 0.45;
      });

      // Update Active Data Packets along paths
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1.0) {
          // Trigger next route callback if exists
          if (p.onComplete) p.onComplete();

          // Pulse target node scale target on arrive
          const connection = connections[p.connectionIndex];
          const destNodeId = p.reverse ? connection.pair[0] : connection.pair[1];
          nodes[destNodeId].scaleTarget = 1.3;

          // Remove packet from scene & list
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          packets.splice(i, 1);
        } else {
          const connection = connections[p.connectionIndex];
          const tVal = p.reverse ? 1.0 - p.progress : p.progress;
          const pos = connection.curve.getPointAt(tVal);
          p.mesh.position.copy(pos);
        }
      }

      // Parallax scene drift for structural depth reacting to mouse movements
      const targetRotY = mouse3D.x * 0.08;
      const targetRotX = -mouse3D.y * 0.08;
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.08;
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.08;

      // Update Floating Labels
      const time = elapsed;
      activeLabels.forEach((al) => {
        const node = nodes[al.nodeIdx];
        if (!node) return;

        const tempV = new THREE.Vector3();
        if (node.group) {
          node.group.getWorldPosition(tempV);
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
          if (node.group) node.group.getWorldPosition(nodePos);
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
      "API",
      "Database",
      "Gateway",
      "Core Logic",
      "Integration",
      "Service Layer",
      "Event Stream",
      "Infrastructure",
      "Module",
      "Interface",
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
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchstart", handleMouseEnter);
      container.removeEventListener("touchend", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      packetGeom.dispose();
      packetMat.dispose();
      gridGeom.dispose();
      gridMat.dispose();

      coreGeom1.dispose();
      coreGeom2.dispose();
      coreMat1.dispose();
      coreMat2.dispose();
      apiGeom.dispose();
      apiMat.dispose();
      authGeom.dispose();
      authMat.dispose();
      dbGeom.dispose();
      dbMat.dispose();
      dbRepGeom.dispose();
      dbRepMat.dispose();
      qGeom.dispose();
      qMat.dispose();
      cloudGeom.dispose();
      cloudMat.dispose();
      extGeom.dispose();
      extMat.dispose();

      nodes.forEach((n) => {
        scene.remove(n.group);
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
      {/* Volumetric background radial grid glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,229,201,0.06)_0%,transparent_75%)] pointer-events-none" />

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
