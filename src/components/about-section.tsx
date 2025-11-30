"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import SpotlightCard from "./ui/spotlight-card";
import { GradientHeadline } from "./ui/gradient-headline";
import { Send, Code, CheckCircle } from "lucide-react";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "500+", label: "Projects Completed" },
    { value: "50+", label: "Expert Developers" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "Support Available" },
  ];

  const steps = [
    {
      icon: <Send className="w-5 h-5" />,
      title: "1. Submit Requirements",
      description: "Share your project topic, requirements, and deadline with us. We'll analyze it and provide a quote.",
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "2. Expert Development",
      description: "Once approved, our experts start building your project using the latest technologies and best practices.",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "3. Review & Delivery",
      description: "Receive the complete source code, documentation, and a detailed explanation session.",
    },
  ];

  return (
    <section id="process" className="relative py-32 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <GradientHeadline text="How It Works" className="text-4xl md:text-6xl" />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Get your project done in 3 simple steps. Hassle-free and on time.
            </motion.p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <SpotlightCard
                  className="text-center p-6 rounded-2xl bg-card shadow-xl border border-border"
                  spotlightColor="rgba(59, 130, 246, 0.15)"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                Streamlined Process
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We understand the pressure of academic deadlines. Our process is designed to be fast, transparent, and reliable.
              </p>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-1">{step.title}</h4>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80"
                  alt="Project Development"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl opacity-20 blur-2xl"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
