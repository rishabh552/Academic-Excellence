"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import SpotlightCard from "./ui/spotlight-card";
import { GlassButton } from "./ui/glass-button";
import { GradientHeadline } from "./ui/gradient-headline";
import { Code2, Brain, Network, MessageSquare, Smartphone } from "lucide-react";

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      icon: <Code2 className="w-12 h-12 text-blue-500" />,
      title: "Full-Stack Web Apps",
      description: "Complete web applications built with modern stacks like MERN, Next.js, or Django. Responsive, scalable, and production-ready.",
      features: ["React/Next.js Frontends", "Node/Django Backends", "Database Integration", "Auth & Payments"],
    },
    {
      icon: <Brain className="w-12 h-12 text-purple-500" />,
      title: "Machine Learning",
      description: "Intelligent systems that learn from data. From regression models to complex classification systems.",
      features: ["Data Analysis", "Predictive Modeling", "Scikit-learn/Pandas", "Model Deployment"],
    },
    {
      icon: <Network className="w-12 h-12 text-pink-500" />,
      title: "Deep Learning",
      description: "Advanced neural networks for complex problems like image recognition and pattern detection.",
      features: ["CNNs & RNNs", "Computer Vision", "TensorFlow/PyTorch", "Model Optimization"],
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-orange-500" />,
      title: "NLP Projects",
      description: "Natural Language Processing solutions for text analysis, chatbots, and language understanding.",
      features: ["Sentiment Analysis", "Chatbots & LLMs", "Text Classification", "Language Translation"],
    },
    {
      icon: <Smartphone className="w-12 h-12 text-green-500" />,
      title: "Mobile Applications",
      description: "Native and cross-platform mobile apps for iOS and Android using React Native or Flutter.",
      features: ["Cross-platform Dev", "Native Performance", "API Integration", "App Store Ready"],
    },
  ];

  return (
    <section id="services" className="relative py-32 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="mb-6">
              <GradientHeadline text="Project Categories" className="text-4xl md:text-6xl" />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              We specialize in a wide range of academic and professional project domains.
            </motion.p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <SpotlightCard
                  className="h-full p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
                  spotlightColor="rgba(168, 85, 247, 0.2)"
                >
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon */}
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-8 leading-relaxed flex-grow">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Learn More Link */}
                    <div className="mt-auto">
                      <GlassButton className="w-full py-4 text-base">
                        View Details
                        <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </GlassButton>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
