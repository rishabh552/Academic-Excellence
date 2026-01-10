"use client";

import { motion } from "framer-motion";

interface ProcessCardProps {
    title: string;
    description: string;
    details?: string[];
    icon: React.ReactNode;
    index: number;
    position?: "left" | "right";
    delay?: number;
    status?: "completed" | "active" | "pending";
}

export function ProcessCard({
    title,
    description,
    details,
    icon,
    index,
    position = "left",
    delay = 0,
    status = "pending",
}: ProcessCardProps) {
    const isLeft = position === "left";

    // Status-based styling (dark.design inspired)
    const getStatusStyles = () => {
        switch (status) {
            case "completed":
                return {
                    borderGlow: "from-[#42D180]/20 via-[#42D180]/20 to-[#42D180]/20 hover:from-[#42D180]/40 hover:via-[#42D180]/40 hover:to-[#42D180]/40",
                    iconGradient: "from-[#42D180] to-emerald-600",
                    iconShadow: "neon-glow-success",
                    badgeGradient: "from-[#42D180]/20 to-emerald-600/20 border-[#42D180]/30",
                    badgeText: "from-[#42D180] to-emerald-400",
                    glowAccent: "from-[#42D180]/10 to-emerald-500/10"
                };
            case "active":
                return {
                    borderGlow: "from-blue-500/30 via-purple-500/30 to-blue-500/30 hover:from-blue-500/50 hover:via-purple-500/50 hover:to-blue-500/50",
                    iconGradient: "from-blue-500 to-purple-600",
                    iconShadow: "neon-glow-active",
                    badgeGradient: "from-[#F5A524]/20 to-amber-600/20 border-[#F5A524]/40",
                    badgeText: "from-[#F5A524] to-amber-400",
                    glowAccent: "from-blue-500/15 to-purple-500/15"
                };
            default: // pending
                return {
                    borderGlow: "from-gray-500/10 via-gray-500/10 to-gray-500/10 hover:from-gray-500/20 hover:via-gray-500/20 hover:to-gray-500/20",
                    iconGradient: "from-gray-600 to-gray-700",
                    iconShadow: "",
                    badgeGradient: "from-gray-600/20 to-gray-700/20 border-gray-500/20",
                    badgeText: "from-gray-400 to-gray-500",
                    glowAccent: "from-gray-500/5 to-gray-600/5"
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -100 : 100, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                type: "spring",
                stiffness: 80,
                damping: 12,
                delay,
                duration: 0.8,
            }}
            whileHover={{ scale: 1.03, y: -8 }}
            className="group relative"
        >
            {/* Animated gradient border wrapper with status-based neon glow */}
            <div className={`relative p-[2px] rounded-2xl bg-gradient-to-r ${styles.borderGlow} transition-all duration-500`}>
                {/* Card content with elevated background */}
                <div className="relative bg-[#1E1E1E]/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Floating gradient accent with status-based colors */}
                    <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${styles.glowAccent} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Icon with animation and status-based glow */}
                    <motion.div
                        initial={{ rotate: 0, scale: 1 }}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`w-14 h-14 md:w-16 md:h-16 mb-4 rounded-xl bg-gradient-to-br ${styles.iconGradient} flex items-center justify-center text-white shadow-lg ${styles.iconShadow} transition-all duration-300`}
                    >
                        <div className="scale-110">
                            {icon}
                        </div>
                    </motion.div>

                    {/* Step number badge with status-based colors */}
                    <div className={`absolute top-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br ${styles.badgeGradient} border flex items-center justify-center`}>
                        <span className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${styles.badgeText}`}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        {description}
                    </p>

                    {/* Details list */}
                    {details && details.length > 0 && (
                        <ul className="space-y-2 mt-4">
                            {details.map((detail, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start space-x-2 text-sm text-muted-foreground"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-1.5 flex-shrink-0" />
                                    <span>{detail}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Bottom gradient line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
                </div>
            </div>
        </motion.div>
    );
}
