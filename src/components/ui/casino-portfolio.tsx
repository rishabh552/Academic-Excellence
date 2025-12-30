import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PokerCard, Project } from './poker-card';
import { cn } from '@/lib/utils';
import './casino-portfolio.css';
import { Check, Github, ExternalLink } from 'lucide-react';

interface CasinoPortfolioProps {
    items: Project[];
    onActiveProjectChange?: (project: Project | null) => void;
}

export function CasinoPortfolio({ items, onActiveProjectChange }: CasinoPortfolioProps) {
    // STATE MACHINE
    const [deck, setDeck] = useState<Project[]>([]);
    const [hand, setHand] = useState<Project[]>([]);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // Index in HAND
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [isDealing, setIsDealing] = useState(false);

    // REFS
    const containerRef = useRef<HTMLDivElement>(null);
    const handRefs = useRef<(HTMLDivElement | null)[]>([]);
    const deckRef = useRef<HTMLDivElement>(null);
    const activeSlotRef = useRef<HTMLDivElement>(null);

    // Initialize Game
    useEffect(() => {
        // Start with no cards in hand, all in deck
        // But for the initial "Deal", we want to move 5 from deck to hand
        const initialHandSize = Math.min(5, items.length);
        const initialHand = items.slice(0, initialHandSize);
        const remainingDeck = items.slice(initialHandSize);

        setHand(initialHand);
        setDeck(remainingDeck);

        // Trigger deal animation on mount
        dealCards(initialHandSize);
    }, [items]); // Only run when items change (initial load)

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

                // Initial State: At Deck Position, Face Down
                // We actually want them to look like they are IN the deck.
                // Small random offset for "stack" feel
                const randomAngle = Math.random() * 4 - 2;

                gsap.set(card, {
                    x: startX + 5 * i, // Slight stack offset in X
                    y: startY - 2 * i, // Slight stack offset in Y
                    rotation: randomAngle,
                    rotateY: 180, // Face Down
                    scale: 0.9, // Deck scale
                    opacity: 0,
                    zIndex: 10 + i, // Above table, layered
                });

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
                })
                    // 2. Flip Face Up (Mid-air or upon landing? Let's do upon landing for suspense)
                    .to(card, {
                        rotateY: 0,
                        duration: 0.6,
                        ease: "back.out(1.2)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5)" // Add shadow as it lands
                    }, "-=0.2");
            });
        }, 300);
    };

    // INSPECT ANIMATION (Click Card)
    const handleInspect = (index: number) => {
        if (isDealing || activeProject) return;
        if (focusedIndex === index) return;

        const card = handRefs.current[index];
        if (!card || !containerRef.current) return;

        setFocusedIndex(index);

        const containerRect = containerRef.current.getBoundingClientRect();
        const centerX = containerRect.width / 2 - 130; // Centered
        const centerY = containerRect.height / 2 - 200; // Centered visually

        // Animate to center
        gsap.to(card, {
            x: centerX,
            y: centerY,
            rotation: 0,
            rotateX: 0,
            rotateY: 0, // Ensure Face Up (Image side)
            scale: 1.5,
            zIndex: 100, // Topmost
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => {
                // FLIP to show details (Back of card)
                const actions = card.querySelector('.action-buttons') as HTMLElement;

                gsap.to(card, {
                    rotateY: 180, // Show Details
                    duration: 0.5,
                    ease: "back.out(1.2)"
                });

                if (actions) {
                    gsap.to(actions, { opacity: 1, delay: 0.2, duration: 0.3 });
                }
            }
        });

        // Dim & Blur others
        handRefs.current.forEach((c, i) => {
            if (i !== index && c) {
                gsap.to(c, {
                    filter: "blur(4px) brightness(0.5)",
                    scale: 0.9,
                    duration: 0.4
                });
            }
        });
    };

    // FOLD ANIMATION (Return to Hand)
    // Refined to fix "wrong direction" and smooth return
    const handleFold = () => {
        if (focusedIndex === null) return;

        const index = focusedIndex;
        const card = handRefs.current[index];
        if (!card || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const pos = getHandPosition(index, hand.length, containerRect.width, containerRect.height);

        // Hide actions
        const actions = card.querySelector('.action-buttons') as HTMLElement;
        if (actions) gsap.to(actions, { opacity: 0, duration: 0.2 });

        // Sequence: Flip Back -> Return to Arc
        const tl = gsap.timeline({
            onComplete: () => {
                setFocusedIndex(null);
            }
        });

        // 1. Flip back to visible image
        tl.to(card, {
            rotateY: 0,
            duration: 0.4,
            ease: "power2.inOut"
        })
            // 2. Fly home
            .to(card, {
                x: pos.x,
                y: pos.y,
                rotation: pos.rotation,
                scale: 1,
                zIndex: 10 + index, // Restore proper stack order
                duration: 0.5,
                ease: "power3.inOut"
            }, "-=0.1");

        // Unblur others
        handRefs.current.forEach((c, i) => {
            if (i !== index && c) {
                gsap.to(c, {
                    filter: "blur(0px) brightness(1)",
                    scale: 1,
                    duration: 0.4
                });
            }
        });
    };

    // PLAY ANIMATION (Move to Active Slot)
    const handlePlay = () => {
        if (focusedIndex === null) return;

        const index = focusedIndex;
        const card = handRefs.current[index];
        const project = hand[index];

        if (!card || !containerRef.current || !activeSlotRef.current) return;

        const actions = card.querySelector('.action-buttons') as HTMLElement;
        if (actions) gsap.set(actions, { opacity: 0 });

        const slotRect = activeSlotRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const targetX = slotRect.left - containerRect.left;
        const targetY = slotRect.top - containerRect.top;

        // Animate to slot
        gsap.to(card, {
            x: targetX,
            y: targetY,
            rotation: 0,
            scale: 1,
            rotateY: 0, // Ensure Face Up for final state? Or keep details
            // Actually, once played, it becomes the Active Project (details panel).
            // The card itself visually "slots in". Let's flip it back to Image side for the slot.
            zIndex: 50,
            duration: 0.8,
            ease: "expo.inOut",
            onComplete: () => {
                setActiveProject(project);
                onActiveProjectChange?.(project);

                gsap.to(".details-panel", {
                    right: 0,
                    bottom: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            }
        });
    };

    // Draw Card (Draws from Deck to Hand? Or resets?)
    // This seems to be "Return Active Project to Hand/Deck"
    const handleDraw = () => {
        // ... (keeping existing logic for now, but focus is on Deal/Play)
        if (activeProject) {
            setActiveProject(null);
            onActiveProjectChange?.(null);

            gsap.to(".details-panel", {
                right: "-50%",
                bottom: "-50%",
                duration: 0.5,
                ease: "power2.in"
            });

            // "Fold" logic handles the return
            handleFold();
        }
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
            <div className="table-trim" />
            <div className="table-spotlight" /> {/* New Lighting Layer */}

            {/* Visual Deck Stack */}
            <div
                ref={deckRef}
                className="deck-stack absolute top-[15%] right-[10%] w-[260px] h-[360px] perspective-1000 z-0"
                onClick={handleDraw}
            >
                {/* Simulated Stack Layers */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 bg-neutral-900 border border-white/10 rounded-2xl shadow-xl"
                        style={{
                            transform: `translate(${i * 2}px, ${-i * 2}px)`,
                            zIndex: i,
                            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0, rgba(255, 255, 255, 0.02) 2px, transparent 2px, transparent 8px)'
                        }}
                    />
                ))}

                {/* Top Card (Interactive) */}
                <div
                    className="absolute inset-0 bg-neutral-800 border border-white/20 rounded-2xl shadow-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-800/80 transition-colors"
                    style={{
                        transform: `translate(10px, -10px)`,
                        zIndex: 10
                    }}
                >
                    <div className="text-white/30 font-bold tracking-widest text-lg">PROJECTS</div>
                    <div className="text-white/10 text-6xl font-black mt-2">{deck.length}</div>

                    {/* Hover Hint */}
                    <div className="absolute bottom-6 text-emerald-500/50 text-xs uppercase tracking-wider opacity-0 hover:opacity-100 transition-opacity">
                        Repopulate
                    </div>
                </div>
            </div>

            {/* Active Slot */}
            <div ref={activeSlotRef} className="active-slot" />

            {/* Hand Area */}
            {hand.map((project, index) => (
                project && (
                    <PokerCard
                        key={`${project.common}-${index}`}
                        ref={el => { handRefs.current[index] = el; }}
                        project={project}
                        index={index}
                        isActive={activeProject === project}
                        isFocused={focusedIndex === index}
                        isInHand={true}
                        onClick={() => handleInspect(index)}
                        onFold={handleFold}
                        onPlay={handlePlay}
                    />
                )
            ))}

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

                        <div className="mt-auto pt-6 border-t border-white/10 flex gap-4">
                            <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95">
                                Launch Project <ExternalLink size={18} className="ml-2" />
                            </button>
                            <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-bold flex items-center justify-center transition-all hover:bg-white/10 active:scale-95">
                                Code <Github size={18} className="ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
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
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
};
