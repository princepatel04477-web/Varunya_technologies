"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

export default function Contact() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    projectType: "",
    timeline: "",
    budget: "",
    details: "",
    name: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const projectTypes = [
    "AI SaaS",
    "Custom Software",
    "Automation",
    "WebGL Experience",
    "Marketing",
    "Other",
  ];

  const timelines = [
    "ASAP",
    "1–3 Months",
    "3–6 Months",
    "Long-Term",
  ];

  const budgets = [
    "< ₹15k",
    "₹30k–₹50k",
    "₹50k–₹100k",
    "₹100k+",
  ];

  const handleSelectOption = (field: "projectType" | "timeline" | "budget", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Automatically advance to the next step with a slight delay for better feel
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }, 280);
  };

  const handleNext = () => {
    if (currentStep === 3 && !formData.details.trim()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    setSubmitted(true);
  };

  // Step render helper
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-45">
              Select Project Category
            </span>
            <div className="grid grid-cols-2 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectOption("projectType", type)}
                  className={`py-4 px-5 rounded-xl border text-left text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                    formData.projectType === type
                      ? "border-[#3da58a] bg-[#3da58a]/5 text-[#eae5c9]"
                      : "border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02] text-[#eae5c9]/65 hover:text-[#eae5c9]"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span>{type}</span>
                    {formData.projectType === type && (
                      <Check className="w-3.5 h-3.5 text-[#3da58a]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-45">
              Select Estimated Timeline
            </span>
            <div className="grid grid-cols-2 gap-3">
              {timelines.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleSelectOption("timeline", time)}
                  className={`py-4 px-5 rounded-xl border text-left text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                    formData.timeline === time
                      ? "border-[#3da58a] bg-[#3da58a]/5 text-[#eae5c9]"
                      : "border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02] text-[#eae5c9]/65 hover:text-[#eae5c9]"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span>{time}</span>
                    {formData.timeline === time && (
                      <Check className="w-3.5 h-3.5 text-[#3da58a]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-45">
              Select Budget Range
            </span>
            <div className="grid grid-cols-2 gap-3">
              {budgets.map((budget) => (
                <button
                  key={budget}
                  type="button"
                  onClick={() => handleSelectOption("budget", budget)}
                  className={`py-4 px-5 rounded-xl border text-left text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                    formData.budget === budget
                      ? "border-[#3da58a] bg-[#3da58a]/5 text-[#eae5c9]"
                      : "border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02] text-[#eae5c9]/65 hover:text-[#eae5c9]"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span>{budget}</span>
                    {formData.budget === budget && (
                      <Check className="w-3.5 h-3.5 text-[#3da58a]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-45">
              Provide Project Scope
            </span>
            <textarea
              required
              rows={4}
              placeholder="Tell us about the scope, features, and key challenges..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full bg-[#050507]/40 border border-white/5 hover:border-white/10 focus:border-[#3da58a]/40 focus:outline-none transition-colors duration-300 rounded-xl p-4 text-xs font-mono text-[#eae5c9] placeholder-[#eae5c9]/20 resize-none leading-relaxed"
            />
            <button
              type="button"
              disabled={!formData.details.trim()}
              onClick={handleNext}
              className="py-4 px-6 rounded-xl border border-white/10 hover:border-[#3da58a]/40 bg-white/[0.01] hover:bg-[#3da58a]/5 transition-all duration-300 text-xs font-mono tracking-wider uppercase text-center disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/[0.01] cursor-pointer disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-45">
              Contact Information
            </span>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#050507]/40 border border-white/5 hover:border-white/10 focus:border-[#3da58a]/40 focus:outline-none transition-colors duration-300 rounded-xl px-4 py-3.5 text-xs font-mono text-[#eae5c9] placeholder-[#eae5c9]/20"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#050507]/40 border border-white/5 hover:border-white/10 focus:border-[#3da58a]/40 focus:outline-none transition-colors duration-300 rounded-xl px-4 py-3.5 text-xs font-mono text-[#eae5c9] placeholder-[#eae5c9]/20"
              />
            </div>
            <button
              type="submit"
              disabled={!formData.name.trim() || !formData.email.trim()}
              className="py-4 px-6 rounded-xl border border-[#3da58a]/30 hover:border-[#3da58a] bg-[#3da58a]/5 hover:bg-[#3da58a]/12 transition-all duration-300 text-xs font-mono tracking-wider uppercase text-center text-[#eae5c9] font-bold disabled:opacity-40 disabled:hover:border-[#3da58a]/30 disabled:hover:bg-[#3da58a]/5 cursor-pointer disabled:cursor-not-allowed mt-1"
            >
              Submit Project Brief
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="contact" className="py-28 md:py-36 w-full bg-[#040404] relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-white/[0.005] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-12 md:gap-20">
          
          {/* ── LEFT SIDE: Editorial details ── */}
          <div className="w-full md:w-[45%] flex flex-col justify-between py-2">
            <div>
              <span className="text-[10px] tracking-[0.45em] text-white/30 font-mono uppercase block mb-4">
                GET IN TOUCH
              </span>
              <h2
                className="text-4xl md:text-6xl font-normal text-white leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
              >
                Let&apos;s Build<br />Something<br /><span className="italic text-[#eae5c9]">Exceptional.</span>
              </h2>
            </div>

            <p className="text-sm md:text-base text-white/60 leading-relaxed font-light font-satoshi max-w-sm mt-8 md:mt-0">
              Describe the project and we will architect the solution. Our team translates high-level concepts into robust, premium production platforms.
            </p>
          </div>

          {/* ── RIGHT SIDE: Project Composer Wizard ── */}
          <div className="w-full md:w-[50%] flex flex-col">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 md:p-12 text-left flex flex-col justify-center h-full min-h-[360px] shadow-2xl relative"
              >
                <div className="w-9 h-9 rounded-full bg-[#3da58a]/10 border border-[#3da58a]/35 flex items-center justify-center mb-6">
                  <Check className="w-4 h-4 text-[#3da58a]" />
                </div>
                <h3
                  className="text-2xl md:text-3xl font-normal text-white leading-tight mb-4"
                  style={{ fontFamily: "var(--font-editorial), 'PP Editorial New', serif" }}
                >
                  Brief Configured.
                </h3>
                <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light font-satoshi max-w-md">
                  We have received your parameters and will review the specifications within 24 hours to draft your system blueprint. Let&apos;s build the future together.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 md:p-10 flex flex-col justify-between min-h-[380px] shadow-2xl relative"
              >
                {/* Wizard Header Status / Progress bar */}
                <div className="w-full mb-8">
                  <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-wider text-[#eae5c9]/40 mb-3">
                    <span>Project Composer</span>
                    <span className="text-[#eae5c9] opacity-80">
                      Step 0{currentStep + 1} / 05
                    </span>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                    <motion.div
                      initial={{ width: "20%" }}
                      animate={{ width: `${(currentStep + 1) * 20}%` }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 left-0 bg-[#3da58a]"
                    />
                  </div>
                </div>

                {/* Animated Form Slide Area */}
                <div className="my-auto py-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                    >
                      {renderStepContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Wizard Footer Controls */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5 w-full">
                  {/* Back button */}
                  <button
                    type="button"
                    disabled={currentStep === 0}
                    onClick={handleBack}
                    className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[#eae5c9]/45 hover:text-[#eae5c9] disabled:opacity-20 disabled:hover:text-[#eae5c9]/45 transition-colors duration-200 cursor-pointer disabled:cursor-default"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  {/* Summary / config tag preview */}
                  <div className="hidden sm:flex font-mono text-[8px] uppercase tracking-widest text-[#eae5c9]/30 max-w-[220px] truncate">
                    {formData.projectType ? `${formData.projectType}` : "None"}{" "}
                    {formData.timeline ? `· ${formData.timeline}` : ""}{" "}
                    {formData.budget ? `· ${formData.budget}` : ""}
                  </div>

                  {/* Explicit Next button (only enabled for steps that are select-based, if they have selection) */}
                  <button
                    type="button"
                    disabled={
                      (currentStep === 0 && !formData.projectType) ||
                      (currentStep === 1 && !formData.timeline) ||
                      (currentStep === 2 && !formData.budget) ||
                      currentStep >= 3 // steps 4 and 5 have explicit internal buttons
                    }
                    onClick={handleNext}
                    className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[#eae5c9]/45 hover:text-[#eae5c9] disabled:opacity-20 disabled:hover:text-[#eae5c9]/45 transition-colors duration-200 cursor-pointer disabled:cursor-default"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
