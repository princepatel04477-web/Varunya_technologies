"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Statement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const text = "Technology should feel human. We create digital systems that merge brutal performance with premium editorial craftsmanship, breaking the barrier between function and art.";
  const words = text.split(" ");

  // Atmospheric Canvas Particle System (Microscopic slow-drifting specs of light)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 28;

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    class Particle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      opacity: number = 0;
      fadeSpeed: number = 0;
      swayValue: number = 0;
      swaySpeed: number = 0;

      constructor() {
        this.reset();
        // Scatter particles initially throughout the vertical space
        this.y = Math.random() * (canvas?.height || 600);
      }

      reset() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 0.7 + 0.3; // Tiny microscopic dust particles
        this.speedX = (Math.random() - 0.5) * 0.04;
        this.speedY = -(Math.random() * 0.12 + 0.04); // Incredibly slow upward drift
        this.opacity = 0;
        this.fadeSpeed = Math.random() * 0.002 + 0.001; // Extremely gradual fade
        this.swayValue = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.005 + 0.002;
      }

      update() {
        if (!canvas) return;
        this.swayValue += this.swaySpeed;
        this.x += this.speedX + Math.sin(this.swayValue) * 0.06; // Faint wavering sway like museum air currents
        this.y += this.speedY;

        // Graceful fade in at bottom, fade out near top
        if (this.y > canvas.height * 0.75) {
          if (this.opacity < 0.2) this.opacity += this.fadeSpeed;
        } else if (this.y < canvas.height * 0.25) {
          this.opacity -= this.fadeSpeed;
        } else {
          this.opacity = Math.max(0.04, Math.min(0.2, this.opacity));
        }

        if (this.y < -10 || this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    const init = () => {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // GSAP Cinematic Reveal Spotlight & Scroll scrubbing
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Title Label Entrance
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );

      // 2. Active Spotlight Wave Character Animation (Directly Scroll Connected at 60 FPS)
      const chars = gsap.utils.toArray(".char");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%", // Triggers as manifesto enters viewport
          end: "bottom 30%", // Ends as manifesto scrolls out
          scrub: 0.5, // 60 FPS physically connected scrub
        },
      });

      chars.forEach((char: any, i: number) => {
        // Step A: Illuminate with glowing Spotlight (opacity: 1, translate: 0, text-shadow glow)
        tl.to(
          char,
          {
            opacity: 1,
            y: 0,
            textShadow: "0 0 10px rgba(255, 255, 255, 0.12)",
            duration: 0.3,
            ease: "power1.out",
          },
          i * 0.05
        )
        // Step B: Settle to Past state (opacity: 0.8, text-shadow fades)
        .to(
          char,
          {
            opacity: 0.8,
            textShadow: "0 0 0px rgba(255, 255, 255, 0)",
            duration: 0.25,
            ease: "power1.inOut",
          },
          i * 0.05 + 0.3
        );
      });

      // 3. Subtle ambient light breathing (16 seconds loop, extremely slow 3% brightness/scale oscillation)
      gsap.fromTo(
        glowRef.current,
        { opacity: 0.88, scale: 0.98 },
        {
          opacity: 1,
          scale: 1.02,
          duration: 16,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );

      // 4. Separator Line Reveal
      gsap.fromTo(
        lineRef.current,
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1,
          scaleX: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 25%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="statement"
      ref={containerRef}
      className="min-h-[100vh] w-full flex items-center justify-center bg-[#040404] border-b border-white/5 py-32 relative overflow-hidden"
    >
      {/* Background Atmosphere Canvas for faint moving particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Extremely faint premium noise/grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.012] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Extremely soft, large radial ambient lighting centered behind text */}
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vh] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.02) 0%, rgba(212, 175, 55, 0.005) 50%, rgba(0, 0, 0, 0) 100%)",
          filter: "blur(180px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-16 relative z-10 w-full">
        <div className="flex flex-col gap-10">
          <span
            ref={labelRef}
            className="text-[10px] tracking-[0.35em] text-muted font-bold uppercase inline-block font-sans"
            style={{ opacity: 0, transform: "translateY(15px)" }}
          >
            OUR MANIFESTO / PHILOSOPHY
          </span>
          
          <h2 
            className="font-display font-medium text-[clamp(2.2rem,4.8vw,4.5rem)] leading-[1.15] tracking-[0.02em] text-[#eae6df] select-none"
            style={{ fontFamily: "var(--font-norway), 'Norway', sans-serif" }}
          >
            {words.map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
                {word.split("").map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className="char inline-block"
                    style={{
                      opacity: 0.15,
                      transform: "translateY(8px)",
                      willChange: "opacity, transform, text-shadow",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          <div
            ref={lineRef}
            className="h-[1px] w-24 bg-white/20 mt-6 origin-left"
            style={{ opacity: 0, transform: "scaleX(0)", transformOrigin: "left" }}
          />
        </div>
      </div>
    </section>
  );
}
