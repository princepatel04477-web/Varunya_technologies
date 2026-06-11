"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AutomationEngine() {
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
    // Node representation: basePosition, currentPosition, spring physics, and mesh groups
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

    // Node 0: Incoming Task (Top Center) -> Concentric target rings
    const node0Group = new THREE.Group();
    const ring0a = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.005, 4, 32), createWireframeMat(0.4));
    const ring0b = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.005, 4, 24), createWireframeMat(0.6));
    node0Group.add(ring0a);
    node0Group.add(ring0b);
    scene.add(node0Group);

    nodes.push({
      id: 0, name: "Incoming Task",
      baseX: 0, baseY: 0.9, x: 0, y: 0.9,
      vx: 0, vy: 0, scale: 1, scaleTarget: 1, scaleV: 0,
      group: node0Group,
      mats: [ring0a.material as any, ring0b.material as any],
    });

    // Node 1: AI Classification (Top Mid) -> Scanning horizontal bar
    const node1Group = new THREE.Group();
    const scanBarMat = new THREE.LineBasicMaterial({ color: colorIvory, transparent: true, opacity: 0.7 });
    const scanBarPoints = [new THREE.Vector3(-0.25, 0, 0), new THREE.Vector3(0.25, 0, 0)];
    const scanBarGeom = new THREE.BufferGeometry().setFromPoints(scanBarPoints);
    const scanBar = new THREE.Line(scanBarGeom, scanBarMat);
    node1Group.add(scanBar);
    scene.add(node1Group);

    nodes.push({
      id: 1, name: "AI Classification",
      baseX: 0, baseY: 0.5, x: 0, y: 0.5,
      vx: 0, vy: 0, scale: 1, scaleTarget: 1, scaleV: 0,
      group: node1Group,
      mats: [scanBarMat as any],
    });

    // Node 2: Decision Engine (Center) -> Rhombus/Diamond
    const node2Group = new THREE.Group();
    const diamondGeom = new THREE.TorusGeometry(0.14, 0.006, 4, 4); // 4 segments forms a diamond
    const diamondMat = createWireframeMat(0.6);
    const diamond = new THREE.Mesh(diamondGeom, diamondMat);
    diamond.rotation.z = Math.PI / 4;
    node2Group.add(diamond);
    scene.add(node2Group);

    nodes.push({
      id: 2, name: "Decision Engine",
      baseX: 0, baseY: 0.1, x: 0, y: 0.1,
      vx: 0, vy: 0, scale: 1, scaleTarget: 1, scaleV: 0,
      group: node2Group,
      mats: [diamondMat],
    });

    // Node 3: Knowledge Retrieval A (Left Branch) -> Box
    const node3Group = new THREE.Group();
    const boxGeom = new THREE.BoxGeometry(0.11, 0.11, 0.11);
    const boxMat = createWireframeMat(0.5);
    node3Group.add(new THREE.Mesh(boxGeom, boxMat));
    scene.add(node3Group);

    nodes.push({
      id: 3, name: "Retrieval A",
      baseX: -0.75, baseY: -0.3, x: -0.75, y: -0.3,
      vx: 0, vy: 0, scale: 1, scaleTarget: 1, scaleV: 0,
      group: node3Group,
      mats: [boxMat],
    });

    // Node 4: Knowledge Retrieval B (Center Branch) -> Sphere
    const node4Group = new THREE.Group();
    const sphereGeom = new THREE.SphereGeometry(0.075, 12, 12);
    const sphereMat = createWireframeMat(0.5);
    node4Group.add(new THREE.Mesh(sphereGeom, sphereMat));
    scene.add(node4Group);

    nodes.push({
      id: 4, name: "Retrieval B",
      baseX: 0.0, baseY: -0.3, x: 0.0, y: -0.3,
      vx: 0, vy: 0, scale: 1, scaleTarget: 1, scaleV: 0,
      group: node4Group,
      mats: [sphereMat],
    });

    // Node 5: Knowledge Retrieval C (Right Branch) -> Octahedron
    const node5Group = new THREE.Group();
    const octGeom = new THREE.OctahedronGeometry(0.08, 0);
    const octMat = createWireframeMat(0.5);
    node5Group.add(new THREE.Mesh(octGeom, octMat));
    scene.add(node5Group);

    nodes.push({
      id: 5, name: "Retrieval C",
      baseX: 0.75, baseY: -0.3, x: 0.75, y: -0.3,
      vx: 0, vy: 0, scale: 1, scaleTarget: 1, scaleV: 0,
      group: node5Group,
      mats: [octMat],
    });

    // Node 6: Execution Layer (Bottom Mid) -> Double opposite-rotating gears
    const node6Group = new THREE.Group();
    const gearMat1 = createWireframeMat(0.65);
    const gearMat2 = createWireframeMat(0.4);
    const gear1 = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 8, 8), gearMat1); // 8 segments looks like teeth
    const gear2 = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.008, 8, 8), gearMat2);
    node6Group.add(gear1);
    node6Group.add(gear2);
    scene.add(node6Group);

    nodes.push({
      id: 6, name: "Execution",
      baseX: 0.0, baseY: -0.72, x: 0.0, y: -0.72,
      vx: 0, vy: 0, scale: 1, scaleTarget: 1, scaleV: 0,
      group: node6Group,
      mats: [gearMat1, gearMat2],
    });

    // Node 7: Completed Output (Bottom Center) -> Core target circle
    const node7Group = new THREE.Group();
    const outRing = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.006, 4, 32), createWireframeMat(0.5));
    const outCore = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), new THREE.MeshBasicMaterial({ color: colorIvory, transparent: true, opacity: 0.7 }));
    node7Group.add(outRing);
    node7Group.add(outCore);
    scene.add(node7Group);

    nodes.push({
      id: 7, name: "Output",
      baseX: 0.0, baseY: -1.02, x: 0.0, y: -1.02,
      vx: 0, vy: 0, scale: 1, scaleTarget: 1, scaleV: 0,
      group: node7Group,
      mats: [outRing.material as any, outCore.material as any],
    });

    // 3. Routing Paths Setup
    // Connect nodes along the workflow pipeline structure
    interface PathConfig {
      id: number;
      startNode: number;
      endNode: number;
      curve: THREE.Curve<THREE.Vector3>;
    }
    const paths: PathConfig[] = [
      // 0: Node 0 ➔ Node 1
      { id: 0, startNode: 0, endNode: 1, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) },
      // 1: Node 1 ➔ Node 2
      { id: 1, startNode: 1, endNode: 2, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) },
      // 2: Node 2 ➔ Node 3 (Left Branch)
      { id: 2, startNode: 2, endNode: 3, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) },
      // 3: Node 2 ➔ Node 4 (Center Branch)
      { id: 3, startNode: 2, endNode: 4, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) },
      // 4: Node 2 ➔ Node 5 (Right Branch)
      { id: 4, startNode: 2, endNode: 5, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) },
      // 5: Node 3 ➔ Node 6 (Left to Execution)
      { id: 5, startNode: 3, endNode: 6, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) },
      // 6: Node 4 ➔ Node 6 (Center to Execution)
      { id: 6, startNode: 4, endNode: 6, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) },
      // 7: Node 5 ➔ Node 6 (Right to Execution)
      { id: 7, startNode: 5, endNode: 6, curve: new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()) },
      // 8: Node 6 ➔ Node 7 (Execution to Output)
      { id: 8, startNode: 6, endNode: 7, curve: new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3()) },
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
      const positions = new Float32Array(17 * 3); // 16 segments
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.LineBasicMaterial({
        color: colorIvory,
        transparent: true,
        opacity: 0.12,
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
    const packetGeom = new THREE.SphereGeometry(0.016, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });

    interface TaskPacket {
      mesh: THREE.Mesh;
      route: number[]; // Array of path IDs
      routeIndex: number; // Current path index in the route
      progress: number;
      speed: number;
    }
    const packets: TaskPacket[] = [];

    const spawnTaskPacket = (route: number[], speed = 0.016) => {
      const pMesh = new THREE.Mesh(packetGeom, packetMat);
      scene.add(pMesh);

      packets.push({
        mesh: pMesh,
        route,
        routeIndex: 0,
        progress: 0,
        speed,
      });
    };

    // 5. Background grid dots (Atmospheric blueprint)
    const bgCount = 30;
    const bgGeom = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      bgPositions[i * 3] = (Math.random() - 0.5) * 5;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      bgPositions[i * 3 + 2] = -0.6;
    }
    bgGeom.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
    const bgMat = new THREE.PointsMaterial({
      color: colorIvory,
      size: 0.01,
      transparent: true,
      opacity: 0.06,
    });
    const bgPoints = new THREE.Points(bgGeom, bgMat);
    scene.add(bgPoints);

    // 6. Interaction Setup
    const mouse3D = new THREE.Vector3(0, 0, 0);
    let isHovered = false;

    // visible height at z=0 for PerspectiveCamera with fov=45 at z=4.2
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

    // 7. Workflow Scheduling Simulation
    let spawnTimer = 0;

    const runWorkflowEngine = (delta: number) => {
      spawnTimer += delta;

      // Spawn a new task package every 2.4 seconds
      if (spawnTimer > 2.4) {
        spawnTimer = 0;
        
        // Dynamically choose workflow path:
        // 0: Left path (Classification ➔ Decision ➔ Retrieval A ➔ Execution ➔ Output)
        // 1: Center path (Classification ➔ Decision ➔ Retrieval B ➔ Execution ➔ Output)
        // 2: Right path (Classification ➔ Decision ➔ Retrieval C ➔ Execution ➔ Output)
        // 3: Parallel Branching (Spawns a left packet and a right packet concurrently!)
        const roll = Math.random();

        if (roll < 0.28) {
          // Left single path
          spawnTaskPacket([0, 1, 2, 5, 8], 0.02);
        } else if (roll < 0.56) {
          // Center single path
          spawnTaskPacket([0, 1, 3, 6, 8], 0.02);
        } else if (roll < 0.8) {
          // Right single path
          spawnTaskPacket([0, 1, 4, 7, 8], 0.02);
        } else {
          // Branching action! Spawns two packets that travel in parallel
          // Packet 1: Left branch [0, 1, 2, 5, 8]
          // Packet 2: Right branch [0, 1, 4, 7, 8]
          // Both share paths 0 and 1, then split, then merge back at path 8
          spawnTaskPacket([0, 1, 2, 5, 8], 0.02);
          setTimeout(() => spawnTaskPacket([0, 1, 4, 7, 8], 0.02), 50); // tiny offset for separation
        }
      }
    };

    const handleTaskProgressNode = (arrivedNodeId: number) => {
      // Pulse node target scale on arrived
      const node = nodes[arrivedNodeId];
      node.scaleTarget = 1.35;
    };

    // 8. Render & Physics Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const springStiffness = 0.08;
    const springDamping = 0.76;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Trigger automatic workflow tasks
      runWorkflowEngine(delta);

      // Node Physics float & mouse pull
      nodes.forEach((n) => {
        let fx = 0;
        let fy = 0;

        if (n.id === 2) {
          // Decision diamond slow wobble
          fx = Math.sin(elapsed * 0.8) * 0.02;
          fy = Math.cos(elapsed * 0.6) * 0.02;
        } else if (n.id === 6) {
          // Execution gear wobble
          fx = Math.sin(elapsed * 1.1) * 0.02;
          fy = Math.cos(elapsed * 0.9) * 0.02;
        } else {
          // General floating hover drift
          fx = Math.sin(elapsed * 1.2 + n.id) * 0.035;
          fy = Math.cos(elapsed * 1.0 + n.id) * 0.035;
        }

        let targetX = n.baseX + fx;
        let targetY = n.baseY + fy;

        // Interactive mouse pull (pulls nodes on hover proximity)
        if (isHovered) {
          const baseVec = new THREE.Vector3(n.baseX, n.baseY, 0);
          const dist = mouse3D.distanceTo(baseVec);
          if (dist < 1.3) {
            const pull = (1.3 - dist) * 0.3;
            const dir = new THREE.Vector3().subVectors(mouse3D, baseVec).normalize();
            targetX += dir.x * pull;
            targetY += dir.y * pull;
          }
        }

        // Spring position integration
        const ax = (targetX - n.x) * springStiffness;
        n.vx += ax;
        n.vx *= springDamping;
        n.x += n.vx;

        const ay = (targetY - n.y) * springStiffness;
        n.vy += ay;
        n.vy *= springDamping;
        n.y += n.vy;

        n.group.position.set(n.x, n.y, 0);

        // Individual geometry spins
        if (n.id === 0) {
          n.group.children[0].rotation.z += 0.25 * delta;
          n.group.children[1].rotation.z -= 0.4 * delta;
        } else if (n.id === 1) {
          // AI Classification horizontal bar slides up/down
          const scanY = 0.5 + 0.05 * Math.sin(elapsed * 3.5);
          n.group.children[0].position.y = scanY - 0.5;
        } else if (n.id === 3 || n.id === 4 || n.id === 5) {
          // Retrieval blocks rotate
          n.group.children[0].rotation.y += 0.6 * delta;
          n.group.children[0].rotation.x += 0.3 * delta;
        } else if (n.id === 6) {
          // execution gears rotate in opposite directions
          n.group.children[0].rotation.z += 0.7 * delta;
          n.group.children[1].rotation.z -= 0.9 * delta;
        }

        // Spring scale integration
        const forceScale = (n.scaleTarget - n.scale) * 0.12;
        n.scaleV += forceScale;
        n.scaleV *= 0.78;
        n.scale += n.scaleV;
        n.group.scale.set(n.scale, n.scale, n.scale);

        // Decay targets back to normal
        n.scaleTarget += (1.0 - n.scaleTarget) * 0.08;
      });

      // Update Connection paths (Lines bend on hover)
      connections.forEach((c) => {
        const pathConfig = paths.find((p) => p.id === c.pathId)!;
        const nodeA = nodes[pathConfig.startNode];
        const nodeB = nodes[pathConfig.endNode];

        const posA = new THREE.Vector3(nodeA.x, nodeA.y, 0);
        const posB = new THREE.Vector3(nodeB.x, nodeB.y, 0);

        const mid = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
        let controlPoint = mid.clone();

        // Proximity bending
        if (isHovered && pathConfig.curve instanceof THREE.QuadraticBezierCurve3) {
          const dist = mouse3D.distanceTo(mid);
          if (dist < 1.1) {
            const bend = (1.1 - dist) * 0.32;
            const dir = new THREE.Vector3().subVectors(mouse3D, mid).normalize();
            controlPoint.addScaledVector(dir, bend);
          }
        }

        // Apply positions depending on line type
        if (pathConfig.curve instanceof THREE.LineCurve3) {
          pathConfig.curve.v1.copy(posA);
          pathConfig.curve.v2.copy(posB);
        } else if (pathConfig.curve instanceof THREE.QuadraticBezierCurve3) {
          pathConfig.curve.v0.copy(posA);
          pathConfig.curve.v1.copy(controlPoint);
          pathConfig.curve.v2.copy(posB);
        }

        // Update geometry vertices
        const points = pathConfig.curve.getPoints(16);
        const posAttr = c.geom.attributes.position;
        const array = posAttr.array as Float32Array;

        for (let i = 0; i < points.length; i++) {
          array[i * 3] = points[i].x;
          array[i * 3 + 1] = points[i].y;
          array[i * 3 + 2] = points[i].z;
        }
        posAttr.needsUpdate = true;

        // Connection flare decay
        c.pulseWeight += (0.0 - c.pulseWeight) * 0.04;
        c.mat.opacity = 0.09 + c.pulseWeight * 0.42;
      });

      // Update active Task Packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        const currentPathId = p.route[p.routeIndex];
        const connection = connections.find((c) => c.pathId === currentPathId)!;
        const pathConfig = paths.find((pat) => pat.id === currentPathId)!;

        // Illuminate connection segment
        connection.pulseWeight = Math.max(connection.pulseWeight, (1.0 - p.progress) * 0.8);

        if (p.progress >= 1.0) {
          // Finished current segment path, advance or complete
          handleTaskProgressNode(pathConfig.endNode);

          if (p.routeIndex < p.route.length - 1) {
            // Move to next path segment
            p.routeIndex++;
            p.progress = 0;
          } else {
            // Reached completed output target! Remove packet
            scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            packets.splice(i, 1);
          }
        } else {
          // Set mesh position along curve
          const pos = pathConfig.curve.getPointAt(p.progress);
          p.mesh.position.copy(pos);
        }
      }

      // Parallax scene drift
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
      "Trigger",
      "Decision",
      "Action",
      "Workflow",
      "Approval",
      "Execution",
      "Monitoring",
      "Optimization",
      "Response",
      "Task",
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
      bgGeom.dispose();
      bgMat.dispose();

      ring0a.geometry.dispose();
      ring0b.geometry.dispose();
      (ring0a.material as THREE.Material).dispose();
      (ring0b.material as THREE.Material).dispose();
      scanBarGeom.dispose();
      scanBarMat.dispose();
      diamondGeom.dispose();
      diamondMat.dispose();
      boxGeom.dispose();
      boxMat.dispose();
      sphereGeom.dispose();
      sphereMat.dispose();
      octGeom.dispose();
      octMat.dispose();
      gear1.geometry.dispose();
      gear2.geometry.dispose();
      gearMat1.dispose();
      gearMat2.dispose();
      outRing.geometry.dispose();
      outCore.geometry.dispose();
      (outRing.material as THREE.Material).dispose();
      (outCore.material as THREE.Material).dispose();

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
