"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float u_hover;
  uniform float u_scroll; // Dynamic scroll progress (0.0 to 1.0) with physics smoothing

  // 2D Hash function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // 2D Value Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Fractional Brownian Motion (5 octaves for fine ink flow details)
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Normalized coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Aspect ratio corrected coordinates
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // Mouse coordinate mapping
    vec2 mousePos = (u_mouse * 2.0 - 1.0);
    mousePos.x *= u_resolution.x / u_resolution.y;

    // Distance to cursor
    vec2 diff = p - mousePos;
    float dist = length(diff);

    // Elegant liquid ripple wave propagating from the cursor
    float ripple = sin(dist * 28.0 - u_time * 3.2) * exp(-dist * 3.5) * 0.08 * u_hover;
    p += normalize(diff + 0.0001) * ripple;

    // Domain Warping
    float speed = 0.025; // Extremely slow, luxurious flow
    vec2 q = vec2(
      fbm(p + vec2(u_time * speed, u_time * speed * 0.8)),
      fbm(p + vec2(u_time * -speed * 0.9, u_time * speed * 1.1))
    );

    vec2 r = vec2(
      fbm(p + 3.8 * q + vec2(u_time * speed * 0.6, u_time * -speed * 0.5) + mousePos * 0.08 * u_hover),
      fbm(p + 3.8 * q + vec2(u_time * -speed * 0.7, u_time * speed * 0.9) + mousePos * 0.08 * u_hover)
    );

    float f = fbm(p + 4.0 * r);

    // Dark base color matching the site theme (#050507)
    vec3 colBlack = vec3(5.0 / 255.0, 5.0 / 255.0, 7.0 / 255.0);

    // Dynamic, premium, muted editorial palettes for fluid highlights
    vec3 colIvory = vec3(234.0 / 255.0, 229.0 / 255.0, 201.0 / 255.0); // 1. Ivory
    vec3 colSage  = vec3(148.0 / 255.0, 161.0 / 255.0, 135.0 / 255.0); // 2. Sage Green
    vec3 colBlue  = vec3(143.0 / 255.0, 160.0 / 255.0, 176.0 / 255.0); // 3. Slate Blue
    vec3 colClay  = vec3(200.0 / 255.0, 146.0 / 255.0, 96.0 / 255.0);  // 4. Copper Clay

    // Interpolate fluid highlight color dynamically as the user scrolls
    vec3 colHighlight;
    float s = u_scroll * 3.0; // Map 0.0-1.0 to 3 transition segments
    if (s < 1.0) {
      colHighlight = mix(colIvory, colSage, s);
    } else if (s < 2.0) {
      colHighlight = mix(colSage, colBlue, s - 1.0);
    } else {
      colHighlight = mix(colBlue, colClay, clamp(s - 2.0, 0.0, 1.0));
    }

    // Blend between Black base and the scroll-shifted Highlight color
    vec3 color = mix(colBlack, colHighlight, f);

    // Organic volumetric ink shading highlights (3D depth)
    color = mix(color, colHighlight * 1.15, clamp(length(q), 0.0, 1.0) * 0.25);
    color = mix(color, vec3(0.0), clamp(length(r.x), 0.0, 1.0) * 0.12);

    // Soft border vignette for a premium editorial framed aesthetic
    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    vignette = clamp(pow(16.0 * vignette, 0.28), 0.0, 1.0);
    color = mix(colBlack * 0.4, color, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function WebGLDistortion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Orthographic Camera, Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Calculate initial scroll position
    const getScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      return scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    };

    // 2. Shader Uniforms Setup
    const uniforms = {
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_time: { value: 0 },
      u_hover: { value: 0 },
      u_scroll: { value: getScrollProgress() },
    };

    // 3. Quad Mesh Setup
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4. Mouse Tracking & Scroll Tracking with Damped Spring Inertia
    const target = { x: 0.5, y: 0.5, hover: 0, scroll: getScrollProgress() };
    const spring = { x: 0.5, y: 0.5, hover: 0, scroll: getScrollProgress(), vx: 0, vy: 0, vhover: 0, vscroll: 0 };

    // Spring constants for organic lag and settle (slow, editorial-like inertia)
    const stiffness = 0.05;
    const damping = 0.8;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y for WebGL coordinates
      
      target.x = x;
      target.y = y;
    };

    const handleMouseEnter = () => {
      target.hover = 1.0;
    };

    const handleMouseLeave = () => {
      target.hover = 0.0;
      target.x = 0.5;
      target.y = 0.5;
    };

    const handleScroll = () => {
      target.scroll = getScrollProgress();
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Support mobile touch events
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = 1.0 - (touch.clientY - rect.top) / rect.height;
      target.x = x;
      target.y = y;
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchstart", handleMouseEnter, { passive: true });
    container.addEventListener("touchend", handleMouseLeave, { passive: true });

    // 5. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.u_time.value = elapsed;

      // Spring physics update for Mouse X position
      const forceX = (target.x - spring.x) * stiffness;
      spring.vx += forceX;
      spring.vx *= damping;
      spring.x += spring.vx;

      // Spring physics update for Mouse Y position
      const forceY = (target.y - spring.y) * stiffness;
      spring.vy += forceY;
      spring.vy *= damping;
      spring.y += spring.vy;

      // Spring physics update for Hover factor
      const forceHover = (target.hover - spring.hover) * stiffness;
      spring.vhover += forceHover;
      spring.vhover *= damping;
      spring.hover += spring.vhover;

      // Spring physics update for Scroll progress
      const forceScroll = (target.scroll - spring.scroll) * stiffness;
      spring.vscroll += forceScroll;
      spring.vscroll *= damping;
      spring.scroll += spring.vscroll;

      // Update uniforms
      uniforms.u_mouse.value.set(spring.x, spring.y);
      uniforms.u_hover.value = spring.hover;
      uniforms.u_scroll.value = spring.scroll;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      renderer.setSize(newWidth, newHeight);
      uniforms.u_resolution.value.set(newWidth, newHeight);
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
      window.removeEventListener("scroll", handleScroll);
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
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
