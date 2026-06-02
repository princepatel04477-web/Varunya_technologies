"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    service: "Web Experience",
    budget: "$50k - $100k",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-32 w-full bg-bg-dark relative overflow-hidden flex flex-col items-center">
      {/* Glow accent */}
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-white/[0.006] blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="flex flex-col gap-6 mb-16">
          <span className="text-xs tracking-[0.25em] text-muted font-semibold uppercase">
            GET IN TOUCH
          </span>
          <h2 className="font-display font-bold text-4.5xl md:text-6xl tracking-tight text-fg-light leading-tight">
            Ready To Build<br />Something Meaningful?
          </h2>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.01] border border-white/5 rounded-xl p-12 text-center flex flex-col items-center"
          >
            <span className="text-4xl mb-4">✨</span>
            <h3 className="font-display font-bold text-2xl text-fg-light mb-2">MANIFESTO RECEIVED</h3>
            <p className="text-muted text-sm max-w-sm">
              We review all inquiries within 24 hours. Let's design and engineer the future together.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Natural language mad-libs style form */}
            <div className="font-display text-xl md:text-[2.2vw] leading-[1.8] font-light text-muted tracking-tight">
              Hello, my name is{" "}
              <input
                type="text"
                required
                placeholder="your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-b border-white/20 text-white placeholder-white/10 bg-transparent focus:outline-none focus:border-white transition-colors duration-300 px-2 font-medium w-[180px] md:w-[220px] max-w-full"
              />{" "}
              and I represent{" "}
              <input
                type="text"
                placeholder="your company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="border-b border-white/20 text-white placeholder-white/10 bg-transparent focus:outline-none focus:border-white transition-colors duration-300 px-2 font-medium w-[180px] md:w-[220px] max-w-full"
              />
              . We want to collaborate on building a{" "}
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="border-b border-white/20 text-white bg-bg-dark focus:outline-none cursor-pointer focus:border-white transition-colors duration-300 px-2 font-medium appearance-none inline-block w-[200px] max-w-full"
              >
                <option value="Web Experience">Web Experience</option>
                <option value="AI System">AI System</option>
                <option value="Automation Pipeline">Automation Pipeline</option>
                <option value="Custom Software">Custom Software</option>
              </select>{" "}
              project. Our estimated budget is around{" "}
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="border-b border-white/20 text-white bg-bg-dark focus:outline-none cursor-pointer focus:border-white transition-colors duration-300 px-2 font-medium appearance-none inline-block w-[180px] max-w-full"
              >
                <option value="$20k - $50k">$20k - $50k</option>
                <option value="$50k - $100k">$50k - $100k</option>
                <option value="$100k+">$100k+</option>
              </select>
              . You can contact me at{" "}
              <input
                type="email"
                required
                placeholder="your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-b border-white/20 text-white placeholder-white/10 bg-transparent focus:outline-none focus:border-white transition-colors duration-300 px-2 font-medium w-[220px] max-w-full"
              />
              .
            </div>

            {/* Submission button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-16 flex items-center justify-between border border-white/10 hover:border-white/40 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 py-6 px-8 rounded-xl font-display font-bold text-lg tracking-wider text-fg-light cursor-pointer group"
            >
              <span>SEND BRIEF</span>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </div>
            </motion.button>
          </form>
        )}
      </div>
    </section>
  );
}
