"use client";

import { Badge } from "@/components/ui";
import { company } from "@/data/company";
import { collections } from "@/data/collections";
import { Send, Phone, Mail, MessageCircle } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { submitInquiry } from "./actions";
import Link from "next/link";

export function InquiryPageClient({
  initialCollection,
}: {
  initialCollection: string;
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, {
    success: false,
    error: null,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  if (state.success) {
    return (
      <section className="bg-charcoal text-silk min-h-screen flex items-center">
        <div className="container-page section-padding text-center">
          <div className="max-w-lg mx-auto">
            <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={28} className="text-teal-light" />
            </div>
            <h1 className="headline-xl text-silk">Inquiry Received</h1>
            <p className="body-lg text-silk/60 mt-3">
              Thank you. Our team will review your requirements and reach out within 24
              hours with product recommendations and pricing.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/collections"
                className="text-sm text-gold-light hover:text-gold transition-colors"
              >
                ← Browse Collections
              </Link>
              <a
                href={`https://wa.me/${company.whatsapp}`}
                className="text-sm text-teal-light hover:text-teal transition-colors"
              >
                Urgent? Message on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-charcoal min-h-screen">
      <div className="container-page pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Info */}
          <div>
            <Badge className="text-gold-light bg-gold-light/10">
              Start Your Order
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-silk mt-3">
              Send Your Requirements
            </h1>
            <p className="body-lg text-silk/60 mt-4">
              Tell us what you need — styles, quantities, timeline — and we&apos;ll
              respond within 24 hours with curated recommendations and factory pricing.
            </p>

            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-semibold text-silk/40 uppercase tracking-widest">
                Quick Details
              </h3>
              <a
                href={`tel:${company.phone}`}
                className="flex items-center gap-3 text-sm text-silk/60 hover:text-gold-light transition-colors"
              >
                <Phone size={16} className="text-gold-light" />
                {company.phone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-3 text-sm text-silk/60 hover:text-gold-light transition-colors"
              >
                <Mail size={16} className="text-gold-light" />
                {company.email}
              </a>
              <a
                href={`https://wa.me/${company.whatsapp}`}
                className="flex items-center gap-3 text-sm text-silk/60 hover:text-gold-light transition-colors"
              >
                <MessageCircle size={16} className="text-gold-light" />
                WhatsApp: {company.whatsapp}
              </a>
            </div>

            <div className="mt-8">
              <h3 className="text-xs font-semibold text-silk/40 uppercase tracking-widest mb-3">
                Our Collections
              </h3>
              <div className="flex flex-wrap gap-2">
                {collections.map((c) => (
                  <Link
                    key={c.id}
                    href={`/collections/${c.slug}`}
                    className="text-xs text-silk/50 hover:text-gold-light transition-colors border border-silk/10 px-3 py-1.5"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <form ref={formRef} action={formAction} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider"
                >
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
                <label
                  htmlFor="business"
                  className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider"
                >
                  Business Name
                </label>
                <input
                  id="business"
                  name="business"
                  required
                  className="w-full bg-white/5 border border-silk/10 px-4 py-3 text-sm text-silk placeholder:text-silk/25 focus:outline-none focus:border-gold-light/40 transition-colors"
                  placeholder="Your boutique or store"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider"
              >
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
              <label
                htmlFor="phone"
                className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider"
              >
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
              <label
                htmlFor="collection"
                className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider"
              >
                Collection Interest
              </label>
              <select
                id="collection"
                name="collection"
                defaultValue={initialCollection}
                className="w-full bg-white/5 border border-silk/10 px-4 py-3 text-sm text-silk/80 focus:outline-none focus:border-gold-light/40 transition-colors"
              >
                <option value="">Select a collection (optional)</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="Multiple">Multiple collections</option>
                <option value="Not sure">Not sure yet</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider"
              >
                Approximate Quantity
              </label>
              <select
                id="quantity"
                name="quantity"
                required
                className="w-full bg-white/5 border border-silk/10 px-4 py-3 text-sm text-silk/80 focus:outline-none focus:border-gold-light/40 transition-colors"
              >
                <option value="">Select quantity range</option>
                <option value="1-10 pieces">1–10 pieces (sample order)</option>
                <option value="11-50 pieces">11–50 pieces</option>
                <option value="51-200 pieces">51–200 pieces</option>
                <option value="200+ pieces">200+ pieces (bulk order)</option>
                <option value="Not sure">Not sure yet</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="requirements"
                className="block text-xs font-medium text-silk/50 mb-1.5 uppercase tracking-wider"
              >
                Your Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                required
                className="w-full bg-white/5 border border-silk/10 px-4 py-3 text-sm text-silk placeholder:text-silk/25 focus:outline-none focus:border-gold-light/40 transition-colors resize-y"
                placeholder="Describe what you're looking for — styles, budget range, delivery timeline..."
              />
            </div>

            {state.error && (
              <p className="text-sm text-red-400 bg-red-400/10 px-4 py-2">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center font-semibold tracking-wider uppercase transition-all duration-200 bg-teal text-white hover:bg-teal-light active:bg-teal-light text-sm px-8 py-3.5 gap-2 w-full disabled:opacity-50"
            >
              {pending ? (
                "Sending..."
              ) : (
                <>
                  Submit Inquiry <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
