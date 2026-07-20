export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  minOrder: number;
  priceRange: string;
  categories: string[];
  highlights: string[];
}

export const collections: Collection[] = [
  {
    id: "bridal",
    name: "Bridal Lehengas",
    slug: "bridal-lehengas",
    tagline: "Opulence crafted for the grand day",
    description:
      "Our bridal collection spans hand-embroidered lehengas in silk, velvet, and organza. Each piece features intricate zardozi, resham, and stone work — designed for the bride who demands nothing less than extraordinary. Available in bulk for retail distribution.",
    image: "/collections/bridal.jpg",
    minOrder: 12,
    priceRange: "₹12,000 – ₹85,000",
    categories: ["Silk Lehengas", "Velvet Lehengas", "Zardozi Lehengas", "Designer Bridal"],
    highlights: [
      "Hand-embroidered zardozi & resham work",
      "Premium silks, velvets & organza",
      "Custom sizing & color options available",
      "Bulk orders with consistent quality across pieces",
    ],
  },
  {
    id: "party-wear",
    name: "Party-Wear Lehengas",
    slug: "party-wear-lehengas",
    tagline: "Celebrate every moment in style",
    description:
      "A versatile range designed for weddings, receptions, sangeet, and festive occasions. Lighter fabrics, vibrant colors, and contemporary silhouettes that appeal to the modern woman. High-turnover essentials for every retailer's inventory.",
    image: "/collections/party-wear.jpg",
    minOrder: 24,
    priceRange: "₹5,500 – ₹18,000",
    categories: ["Printed Lehengas", "Embroidered Lehengas", "Net Lehengas", "Georgette Lehengas"],
    highlights: [
      "Quick-turn styles with 14-day delivery",
      "Vibrant color palette — 40+ shades",
      "Machine-embroidered & printed options",
      "High volume at competitive wholesale pricing",
    ],
  },
  {
    id: "designer",
    name: "Designer Fusion",
    slug: "designer-fusion-lehengas",
    tagline: "Where tradition meets contemporary edge",
    description:
      "Our designer fusion line merges traditional Indian craftsmanship with modern silhouettes and global trends. Asymmetric hemlines, cape-style dupattas, pastel palettes, and lightweight constructions for the fashion-forward buyer.",
    image: "/collections/designer.jpg",
    minOrder: 12,
    priceRange: "₹8,000 – ₹35,000",
    categories: ["Indo-Western Lehengas", "Cape Lehengas", "Pastel Lehengas", "Minimal Lehengas"],
    highlights: [
      "Contemporary Indo-Western silhouettes",
      "Lightweight constructions — easy to wear & ship",
      "Social-media-ready trending styles",
      "Dropshipping-friendly packaging available",
    ],
  },
  {
    id: "semi-stitched",
    name: "Semi-Stitched Lehengas",
    slug: "semi-stitched-lehengas",
    tagline: "Tailor-perfect fit for every customer",
    description:
      "Our semi-stitched collection gives retailers the flexibility to offer custom tailoring to their customers while maintaining consistent embroidery quality. These pieces ship faster and reduce return rates from size mismatches — a B2B advantage at scale.",
    image: "/collections/semi-stitched.jpg",
    minOrder: 36,
    priceRange: "₹4,000 – ₹14,000",
    categories: ["Unstitched Lehengas", "Custom-Fit Lehengas"],
    highlights: [
      "Lowest return rates — customers tailor to fit",
      "Compact packaging reduces shipping costs",
      "Consistent embroidery on all panels",
      "Ideal for multi-designer storefronts",
    ],
  },
  {
    id: "premium",
    name: "Premium Boutique",
    slug: "premium-boutique-lehengas",
    tagline: "Exclusivity for discerning clientele",
    description:
      "Our premium boutique line is limited-edition, each design produced in small batches to ensure exclusivity. Heavy handwork, rare fabrics, and museum-grade craftsmanship. For boutiques that cater to high-net-worth clientele seeking one-of-a-kind pieces.",
    image: "/collections/premium.jpg",
    minOrder: 6,
    priceRange: "₹25,000 – ₹1,50,000",
    categories: ["Limited Edition", "Heavy Handwork", "Bridal Trousseau"],
    highlights: [
      "Small-batch production — true exclusivity",
      "Heirloom-quality handwork & embellishments",
      "Rare fabrics: pure kora silk, banarasi, patola",
      "Private labeling available for boutiques",
    ],
  },
  {
    id: "ready-to-wear",
    name: "Ready-to-Wear Sets",
    slug: "ready-to-wear-lehengas",
    tagline: "Quick stock, fast turnover",
    description:
      "Our ready-to-wear section is designed for high-volume retail. Pre-stitched, pre-finished lehengas ready for immediate sale. Off-the-rack convenience with factory-direct quality. The highest inventory turnover category in our portfolio.",
    image: "/collections/ready-to-wear.jpg",
    minOrder: 48,
    priceRange: "₹3,200 – ₹9,500",
    categories: ["Pre-Stitched Lehengas", "Lehengas Sets", "Daily Wear"],
    highlights: [
      "Highest inventory turnover in our portfolio",
      "Pre-stitched — no tailoring needed",
      "Factory-direct pricing with volume discounts",
      "Mixed-container orders welcome",
    ],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getAllCollectionSlugs(): string[] {
  return collections.map((c) => c.slug);
}
