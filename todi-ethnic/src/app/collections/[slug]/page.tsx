import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Package, Shield } from "lucide-react";
import {
  getCollectionBySlug,
  getAllCollectionSlugs,
  collections,
} from "@/data/collections";
import { Button, Badge } from "@/components/ui";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import InquiryLink from "./InquiryLink";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: `${collection.name} — Wholesale Pricing & Bulk Orders | Todi Ethnic`,
    description: `${collection.name}. ${collection.tagline}. Min order ${collection.minOrder} pieces. ${collection.highlights.slice(0, 2).join(". ")}. B2B wholesale pricing, direct from the manufacturer.`,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const otherCollections = collections.filter((c) => c.id !== collection.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-charcoal pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="container-page">
            <Link href="/collections" className="text-xs text-gold-light/60 hover:text-gold-light transition-colors mb-4 inline-block">
              ← Back to All Collections
            </Link>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left: Visual */}
              <div className="aspect-[4/5] bg-ink/20 w-full">
                <div className="w-full h-full bg-gradient-to-br from-ink/5 to-bridal/5 flex items-center justify-center p-12">
                  <div className="text-center">
                    <Badge className="text-gold-light bg-gold-light/10">{collection.categories[0]}</Badge>
                    <div className="mt-6 w-16 h-16 border border-gold-light/20 rounded-full flex items-center justify-center mx-auto">
                      <Package size={24} className="text-gold-light/40" />
                    </div>
                    <p className="text-silk/20 text-xs mt-4">Collection imagery</p>
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div>
                <Badge className="text-gold-light bg-gold-light/10">
                  {collection.id === "premium"
                    ? "Limited Edition"
                    : "Wholesale Collection"}
                </Badge>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-silk mt-3">
                  {collection.name}
                </h1>
                <p className="text-lg text-silk/60 mt-2">{collection.tagline}</p>
                <p className="body-base text-silk/50 mt-4 leading-relaxed">
                  {collection.description}
                </p>

                {/* Key specs */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-silk/60">
                    <Package size={16} className="text-gold-light" />
                    <span>Min. Order: <strong className="text-silk/80">{collection.minOrder} pcs</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-silk/60">
                    <Shield size={16} className="text-gold-light" />
                    <span>Price Range: <strong className="text-silk/80">{collection.priceRange}</strong></span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mt-8">
                  <h3 className="text-xs font-semibold text-silk/40 uppercase tracking-widest mb-3">
                    What You Get
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {collection.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-silk/60">
                        <Check size={14} className="text-teal-light shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <InquiryLink collectionName={collection.name} />
                  <Link
                    href="/inquiry"
                    className="text-sm text-gold-light hover:text-gold transition-colors flex items-center gap-1.5 self-center"
                  >
                    Request pricing & samples <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white">
          <div className="container-page section-padding">
            <h2 className="headline-lg text-ink">Available Categories</h2>
            <p className="body-base mt-2 max-w-xl">
              This collection spans the following sub-categories:
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {collection.categories.map((cat) => (
                <div
                  key={cat}
                  className="border border-border-subtle/60 p-5 text-center bg-silk"
                >
                  <span className="text-sm font-medium text-ink">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other collections */}
        <section className="bg-silk border-t border-border-subtle">
          <div className="container-page section-padding">
            <h2 className="headline-lg text-ink">Explore More Collections</h2>
            <p className="body-base mt-2 max-w-xl">
              See what else we manufacture for retailers and distributors.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherCollections.map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  className="block bg-white border border-border-subtle/60 p-6 hover:border-bridal/20 transition-colors"
                >
                  <h3 className="font-display font-semibold text-ink">{c.name}</h3>
                  <p className="text-sm text-warm-gray mt-1">{c.tagline}</p>
                  <span className="text-xs text-bridal mt-3 inline-block">
                    Min: {c.minOrder} pcs →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
