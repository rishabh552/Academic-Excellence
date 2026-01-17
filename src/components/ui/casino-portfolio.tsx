import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { PokerCard, Project, WILD_CARD_PROJECT } from './poker-card';
import { useShowcaseOptional } from '@/context/ShowcaseContext';

// Register GSAP plugins
gsap.registerPlugin(MotionPathPlugin);
import { cn } from '@/lib/utils';
import './casino-portfolio.css';
import './dealer-chip.css';
import { Check, Github, ExternalLink, X, HelpCircle } from 'lucide-react';
import { ShowcaseTutorial } from './showcase-tutorial';

interface CasinoPortfolioProps {
    items: Project[];
    onActiveProjectChange?: (project: Project | null) => void;
}

export function CasinoPortfolio({ items, onActiveProjectChange }: CasinoPortfolioProps) {
    // STATE MACHINE
    const [deck, setDeck] = useState<Project[]>([]);
    const [hand, setHand] = useState<Project[]>([]);
    const [interestedPile, setInterestedPile] = useState<Project[]>([]); // Played cards (interested)
    const [rejectedPile, setRejectedPile] = useState<Project[]>([]); // Folded cards (rejected)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // Index in HAND
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null); // Track which card is in active slot
    const [isDealing, setIsDealing] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false); // Prevent double clicks
    const [isMobile, setIsMobile] = useState(false); // Responsive sizing
    const [shuffleCount, setShuffleCount] = useState(() => {
        // Persist table color across page navigations
        const saved = localStorage.getItem('showcase-shuffle-count');
        return saved ? parseInt(saved, 10) : 0;
    }); // Track shuffle number for color alternation
    const [isGameOver, setIsGameOver] = useState(false); // Track game-over state
    const [reshuffledCardIds, setReshuffledCardIds] = useState<Set<string>>(new Set()); // Track cards that have been reshuffled once
    const [isFirstShuffle, setIsFirstShuffle] = useState(true); // Track if this is the first shuffle (wild card forced to hand)
    const [activeFilter, setActiveFilter] = useState<string | null>(null); // Filter: null = all, or category name
    const [isPlayAnimating, setIsPlayAnimating] = useState(false); // Track when a card is being played (prevent Cash Out from appearing)
    const [showTutorial, setShowTutorial] = useState(false); // Tutorial modal visibility
    const navigate = useNavigate();
    const { addProject: addToShowcase, hasProjects, selectedProjects, clearProjects } = useShowcaseOptional();

    // Filter helper function
    const getFilteredItems = (allItems: Project[], filter: string | null): Project[] => {
        if (!filter) return allItems;
        return allItems.filter(p => p.binomial === filter);
    };

    // REFS
    const containerRef = useRef<HTMLDivElement>(null);
    const handRefs = useRef<(HTMLDivElement | null)[]>([]);
    const deckRef = useRef<HTMLDivElement>(null);
    const activeSlotRef = useRef<HTMLDivElement>(null);
    const interestedPileRef = useRef<HTMLDivElement>(null); // Ref for interested pile
    const rejectedPileRef = useRef<HTMLDivElement>(null); // Ref for rejected pile
    const rippleLayerRef = useRef<HTMLDivElement>(null); // Ref for table ripple effect
    const pendingInspectRef = useRef<number | null>(null); // Track pending card to inspect
    const isAnimatingRef = useRef(false); // Synchronous guard against rapid clicks (prevents glitch on fold/play)

    // Initialize Game
    useEffect(() => {
        // Apply filter to items
        const filteredItems = getFilteredItems([...items], activeFilter);

        // Filter out projects that are already saved in the ShowcaseContext
        const savedProjectNames = new Set(selectedProjects.map(p => p.common));
        const alreadySaved = filteredItems.filter(item => savedProjectNames.has(item.common));
        const availableItems = filteredItems.filter(item => !savedProjectNames.has(item.common));

        // Handle empty filter result
        if (availableItems.length === 0) {
            setHand([]);
            setDeck([]);
            setInterestedPile(alreadySaved);
            setRejectedPile([]);
            return;
        }

        // Deal 5 regular projects to hand first
        const initialHandSize = Math.min(5, availableItems.length);
        const initialHand = availableItems.slice(0, initialHandSize);
        const remainingProjects = availableItems.slice(initialHandSize);

        // Add Wild Card at FRONT of remaining deck (so it's first pick when drawing)
        const remainingDeck = [WILD_CARD_PROJECT, ...remainingProjects];

        setHand(initialHand);
        setDeck(remainingDeck);
        setInterestedPile(alreadySaved); // Pre-populate with already saved projects
        setRejectedPile([]); // Reset rejected pile on init

        // Trigger deal animation on mount (only if we have cards to deal)
        if (initialHandSize > 0) {
            dealCards(initialHandSize);
        }
    }, [items, activeFilter]); // Run when items or filter changes

    // Restore table color on mount based on saved shuffleCount
    useEffect(() => {
        if (shuffleCount > 0 && containerRef.current) {
            const isBluePhase = shuffleCount % 2 === 1;
            containerRef.current.classList.remove('table-ripple-blue', 'table-ripple-red');
            if (isBluePhase) {
                containerRef.current.classList.add('table-ripple-blue');
            } else {
                containerRef.current.classList.add('table-ripple-red');
            }
        }
    }, []); // Run once on mount

    // Detect Mobile & Handle Resize + Reposition Hand
    useEffect(() => {
        const checkMobile = () => {
            const wasMobile = isMobile;
            const nowMobile = window.innerWidth < 768;
            setIsMobile(nowMobile);

            // If screen size category changed, reposition hand after state updates
            if (wasMobile !== nowMobile && hand.length > 0) {
                setTimeout(() => repositionHand(hand.length), 100);
            }
        };
        checkMobile(); // Initial check
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [isMobile, hand.length]);

    // Auto-shuffle and deal when hand is empty and no active project
    // Per-card reshuffle tracking: cards can only be reshuffled ONCE each
    useEffect(() => {
        const cardsInDeck = deck.length;

        // Split rejected pile: cards that CAN be reshuffled vs cards that CANNOT
        const eligibleForReshuffle = rejectedPile.filter(card => !reshuffledCardIds.has(card.common));

        if (hand.length === 0 && !isDealing && !activeProject && !isTransitioning && !isGameOver) {
            if (cardsInDeck > 0) {
                // Still have cards in deck - deal from deck
                const timer = setTimeout(() => {
                    performShuffleAnimation();
                }, 300);
                return () => clearTimeout(timer);
            } else if (eligibleForReshuffle.length > 0) {
                // Deck empty, but we have cards that haven't been reshuffled yet
                // Trigger shuffle animation - dealNewHand will handle the filtering and reshuffling logic
                const timer = setTimeout(() => {
                    performShuffleAnimation();
                }, 300);
                return () => clearTimeout(timer);
            } else {
                // Deck empty AND no cards eligible for reshuffle
                // GAME OVER
                const timer = setTimeout(() => {
                    setIsGameOver(true);
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [hand.length, isDealing, activeProject, isTransitioning, rejectedPile, deck.length, reshuffledCardIds, isGameOver]);

    // Restart game - reset all state to initial
    const restartGame = () => {
        setIsGameOver(false);
        setReshuffledCardIds(new Set()); // Reset per-card reshuffle tracking
        setIsFirstShuffle(true); // Reset so wild card priority works again

        // Clear saved projects from localStorage
        clearProjects();

        // Reset all piles
        setInterestedPile([]);
        setRejectedPile([]);
        setDeck([]);
        setHand([]);
        setFocusedIndex(null);
        setActiveProject(null);
        setActiveCardIndex(null);

        // Clear localStorage shuffle count
        localStorage.removeItem('showcase-shuffle-count');
        setShuffleCount(0);

        // Reinitialize with filtered items
        const filteredItems = getFilteredItems([...items], activeFilter);
        const initialHandSize = Math.min(5, filteredItems.length);
        const initialHand = filteredItems.slice(0, initialHandSize);
        const remainingProjects = filteredItems.slice(initialHandSize);

        // Add wild card at front of deck (same as initialization)
        const remainingDeck = [WILD_CARD_PROJECT, ...remainingProjects];

        setHand(initialHand);
        setDeck(remainingDeck);

        // Trigger deal animation
        if (initialHandSize > 0) {
            setTimeout(() => dealCards(initialHandSize), 100);
        }
    };

    // Handle filter change - reset game with new filter
    const handleFilterChange = (filter: string | null) => {
        setActiveFilter(filter);
        setIsGameOver(false);
        setReshuffledCardIds(new Set());
        setIsFirstShuffle(true);
        setRejectedPile([]);
        setFocusedIndex(null);
        setActiveProject(null);
        setActiveCardIndex(null);
        // The useEffect will handle reinitializing with the new filter
    };

    // Handle "View All Projects" from filtered game over
    const handleViewAllProjects = () => {
        setActiveFilter(null);
        setIsGameOver(false);
        setReshuffledCardIds(new Set());
        setIsFirstShuffle(true);
        // useEffect will reinitialize with all items
    };

    // Handle leave game / cash out - navigate based on saved projects count
    const handleLeaveGame = () => {
        if (interestedPile.length >= 1) {
            navigate('/start-project?step=3'); // Project wizard (have saved projects)
        } else {
            navigate('/pricing'); // Pricing page (no projects saved)
        }
    };

    // Visual shuffle animation
    const performShuffleAnimation = () => {
        if (!containerRef.current || !deckRef.current || isDealing) return;

        setIsDealing(true);

        // If hand is empty, skip fly-to-deck animation and go straight to shuffle
        if (hand.length === 0) {
            shuffleDeckAnimation();
            return;
        }

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

    // Deck shuffle animation - SPLIT & RIFFLE with Table Ripple Effect
    const shuffleDeckAnimation = () => {
        if (!deckRef.current || !containerRef.current) return;

        // Increment shuffle count for color alternation and persist to localStorage
        const newShuffleCount = shuffleCount + 1;
        setShuffleCount(newShuffleCount);
        localStorage.setItem('showcase-shuffle-count', String(newShuffleCount));

        // Determine which color scheme to use:
        // Odd shuffles (1, 3, 5...) = Dark Blue
        // Even shuffles (2, 4, 6...) = Premium Red
        const isBluePhase = newShuffleCount % 2 === 1;

        // === TRIGGER PREMIUM TABLE RIPPLE EFFECT ===
        if (rippleLayerRef.current && containerRef.current) {
            const layer = rippleLayerRef.current;
            const container = containerRef.current;

            // Remove previous color classes
            container.classList.remove('table-ripple-blue', 'table-ripple-red', 'table-ripple-active');
            layer.classList.remove('ripple-blue', 'ripple-red');

            // Activate ripple layer animation with appropriate color
            layer.classList.add('active');
            if (isBluePhase) {
                container.classList.add('table-ripple-blue');
                layer.classList.add('ripple-blue');
            } else {
                container.classList.add('table-ripple-red');
                layer.classList.add('ripple-red');
            }

            // Reset animations by cloning and replacing children for fresh animation
            const children = layer.querySelectorAll('.ripple-wave, .ripple-center-glow, .table-color-shift');
            children.forEach(child => {
                const clone = child.cloneNode(true) as HTMLElement;
                child.parentNode?.replaceChild(clone, child);
            });

            // Remove ripple animation layer after effect completes
            // NOTE: table color class stays on container permanently
            setTimeout(() => {
                layer.classList.remove('active');
            }, 800);
        }

        // Make any remaining cards invisible (they're now "in" the deck)
        handRefs.current.forEach(card => {
            if (card) gsap.set(card, { opacity: 0 });
        });

        const deckStack = deckRef.current;
        const deckRect = deckStack.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Create a temporary "split" packet for the riffle effect
        const splitStack = document.createElement('div');
        splitStack.className = 'deck-stack-split';
        // Copy styles from main deck approx
        splitStack.style.cssText = `
            position: absolute;
            width: ${deckRect.width}px;
            height: ${deckRect.height}px;
            background: #171717; /* neutral-900 */
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 29;
            pointer-events: none;
            left: ${deckRect.left - containerRect.left}px;
            top: ${deckRect.top - containerRect.top}px;
            background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0, rgba(255, 255, 255, 0.02) 2px, transparent 2px, transparent 8px);
        `;
        containerRef.current.appendChild(splitStack);

        const shuffleTl = gsap.timeline({
            onComplete: () => {
                // Cleanup
                if (splitStack.parentNode) splitStack.parentNode.removeChild(splitStack);
                // After shuffle animation, deal new cards
                dealNewHand();
            }
        });

        // 1. Split the deck
        shuffleTl
            .to(splitStack, {
                x: "-=60",
                rotation: -5,
                duration: 0.25,
                ease: "power2.out"
            })
            .to(deckStack, {
                x: "+=60",
                rotation: 5,
                duration: 0.25,
                ease: "power2.out"
            }, "<")

            // 2. Riffle (Wiggle both)
            .to([splitStack, deckStack], {
                y: "-=10",
                duration: 0.1,
                yoyo: true,
                repeat: 3
            })
            .to(splitStack, {
                rotation: -2,
                duration: 0.05,
                yoyo: true,
                repeat: 5
            }, "-=0.4")
            .to(deckStack, {
                rotation: 2,
                duration: 0.05,
                yoyo: true,
                repeat: 5
            }, "-=0.4")

            // 3. Merge
            .to(splitStack, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.3,
                ease: "power3.in"
            })
            .to(deckStack, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 0.3,
                ease: "power3.in"
            }, "<")

            // 4. Final squaring up
            .to(deckStack, {
                scale: 1.05,
                duration: 0.1
            })
            .to(deckStack, {
                scale: 1,
                duration: 0.15,
                ease: "power2.out"
            });
    };

    // Deal new shuffled hand
    const dealNewHand = () => {
        // Split rejected pile: cards that CAN be reshuffled vs cards that CANNOT (One Second Chance)
        const eligibleForReshuffle = rejectedPile.filter(card => !reshuffledCardIds.has(card.common));
        const permanentlyRejected = rejectedPile.filter(card => reshuffledCardIds.has(card.common));

        // Mark eligible cards as "reshuffled" so they won't be eligible next time
        if (eligibleForReshuffle.length > 0) {
            const newReshuffledIds = new Set(reshuffledCardIds);
            eligibleForReshuffle.forEach(card => newReshuffledIds.add(card.common));
            setReshuffledCardIds(newReshuffledIds);
        }

        // Shuffle deck + ONLY eligible rejected cards
        const cardsToShuffle = [...deck, ...eligibleForReshuffle];
        let shuffled = shuffleArray(cardsToShuffle);

        // Separate wild card from other cards
        const wildCard = shuffled.find(p => p.type === 'wildcard');
        const otherCards = shuffled.filter(p => p.type !== 'wildcard');

        // On FIRST shuffle: Force wild card to front (guaranteed in hand)
        // On SUBSEQUENT shuffles: Wild card shuffles naturally
        if (wildCard) {
            if (isFirstShuffle) {
                // First shuffle - wild card goes to FRONT (forced to hand)
                shuffled = [wildCard, ...otherCards];
                setIsFirstShuffle(false); // Mark first shuffle as done
            } else {
                // Subsequent shuffles - wild card shuffles naturally (already in shuffled array)
                shuffled = shuffleArray([wildCard, ...otherCards]);
            }
        }

        // Deal new hand from shuffled cards
        const newHandSize = Math.min(5, shuffled.length);
        const newHand = shuffled.slice(0, newHandSize);
        const newDeck = shuffled.slice(newHandSize);

        // Reset state
        setRejectedPile(permanentlyRejected); // KEEP permanent rejects in the pile
        setHand(newHand);
        setDeck(newDeck);

        // Trigger deal animation after a short delay for state to update
        setTimeout(() => {
            dealCards(newHandSize);
        }, 150);
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

        // Kill animations and glare immediately - also bypass CSS transition to prevent flash
        gsap.killTweensOf([card, tiltInner, actions, glare]);
        if (glare) gsap.set(glare, { opacity: 0, visibility: 'hidden', transition: 'none' });

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
                if (glare) gsap.set(glare, { opacity: 0, visibility: 'hidden', transition: 'none' }); // Kill ALL glare immediately - bypass CSS transition
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
            gsap.set(glare, { opacity: 0, visibility: 'hidden', transition: 'none' }); // No rainbow during pick - bypass CSS transition
        }

        const containerRect = containerRef.current.getBoundingClientRect();

        // Responsive positioning - use consistent breakpoints with getHandPosition
        const viewportWidth = window.innerWidth;
        const isMobileNow = viewportWidth < 768;
        const isTabletNow = viewportWidth >= 768 && viewportWidth < 1200;
        const aspectRatio = containerRect.width / containerRect.height;

        let centerX: number;
        let centerY: number;
        let cardScale: number;

        if (isMobileNow) {
            // Mobile: Position card in the middle area, below the deck
            const cardWidth = 165; // Mobile card width
            centerX = (containerRect.width / 2) - (cardWidth / 2);
            centerY = containerRect.height * 0.35; // 35% from top - below deck area
            cardScale = 1.3;
        } else if (isTabletNow) {
            // Tablet (768-1200px): Use aspect ratio for landscape vs portrait
            const isLandscape = aspectRatio > 1.1;

            if (isLandscape) {
                // Tablet Landscape: Smaller card, higher position
                const cardWidth = 160;
                centerX = (containerRect.width / 2) - (cardWidth / 2);
                centerY = containerRect.height * 0.15; // Higher up for landscape
                cardScale = 1.2;
            } else {
                // Tablet Portrait: Standard tablet sizing
                const cardWidth = 200;
                centerX = (containerRect.width / 2) - (cardWidth / 2);
                centerY = (containerRect.height / 2) - 160;
                cardScale = 1.4;
            }
        } else {
            // Desktop: Original centered positioning
            centerX = containerRect.width / 2 - 130;
            centerY = containerRect.height / 2 - 200;
            cardScale = 1.5;
        }

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
            scale: cardScale,
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

    // FOLD ANIMATION - "Vader's Force Pull" to REJECTED PILE
    const handleFold = () => {
        // Synchronous guard - prevents rapid clicks from triggering multiple animations
        if (isAnimatingRef.current) return;
        if (focusedIndex === null || isTransitioning) return;

        // Set synchronous guard immediately
        isAnimatingRef.current = true;

        const index = focusedIndex;
        const card = handRefs.current[index];
        const foldedProject = hand[index];

        if (!card || !containerRef.current || !rejectedPileRef.current) return;

        setIsTransitioning(true);

        const containerRect = containerRef.current.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const rejectedRect = rejectedPileRef.current.getBoundingClientRect();

        // Get CURRENT card position (where it is now, focused/inspected)
        const startX = cardRect.left - containerRect.left;
        const startY = cardRect.top - containerRect.top;

        // Target: Rejected pile position (smaller pile)
        const targetX = rejectedRect.left - containerRect.left;
        const targetY = rejectedRect.top - containerRect.top;
        const targetScale = isMobile ? 0.4 : 0.5;

        // Get elements
        const actions = card.querySelector('.action-buttons') as HTMLElement;
        const tiltInner = card.querySelector('.card-tilt-inner') as HTMLElement;
        const glare = card.querySelector('.card-glare-overlay') as HTMLElement;

        // --- SITH FX LAYER SETUP ---
        const fxLayer = document.createElement('div');
        fxLayer.className = 'sith-fx-layer';
        fxLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:400;';
        containerRef.current.appendChild(fxLayer);

        // Calculate pile center for plasma positioning
        const pileCenterX = targetX + (rejectedRect.width / 2);
        const pileCenterY = targetY + (rejectedRect.height / 2);

        // 1. Red Plasma - POSITIONED AT REJECTED PILE (the attractor/magnet)
        // Size matches the pile dimensions
        const plasma = document.createElement('div');
        plasma.className = 'sith-plasma';
        fxLayer.appendChild(plasma);
        // Set plasma size to match pile and position it exactly on pile
        gsap.set(plasma, {
            x: targetX,
            y: targetY,
            width: rejectedRect.width,
            height: rejectedRect.height,
            opacity: 0,
            scale: 0.5
        });

        // 2. Dark Shadow - stays at card for dark aura effect
        const shadow = document.createElement('div');
        shadow.className = 'sith-shadow';
        fxLayer.appendChild(shadow);
        const fxOffsetX = isMobile ? 10 : 20;
        const fxOffsetY = isMobile ? 5 : 10;
        gsap.set(shadow, { x: startX - fxOffsetX, y: startY - fxOffsetY, opacity: 0 });

        // 3. Impact ripple - CENTERED at rejected pile (ground shadow effect)
        const impact = document.createElement('div');
        impact.className = 'sith-impact';
        fxLayer.appendChild(impact);
        // Impact is 400x120 on desktop, 180x50 on mobile - center it under the pile
        const impactWidth = isMobile ? 180 : 400;
        const impactHeight = isMobile ? 50 : 120;
        const impactX = targetX + (rejectedRect.width / 2) - (impactWidth / 2);
        const impactY = targetY + rejectedRect.height - (impactHeight / 3); // Positioned at pile's "floor"
        gsap.set(impact, { x: impactX, y: impactY, opacity: 0, scale: 0.3, transformOrigin: 'center center' });

        // Kill existing tweens
        gsap.killTweensOf([card, tiltInner, actions, glare]);

        // LOCK starting position and ensure card is visible with high z-index
        // CRITICAL: Reset filter to prevent black flash from residual filter values
        gsap.set(card, {
            x: startX,
            y: startY,
            opacity: 1,
            zIndex: 500,
            rotation: 0,
            filter: 'none'
        });

        const tl = gsap.timeline({
            onComplete: () => {
                // Clear the ref for removed card
                handRefs.current[index] = null;
                const newTotal = hand.length - 1;

                // STATE UPDATES: Remove from hand, add to rejected pile
                setHand(prev => prev.filter((_, i) => i !== index));
                setRejectedPile(prev => [...prev, foldedProject]);
                setFocusedIndex(null);
                // NOTE: setIsTransitioning(false) is now called AFTER repositioning completes (see below)

                // Cleanup FX
                if (fxLayer.parentNode) fxLayer.remove();

                // Reposition remaining cards in hand
                setTimeout(() => {
                    if (!containerRef.current) {
                        setIsTransitioning(false);
                        isAnimatingRef.current = false;
                        return;
                    }
                    const newContainerRect = containerRef.current.getBoundingClientRect();
                    const validRefs = handRefs.current.filter((c): c is HTMLDivElement => c !== null && c.isConnected);

                    // Track animation completions to know when all cards are repositioned
                    let completedCount = 0;
                    const totalToAnimate = validRefs.length;

                    // If no cards to animate, unlock immediately
                    if (totalToAnimate === 0) {
                        handRefs.current = validRefs;
                        setIsTransitioning(false);
                        isAnimatingRef.current = false;
                        return;
                    }

                    validRefs.forEach((c, newIndex) => {
                        const pos = getHandPosition(newIndex, newTotal, newContainerRect.width, newContainerRect.height);
                        gsap.to(c, {
                            x: pos.x,
                            y: pos.y,
                            rotation: pos.rotation,
                            opacity: 1,
                            scale: 1,
                            filter: "none",
                            duration: 0.4,
                            ease: "power2.out",
                            onComplete: () => {
                                completedCount++;
                                // Only unlock transitions when ALL cards have finished repositioning
                                if (completedCount === totalToAnimate) {
                                    setIsTransitioning(false);
                                    isAnimatingRef.current = false;
                                }
                            }
                        });
                    });
                    handRefs.current = validRefs;
                }, 100);
            }
        });

        // Phase 1: Hide buttons, flip back (0-0.2s)
        if (actions) tl.set(actions, { opacity: 0 }, 0);
        if (glare) tl.set(glare, { opacity: 0, visibility: 'hidden', transition: 'none' }, 0);

        if (tiltInner) {
            tl.to(tiltInner, { rotateY: 0, rotateX: 0, duration: 0.2, ease: "power2.out" }, 0);
        }

        // === PLASMA AT PILE - The attractor/magnet effect ===
        // Plasma appears at rejected pile, pulsing to indicate "pulling"
        tl.to(plasma, {
            opacity: 0.6,
            scale: 0.8,
            duration: 0.2,
            ease: "power2.out"
        }, 0);

        // Plasma pulses - grows as it's "pulling"
        tl.to(plasma, {
            opacity: 0.9,
            scale: 1.2,
            duration: 0.15,
            ease: "power2.out"
        }, 0.2);

        tl.to(plasma, {
            opacity: 0.7,
            scale: 1.0,
            duration: 0.1,
            ease: "power2.in"
        }, 0.35);

        // Intensify as card approaches
        tl.to(plasma, {
            opacity: 1,
            scale: 1.4,
            duration: 0.25,
            ease: "power2.out"
        }, 0.45);

        // Phase 2: THE GRIP - Card gets red glow (being pulled) with shake (0-0.5s)
        // Dark shadow aura at card
        tl.to(shadow, { opacity: 0.7, scale: 1.1, duration: 0.25, ease: "power2.out" }, 0);
        tl.to(shadow, { opacity: 0, duration: 0.2 }, 0.4); // Shadow fades as card leaves

        // Card Levitate with RED GLOW (indicating being pulled)
        tl.to(card, {
            scale: 1.1,
            y: startY - 15,
            boxShadow: "0 0 50px rgba(255, 0, 0, 0.7), 0 0 80px rgba(255, 50, 50, 0.4)",
            duration: 0.3,
            ease: "power2.out"
        }, 0);

        // Shake effect - card resisting the pull
        if (tiltInner) {
            tl.to(tiltInner, { x: 4, rotateZ: 2, duration: 0.05 }, 0.1)
                .to(tiltInner, { x: -4, rotateZ: -2, duration: 0.05 })
                .to(tiltInner, { x: 3, rotateZ: 1, duration: 0.05 })
                .to(tiltInner, { x: -3, rotateZ: -1, duration: 0.05 })
                .to(tiltInner, { x: 0, rotateZ: 0, duration: 0.04 });
        }

        // Intensify red glow before pull - card about to be yanked
        tl.to(card, {
            boxShadow: "0 0 70px rgba(255, 0, 0, 0.85), 0 0 100px rgba(255, 50, 50, 0.5)",
            scale: 0.95,
            duration: 0.12,
            ease: "power2.in"
        }, 0.35);

        // Phase 3: THE PULL - Card flies to pile with progressive shrinking (0.5s-1.0s)
        const cardCenterOffsetX = cardRect.width / 2;

        // Calculate midpoint for arc trajectory
        const midX = (startX + targetX) / 2;
        const midY = Math.min(startY, targetY) - 50; // Arc upward

        // Card FOLLOWS plasma with progressive shrinking
        // Phase 3a: Initial pull with slight shrink
        tl.to(card, {
            x: midX - cardCenterOffsetX / 2,
            y: midY,
            scale: 0.85,  // Start shrinking
            rotation: Math.random() * 15 - 7.5,
            boxShadow: "0 0 60px rgba(255, 0, 0, 0.7), 0 0 100px rgba(255, 50, 50, 0.4)",
            duration: 0.2,
            ease: "power2.out"
        }, 0.52);

        // Phase 3b: Accelerate toward pile with more shrinking
        tl.to(card, {
            x: targetX,
            y: targetY,
            scale: targetScale * 0.9,  // Continue shrinking
            rotation: Math.random() * 10 - 5,
            boxShadow: "0 0 50px rgba(255, 0, 0, 0.6)",
            duration: 0.25,
            ease: "power3.in"
        }, 0.72);

        // Phase 3c: Final shrink to target scale
        tl.to(card, {
            scale: targetScale,
            duration: 0.08,
            ease: "power2.in"
        }, 0.95);

        // === Phase 4: IMPACT - EARTHQUAKE EFFECT (0.97s+) ===

        // Card final fade
        tl.to(card, {
            opacity: 0,
            scale: targetScale * 0.8,
            duration: 0.1,
            ease: "power2.in"
        }, 0.97);

        // Plasma implodes at pile (it's already positioned there - just shrink and fade)
        tl.to(plasma, {
            scale: 2.0,  // Brief flash expansion
            opacity: 1,
            duration: 0.05,
            ease: "power4.out"
        }, 0.95);

        tl.to(plasma, {
            scale: 0.2,
            opacity: 0,
            duration: 0.15,
            ease: "power4.in"
        }, 1.0);

        // === IMPACT RIPPLE - Multi-layered shockwave ===
        // Create second ripple for layered effect
        const impact2 = document.createElement('div');
        impact2.className = 'sith-impact';
        fxLayer.appendChild(impact2);
        gsap.set(impact2, {
            x: impactX,
            y: impactY,
            opacity: 0,
            scale: 0.5,
            transformOrigin: 'center center'
        });

        // Ripple 1: Fast inner burst
        tl.to(impact, {
            opacity: 1,
            scale: 1.2,
            duration: 0.06,
            ease: "power4.out"
        }, 0.97);

        // Ripple 2: Delayed outer wave
        tl.to(impact2, {
            opacity: 0.7,
            scale: 1,
            duration: 0.08,
            ease: "power4.out"
        }, 1.0);

        // Expand both ripples outward
        tl.to(impact, {
            opacity: 0.6,
            scale: 2.2,
            duration: 0.2,
            ease: "power2.out"
        }, 1.03);

        tl.to(impact2, {
            opacity: 0.4,
            scale: 2.8,
            duration: 0.25,
            ease: "power2.out"
        }, 1.08);

        // Final fade out
        tl.to([impact, impact2], {
            opacity: 0,
            scale: 3.5,
            duration: 0.3,
            ease: "power2.out"
        }, 1.2);

        // === EARTHQUAKE EFFECT on Container ===
        // Dramatic screen shake on impact
        tl.to(containerRef.current, {
            x: 8,
            duration: 0.03,
            ease: "power2.out"
        }, 0.97);
        tl.to(containerRef.current, {
            x: -12,
            y: 4,
            duration: 0.04,
            ease: "power2.inOut"
        }, 1.0);
        tl.to(containerRef.current, {
            x: 10,
            y: -3,
            duration: 0.04,
            ease: "power2.inOut"
        }, 1.04);
        tl.to(containerRef.current, {
            x: -6,
            y: 2,
            duration: 0.04,
            ease: "power2.inOut"
        }, 1.08);
        tl.to(containerRef.current, {
            x: 4,
            y: -1,
            duration: 0.03,
            ease: "power2.inOut"
        }, 1.12);
        tl.to(containerRef.current, {
            x: 0,
            y: 0,
            duration: 0.1,
            ease: "power2.out"
        }, 1.15);

        // === SITH SPARKS on impact ===
        const sparkCount = isMobile ? 8 : 14;

        tl.call(() => {
            for (let i = 0; i < sparkCount; i++) {
                const spark = document.createElement('div');
                spark.className = 'sith-spark';
                fxLayer.appendChild(spark);

                const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
                const distance = 50 + Math.random() * 80;
                const duration = 0.25 + Math.random() * 0.2;

                gsap.set(spark, {
                    x: pileCenterX - 1.5,
                    y: pileCenterY - 5,
                    opacity: 1,
                    scale: 0.8 + Math.random() * 0.4,
                    rotation: (angle * 180 / Math.PI) + 90
                });

                gsap.to(spark, {
                    x: pileCenterX + Math.cos(angle) * distance,
                    y: pileCenterY + Math.sin(angle) * distance,
                    opacity: 0,
                    scale: 0.2,
                    duration: duration,
                    ease: "power2.out",
                    onComplete: () => spark.remove()
                });
            }

            // Extra debris particles
            for (let i = 0; i < (isMobile ? 4 : 8); i++) {
                const debris = document.createElement('div');
                debris.className = 'sith-spark';
                debris.style.background = 'rgba(255, 100, 50, 0.9)';
                debris.style.width = '3px';
                debris.style.height = '3px';
                fxLayer.appendChild(debris);

                const angle = Math.random() * Math.PI * 2;
                const distance = 30 + Math.random() * 50;

                gsap.set(debris, {
                    x: pileCenterX,
                    y: pileCenterY,
                    opacity: 1
                });

                gsap.to(debris, {
                    x: pileCenterX + Math.cos(angle) * distance,
                    y: pileCenterY + Math.sin(angle) * distance - 20, // Slight upward arc
                    opacity: 0,
                    duration: 0.35,
                    ease: "power2.out",
                    onComplete: () => debris.remove()
                });
            }
        }, [], 0.97);

        // Rejected pile pulse + Sith aura - DRAMATIC IMPACT
        tl.to(rejectedPileRef.current, {
            scale: 1.18,
            boxShadow: "0 0 70px rgba(255, 0, 0, 0.8), 0 0 120px rgba(255, 30, 30, 0.5)",
            duration: 0.08,
            ease: "power4.out"
        }, 0.97);

        // Bounce back with oscillation
        tl.to(rejectedPileRef.current, {
            scale: 0.95,
            boxShadow: "0 0 40px rgba(255, 0, 0, 0.4)",
            duration: 0.1,
            ease: "power2.in"
        }, 1.05);

        tl.to(rejectedPileRef.current, {
            scale: 1.05,
            boxShadow: "0 0 25px rgba(255, 0, 0, 0.3)",
            duration: 0.12,
            ease: "power2.out"
        }, 1.15);

        tl.to(rejectedPileRef.current, {
            scale: 1,
            boxShadow: "none",
            duration: 0.25,
            ease: "elastic.out(1, 0.4)"
        }, 1.27);

        // Restore other cards visibility
        handRefs.current.forEach((c, i) => {
            if (i !== index && c) {
                gsap.to(c, { opacity: 1, scale: 1, filter: "none", duration: 0.25 });
            }
        });
    };

    // CLOSE ACTIVE PROJECT - Animate card to Discard Pile, then update state
    const handleCloseActive = () => {
        // CRITICAL: Guard against multiple clicks during animation
        if (!activeProject || activeCardIndex === null || isTransitioning) return;

        const card = handRefs.current[activeCardIndex];
        if (!card || !containerRef.current || !interestedPileRef.current) {
            // Fallback: just close panel
            setActiveProject(null);
            setActiveCardIndex(null);
            onActiveProjectChange?.(null);
            return;
        }

        // Set transitioning IMMEDIATELY to prevent any more clicks
        setIsTransitioning(true);

        const containerRect = containerRef.current.getBoundingClientRect();
        const interestedRect = interestedPileRef.current.getBoundingClientRect();

        // Target: Position card at interested pile (top-left, smaller pile)
        const targetX = interestedRect.left - containerRect.left;
        const targetY = interestedRect.top - containerRect.top;

        // IMMEDIATELY restore all other cards to full visibility BEFORE animation
        handRefs.current.forEach((c, i) => {
            if (c && i !== activeCardIndex) {
                gsap.killTweensOf(c);
                gsap.set(c, {
                    opacity: 1,
                    scale: 1,
                    filter: "none"
                });
            }
        });

        const tl = gsap.timeline({
            onComplete: () => {
                const closedIndex = activeCardIndex;
                const closedProject = activeProject;

                // Hide details panel
                gsap.to(".details-panel", {
                    right: "-50%",
                    bottom: "-50%",
                    duration: 0.3,
                    ease: "power2.in"
                });

                // Hide active slot
                if (activeSlotRef.current) {
                    activeSlotRef.current.classList.remove('visible');
                }

                // Clear the ref for the removed card BEFORE state update
                handRefs.current[closedIndex] = null;

                // Calculate new total before state update (hand.length - 1)
                const newTotal = hand.length - 1;

                // Update state: remove from hand, add to interested pile
                setHand(prev => prev.filter((_, i) => i !== closedIndex));
                setInterestedPile(prev => [...prev, closedProject]);

                // Sync to ShowcaseContext for Start Project page
                if (closedProject && closedProject.type !== 'wildcard') {
                    addToShowcase(closedProject);
                }
                setActiveProject(null);
                setActiveCardIndex(null);
                setFocusedIndex(null);
                setIsTransitioning(false);
                setIsPlayAnimating(false); // Allow Cash Out to show now that card has reached pile
                onActiveProjectChange?.(null);

                // Wait for React to re-render with new hand, then reposition
                setTimeout(() => {
                    if (!containerRef.current) return;
                    const newContainerRect = containerRef.current.getBoundingClientRect();

                    // After React re-renders, handRefs will have new assignments
                    // Filter out null refs and get only valid cards
                    const validRefs = handRefs.current.filter((c): c is HTMLDivElement => c !== null && c.isConnected);

                    // Reposition each valid card to its new arc position
                    validRefs.forEach((card, newIndex) => {
                        const pos = getHandPosition(newIndex, newTotal, newContainerRect.width, newContainerRect.height);
                        gsap.to(card, {
                            x: pos.x,
                            y: pos.y,
                            rotation: pos.rotation,
                            opacity: 1,
                            scale: 1,
                            filter: "none",
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    });

                    // Clean up handRefs array to match new hand length
                    handRefs.current = validRefs;
                }, 100);
            }
        });

        // --- ENHANCED GOLDEN DUST DISSOLUTION ANIMATION ---
        // Phase timings: Charge 0.4s, Dissolution 0.4s, Stream 0.4s, Reformation 0.6s

        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left - containerRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top - containerRect.top + cardRect.height / 2;

        // Use actual interested pile dimensions for accurate targeting
        const pileWidth = interestedRect.width;
        const pileHeight = interestedRect.height;
        const targetCenterX = targetX + pileWidth / 2;
        const targetCenterY = targetY + pileHeight / 2;

        // Particle arrays for different types
        const coreParticles: HTMLDivElement[] = [];
        const sparkParticles: HTMLDivElement[] = [];
        const emberParticles: HTMLDivElement[] = [];

        // FX Layer for impact effects
        const fxLayer = document.createElement('div');
        fxLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:200;';
        containerRef.current.appendChild(fxLayer);

        // Helper: Spawn particles of different types at grid position
        const spawnParticle = (type: 'core' | 'spark' | 'ember', x: number, y: number) => {
            if (!containerRef.current) return null;
            const p = document.createElement('div');
            p.className = `gold-particle gold-particle-${type}`;
            containerRef.current.appendChild(p);

            gsap.set(p, {
                x: x,
                y: y,
                opacity: 0,
                scale: type === 'ember' ? 0.3 : 0.5
            });

            if (type === 'core') coreParticles.push(p);
            else if (type === 'spark') sparkParticles.push(p);
            else emberParticles.push(p);

            return p;
        };

        // Helper: Spawn impact burst at target
        const spawnImpactBurst = (x: number, y: number) => {
            const burst = document.createElement('div');
            burst.className = 'gold-impact-burst';
            fxLayer.appendChild(burst);
            gsap.set(burst, { x: x - 10, y: y - 10, scale: 0.5, opacity: 1 });
            gsap.to(burst, {
                scale: 2,
                opacity: 0,
                duration: 0.25,
                ease: "power2.out",
                onComplete: () => burst.remove()
            });
        };

        // === PHASE 1: CHARGE (0.4s) ===
        // Pulsing magenta glow with gathering energy (Gambit-style)
        const glowLow = "0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.3)";
        const glowMid = "0 0 50px rgba(255, 0, 255, 0.7), 0 0 100px rgba(255, 0, 255, 0.5), inset 0 0 15px rgba(255, 0, 255, 0.3)";
        const glowHigh = "0 0 70px rgba(255, 0, 255, 0.9), 0 0 140px rgba(255, 0, 255, 0.7), inset 0 0 30px rgba(255, 0, 255, 0.5)";

        // Add charged class
        tl.call(() => card.classList.add('gold-charged'), [], 0);

        // Pulse 1: Build up
        tl.to(card, { scale: 1.04, boxShadow: glowLow, duration: 0.1, ease: "power2.out" }, 0);
        tl.to(card, { scale: 1.06, boxShadow: glowMid, duration: 0.1, ease: "power2.out" }, 0.1);

        // Pulse 2: Intensify
        tl.to(card, { scale: 1.04, boxShadow: glowLow, duration: 0.08, ease: "power2.in" }, 0.2);
        tl.to(card, { scale: 1.08, boxShadow: glowMid, duration: 0.08, ease: "power2.out" }, 0.28);

        // Pulse 3: Peak charge with shake
        tl.to(card, { scale: 1.12, boxShadow: glowHigh, filter: "brightness(1.2) saturate(1.4)", duration: 0.04, ease: "power4.out" }, 0.36);

        // Shake during final charge
        tl.to(card, { x: "+=4", duration: 0.02 }, 0.36)
            .to(card, { x: "-=8", duration: 0.02 }, 0.38)
            .to(card, { x: "+=4", duration: 0.02 }, 0.40);

        // === PHASE 2: DISSOLUTION (0.4s) ===
        // Grid-based particle cascade from center outward
        const gridSize = 4;
        const cellWidth = cardRect.width / gridSize;
        const cellHeight = cardRect.height / gridSize;
        const dissolutionStart = 0.42;

        // Spawn particles in grid pattern with radial delay
        tl.call(() => {
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    // Calculate cell center
                    const cellX = cardCenterX - cardRect.width / 2 + col * cellWidth + cellWidth / 2;
                    const cellY = cardCenterY - cardRect.height / 2 + row * cellHeight + cellHeight / 2;

                    // Distance from center for cascade timing
                    const distFromCenter = Math.sqrt(Math.pow(col - 1.5, 2) + Math.pow(row - 1.5, 2));
                    const cellDelay = distFromCenter * 0.04; // Radial cascade

                    // Spawn 2 core particles per cell
                    for (let i = 0; i < 2; i++) {
                        const offsetX = (Math.random() - 0.5) * cellWidth * 0.8;
                        const offsetY = (Math.random() - 0.5) * cellHeight * 0.8;
                        setTimeout(() => spawnParticle('core', cellX + offsetX, cellY + offsetY), cellDelay * 1000);
                    }

                    // Spawn 1 spark per cell
                    setTimeout(() => spawnParticle('spark', cellX, cellY), (cellDelay + 0.02) * 1000);

                    // Spawn embers at corners only
                    if ((row === 0 || row === gridSize - 1) && (col === 0 || col === gridSize - 1)) {
                        setTimeout(() => spawnParticle('ember', cellX, cellY), cellDelay * 1000);
                    }
                }
            }
        }, [], dissolutionStart);

        // Card dissolves as particles spawn
        tl.to(card, {
            opacity: 0,
            scale: 0.85,
            filter: "brightness(1.5) blur(2px)",
            duration: 0.35,
            ease: "power3.in",
            onComplete: () => {
                card.classList.remove('gold-charged');
                gsap.set(card, { x: -9999, y: -9999, opacity: 0, filter: "none" });
            }
        }, dissolutionStart + 0.05);

        // Make particles visible with burst effect
        tl.call(() => {
            [...coreParticles, ...sparkParticles, ...emberParticles].forEach((p, i) => {
                gsap.to(p, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.15,
                    delay: i * 0.005,
                    ease: "back.out(2)"
                });
            });
        }, [], dissolutionStart + 0.1);

        // === PHASE 3: STREAM (0.4s) ===
        // Particles spiral toward discard pile with physics
        const streamStart = 0.82;

        tl.call(() => {
            // Core particles: Fast, tight spiral
            coreParticles.forEach((p, i) => {
                const startX = gsap.getProperty(p, "x") as number;
                const startY = gsap.getProperty(p, "y") as number;
                const delay = i * 0.008;

                // Calculate spiral midpoint
                const angle = (i / coreParticles.length) * Math.PI * 2;
                const spiralRadius = 40 + Math.random() * 30;
                const midX = (startX + targetCenterX) / 2 + Math.cos(angle) * spiralRadius;
                const midY = Math.min(startY, targetCenterY) - 60 - Math.random() * 40;

                gsap.to(p, {
                    motionPath: {
                        path: [
                            { x: startX, y: startY },
                            { x: midX, y: midY },
                            { x: targetCenterX + (Math.random() - 0.5) * 20, y: targetCenterY }
                        ],
                        curviness: 1.3
                    },
                    rotation: 360 + Math.random() * 180,
                    scale: 0.4,
                    duration: 0.32 + Math.random() * 0.08,
                    delay: delay,
                    ease: "power2.in",
                    onComplete: () => {
                        spawnImpactBurst(targetCenterX, targetCenterY);
                        p.remove();
                    }
                });
            });

            // Spark particles: Fastest, erratic paths
            sparkParticles.forEach((p, i) => {
                gsap.to(p, {
                    x: targetCenterX + (Math.random() - 0.5) * 30,
                    y: targetCenterY + (Math.random() - 0.5) * 30,
                    opacity: 0,
                    duration: 0.25 + Math.random() * 0.1,
                    delay: i * 0.01,
                    ease: "power3.in",
                    onComplete: () => p.remove()
                });
            });

            // Ember particles: Slowest, graceful arcs
            emberParticles.forEach((p, i) => {
                const startX = gsap.getProperty(p, "x") as number;
                const startY = gsap.getProperty(p, "y") as number;

                gsap.to(p, {
                    motionPath: {
                        path: [
                            { x: startX, y: startY },
                            { x: (startX + targetCenterX) / 2, y: startY - 80 },
                            { x: targetCenterX, y: targetCenterY }
                        ],
                        curviness: 2
                    },
                    scale: 0.5,
                    opacity: 0.6,
                    duration: 0.45,
                    delay: i * 0.05,
                    ease: "power1.inOut",
                    onComplete: () => p.remove()
                });
            });
        }, [], streamStart);

        // === PHASE 4: REFORMATION (0.6s) ===
        // Premium materialization with shockwave and ghost card
        const reformStart = 1.22;

        // Create shockwave - sized to match discard pile
        const shockwave = document.createElement('div');
        shockwave.className = 'gold-shockwave';
        shockwave.style.width = `${pileWidth}px`;
        shockwave.style.height = `${pileHeight}px`;
        shockwave.style.borderRadius = '16px';
        fxLayer.appendChild(shockwave);
        gsap.set(shockwave, { x: targetX, y: targetY, scale: 0.8, opacity: 0 });

        // Create ghost card - matches discard pile size
        const ghostCard = document.createElement('div');
        ghostCard.className = 'gold-reform-ghost';
        ghostCard.style.width = `${pileWidth}px`;
        ghostCard.style.height = `${pileHeight}px`;
        fxLayer.appendChild(ghostCard);
        gsap.set(ghostCard, { x: targetX, y: targetY, scale: 0.8, opacity: 0 });

        // Shockwave expands from pile size outward
        tl.to(shockwave, { opacity: 1, scale: 1, duration: 0.1, ease: "power2.out" }, reformStart);
        tl.to(shockwave, { scale: 1.5, opacity: 0, duration: 0.3, ease: "power2.out" }, reformStart + 0.1);

        // Ghost card materializes
        tl.to(ghostCard, { opacity: 0.8, scale: 1, duration: 0.25, ease: "power2.out" }, reformStart + 0.1);
        tl.to(ghostCard, { opacity: 0, duration: 0.2, ease: "power2.in" }, reformStart + 0.35);

        // Interested pile glow and "thud" bounce
        tl.call(() => {
            if (interestedPileRef.current) {
                interestedPileRef.current.classList.add('gold-reformation-glow');
            }
        }, [], reformStart + 0.15);

        tl.to(interestedPileRef.current, { scale: 1.06, duration: 0.08, ease: "power4.out" }, reformStart + 0.2);
        tl.to(interestedPileRef.current, { scale: 1, duration: 0.25, ease: "elastic.out(1, 0.4)" }, reformStart + 0.28);

        // Cleanup
        tl.call(() => {
            if (interestedPileRef.current) {
                setTimeout(() => interestedPileRef.current?.classList.remove('gold-reformation-glow'), 400);
            }
            if (fxLayer.parentNode) fxLayer.remove();
        }, [], reformStart + 0.55);
    };


    // CUSTOM PROJECT WIZARD TRIGGER
    const handleCustomProject = () => {
        // First, fold the current card back if one is focused
        if (focusedIndex !== null) {
            const card = handRefs.current[focusedIndex];
            if (card && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const pos = getHandPosition(focusedIndex, hand.length, containerRect.width, containerRect.height);

                // Quick fold back animation
                const tiltInner = card.querySelector('.card-tilt-inner') as HTMLElement;
                const actions = card.querySelector('.action-buttons') as HTMLElement;

                if (actions) gsap.set(actions, { opacity: 0 });
                if (tiltInner) gsap.to(tiltInner, { rotateY: 0, duration: 0.3, ease: "power2.out" });

                gsap.to(card, {
                    x: pos.x,
                    y: pos.y,
                    rotation: pos.rotation,
                    scale: 1,
                    zIndex: 10 + focusedIndex,
                    duration: 0.3,
                    ease: "power2.out"
                });

                // Restore other cards
                handRefs.current.forEach((c, i) => {
                    if (i !== focusedIndex && c) {
                        gsap.to(c, { opacity: 1, scale: 1, filter: "none", duration: 0.2 });
                    }
                });
            }
        }

        setFocusedIndex(null);
        // Navigate to existing project wizard
        navigate('/start-project');
    };

    // PLAY ANIMATION - Premium "Gambit Charge & Throw" to Active Slot
    const handlePlay = () => {
        if (focusedIndex === null || isTransitioning) return;

        const index = focusedIndex;
        const card = handRefs.current[index];
        const project = hand[index];

        if (!card || !containerRef.current || !activeSlotRef.current) return;

        // Custom Project / Wild Card Logic
        if (project.type === 'wildcard') {
            handleCustomProject();
            return;
        }

        setIsTransitioning(true);
        setIsPlayAnimating(true); // Prevent Cash Out from showing during play animation

        const actions = card.querySelector('.action-buttons') as HTMLElement;
        const tiltInner = card.querySelector('.card-tilt-inner') as HTMLElement;
        const glare = card.querySelector('.card-glare-overlay') as HTMLElement;

        // Kill ALL existing animations on this card
        gsap.killTweensOf([card, tiltInner, actions, glare]);

        const containerRect = containerRef.current.getBoundingClientRect();
        const activeSlotRect = activeSlotRef.current.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        // Get current card position (for smooth absolute animation)
        const startX = cardRect.left - containerRect.left;
        const startY = cardRect.top - containerRect.top;

        // Target: Active Slot (Center of screen)
        const cardWidth = isMobile ? 165 : 260;
        const cardHeight = isMobile ? 225 : 360;
        const targetX = activeSlotRect.left - containerRect.left + (activeSlotRect.width / 2) - (cardWidth / 2);
        const targetY = activeSlotRect.top - containerRect.top + (activeSlotRect.height / 2) - (cardHeight / 2);

        // --- FX LAYER ---
        const fxLayer = document.createElement('div');
        fxLayer.className = 'gambit-fx-layer';
        fxLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:150;';
        containerRef.current.appendChild(fxLayer);

        // Particle Emitter - More intense particles during charge
        const spawnParticle = (x: number, y: number, intense = false) => {
            const p = document.createElement('div');
            p.className = 'gambit-particle';
            fxLayer.appendChild(p);

            const size = intense ? 8 + Math.random() * 6 : 4 + Math.random() * 4;
            gsap.set(p, {
                x: x + (Math.random() * 60 - 30),
                y: y + (Math.random() * 80 - 40),
                width: size,
                height: size,
                opacity: 1
            });

            const angle = Math.random() * Math.PI * 2;
            const distance = intense ? 100 + Math.random() * 100 : 50 + Math.random() * 50;

            gsap.to(p, {
                x: `+=${Math.cos(angle) * distance}`,
                y: `+=${Math.sin(angle) * distance}`,
                opacity: 0,
                scale: 0,
                duration: intense ? 0.8 : 0.5,
                ease: "power2.out",
                onComplete: () => p.remove()
            });
        };

        // Shockwave Element
        const shockwave = document.createElement('div');
        shockwave.className = 'gambit-shockwave';
        fxLayer.appendChild(shockwave);
        gsap.set(shockwave, {
            x: targetX + cardWidth / 2,
            y: targetY + cardHeight / 2,
            scale: 0,
            opacity: 0
        });

        // Trail Element - attached to card
        const trail = document.createElement('div');
        trail.className = 'gambit-trail';
        trail.style.cssText = 'position:absolute;left:-100%;top:0;width:200%;height:100%;opacity:0;z-index:-1;';
        card.appendChild(trail);

        // Cleanup function
        const cleanup = () => {
            if (fxLayer.parentNode) fxLayer.remove();
            if (trail.parentNode) trail.remove();
            card.classList.remove('gambit-charged', 'gambit-vibrating');
        };

        // Dim other cards immediately
        handRefs.current.forEach((c, i) => {
            if (i !== index && c) {
                gsap.to(c, {
                    opacity: 0.4,
                    scale: 0.85,
                    filter: "grayscale(60%) brightness(0.5)",
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });

        // === THE ANIMATION TIMELINE ===
        const tl = gsap.timeline({
            onComplete: () => {
                cleanup();

                // Set state
                setActiveProject(project);
                setActiveCardIndex(index);
                setFocusedIndex(null);
                setIsTransitioning(false);
                onActiveProjectChange?.(project);

                // Add to ShowcaseContext for Start Project integration
                addToShowcase(project);

                // Slide in details panel
                gsap.to(".details-panel", {
                    right: 0,
                    bottom: 0,
                    duration: 0.5,
                    ease: "power3.out"
                });

                // Show active slot glow
                if (activeSlotRef.current) {
                    activeSlotRef.current.classList.add('visible');
                }

                // Final card settle
                gsap.to(card, {
                    boxShadow: "0 0 60px rgba(255, 0, 255, 0.4), 0 0 120px rgba(255, 0, 255, 0.2), 0 20px 60px rgba(0,0,0,0.5)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        // --- PHASE 0: Instant Cleanup (0s) ---
        if (actions) tl.set(actions, { opacity: 0 }, 0);
        if (glare) tl.set(glare, { opacity: 0, visibility: 'hidden', transition: 'none' }, 0);
        if (tiltInner) {
            tl.to(tiltInner, { rotateY: 0, rotateX: 0, duration: 0.2, ease: "power2.out" }, 0);
        }

        // Lock card starting position
        tl.set(card, { x: startX, y: startY, rotation: 0, zIndex: 200 }, 0);

        // --- PHASE 1: THE CHARGE (0s - 0.8s) ---
        // Add charged class for CSS glow
        tl.call(() => card.classList.add('gambit-charged', 'gambit-vibrating'), [], 0);

        // Intense levitation with pulsing scale
        tl.to(card, {
            y: startY - 30, // Float up
            scale: 1.15,
            duration: 0.4,
            ease: "power2.out"
        }, 0);

        // Pulse back slightly
        tl.to(card, {
            scale: 1.1,
            duration: 0.2,
            ease: "power2.inOut"
        }, 0.4);

        // More intense pulse
        tl.to(card, {
            scale: 1.18,
            duration: 0.2,
            ease: "power2.inOut"
        }, 0.6);

        // Spawn particles during charge
        tl.call(() => {
            const rect = card.getBoundingClientRect();
            const cRect = containerRef.current?.getBoundingClientRect();
            if (rect && cRect) {
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        spawnParticle(rect.left - cRect.left + rect.width / 2, rect.top - cRect.top + rect.height / 2);
                    }, i * 80);
                }
            }
        }, [], 0.1);

        // More particles at peak charge
        tl.call(() => {
            const rect = card.getBoundingClientRect();
            const cRect = containerRef.current?.getBoundingClientRect();
            if (rect && cRect) {
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => {
                        spawnParticle(rect.left - cRect.left + rect.width / 2, rect.top - cRect.top + rect.height / 2, true);
                    }, i * 50);
                }
            }
        }, [], 0.5);

        // --- PHASE 2: WIND-UP & THROW (0.8s - 1.3s) ---
        const throwStart = 0.8;

        // Stop vibrating, start wind-up
        tl.call(() => card.classList.remove('gambit-vibrating'), [], throwStart);

        // Wind-up: Pull back and rotate
        tl.to(card, {
            x: startX + 40,
            rotation: 15,
            scale: 1.1,
            duration: 0.15,
            ease: "power2.in"
        }, throwStart);

        // Show trail
        tl.to(trail, { opacity: 0.8, duration: 0.1 }, throwStart);

        // THE THROW - Fast, dramatic arc
        tl.to(card, {
            x: targetX,
            y: targetY,
            rotation: -720, // Two full spins
            scale: 1,
            duration: 0.4,
            ease: "power4.in" // Accelerates into throw
        }, throwStart + 0.15);

        // Trail fades during throw
        tl.to(trail, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in"
        }, throwStart + 0.2);

        // --- PHASE 3: IMPACT (1.35s+) ---
        const impactTime = throwStart + 0.55;

        // Landing bounce
        tl.to(card, {
            scale: 1.08,
            rotation: 0,
            duration: 0.1,
            ease: "power4.out"
        }, impactTime);

        tl.to(card, {
            scale: 1.02,
            duration: 0.15,
            ease: "elastic.out(1, 0.5)"
        }, impactTime + 0.1);

        // Shockwave explosion
        tl.to(shockwave, {
            opacity: 1,
            scale: 15,
            duration: 0.4,
            ease: "power2.out"
        }, impactTime);

        tl.to(shockwave, {
            opacity: 0,
            borderWidth: 0,
            duration: 0.3,
            ease: "power2.in"
        }, impactTime + 0.15);

        // Screen flash
        tl.to(containerRef.current, {
            backgroundColor: "#2a102a",
            duration: 0.08
        }, impactTime);

        tl.to(containerRef.current, {
            backgroundColor: "#0f3822",
            duration: 0.15,
            ease: "power2.out"
        }, impactTime + 0.08);

        // Particle burst at impact
        tl.call(() => {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    spawnParticle(targetX + cardWidth / 2, targetY + cardHeight / 2, true);
                }, i * 20);
            }
        }, [], impactTime);

        // Container shake on impact
        tl.to(containerRef.current, {
            y: 5,
            duration: 0.05,
            ease: "power4.out"
        }, impactTime);

        tl.to(containerRef.current, {
            y: 0,
            duration: 0.2,
            ease: "elastic.out(1, 0.4)"
        }, impactTime + 0.05);
    };


    // DRAW CARD - Draw a new card from deck into hand
    const handleDraw = () => {
        // Don't draw if currently dealing, focused on a card, or have an active project
        if (isDealing || focusedIndex !== null || activeProject) return;

        // Check if there are cards in the deck
        if (deck.length === 0) return;

        // Check if hand is full (max 5 cards)
        if (hand.length >= 5) return;

        // Normal Draw - draw from front of deck (wild card is already there if applicable)
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

        // Calculate center index for z-index ordering (center cards on top)
        const centerIndex = (total - 1) / 2;

        handRefs.current.forEach((card, i) => {
            if (!card || i >= total) return;
            const pos = getHandPosition(i, total, containerRect.width, containerRect.height);

            // Z-index: center cards have highest z-index, edge cards lower
            const distFromCenter = Math.abs(i - centerIndex);
            const zIndex = Math.round(50 - distFromCenter * 5);

            gsap.to(card, {
                x: pos.x,
                y: pos.y,
                rotation: pos.rotation,
                zIndex: zIndex,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    };

    // Helper: Position Calculation (Responsive for mobile/tablet/desktop)
    const getHandPosition = (index: number, total: number, w: number, h: number) => {
        // Check viewport DIRECTLY from window to avoid stale closure issues
        const viewportWidth = window.innerWidth;
        const aspectRatio = w / h;
        const isMobileNow = viewportWidth < 768;
        const isTabletNow = viewportWidth >= 768 && viewportWidth < 1200;

        if (isMobileNow) {
            // MOBILE (<768px): Compact fan with good spacing
            const cardW = 150;
            const cardH = 200;
            const cardSpacing = 55;
            const totalWidth = cardW + (total - 1) * cardSpacing;
            const startX = (w - totalWidth) / 2;
            const baseY = h - cardH - 60; // Moved up a bit

            const maxRotation = 12; // Slightly less rotation
            const rotationStep = total > 1 ? (maxRotation * 2) / (total - 1) : 0;
            const rotation = -maxRotation + index * rotationStep;

            // Arc: Center cards higher, edge cards lower (proper fan shape)
            const centerIndex = (total - 1) / 2;
            const distFromCenter = Math.abs(index - centerIndex);
            const yOffset = distFromCenter * 8; // Edge cards go DOWN

            return {
                x: startX + index * cardSpacing,
                y: baseY + yOffset, // + to push edges DOWN (proper arc)
                rotation
            };
        }

        if (isTabletNow) {
            // TABLET: Use aspect ratio for sizing
            // < 0.9 = portrait (taller), > 1.1 = landscape (wider), between = square-ish
            // < 0.9 = portrait (taller), > 1.1 = landscape (wider), between = square-ish
            const isWide = aspectRatio > 1.1;
            const isTall = aspectRatio < 0.9;

            // Dynamic sizing based on aspect ratio
            let cardW: number, arcRadius: number, yOffset: number, yCardOffset: number, spreadMax: number, centerXShift: number, spreadPerCard: number;

            if (isWide) {
                // LANDSCAPE: Cards centered, moderate spread to stay on screen
                cardW = 140;
                arcRadius = 550;
                yOffset = 60;
                yCardOffset = 300;
                spreadMax = 40; // Reduced to keep cards on screen
                spreadPerCard = 10;
                centerXShift = 20; // Minimal shift to keep centered
            } else if (isTall) {
                // PORTRAIT: Larger cards, tighter spread, more vertical room
                cardW = 180;
                arcRadius = 1000;
                yOffset = 180;
                yCardOffset = 280;
                spreadMax = 26;
                spreadPerCard = 5;
                centerXShift = 30;
            } else {
                // SQUARE-ISH: Balanced sizing
                cardW = 160;
                arcRadius = 850;
                yOffset = 140;
                yCardOffset = 220;
                spreadMax = 30;
                spreadPerCard = 7;
                centerXShift = 40;
            }
            const centerArcX = (w / 2) + centerXShift;
            const centerArcY = h + arcRadius - yOffset;

            const totalSpread = Math.min(spreadMax, (total - 1) * spreadPerCard);
            const startDeg = -totalSpread / 2;
            const step = total > 1 ? totalSpread / (total - 1) : 0;

            const deg = startDeg + index * step;
            const rad = (deg - 90) * (Math.PI / 180);

            const x = centerArcX + arcRadius * Math.cos(rad) - cardW / 2;
            const y = centerArcY + arcRadius * Math.sin(rad) - yCardOffset;

            return { x, y, rotation: deg };
        }

        // DESKTOP (>=1024px): Full arc calculation
        const cardW = 240;
        const arcRadius = 1500;
        const yOffset = 200;
        const yCardOffset = 340;
        const spreadMax = 40;
        const spreadPerCard = 6;

        const centerArcX = w / 2;
        const centerArcY = h + arcRadius - yOffset;

        const totalSpread = Math.min(spreadMax, (total - 1) * spreadPerCard);
        const startDeg = -totalSpread / 2;
        const step = total > 1 ? totalSpread / (total - 1) : 0;

        const deg = startDeg + index * step;
        const rad = (deg - 90) * (Math.PI / 180);

        const x = centerArcX + arcRadius * Math.cos(rad) - cardW / 2;
        const y = centerArcY + arcRadius * Math.sin(rad) - yCardOffset;

        return { x, y, rotation: deg };
    };

    return (
        <div
            className="casino-table-container"
            ref={containerRef}
            onMouseMove={handleGlobalMouseMove}
            data-swipeable="true"
        >
            {/* Table Trim */}
            < div className="table-trim" />
            <div className="table-spotlight" /> {/* New Lighting Layer */}

            {/* Filter Chips Row */}
            <div className="filter-chips-row">
                <button
                    className={cn("filter-chip", activeFilter === null && "active")}
                    onClick={() => handleFilterChange(null)}
                    title="All Projects"
                >
                    <div className="filter-chip-inner">
                        <span className="filter-chip-label">ALL</span>
                    </div>
                </button>
                <button
                    className={cn("filter-chip frontend", activeFilter === "Frontend" && "active")}
                    onClick={() => handleFilterChange("Frontend")}
                    title="Frontend"
                >
                    <div className="filter-chip-inner">
                        <span className="filter-chip-label">♠</span>
                    </div>
                </button>
                <button
                    className={cn("filter-chip fullstack", activeFilter === "Full Stack Web" && "active")}
                    onClick={() => handleFilterChange("Full Stack Web")}
                    title="Full Stack Web"
                >
                    <div className="filter-chip-inner">
                        <span className="filter-chip-label">♥</span>
                    </div>
                </button>
                <button
                    className={cn("filter-chip mobile", activeFilter === "Mobile Application" && "active")}
                    onClick={() => handleFilterChange("Mobile Application")}
                    title="Mobile Application"
                >
                    <div className="filter-chip-inner">
                        <span className="filter-chip-label">♣</span>
                    </div>
                </button>
                <button
                    className={cn("filter-chip nlp", activeFilter === "NLP" && "active")}
                    onClick={() => handleFilterChange("NLP")}
                    title="NLP"
                >
                    <div className="filter-chip-inner">
                        <span className="filter-chip-label">◇</span>
                    </div>
                </button>
                <button
                    className={cn("filter-chip data-science", activeFilter === "Machine Learning" && "active")}
                    onClick={() => handleFilterChange("Machine Learning")}
                    title="Machine Learning"
                >
                    <div className="filter-chip-inner">
                        <span className="filter-chip-label">◆</span>
                    </div>
                </button>
                <button
                    className={cn("filter-chip backend", activeFilter === "Deep Learning" && "active")}
                    onClick={() => handleFilterChange("Deep Learning")}
                    title="Deep Learning"
                >
                    <div className="filter-chip-inner">
                        <span className="filter-chip-label">♦</span>
                    </div>
                </button>
                <button
                    className={cn("filter-chip n8n", activeFilter === "n8n Automation" && "active")}
                    onClick={() => handleFilterChange("n8n Automation")}
                    title="n8n Automation"
                >
                    <div className="filter-chip-inner">
                        <span className="filter-chip-label">⚙</span>
                    </div>
                </button>
            </div>

            {/* Premium Water Ripple Effect Layer (Shuffle Phase) */}
            <div ref={rippleLayerRef} className="table-ripple-layer">
                <div className="ripple-center-glow" />
                <div className="table-color-shift" />
                <div className="ripple-wave ripple-wave-1" />
                <div className="ripple-wave ripple-wave-2" />
                <div className="ripple-wave ripple-wave-3" />
                <div className="ripple-wave ripple-wave-4" />
                <div className="ripple-wave ripple-wave-5" />
            </div>

            {/* Visual Deck Stack */}
            <div
                ref={deckRef}
                className="deck-stack absolute top-[120px] right-[5%] md:top-[15%] md:right-[10%] w-[140px] h-[200px] md:w-[260px] md:h-[360px] perspective-1000 z-30 cursor-pointer"
                onClick={handleDraw}
                data-no-swipe="true"
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
                    <div className="text-white/30 font-bold tracking-widest text-xs md:text-lg">PROJECTS</div>
                    <div className="text-white/10 text-3xl md:text-6xl font-black mt-1 md:mt-2">{deck.length}</div>

                    {/* Hover Hint */}
                    <div className="absolute bottom-3 md:bottom-6 text-emerald-500/50 text-[10px] md:text-xs uppercase tracking-wider">
                        {deck.length > 0 && hand.length < 5 ? 'Click to Draw' : deck.length === 0 ? 'Empty' : 'Hand Full'}
                    </div>
                </div>
            </div >

            {/* INTERESTED PILE - Premium Glass Blue */}
            <div
                ref={interestedPileRef}
                className="absolute top-[8%] left-[5%] md:top-[15%] md:left-[10%] w-[70px] h-[95px] md:w-[130px] md:h-[180px] z-20"
            >
                {/* Glass stack layers */}
                {[...Array(Math.min(5, interestedPile.length))].map((_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 bg-blue-950/30 border border-blue-500/20 rounded-xl backdrop-blur-sm pointer-events-none"
                        style={{
                            transform: `translate(${i}px, ${-i}px) rotate(${(i * 2) - 2}deg)`,
                            zIndex: i
                        }}
                    />
                ))}
                {/* Top glass panel */}
                <div
                    className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center transition-all duration-300
                        ${interestedPile.length > 0
                            ? 'bg-blue-950/40 border border-blue-500/40 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                            : 'border-2 border-dashed border-white/10 bg-white/5'}`}
                    style={{
                        transform: interestedPile.length > 0 ? `translate(${Math.min(5, interestedPile.length)}px, ${-Math.min(5, interestedPile.length)}px)` : 'none',
                        zIndex: 10
                    }}
                >
                    <div className="text-blue-400/80 font-bold tracking-widest text-[8px] md:text-xs">SAVED</div>
                    <div className={`text-lg md:text-3xl font-black mt-0.5 md:mt-1 ${interestedPile.length > 0 ? 'text-blue-400/60' : 'text-white/10'}`}>{interestedPile.length}</div>
                </div>
            </div>

            {/* LEAVE GAME BUTTON - Positioned below SAVED pile */}
            {hasProjects && !isPlayAnimating && (
                <button
                    onClick={() => navigate('/start-project?step=3')}
                    className="absolute top-[22%] left-[5%] md:top-[40%] md:left-[10%] w-[70px] md:w-[130px] z-20 bg-black/80 hover:bg-emerald-900/80 text-white px-2 py-2 md:px-3 md:py-2.5 rounded-xl font-bold shadow-lg shadow-black/30 flex items-center justify-center gap-1.5 md:gap-2 transition-all hover:scale-105 active:scale-95 border border-white/10 hover:border-emerald-500/50"
                    title="Leave the game and proceed with your selections"
                >
                    <Check className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                    <span className="text-[9px] md:text-xs">Cash Out</span>
                </button>
            )}

            {/* REJECTED PILE - Premium Glass Red */}
            <div
                ref={rejectedPileRef}
                className="absolute top-[35%] left-[5%] md:top-[50%] md:left-[10%] w-[70px] h-[95px] md:w-[130px] md:h-[180px] z-20"
            >
                {/* Glass stack layers */}
                {[...Array(Math.min(5, rejectedPile.length))].map((_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 bg-red-950/30 border border-red-500/20 rounded-xl backdrop-blur-sm pointer-events-none"
                        style={{
                            transform: `translate(${i}px, ${-i}px) rotate(${(i * 2) - 2}deg)`,
                            zIndex: i
                        }}
                    />
                ))}
                {/* Top glass panel */}
                <div
                    className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center transition-all duration-300
                        ${rejectedPile.length > 0
                            ? 'bg-red-950/40 border border-red-500/40 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                            : 'border-2 border-dashed border-white/10 bg-white/5'}`}
                    style={{
                        transform: rejectedPile.length > 0 ? `translate(${Math.min(5, rejectedPile.length)}px, ${-Math.min(5, rejectedPile.length)}px)` : 'none',
                        zIndex: 10
                    }}
                >
                    <div className="text-red-400/80 font-bold tracking-widest text-[8px] md:text-xs">SKIPPED</div>
                    <div className={`text-lg md:text-3xl font-black mt-0.5 md:mt-1 ${rejectedPile.length > 0 ? 'text-red-400/60' : 'text-white/10'}`}>{rejectedPile.length}</div>
                </div>
            </div>

            {/* Active Slot */}
            < div ref={activeSlotRef} className="active-slot" >
                <div className="impact-ripple" />
            </div >

            {/* Hand Area */}
            {
                hand.map((project, index) => (
                    project && (
                        <PokerCard
                            key={project.common}
                            ref={el => { handRefs.current[index] = el; }}
                            project={project}
                            index={index}
                            isActive={activeProject === project}
                            isFocused={focusedIndex === index}
                            isInHand={true}
                            isTransitioning={isTransitioning}
                            onClick={() => handleInspect(index)}
                            onFold={handleFold}
                            onPlay={handlePlay}
                        // Removed style opacity=0, now handled by CSS + GSAP
                        />
                    )
                ))
            }

            {/* Details Panel */}
            <div className="details-panel" data-no-swipe="true">
                {activeProject && (
                    <div className="text-white h-full flex flex-col relative">
                        {/* Top close button for quick access on mobile */}
                        <button
                            onClick={handleCloseActive}
                            className="absolute top-0 right-0 md:hidden w-8 h-8 bg-white/10 hover:bg-red-600/40 rounded-full flex items-center justify-center transition-all z-10"
                            aria-label="Close"
                        >
                            <X size={16} className="text-white" />
                        </button>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto pr-1 space-y-3 md:space-y-6 pb-2">
                            <div className="pr-8 md:pr-0">
                                <span className={cn(
                                    "inline-block px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold mb-2 md:mb-3 border border-emerald-500/30 text-emerald-400",
                                    getBadgeClass(activeProject.binomial)
                                )}>
                                    {activeProject.binomial}
                                </span>
                                <h1 className="text-lg md:text-4xl font-bold mb-1 md:mb-2 tracking-tight leading-tight">{activeProject.common}</h1>
                                <p className="text-xs md:text-xl text-gray-400 font-light leading-relaxed">{activeProject.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 md:gap-4">
                                {activeProject.features.slice(0, 4).map((f, i) => (
                                    <div key={i} className="bg-white/5 p-1.5 md:p-3 rounded-lg border border-white/10 flex items-start hover:bg-white/10 transition-colors">
                                        <Check size={12} className="text-emerald-500 mt-0.5 mr-1 md:mt-1 md:mr-2 flex-shrink-0" />
                                        <span className="text-[10px] md:text-sm text-gray-300 line-clamp-2">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sticky Footer Buttons */}
                        <div className="flex-shrink-0 pt-2 md:pt-4 pb-8 md:pb-0 border-t border-white/10 space-y-1.5 md:space-y-3 bg-inherit">
                            <div className="flex gap-2 md:gap-4">
                                <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2 md:py-3 rounded-xl text-xs md:text-base font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95">
                                    Launch <ExternalLink size={14} className="ml-1 md:ml-2" />
                                </button>
                                <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 md:py-3 rounded-xl text-xs md:text-base font-bold flex items-center justify-center transition-all hover:bg-white/10 active:scale-95">
                                    Code <Github size={14} className="ml-1 md:ml-2" />
                                </button>
                            </div>
                            <button
                                onClick={handleCloseActive}
                                className="hidden md:flex w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium items-center justify-center transition-all border border-red-500/30 active:scale-95"
                            >
                                <X size={14} className="mr-1 md:mr-2" /> Close
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* DEALER CHIP (Persistent Custom Project CTA) */}
            <div className="dealer-chip" onClick={handleCustomProject} title="Start Custom Project">
                <div className="dealer-chip-inner">
                    <div className="dealer-chip-label">VIP<br />DEAL</div>
                </div>
                <div className="dealer-chip-tooltip">
                    <span className="tooltip-title">Custom Project</span>
                    <span className="tooltip-desc">Build something unique</span>
                </div>
            </div>

            {/* GAME OVER MODAL */}
            {isGameOver && (
                <div className="game-over-overlay">
                    <div className="game-over-modal">
                        {/* Decorative top border */}
                        <div className="game-over-border" />

                        {/* Title */}
                        <div className="game-over-title">
                            {interestedPile.length > 0 ? '🎰 Round Complete!' : activeFilter ? `🃏 No More ${activeFilter} Projects` : '🃏 Game Over'}
                        </div>

                        {/* Stats */}
                        <div className="game-over-stats">
                            <div className="stat-item saved">
                                <span className="stat-value">{interestedPile.length}</span>
                                <span className="stat-label">Saved</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item total">
                                <span className="stat-value">{activeFilter ? getFilteredItems(items, activeFilter).length : items.length}</span>
                                <span className="stat-label">{activeFilter || 'Total'}</span>
                            </div>
                        </div>

                        {/* Message */}
                        <p className="game-over-message">
                            {interestedPile.length > 0
                                ? `You've selected ${interestedPile.length} project${interestedPile.length > 1 ? 's' : ''}! Ready to proceed?`
                                : activeFilter
                                    ? `You've reviewed all ${activeFilter} projects. Try another category or view all projects!`
                                    : "You've reviewed all projects. Want to try again?"
                            }
                        </p>

                        {/* Buttons */}
                        <div className="game-over-buttons">
                            {/* View All Projects button - only show when filter is active */}
                            {activeFilter && (
                                <button
                                    onClick={handleViewAllProjects}
                                    className="game-over-btn view-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <line x1="3" y1="9" x2="21" y2="9" />
                                        <line x1="9" y1="21" x2="9" y2="9" />
                                    </svg>
                                    View All
                                </button>
                            )}

                            <button
                                onClick={restartGame}
                                className="game-over-btn restart"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                    <path d="M16 21h5v-5" />
                                </svg>
                                Restart
                            </button>

                            <button
                                onClick={handleLeaveGame}
                                className={`game-over-btn primary ${interestedPile.length > 0 ? 'cash-out' : 'leave'}`}
                            >
                                {interestedPile.length > 0 ? (
                                    <>
                                        <Check size={18} />
                                        Cash Out
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink size={18} />
                                        Continue
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tutorial Overlay */}
            <ShowcaseTutorial
                onComplete={() => setShowTutorial(false)}
                forceShow={showTutorial}
            />

            {/* Help Button - Replay Tutorial */}
            <button
                className="tutorial-help-btn"
                onClick={() => setShowTutorial(true)}
                title="How to play"
            >
                <HelpCircle size={20} />
            </button>

            {/* Leave Game button moved to below SAVED pile - see line ~2108 */}
        </div>
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
        case 'n8n Automation': return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
};
