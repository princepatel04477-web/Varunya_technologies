"use client";

import { useState, useEffect } from "react";

export type MotionTier = 1 | 2 | 3; // 1: Minimal (No Animation), 2: Reduced (CSS-only), 3: Full (WebGL + Rich)

export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  webglSupported: boolean;
  connectionSpeed: string;
  tier: MotionTier;
  loading: boolean;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [caps, setCaps] = useState<DeviceCapabilities>({
    isMobile: false,
    isLowEnd: false,
    prefersReducedMotion: false,
    webglSupported: true,
    connectionSpeed: "4g",
    tier: 3,
    loading: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. isMobile
    const userAgent = navigator.userAgent || "";
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isMobileWidth = window.innerWidth < 768;
    const isMobile = isMobileUA || isMobileWidth;

    // 2. isLowEnd (Memory & CPU check)
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    // @ts-expect-error - deviceMemory is not standard in all browsers
    const deviceMemory = navigator.deviceMemory || 4;
    const isLowEnd = hardwareConcurrency <= 2 || deviceMemory <= 2;

    // 3. prefersReducedMotion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReducedMotion = motionQuery.matches;

    // 4. webglSupported
    let webglSupported = false;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      webglSupported = !!(gl && gl instanceof WebGLRenderingContext);
    } catch {
      webglSupported = false;
    }

    // 5. connectionSpeed
    let connectionSpeed = "4g";
    // @ts-expect-error - connection is not standard in all browsers
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && conn.effectiveType) {
      connectionSpeed = conn.effectiveType;
    }

    // Determine Tier:
    // TIER 1 (Minimal): prefersReducedMotion OR very slow connection
    // TIER 2 (Reduced): mobile OR low-end device OR webgl missing -> disable WebGL, use CSS / simpler animations
    // TIER 3 (Full): desktop + WebGL + fast + !prefersReducedMotion
    let tier: MotionTier = 3;

    if (prefersReducedMotion || connectionSpeed === "2g") {
      tier = 1;
    } else if (isMobile || isLowEnd || !webglSupported || connectionSpeed === "3g") {
      tier = 2;
    }

    setCaps({
      isMobile,
      isLowEnd,
      prefersReducedMotion,
      webglSupported,
      connectionSpeed,
      tier,
      loading: false,
    });
  }, []);

  return caps;
}
