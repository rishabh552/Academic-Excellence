"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

type TColorProp = string | string[];

interface ShineBorderProps {
    borderRadius?: number;
    borderWidth?: number;
    duration?: number;
    color?: TColorProp;
    className?: string;
    children: React.ReactNode;
}

/**
 * @name Shine Border
 * @description Animated border effect using GSAP for smooth, reliable animations.
 */
function ShineBorder({
    borderRadius = 8,
    borderWidth = 2,
    duration = 3,
    color = "#6366f1",
    className,
    children,
}: ShineBorderProps) {
    const shineRef = useRef<HTMLDivElement>(null);
    const colorString = color instanceof Array ? color[0] : color;

    useEffect(() => {
        if (!shineRef.current) return;

        // Create infinite rotating gradient animation with GSAP
        const tl = gsap.timeline({ repeat: -1, ease: "none" });

        tl.to(shineRef.current, {
            rotation: 360,
            duration: duration,
            ease: "none",
        });

        return () => {
            tl.kill();
        };
    }, [duration]);

    return (
        <div
            className={cn(
                "relative grid h-full w-full place-items-center overflow-hidden",
                className,
            )}
            style={{
                borderRadius: `${borderRadius}px`,
            }}
        >
            {/* Rotating gradient border */}
            <div
                ref={shineRef}
                className="absolute inset-[-50%] z-0"
                style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, ${colorString} 60deg, transparent 120deg, transparent 360deg)`,
                    filter: `blur(4px)`,
                }}
            />

            {/* Inner mask to create border effect */}
            <div
                className="absolute z-10"
                style={{
                    inset: `${borderWidth}px`,
                    borderRadius: `${borderRadius - borderWidth}px`,
                    background: "rgba(15, 17, 26, 0.98)",
                }}
            />

            {/* Content */}
            <div className="relative z-20 w-full h-full">
                {children}
            </div>
        </div>
    );
}

export { ShineBorder };
