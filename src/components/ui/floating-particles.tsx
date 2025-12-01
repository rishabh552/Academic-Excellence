"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    color: string;
}

export function FloatingParticles() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for mouse tracking
    const springConfig = { damping: 25, stiffness: 100 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Generate particles
        const generatedParticles: Particle[] = [];
        const colors = [
            "rgba(102, 126, 234, 0.4)",  // Blue
            "rgba(118, 75, 162, 0.4)",   // Purple
            "rgba(34, 211, 238, 0.3)",   // Cyan
            "rgba(66, 209, 128, 0.3)",   // Success green
        ];

        for (let i = 0; i < 20; i++) {
            generatedParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 60 + 20, // 20-80px
                duration: Math.random() * 10 + 15, // 15-25s
                delay: Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        setParticles(generatedParticles);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
            onMouseMove={handleMouseMove}
        >
            {/* Floating particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full blur-xl"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        background: particle.color,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, 50, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Mouse-follow gradient spotlight */}
            <motion.div
                className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)",
                    x: smoothMouseX,
                    y: smoothMouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />
        </div>
    );
}
