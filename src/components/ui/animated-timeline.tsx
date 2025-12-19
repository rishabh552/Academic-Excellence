"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineNodeProps {
    status: "completed" | "active" | "pending";
    icon?: React.ReactNode;
}

export function TimelineNode({ status, icon }: TimelineNodeProps) {
    const baseClasses = "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500";

    const statusClasses = {
        completed: "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400 shadow-lg shadow-blue-500/50",
        active: "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 shadow-xl shadow-blue-600/60 scale-110",
        pending: "bg-card border-border",
    };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: status === "active" ? 1.1 : 1,
                opacity: 1
            }}
            transition={{
                duration: 0.5,
                scale: {
                    repeat: status === "active" ? 3 : 0,
                    repeatType: "reverse",
                    duration: 1.5,
                }
            }}
            className={cn(baseClasses, statusClasses[status])}
        >
            {status === "completed" ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
            ) : icon ? (
                <div className={cn(
                    status === "pending" ? "text-muted-foreground" : "text-white"
                )}>
                    {icon}
                </div>
            ) : (
                <div className={cn(
                    "w-3 h-3 rounded-full",
                    status === "active" ? "bg-white" : "bg-muted-foreground"
                )} />
            )}
        </motion.div>
    );
}

interface TimelineLineProps {
    active?: boolean;
    className?: string;
}

export function TimelineLine({ active = false, className }: TimelineLineProps) {
    return (
        <div className={cn("relative w-0.5 bg-border", className)}>
            <motion.div
                initial={{ height: "0%" }}
                animate={{ height: active ? "100%" : "0%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-b from-blue-500 to-purple-500"
            />
        </div>
    );
}

interface AnimatedTimelineProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedTimeline({ children, className }: AnimatedTimelineProps) {
    return (
        <div className={cn("relative", className)}>
            {children}
        </div>
    );
}
