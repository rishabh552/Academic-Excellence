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

    // Use ref to track last snapped element to avoid redundant updates
    const lastSnapTargetRef = useRef<Element | null>(null);

    // Motion values for smooth cursor movement
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring configs
    const standardSpring = { damping: 25, stiffness: 300, mass: 0.5 };
    const snappySpring = { damping: 40, stiffness: 1500, mass: 0.1 };

    const cursorXSpring = useSpring(cursorX, standardSpring);
    const cursorYSpring = useSpring(cursorY, standardSpring);

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

    // Mouse enter/leave handler
    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);

    // Click handlers
    const handleMouseDown = useCallback(() => setIsClicking(true), []);
    const handleMouseUp = useCallback(() => setIsClicking(false), []);

    // Combined mouse move and element detection
    useEffect(() => {
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const { clientX, clientY } = e;

            // 1. Explicit Custom Cursor Attribute (Highest Priority)
            const cursorAttrElement = target.closest('[data-cursor]');
            const cursorAttr = cursorAttrElement?.getAttribute('data-cursor');
            if (cursorAttr) {
                // If data-cursor is "default", treat as no snap
                if (cursorAttr === "default") {
                    cursorX.set(clientX);
                    cursorY.set(clientY);
                    lastSnapTargetRef.current = null;
                    setCursorState({ variant: "default" });
                    if (!isVisible) setIsVisible(true);
                    return;
                }
                // Other custom cursor types
                cursorX.set(clientX);
                cursorY.set(clientY);
                lastSnapTargetRef.current = null;
                setCursorState({ variant: cursorAttr as CursorVariant });
                if (!isVisible) setIsVisible(true);
                return;
            }

            // 2. Explicit Text Cursor
            const cursorTextElement = target.closest('[data-cursor-text]');
            const cursorText = cursorTextElement?.getAttribute('data-cursor-text');
            if (cursorText) {
                cursorX.set(clientX);
                cursorY.set(clientY);
                lastSnapTargetRef.current = null;
                setCursorState({ variant: "text", text: cursorText });
                if (!isVisible) setIsVisible(true);
                return;
            }

            // 3. STRICT Button Snapping
            const explicitButton = target.closest('[data-cursor="button"]');
            const semanticButton = target.closest('button');
            const snapTarget = explicitButton || semanticButton;

            if (snapTarget) {
                const rect = snapTarget.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(snapTarget);

                // Update position to center of button
                cursorX.set(rect.left + rect.width / 2);
                cursorY.set(rect.top + rect.height / 2);

                // Only update state if target changed or rect might have changed
                if (lastSnapTargetRef.current !== snapTarget) {
                    lastSnapTargetRef.current = snapTarget;
                    setCursorState({
                        variant: "button",
                        rect: {
                            width: rect.width,
                            height: rect.height,
                            radius: computedStyle.borderRadius
                        }
                    });
                }
                if (!isVisible) setIsVisible(true);
                return;
            }

            // 4. Other Interactive Elements
            const isInteractive =
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.closest('a') ||
                target.closest('[data-cursor-hover]');

            // Not on a button, move cursor normally
            cursorX.set(clientX);
            cursorY.set(clientY);
            lastSnapTargetRef.current = null;
            setCursorState({ variant: isInteractive ? "hover" : "default" });
            if (!isVisible) setIsVisible(true);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isMobile, cursorX, cursorY, isVisible, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

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
                    width: isButton ? (cursorState.rect?.width || 0) + 8 : 32,
                    height: isButton ? (cursorState.rect?.height || 0) + 8 : 32,
                    borderRadius: isButton ? (cursorState.rect?.radius === '0px' ? '8px' : cursorState.rect?.radius || '8px') : "50%",
                }}
                transition={isButton ? snappySpring : standardSpring}
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
