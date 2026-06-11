"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export default function LazySection({
  children,
  fallback = <div className="min-h-[40vh] bg-[#050507]" />,
  threshold = 0.01,
  rootMargin = "250px", // Load slightly ahead of viewport
}: LazySectionProps) {
  const [isIntersected, setIsIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [isIntersected, threshold, rootMargin]);

  return (
    <div ref={ref} className="w-full">
      {isIntersected ? children : fallback}
    </div>
  );
}
