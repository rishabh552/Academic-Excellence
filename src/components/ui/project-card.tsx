"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";
import { ArrowRight, Check, ExternalLink } from "lucide-react";

interface ProjectCardProps {
    title: string;
    description: string;
    category: string;
    image: string;
    features: string[];
    demoLink?: string;
    className?: string;
}

export function ProjectCard({
    title,
    description,
    category,
    image,
    features,
    demoLink,
    className,
}: ProjectCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position for 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for rotation
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
        stiffness: 150,
        damping: 20,
    });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
        stiffness: 150,
        damping: 20,
    });

    // Auto-rotation animation
    // We'll use a separate motion value for the continuous rotation
    // When hovered, we pause this by controlling the animate prop

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isFlipped) return; // Disable tilt when flipped to avoid confusion

        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        // Reset tilt when flipping
        x.set(0);
        y.set(0);
    };

    return (
        <div
            className={cn("relative h-[450px] w-full perspective-1000 group", className)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            <motion.div
                className="relative h-full w-full transition-all duration-500 transform-style-3d"
                style={{
                    rotateX: isFlipped ? 0 : rotateX,
                    rotateY: isFlipped ? 180 : rotateY,
                }}
                animate={{
                    rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                {/* FRONT FACE */}
                <div
                    className="absolute inset-0 h-full w-full backface-hidden rounded-3xl bg-white dark:bg-neutral-900 shadow-xl border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* Image Area with 3D Depth */}
                    <div className="relative h-3/5 overflow-hidden bg-gray-100 dark:bg-neutral-800 group-hover:shadow-inner transition-all">
                        <motion.div
                            className="w-full h-full"
                            animate={!isHovered && !isFlipped ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </motion.div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                        {/* Category Tag */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 text-xs font-bold tracking-wider text-white uppercase bg-black/30 backdrop-blur-md rounded-full border border-white/20">
                                {category}
                            </span>
                        </div>

                        {/* Floating 3D Element Hint */}
                        <div className="absolute bottom-4 right-4 text-white/80 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span>Click to flip</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 flex flex-col justify-between relative z-10 bg-white dark:bg-neutral-900">
                        <div>
                            <h3 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                                {title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <button
                            onClick={handleFlip}
                            className="mt-4 w-full py-2.5 rounded-xl bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white font-medium text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-gray-200 dark:border-neutral-700"
                        >
                            View Details
                        </button>
                    </div>
                </div>

                {/* BACK FACE */}
                <div
                    className="absolute inset-0 h-full w-full backface-hidden rounded-3xl bg-emerald-900/90 dark:bg-neutral-900 shadow-xl border border-emerald-500/30 dark:border-neutral-700 overflow-hidden p-8 flex flex-col text-white"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                    }}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-gray-900 to-black" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold font-poppins">{title}</h3>
                            <button
                                onClick={handleFlip}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </button>
                        </div>

                        <div className="flex-1">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-300 mb-4">
                                Key Features
                            </h4>
                            <ul className="space-y-3">
                                {features.map((feature, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={isFlipped ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.1 + idx * 0.1 }}
                                        className="flex items-start gap-3 text-sm text-gray-200"
                                    >
                                        <div className="mt-0.5 min-w-[16px]">
                                            <Check className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <span>{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/10">
                            {demoLink ? (
                                <a
                                    href={demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-all shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5"
                                >
                                    <span>Visit Project</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            ) : (
                                <button
                                    onClick={handleFlip}
                                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
                                >
                                    Back to Overview
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
