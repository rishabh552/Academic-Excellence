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
    onClick: () => void;
    onFold?: () => void;
    onPlay?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const PokerCard = forwardRef<HTMLDivElement, PokerCardProps>(({
    project,
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

        // Glare effect always active for premium feel
        if (glareRef.current) {
            gsap.to(glareRef.current, {
                backgroundPositionX: `${(mouseX / width) * 100}%`,
                backgroundPositionY: `${(mouseY / height) * 100}%`,
                opacity: isFocused ? 0.5 : 1, // Subtle glare when focused
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
            gsap.to(glareRef.current, {
                backgroundPositionX: "50%",
                backgroundPositionY: "50%",
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
                className
            )}
            style={style}
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

                    <div className="relative z-10 text-center p-4">
                        <div className={cn(
                            "inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 backdrop-blur-md border border-white/10 shadow-xl",
                            getBadgeClass(project.binomial)
                        )}>
                            <Layers className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-xl tracking-wide font-display">
                            {project.common}
                        </h3>
                        <div className="h-0.5 w-12 bg-white/30 mx-auto mt-2 rounded-full" />
                    </div>
                </div>

                {/* FRONT FACE = Details (Shown when inspected) */}
                <div className="card-face card-front">
                    <div className="card-front-content">
                        <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-2">
                            <h3 className="text-lg font-bold text-white leading-tight">
                                {project.common}
                            </h3>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-xs text-emerald-400">♥</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-300 flex-grow mb-4 leading-relaxed font-light">
                            {project.description}
                        </p>

                        <div className="space-y-2 mb-6">
                            {project.features.slice(0, 3).map((f, i) => (
                                <div key={i} className="flex items-center text-xs text-gray-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    {f}
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto grid grid-cols-2 gap-3 opacity-0 action-buttons">
                            <button
                                onClick={(e) => { e.stopPropagation(); onFold?.(); }}
                                className="bg-white/5 hover:bg-white/10 text-white text-xs py-2 px-3 rounded-lg border border-white/10 flex items-center justify-center transition-all"
                            >
                                <RefreshCw size={14} className="mr-1.5" />
                                Fold
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onPlay?.(); }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 px-3 rounded-lg flex items-center justify-center transition-all shadow-lg shadow-emerald-900/40 transform hover:scale-105"
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
