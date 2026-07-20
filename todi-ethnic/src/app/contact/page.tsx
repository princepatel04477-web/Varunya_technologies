import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { company } from "@/data/company";
import { Badge, Button } from "@/components/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Todi Ethnic — B2B Lehenga Manufacturer, Surat",
  description: `Contact Todi Ethnic for wholesale lehenga inquiries. Call ${company.phone} or WhatsApp ${company.whatsapp}. Manufacturing unit in Surat, Gujarat. Serving 850+ retailers globally.`,
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-charcoal pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="container-page">
            <Badge className="text-gold-light bg-gold-light/10">
              Get in Touch
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-silk mt-3">
              Let&apos;s Build Your <span className="text-gold-light">Next Collection</span>
            </h1>
            <p className="body-lg text-silk/60 mt-4 max-w-xl">
              We respond fastest to WhatsApp messages. For formal inquiries, use the
              inquiry form — we&apos;ll get back within 24 hours.
            </p>
          </div>
        </section>

        <section className="bg-silk">
          <div className="container-page section-padding">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact methods */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  className="flex items-center gap-4 p-5 bg-white border border-border-subtle/60 hover:border-teal/30 transition-colors"
                >
                  <MessageCircle size={22} className="text-teal shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-ink block">WhatsApp</span>
                    <span className="text-sm text-warm-gray">{company.whatsapp}</span>
                  </div>
                </a>

                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center gap-4 p-5 bg-white border border-border-subtle/60 hover:border-teal/30 transition-colors"
                >
                  <Phone size={22} className="text-teal shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-ink block">Phone</span>
                    <span className="text-sm text-warm-gray">{company.phone}</span>
                  </div>
                </a>

                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-4 p-5 bg-white border border-border-subtle/60 hover:border-teal/30 transition-colors"
                >
                  <Mail size={22} className="text-teal shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-ink block">Email</span>
                    <span className="text-sm text-warm-gray">{company.email}</span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-white border border-border-subtle/60">
                  <MapPin size={22} className="text-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-ink block">Address</span>
                    <span className="text-sm text-warm-gray">{company.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white border border-border-subtle/60">
                  <Clock size={22} className="text-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-semibold text-ink block">Business Hours</span>
                    <span className="text-sm text-warm-gray">
                      Mon–Sat: 10:00 AM – 7:00 PM IST
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="lg:col-span-2 bg-white border border-border-subtle/60 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="headline-lg text-ink">
                  Ready to Start Your Order?
                </h2>
                <p className="body-lg mt-3 max-w-lg">
                  Submit your requirements through our inquiry form and receive
                  curated product recommendations with factory pricing within 24 hours.
                </p>
                <div className="mt-6">
                  <Link href="/inquiry">
                    <Button variant="secondary" size="lg">
                      Send Inquiry
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-border-subtle">
                  <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-3">
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {company.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="text-xs bg-silk text-ink-muted px-3 py-1.5"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
