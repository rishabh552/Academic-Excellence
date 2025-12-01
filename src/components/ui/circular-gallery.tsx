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
}

// Color schemes for different project types
const colorSchemes: Record<string, { badge: string; accent: string; border: string }> = {
    'Full Stack Web': { badge: 'bg-blue-500', accent: 'text-blue-400', border: 'border-blue-500/30' },
    'Machine Learning': { badge: 'bg-purple-500', accent: 'text-purple-400', border: 'border-purple-500/30' },
    'Deep Learning': { badge: 'bg-pink-500', accent: 'text-pink-400', border: 'border-pink-500/30' },
    'IoT & Mobile': { badge: 'bg-orange-500', accent: 'text-orange-400', border: 'border-orange-500/30' },
    'NLP': { badge: 'bg-cyan-500', accent: 'text-cyan-400', border: 'border-cyan-500/30' },
    'Frontend': { badge: 'bg-emerald-500', accent: 'text-emerald-400', border: 'border-emerald-500/30' },
    'Productivity': { badge: 'bg-amber-500', accent: 'text-amber-400', border: 'border-amber-500/30' },
    'FinTech': { badge: 'bg-indigo-500', accent: 'text-indigo-400', border: 'border-indigo-500/30' },
};

const getColorScheme = (binomial: string) => {
    return colorSchemes[binomial] || { badge: 'bg-emerald-500', accent: 'text-emerald-400', border: 'border-emerald-500/30' };
};

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
    ({ items, className, radius = 500, autoRotateSpeed = 0.3, ...props }, ref) => {
        const [rotation, setRotation] = useState(0);
        const [targetRotation, setTargetRotation] = useState(0);
        const [isPaused, setIsPaused] = useState(false);
        const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
        const lastTimeRef = useRef<number>(0);
        const animationFrameRef = useRef<number | null>(null);
        const isDraggingRef = useRef(false);
        const lastXRef = useRef(0);
        const velocityRef = useRef(0);

        // Smooth animation loop with interpolation
        const animate = useCallback((currentTime: number) => {
            if (lastTimeRef.current === 0) {
                lastTimeRef.current = currentTime;
            }

            const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
            lastTimeRef.current = currentTime;

            // Apply velocity decay for momentum
            if (!isDraggingRef.current && Math.abs(velocityRef.current) > 0.01) {
                setTargetRotation(prev => prev + velocityRef.current * deltaTime * 60);
                velocityRef.current *= 0.95; // Decay
            }

            // Auto-rotate when not interacting
            if (!isPaused && !isDraggingRef.current && flippedIndex === null && Math.abs(velocityRef.current) < 0.1) {
                setTargetRotation(prev => prev + autoRotateSpeed * deltaTime * 60);
            }

            // Smooth interpolation towards target
            setRotation(prev => {
                const diff = targetRotation - prev;
                const smoothing = 0.12;
                return prev + diff * smoothing;
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        }, [isPaused, autoRotateSpeed, flippedIndex, targetRotation]);

        useEffect(() => {
            animationFrameRef.current = requestAnimationFrame(animate);
            return () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            };
        }, [animate]);

        // Mouse/touch drag handlers
        const handlePointerDown = (e: React.PointerEvent) => {
            // If a card is flipped and user starts dragging, unflip it first
            if (flippedIndex !== null) {
                setFlippedIndex(null);
                return;
            }
            isDraggingRef.current = true;
            lastXRef.current = e.clientX;
            velocityRef.current = 0;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        };

        const handlePointerMove = (e: React.PointerEvent) => {
            if (!isDraggingRef.current) return;
            const deltaX = e.clientX - lastXRef.current;
            velocityRef.current = deltaX * 0.5;
            setTargetRotation(prev => prev + deltaX * 0.4);
            lastXRef.current = e.clientX;
        };

        const handlePointerUp = (e: React.PointerEvent) => {
            isDraggingRef.current = false;
            (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        };

        // Smooth wheel handler
        const handleWheel = (e: React.WheelEvent) => {
            e.preventDefault();
            // If a card is flipped and user scrolls, unflip it first
            if (flippedIndex !== null) {
                setFlippedIndex(null);
                return;
            }
            const delta = e.deltaY * 0.3;
            setTargetRotation(prev => prev + delta);
        };

        const handleCardClick = (index: number, isFront: boolean) => {
            if (!isFront || isDraggingRef.current) return;
            if (Math.abs(velocityRef.current) > 1) return; // Don't flip if still moving fast

            setFlippedIndex(prev => prev === index ? null : index);
        };

        const anglePerItem = 360 / items.length;

        return (
            <div
                ref={ref}
                role="region"
                aria-label="Circular 3D Gallery"
                className={cn(
                    "relative w-full h-full flex items-center justify-center select-none touch-none",
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
                <div
                    className="relative"
                    style={{
                        width: '300px',
                        height: '420px',
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${rotation}deg)`,
                    }}
                >
                    {items.map((item, i) => {
                        const itemAngle = i * anglePerItem;
                        const totalRotation = ((rotation % 360) + 360) % 360;
                        const relativeAngle = ((itemAngle - totalRotation) % 360 + 360) % 360;
                        const normalizedAngle = relativeAngle > 180 ? 360 - relativeAngle : relativeAngle;

                        const isFront = normalizedAngle < 45;
                        const isVisible = normalizedAngle < 100;
                        const scale = Math.max(0.75, 1 - normalizedAngle / 250);
                        const colorScheme = getColorScheme(item.binomial);
                        const isFlipped = flippedIndex === i;

                        return (
                            <div
                                key={`${item.common}-${i}`}
                                className={cn(
                                    "absolute left-1/2 top-1/2 w-[280px] h-[400px] -ml-[140px] -mt-[200px]",
                                    isVisible ? "pointer-events-auto" : "pointer-events-none"
                                )}
                                style={{
                                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${scale})`,
                                    transformStyle: 'preserve-3d',
                                    opacity: isVisible ? 1 : 0,
                                    zIndex: isFront ? 10 : 1,
                                    transition: 'opacity 0.3s ease',
                                }}
                                onClick={() => handleCardClick(i, isFront)}
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
                                        <div className="relative h-[55%] overflow-hidden">
                                            <img
                                                src={item.photo.url}
                                                alt={item.photo.text}
                                                className="w-full h-full object-cover"
                                                style={{ objectPosition: item.photo.pos || 'center' }}
                                                loading="lazy"
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
                                        <div className="p-4 h-[45%] flex flex-col">
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                                                {item.common}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-3 flex-grow">
                                                {item.description}
                                            </p>

                                            {isFront && (
                                                <div className={cn(
                                                    "flex items-center gap-1 text-xs font-medium mt-3",
                                                    colorScheme.accent
                                                )}>
                                                    <span>Click to flip</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            )}
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
                                        <div className="flex-grow overflow-y-auto min-h-0 pr-1">
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
                                        <div className="mt-3 pt-3 border-t border-white/5">
                                            <button className={cn(
                                                "w-full py-2.5 rounded-xl text-white text-xs font-semibold transition-all flex items-center justify-center gap-2",
                                                "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
                                                "shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/30"
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

                {/* Navigation hints */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs text-muted-foreground bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span>Scroll or drag to rotate</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                    <span>Click card to flip</span>
                </div>
            </div>
        );
    }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
