"use client";

import { ReactNode, useCallback, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

// Page order for swipe navigation
const pageOrder = [
    "/",
    "/services",
    "/process",
    "/showcase",
    "/pricing",
    "/contact"
];

// Pages that need zone-based swipe (have interactive content that shouldn't trigger nav)
// Currently empty - all pages use standard swipe sensitivity
const zoneBasedPages: string[] = [];

interface SwipeNavigationProps {
    children: ReactNode;
}

export function SwipeNavigation({ children }: SwipeNavigationProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const x = useMotionValue(0);
    const [canNavigate, setCanNavigate] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile/touch devices - only enable swipe on mobile
    useEffect(() => {
        const checkMobile = () => {
            // Check if screen is small (mobile breakpoint) or has touch capability
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
            setIsMobile(isTouchDevice && isSmallScreen);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Check if current page needs zone-based swipe
    const isZoneBasedPage = zoneBasedPages.includes(location.pathname);

    // Calculate opacity for edge indicators
    const leftIndicatorOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1]);
    const rightIndicatorOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

    const currentIndex = pageOrder.indexOf(location.pathname);

    const handleDragStart = useCallback(
        (event: MouseEvent | TouchEvent | PointerEvent) => {
            // For zone-based pages, use edge-based detection
            if (isZoneBasedPage) {
                // Get the starting X position
                let startX = 0;
                if ('touches' in event && event.touches.length > 0) {
                    startX = event.touches[0].clientX;
                } else if ('clientX' in event) {
                    startX = event.clientX;
                }

                const screenWidth = window.innerWidth;
                const edgeThreshold = 60; // px from edge

                // Allow swipe only if started from left or right edge
                const isFromLeftEdge = startX < edgeThreshold;
                const isFromRightEdge = startX > screenWidth - edgeThreshold;

                setCanNavigate(isFromLeftEdge || isFromRightEdge);
            } else {
                setCanNavigate(true);
            }
        },
        [isZoneBasedPage]
    );

    const handleDragEnd = useCallback(
        (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            // Don't navigate if swipe started in non-swipeable zone
            if (!canNavigate) {
                return;
            }

            const threshold = 100; // Minimum swipe distance
            const velocity = 500; // Minimum velocity for quick swipes

            // Check if swipe was fast enough or far enough
            const isSignificantSwipe =
                Math.abs(info.offset.x) > threshold ||
                Math.abs(info.velocity.x) > velocity;

            if (!isSignificantSwipe) {
                return;
            }

            // Determine direction
            const isSwipeLeft = info.offset.x < 0 || info.velocity.x < -velocity;
            const isSwipeRight = info.offset.x > 0 || info.velocity.x > velocity;

            if (isSwipeLeft && currentIndex < pageOrder.length - 1) {
                // Swipe left = go to next page
                navigate(pageOrder[currentIndex + 1]);
            } else if (isSwipeRight && currentIndex > 0) {
                // Swipe right = go to previous page
                navigate(pageOrder[currentIndex - 1]);
            }
        },
        [currentIndex, navigate, canNavigate]
    );

    // Check if we can navigate in each direction
    const canGoBack = currentIndex > 0;
    const canGoForward = currentIndex < pageOrder.length - 1;

    return (
        <div className="relative overflow-hidden">
            {/* Left edge indicator - only on mobile */}
            {isMobile && canGoBack && (
                <motion.div
                    className="fixed left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-blue-500/50 to-transparent z-50 pointer-events-none"
                    style={{ opacity: leftIndicatorOpacity }}
                />
            )}

            {/* Right edge indicator - only on mobile */}
            {isMobile && canGoForward && (
                <motion.div
                    className="fixed right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-purple-500/50 to-transparent z-50 pointer-events-none"
                    style={{ opacity: rightIndicatorOpacity }}
                />
            )}

            {/* Draggable content wrapper - only on mobile */}
            {isMobile ? (
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    style={{ x }}
                    className="touch-pan-y"
                >
                    {children}
                </motion.div>
            ) : (
                <div>{children}</div>
            )}
        </div>
    );
}

