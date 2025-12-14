"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Black Hole Effect - Enhanced Visual Impact
 * 
 * Features:
 * - Glow trail on paths (CSS filter blur)
 * - Pulsing core animation
 * - Varied path thickness (thicker at start, thinner at center)
 * - 25 paths with Bezier spiral curves
 * - GPU-optimized CSS animations
 */

const CENTER_X = 348;
const CENTER_Y = 158;

// Generate paths with varied thickness based on index
const generatePath = (angle: number, radiusOffset: number): string => {
    const startRadius = 280 + radiusOffset * 80;
    const startX = CENTER_X + startRadius * Math.cos(angle);
    const startY = CENTER_Y + startRadius * Math.sin(angle) * 0.5;

    const twist = Math.PI / 2 + radiusOffset * 0.3;
    const cp1Angle = angle - twist;
    const cp1Radius = startRadius * 0.7;
    const cp1x = CENTER_X + cp1Radius * Math.cos(cp1Angle);
    const cp1y = CENTER_Y + cp1Radius * Math.sin(cp1Angle) * 0.6;

    const cp2Angle = angle - twist / 2;
    const cp2Radius = startRadius * 0.3;
    const cp2x = CENTER_X + cp2Radius * Math.cos(cp2Angle);
    const cp2y = CENTER_Y + cp2Radius * Math.sin(cp2Angle) * 0.8;

    return `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${CENTER_X} ${CENTER_Y}`;
};

// Pre-generate 25 paths with varied thickness
interface PathData {
    d: string;
    delay: number;
    opacity: number;
    thickness: number; // Varied thickness
}

const PATHS: PathData[] = [];

for (let i = 0; i < 25; i++) {
    const angle = (i / 25) * Math.PI * 2;
    const radiusOffset = (i % 5) / 5;
    PATHS.push({
        d: generatePath(angle, radiusOffset),
        delay: (i / 25) * 10,
        opacity: 0.2 + (i % 3) * 0.1,
        thickness: 0.3 + (i % 4) * 0.2, // Varies from 0.3 to 0.9
    });
}



export function BlackHoleEffect() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Pause animations when off-screen
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                setIsPaused(!entries[0].isIntersecting);
            },
            { threshold: 0, rootMargin: "50px" }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 pointer-events-none ${isPaused ? 'bh-paused' : ''}`}
            style={{
                willChange: 'contents',
                transform: 'translateZ(0)',
            }}
        >
            <svg
                className="w-full h-full"
                viewBox="0 0 696 316"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
                style={{ willChange: 'transform' }}
            >
                <title>Black Hole Effect</title>

                {/* Gradient definitions */}
                <defs>
                    {/* Core gradient */}
                    <radialGradient id="bhCoreGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#000" />
                        <stop offset="40%" stopColor="rgba(10,10,20,0.95)" />
                        <stop offset="70%" stopColor="rgba(30,30,60,0.4)" />
                        <stop offset="100%" stopColor="rgba(15,23,42,0)" />
                    </radialGradient>

                    {/* Glow filter for paths */}
                    <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Pulse glow filter for core */}
                    <filter id="pulseGlow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Pulsing outer glow ring */}
                <circle
                    cx={CENTER_X}
                    cy={CENTER_Y}
                    r="55"
                    fill="none"
                    stroke="rgba(100, 120, 180, 0.3)"
                    strokeWidth="2"
                    filter="url(#pulseGlow)"
                    className="pulse-ring"
                />

                {/* Central black hole with gradient */}
                <circle cx={CENTER_X} cy={CENTER_Y} r="50" fill="url(#bhCoreGradient)" />

                {/* Pulsing inner core */}
                <circle
                    cx={CENTER_X}
                    cy={CENTER_Y}
                    r="8"
                    fill="#000"
                    className="pulse-core"
                />

                {/* Vortex paths with glow and varied thickness */}
                <g filter="url(#glowFilter)">
                    {PATHS.map((path, i) => (
                        <path
                            key={i}
                            d={path.d}
                            stroke="rgba(180, 200, 240, 0.8)"
                            strokeWidth={path.thickness}
                            strokeOpacity={path.opacity}
                            strokeLinecap="round"
                            fill="none"
                            className="vortex-path"
                            style={{
                                animationDelay: `${path.delay}s`,
                            }}
                        />
                    ))}
                </g>
            </svg>

            {/* CSS animations */}
            <style>{`
                .vortex-path {
                    stroke-dasharray: 600;
                    stroke-dashoffset: 600;
                    animation: vortexDraw 10s linear infinite;
                    will-change: stroke-dashoffset, opacity;
                }
                
                @keyframes vortexDraw {
                    0% {
                        stroke-dashoffset: 600;
                        opacity: 0;
                    }
                    8% {
                        opacity: 1;
                    }
                    85% {
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 0;
                    }
                }
                
                .pulse-core {
                    animation: corePulse 3s ease-in-out infinite;
                }
                
                @keyframes corePulse {
                    0%, 100% {
                        r: 6;
                        opacity: 1;
                    }
                    50% {
                        r: 10;
                        opacity: 0.8;
                    }
                }
                
                .pulse-ring {
                    animation: ringPulse 4s ease-in-out infinite;
                }
                
                @keyframes ringPulse {
                    0%, 100% {
                        opacity: 0.2;
                        stroke-width: 1;
                    }
                    50% {
                        opacity: 0.5;
                        stroke-width: 3;
                    }
                }

                /* Pause animations when off-screen */
                .bh-paused .vortex-path,
                .bh-paused .pulse-core,
                .bh-paused .pulse-ring {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
