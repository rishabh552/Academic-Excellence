"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

type CursorVariant = "default" | "hover" | "text" | "button";

interface CursorState {
    variant: CursorVariant;
    text?: string;
    rect?: { width: number; height: number; radius: string };
}

export function CustomCursor() {
    const [cursorState, setCursorState] = useState<CursorState>({ variant: "default" });
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(true);
    const [isClicking, setIsClicking] = useState(false);
    const trailRef = useRef<{ x: number; y: number }[]>([]);
    const rafRef = useRef<number>();

    // Motion values for smooth cursor movement
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Ultra-smooth spring
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Trail state
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
    const TRAIL_LENGTH = 4;
    const trailIdRef = useRef(0);

    // Check if device is mobile/touch
    useEffect(() => {
        const checkMobile = () => {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(isTouchDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mouse move handler
    const handleMouseMove = useCallback((e: MouseEvent) => {
        // If hovering a button, don't update position (snap logic handled in hover)
        if (cursorState.variant === 'button') return;

        const { clientX, clientY } = e;
        cursorX.set(clientX);
        cursorY.set(clientY);

        // Update trail
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            trailIdRef.current += 1;
            const lastPoint = trailRef.current[0];
            if (!lastPoint || Math.hypot(clientX - lastPoint.x, clientY - lastPoint.y) > 2) {
                trailRef.current = [
                    { x: clientX, y: clientY },
                    ...trailRef.current.slice(0, TRAIL_LENGTH - 1)
                ];
                setTrail(trailRef.current.map((pos, i) => ({ ...pos, id: trailIdRef.current - i })));
            }
        });

        if (!isVisible) setIsVisible(true);
    }, [cursorX, cursorY, isVisible, cursorState.variant]);

    // Mouse enter/leave handler
    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);

    // Click handlers
    const handleMouseDown = useCallback(() => setIsClicking(true), []);
    const handleMouseUp = useCallback(() => setIsClicking(false), []);

    // Hover detection
    useEffect(() => {
        if (isMobile) return;

        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // 1. Custom Cursor Attribute
            const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
            if (cursorAttr) {
                setCursorState({ variant: cursorAttr as CursorVariant });
                return;
            }

            // 2. Text Cursor
            const cursorText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
            if (cursorText) {
                setCursorState({ variant: "text", text: cursorText });
                return;
            }

            // 3. Button/Link Snapping (The "Cover Borders" Effect)
            const buttonTarget = target.closest('button') || target.closest('a.button-link'); // Specific class for links if needed, or just specific A tags
            // For now, let's grab BUTTONs and A tags with specific styling if possible.
            // But standard 'closest(button)' covers most interactive buttons.
            // Let's also check for 'a' that IS NOT a simple text link?
            // Simple heuristic: rect size.
            const btn = target.closest('button') || target.closest('[role="button"]');
            // Link as button? .closest('a') matching some class? 
            // Let's stick to explicit buttons + class based A tags if they exist.
            // Or just try closest('button') first.

            if (btn) {
                const rect = btn.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(btn);

                // Update position to center of button
                cursorX.set(rect.left + rect.width / 2);
                cursorY.set(rect.top + rect.height / 2);

                setCursorState({
                    variant: "button",
                    rect: {
                        width: rect.width,
                        height: rect.height,
                        radius: computedStyle.borderRadius
                    }
                });
                return;
            }

            // 4. Other Interactive Elements (Links that are just text)
            const isInteractive =
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.closest('a') ||
                target.closest('[data-cursor-hover]');

            setCursorState({ variant: isInteractive ? "hover" : "default" });
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleElementHover);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('resize', () => { });
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleElementHover);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isMobile, handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp, cursorX, cursorY]);

    if (isMobile) return null;

    const isButton = cursorState.variant === "button";
    const isHovering = cursorState.variant === "hover";
    const isText = cursorState.variant === "text";

    return (
        <>
            <style>{`
        @media (min-width: 768px) {
          *, *::before, *::after {
            cursor: none !important;
          }
        }
      `}</style>

            {/* Trail - Hide when snapping to button for cleanliness */}
            <AnimatePresence>
                {!isButton && trail.map((pos) => (
                    <motion.div
                        key={pos.id}
                        className="fixed pointer-events-none z-[9998]"
                        initial={{ opacity: 0.2, scale: 0.8 }}
                        animate={{
                            opacity: 0,
                            scale: 0.4,
                            x: pos.x,
                            y: pos.y,
                        }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        style={{
                            x: "-50%",
                            y: "-50%",
                            width: "12px",
                            height: "12px",
                            background: "rgba(34, 211, 238, 0.2)",
                            borderRadius: "50%",
                            filter: "blur(2px)",
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Main Cursor Wrapper */}
            <motion.div
                className="fixed pointer-events-none z-[9999] flex items-center justify-center"
                style={{
                    left: cursorXSpring,
                    top: cursorYSpring,
                    x: "-50%",
                    y: "-50%",
                }}
                animate={{
                    width: isButton ? (cursorState.rect?.width || 0) + 8 : 32, // +8 for padding
                    height: isButton ? (cursorState.rect?.height || 0) + 8 : 32,
                    borderRadius: isButton ? (cursorState.rect?.radius === '0px' ? '8px' : cursorState.rect?.radius || '8px') : "50%",
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                }}
            >
                {/* Button Overlay Glow Border */}
                {isButton && (
                    <motion.div
                        className="absolute inset-0 border-[1.5px] border-cyan-400/80 rounded-[inherit]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            boxShadow: "0 0 20px rgba(34, 211, 238, 0.4), inset 0 0 10px rgba(34, 211, 238, 0.1)"
                        }}
                    />
                )}

                {/* Text Label */}
                <AnimatePresence>
                    {isText && cursorState.text && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 24 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
                        >
                            <span className="px-2 py-1 bg-zinc-900/90 border border-white/10 rounded-md text-[10px] font-medium text-white tracking-widest uppercase shadow-xl backdrop-blur-sm">
                                {cursorState.text}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Standard Cursor Content (Hidden on button hover) */}
                {!isButton && (
                    <div className="relative flex items-center justify-center w-full h-full">

                        {/* Group: Crosshair Lines */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                opacity: isHovering || isText ? 0 : 1,
                                scale: isHovering || isText ? 0.5 : 1,
                                rotate: isHovering ? 90 : 0
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Horizontal */}
                            <div
                                className="absolute top-1/2 left-0 w-full h-[1.5px] -translate-y-1/2 rounded-full"
                                style={{
                                    background: "linear-gradient(90deg, transparent, #22D3EE 40%, #8b5cf6 60%, transparent)",
                                }}
                            />
                            {/* Vertical */}
                            <div
                                className="absolute left-1/2 top-0 w-[1.5px] h-full -translate-x-1/2 rounded-full"
                                style={{
                                    background: "linear-gradient(180deg, transparent, #22D3EE 40%, #8b5cf6 60%, transparent)",
                                }}
                            />
                        </motion.div>

                        {/* Group: Diamond (Hover Only) */}
                        <motion.div
                            className="absolute border-[1.5px] border-cyan-400 rounded-sm"
                            initial={{ scale: 0, opacity: 0, rotate: 45 }}
                            animate={{
                                scale: (isHovering || isText) ? (isClicking ? 0.8 : 1) : 0,
                                opacity: (isHovering || isText) ? 1 : 0,
                                rotate: (isHovering || isText) ? 225 : 45
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            style={{
                                width: "16px",
                                height: "16px",
                                boxShadow: "0 0 10px rgba(34, 211, 238, 0.5)"
                            }}
                        />
                    </div>
                )}
            </motion.div>
        </>
    );
}
