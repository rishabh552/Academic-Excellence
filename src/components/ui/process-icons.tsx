import React, { useId } from "react";

interface IconProps {
    className?: string;
    color?: string;
}

// Common filter definition to reduce code duplication
// We still need unique IDs because they are used in separate SVG contexts
const GlowFilter = ({ id, color }: { id: string, color: string }) => (
    <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
        <radialGradient id={`grad-${id}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 32) rotate(90) scale(32)">
            <stop stopColor={color} stopOpacity="0.5" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
    </defs>
);

// 1. Requirements: Bold Checklist (Submission)
// Dark Blue Theme
export const RequirementsIcon: React.FC<IconProps> = ({ className, color = "#1e3a8a" }) => {
    const id = useId();
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <GlowFilter id={id} color={color} />

            {/* Background Glow */}
            <circle cx="32" cy="32" r="28" fill={`url(#grad-${id})`} opacity="0.4" />

            {/* Document Frame */}
            <rect x="14" y="10" width="36" height="44" rx="4" stroke={color} strokeWidth="3" fill="none" />

            {/* Check Items */}
            <path d="M22 20 L26 24 L32 18" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="36" y1="21" x2="44" y2="21" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" />

            <path d="M22 32 L26 36 L32 30" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="36" y1="33" x2="44" y2="33" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" />

            <path d="M22 44 L26 48 L32 42" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="36" y1="45" x2="44" y2="45" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </svg>
    );
};

// 2. Planning: Blueprint & Ruler (Structure)
// Magenta Theme
export const PlanningIcon: React.FC<IconProps> = ({ className, color = "#990F82" }) => {
    const id = useId();
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <GlowFilter id={id} color={color} />
            <circle cx="32" cy="32" r="28" fill={`url(#grad-${id})`} opacity="0.4" />

            {/* Layout Grid / Blueprint */}
            <rect x="10" y="10" width="44" height="32" rx="2" stroke={color} strokeWidth="2.5" opacity="0.8" />
            <line x1="10" y1="26" x2="54" y2="26" stroke={color} strokeWidth="1.5" />
            <line x1="32" y1="10" x2="32" y2="42" stroke={color} strokeWidth="1.5" />

            {/* Ruler / Tool */}
            <path d="M12 52 L52 52" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M16 52 V46 M24 52 V46 M32 52 V44 M40 52 V46 M48 52 V46" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

            {/* Highlight */}
            <circle cx="46" cy="18" r="3" fill={color} filter={`url(#glow-${id})`} />
        </svg>
    );
};

// 3. Development: Code Brackets & Gear (Building)
// Cyan Theme
export const DevelopmentIcon: React.FC<IconProps> = ({ className, color = "#06b6d4" }) => {
    const id = useId();
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <GlowFilter id={id} color={color} />
            <circle cx="32" cy="32" r="28" fill={`url(#grad-${id})`} opacity="0.4" />

            {/* Brackets */}
            <path d="M20 18 L10 32 L20 46" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M44 18 L54 32 L44 46" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Slash / Code Line */}
            <line x1="26" y1="46" x2="38" y2="18" stroke={color} strokeWidth="2.5" opacity="0.6" />

            {/* Gear (simplified) */}
            <circle cx="32" cy="32" r="6" stroke={color} strokeWidth="2.5" fill="none" />
            <path d="M32 24 V20 M32 40 V44 M24 32 H20 M40 32 H44" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
};

// 4. QA: Shield & Check (Protection)
// Emerald Theme
export const QAIcon: React.FC<IconProps> = ({ className, color = "#22c55e" }) => {
    const id = useId();
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <GlowFilter id={id} color={color} />
            <circle cx="32" cy="32" r="28" fill={`url(#grad-${id})`} opacity="0.4" />

            {/* Shield */}
            <path d="M32 6 C32 6 52 10 52 26 C52 42 32 58 32 58 C32 58 12 42 12 26 C12 10 32 6 32 6 Z" stroke={color} strokeWidth="3" fill="none" />

            {/* Bold Checkmark */}
            <path d="M22 28 L30 36 L44 20" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter={`url(#glow-${id})`} />
        </svg>
    );
};

// 5. Review: Magnifying Glass / Star (Inspection)
// Amber Theme
export const ReviewIcon: React.FC<IconProps> = ({ className, color = "#f59e0b" }) => {
    const id = useId();
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <GlowFilter id={id} color={color} />
            <circle cx="32" cy="32" r="28" fill={`url(#grad-${id})`} opacity="0.4" />

            {/* Magnifier Glass */}
            <circle cx="28" cy="28" r="14" stroke={color} strokeWidth="3.5" />
            <path d="M40 40 L54 54" stroke={color} strokeWidth="4" strokeLinecap="round" />

            {/* Star inside / Focus */}
            <path d="M28 20 L30 25 L36 25 L31 29 L33 34 L28 31 L23 34 L25 29 L20 25 L26 25 Z" fill={color} filter={`url(#glow-${id})`} />
        </svg>
    );
};

// 6. Delivery: Rocket Launch (Launch)
// Rose Theme
export const DeliveryIcon: React.FC<IconProps> = ({ className, color = "#f43f5e" }) => {
    const id = useId();
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <GlowFilter id={id} color={color} />
            <circle cx="32" cy="32" r="28" fill={`url(#grad-${id})`} opacity="0.4" />

            {/* Rocket Body */}
            <path d="M32 10 C32 10 22 20 22 36 C22 42 24 48 32 48 C40 48 42 42 42 36 C42 20 32 10 32 10 Z" stroke={color} strokeWidth="3" fill="none" />

            {/* Window */}
            <circle cx="32" cy="28" r="4" fill={color} filter={`url(#glow-${id})`} />

            {/* Fins */}
            <path d="M22 36 L14 46 L24 46" stroke={color} strokeWidth="3" strokeLinejoin="round" />
            <path d="M42 36 L50 46 L40 46" stroke={color} strokeWidth="3" strokeLinejoin="round" />

            {/* Flame */}
            <path d="M32 50 L28 56 L32 62 L36 56 Z" fill={color} opacity="0.8" filter={`url(#glow-${id})`} />
        </svg>
    );
};
