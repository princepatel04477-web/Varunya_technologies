export interface Testimonial {
  id: string;
  name: string;
  business: string;
  location: string;
  quote: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Meera Kapoor",
    business: "Mirage Boutique",
    location: "Jaipur, Rajasthan",
    quote: "Consistent quality across every reorder — that's rare in this industry.",
    text: "We've ordered over 200 bridal lehengas from Todi Ethnic in the past 18 months. What keeps us coming back is the consistency — every batch matches the quality of the first sample. Their bulk ordering process is fast and the team handles custom sizing requests without any hassle.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Rohit Mehta",
    business: "Vogue Vault Retail",
    location: "Mumbai, Maharashtra",
    quote: "20% faster delivery than our previous supplier. Our turnover doubled.",
    text: "We switched to Todi Ethnic 14 months ago and have never looked back. Their ready-to-wear collection turns over in under 3 weeks at our store — customers love the contemporary designs. The team understands retail timelines and always delivers ahead of schedule.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Priya Srinivasan",
    business: "Nivi Fashion Studio",
    location: "Chennai, Tamil Nadu",
    quote: "The semi-stitched range reduced our return rate from 12% to under 2%.",
    text: "For a multi-designer boutique, returns were always our biggest headache. Todi's semi-stitched collection solved it — customers get the perfect fit, we get zero size-related returns. The embroidery quality on their unstitched panels is outstanding, and our clients notice the difference.",
    rating: 5,
  },
  {
    id: "t4",
    name: "Abdul Khan",
    business: "Eastern Elegance Exports",
    location: "Dubai, UAE",
    quote: "Export documentation handled flawlessly. 6 shipments, zero customs issues.",
    text: "We distribute Indian ethnic wear across the GCC region. Todi Ethnic's experience with export orders shows — correct documentation, proper packaging for long-haul shipping, and consistent quality that clears customs inspections without delays. Their gold-zari work is particularly popular with our clients.",
    rating: 5,
  },
];
