"use client";

import React, { createContext, useContext } from "react";
import { useDeviceCapabilities, DeviceCapabilities, MotionTier } from "../hooks/useDeviceCapabilities";

const MotionConfigContext = createContext<DeviceCapabilities>({
  isMobile: false,
  isLowEnd: false,
  prefersReducedMotion: false,
  webglSupported: true,
  connectionSpeed: "4g",
  tier: 3,
  loading: true,
});

export const MotionConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const caps = useDeviceCapabilities();

  return (
    <MotionConfigContext.Provider value={caps}>
      {children}
    </MotionConfigContext.Provider>
  );
};

export const useMotionConfig = () => useContext(MotionConfigContext);
