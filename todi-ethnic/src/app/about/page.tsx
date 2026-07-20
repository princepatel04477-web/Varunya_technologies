import type { Metadata } from "next";
import { Shield, Users, Factory, Globe, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { company, qualityPillars, stats } from "@/data/company";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Todi Ethnic — B2B Lehenga Manufacturer & Exporter",
  description: `${company.yearsInBusiness} years of wholesale lehenga manufacturing. Serving ${company.activeRetailers}+ retail partners across ${company.exportMarkets} countries. MSME registered, ISO 9001:2015 certified. Factory in Surat, Gujarat.`,
};

const timeline = [
  { year: 2003, event: "Founded in Surat as a small family workshop specializing in bridal embroidery." },
  { year: 2008, event: "Expanded to a full-scale manufacturing unit with 50+ craftsmen." },
  { year: 2013, event: "Launched our first ready-to-wear collection for retail partners." },
  { year: 2017, event: "Crossed 500 retail partners and began export operations." },
  { year: 2021, event: "Opened our second production facility and design studio." },
  { year: 2025, event: "850+ retail partners across 12 countries. ISO 9001:2015 certified." },
];

const values = [
  {
    icon: Shield,
    title: "Craftsmanship",
    text: "Every piece hand-inspected. Traditional techniques preserved, adapted for modern retail at scale.",
  },
  {
    icon: Users,
    title: "Partnership",
    text: "We grow with our retailers. The better you sell, the better we produce. Long-term relationships over transactional orders.",
  },
  {
    icon: Factory,
    title: "Capacity",
    text: "Two facilities, 6 workshop units, 5,000+ pieces monthly. Scale that meets demand without compromising on finish.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    text: "Export-ready packaging, documentation expertise, and logistics partners that deliver on time, everywhere.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-charcoal pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="container-page">
            <Badge className="text-gold-light bg-gold-light/10">About Us</Badge>
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-silk mt-3">
              {company.yearsInBusiness} Years of <span className="text-gold-light">Lehenga Craftsmanship</span>
            </h1>
            <p className="body-lg text-silk/60 mt-4 max-w-xl">
              From a small Surat workshop to an international wholesale partner — our story
              is built on consistency, craft, and the retailers who trust us.
            </p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-bridal">
          <div className="container-page py-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div>
                <div className="font-display text-2xl md:text-3xl font-semibold text-gold-light">{stats[0].value}</div>
                <div className="text-xs text-white/60 mt-1 uppercase tracking-wider">{stats[0].label}</div>
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl font-semibold text-gold-light">{stats[1].value}</div>
                <div className="text-xs text-white/60 mt-1 uppercase tracking-wider">{stats[1].label}</div>
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl font-semibold text-gold-light">{stats[3].value}</div>
                <div className="text-xs text-white/60 mt-1 uppercase tracking-wider">{stats[3].label}</div>
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl font-semibold text-gold-light">{stats[2].value}</div>
                <div className="text-xs text-white/60 mt-1 uppercase tracking-wider">{stats[2].label}</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="font-display text-2xl md:text-3xl font-semibold text-gold-light">{stats[4].value}</div>
                <div className="text-xs text-white/60 mt-1 uppercase tracking-wider">{stats[4].label}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white">
          <div className="container-page section-padding">
            <h2 className="headline-lg text-ink">Our Journey</h2>
            <div className="mt-8 flex flex-col gap-0">
              {timeline.map((item, i) => (
                <div key={item.year} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-bridal mt-1.5" />
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-border-subtle" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="font-display text-sm font-semibold text-bridal">{item.year}</span>
                    <p className="text-sm text-ink-muted mt-1">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-silk border-t border-border-subtle">
          <div className="container-page section-padding">
            <Badge>Our Foundation</Badge>
            <h2 className="headline-xl mt-3 text-ink">What Drives Us</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white border border-border-subtle/60 p-6 flex gap-5">
                  <v.icon size={24} className="text-bridal shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-ink">{v.title}</h3>
                    <p className="text-sm text-warm-gray mt-1.5 leading-relaxed">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Pillars */}
        <section className="bg-white border-t border-border-subtle">
          <div className="container-page section-padding">
            <Badge>Quality Assurance</Badge>
            <h2 className="headline-xl mt-3 text-ink">What You Can Count On</h2>
            <p className="body-lg mt-3 max-w-xl">
              Every order we ship passes through these commitments.
            </p>
            <div className="mt-8 flex flex-col gap-5">
              {qualityPillars.map((pillar) => (
                <div key={pillar.title} className="border border-border-subtle/60 p-6 bg-silk flex items-start gap-4">
                  <Award size={22} className="text-bridal shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-ink">{pillar.title}</h3>
                    <p className="text-sm text-warm-gray mt-1.5 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
