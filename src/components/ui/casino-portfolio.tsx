import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PokerCard, Project } from './poker-card';
import { cn } from '@/lib/utils';
import './casino-portfolio.css';
import { Check, Github, ExternalLink, X } from 'lucide-react';

interface CasinoPortfolioProps {
    items: Project[];
    onActiveProjectChange?: (project: Project | null) => void;
}

export function CasinoPortfolio({ items, onActiveProjectChange }: CasinoPortfolioProps) {
    // STATE MACHINE
    const [deck, setDeck] = useState<Project[]>([]);
    const [hand, setHand] = useState<Project[]>([]);
    const [playedIndices, setPlayedIndices] = useState<Set<number>>(new Set()); // Track indices of cards that have been played
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // Index in HAND
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [isDealing, setIsDealing] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false); // Prevent double clicks

    // REFS
    const containerRef = useRef<HTMLDivElement>(null);
    const handRefs = useRef<(HTMLDivElement | null)[]>([]);
    const deckRef = useRef<HTMLDivElement>(null);
    const activeSlotRef = useRef<HTMLDivElement>(null);
    const pendingInspectRef = useRef<number | null>(null); // Track pending card to inspect

    // Initialize Game
    useEffect(() => {
        // Start with no cards in hand, all in deck
        // But for the initial "Deal", we want to move 5 from deck to hand
        const initialHandSize = Math.min(5, items.length);
        const initialHand = items.slice(0, initialHandSize);
        const remainingDeck = items.slice(initialHandSize);

        setHand(initialHand);
        setDeck(remainingDeck);
        setPlayedIndices(new Set());

        // Trigger deal animation on mount
        dealCards(initialHandSize);
    }, [items]); // Only run when items change (initial load)

    // Auto-shuffle and deal when ALL cards in hand have been played
    useEffect(() => {
        // Check if all cards in hand have been played at least once
        if (hand.length > 0 && playedIndices.size >= hand.length && !isDealing && !activeProject) {
            performShuffleAnimation();
        }
    }, [playedIndices.size, hand.length, isDealing, activeProject]);

    // Visual shuffle animation
    const performShuffleAnimation = () => {
        if (!containerRef.current || !deckRef.current) return;

        setIsDealing(true);

        const deckRect = deckRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const deckX = deckRect.left - containerRect.left;
        const deckY = deckRect.top - containerRect.top;

        // 1. Animate all cards flying to the deck
        const flyToDeckTimeline = gsap.timeline({
            onComplete: () => {
                // After cards reach deck, do shuffle animation
                shuffleDeckAnimation();
            }
        });

        handRefs.current.forEach((card, i) => {
            if (!card) return;

            flyToDeckTimeline.to(card, {
                x: deckX + Math.random() * 20 - 10,
                y: deckY + Math.random() * 20 - 10,
                rotation: Math.random() * 30 - 15,
                scale: 0.9,
                opacity: 0.8,
                duration: 0.4,
                ease: "power2.in"
            }, i * 0.1);
        });
    };

    // Deck shuffle animation
    const shuffleDeckAnimation = () => {
        if (!deckRef.current) return;

        // Make cards invisible (they're now "in" the deck)
        handRefs.current.forEach(card => {
            if (card) gsap.set(card, { opacity: 0 });
        });

        // Animate the deck stack with a shuffle effect
        const deckStack = deckRef.current;

        const shuffleTl = gsap.timeline({
            onComplete: () => {
                // After shuffle animation, deal new cards
                dealNewHand();
            }
        });

        // Wobble/shuffle animation on the deck
        shuffleTl
            .to(deckStack, { rotation: -5, duration: 0.1, ease: "power1.inOut" })
            .to(deckStack, { rotation: 5, duration: 0.1, ease: "power1.inOut" })
            .to(deckStack, { rotation: -3, duration: 0.1, ease: "power1.inOut" })
            .to(deckStack, { rotation: 3, duration: 0.1, ease: "power1.inOut" })
            .to(deckStack, { rotation: -2, y: -10, duration: 0.1, ease: "power1.inOut" })
            .to(deckStack, { rotation: 2, y: 10, duration: 0.1, ease: "power1.inOut" })
            .to(deckStack, { rotation: 0, y: 0, scale: 1.05, duration: 0.15, ease: "power2.out" })
            .to(deckStack, { scale: 1, duration: 0.15, ease: "power2.in" });
    };

    // Deal new shuffled hand
    const dealNewHand = () => {
        // Shuffle all cards and deal new hand
        const allCards = [...hand, ...deck];
        const shuffled = shuffleArray(allCards);

        // Deal new hand from shuffled cards
        const newHandSize = Math.min(5, shuffled.length);
        const newHand = shuffled.slice(0, newHandSize);
        const newDeck = shuffled.slice(newHandSize);

        // Reset state
        setPlayedIndices(new Set());
        setHand(newHand);
        setDeck(newDeck);

        // Trigger deal animation after a short delay for state to update
        setTimeout(() => {
            dealCards(newHandSize);
        }, 100);
    };

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array: Project[]): Project[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Global Mouse Tracking for Lighting
    const handleGlobalMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        containerRef.current.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    // DEAL ANIMATION
    const dealCards = (count: number) => {
        setIsDealing(true);

        // Wait for render
        setTimeout(() => {
            if (!containerRef.current || !deckRef.current) return;

            const deckRect = deckRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            // Coordinate relative to the container
            const startX = deckRect.left - containerRect.left;
            const startY = deckRect.top - containerRect.top;

            // Animate each card
            handRefs.current.slice(0, count).forEach((card, i) => {
                if (!card) return;

                const pos = getHandPosition(i, count, containerRect.width, containerRect.height);
                const tiltInner = card.querySelector('.card-tilt-inner');

                // Initial State: At Deck Position, Face Down
                // We actually want them to look like they are IN the deck.
                // Small random offset for "stack" feel
                const randomAngle = Math.random() * 4 - 2;

                gsap.set(card, {
                    x: startX + 5 * i, // Slight stack offset in X
                    y: startY - 2 * i, // Slight stack offset in Y
                    rotation: randomAngle,
                    scale: 0.9, // Deck scale
                    opacity: 0,
                    zIndex: 10 + i, // Above table, layered
                });

                // Set face down on inner element
                if (tiltInner) {
                    gsap.set(tiltInner, { rotateY: 180 }); // Face Down
                }

                // The Animation Timeline
                const tl = gsap.timeline({
                    delay: i * 0.2, // Staggered deal
                    onStart: () => {
                        gsap.set(card, { opacity: 1 }); // Make visible only when dealing starts
                    },
                    onComplete: () => {
                        if (i === count - 1) setIsDealing(false);
                    }
                });

                // 1. Lift & Move (Fly to hand)
                tl.to(card, {
                    x: pos.x,
                    y: pos.y,
                    rotation: pos.rotation, // Rotate to arc
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out",
                });

                // 2. Flip Face Up on tiltInner
                if (tiltInner) {
                    tl.to(tiltInner, {
                        rotateY: 0,
                        duration: 0.6,
                        ease: "back.out(1.2)",
                    }, "-=0.2");
                }

                // Add shadow as it lands
                tl.to(card, {
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                    duration: 0.3
                }, "-=0.4");
            });
        }, 300);
    };

    // INSPECT ANIMATION (Click Card)
    const handleInspect = (index: number) => {
        // Guard against multiple clicks during transitions
        if (isDealing || activeProject || isTransitioning) return;
        if (focusedIndex === index) return;

        // If another card is focused, fold it first then inspect the new one
        if (focusedIndex !== null && focusedIndex !== index) {
            setIsTransitioning(true);
            pendingInspectRef.current = index;
            foldAndInspect(index);
            return;
        }

        inspectCard(index);
    };

    // Fold current card and then inspect the new one - OPTIMIZED
    const foldAndInspect = (newIndex: number) => {
        if (focusedIndex === null) {
            setIsTransitioning(false);
            inspectCard(newIndex);
            return;
        }

        const currentIndex = focusedIndex;
        const card = handRefs.current[currentIndex];
        if (!card || !containerRef.current) {
            setIsTransitioning(false);
            return;
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const pos = getHandPosition(currentIndex, hand.length, containerRect.width, containerRect.height);

        // Get elements
        const actions = card.querySelector('.action-buttons') as HTMLElement;
        const tiltInner = card.querySelector('.card-tilt-inner') as HTMLElement;
        const glare = card.querySelector('.card-glare-overlay') as HTMLElement;

        // Kill animations and glare immediately
        gsap.killTweensOf([card, tiltInner, actions, glare]);
        if (glare) gsap.set(glare, { opacity: 0 });

        // FAST fold for card switching - total ~0.3s
        const tl = gsap.timeline({
            onComplete: () => {
                setFocusedIndex(null);
                if (actions) gsap.set(actions, { opacity: 0, y: 20 });

                // Now inspect the new card
                const pending = pendingInspectRef.current;
                pendingInspectRef.current = null;

                if (pending !== null) {
                    // Immediate - no delay needed
                    setIsTransitioning(false);
                    inspectCard(pending);
                } else {
                    setIsTransitioning(false);
                }
            }
        });

        // Instant hide actions
        if (actions) {
            tl.set(actions, { opacity: 0 }, 0);
        }

        // Quick flip back + return simultaneously
        if (tiltInner) {
            tl.to(tiltInner, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.25,
                ease: "power3.out"
            }, 0);
        }

        // Quick return to hand
        tl.to(card, {
            x: pos.x,
            y: pos.y,
            rotation: pos.rotation,
            scale: 1,
            zIndex: 10 + currentIndex,
            duration: 0.3,
            ease: "power3.out"
        }, 0);

        // Restore other cards INSTANTLY
        handRefs.current.forEach((c, i) => {
            if (i !== currentIndex && c) {
                gsap.to(c, {
                    scale: 1,
                    opacity: 1,
                    filter: "none",
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });
    };

    // Extracted inspection logic - OPTIMIZED for speed
    const inspectCard = (index: number) => {
        // Double check we're not in a bad state
        if (isTransitioning) return;

        const card = handRefs.current[index];
        if (!card || !containerRef.current) return;

        setIsTransitioning(true);

        // Kill any existing animations on ALL cards
        handRefs.current.forEach((c) => {
            if (c) {
                gsap.killTweensOf(c);
                const inner = c.querySelector('.card-tilt-inner');
                const glare = c.querySelector('.card-glare-overlay');
                if (inner) gsap.killTweensOf(inner);
                if (glare) gsap.set(glare, { opacity: 0 }); // Kill ALL glare immediately
            }
        });

        setFocusedIndex(index);

        // Get elements
        const tiltInner = card.querySelector('.card-tilt-inner') as HTMLElement;
        const actions = card.querySelector('.action-buttons') as HTMLElement;
        const glare = card.querySelector('.card-glare-overlay') as HTMLElement;

        if (tiltInner) {
            gsap.set(tiltInner, { rotateX: 0, rotateY: 0 });
        }
        if (glare) {
            gsap.set(glare, { opacity: 0 }); // No rainbow during pick
        }

        const containerRect = containerRef.current.getBoundingClientRect();
        const centerX = containerRect.width / 2 - 130;
        const centerY = containerRect.height / 2 - 200;

        // FAST inspect animation - total ~0.5s
        const tl = gsap.timeline({
            onComplete: () => {
                setIsTransitioning(false);
            }
        });

        // Set initial state for action buttons
        if (actions) {
            gsap.set(actions, { opacity: 0, y: 20 });
        }

        // 1. Quick lift + move to center (no anticipation scale)
        tl.to(card, {
            x: centerX,
            y: centerY,
            rotation: 0,
            scale: 1.5,
            zIndex: 100,
            duration: 0.4,
            ease: "power3.out"
        });

        // 2. Quick flip to show details
        if (tiltInner) {
            tl.to(tiltInner, {
                rotateY: 180,
                duration: 0.4,
                ease: "power3.out"
            }, "-=0.15");
        }

        // 3. Show action buttons with slide up
        if (actions) {
            tl.to(actions, {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: "power2.out"
            }, "-=0.15");
        }

        // Dim others - NO BLUR (performance), just opacity + scale
        handRefs.current.forEach((c, i) => {
            if (i !== index && c) {
                gsap.to(c, {
                    opacity: 0.4,
                    scale: 0.9,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    };

    // CLOSE ACTIVE PROJECT - Return card to hand but track as played
    const handleCloseActive = () => {
        if (!activeProject) return;

        const index = hand.indexOf(activeProject);
        if (index === -1) return;

        const card = handRefs.current[index];
        if (!card || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const pos = getHandPosition(index, hand.length, containerRect.width, containerRect.height);

        // Mark this card as played
        setPlayedIndices(prev => new Set([...prev, index]));

        // Hide details panel first
        gsap.to(".details-panel", {
            right: "-50%",
            bottom: "-50%",
            duration: 0.5,
            ease: "power2.in"
        });

        // Hide active slot when closing
        if (activeSlotRef.current) {
            activeSlotRef.current.classList.remove('visible');
        }

        // Animate card back to hand with "Vacuum Snap" physics
        gsap.to(card, {
            x: pos.x,
            y: pos.y,
            rotation: pos.rotation,
            scale: 1,
            opacity: 1,
            zIndex: 10 + index,
            duration: 0.7, // Slower to see the effect
            ease: "back.out(2.0)", // Stronger Snap
            onComplete: () => {
                setActiveProject(null);
                setFocusedIndex(null);
                onActiveProjectChange?.(null);
                // Reset tilts
                const tiltInner = card.querySelector('.card-tilt-inner');
                if (tiltInner) gsap.set(tiltInner, { rotateX: 0, rotateY: 0 });
            }
        });

        // Restore all cards to full visibility
        handRefs.current.forEach((c) => {
            if (c) {
                gsap.to(c, {
                    filter: "blur(0px) brightness(1)",
                    opacity: 1,
                    scale: 1,
                    duration: 0.4
                });
            }
        });
    };

    // FOLD ANIMATION - Simple slide back to hand
    const handleFold = () => {
        if (focusedIndex === null || isTransitioning) return;

        const index = focusedIndex;
        const card = handRefs.current[index];
        if (!card || !containerRef.current) return;

        setIsTransitioning(true);

        const containerRect = containerRef.current.getBoundingClientRect();
        const pos = getHandPosition(index, hand.length, containerRect.width, containerRect.height);

        // Get elements
        const actions = card.querySelector('.action-buttons') as HTMLElement;
        const tiltInner = card.querySelector('.card-tilt-inner') as HTMLElement;
        const glare = card.querySelector('.card-glare-overlay') as HTMLElement;

        // Kill all existing animations
        gsap.killTweensOf([card, tiltInner, actions, glare]);

        const tl = gsap.timeline({
            onComplete: () => {
                setFocusedIndex(null);
                setIsTransitioning(false);
                if (actions) gsap.set(actions, { opacity: 0, y: 20 });
            }
        });

        // 1. Instant hide UI
        if (actions) tl.set(actions, { opacity: 0 }, 0);
        if (glare) tl.set(glare, { opacity: 0 }, 0);

        // 2. Spin and return to hand simultaneously
        if (tiltInner) {
            tl.to(tiltInner, {
                rotateY: "+=720", // 2 full flips
                rotateX: 0,
                duration: 0.4,
                ease: "power2.inOut"
            }, 0);
        }

        // 3. Slide back to hand position (same duration as spin)
        tl.to(card, {
            x: pos.x,
            y: pos.y,
            rotation: pos.rotation,
            scale: 1,
            zIndex: 10 + index,
            duration: 0.4,
            ease: "power3.out"
        }, 0);
        
        // 4. Reset rotation to 0 at the end (720° = 0° visually)
        tl.set(tiltInner, { rotateY: 0 });

        // Restore others
        handRefs.current.forEach((c, i) => {
            if (i !== index && c) {
                gsap.to(c, {
                    opacity: 1,
                    scale: 1,
                    filter: "none",
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });
    };

    // PLAY ANIMATION (Move to Active Slot) - "Dealer Toss" Physics 
    const handlePlay = () => {
        if (focusedIndex === null || isTransitioning) return;

        const index = focusedIndex;
        const card = handRefs.current[index];
        const project = hand[index];

        if (!card || !containerRef.current || !activeSlotRef.current) return;

        setIsTransitioning(true);

        // Show active slot when playing a card
        if (activeSlotRef.current) {
            activeSlotRef.current.classList.add('visible');
        }

        const actions = card.querySelector('.action-buttons') as HTMLElement;
        const tiltInner = card.querySelector('.card-tilt-inner') as HTMLElement;
        const glare = card.querySelector('.card-glare-overlay') as HTMLElement;

        // Kill all existing animations immediately
        gsap.killTweensOf([card, tiltInner, actions, glare]);

        const slotRect = activeSlotRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const targetX = slotRect.left - containerRect.left;
        const targetY = slotRect.top - containerRect.top;

        // "Dealer Toss" play sequence
        const tl = gsap.timeline({
            onComplete: () => {
                setActiveProject(project);
                setFocusedIndex(null); // Clear focus so CSS glare doesn't stick
                setIsTransitioning(false);
                onActiveProjectChange?.(project);
                if (actions) gsap.set(actions, { opacity: 0, y: 20 });

                // Impact "Thud" effect - subtle settle
                gsap.to(card, { scale: 1, duration: 0.2, ease: "power2.out" });

                // Slide in details panel FAST
                gsap.to(".details-panel", {
                    right: 0,
                    bottom: 0,
                    duration: 0.5,
                    ease: "power3.out"
                });
            }
        });

        // 1. Prepare
        if (actions) tl.to(actions, { opacity: 0, duration: 0.1 }, 0);
        if (glare) tl.set(glare, { opacity: 0 }, 0);
        if (tiltInner) tl.to(tiltInner, { rotateY: 0, rotateX: 0, duration: 0.2 }, 0);

        // 2. "Slingshot" Sequence
        // Phase A: Pull Back (Anticipation)
        const randomRot = (Math.random() * 6) - 3;

        tl.to(card, {
            scale: 0.85, // Compress energy
            y: "+=30", // Pull down slightly
            rotation: randomRot * 2,
            duration: 0.25,
            ease: "back.in(2.0)"
        }, 0)

            // Phase B: Shoot (Release)
            .to(card, {
                x: targetX,
                y: targetY,
                rotation: randomRot,
                scale: 1.1, // Zoom in fly
                zIndex: 50,
                duration: 0.35,
                ease: "power4.out" // High velocity
            })

            // Phase C: Impact Slam
            .to(card, {
                scale: 1.0,
                duration: 0.1,
                ease: "power2.in",
                onStart: () => {
                    // SCREEN SHAKE IMPACT
                    gsap.to(containerRef.current, {
                        y: 3, // Initial jolt down
                        duration: 0.05,
                        yoyo: true,
                        repeat: 3,
                        onComplete: () => { gsap.set(containerRef.current, { y: 0 }); }
                    });

                    // SHOCKWAVE RIPPLE
                    const ripple = activeSlotRef.current?.querySelector('.impact-ripple');
                    if (ripple) {
                        gsap.fromTo(ripple,
                            { scale: 0.5, opacity: 0.8, borderColor: "rgba(16, 185, 129, 0.8)" },
                            { scale: 2.5, opacity: 0, duration: 0.6, ease: "power2.out" }
                        );
                    }
                }
            });

        // Hide other cards smoothly but quickly
        handRefs.current.forEach((c, i) => {
            if (i !== index && c) {
                gsap.to(c, {
                    opacity: 0.3,
                    scale: 0.9,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    };


    // DRAW CARD - Draw a new card from deck into hand
    const handleDraw = () => {
        // Don't draw if currently dealing, focused on a card, or have an active project
        if (isDealing || focusedIndex !== null || activeProject) return;

        // Check if there are cards in the deck
        if (deck.length === 0) return;

        // Check if hand is full (max 5 cards)
        if (hand.length >= 5) return;

        // Draw top card from deck
        const newCard = deck[0];
        const newDeck = deck.slice(1);
        const newHand = [...hand, newCard];

        setDeck(newDeck);
        setHand(newHand);

        // Animate the new card being dealt
        setIsDealing(true);
        setTimeout(() => {
            if (!containerRef.current || !deckRef.current) return;

            const deckRect = deckRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const newIndex = newHand.length - 1;
            const card = handRefs.current[newIndex];

            if (!card) {
                setIsDealing(false);
                return;
            }

            const startX = deckRect.left - containerRect.left;
            const startY = deckRect.top - containerRect.top;
            const pos = getHandPosition(newIndex, newHand.length, containerRect.width, containerRect.height);
            const tiltInner = card.querySelector('.card-tilt-inner');

            // Start position (at deck)
            gsap.set(card, {
                x: startX,
                y: startY,
                rotation: 0,
                scale: 0.9,
                opacity: 0,
                zIndex: 10 + newIndex
            });

            // Set face down on inner element
            if (tiltInner) {
                gsap.set(tiltInner, { rotateY: 180 });
            }

            // Animate to hand position
            const tl = gsap.timeline({
                onComplete: () => {
                    setIsDealing(false);
                    // Re-position all cards in hand for proper arc
                    repositionHand(newHand.length);
                }
            });

            tl.to(card, { opacity: 1, duration: 0.1 })
                .to(card, {
                    x: pos.x,
                    y: pos.y,
                    rotation: pos.rotation,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out"
                });

            // Flip face up on tiltInner
            if (tiltInner) {
                tl.to(tiltInner, {
                    rotateY: 0,
                    duration: 0.4,
                    ease: "back.out(1.2)"
                }, "-=0.2");
            }
        }, 100);
    };

    // Reposition all cards in hand for proper arc spacing
    const repositionHand = (total: number) => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();

        handRefs.current.forEach((card, i) => {
            if (!card || i >= total) return;
            const pos = getHandPosition(i, total, containerRect.width, containerRect.height);
            gsap.to(card, {
                x: pos.x,
                y: pos.y,
                rotation: pos.rotation,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    };

    // Helper: Position Calculation (Refined for better arc)
    const getHandPosition = (index: number, total: number, w: number, h: number) => {
        const cardW = 240;

        // Revised Arc Math
        // We want a nice consistent fan at the bottom
        // Fixed radius usually works better than dynamic for consistency
        const arcRadius = 1500; // Large radius for subtle curve
        const centerArcX = w / 2;
        const centerArcY = h + arcRadius - 200; // Center is WAY below screen

        // Spread degrees
        const spreadMax = 40; // Max spread in degrees
        const spreadPerCard = 6;
        const totalSpread = Math.min(spreadMax, (total - 1) * spreadPerCard);

        const startDeg = -totalSpread / 2;
        const step = total > 1 ? totalSpread / (total - 1) : 0;

        const deg = startDeg + index * step;
        const rad = (deg - 90) * (Math.PI / 180); // 0 is right, -90 is up

        const x = centerArcX + arcRadius * Math.cos(rad) - cardW / 2;
        const y = centerArcY + arcRadius * Math.sin(rad) - 340; // Offset

        return { x, y, rotation: deg };
    };

    return (
        <div
            className="casino-table-container"
            ref={containerRef}
            onMouseMove={handleGlobalMouseMove}
        >
            {/* Table Trim */}
            < div className="table-trim" />
            <div className="table-spotlight" /> {/* New Lighting Layer */}

            {/* Visual Deck Stack */}
            <div
                ref={deckRef}
                className="deck-stack absolute top-[15%] right-[10%] w-[260px] h-[360px] perspective-1000 z-30 cursor-pointer"
                onClick={handleDraw}
            >
                {/* Simulated Stack Layers */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 bg-neutral-900 border border-white/10 rounded-2xl shadow-xl pointer-events-none"
                        style={{
                            transform: `translate(${i * 2}px, ${-i * 2}px)`,
                            zIndex: i,
                            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0, rgba(255, 255, 255, 0.02) 2px, transparent 2px, transparent 8px)'
                        }}
                    />
                ))}

                {/* Top Card (Interactive) */}
                <div
                    className="absolute inset-0 bg-neutral-800 border border-white/20 rounded-2xl shadow-2xl flex flex-col items-center justify-center hover:bg-neutral-800/80 transition-colors pointer-events-none"
                    style={{
                        transform: `translate(10px, -10px)`,
                        zIndex: 10
                    }}
                >
                    <div className="text-white/30 font-bold tracking-widest text-lg">PROJECTS</div>
                    <div className="text-white/10 text-6xl font-black mt-2">{deck.length}</div>

                    {/* Hover Hint */}
                    <div className="absolute bottom-6 text-emerald-500/50 text-xs uppercase tracking-wider">
                        {deck.length > 0 && hand.length < 5 ? 'Click to Draw' : deck.length === 0 ? 'Empty' : 'Hand Full'}
                    </div>
                </div>
            </div >

            {/* Active Slot */}
            <div ref={activeSlotRef} className="active-slot">
                <div className="impact-ripple" />
            </div>

            {/* Hand Area */}
            {
                hand.map((project, index) => (
                    project && (
                        <PokerCard
                            key={`${project.common}-${index}`}
                            ref={el => { handRefs.current[index] = el; }}
                            project={project}
                            index={index}
                            isActive={activeProject === project}
                            isFocused={focusedIndex === index}
                            isInHand={true}
                            wasPlayed={playedIndices.has(index)}
                            onClick={() => handleInspect(index)}
                            onFold={handleFold}
                            onPlay={handlePlay}
                            style={{ opacity: 0 }}
                        />
                    )
                ))
            }

            {/* Details Panel */}
            <div className="details-panel">
                {activeProject && (
                    <div className="text-white space-y-6 h-full flex flex-col p-2">
                        <div>
                            <span className={cn(
                                "inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-emerald-500/30 text-emerald-400",
                                getBadgeClass(activeProject.binomial)
                            )}>
                                {activeProject.binomial}
                            </span>
                            <h1 className="text-4xl font-bold mb-2 tracking-tight">{activeProject.common}</h1>
                            <p className="text-xl text-gray-400 font-light leading-relaxed">{activeProject.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {activeProject.features.map((f, i) => (
                                <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-start hover:bg-white/10 transition-colors">
                                    <Check size={16} className="text-emerald-500 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-300">{f}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
                            <div className="flex gap-4">
                                <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95">
                                    Launch Project <ExternalLink size={18} className="ml-2" />
                                </button>
                                <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-bold flex items-center justify-center transition-all hover:bg-white/10 active:scale-95">
                                    Code <Github size={18} className="ml-2" />
                                </button>
                            </div>
                            <button
                                onClick={handleCloseActive}
                                className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 py-2.5 rounded-xl font-medium flex items-center justify-center transition-all border border-red-500/30 active:scale-95"
                            >
                                <X size={18} className="mr-2" /> Close & Return to Hand
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

// Utility for badge classes
export const getBadgeClass = (category: string) => {
    switch (category) {
        case 'Frontend': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'Fullstack': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        case 'Backend': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        case 'Mobile': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        case 'Data Science': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
        case 'NLP': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
};
