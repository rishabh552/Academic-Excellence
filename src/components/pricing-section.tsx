"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Sparkles, Zap, Crown } from "lucide-react";

type BillingCycle = "monthly" | "annually";

interface Feature {
  name: string;
  isIncluded: boolean;
}

interface PriceTier {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnually: number;
  isPopular: boolean;
  buttonLabel: string;
  features: Feature[];
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const FeatureItem: React.FC<{ feature: Feature; color: string }> = ({ feature, color }) => {
  const Icon = feature.isIncluded ? Check : X;
  return (
    <li className="flex items-center gap-3 py-1.5">
      <Icon
        className={cn(
          "h-4 w-4 flex-shrink-0",
          feature.isIncluded ? color : "text-muted-foreground/50"
        )}
      />
      <span
        className={cn(
          "text-sm",
          feature.isIncluded ? "text-foreground/80" : "text-muted-foreground"
        )}
      >
        {feature.name}
      </span>
    </li>
  );
};

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annually");

  const pricingTiers: [PriceTier, PriceTier, PriceTier] = [
    {
      id: "mini",
      name: "Mini Project",
      description: "Perfect for semester projects and basic requirements.",
      priceMonthly: 49,
      priceAnnually: 39,
      isPopular: false,
      buttonLabel: "Get Started",
      icon: <Sparkles className="w-6 h-6" />,
      color: "text-cyan-500",
      gradient: "from-cyan-500 to-blue-500",
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
      name: "Major Project",
      description: "Comprehensive solution for final year submissions.",
      priceMonthly: 149,
      priceAnnually: 119,
      isPopular: true,
      buttonLabel: "Choose Plan",
      icon: <Zap className="w-6 h-6" />,
      color: "text-violet-500",
      gradient: "from-violet-500 to-purple-500",
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
      priceMonthly: 299,
      priceAnnually: 249,
      isPopular: false,
      buttonLabel: "Contact Us",
      icon: <Crown className="w-6 h-6" />,
      color: "text-amber-500",
      gradient: "from-amber-500 to-orange-500",
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

  const allFeatures = Array.from(new Set(pricingTiers.flatMap((p) => p.features.map((f) => f.name))));

  return (
    <section id="pricing" className="relative min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3"
            >
              Pricing
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-3"
            >
              Choose the right plan for you
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto"
            >
              Transparent pricing with no hidden fees. Get exactly what you need.
            </motion.p>
          </div>

          {/* Billing Toggle - Modern with sliding indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-10"
          >
            <div className="relative inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10">
              {/* Sliding background indicator */}
              <motion.div
                className="absolute h-[calc(100%-8px)] rounded-full bg-white/10 backdrop-blur-sm"
                layoutId="billingToggle"
                initial={false}
                animate={{
                  x: billingCycle === "monthly" ? 4 : "calc(100% + 4px)",
                  width: billingCycle === "monthly" ? 85 : 95,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />

              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                  billingCycle === "monthly"
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annually")}
                className={cn(
                  "relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                  billingCycle === "annually"
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                Annually
              </button>

              {/* Discount badge */}
              <motion.span
                className="absolute -top-2 -right-2 text-[10px] font-bold text-white bg-gradient-to-r from-emerald-500 to-green-500 px-2 py-0.5 rounded-full shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                Save 20%
              </motion.span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {pricingTiers.map((plan, index) => {
              const currentPrice = billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnually;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={plan.isPopular ? "md:-mt-4 md:mb-4" : ""}
                >
                  <div
                    className={cn(
                      "relative h-full flex flex-col rounded-2xl transition-all duration-300",
                      plan.isPopular
                        ? "bg-gradient-to-b from-brand-primary/10 to-brand-secondary/5 border-2 border-brand-primary/50 shadow-xl shadow-brand-primary/20"
                        : "bg-surface-elevated border border-white/10 hover:border-brand-primary/20 hover:bg-surface-elevated/80"
                    )}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className={`px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${plan.gradient} rounded-full shadow-lg`}>
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          `bg-gradient-to-br ${plan.gradient} text-white shadow-lg`
                        )}>
                          {plan.icon}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {plan.name}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="flex-grow px-6 pb-4">
                      {/* Price with animation */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg text-muted-foreground">$</span>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={currentPrice}
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ duration: 0.2 }}
                              className={cn(
                                "text-4xl font-bold",
                                plan.isPopular
                                  ? `bg-clip-text text-transparent bg-gradient-to-r ${plan.gradient}`
                                  : "text-foreground"
                              )}
                            >
                              {currentPrice}
                            </motion.span>
                          </AnimatePresence>
                          <span className="text-sm text-muted-foreground">/project</span>
                        </div>
                        <AnimatePresence>
                          {billingCycle === "annually" && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-muted-foreground/70 mt-1 line-through"
                            >
                              ${plan.priceMonthly}/project
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Features */}
                      <ul className="space-y-0">
                        {plan.features.slice(0, 6).map((feature) => (
                          <FeatureItem key={feature.name} feature={feature} color={plan.color} />
                        ))}
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-0">
                      <Link to={`/contact?plan=${plan.id}`}>
                        <button
                          className={cn(
                            "w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200",
                            plan.isPopular
                              ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5`
                              : "bg-white/5 text-foreground hover:bg-white/10 border border-white/10"
                          )}
                        >
                          {plan.buttonLabel}
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="hidden md:block"
          >
            <h3 className="text-xl font-bold text-center text-white mb-6">
              Feature Comparison
            </h3>
            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Feature
                    </th>
                    {pricingTiers.map((plan) => (
                      <th
                        key={plan.id}
                        className={cn(
                          "px-6 py-4 text-center text-sm font-semibold text-slate-300",
                          plan.isPopular && "bg-violet-500/10"
                        )}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className={plan.color}>{plan.icon}</span>
                          {plan.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allFeatures.map((featureName, index) => (
                    <tr
                      key={featureName}
                      className={cn(
                        "transition-colors hover:bg-white/5",
                        index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                      )}
                    >
                      <td className="px-6 py-3 text-sm text-slate-300">{featureName}</td>
                      {pricingTiers.map((plan) => {
                        const feature = plan.features.find((f) => f.name === featureName);
                        const isIncluded = feature?.isIncluded ?? false;
                        const Icon = isIncluded ? Check : X;

                        return (
                          <td
                            key={`${plan.id}-${featureName}`}
                            className={cn(
                              "px-6 py-3 text-center",
                              plan.isPopular && "bg-violet-500/5"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5 mx-auto",
                                isIncluded ? plan.color : "text-slate-600"
                              )}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9 }}
            className="mt-12 text-center"
          >
            <p className="text-slate-400 text-sm">
              Need something custom?{" "}
              <Link to="/contact" className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
                Let's talk
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
