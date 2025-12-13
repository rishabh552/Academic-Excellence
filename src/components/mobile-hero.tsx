"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { MorphingText } from "@/components/ui/morphing-text";
import { BlackHoleEffect } from "@/components/ui/black-hole-effect";

interface MobileHeroProps {
    title?: string;
}

export function MobileHero({ title = "Academic Excellence" }: MobileHeroProps) {
    const words = ["Full Stack Web", "Machine Learning", "Deep Learning", "NLP Projects", "Mobile Apps"];

    return (
        <section
            id="mobile-hero"
            className="relative mx-auto w-full pt-36 pb-24 px-6 text-center md:pt-44 md:px-8 min-h-screen overflow-hidden bg-transparent"
        >
            {/* Canvas Black Hole Effect - High Performance Background */}
            <BlackHoleEffect />

            {/* Content Container - positioned above black hole */}
            <div className="relative z-10">
                {/* Eyebrow Badge - Semantic colors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link to="/start-project" className="group inline-block">
                        <span
                            className="text-sm text-muted-foreground font-medium mx-auto px-5 py-2 
                            bg-surface-elevated backdrop-blur-sm
                            border border-white/10 
                            rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center"
                        >
                            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse mr-2" />
                            Accepting Projects Spring 2025
                            <ChevronRight className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    </Link>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-balance 
                    bg-gradient-to-b from-white to-white/60 
                    bg-clip-text py-6 text-5xl font-bold leading-none tracking-tighter 
                    text-transparent sm:text-6xl md:text-7xl"
                >
                    {title}
                </motion.h1>

                {/* Subtitle with MorphingText */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12 text-balance 
                    text-lg tracking-tight text-muted-foreground 
                    md:text-xl"
                >
                    Expert assistance for{" "}
                    <span className="font-semibold text-brand-primary">
                        <MorphingText texts={words} />
                    </span>
                </motion.p>

                {/* CTA Buttons - Glass style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                >
                    <Link to="/start-project" className="w-full sm:w-auto">
                        <GlassButton
                            className="w-full sm:w-52 px-8 py-4 text-lg
                            bg-white/10 hover:bg-white/20 
                            border-white/30 text-white"
                        >
                            <span className="opacity-90 group-hover:opacity-100 transition-opacity">Start Project</span>
                            <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">→</span>
                        </GlassButton>
                    </Link>

                    <Link to="/showcase" className="w-full sm:w-auto">
                        <GlassButton
                            className="w-full sm:w-52 px-8 py-4 text-lg
                            bg-white/5 hover:bg-white/15 
                            border-white/20 text-white/80 hover:text-white"
                        >
                            View Showcase
                        </GlassButton>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

