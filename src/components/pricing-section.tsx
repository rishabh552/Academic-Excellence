"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface Feature {
  name: string;
  isIncluded: boolean;
}

interface PriceTier {
  id: string;
  name: string;
  description: string;
  price: string | number;
  priceSuffix?: string;
  isPopular: boolean;
  buttonLabel: string;
  features: Feature[];
  icon: React.ReactNode;
  color: string;
  gradient: string;
  glowColor: string;
  buttonGradient: string;
  cardGradient: string;
  hoverBorder: string;
}

const FeatureItem: React.FC<{ feature: Feature; color: string }> = ({ feature, color }) => {
  const Icon = feature.isIncluded ? Check : X;
  return (
    <li className="flex items-center gap-3 py-2">
      <div className={cn(
        "flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10",
        feature.isIncluded ? "text-primary" : "text-muted-foreground/40"
      )}>
        <Icon
          className={cn(
            "h-3 w-3",
            feature.isIncluded ? color : "text-muted-foreground/40"
          )}
        />
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          feature.isIncluded ? "text-slate-200" : "text-muted-foreground/60"
        )}
      >
        {feature.name}
      </span>
    </li>
  );
};

const MiniLogo = () => (
  <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" className="fill-slate-800/50 stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 14L24 24L42 14" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 44V24" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 24L32 29M24 24L16 29" className="stroke-slate-400/50" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MajorLogo = () => (
  <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <path d="M8 38H40V42H8V38Z" className="fill-amber-500/20 stroke-amber-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 38L4 16L16 24L24 8L32 24L44 16L40 38H8Z" className="fill-amber-500/10 stroke-amber-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="18" r="3" className="fill-amber-200" />
    <circle cx="16" cy="24" r="2" className="fill-amber-300" />
    <circle cx="32" cy="24" r="2" className="fill-amber-300" />
  </svg>
);

const ResearchLogo = () => (
  <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <circle cx="24" cy="24" r="6" className="fill-fuchsia-400/30 stroke-fuchsia-300" strokeWidth="2" />
    <ellipse cx="24" cy="24" rx="18" ry="8" className="stroke-fuchsia-400/60" strokeWidth="1.5" transform="rotate(45 24 24)" />
    <ellipse cx="24" cy="24" rx="18" ry="8" className="stroke-purple-400/60" strokeWidth="1.5" transform="rotate(-45 24 24)" />
    <ellipse cx="24" cy="24" rx="18" ry="8" className="stroke-indigo-400/60" strokeWidth="1.5" />
    <circle cx="38" cy="10" r="2" className="fill-fuchsia-300 animate-pulse" />
  </svg>
);

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const pricingTiers: [PriceTier, PriceTier, PriceTier] = [
    {
      id: "mini",
      name: "Basic",
      description: "Perfect for semester projects and basic requirements.",
      price: "2,000",
      priceSuffix: "Starting Price",
      isPopular: false,
      buttonLabel: "Get Started",
      icon: <MiniLogo />,
      color: "text-slate-200",
      gradient: "from-slate-300 via-slate-100 to-slate-300",
      buttonGradient: "from-slate-800 to-slate-950 hover:from-slate-700 hover:to-slate-900",
      glowColor: "group-hover:shadow-[0_0_20px_-5px_rgba(148,163,184,0.5)]",
      cardGradient: "bg-[#050505]",
      hoverBorder: "group-hover:from-slate-400 group-hover:via-slate-200 group-hover:to-slate-400",
      features: [
        { name: "Complete Source Code", isIncluded: true },
        { name: "Basic Documentation", isIncluded: true },
        { name: "Setup Instructions", isIncluded: true },
        { name: "3 Days Delivery", isIncluded: true },
        { name: "Standard Support", isIncluded: true },
        { name: "Project Report", isIncluded: false },
        { name: "PPT Presentation", isIncluded: false },
        { name: "Video Walkthrough", isIncluded: false },
      ],
    },
    {
      id: "major",
      name: "Professional",
      description: "Comprehensive solution for final year submissions.",
      price: "3,000",
      isPopular: true,
      buttonLabel: "Choose Plan",
      icon: <MajorLogo />,
      color: "text-amber-300",
      gradient: "from-amber-300 via-yellow-200 to-amber-400",
      buttonGradient: "from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800",
      glowColor: "group-hover:shadow-[0_0_25px_-5px_rgba(251,191,36,0.6)]",
      cardGradient: "bg-[#050505]",
      hoverBorder: "group-hover:from-amber-400 group-hover:via-yellow-200 group-hover:to-amber-400",
      features: [
        { name: "Complete Source Code", isIncluded: true },
        { name: "Basic Documentation", isIncluded: true },
        { name: "Setup Instructions", isIncluded: true },
        { name: "1 Week Delivery", isIncluded: true },
        { name: "Priority Support", isIncluded: true },
        { name: "Project Report", isIncluded: true },
        { name: "PPT Presentation", isIncluded: true },
        { name: "Video Walkthrough", isIncluded: true },
      ],
    },
    {
      id: "research",
      name: "Research / Custom",
      description: "For complex research papers and unique requirements.",
      price: "5,000+",
      priceSuffix: "varies by complexity",
      isPopular: false,
      buttonLabel: "Contact Us",
      icon: <ResearchLogo />,
      color: "text-fuchsia-300",
      gradient: "from-fuchsia-400 via-purple-300 to-indigo-400",
      buttonGradient: "from-fuchsia-800 to-purple-950 hover:from-fuchsia-700 hover:to-purple-900",
      glowColor: "group-hover:shadow-[0_0_20px_-5px_rgba(232,121,249,0.5)]",
      cardGradient: "bg-[#050505]",
      hoverBorder: "group-hover:from-fuchsia-400 group-hover:via-purple-200 group-hover:to-fuchsia-400",
      features: [
        { name: "Complete Source Code", isIncluded: true },
        { name: "Research Implementation", isIncluded: true },
        { name: "Novel Algorithms", isIncluded: true },
        { name: "Custom Timeline", isIncluded: true },
        { name: "1-on-1 Explanations", isIncluded: true },
        { name: "Project Report", isIncluded: true },
        { name: "PPT Presentation", isIncluded: true },
        { name: "Conference Quality", isIncluded: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-2 shadow-lg"
            >
              <span className="text-xs font-bold tracking-[0.2em] bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent uppercase font-heading">
                Premium Tiers
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight font-heading"
            >
              Excellence <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">Simplified</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed font-light"
            >
              Choose the perfect package for your academic needs. No hidden fees, just absolute quality.
            </motion.p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {pricingTiers.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={cn(
                  "relative group perspective-1000",
                  plan.isPopular ? "md:-mt-8" : ""
                )}
              >
                <div
                  className={cn(
                    "relative h-full flex flex-col rounded-[2rem] p-[1px] transition-all duration-500",
                    "bg-gradient-to-b from-white/10 via-white/5 to-transparent", // Default border state
                    plan.hoverBorder, // Inject hover border colors
                    // Removed extra backdrop blur on border container to prevent fuzziness
                    plan.isPopular
                      ? "shadow-[0_0_40px_-10px_rgba(251,191,36,0.3)]" // Tighter Popular Shadow
                      : "hover:shadow-none", // Reset default hover shadow
                    plan.glowColor // Apply specific outline glow
                  )}
                >
                  {/* Card Content Container */}
                  <div className={cn(
                    "h-full flex flex-col rounded-[1.95rem] p-8 relative overflow-hidden transition-colors",
                    plan.cardGradient
                  )}>

                    {/* Inner Noise/Texture could go here if needed, but keeping it simple as requested */}

                    {/* Popular Badge */}
                    {plan.isPopular && (
                      <div className="absolute top-0 left-0 right-0 flex justify-center -mt-px">
                        <div className="bg-[#0A0A0A] px-4 pt-1 pb-2 rounded-b-xl border-b border-x border-amber-500/30">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest font-heading">
                            Most Popular
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Icon & Title */}
                    <div className="mb-8 relative z-10">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110",
                        "bg-[#151515] border border-white/10 shadow-inner"
                      )}>
                        <div className={cn("bg-clip-text text-transparent bg-gradient-to-br", plan.gradient)}>
                          {plan.icon}
                        </div>
                      </div>
                      <h3 className={cn(
                        "text-3xl font-bold mb-3 font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-br",
                        plan.gradient
                      )}>
                        {plan.name}
                      </h3>
                      <p className="text-base text-slate-400 font-light leading-relaxed min-h-[48px]">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className={cn(
                      "mb-8 p-6 rounded-2xl bg-white/5 border border-white/5 relative hover:border-white/10 transition-colors",
                      plan.priceSuffix ? "pb-8" : ""
                    )}>
                      <div className="flex items-start gap-1">
                        <span className="text-2xl text-slate-500 font-serif italic mt-1">₹</span>
                        <span className="text-6xl font-bold text-white tracking-tighter font-heading leading-none">
                          {plan.price}
                        </span>
                        {!plan.priceSuffix && (
                          <span className="text-sm text-slate-500 font-medium self-end mb-2 uppercase tracking-wider">
                            / project
                          </span>
                        )}
                      </div>
                      {plan.priceSuffix && (
                        <div className="absolute bottom-3 left-6 text-xs text-slate-400/80 uppercase tracking-widest font-medium">
                          {plan.priceSuffix}
                        </div>
                      )}
                    </div>

                    {/* Separator */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                    {/* Features */}
                    <ul className="space-y-4 mb-10 flex-grow">
                      {plan.features.map((feature) => (
                        <FeatureItem key={feature.name} feature={feature} color={plan.color} />
                      ))}
                    </ul>

                    {/* Action Button */}
                    <Link to={`/contact?plan=${plan.id}`} className="mt-auto relative z-10">
                      <button
                        className={cn(
                          "w-full py-4 px-6 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 font-heading",
                          "bg-gradient-to-r text-white shadow-lg hover:-translate-y-1 transform active:translate-y-0 active:shadow-md",
                          plan.buttonGradient,
                          plan.isPopular ? "shadow-amber-500/20 hover:shadow-amber-500/40" : "shadow-slate-900/20 hover:shadow-slate-500/10"
                        )}
                      >
                        {plan.buttonLabel}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-12 max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0A] p-8 md:p-12 text-center">
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0A0A0A] to-[#0A0A0A] opacity-50" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-left max-w-xl">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-heading">
                    Need a Custom Research Solution?
                  </h3>
                  <p className="text-slate-400 text-lg font-light leading-relaxed">
                    For PhD work, complex algorithms, or university-specific requirements, let's discuss a tailored plan.
                  </p>
                </div>

                <Link to="/contact">
                  <button className="px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-sm tracking-widest uppercase transition-colors shadow-lg hover:shadow-white/20 whitespace-nowrap">
                    Contact Expert Team
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
