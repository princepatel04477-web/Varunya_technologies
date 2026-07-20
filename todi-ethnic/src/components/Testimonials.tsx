"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Badge } from "@/components/ui";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const t = testimonials[current];

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="bg-silk border-t border-border-subtle">
      <div className="container-page section-padding">
        <Badge>What Our Partners Say</Badge>
        <h2 className="headline-xl mt-3 text-ink">Trusted by Retailers Across the Globe</h2>

        <div className="mt-10 max-w-3xl">
          <div className="bg-white border border-border-subtle/60 p-8 md:p-10 relative">
            <Quote size={32} className="text-bridal/10 absolute top-6 right-6" />

            <div className="flex gap-1 mb-5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
            </div>

            <blockquote className="text-lg md:text-xl text-ink font-medium leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <p className="body-base mt-5">{t.text}</p>

            <div className="mt-6 pt-5 border-t border-border-subtle/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-ink text-sm">{t.name}</span>
                <span className="text-warm-gray text-sm ml-2">
                  — {t.business}, {t.location}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor:
                      i === current
                        ? "var(--color-bridal)"
                        : "var(--color-warm-gray)",
                    opacity: i === current ? 1 : 0.3,
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="p-2 border border-border-subtle hover:bg-ink/5 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="p-2 border border-border-subtle hover:bg-ink/5 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
