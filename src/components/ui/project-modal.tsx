import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ExternalLink, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GalleryItem } from './circular-gallery';

interface ProjectModalProps {
    project: GalleryItem | null;
    onClose: () => void;
}

// Category color mapping
const categoryColors: Record<string, string> = {
    'Full Stack Web': 'from-blue-500 to-blue-600',
    'Machine Learning': 'from-purple-500 to-purple-600',
    'Deep Learning': 'from-pink-500 to-pink-600',
    'Mobile Application': 'from-orange-500 to-orange-600',
    'NLP': 'from-cyan-500 to-cyan-600',
    'Frontend': 'from-emerald-500 to-emerald-600',
    'Productivity': 'from-amber-500 to-amber-600',
    'FinTech': 'from-indigo-500 to-indigo-600',
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
    // Close on ESC key
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent body scroll when modal is open - robust cleanup to prevent navigation issues
    React.useEffect(() => {
        if (project) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow || '';
            };
        }
    }, [project]);

    const gradientColor = project ? categoryColors[project.binomial] || 'from-violet-500 to-purple-500' : '';

    return (
        <AnimatePresence>
            {project && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-auto"
                    >
                        <div className="max-w-5xl mx-auto bg-neutral-900 rounded-3xl border-2 border-white/10 shadow-2xl overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white transition-all hover:scale-110"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Hero Image */}
                            <div className="relative h-64 md:h-96 overflow-hidden">
                                <motion.img
                                    layoutId={`project-img-${project.common}`}
                                    src={project.photo.url}
                                    alt={project.photo.text}
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: project.photo.pos || 'center' }}
                                />
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent"
                                )} />

                                {/* Category Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute bottom-6 left-6"
                                >
                                    <span className={cn(
                                        "px-4 py-2 rounded-full text-sm font-bold uppercase text-white shadow-lg",
                                        `bg-gradient-to-r ${gradientColor}`
                                    )}>
                                        {project.binomial}
                                    </span>
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-10">
                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                                >
                                    {project.common}
                                </motion.h2>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="text-lg text-gray-300 mb-8 leading-relaxed"
                                >
                                    {project.description}
                                </motion.p>

                                {/* Features Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-8"
                                >
                                    <h3 className={cn(
                                        "text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r",
                                        gradientColor
                                    )}>
                                        Key Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {project.features?.map((feature, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.25 + idx * 0.05 }}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                                            >
                                                <span className={cn(
                                                    "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5",
                                                    `bg-gradient-to-r ${gradientColor}`
                                                )}>
                                                    <Check className="w-4 h-4 text-white" />
                                                </span>
                                                <span className="text-gray-300 group-hover:text-white transition-colors">
                                                    {feature}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* CTA Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col sm:flex-row justify-center gap-4"
                                >
                                    <Link
                                        to={`/contact?project=${encodeURIComponent(project.common)}`}
                                        onClick={onClose}
                                    >
                                        <button className={cn(
                                            "px-8 py-4 rounded-full text-white font-bold text-lg transition-all flex items-center gap-3",
                                            "shadow-2xl hover:shadow-3xl transform hover:scale-105",
                                            `bg-gradient-to-r ${gradientColor}`
                                        )}>
                                            <span>Get Started on This</span>
                                            <ExternalLink className="w-5 h-5" />
                                        </button>
                                    </Link>
                                    <Link
                                        to={`/case-studies?category=${encodeURIComponent(project.binomial)}`}
                                        onClick={onClose}
                                        className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg transition-all hover:bg-white/10 flex items-center gap-3 justify-center"
                                    >
                                        <span>Read Full Case Study</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
