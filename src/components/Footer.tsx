"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-dark border-t border-white/5 py-12 md:py-20 w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
          {/* Logo & Agency details */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/VT_logo.png"
                alt="Varunya Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
              />
              <span className="font-display font-bold text-base tracking-wider">
                VARUNYA TECHNOLOGIES
              </span>
            </div>
            <p className="text-muted text-xs leading-relaxed font-light max-w-xs mt-2">
              High-end editorial web experiences, intelligent custom integrations, and clean systems architecture. Designed and engineered for excellence in Surat.
            </p>
          </div>

          {/* Local Services Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[10px] tracking-widest text-white/30 font-semibold uppercase font-mono">
              SOLUTIONS IN SURAT
            </span>
            <div className="flex flex-col gap-2">
              {[
                { name: "Web Development", path: "/web-development-company-surat" },
                { name: "Mobile App Development", path: "/mobile-app-development-company-surat" },
                { name: "UI/UX Design Studio", path: "/ui-ux-design-company-surat" },
                { name: "Software Development", path: "/software-development-company-surat" },
                { name: "AI Solutions", path: "/ai-development-company-surat" }
              ].map((service) => (
                <Link
                  key={service.name}
                  href={service.path}
                  className="text-xs text-muted hover:text-white transition-colors duration-300 self-start font-mono"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="text-[10px] tracking-widest text-white/30 font-semibold uppercase font-mono">
              NETWORK
            </span>
            <div className="flex flex-col gap-2">
              {[
                { name: "Awwwards", url: "https://www.awwwards.com" },
                { name: "GitHub", url: "https://github.com" },
                { name: "Twitter", url: "https://twitter.com" },
                { name: "LinkedIn", url: "https://linkedin.com" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted hover:text-white transition-colors duration-300 self-start"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Office coordinates / location */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[10px] tracking-widest text-white/30 font-semibold uppercase font-mono">
              STUDIO LOCATION
            </span>
            <p className="text-xs text-muted leading-relaxed font-light">
              Varunya Technologies LLC<br />
              Adajan, Surat, Gujarat — India<br />
              <span className="font-mono text-[10px] text-white/40">{"21° 11′ N, 72° 47′ E"}</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[10px] tracking-widest text-white/30 font-mono">
            © {currentYear} VARUNYA TECHNOLOGIES. ALL RIGHTS RESERVED.
          </span>
          <span className="text-[10px] tracking-widest text-white/30 font-mono uppercase">
            DESIGN FIRST / CODE FOREVER
          </span>
        </div>
      </div>
    </footer>
  );
}
