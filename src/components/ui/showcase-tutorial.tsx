import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
    Sparkles,
    ChevronRight,
    ChevronLeft,
    X
} from 'lucide-react';
import './showcase-tutorial.css';

const STORAGE_KEY = 'showcase_tutorial_seen';

interface ShowcaseTutorialProps {
    onComplete: () => void;
    forceShow?: boolean;
}

// ============================================
// ANIMATED DEMO COMPONENTS FOR EACH STEP
// ============================================

// Step 0: Welcome - Floating cards animation
function WelcomeDemo() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const cards = containerRef.current.querySelectorAll('.demo-card');

        // Initial stagger animation
        gsap.fromTo(cards,
            { y: 50, opacity: 0, rotateY: -15 },
            {
                y: 0,
                opacity: 1,
                rotateY: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "back.out(1.7)"
            }
        );

        // Continuous floating animation
        cards.forEach((card, i) => {
            gsap.to(card, {
                y: -8 + (i * 2),
                duration: 1.5 + (i * 0.2),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2
            });
        });

        return () => { gsap.killTweensOf(cards); };
    }, []);

    return (
        <div ref={containerRef} className="demo-container welcome-demo">
            <div className="demo-card demo-card-1">♠</div>
            <div className="demo-card demo-card-2">♥</div>
            <div className="demo-card demo-card-3">♦</div>
            <div className="demo-card demo-card-4">♣</div>
        </div>
    );
}

// Step 1: Deck - Card drawing animation
function DeckDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const deck = containerRef.current.querySelector('.demo-deck');
        const drawnCard = containerRef.current.querySelector('.demo-drawn-card');
        const handArea = containerRef.current.querySelector('.demo-hand-area');

        if (!deck || !drawnCard || !handArea) return;

        // Set initial state
        gsap.set(drawnCard, { x: 0, y: 0, opacity: 0, scale: 0.8, rotateY: 180 });

        // Create repeating timeline
        timelineRef.current = gsap.timeline({ repeat: -1, repeatDelay: 1 });

        timelineRef.current
            // Deck pulse (click indication)
            .to(deck, { scale: 1.1, duration: 0.15, ease: "power2.out" })
            .to(deck, { scale: 1, duration: 0.1 })
            // Card appears from deck
            .to(drawnCard, { opacity: 1, duration: 0.1 }, "-=0.1")
            // Card flies to hand with flip
            .to(drawnCard, {
                x: 60,
                y: 40,
                scale: 1,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out"
            })
            // Card settles
            .to(drawnCard, { y: 35, duration: 0.2, ease: "bounce.out" })
            // Hold for a moment
            .to({}, { duration: 0.8 })
            // Reset
            .to(drawnCard, { opacity: 0, duration: 0.2 })
            .set(drawnCard, { x: 0, y: 0, scale: 0.8, rotateY: 180 });

        return () => { timelineRef.current?.kill(); };
    }, []);

    return (
        <div ref={containerRef} className="demo-container deck-demo">
            <div className="demo-deck">
                <div className="deck-label">DECK</div>
                <div className="deck-count">5</div>
            </div>
            <div className="demo-drawn-card">♠</div>
            <div className="demo-hand-area">
                <span>Hand</span>
            </div>
        </div>
    );
}

// Step 2: Inspect - Card flip animation
function InspectDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const card = containerRef.current.querySelector('.demo-flip-card');
        const cursor = containerRef.current.querySelector('.demo-cursor');
        const cardInner = containerRef.current.querySelector('.demo-card-inner');

        if (!card || !cursor || !cardInner) return;

        gsap.set(cursor, { x: 20, y: 60, opacity: 0 });
        gsap.set(card, { y: 0, scale: 1 });
        gsap.set(cardInner, { rotateY: 0 });

        timelineRef.current = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

        timelineRef.current
            // Cursor appears and moves to card
            .to(cursor, { opacity: 1, duration: 0.2 })
            .to(cursor, { x: 50, y: 30, duration: 0.4, ease: "power2.out" })
            // Click effect
            .to(cursor, { scale: 0.8, duration: 0.1 })
            .to(cursor, { scale: 1, duration: 0.1 })
            // Card lifts and flips
            .to(card, { y: -15, scale: 1.15, duration: 0.3, ease: "power2.out" }, "-=0.1")
            .to(cardInner, { rotateY: 180, duration: 0.4, ease: "power2.inOut" }, "-=0.2")
            // Hold
            .to({}, { duration: 1 })
            // Flip back and return
            .to(cardInner, { rotateY: 0, duration: 0.3, ease: "power2.inOut" })
            .to(card, { y: 0, scale: 1, duration: 0.25, ease: "power2.in" }, "-=0.2")
            // Cursor fades
            .to(cursor, { opacity: 0, duration: 0.2 })
            .set(cursor, { x: 20, y: 60 });

        return () => { timelineRef.current?.kill(); };
    }, []);

    return (
        <div ref={containerRef} className="demo-container inspect-demo">
            <div className="demo-flip-card">
                <div className="demo-card-inner">
                    <div className="demo-card-front">
                        <span className="card-title">Project</span>
                        <span className="card-desc">Details</span>
                    </div>
                    <div className="demo-card-back">♥</div>
                </div>
            </div>
            <div className="demo-cursor">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M4 4l16 6-6 2-2 6z" />
                </svg>
            </div>
        </div>
    );
}

// Step 3: Fold or Play - Two path animation
function FoldPlayDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const card = containerRef.current.querySelector('.demo-action-card');
        const foldPile = containerRef.current.querySelector('.demo-fold-pile');
        const playPile = containerRef.current.querySelector('.demo-play-pile');

        if (!card || !foldPile || !playPile) return;

        gsap.set(card, { x: 0, y: 0, opacity: 1, scale: 1 });

        timelineRef.current = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

        timelineRef.current
            // Card rises
            .to(card, { y: -10, scale: 1.1, duration: 0.2 })
            // First demo: FOLD (goes left to red pile)
            .to(card, {
                x: -55,
                y: 5,
                scale: 0.6,
                rotation: -10,
                duration: 0.4,
                ease: "power2.in"
            })
            // Pile pulse
            .to(foldPile, { scale: 1.15, duration: 0.1 }, "-=0.1")
            .to(foldPile, { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.5)" })
            // Hide and reset
            .to(card, { opacity: 0, duration: 0.15 })
            .set(card, { x: 0, y: 0, scale: 1, rotation: 0 })
            .to(card, { opacity: 1, duration: 0.15 })
            // Hold
            .to({}, { duration: 0.3 })
            // Card rises again
            .to(card, { y: -10, scale: 1.1, duration: 0.2 })
            // Second demo: PLAY (goes right to green pile)
            .to(card, {
                x: 55,
                y: 5,
                scale: 0.6,
                rotation: 10,
                duration: 0.4,
                ease: "power2.in",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)"
            })
            // Pile pulse
            .to(playPile, { scale: 1.15, duration: 0.1 }, "-=0.1")
            .to(playPile, { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.5)" })
            // Reset
            .to(card, { opacity: 0, duration: 0.15 })
            .set(card, { x: 0, y: 0, scale: 1, rotation: 0, boxShadow: "none" })
            .to(card, { opacity: 1, duration: 0.15 });

        return () => { timelineRef.current?.kill(); };
    }, []);

    return (
        <div ref={containerRef} className="demo-container fold-play-demo">
            <div className="demo-fold-pile">
                <span>SKIP</span>
            </div>
            <div className="demo-action-card">♦</div>
            <div className="demo-play-pile">
                <span>SAVE</span>
            </div>
        </div>
    );
}

// Step 4: Cash Out - Pile to checkout animation
function CashOutDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const pile = containerRef.current.querySelector('.demo-saved-pile');
        const button = containerRef.current.querySelector('.demo-cashout-btn');
        const sparkles = containerRef.current.querySelectorAll('.demo-sparkle');

        if (!pile || !button) return;

        gsap.set(sparkles, { scale: 0, opacity: 0 });

        timelineRef.current = gsap.timeline({ repeat: -1, repeatDelay: 1 });

        timelineRef.current
            // Pile pulses to draw attention
            .to(pile, { scale: 1.1, boxShadow: "0 0 25px rgba(59, 130, 246, 0.7)", duration: 0.3 })
            .to(pile, { scale: 1, boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)", duration: 0.2 })
            // Arrow points to button
            .to({}, { duration: 0.3 })
            // Button highlight
            .to(button, { scale: 1.1, boxShadow: "0 0 20px rgba(16, 185, 129, 0.8)", duration: 0.2 })
            // Sparkles burst
            .to(sparkles, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                stagger: 0.05,
                ease: "back.out(2)"
            })
            .to(sparkles, {
                scale: 0,
                opacity: 0,
                duration: 0.4,
                stagger: 0.03
            }, "+=0.3")
            // Button returns
            .to(button, { scale: 1, boxShadow: "none", duration: 0.3 }, "-=0.3");

        return () => { timelineRef.current?.kill(); };
    }, []);

    return (
        <div ref={containerRef} className="demo-container cashout-demo">
            <div className="demo-saved-pile">
                <span>3</span>
                <small>SAVED</small>
            </div>
            <div className="demo-arrow">→</div>
            <div className="demo-cashout-btn">
                Cash Out
                <div className="demo-sparkle sparkle-1">✦</div>
                <div className="demo-sparkle sparkle-2">✦</div>
                <div className="demo-sparkle sparkle-3">✦</div>
            </div>
        </div>
    );
}

// ============================================
// TUTORIAL STEPS DATA
// ============================================

interface TutorialStep {
    title: string;
    description: string;
    highlight?: string;
    Demo: React.FC;
}

const TUTORIAL_STEPS: TutorialStep[] = [
    {
        title: "Welcome to the Portfolio",
        description: "Explore projects like you're at a casino table. Each card represents a unique project.",
        highlight: "Let's show you how it works!",
        Demo: WelcomeDemo
    },
    {
        title: "Draw from the Deck",
        description: "Click the deck to draw project cards into your hand. You can hold up to 5 cards at once.",
        highlight: "Click when your hand isn't full",
        Demo: DeckDemo
    },
    {
        title: "Inspect a Card",
        description: "Click any card to flip it and reveal project details. The card rises and shows its information.",
        highlight: "Tap to inspect, tap elsewhere to return",
        Demo: InspectDemo
    },
    {
        title: "Fold or Play",
        description: "Choose your action: FOLD to skip (red pile), or PLAY to save the project (green pile).",
        highlight: "Folded cards get ONE second chance!",
        Demo: FoldPlayDemo
    },
    {
        title: "Cash Out",
        description: "Saved projects appear in the blue pile. Click 'Cash Out' when ready to proceed!",
        highlight: "Use filters to browse by category",
        Demo: CashOutDemo
    }
];

// ============================================
// MAIN TUTORIAL COMPONENT
// ============================================

export function ShowcaseTutorial({ onComplete, forceShow = false }: ShowcaseTutorialProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (forceShow) {
            setIsVisible(true);
            setCurrentStep(0);
            return;
        }

        const hasSeen = localStorage.getItem(STORAGE_KEY);
        if (!hasSeen) {
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, [forceShow]);

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsVisible(false);
        onComplete();
    };

    const handleSkip = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsVisible(false);
        onComplete();
    };

    if (!isVisible) return null;

    const step = TUTORIAL_STEPS[currentStep];
    const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
    const isFirstStep = currentStep === 0;
    const StepDemo = step.Demo;

    return (
        <AnimatePresence>
            <motion.div
                className="tutorial-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="tutorial-modal tutorial-modal-animated"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {/* Close button */}
                    <button
                        className="tutorial-close"
                        onClick={handleSkip}
                        aria-label="Skip tutorial"
                    >
                        <X size={18} />
                    </button>

                    {/* Step indicator dots */}
                    <div className="tutorial-dots">
                        {TUTORIAL_STEPS.map((_, i) => (
                            <button
                                key={i}
                                className={`tutorial-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                                onClick={() => setCurrentStep(i)}
                                aria-label={`Go to step ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Animated Demo Area */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`demo-${currentStep}`}
                            className="tutorial-demo-area"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <StepDemo />
                        </motion.div>
                    </AnimatePresence>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            className="tutorial-content tutorial-content-compact"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                        >
                            <h2 className="tutorial-title">{step.title}</h2>
                            <p className="tutorial-description">{step.description}</p>

                            {step.highlight && (
                                <div className="tutorial-highlight">
                                    <Sparkles size={14} className="text-amber-400" />
                                    <span>{step.highlight}</span>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="tutorial-nav">
                        <button
                            className="tutorial-btn secondary"
                            onClick={handlePrev}
                            disabled={isFirstStep}
                        >
                            <ChevronLeft size={18} />
                            Back
                        </button>

                        <button
                            className="tutorial-btn primary"
                            onClick={handleNext}
                        >
                            {isLastStep ? "Let's Play!" : 'Next'}
                            {!isLastStep && <ChevronRight size={18} />}
                        </button>
                    </div>

                    {/* Skip link */}
                    {!isLastStep && (
                        <button className="tutorial-skip" onClick={handleSkip}>
                            Skip tutorial
                        </button>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Hook to check if tutorial should be shown
export function useTutorialState() {
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem(STORAGE_KEY);
        setShouldShow(!hasSeen);
    }, []);

    const resetTutorial = () => {
        localStorage.removeItem(STORAGE_KEY);
        setShouldShow(true);
    };

    return { shouldShow, resetTutorial };
}
