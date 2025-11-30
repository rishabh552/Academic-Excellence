"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import SpotlightCard from "./ui/spotlight-card";
import { GradientHeadline } from "./ui/gradient-headline";

export function ProjectShowcaseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = [
    {
      title: "E-Commerce Platform",
      category: "Full Stack Web",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      description: "A complete MERN stack e-commerce solution with Stripe payment integration, admin dashboard, and real-time inventory management.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      title: "Disease Prediction Model",
      category: "Machine Learning",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      description: "Advanced ML model achieving 98% accuracy in early disease detection using patient data. Includes comprehensive data visualization.",
      tech: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    },
    {
      title: "Smart Home Automation",
      category: "IoT & Mobile",
      image: "https://images.unsplash.com/photo-1558002038-109177381792?w=800&q=80",
      description: "Mobile application controlling IoT devices via MQTT protocol. Features voice control and automated scheduling.",
      tech: ["Flutter", "Firebase", "MQTT", "C++"],
    },
    {
      title: "Sentiment Analysis Tool",
      category: "NLP",
      image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80",
      description: "Real-time social media sentiment analysis tool processing thousands of tweets per second to gauge public opinion.",
      tech: ["Python", "NLTK", "TensorFlow", "React"],
    },
  ];

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section id="showcase" className="relative py-32 bg-transparent overflow-hidden">
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
              <GradientHeadline text="Project Showcase" className="text-4xl md:text-6xl" />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Explore some of the academic excellence we've delivered to students worldwide.
            </motion.p>
          </div>

          {/* Projects Carousel */}
          <div className="max-w-6xl mx-auto relative">
            <div className="relative min-h-[500px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <SpotlightCard
                    className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-neutral-800"
                    spotlightColor="rgba(16, 185, 129, 0.15)"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="h-64 md:h-auto overflow-hidden">
                        <img
                          src={projects[currentIndex].image}
                          alt={projects[currentIndex].title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wider text-sm uppercase mb-2">
                          {projects[currentIndex].category}
                        </span>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                          {projects[currentIndex].title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                          {projects[currentIndex].description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                          {projects[currentIndex].tech.map((tech) => (
                            <span key={tech} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={prevProject}
                className="w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white transition-all shadow-lg hover:shadow-xl"
              >
                ←
              </button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                      ? "bg-emerald-500 dark:bg-emerald-400 w-8"
                      : "bg-gray-300 dark:bg-neutral-700"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextProject}
                className="w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-white transition-all shadow-lg hover:shadow-xl"
              >
                →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
