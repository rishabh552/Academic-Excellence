import React, { forwardRef, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Layers, RefreshCw, Eye } from 'lucide-react';
import gsap from 'gsap';
import './casino-portfolio.css';
import './wild-card.css';

export interface Project {
    type?: 'standard' | 'wildcard';
    common: string;
    binomial: string;
    description: string;
    features: string[];
    photo: { url: string };
    techStack?: string[];
}

export const WILD_CARD_PROJECT: Project = {
    type: 'wildcard',
    common: "YOUR PROJECT",
    binomial: "Wild Card",
    description: "Don't see what you're looking for? Let's build something unique together.",
    features: ["Custom Solutions", "Tailored Fit", "Direct Collaboration"],
    photo: { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" }, // Cyberpunk/Tech placeholder
    techStack: ["Innovation", "Strategy", "Execution"]
};

interface PokerCardProps {
    project: Project;
    index: number;
    isActive: boolean;
    isFocused: boolean;
    isInHand: boolean;
    onClick: () => void;
    onFold?: () => void;
    onPlay?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const PokerCard = forwardRef<HTMLDivElement, PokerCardProps>(({
    project,
    isActive: _isActive, // Kept for API consistency
    isInHand,
    onClick,
    onFold,
    onPlay,
    className,
    style,
    isFocused
}, ref) => {

    // TILT LOGIC
    const cardInnerRef = useRef<HTMLDivElement>(null);
    const isWildCard = project.type === 'wildcard';

    // Context for cleanup
    const ctx = useRef<gsap.Context>();

    useEffect(() => {
        ctx.current = gsap.context(() => { }, cardInnerRef); // Scope context
        return () => ctx.current?.revert();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isInHand || !cardInnerRef.current) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Only apply tilt rotation when NOT focused (let parent control flip)
        if (!isFocused) {
            // Calculate rotation (-15 to 15 deg)
            const rotateY = ((mouseX / width) - 0.5) * 30;
            const rotateX = -((mouseY / height) - 0.5) * 30;

            gsap.to(cardInnerRef.current, {
                rotateY: rotateY,
                rotateX: rotateX,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    };

    const handleMouseLeave = () => {
        if (!cardInnerRef.current) return;

        // Only reset rotation if not focused
        if (!isFocused) {
            gsap.to(cardInnerRef.current, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                "poker-card",
                isInHand && "interactive",
                isFocused && "focused",
                className
            )}
            style={style}
            data-focused={isFocused}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* TILT CONTAINER - Separates Tilt from Position Transforms */}
            <div ref={cardInnerRef} className="card-tilt-inner">

                {/* BACK FACE = Image/Logo (Visible initially in Hand) */}
                <div className={cn("card-face card-back", isWildCard && "wild-card-variant")}>
                    <div className="absolute inset-0 z-0 bg-black/60" /> {/* Dimmer */}
                    <div className="absolute inset-0 z-0 opacity-60 mix-blend-overlay">
                        {/* Noise Overlay */}
                        <div className="w-full h-full bg-noise opacity-30" />
                    </div>

                    {isWildCard && <div className="wild-card-holo" />}

                    <div className="absolute inset-0 z-0">
                        <img
                            src={project.photo.url}
                            alt="Project Preview"
                            className="w-full h-full object-cover grayscale opacity-60 hover:opacity-80 transition-opacity duration-500"
                        />
                    </div>

                    <div className="relative z-10 text-center p-2 md:p-4">
                        <div className={cn(
                            "inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full mb-2 md:mb-3 backdrop-blur-md border border-white/10 shadow-xl",
                            getBadgeClass(isWildCard ? 'Wild Card' : project.binomial)
                        )}>
                            {isWildCard ? <code className="text-xs md:text-sm font-bold text-white">&lt;/&gt;</code> : <Layers className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                        </div>

                        <h3 className={cn(
                            "text-sm md:text-2xl font-bold text-white mb-1 drop-shadow-xl tracking-wide font-display leading-tight text-center px-2 line-clamp-2",
                            isWildCard && "wild-card-title text-transparent bg-clip-text bg-gradient-to-r from-magenta-500 to-cyan-500"
                        )}>
                            {project.common}
                        </h3>
                        <div className="h-0.5 w-10 md:w-12 bg-white/30 mx-auto mt-1 md:mt-2 rounded-full" />
                    </div>
                </div>

                {/* FRONT FACE = Details (Shown when inspected) */}
                <div className={cn("card-face card-front", isWildCard && "wild-card-variant")}>
                    <div className="card-front-content p-2 md:p-4 lg:p-6 overflow-hidden flex flex-col h-full">
                        <div className="flex justify-between items-start mb-1.5 md:mb-2 lg:mb-4 border-b border-white/10 pb-1 lg:pb-2 flex-shrink-0">
                            <h3 className={cn("text-xs md:text-base lg:text-lg font-bold text-white leading-tight line-clamp-1", isWildCard && "wild-card-title")}>
                                {project.common}
                            </h3>
                            <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ml-1">
                                <span className={cn("text-[8px] md:text-[10px] lg:text-xs", isWildCard ? "text-rose-500" : "text-emerald-400")}>
                                    {isWildCard ? "★" : "♥"}
                                </span>
                            </div>
                        </div>

                        <p className="text-[10px] md:text-xs lg:text-sm text-gray-300 mb-1.5 md:mb-3 lg:mb-4 leading-snug font-light line-clamp-4 md:line-clamp-none flex-shrink-0">
                            {project.description}
                        </p>

                        <div className="space-y-0.5 md:space-y-1 lg:space-y-2 mb-2 md:mb-3 lg:mb-6 flex-shrink-0">
                            {project.features.slice(0, 2).map((f, i) => (
                                <div key={i} className="flex items-center text-[9px] md:text-[10px] lg:text-xs text-gray-400">
                                    <span className={cn(
                                        "w-1 h-1 md:w-1 lg:w-1.5 lg:h-1.5 rounded-full mr-1 md:mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex-shrink-0",
                                        isWildCard ? "bg-rose-500 shadow-rose-500/50" : "bg-emerald-500"
                                    )} />
                                    <span className="truncate">{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons - Larger touch targets for mobile */}
                        <div className="mt-auto grid grid-cols-2 gap-2 lg:gap-3 opacity-0 action-buttons relative z-10" style={{ pointerEvents: 'auto' }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); onFold?.(); }}
                                className="bg-white/5 hover:bg-white/10 active:bg-white/20 text-white text-xs lg:text-sm py-2.5 md:py-2 lg:py-2.5 px-3 md:px-3 lg:px-4 rounded-lg border border-white/10 flex items-center justify-center transition-all min-h-[44px] cursor-pointer"
                                style={{ pointerEvents: 'auto' }}
                            >
                                <RefreshCw size={14} className="mr-1.5" />
                                {isWildCard ? "Pass" : "Fold"}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onPlay?.(); }}
                                className={cn(
                                    "text-white text-xs lg:text-sm py-2.5 md:py-2 lg:py-2.5 px-3 md:px-3 lg:px-4 rounded-lg flex items-center justify-center transition-all shadow-lg transform hover:scale-105 active:scale-95 min-h-[44px] cursor-pointer",
                                    isWildCard
                                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-fuchsia-900/40"
                                        : "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 shadow-emerald-900/40"
                                )}
                                style={{ pointerEvents: 'auto' }}
                            >
                                {isWildCard ? <code className="mr-1.5 font-bold">&gt;_</code> : <Eye size={14} className="mr-1.5" />}
                                {isWildCard ? "INITIATE" : "Play"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Thickness (Pseudo-3D) */}
            <div className="card-edge-right" />
            <div className="card-edge-bottom" />
        </div>
    );
});

// Utility for badge classes
const getBadgeClass = (category: string) => {
    switch (category) {
        case 'Frontend': return 'bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-blue-500/20';
        case 'Fullstack': return 'bg-purple-500/20 text-purple-300 border-purple-500/30 shadow-purple-500/20';
        case 'Backend': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-emerald-500/20';
        case 'Mobile': return 'bg-orange-500/20 text-orange-300 border-orange-500/30 shadow-orange-500/20';
        case 'Data Science': return 'bg-pink-500/20 text-pink-300 border-pink-500/30 shadow-pink-500/20';
        case 'NLP': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-cyan-500/20';
        case 'Wild Card': return 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-rose-500/20 animate-pulse';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
};

PokerCard.displayName = "PokerCard";
