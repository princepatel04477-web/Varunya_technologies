import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { collections } from "@/data/collections";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Wholesale Lehenga Collections — Bridal, Party-Wear & Designer",
  description:
    "Browse Todi Ethnic's complete wholesale collection. Bridal lehengas, party-wear, designer fusion, semi-stitched, and ready-to-wear sets. B2B bulk orders with factory-direct pricing.",
};

export default function CollectionsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="bg-charcoal pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="container-page">
            <h1 className="font-display text-3xl md:text-5xl font-semibold text-silk">
              Wholesale Collections
            </h1>
            <p className="body-lg text-silk/60 mt-3 max-w-xl">
              Every collection engineered for retail success — from bridal showstoppers to
              high-turnover ready-to-wear essentials.
            </p>
          </div>
        </section>

        {/* Collection Grid */}
        <section className="bg-silk">
          <div className="container-page section-padding">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {collections.map((collection) => (
                <a
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="group block bg-white border border-border-subtle/60 overflow-hidden transition-all duration-200 hover:border-bridal/20"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] bg-charcoal/5 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-charcoal/5 to-charcoal/10 flex flex-col items-center justify-center p-8 text-center">
                      <span className="label-sm text-bridal mb-3">
                        {collection.categories[0]}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="font-display text-lg font-semibold text-ink group-hover:text-bridal transition-colors">
                      {collection.name}
                    </h2>
                    <p className="mt-1 text-sm text-warm-gray">{collection.tagline}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs bg-silk text-ink-muted px-2 py-1">
                        Min: {collection.minOrder} pcs
                      </span>
                      <span className="text-xs bg-silk text-bridal px-2 py-1">
                        {collection.priceRange}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-warm-gray line-clamp-2">
                      {collection.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-bridal group-hover:gap-2 transition-all">
                      View Details <ArrowRight size={14} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
