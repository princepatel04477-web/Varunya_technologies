"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  const navItems = [
    { label: "Capabilities", id: "capabilities" },
    { label: "Network Map", id: "tech-map" },
    { label: "Process", id: "process" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
          scrolled || mobileMenuOpen
            ? "bg-bg-dark/90 backdrop-blur-md py-4 border-white/5"
            : "bg-transparent py-8 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo / Home */}
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center group focus:outline-none -my-8"
          >
            <Image
              src="/VT_logo.png"
              alt="Varunya Logo"
              width={128}
              height={128}
              className="h-24 w-24 md:h-32 md:w-32 object-contain group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </a>

          {/* Navigation Items - Desktop */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className="relative text-sm tracking-widest text-muted hover:text-white transition-colors duration-300 font-medium py-1 group cursor-pointer"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-out" />
              </button>
            ))}
          </nav>

          {/* Contact Actions / Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection("contact")}
              className="hidden sm:flex px-5 py-2.5 rounded-full border border-white/20 text-xs md:text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300 ease-in-out cursor-pointer font-medium h-[40px] items-center justify-center"
            >
              {"LET'S TALK"}
            </button>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden w-10 h-10 items-center justify-center border border-white/10 rounded-full text-muted hover:text-white transition-colors duration-300 focus:outline-none cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-bg-dark/98 backdrop-blur-xl flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col gap-8 mt-16">
              {navItems.map((item, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.5 }}
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-3xl font-display font-light tracking-wide text-fg-light hover:text-white transition-colors duration-300"
                >
                  <span className="font-mono text-xs text-white/30 mr-4">0{idx + 1}</span>
                  {item.label}
                </motion.button>
              ))}
              
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + navItems.length * 0.08, duration: 0.5 }}
                onClick={() => scrollToSection("contact")}
                className="text-left text-3xl font-display font-light tracking-wide text-[#d4af37] hover:text-[#e5c158] transition-colors duration-300 mt-4 border-t border-white/15 pt-8"
              >
                <span className="font-mono text-xs text-[#d4af37]/45 mr-4">04</span>
                {"Let's Talk"}
              </motion.button>
            </div>
            
            <div className="absolute bottom-12 left-8 right-8 flex justify-between items-center text-[10px] tracking-widest text-white/20 font-mono">
              <span>DESIGN FIRST / CODE FOREVER</span>
              <span>© 2026 VT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
