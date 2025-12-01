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
                style={{ backgroundImage: 'linear-gradient(to right, var(--gradient-start), var(--gradient-middle), var(--gradient-end))' }}
            >
                {text}
            </motion.h2>
        </div>
    );
}
