"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GridBeamProps {
    className?: string;
    duration?: number;
    delay?: number;
    gridSize?: number;
    rows?: number;
    cols?: number;
    fullScreen?: boolean; // New prop to enable full-screen coverage
}

/**
 * Animated beam with visible grid background
 * Grid is always visible, beam animates along the path
 */
export const GridBeam: React.FC<GridBeamProps> = ({
    className,
    duration = 1.8,
    delay = 2,
    gridSize = 48, // 3rem = 48px
    rows: propRows,
    cols: propCols,
    fullScreen = false,
}) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const gradientId = React.useId().replace(/:/g, "");

    // Calculate grid dimensions based on viewport when fullScreen is true
    useEffect(() => {
        const updateDimensions = () => {
            if (fullScreen && typeof window !== 'undefined') {
                // Add 20% extra to ensure complete coverage with some overflow
                const viewportWidth = Math.ceil(window.innerWidth * 1.2);
                const viewportHeight = Math.ceil(window.innerHeight * 1.2);
                setDimensions({ width: viewportWidth, height: viewportHeight });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [fullScreen]);

    // Calculate rows and cols based on dimensions or use provided values
    const calculatedCols = fullScreen && dimensions.width > 0
        ? Math.ceil(dimensions.width / gridSize)
        : (propCols ?? 8);
    const calculatedRows = fullScreen && dimensions.height > 0
        ? Math.ceil(dimensions.height / gridSize)
        : (propRows ?? 6);

    const width = calculatedCols * gridSize;
    const height = calculatedRows * gridSize;

    // Generate grid lines
    const horizontalLines = Array.from({ length: calculatedRows + 1 }, (_, i) => i * gridSize);
    const verticalLines = Array.from({ length: calculatedCols + 1 }, (_, i) => i * gridSize);

    // Generate beam path (diagonal through grid)
    const beamPath = `M0 ${gridSize}h${width}M${gridSize} 0v${height}M${gridSize * 2} ${gridSize}h${width - gridSize * 2}`;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("absolute pointer-events-none", className)}
        >
            <title>Grid with Animated Beam</title>

            {/* Static visible grid lines */}
            {horizontalLines.map((y) => (
                <line
                    key={`h-${y}`}
                    x1={0}
                    y1={y}
                    x2={width}
                    y2={y}
                    stroke="#444"
                    strokeWidth={1}
                    opacity={0.6}
                />
            ))}
            {verticalLines.map((x) => (
                <line
                    key={`v-${x}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={height}
                    stroke="#444"
                    strokeWidth={1}
                    opacity={0.6}
                />
            ))}

            {/* Animated beam on top of grid */}
            <path
                d={beamPath}
                stroke={`url(#${gradientId})`}
                strokeWidth={2}
            />

            <defs>
                <motion.linearGradient
                    id={gradientId}
                    variants={{
                        initial: {
                            x1: "40%",
                            x2: "50%",
                            y1: "160%",
                            y2: "180%",
                        },
                        animate: {
                            x1: "0%",
                            x2: "10%",
                            y1: "-40%",
                            y2: "-20%",
                        },
                    }}
                    animate="animate"
                    initial="initial"
                    transition={{
                        duration,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "linear",
                        repeatDelay: delay,
                    }}
                >
                    <stop stopColor="#8b5cf6" stopOpacity="0" />
                    <stop stopColor="#8b5cf6" />
                    <stop offset="0.325" stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
                </motion.linearGradient>
            </defs>
        </svg>
    );
};

export default GridBeam;
