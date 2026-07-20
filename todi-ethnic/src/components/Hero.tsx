"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Shield, Truck, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui";
import { company } from "@/data/company";

const heroSlides = [
  {
    image: "/collections/bridal.jpg",
    alt: "Premium bridal lehenga showcase",
  },
  {
    image: "/collections/designer.jpg",
    alt: "Designer fusion lehenga collection",
  },
  {
    image: "/collections/party-wear.jpg",
    alt: "Party-wear lehenga range",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = useCallback((index: number) => setCurrentSlide(index), []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-charcoal">
      {/* Background image slideshow */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.alt}
          className="absolute inset-0 transition-opacity duration-700 bg-charcoal"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/50" />

      {/* Content */}
      <div className="container-page relative z-10 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="max-w-2xl">
          <span className="label-sm text-gold-light inline-block mb-4">
            India&apos;s Trusted B2B Lehenga Manufacturer
          </span>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-silk leading-[1.1] tracking-tight">
            Premium Lehengas,{" "}
            <span className="text-gold-light">Factory Direct</span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-silk/70 leading-relaxed max-w-lg">
            Supplying bridal, party-wear, and designer lehengas to 850+
            retailers and distributors across {company.exportMarkets} countries.
            Consistent quality, on-time delivery, direct factory pricing.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => (window.location.href = "/collections")}
            >
              Explore Wholesale Collection
              <ArrowRight size={16} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-silk/20 text-silk hover:bg-silk/10"
              onClick={() => (window.location.href = "/inquiry")}
            >
              Send Inquiry
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap gap-6 text-xs text-silk/50">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-gold-light" />
              14-Point Quality Check
            </span>
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-gold-light" />
              97% On-Time Dispatch
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall size={14} className="text-gold-light" />
              24hr Response Time
            </span>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="w-8 h-0.5 transition-all duration-300"
            style={{
              backgroundColor:
                currentSlide === i ? "var(--color-gold-light)" : "rgba(250,247,245,0.25)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
