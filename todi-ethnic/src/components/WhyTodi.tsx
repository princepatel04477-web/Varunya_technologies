import { Shield, Clock, Settings, BadgePercent } from "lucide-react";
import { company } from "@/data/company";
import { Badge } from "@/components/ui";

const benefits = [
  {
    icon: Shield,
    title: "Consistent Quality at Scale",
    description:
      "Every piece matches the approved prototype — fabric, embroidery, finish. Each batch passes a 14-point inspection before dispatch.",
  },
  {
    icon: Clock,
    title: "97% On-Time Dispatch",
    description:
      "Our production planning system staggers orders across 6 workshop units to guarantee deadlines even at peak wedding season.",
  },
  {
    icon: Settings,
    title: "Flexible Minimums",
    description:
      "From 6-piece boutique runs to 500+ bulk orders. Customize colors, sizing, embroidery patterns, and private labeling.",
  },
  {
    icon: BadgePercent,
    title: "Direct Factory Pricing",
    description:
      "You buy from the source — our own manufacturing unit in Surat. Factory prices with volume-based discounts on repeat orders.",
  },
];

const stats = [
  { value: "22", label: "Years in Business" },
  { value: "850+", label: "Retail Partners" },
  { value: "12", label: "Export Markets" },
  { value: "5,000+", label: "Monthly Production" },
];

export default function WhyTodi() {
  return (
    <section className="bg-white">
      <div className="container-page section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Value proposition */}
          <div>
            <Badge>Why Todi Ethnic</Badge>
            <h2 className="headline-xl mt-3 text-ink">
              Craftsmanship. Capacity. Consistency.
            </h2>
            <p className="body-lg mt-4">
              For over {company.yearsInBusiness} years, we have been the trusted
              manufacturing partner for retailers, boutiques, and distributors
              who demand quality at scale. Our Surat facility produces{" "}
              {company.manufacturingCapacity.toLowerCase()} with rigorous quality
              control at every step.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="border border-border-subtle/60 p-4">
                  <span className="font-display text-2xl md:text-3xl font-semibold text-bridal block">
                    {stat.value}
                  </span>
                  <span className="text-sm text-warm-gray mt-1 block">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Benefit cards */}
          <div className="flex flex-col gap-5">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex gap-4 p-4 border border-border-subtle/40 bg-silk"
              >
                <benefit.icon size={22} className="text-bridal shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink text-sm">{benefit.title}</h3>
                  <p className="text-sm text-warm-gray mt-1 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
