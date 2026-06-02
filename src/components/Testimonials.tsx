"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const testimonials = [
    {
      quote: "Varunya merged complex network connections with an editorial grid that feels like reading a premium architecture book. The speed, design, and code quality are peerless.",
      author: "Marcus Vance",
      role: "Founder, Aeonik Space",
    },
    {
      quote: "Their technical engineering is robust, but their typography and art direction is what blew us away. They completely broke standard layouts and built a cinematic digital identity.",
      author: "Dr. Clara Chen",
      role: "Director of Product, Nexus Labs",
    },
    {
      quote: "The interactive map they built for our cloud nodes is not just beautiful—it runs at a solid 60fps on mobile. They are the definition of design engineers.",
      author: "Elena Rostova",
      role: "Lead Architect, Aurora Systems",
    },
  ];

  // Auto transition every 8s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-32 w-full bg-bg-dark border-b border-white/5 relative overflow-hidden flex items-center justify-center">
      {/* Background soft accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-white/[0.005] blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mb-10 text-white/20">
          <Quote className="w-4 h-4" />
        </div>

        <div className="min-h-[220px] md:min-h-[160px] flex items-center justify-center w-full relative mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
              className="flex flex-col items-center"
            >
              <blockquote className="font-display font-light text-2xl md:text-3.5xl leading-snug tracking-tight text-fg-light max-w-3xl">
                "{testimonials[index].quote}"
              </blockquote>
              
              <div className="mt-8 flex flex-col items-center">
                <cite className="not-italic font-bold text-sm tracking-wider text-white">
                  {testimonials[index].author}
                </cite>
                <span className="text-[11px] tracking-widest text-muted mt-1 uppercase">
                  {testimonials[index].role}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel indicators */}
        <div className="flex gap-3 justify-center">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-350 ${
                index === idx ? "bg-white w-6" : "bg-white/10"
              } cursor-pointer`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
