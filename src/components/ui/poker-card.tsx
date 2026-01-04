import React, { forwardRef, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Layers, RefreshCw, Eye } from 'lucide-react';
import gsap from 'gsap';
import './casino-portfolio.css';

export interface Project {
    common: string;
    binomial: string;
    description: string;
    features: string[];
    photo: { url: string };
    techStack?: string[];
}

interface PokerCardProps {
    project: Project;
    index: number;
    isActive: boolean;
    isFocused: boolean;
    isInHand: boolean;
    wasPlayed?: boolean; // New prop to track if card has been played at least once
    onClick: () => void;
    onFold?: () => void;
    onPlay?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const PokerCard = forwardRef<HTMLDivElement, PokerCardProps>(({
    project,
    isActive,
    isInHand,
    onClick,
    onFold,
    onPlay,
    className,
    style,
    isFocused,
    wasPlayed = false
}, ref) => {

    // TILT LOGIC
    const cardInnerRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

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

        // Glare effect - show when card was previously played (on hover), BUT NOT if currently active (picked) OR focused (inspected)
        if (glareRef.current && wasPlayed && !isActive && !isFocused) {
            const glareX = (mouseX / width) * 100;
            const glareY = (mouseY / height) * 100;

            glareRef.current.style.setProperty('--glare-x', `${glareX}%`);
            glareRef.current.style.setProperty('--glare-y', `${glareY}%`);

            gsap.to(glareRef.current, {
                opacity: 0.6,
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

        if (glareRef.current) {
            glareRef.current.style.setProperty('--glare-x', '50%');
            glareRef.current.style.setProperty('--glare-y', '50%');

            gsap.to(glareRef.current, {
                opacity: 0,
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
                <div className="card-face card-back">
                    <div className="absolute inset-0 z-0 bg-black/60" /> {/* Dimmer */}
                    <div className="absolute inset-0 z-0 opacity-60 mix-blend-overlay">
                        {/* Noise Overlay */}
                        <div className="w-full h-full bg-noise opacity-30" />
                    </div>

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
                            getBadgeClass(project.binomial)
                        )}>
                            <Layers className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>

                        <h3 className="text-sm md:text-2xl font-bold text-white mb-1 drop-shadow-xl tracking-wide font-display leading-tight text-center px-2 line-clamp-2">
                            {project.common}
                        </h3>
                        <div className="h-0.5 w-10 md:w-12 bg-white/30 mx-auto mt-1 md:mt-2 rounded-full" />
                    </div>
                </div>

                {/* FRONT FACE = Details (Shown when inspected) */}
                <div className="card-face card-front">
                    <div className="card-front-content p-2 md:p-6 overflow-hidden flex flex-col h-full">
                        <div className="flex justify-between items-start mb-1.5 md:mb-4 border-b border-white/10 pb-1 md:pb-2 flex-shrink-0">
                            <h3 className="text-xs md:text-lg font-bold text-white leading-tight line-clamp-1">
                                {project.common}
                            </h3>
                            <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ml-1">
                                <span className="text-[8px] md:text-xs text-emerald-400">♥</span>
                            </div>
                        </div>

                        <p className="text-[10px] md:text-sm text-gray-300 mb-1.5 md:mb-4 leading-snug font-light line-clamp-4 md:line-clamp-none flex-shrink-0">
                            {project.description}
                        </p>

                        <div className="space-y-0.5 md:space-y-2 mb-2 md:mb-6 flex-shrink-0">
                            {project.features.slice(0, 2).map((f, i) => (
                                <div key={i} className="flex items-center text-[9px] md:text-xs text-gray-400">
                                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500 mr-1 md:mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex-shrink-0" />
                                    <span className="truncate">{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons - Larger touch targets for mobile */}
                        <div className="mt-auto grid grid-cols-2 gap-2 md:gap-3 opacity-0 action-buttons">
                            <button
                                onClick={(e) => { e.stopPropagation(); onFold?.(); }}
                                className="bg-white/5 hover:bg-white/10 active:bg-white/20 text-white text-xs md:text-sm py-2.5 md:py-2.5 px-3 md:px-4 rounded-lg border border-white/10 flex items-center justify-center transition-all min-h-[44px]"
                            >
                                <RefreshCw size={14} className="mr-1.5" />
                                Fold
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onPlay?.(); }}
                                className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 text-white text-xs md:text-sm py-2.5 md:py-2.5 px-3 md:px-4 rounded-lg flex items-center justify-center transition-all shadow-lg shadow-emerald-900/40 transform hover:scale-105 active:scale-95 min-h-[44px]"
                            >
                                <Eye size={14} className="mr-1.5" />
                                Play
                            </button>
                        </div>
                    </div>
                </div>

                {/* Glare Effect */}
                <div
                    ref={glareRef}
                    className="card-glare-overlay"
                />
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
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
};

PokerCard.displayName = "PokerCard";
