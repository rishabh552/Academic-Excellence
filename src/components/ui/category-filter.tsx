import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    projectCounts: Record<string, number>;
}

// Category color mapping - matches the badge colors from CircularGallery
const categoryColors: Record<string, { bg: string; text: string; glow: string }> = {
    'All': {
        bg: 'bg-gradient-to-r from-violet-500 to-purple-500',
        text: 'text-white',
        glow: 'shadow-violet-500/50'
    },
    'Full Stack Web': {
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        text: 'text-white',
        glow: 'shadow-blue-500/50'
    },
    'Machine Learning': {
        bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
        text: 'text-white',
        glow: 'shadow-purple-500/50'
    },
    'Deep Learning': {
        bg: 'bg-gradient-to-r from-pink-500 to-pink-600',
        text: 'text-white',
        glow: 'shadow-pink-500/50'
    },
    'Mobile Application': {
        bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
        text: 'text-white',
        glow: 'shadow-orange-500/50'
    },
    'NLP': {
        bg: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
        text: 'text-white',
        glow: 'shadow-cyan-500/50'
    },
    'Frontend': {
        bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
        text: 'text-white',
        glow: 'shadow-emerald-500/50'
    },
    'Productivity': {
        bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
        text: 'text-white',
        glow: 'shadow-amber-500/50'
    },
    'FinTech': {
        bg: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
        text: 'text-white',
        glow: 'shadow-indigo-500/50'
    },
};

export function CategoryFilter({ categories, activeCategory, onCategoryChange, projectCounts }: CategoryFilterProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full overflow-x-auto pb-4 mb-8"
        >
            <div className="flex gap-3 justify-center min-w-max px-4">
                {categories.map((category, index) => {
                    const isActive = activeCategory === category;
                    const colors = categoryColors[category] || categoryColors['All'];
                    const count = projectCounts[category] || 0;

                    return (
                        <motion.button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300",
                                "border-2 backdrop-blur-sm",
                                isActive
                                    ? `${colors.bg} ${colors.text} border-transparent shadow-lg ${colors.glow}`
                                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                            )}
                        >
                            {/* Active indicator glow */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className={cn(
                                        "absolute inset-0 rounded-full opacity-50 blur-xl",
                                        colors.bg
                                    )}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <span className="relative z-10 flex items-center gap-2">
                                {category}
                                {category !== 'All' && (
                                    <span className={cn(
                                        "text-xs px-1.5 py-0.5 rounded-full",
                                        isActive
                                            ? "bg-white/20"
                                            : "bg-white/10"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Scroll indicator for mobile */}
            <div className="md:hidden text-center mt-2">
                <span className="text-xs text-muted-foreground">← Scroll for more →</span>
            </div>
        </motion.div>
    );
}
