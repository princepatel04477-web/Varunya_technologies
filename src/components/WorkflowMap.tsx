"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WorkflowMap() {
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

    // 2. Blueprint Workflow Nodes Setup
    interface WorkflowNode {
      id: number;
      name: string;
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      scale: number;
      scaleTarget: number;
      scaleV: number;
      group: THREE.Group;
      mats: THREE.MeshBasicMaterial[];
    }

    const nodes: WorkflowNode[] = [];

    // Helper to create wireframe materials
    const createWireframeMat = (opacity = 0.25): THREE.MeshBasicMaterial => {
      return new THREE.MeshBasicMaterial({
        color: colorIvory,
        wireframe: true,
        transparent: true,
        opacity: opacity,
      });
    };

    // Helper to add nodes
    const addNode = (id: number, name: string, baseX: number, baseY: number, group: THREE.Group, mats: THREE.MeshBasicMaterial[]) => {
      scene.add(group);
      nodes.push({
        id,
        name,
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        vx: 0,
        vy: 0,
        scale: 1.0,
        scaleTarget: 1.0,
        scaleV: 0,
        group,
        mats,
      });
    };

    // Node 0: Customer Portal (Octahedron)
    const g0 = new THREE.Group();
    const mat0 = createWireframeMat(0.5);
    g0.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), mat0));
    addNode(0, "Customer Portal", -0.7, 0.7, g0, [mat0]);

    // Node 1: Database (Stack of stacked rings)
    const g1 = new THREE.Group();
    const mat1a = createWireframeMat(0.5);
    const mat1b = createWireframeMat(0.5);
    const mat1c = createWireframeMat(0.5);
    const ring1a = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.004, 8, 24), mat1a);
    const ring1b = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.004, 8, 24), mat1b);
    const ring1c = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.004, 8, 24), mat1c);
    ring1a.position.y = 0.04;
    ring1a.rotation.x = Math.PI / 2;
    ring1b.position.y = 0.0;
    ring1b.rotation.x = Math.PI / 2;
    ring1c.position.y = -0.04;
    ring1c.rotation.x = Math.PI / 2;
    g1.add(ring1a, ring1b, ring1c);
    addNode(1, "Database", 0.7, 0.7, g1, [mat1a, mat1b, mat1c]);

    // Node 2: CRM (Overlapping Rings)
    const g2 = new THREE.Group();
    const mat2a = createWireframeMat(0.55);
    const mat2b = createWireframeMat(0.4);
    const torus2a = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.004, 8, 24), mat2a);
    const torus2b = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.004, 8, 20), mat2b);
    g2.add(torus2a, torus2b);
    addNode(2, "CRM", -0.7, 0.15, g2, [mat2a, mat2b]);

    // Node 3: AI Agent (Sphere with Nucleus)
    const g3 = new THREE.Group();
    const mat3a = createWireframeMat(0.5);
    const mat3b = new THREE.MeshBasicMaterial({ color: colorIvory, transparent: true, opacity: 0.75 });
    const sphere3 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), mat3a);
    const core3 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), mat3b);
    g3.add(sphere3, core3);
    addNode(3, "AI Agent", 0.0, 0.3, g3, [mat3a, mat3b]);

    // Node 4: Payment Gateway (Diamond)
    const g4 = new THREE.Group();
    const mat4 = createWireframeMat(0.6);
    const diamond4 = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.005, 4, 4), mat4);
    diamond4.rotation.z = Math.PI / 4;
    g4.add(diamond4);
    addNode(4, "Payment Gateway", 0.7, -0.2, g4, [mat4]);

    // Node 5: ERP (Cube)
    const g5 = new THREE.Group();
    const mat5 = createWireframeMat(0.45);
    g5.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), mat5));
    addNode(5, "ERP", -0.7, -0.6, g5, [mat5]);

    // Node 6: Email (Tetrahedron)
    const g6 = new THREE.Group();
    const mat6 = createWireframeMat(0.5);
    g6.add(new THREE.Mesh(new THREE.TetrahedronGeometry(0.075, 0), mat6));
    addNode(6, "Email", 0.0, -0.6, g6, [mat6]);

    // Node 7: Analytics (Cone)
    const g7 = new THREE.Group();
    const mat7 = createWireframeMat(0.5);
    g7.add(new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.11, 4), mat7));
    addNode(7, "Analytics", 0.7, -0.6, g7, [mat7]);

    // 3. Routing Connections Setup
    interface PathConfig {
      id: number;
      startNode: number;
      endNode: number;
      curve: THREE.Curve<THREE.Vector3>;
    }

    const paths: PathConfig[] = [
      { id: 0, startNode: 0, endNode: 3, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) }, // Portal -> AI
      { id: 1, startNode: 3, endNode: 2, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // AI -> CRM
      { id: 2, startNode: 3, endNode: 4, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // AI -> Payment
      { id: 3, startNode: 2, endNode: 1, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // CRM -> DB
      { id: 4, startNode: 4, endNode: 1, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // Payment -> DB
      { id: 5, startNode: 1, endNode: 5, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // DB -> ERP
      { id: 6, startNode: 5, endNode: 6, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) }, // ERP -> Email
      { id: 7, startNode: 1, endNode: 7, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // DB -> Analytics
      { id: 8, startNode: 2, endNode: 7, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // CRM -> Analytics
      { id: 9, startNode: 7, endNode: 3, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // Analytics -> AI
      { id: 10, startNode: 3, endNode: 6, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) }, // AI -> Email
      { id: 11, startNode: 0, endNode: 1, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) }, // Portal -> DB
      { id: 12, startNode: 1, endNode: 2, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // DB -> CRM
      { id: 13, startNode: 3, endNode: 1, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) }, // AI -> DB
      { id: 14, startNode: 2, endNode: 6, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) }, // CRM -> Email
    ];

    const connections: {
      pathId: number;
      geom: THREE.BufferGeometry;
      line: THREE.Line;
      mat: THREE.LineBasicMaterial;
      pulseWeight: number;
    }[] = [];

    paths.forEach((p) => {
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(17 * 3);
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.LineBasicMaterial({
        color: colorIvory,
        transparent: true,
        opacity: 0.06,
      });

      const line = new THREE.Line(geom, mat);
      scene.add(line);

      connections.push({
        pathId: p.id,
        geom,
        line,
        mat,
        pulseWeight: 0,
      });
    });

    // 4. Task Data Packets Setup
    const packetGeom = new THREE.SphereGeometry(0.015, 6, 6);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xfffde6,
      transparent: true,
      opacity: 0.95,
    });

    interface TaskPacket {
      mesh: THREE.Mesh;
      pathId: number;
      progress: number;
      speed: number;
      onComplete: () => void;
    }
    const packets: TaskPacket[] = [];

    const spawnPacket = (pathId: number, speed = 0.02, onComplete: () => void) => {
      const pMesh = new THREE.Mesh(packetGeom, packetMat);
      scene.add(pMesh);
      packets.push({
        mesh: pMesh,
        pathId,
        progress: 0,
        speed,
        onComplete,
      });
    };

    // 5. Workflows State Machine Setup
    // Three active workflows cycling
    // 0: Customer Purchase
    // 1: Automated Sync & Analytics
    // 2: Portal Triage
    let activeWorkflow = 0;
    let workflowTimer = 0;

    // Track active paths for current workflow
    const getActivePathsForWorkflow = (w: number): number[] => {
      switch (w) {
        case 0: return [0, 1, 2, 3, 4, 5, 6];
        case 1: return [12, 7, 8, 9, 10];
        case 2: return [0, 13, 12, 14];
        default: return [];
      }
    };

    // Flags to handle packet merge states
    let crmArrivedWorkflow0 = false;
    let paymentArrivedWorkflow0 = false;

    let crmArrivedWorkflow1 = false;
    let dbArrivedWorkflow1 = false;

    const triggerWorkflowPackets = (wIndex: number) => {
      if (wIndex === 0) {
        // Workflow 0: Portal -> AI
        spawnPacket(0, 0.018, () => {
          // AI splits: trigger CRM & Payment parallel packets
          spawnPacket(1, 0.02, () => {
            // CRM -> DB
            spawnPacket(3, 0.02, () => {
              crmArrivedWorkflow0 = true;
              checkMergeWorkflow0();
            });
          });
          spawnPacket(2, 0.02, () => {
            // Payment -> DB
            spawnPacket(4, 0.016, () => {
              paymentArrivedWorkflow0 = true;
              checkMergeWorkflow0();
            });
          });
        });
      } else if (wIndex === 1) {
        // Workflow 1: Database -> CRM & Analytics (Parallel)
        spawnPacket(12, 0.016, () => {
          // CRM -> Analytics
          spawnPacket(8, 0.02, () => {
            crmArrivedWorkflow1 = true;
            checkMergeWorkflow1();
          });
        });
        spawnPacket(7, 0.018, () => {
          dbArrivedWorkflow1 = true;
          checkMergeWorkflow1();
        });
      } else if (wIndex === 2) {
        // Workflow 2: Portal -> AI -> DB -> CRM -> Email (Linear Pipeline)
        spawnPacket(0, 0.018, () => {
          spawnPacket(13, 0.02, () => {
            spawnPacket(12, 0.02, () => {
              spawnPacket(14, 0.018, () => {
                // Completed!
                nodes[6].scaleTarget = 1.35;
              });
            });
          });
        });
      }
    };

    const checkMergeWorkflow0 = () => {
      if (crmArrivedWorkflow0 && paymentArrivedWorkflow0) {
        crmArrivedWorkflow0 = false;
        paymentArrivedWorkflow0 = false;
        // Merge complete at DB (Node 1) -> trigger DB -> ERP
        nodes[1].scaleTarget = 1.35;
        spawnPacket(5, 0.02, () => {
          // ERP -> Email
          nodes[5].scaleTarget = 1.35;
          spawnPacket(6, 0.02, () => {
            nodes[6].scaleTarget = 1.35;
          });
        });
      }
    };

    const checkMergeWorkflow1 = () => {
      if (crmArrivedWorkflow1 && dbArrivedWorkflow1) {
        crmArrivedWorkflow1 = false;
        dbArrivedWorkflow1 = false;
        // Merge complete at Analytics (Node 7) -> trigger Analytics -> AI
        nodes[7].scaleTarget = 1.35;
        spawnPacket(9, 0.022, () => {
          // AI -> Email
          nodes[3].scaleTarget = 1.35;
          spawnPacket(10, 0.02, () => {
            nodes[6].scaleTarget = 1.35;
          });
        });
      }
    };

    // Initial trigger
    triggerWorkflowPackets(activeWorkflow);

    // 6. Background blueprint grid dots
    const bgCount = 25;
    const bgGeom = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      bgPositions[i * 3] = (Math.random() - 0.5) * 5;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      bgPositions[i * 3 + 2] = -0.5;
    }
    bgGeom.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
    const bgMat = new THREE.PointsMaterial({
      color: colorIvory,
      size: 0.01,
      transparent: true,
      opacity: 0.05,
    });
    const bgPoints = new THREE.Points(bgGeom, bgMat);
    scene.add(bgPoints);

    // 7. Interaction and Hover Dependencies
    const dependencies: Record<number, number[]> = {
      0: [3, 2, 4, 1, 5, 6], // Portal -> AI, CRM, Payment, DB, ERP, Email
      1: [2, 5, 6, 7],       // Database -> CRM, ERP, Email, Analytics
      2: [1, 5, 6, 7],       // CRM -> DB, ERP, Email, Analytics
      3: [2, 4, 1, 5, 6],    // AI -> CRM, Payment, DB, ERP, Email
      4: [1, 5, 6],          // Payment -> DB, ERP, Email
      5: [6],                // ERP -> Email
      6: [],                 // Email
      7: [3, 6],             // Analytics -> AI, Email
    };

    const mouse3D = new THREE.Vector3(0, 0, 0);
    let isHovered = false;
    let hoveredNodeId: number | null = null;

    const H_visible = 2 * 4.2 * Math.tan((45 * Math.PI) / 360);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const aspect = rect.width / rect.height;
      mouse3D.set(x * (H_visible * aspect) / 2, y * H_visible / 2, 0);

      // Proximity check to hover nodes
      let closestNodeId: number | null = null;
      let minDistance = 0.6;
      nodes.forEach((n) => {
        const nodeVec = new THREE.Vector3(n.x, n.y, 0);
        const dist = mouse3D.distanceTo(nodeVec);
        if (dist < minDistance) {
          minDistance = dist;
          closestNodeId = n.id;
        }
      });
      hoveredNodeId = closestNodeId;
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

      let closestNodeId: number | null = null;
      let minDistance = 0.65;
      nodes.forEach((n) => {
        const nodeVec = new THREE.Vector3(n.x, n.y, 0);
        const dist = mouse3D.distanceTo(nodeVec);
        if (dist < minDistance) {
          minDistance = dist;
          closestNodeId = n.id;
        }
      });
      hoveredNodeId = closestNodeId;
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchstart", handleMouseEnter, { passive: true });
    container.addEventListener("touchend", handleMouseLeave, { passive: true });

    // 8. Animation & Physics Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const springStiffness = 0.08;
    const springDamping = 0.75;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Cycle workflows every 8.5 seconds
      workflowTimer += delta;
      if (workflowTimer > 8.5) {
        workflowTimer = 0;
        activeWorkflow = (activeWorkflow + 1) % 3;
        // Clean out merge flags for new workflow
        crmArrivedWorkflow0 = false;
        paymentArrivedWorkflow0 = false;
        crmArrivedWorkflow1 = false;
        dbArrivedWorkflow1 = false;
        triggerWorkflowPackets(activeWorkflow);
      }

      // Nodes positioning physics
      nodes.forEach((n) => {
        // Base hover float
        let fx = Math.sin(elapsed * 0.9 + n.id) * 0.03;
        let fy = Math.cos(elapsed * 0.75 + n.id) * 0.03;

        let targetX = n.baseX + fx;
        let targetY = n.baseY + fy;

        // Proximity pull on mouse hover
        if (isHovered) {
          const baseVec = new THREE.Vector3(n.baseX, n.baseY, 0);
          const dist = mouse3D.distanceTo(baseVec);
          if (dist < 1.1) {
            const pull = (1.1 - dist) * 0.22;
            const dir = new THREE.Vector3().subVectors(mouse3D, baseVec).normalize();
            targetX += dir.x * pull;
            targetY += dir.y * pull;
          }
        }

        // Spring position
        const ax = (targetX - n.x) * springStiffness;
        n.vx += ax;
        n.vx *= springDamping;
        n.x += n.vx;

        const ay = (targetY - n.y) * springStiffness;
        n.vy += ay;
        n.vy *= springDamping;
        n.y += n.vy;

        n.group.position.set(n.x, n.y, 0);

        // Rotation effects
        if (n.id === 0) {
          n.group.children[0].rotation.y += 0.4 * delta;
          n.group.children[0].rotation.x += 0.25 * delta;
        } else if (n.id === 1) {
          // DB rings offset spins
          n.group.children[0].rotation.z += 0.3 * delta;
          n.group.children[1].rotation.z -= 0.2 * delta;
          n.group.children[2].rotation.z += 0.4 * delta;
        } else if (n.id === 2) {
          n.group.children[0].rotation.y += 0.4 * delta;
          n.group.children[1].rotation.z -= 0.5 * delta;
        } else if (n.id === 3) {
          n.group.children[0].rotation.y += 0.5 * delta;
          n.group.children[0].rotation.x += 0.3 * delta;
        } else if (n.id === 4) {
          n.group.children[0].rotation.z += 0.3 * delta;
        } else if (n.id === 5) {
          n.group.children[0].rotation.x += 0.35 * delta;
          n.group.children[0].rotation.y += 0.45 * delta;
        } else if (n.id === 6) {
          n.group.children[0].rotation.y += 0.5 * delta;
        } else if (n.id === 7) {
          n.group.children[0].rotation.y += 0.6 * delta;
        }

        // Spring scale integration
        let targetScale = 1.0;
        if (hoveredNodeId !== null) {
          if (n.id === hoveredNodeId) {
            targetScale = 1.4;
          } else if (dependencies[hoveredNodeId]?.includes(n.id)) {
            targetScale = 1.15;
          } else {
            targetScale = 0.8;
          }
        }
        n.scaleTarget += (targetScale - n.scaleTarget) * 0.12;

        const forceScale = (n.scaleTarget - n.scale) * 0.12;
        n.scaleV += forceScale;
        n.scaleV *= 0.78;
        n.scale += n.scaleV;
        n.group.scale.set(n.scale, n.scale, n.scale);

        // Decay targets back to normal scale base
        n.scaleTarget += (1.0 - n.scaleTarget) * 0.05;

        // Update node geometries materials opacity
        n.mats.forEach((m) => {
          let targetOpacity = 0.5;
          if (hoveredNodeId !== null) {
            if (n.id === hoveredNodeId) {
              targetOpacity = 0.95;
            } else if (dependencies[hoveredNodeId]?.includes(n.id)) {
              targetOpacity = 0.75;
            } else {
              targetOpacity = 0.18;
            }
          }
          m.opacity += (targetOpacity - m.opacity) * 0.12;
        });
      });

      // Update Connections (curves bend on proximity)
      const activePaths = getActivePathsForWorkflow(activeWorkflow);

      connections.forEach((c) => {
        const pathConfig = paths.find((p) => p.id === c.pathId)!;
        const nodeA = nodes[pathConfig.startNode];
        const nodeB = nodes[pathConfig.endNode];

        const posA = new THREE.Vector3(nodeA.x, nodeA.y, 0);
        const posB = new THREE.Vector3(nodeB.x, nodeB.y, 0);

        const mid = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
        let controlPoint = mid.clone();

        // Mouse proximity line bend
        if (isHovered && pathConfig.curve instanceof THREE.QuadraticBezierCurve3) {
          const dist = mouse3D.distanceTo(mid);
          if (dist < 1.0) {
            const bend = (1.0 - dist) * 0.25;
            const dir = new THREE.Vector3().subVectors(mouse3D, mid).normalize();
            controlPoint.addScaledVector(dir, bend);
          }
        }

        // Set curve points
        if (pathConfig.curve instanceof THREE.LineCurve3) {
          pathConfig.curve.v1.copy(posA);
          pathConfig.curve.v2.copy(posB);
        } else if (pathConfig.curve instanceof THREE.QuadraticBezierCurve3) {
          pathConfig.curve.v0.copy(posA);
          pathConfig.curve.v1.copy(controlPoint);
          pathConfig.curve.v2.copy(posB);
        }

        // Update line vertices
        const points = pathConfig.curve.getPoints(16);
        const posAttr = c.geom.attributes.position;
        const array = posAttr.array as Float32Array;

        for (let i = 0; i < points.length; i++) {
          array[i * 3] = points[i].x;
          array[i * 3 + 1] = points[i].y;
          array[i * 3 + 2] = points[i].z;
        }
        posAttr.needsUpdate = true;

        // Path flare/fade decay
        c.pulseWeight += (0.0 - c.pulseWeight) * 0.04;

        // Connection opacity state calculation
        let targetLineOpacity = 0.04;

        if (hoveredNodeId !== null) {
          // Hover highlighting
          if (pathConfig.startNode === hoveredNodeId && dependencies[hoveredNodeId]?.includes(pathConfig.endNode)) {
            targetLineOpacity = 0.75;
          } else if (dependencies[hoveredNodeId]?.includes(pathConfig.startNode) || dependencies[hoveredNodeId]?.includes(pathConfig.endNode)) {
            targetLineOpacity = 0.16;
          } else {
            targetLineOpacity = 0.02;
          }
        } else {
          // Workflow active/inactive opacities
          if (activePaths.includes(c.pathId)) {
            targetLineOpacity = 0.22 + c.pulseWeight * 0.4;
          }
        }

        c.mat.opacity += (targetLineOpacity - c.mat.opacity) * 0.1;
      });

      // Update Packets Progress
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        const pathConfig = paths.find((pat) => pat.id === p.pathId)!;
        const connection = connections.find((c) => c.pathId === p.pathId)!;

        // Packet triggers route connection glow weight
        connection.pulseWeight = Math.max(connection.pulseWeight, (1.0 - p.progress) * 0.85);

        if (p.progress >= 1.0) {
          // Packet finished route, trigger completion callback and remove
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          p.onComplete();
          packets.splice(i, 1);
        } else {
          const pos = pathConfig.curve.getPointAt(p.progress);
          p.mesh.position.copy(pos);
        }
      }

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

      // Parallax scene shift
      const targetRotY = mouse3D.x * 0.05;
      const targetRotX = -mouse3D.y * 0.05;
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.08;
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.08;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize labels
    const labelCandidates = [
      "CRM",
      "ERP",
      "Analytics",
      "Portal",
      "Email",
      "Database",
      "Payments",
      "AI Agent",
      "API",
      "Customer Data",
      "Business Logic",
      "Operations",
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
      packetGeom.dispose();
      packetMat.dispose();
      bgGeom.dispose();
      bgMat.dispose();

      g0.children.forEach((c) => (c as THREE.Mesh).geometry.dispose());
      mat0.dispose();

      g1.children.forEach((c) => (c as THREE.Mesh).geometry.dispose());
      mat1a.dispose();
      mat1b.dispose();
      mat1c.dispose();

      g2.children.forEach((c) => (c as THREE.Mesh).geometry.dispose());
      mat2a.dispose();
      mat2b.dispose();

      g3.children.forEach((c) => (c as THREE.Mesh).geometry.dispose());
      mat3a.dispose();
      mat3b.dispose();

      g4.children.forEach((c) => (c as THREE.Mesh).geometry.dispose());
      mat4.dispose();

      g5.children.forEach((c) => (c as THREE.Mesh).geometry.dispose());
      mat5.dispose();

      g6.children.forEach((c) => (c as THREE.Mesh).geometry.dispose());
      mat6.dispose();

      g7.children.forEach((c) => (c as THREE.Mesh).geometry.dispose());
      mat7.dispose();

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
      className="relative w-full h-full bg-[#26292b] overflow-hidden"
    >
      {/* Volumetric center blueprint glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,229,201,0.04)_0%,transparent_75%)] pointer-events-none" />

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
