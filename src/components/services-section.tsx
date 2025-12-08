"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import SpotlightCard from "./ui/spotlight-card";
import { MagneticButton } from "./ui/magnetic-button";
import { GradientHeadline } from "./ui/gradient-headline";
import { Code2, Brain, Network, MessageSquare, Smartphone } from "lucide-react";

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      id: "web-development",
      icon: <Code2 className="w-12 h-12 text-brand-accent" />,
      title: "Full-Stack Web Apps",
      description: "Complete web applications built with modern stacks like MERN, Next.js, or Django. Responsive, scalable, and production-ready.",
      features: ["React/Next.js Frontends", "Node/Django Backends", "Database Integration", "Auth & Payments"],
    },
    {
      id: "machine-learning",
      icon: <Brain className="w-12 h-12 text-brand-primary" />,
      title: "Machine Learning",
      description: "Intelligent systems that learn from data. From regression models to complex classification systems.",
      features: ["Data Analysis", "Predictive Modeling", "Scikit-learn/Pandas", "Model Deployment"],
    },
    {
      id: "deep-learning",
      icon: <Network className="w-12 h-12 text-brand-secondary" />,
      title: "Deep Learning",
      description: "Advanced neural networks for complex problems like image recognition and pattern detection.",
      features: ["CNNs & RNNs", "Computer Vision", "TensorFlow/PyTorch", "Model Optimization"],
    },
    {
      id: "nlp",
      icon: <MessageSquare className="w-12 h-12 text-status-warning" />,
      title: "NLP Projects",
      description: "Natural Language Processing solutions for text analysis, chatbots, and language understanding.",
      features: ["Sentiment Analysis", "Chatbots & LLMs", "Text Classification", "Language Translation"],
    },
    {
      id: "mobile-apps",
      icon: <Smartphone className="w-12 h-12 text-status-success" />,
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
                className="h-full"
              >
                <SpotlightCard
                  className="h-full p-8 rounded-3xl bg-surface-elevated border border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  spotlightColor="rgba(139, 92, 246, 0.2)"
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
                          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Get Started Link */}
                    <div className="mt-auto pt-4 space-y-3">
                      <Link to={`/contact?service=${service.id}`}>
                        <MagneticButton className="w-full">
                          Get Started
                          <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </MagneticButton>
                      </Link>
                      <Link
                        to="/showcase"
                        className="flex items-center justify-center gap-2 w-full py-2 text-sm text-muted-foreground hover:text-brand-secondary transition-colors"
                      >
                        See Examples
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
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
