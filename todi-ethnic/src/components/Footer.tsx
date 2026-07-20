import { company } from "@/data/company";
import { collections } from "@/data/collections";

const footerLinks = [
  {
    title: "Collections",
    links: collections.slice(0, 4).map((c) => ({
      label: c.name,
      href: `/collections/${c.slug}`,
    })),
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Send Inquiry", href: "/inquiry" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-silk/80">
      <div className="container-page section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-display text-xl font-semibold text-silk tracking-wide">
              TODI <span className="text-gold-light">ETHNIC</span>
            </span>
            <p className="mt-3 body-base text-silk/60 max-w-sm">
              {company.description}
            </p>
            <p className="mt-4 text-sm text-silk/50">
              {company.address}
            </p>
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="label-sm text-gold-light mb-4">{group.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-silk/60 hover:text-silk transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-silk/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-silk/40">
          <span>© {new Date().getFullYear()} Todi Ethnic. All rights reserved.</span>
          <span>Manufacturing Unit: Surat, Gujarat, India</span>
        </div>
      </div>
    </footer>
  );
}
