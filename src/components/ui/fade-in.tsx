"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInOnScrollProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    yOffset?: number;
}

export function FadeInOnScroll({
    children,
    className,
    delay = 0,
    duration = 0.6,
    yOffset = 40
}: FadeInOnScrollProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: yOffset }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for smooth "apple-like" reveal
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
