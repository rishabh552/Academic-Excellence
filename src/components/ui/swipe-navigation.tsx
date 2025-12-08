"use client";

import { ReactNode, useCallback, useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

// Page order for swipe navigation
const pageOrder = [
    "/",
    "/services",
    "/process",
    "/showcase",
    "/case-studies",
    "/pricing",
    "/contact"
];

// Pages that need zone-based swipe (have interactive content that shouldn't trigger nav)
const zoneBasedPages = ["/showcase"];

interface SwipeNavigationProps {
    children: ReactNode;
}

export function SwipeNavigation({ children }: SwipeNavigationProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const x = useMotionValue(0);
    const [canNavigate, setCanNavigate] = useState(true);

    // Check if current page needs zone-based swipe
    const isZoneBasedPage = zoneBasedPages.includes(location.pathname);

    // Calculate opacity for edge indicators
    const leftIndicatorOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1]);
    const rightIndicatorOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);

    const currentIndex = pageOrder.indexOf(location.pathname);

    const handleDragStart = useCallback(
        (event: MouseEvent | TouchEvent | PointerEvent) => {
            // For zone-based pages, check if swipe started in a swipeable zone
            if (isZoneBasedPage) {
                const target = event.target as HTMLElement;
                // Check if the target or any parent has data-swipeable attribute
                const swipeableZone = target.closest('[data-swipeable="true"]');
                // Check if the target is inside a no-swipe zone (like the gallery)
                const noSwipeZone = target.closest('[data-no-swipe="true"]');

                // Allow swipe only if in swipeable zone and not in no-swipe zone
                setCanNavigate(!!swipeableZone && !noSwipeZone);
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
            {/* Left edge indicator */}
            {canGoBack && (
                <motion.div
                    className="fixed left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-blue-500/50 to-transparent z-50 pointer-events-none md:hidden"
                    style={{ opacity: leftIndicatorOpacity }}
                />
            )}

            {/* Right edge indicator */}
            {canGoForward && (
                <motion.div
                    className="fixed right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-purple-500/50 to-transparent z-50 pointer-events-none md:hidden"
                    style={{ opacity: rightIndicatorOpacity }}
                />
            )}

            {/* Draggable content wrapper - only on mobile */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                style={{ x }}
                className="touch-pan-y md:!transform-none"
            >
                {children}
            </motion.div>
        </div>
    );
}
