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
                    "text-4xl md:text-6xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 pb-2",
                    className
                )}
            >
                {text}
            </motion.h2>
        </div>
    );
}
