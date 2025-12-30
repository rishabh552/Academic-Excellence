import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { Check, ArrowRight, ExternalLink } from 'lucide-react';
import './arc-gallery.css';

// Same interface as existing CircularGallery for drop-in compatibility
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

interface ArcGalleryProps {
    items: GalleryItem[];
    onCardExpand?: (item: GalleryItem) => void;
    onActiveIndexChange?: (index: number) => void;
    className?: string;
}

// Badge color mapping
const getBadgeClass = (category: string): string => {
    const mapping: Record<string, string> = {
        'Full Stack Web': 'badge-fullstack',
        'Machine Learning': 'badge-ml',
        'Deep Learning': 'badge-dl',
        'Mobile Application': 'badge-mobile',
        'NLP': 'badge-nlp',
        'Frontend': 'badge-frontend',
        'Productivity': 'badge-productivity',
        'FinTech': 'badge-fintech',
    };
    return mapping[category] || 'badge-default';
};

interface CardPosition {
    x: number;
    y: number;
    scale: number;
    rotateZ: number;
    zIndex: number;
    opacity: number;
}

export function ArcGallery({ items, onCardExpand, onActiveIndexChange, className }: ArcGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const cardPositionsRef = useRef<Map<HTMLDivElement, CardPosition>>(new Map());

    const [rotation, setRotation] = useState(0);
    const [flippedCard, setFlippedCard] = useState<HTMLDivElement | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Drag state refs
    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const lastDragXRef = useRef(0);
    const velocityRef = useRef(0);
    const hasDraggedRef = useRef(false);
    const rotationRef = useRef(0);
    const animatingCardRef = useRef<HTMLDivElement | null>(null);  // Track card being animated

    // Keep rotation ref in sync
    useEffect(() => {
        rotationRef.current = rotation;
    }, [rotation]);

    // Get responsive dimensions
    const getCardDimensions = useCallback(() => {
        const width = window.innerWidth;
        if (width < 640) return { cardWidth: 200, cardHeight: 280, spacing: 100 };
        if (width < 1024) return { cardWidth: 240, cardHeight: 340, spacing: 130 };
        return { cardWidth: 280, cardHeight: 400, spacing: 150 };
    }, []);

    // Calculate center index for callbacks
    const calculateCenterIndex = useCallback((rot: number, itemCount: number): number => {
        const centerOffset = Math.round(-rot);
        const idx = ((centerOffset % itemCount) + itemCount) % itemCount;
        return Math.max(0, Math.min(itemCount - 1, idx));
    }, []);

    // Position cards on the arc
    const positionCardsInDeck = useCallback((animate = true) => {
        const container = containerRef.current;
        if (!container) return;

        // Skip ALL repositioning if animation is in progress
        if (animatingCardRef.current) return;

        const { cardWidth, spacing } = getCardDimensions();
        const centerX = container.offsetWidth / 2;
        const deckY = container.offsetHeight * 0.55;

        cardsRef.current.forEach((card, i) => {
            if (!card) return;


            const offset = i - (items.length - 1) / 2;
            const pos = offset + rotationRef.current;

            // Arc calculation
            const x = centerX + pos * spacing - cardWidth / 2;
            const y = deckY + Math.pow(Math.abs(pos), 1.4) * 18;

            const dist = Math.abs(pos);
            const scale = Math.max(0.55, 1 - dist * 0.1);
            const rotateZ = pos * 4;

            // Z-index: flipped card on top
            let zIndex: number;
            if (card === flippedCard) {
                zIndex = 200;
            } else {
                zIndex = Math.round(100 - dist * 15);
            }

            const opacity = Math.max(0.35, 1 - dist * 0.15);

            // Store position
            cardPositionsRef.current.set(card, { x, y, scale, rotateZ, zIndex, opacity });

            // Animate outer card position (inner handles flip rotation)
            gsap.to(card, {
                x,
                y,
                scale,
                rotateZ,
                zIndex,
                opacity,
                duration: animate ? 0.5 : 0,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });

        // Notify active index change
        const centerIndex = calculateCenterIndex(rotationRef.current, items.length);
        onActiveIndexChange?.(centerIndex);
    }, [items.length, flippedCard, getCardDimensions, calculateCenterIndex, onActiveIndexChange]);

    // Lift + Flip + Return (still flipped)
    const liftFlipReturn = useCallback((card: HTMLDivElement, _item: GalleryItem) => {
        setIsAnimating(true);
        animatingCardRef.current = card;  // Track this card as animating

        const container = containerRef.current;
        if (!container) return;

        const { cardWidth } = getCardDimensions();
        const pos = cardPositionsRef.current.get(card);
        const inner = card.querySelector('.arc-card-inner') as HTMLElement;
        if (!inner) return;

        const liftX = container.offsetWidth / 2 - cardWidth / 2;
        const liftY = container.offsetHeight * 0.25;

        const tl = gsap.timeline({
            onComplete: () => {
                animatingCardRef.current = null;  // Clear when done
                setFlippedCard(card);
                card.classList.add('flipped');
                setIsAnimating(false);
            }
        });

        // 1. LIFT UP (move the outer card)
        tl.to(card, {
            x: liftX,
            y: liftY,
            scale: 1.05,
            rotateZ: 0,
            zIndex: 500,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        });

        // 2. FLIP (rotate the inner element)
        tl.to(inner, {
            rotateY: 180,
            duration: 0.5,
            ease: 'power2.inOut'
        });

        // 3. RETURN to deck (move outer, keep inner flipped)
        tl.to(card, {
            x: pos?.x ?? liftX,
            y: pos?.y ?? liftY,
            scale: pos?.scale ?? 1,
            rotateZ: pos?.rotateZ ?? 0,
            zIndex: 200,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        });
    }, [getCardDimensions]);

    // Unflip card
    const unflipCard = useCallback((card: HTMLDivElement, onComplete?: () => void) => {
        setIsAnimating(true);
        card.classList.remove('flipped');

        // If there's a follow-up action, block repositioning during this phase
        if (onComplete) {
            animatingCardRef.current = card;
        }

        const inner = card.querySelector('.arc-card-inner') as HTMLElement;
        if (!inner) return;

        gsap.to(inner, {
            rotateY: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
                if (flippedCard === card) {
                    setFlippedCard(null);
                }

                if (onComplete) {
                    // Keep blocking repositioning - liftFlipReturn will set its own card
                    setTimeout(() => {
                        setIsAnimating(false);
                        onComplete();
                    }, 50);
                } else {
                    animatingCardRef.current = null;
                    setIsAnimating(false);
                    positionCardsInDeck();
                }
            }
        });
    }, [flippedCard, positionCardsInDeck]);

    // Handle card click
    const handleCardClick = useCallback((card: HTMLDivElement, item: GalleryItem) => {
        if (isAnimating || hasDraggedRef.current) return;

        // If clicking the flipped card, unflip it
        if (flippedCard === card) {
            unflipCard(card);
            return;
        }

        // If another card is flipped, unflip first
        if (flippedCard) {
            unflipCard(flippedCard, () => liftFlipReturn(card, item));
        } else {
            liftFlipReturn(card, item);
        }
    }, [isAnimating, flippedCard, unflipCard, liftFlipReturn]);

    // Handle View Project button click
    const handleViewProject = useCallback((e: React.MouseEvent, item: GalleryItem) => {
        e.stopPropagation();
        onCardExpand?.(item);
    }, [onCardExpand]);

    // Drag handlers
    const getClientX = (e: MouseEvent | TouchEvent): number => {
        if ('touches' in e && e.touches.length > 0) {
            return e.touches[0].clientX;
        }
        return (e as MouseEvent).clientX;
    };

    const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if ((e.target as HTMLElement).tagName === 'BUTTON' || isAnimating) return;

        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        dragStartXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
        lastDragXRef.current = dragStartXRef.current;
        velocityRef.current = 0;

        containerRef.current?.classList.add('dragging');
    }, [isAnimating]);

    useEffect(() => {
        const handleDragMove = (e: MouseEvent | TouchEvent) => {
            if (!isDraggingRef.current) return;

            const x = getClientX(e);
            const delta = x - lastDragXRef.current;
            const totalDelta = Math.abs(x - dragStartXRef.current);

            if (totalDelta > 10) {
                hasDraggedRef.current = true;
                e.preventDefault();

                velocityRef.current = delta * 0.008;
                const newRotation = rotationRef.current + delta * 0.004;
                setRotation(newRotation);
                lastDragXRef.current = x;
            }
        };

        const handleDragEnd = () => {
            if (!isDraggingRef.current) return;

            isDraggingRef.current = false;
            containerRef.current?.classList.remove('dragging');

            // Momentum
            if (hasDraggedRef.current && Math.abs(velocityRef.current) > 0.001) {
                const applyMomentum = () => {
                    if (Math.abs(velocityRef.current) < 0.0005) return;

                    setRotation(prev => {
                        const newRot = prev + velocityRef.current * 5;
                        rotationRef.current = newRot;
                        return newRot;
                    });
                    velocityRef.current *= 0.9;

                    requestAnimationFrame(applyMomentum);
                };
                applyMomentum();
            }

            setTimeout(() => { hasDraggedRef.current = false; }, 100);
        };

        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('touchend', handleDragEnd);

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && flippedCard) {
                unflipCard(flippedCard);
            } else if (e.key === 'ArrowLeft') {
                setRotation(prev => prev + 0.4);
            } else if (e.key === 'ArrowRight') {
                setRotation(prev => prev - 0.4);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [flippedCard, unflipCard]);

    // Position cards on rotation change
    useEffect(() => {
        positionCardsInDeck();
    }, [rotation, positionCardsInDeck]);

    // Initial positioning and resize handler
    useEffect(() => {
        positionCardsInDeck(false);

        const handleResize = () => positionCardsInDeck();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [positionCardsInDeck]);

    return (
        <div className={cn('arc-gallery', className)} ref={containerRef}>
            <div
                className="arc-gallery-container"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
            >
                {items.map((item, index) => (
                    <div
                        key={`${item.common}-${index}`}
                        ref={el => { cardsRef.current[index] = el; }}
                        className="arc-card"
                        onClick={() => {
                            const card = cardsRef.current[index];
                            if (card) handleCardClick(card, item);
                        }}
                    >
                        {/* Inner wrapper for 3D flip */}
                        <div className="arc-card-inner">
                            {/* FRONT FACE */}
                            <div className="arc-card-face arc-card-front">
                                <span className={cn('arc-card-badge', getBadgeClass(item.binomial))}>
                                    {item.binomial}
                                </span>

                                <div className="arc-card-image">
                                    <img src={item.photo.url} alt={item.common} loading="lazy" />
                                </div>

                                <div className="arc-card-content">
                                    <div className="sparkle-icon">✦</div>
                                    <h3>{item.common}</h3>
                                    <p>{item.description || `Professional ${item.binomial} project with modern technologies.`}</p>
                                    <div className="arc-card-footer">
                                        <span className="flip-hint">Click to flip →</span>
                                        <button
                                            className="external-link-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Could open external link if available
                                            }}
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* BACK FACE */}
                            <div className="arc-card-face arc-card-back">
                                <span className={cn('back-badge', getBadgeClass(item.binomial))}>
                                    {item.binomial}
                                </span>
                                <h4>{item.common}</h4>
                                <p className="back-description">
                                    {item.description || `A comprehensive ${item.binomial} solution built with industry best practices.`}
                                </p>
                                <div className="features-list">
                                    {item.features?.slice(0, 4).map((feature, i) => (
                                        <span key={i} className="feature-tag">
                                            <Check className="check-icon" size={12} />
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    className="view-project-btn"
                                    onClick={(e) => handleViewProject(e, item)}
                                >
                                    View Full Project
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="arc-gallery-hint">
                Drag to browse • Click to flip • View project for details
            </div>
        </div>
    );
}

export default ArcGallery;
