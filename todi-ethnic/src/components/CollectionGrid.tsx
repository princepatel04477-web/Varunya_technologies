import { ArrowRight } from "lucide-react";
import { collections, type Collection } from "@/data/collections";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <a
      href={`/collections/${collection.slug}`}
      className="group block bg-white border border-border-subtle/60 overflow-hidden transition-all duration-200 hover:border-bridal/20"
    >
      {/* Image placeholder */}
      <div className="aspect-[4/5] bg-charcoal/5 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-charcoal/5 to-charcoal/10 flex flex-col items-center justify-center p-6 text-center">
          <span className="font-display text-sm text-warm-gray uppercase tracking-widest">
            {collection.categories[0]}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink group-hover:text-bridal transition-colors">
          {collection.name}
        </h3>
        <p className="mt-1 text-sm text-warm-gray line-clamp-2">{collection.tagline}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-ink-muted font-medium">
            Min: {collection.minOrder} pcs
          </span>
          <span className="text-xs text-bridal font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            View Collection <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function CollectionGrid() {
  return (
    <section className="bg-silk">
      <div className="container-page section-padding">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <Badge>B2B Collections</Badge>
            <h2 className="headline-xl mt-3 text-ink">
              Explore Our Range
            </h2>
            <p className="body-lg mt-3 max-w-xl">
              From bridal opulence to ready-to-wear essentials — every collection
              designed for retail success.
            </p>
          </div>
          <Link href="/collections">
            <Button variant="outline">
              View All Collections <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Grid — first 4 collections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.slice(0, 6).map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
