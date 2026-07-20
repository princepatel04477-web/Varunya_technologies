"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { company } from "@/data/company";

export default function InquirySection() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // In production: POST to an API route or Resend
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="bg-charcoal text-silk">
        <div className="container-page section-padding text-center">
          <div className="max-w-lg mx-auto">
            <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={28} className="text-teal-light" />
            </div>
            <h2 className="headline-lg text-silk">Inquiry Received</h2>
            <p className="body-lg text-silk/60 mt-3">
              Our team will review your requirements and reach out within 24 hours with
              product recommendations and pricing. We respond fastest on WhatsApp.
            </p>
            <p className="mt-6 text-sm text-silk/40">
              Urgent? Message us directly on <strong className="text-silk/70">WhatsApp</strong>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-charcoal text-silk">
      <div className="container-page section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Info */}
          <div>
            <Badge className="text-gold-light bg-gold-light/10">Start Your Order</Badge>
            <h2 className="headline-xl mt-3 text-silk">
              Ready to Stock Premium Lehengas?
            </h2>
            <p className="body-lg mt-4 text-silk/60">
              Tell us about your requirements — quantity, preferred styles, budget range,
              and delivery timeline. We&apos;ll send you curated options with pricing
              within 24 hours.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-silk/50">
                <div className="w-8 h-8 rounded-full bg-bridal/20 flex items-center justify-center">
                  <span className="text-bridal-light font-bold text-xs">1</span>
                </div>
                <span>Share your requirements</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-silk/50">
                <div className="w-8 h-8 rounded-full bg-bridal/20 flex items-center justify-center">
                  <span className="text-bridal-light font-bold text-xs">2</span>
                </div>
                <span>Receive curated catalog &amp; pricing</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-silk/50">
                <div className="w-8 h-8 rounded-full bg-bridal/20 flex items-center justify-center">
                  <span className="text-bridal-light font-bold text-xs">3</span>
                </div>
                <span>Approve samples &amp; place bulk order</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-silk/50">
                <div className="w-8 h-8 rounded-full bg-bridal/20 flex items-center justify-center">
                  <span className="text-bridal-light font-bold text-xs">4</span>
                </div>
                <span>Production begins with quality checks</span>
              </div>
            </div>

            <p className="mt-8 text-sm text-silk/40">
              Or reach us directly:{" "}
              <a href={`tel:${company.phone}`} className="text-gold-light hover:underline">
                {company.phone}
              </a>{" "}
              ·{" "}
              <a
                href={`https://wa.me/${company.whatsapp}`}
                className="text-gold-light hover:underline"
              >
                WhatsApp
              </a>
            </p>
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full bg-white/5 border border-silk/10 px-4 py-3 text-sm text-silk placeholder:text-silk/25 focus:outline-none focus:border-gold-light/40 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="company_name" className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider">
                  Business Name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  required
                  className="w-full bg-white/5 border border-silk/10 px-4 py-3 text-sm text-silk placeholder:text-silk/25 focus:outline-none focus:border-gold-light/40 transition-colors"
                  placeholder="Your boutique or store"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-white/5 border border-silk/10 px-4 py-3 text-sm text-silk placeholder:text-silk/25 focus:outline-none focus:border-gold-light/40 transition-colors"
                placeholder="you@business.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider">
                Phone / WhatsApp
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="w-full bg-white/5 border border-silk/10 px-4 py-3 text-sm text-silk placeholder:text-silk/25 focus:outline-none focus:border-gold-light/40 transition-colors"
                placeholder="+91 99XXX XXXXX"
              />
            </div>

            <div>
              <label htmlFor="requirements" className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider">
                Your Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                required
                className="w-full bg-white/5 border border-silk/10 px-4 py-3 text-sm text-silk placeholder:text-silk/25 focus:outline-none focus:border-gold-light/40 transition-colors resize-y"
                placeholder="Tell us about the styles, quantities, budget range, and delivery timeline you're looking for..."
              />
            </div>

            <Button variant="secondary" size="lg" type="submit" className="w-full">
              Submit Inquiry <Send size={16} />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
