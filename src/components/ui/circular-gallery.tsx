import React, { useState, useEffect, useRef, HTMLAttributes, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Check, ArrowRight, ExternalLink, X } from "lucide-react";

// Define the type for a single gallery item
export interface GalleryItem {
    common: string;
    binomial: string;
    description?: string;
    features?: string[];
    photo: {
        url: string;
        text: string;
        pos?: string;
        by: string;
    };
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
    items: GalleryItem[];
    /** Controls how far the items are from the center. */
    radius?: number;
    /** Controls the speed of auto-rotation when not scrolling. */
    autoRotateSpeed?: number;
    /** Width of individual items */
    itemWidth?: number;
    /** Height of individual items */
    itemHeight?: number;
    /** Callback when a card is clicked for expansion */
    onCardExpand?: (item: GalleryItem) => void;
    /** Callback when active index changes */
    onActiveIndexChange?: (index: number) => void;
}

// Color schemes for different project types
const colorSchemes: Record<string, { badge: string; accent: string; border: string }> = {
    'Full Stack Web': { badge: 'bg-blue-500', accent: 'text-blue-400', border: 'border-blue-500/30' },
    'Machine Learning': { badge: 'bg-purple-500', accent: 'text-purple-400', border: 'border-purple-500/30' },
    'Deep Learning': { badge: 'bg-pink-500', accent: 'text-pink-400', border: 'border-pink-500/30' },
    'Mobile Application': { badge: 'bg-orange-500', accent: 'text-orange-400', border: 'border-orange-500/30' },
    'NLP': { badge: 'bg-cyan-500', accent: 'text-cyan-400', border: 'border-cyan-500/30' },
    'Frontend': { badge: 'bg-emerald-500', accent: 'text-emerald-400', border: 'border-emerald-500/30' },
    'Productivity': { badge: 'bg-amber-500', accent: 'text-amber-400', border: 'border-amber-500/30' },
    'FinTech': { badge: 'bg-indigo-500', accent: 'text-indigo-400', border: 'border-indigo-500/30' },
};

const getColorScheme = (binomial: string) => {
    return colorSchemes[binomial] || { badge: 'bg-emerald-500', accent: 'text-emerald-400', border: 'border-emerald-500/30' };
};

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
    ({ items, className, radius = 500, autoRotateSpeed = 0.3, itemWidth = 280, itemHeight = 400, onCardExpand, onActiveIndexChange, ...props }, ref) => {
        // Use state only for values that need to trigger re-renders
        const [rotation, setRotation] = useState(0);
        const [isPaused, setIsPaused] = useState(false);
        const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
        const [activeIndex, setActiveIndex] = useState(0);

        // Use refs for animation values to avoid re-render loops
        const targetRotationRef = useRef(0);
        const lastTimeRef = useRef<number>(0);
        const animationFrameRef = useRef<number | null>(null);
        const isDraggingRef = useRef(false);
        const lastXRef = useRef(0);
        const velocityRef = useRef(0);
        const dragStartRef = useRef<{ x: number, y: number } | null>(null);
        const hasDraggedRef = useRef(false);
        const lastInteractionTimeRef = useRef<number>(Date.now());
        const isPausedRef = useRef(false);
        const flippedIndexRef = useRef<number | null>(null);
        const isUnmountedRef = useRef(false);
        const containerRef = useRef<HTMLDivElement>(null);
        const isVisibleRef = useRef(true);
        const swipeDirectionRef = useRef<'none' | 'horizontal' | 'vertical'>('none');
        const pointerIdRef = useRef<number | null>(null);

        // Keep refs in sync with state
        useEffect(() => {
            isPausedRef.current = isPaused;
        }, [isPaused]);

        useEffect(() => {
            flippedIndexRef.current = flippedIndex;
        }, [flippedIndex]);

        // Intersection Observer to pause animation when off-screen
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    isVisibleRef.current = entries[0].isIntersecting;
                },
                { threshold: 0, rootMargin: "50px" }
            );

            observer.observe(container);
            return () => observer.disconnect();
        }, []);

        // Stable animation loop - no dependencies that change frequently
        useEffect(() => {
            isUnmountedRef.current = false;
            let currentRotation = 0;

            const animate = (currentTime: number) => {
                if (isUnmountedRef.current) return;

                // Skip animation when not visible or tab hidden (performance optimization)
                if (!isVisibleRef.current || document.hidden) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                    return;
                }

                if (lastTimeRef.current === 0) {
                    lastTimeRef.current = currentTime;
                }

                const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
                lastTimeRef.current = currentTime;

                // Apply velocity decay for momentum
                if (!isDraggingRef.current && Math.abs(velocityRef.current) > 0.01) {
                    targetRotationRef.current += velocityRef.current * deltaTime * 60;
                    velocityRef.current *= 0.95;
                }

                // Auto-rotate when not interacting
                const timeSinceLastInteraction = Date.now() - lastInteractionTimeRef.current;
                const isInactive = timeSinceLastInteraction > 3000;

                if (!isDraggingRef.current && flippedIndexRef.current === null && Math.abs(velocityRef.current) < 0.1) {
                    if (!isPausedRef.current || isInactive) {
                        targetRotationRef.current += autoRotateSpeed * deltaTime * 60;
                    }
                }

                // Smooth interpolation towards target
                const diff = targetRotationRef.current - currentRotation;
                const smoothing = 0.12;
                currentRotation += diff * smoothing;

                // Calculate active index based on current rotation
                let currentActive = 0;
                let minAngle = Infinity;
                for (let i = 0; i < items.length; i++) {
                    const angle = (360 / items.length) * i;
                    const normalizedAngle = ((currentRotation - angle) % 360 + 360) % 360;
                    if (normalizedAngle < minAngle) {
                        minAngle = normalizedAngle;
                        currentActive = i;
                    }
                }

                // Only update state when values actually change
                setRotation(currentRotation);
                setActiveIndex(prev => prev === currentActive ? prev : currentActive);

                animationFrameRef.current = requestAnimationFrame(animate);
            };

            animationFrameRef.current = requestAnimationFrame(animate);

            return () => {
                isUnmountedRef.current = true;
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                }
            };
        }, [items.length, autoRotateSpeed]); // Added items.length dependency

        // Keyboard navigation
        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'ArrowLeft') {
                    lastInteractionTimeRef.current = Date.now();
                    targetRotationRef.current -= (360 / items.length);
                } else if (e.key === 'ArrowRight') {
                    lastInteractionTimeRef.current = Date.now();
                    targetRotationRef.current += (360 / items.length);
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, [items.length]);

        // Notify parent of active index changes
        useEffect(() => {
            onActiveIndexChange?.(activeIndex);
        }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

        const handlePrev = (e: React.MouseEvent) => {
            e.stopPropagation();
            lastInteractionTimeRef.current = Date.now();
            targetRotationRef.current -= (360 / items.length);
        };

        const handleNext = (e: React.MouseEvent) => {
            e.stopPropagation();
            lastInteractionTimeRef.current = Date.now();
            targetRotationRef.current += (360 / items.length);
        };

        // Mouse/touch drag handlers
        const handlePointerDown = (e: React.PointerEvent) => {
            e.stopPropagation();
            if (flippedIndex !== null) {
                setFlippedIndex(null);
                return;
            }
            // Start tracking but don't capture yet - wait to detect direction
            isDraggingRef.current = true;
            hasDraggedRef.current = false;
            swipeDirectionRef.current = 'none';
            dragStartRef.current = { x: e.clientX, y: e.clientY };
            lastXRef.current = e.clientX;
            velocityRef.current = 0;
            pointerIdRef.current = e.pointerId;
            // Don't capture pointer immediately - let browser handle scroll initially
        };

        const handlePointerMove = (e: React.PointerEvent) => {
            if (!isDraggingRef.current || !dragStartRef.current) return;

            const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
            const deltaY = Math.abs(e.clientY - dragStartRef.current.y);

            // Detect swipe direction on first significant movement (threshold: 10px)
            if (swipeDirectionRef.current === 'none' && (deltaX > 10 || deltaY > 10)) {
                if (deltaY > deltaX) {
                    // Vertical swipe - let browser handle scroll
                    swipeDirectionRef.current = 'vertical';
                    isDraggingRef.current = false;
                    dragStartRef.current = null;
                    return;
                } else {
                    // Horizontal swipe - capture for carousel rotation
                    swipeDirectionRef.current = 'horizontal';
                    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                }
            }

            // Only process horizontal swipes
            if (swipeDirectionRef.current !== 'horizontal') return;

            lastInteractionTimeRef.current = Date.now();
            const moveDeltaX = e.clientX - lastXRef.current;
            velocityRef.current = moveDeltaX * 0.5;
            targetRotationRef.current += moveDeltaX * 0.4;
            lastXRef.current = e.clientX;

            const moveDistance = Math.sqrt(
                Math.pow(e.clientX - dragStartRef.current.x, 2) +
                Math.pow(e.clientY - dragStartRef.current.y, 2)
            );
            if (moveDistance > 5) {
                hasDraggedRef.current = true;
            }
        };

        const handlePointerUp = (e: React.PointerEvent) => {
            isDraggingRef.current = false;
            dragStartRef.current = null;
            swipeDirectionRef.current = 'none';
            if (pointerIdRef.current !== null) {
                try {
                    (e.target as HTMLElement).releasePointerCapture?.(pointerIdRef.current);
                } catch {
                    // Pointer may not be captured, ignore
                }
            }
            pointerIdRef.current = null;
        };

        // Wheel handler - scroll-to-rotate disabled completely
        const handleWheel = useCallback((_e: React.WheelEvent) => {
            // Scroll-to-rotate disabled - use drag, arrow buttons, or keyboard instead
            return;
        }, []);

        const handleCardClick = (index: number, isFront: boolean, isFlipped: boolean) => {
            if (hasDraggedRef.current) return;
            // Allow flipping any visible front-facing card (not already flipped)
            // Also allow clicking back face to unflip
            if (isFlipped) {
                // Clicking a flipped card unflips it
                setFlippedIndex(null);
                return;
            }
            if (!isFront) return;
            setFlippedIndex(prev => prev === index ? null : index);
        };

        const anglePerItem = 360 / items.length;

        // Combine refs - use containerRef for visibility, forward ref for external use
        const setRefs = (element: HTMLDivElement | null) => {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
            if (typeof ref === 'function') {
                ref(element);
            } else if (ref) {
                ref.current = element;
            }
        };

        return (
            <div
                ref={setRefs}
                role="region"
                aria-label="Circular 3D Gallery"
                className={cn(
                    "relative w-full h-full flex items-center justify-center select-none touch-pan-y",
                    className
                )}
                style={{ perspective: '1200px' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => { setIsPaused(false); setFlippedIndex(null); }}
                {...props}
            >
                {/* Controls */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 hidden md:flex"
                    aria-label="Previous Project"
                >
                    <ArrowRight className="w-6 h-6 rotate-180" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 hidden md:flex"
                    aria-label="Next Project"
                >
                    <ArrowRight className="w-6 h-6" />
                </button>

                <div
                    className="relative"
                    style={{
                        width: `${itemWidth + 20}px`,
                        height: `${itemHeight + 20}px`,
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${rotation}deg)`,
                    }}
                >
                    {items.map((item, i) => {
                        const itemAngle = i * anglePerItem;
                        const totalRotation = ((rotation % 360) + 360) % 360;
                        const relativeAngle = ((itemAngle - totalRotation) % 360 + 360) % 360;
                        const normalizedAngle = relativeAngle > 180 ? 360 - relativeAngle : relativeAngle;

                        // Wider front threshold for better usability on all cards
                        const isFront = normalizedAngle < 100;
                        const isVisible = normalizedAngle < 120;
                        const scale = Math.max(0.75, 1 - normalizedAngle / 250);
                        const colorScheme = getColorScheme(item.binomial);
                        const isFlipped = flippedIndex === i;

                        // Dynamic Z-index based on how close it is to the front
                        // Closer to 0 angle = higher z-index
                        const zIndex = Math.round(100 - normalizedAngle);

                        return (
                            <div
                                key={`${item.common}-${i}`}
                                className={cn(
                                    "absolute left-1/2 top-1/2",
                                    isVisible ? "pointer-events-auto" : "pointer-events-none"
                                )}
                                style={{
                                    width: `${itemWidth}px`,
                                    height: `${itemHeight}px`,
                                    marginLeft: `-${itemWidth / 2}px`,
                                    marginTop: `-${itemHeight / 2}px`,
                                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${scale})`,
                                    transformStyle: 'preserve-3d',
                                    opacity: isVisible ? 1 : 0,
                                    zIndex: zIndex,
                                    transition: 'opacity 0.3s ease',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(i, isFront, isFlipped);
                                }}
                            >
                                {/* Flip Container */}
                                <div
                                    className="relative w-full h-full"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    {/* FRONT FACE */}
                                    <div
                                        className={cn(
                                            "absolute inset-0 w-full h-full rounded-2xl overflow-hidden",
                                            "bg-neutral-900 border-2",
                                            isFront
                                                ? `${colorScheme.border} shadow-2xl`
                                                : "border-white/5 shadow-lg"
                                        )}
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                        }}
                                    >
                                        {/* Image */}
                                        <div className="relative h-[50%] overflow-hidden">
                                            <img
                                                src={`${item.photo.url}&w=800&q=80`}
                                                srcSet={`
                                                    ${item.photo.url}&w=400&q=80 400w,
                                                    ${item.photo.url}&w=800&q=80 800w
                                                `}
                                                sizes="(max-width: 640px) 250px, (max-width: 1024px) 300px, 400px"
                                                alt={item.photo.text}
                                                className="w-full h-full object-cover"
                                                style={{ objectPosition: item.photo.pos || 'center' }}
                                                loading={isFront ? "eager" : "lazy"}
                                                // @ts-ignore - fetchpriority is a valid HTML attribute
                                                fetchpriority={isFront ? "high" : "auto"}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

                                            {/* Badge */}
                                            <span className={cn(
                                                "absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase rounded-full text-white",
                                                colorScheme.badge
                                            )}>
                                                {item.binomial}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 sm:p-4 h-[50%] flex flex-col">
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                                                {item.common}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-3 flex-grow">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className={cn(
                                                    "flex items-center gap-1 text-xs font-medium",
                                                    colorScheme.accent
                                                )}>
                                                    <span>Click to flip</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>

                                                {/* Quick Expand Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        onCardExpand?.(item);
                                                    }}
                                                    className={cn(
                                                        "p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group",
                                                        "hover:scale-110"
                                                    )}
                                                    title="Expand project"
                                                >
                                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BACK FACE */}
                                    <div
                                        className={cn(
                                            "absolute inset-0 w-full h-full rounded-2xl overflow-hidden p-5 flex flex-col",
                                            "bg-neutral-900 border-2 shadow-2xl",
                                            colorScheme.border
                                        )}
                                        style={{
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        {/* Header with gradient accent */}
                                        <div className={cn(
                                            "absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl",
                                            `bg-gradient-to-r ${colorScheme.badge.replace('bg-', 'from-')} to-transparent`
                                        )} />

                                        <div className="flex items-start justify-between mb-3 mt-1">
                                            <div className="flex-1 min-w-0">
                                                <span className={cn(
                                                    "inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase rounded-md text-white mb-2",
                                                    colorScheme.badge
                                                )}>
                                                    {item.binomial}
                                                </span>
                                                <h3 className="text-base font-bold text-white leading-tight line-clamp-2">
                                                    {item.common}
                                                </h3>
                                            </div>
                                            <button
                                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 ml-2 flex-shrink-0"
                                                onClick={(e) => { e.stopPropagation(); setFlippedIndex(null); }}
                                            >
                                                <X className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>

                                        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>

                                        {/* Features Section */}
                                        <div
                                            className="flex-grow overflow-y-auto min-h-0 pr-2 sm:pr-1 touch-pan-y"
                                            onPointerDown={(e) => e.stopPropagation()}
                                        >
                                            <h4 className={cn(
                                                "text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2",
                                                colorScheme.accent
                                            )}>
                                                <span className="w-4 h-px bg-current opacity-50"></span>
                                                Key Features
                                                <span className="flex-1 h-px bg-current opacity-20"></span>
                                            </h4>
                                            <ul className="space-y-1.5">
                                                {item.features?.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 group">
                                                        <span className={cn(
                                                            "w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5",
                                                            "bg-white/5 group-hover:bg-white/10 transition-colors"
                                                        )}>
                                                            <Check className={cn("w-3 h-3", colorScheme.accent)} />
                                                        </span>
                                                        <span className="text-xs text-gray-300 leading-relaxed">{feature}</span>
                                                    </li>
                                                )) || (
                                                        <li className="text-gray-500 text-xs italic">No features listed.</li>
                                                    )}
                                            </ul>
                                        </div>

                                        {/* CTA Button */}
                                        <div
                                            className="mt-3 pt-3 border-t border-white/5"
                                            onPointerDown={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setFlippedIndex(null); // Close flip state first
                                                    onCardExpand?.(item);
                                                }}
                                                onPointerDown={(e) => e.stopPropagation()}
                                                className={cn(
                                                    "w-full py-2.5 rounded-xl text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer",
                                                    "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
                                                    "shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/30",
                                                    "active:scale-[0.98]"
                                                )}>
                                                <span>View Full Project</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {items.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                lastInteractionTimeRef.current = Date.now();
                                targetRotationRef.current = i * (360 / items.length);
                            }}
                            className={cn(
                                "w-3 h-3 sm:w-2 sm:h-2 rounded-full transition-all duration-300",
                                activeIndex === i ? "bg-white w-8 sm:w-6" : "bg-white/20 hover:bg-white/40"
                            )}
                            aria-label={`Go to project ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Navigation hints */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground bg-black/30 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full pointer-events-none">
                    <span>Drag to rotate</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    <span>Click card to flip</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground hidden md:block"></span>
                    <span className="hidden md:block">Use Arrow Keys</span>
                </div>
            </div>
        );
    }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
