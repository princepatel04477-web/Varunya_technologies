"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About Us" },
  { href: "/inquiry", label: "Inquiry" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-silk/85 backdrop-blur-lg border-b border-border-subtle/60"
          : "bg-transparent"
      )}
    >
      <div className="container-page flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="font-display text-lg md:text-xl font-semibold text-ink tracking-wide">
            TODI <span className="text-bridal">ETHNIC</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/inquiry"
            className="bg-bridal text-white text-sm font-semibold px-5 py-2.5 hover:bg-bridal-dark transition-colors tracking-wider uppercase"
          >
            Send Inquiry
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-silk border-t border-border-subtle">
          <nav className="container-page flex flex-col gap-0 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="py-3 text-sm font-medium text-ink-muted hover:text-ink transition-colors tracking-wide border-b border-border-subtle/40 last:border-0"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/inquiry"
              onClick={closeMenu}
              className="mt-3 bg-bridal text-white text-sm font-semibold px-5 py-3 text-center hover:bg-bridal-dark transition-colors tracking-wider uppercase"
            >
              Send Inquiry
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
