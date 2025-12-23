"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GradientHeadlineProps {
    text: string;
    className?: string;
}

export function GradientHeadline({
    text,
    className,
}: GradientHeadlineProps) {
    return (
        <div className="flex justify-center">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "text-4xl md:text-6xl font-bold tracking-tight text-center bg-clip-text text-transparent pb-2",
                    className
                )}
                style={{ 
                    backgroundImage: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 25%, #60a5fa 50%, #3b82f6 75%, #1d4ed8 100%)',
                    backgroundSize: '200% auto',
                    animation: 'gradient-shift 6s ease-in-out infinite'
                }}
            >
                {text}
            </motion.h2>
            <style>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% center; }
                    50% { background-position: 100% center; }
                }
            `}</style>
        </div>
    );
}
