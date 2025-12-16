import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { CircularGallery, GalleryItem } from "@/components/ui/circular-gallery";
import { CategoryFilter } from "@/components/ui/category-filter";
import { GradientHeadline } from "@/components/ui/gradient-headline";
import { motion, AnimatePresence } from "framer-motion";
import {
    MousePointer2,
    RotateCcw,
    Sparkles,
    Clock,
    Quote,
    CheckCircle2,
    ArrowRight,
    BarChart3,
    ChevronDown
} from "lucide-react";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

// Category to gradient mapping for ambient lighting - Dark theme optimized
const categoryGradients: Record<string, string> = {
    'All': 'radial-gradient(ellipse at center, rgb(139, 92, 246, 0.08) 0%, rgb(168, 85, 247, 0.05) 40%, transparent 70%)',
    'Full Stack Web': 'radial-gradient(ellipse at center, rgb(59, 130, 246, 0.1) 0%, rgb(37, 99, 235, 0.06) 40%, transparent 70%)',
    'Machine Learning': 'radial-gradient(ellipse at center, rgb(168, 85, 247, 0.1) 0%, rgb(147, 51, 234, 0.06) 40%, transparent 70%)',
    'Deep Learning': 'radial-gradient(ellipse at center, rgb(236, 72, 153, 0.1) 0%, rgb(219, 39, 119, 0.06) 40%, transparent 70%)',
    'Mobile Application': 'radial-gradient(ellipse at center, rgb(249, 115, 22, 0.1) 0%, rgb(234, 88, 12, 0.06) 40%, transparent 70%)',
    'NLP': 'radial-gradient(ellipse at center, rgb(6, 182, 212, 0.1) 0%, rgb(8, 145, 178, 0.06) 40%, transparent 70%)',
    'Frontend': 'radial-gradient(ellipse at center, rgb(16, 185, 129, 0.1) 0%, rgb(5, 150, 105, 0.06) 40%, transparent 70%)',
    'Productivity': 'radial-gradient(ellipse at center, rgb(245, 158, 11, 0.1) 0%, rgb(217, 119, 6, 0.06) 40%, transparent 70%)',
    'FinTech': 'radial-gradient(ellipse at center, rgb(99, 102, 241, 0.1) 0%, rgb(79, 70, 229, 0.06) 40%, transparent 70%)',
};

import { type CaseStudy } from "@/data/case-studies";


// Technology icons mapping
const techIcons: Record<string, string> = {
    "React": "⚛️",
    "React Native": "⚛️",
    "Node.js": "🟢",
    "Python": "🐍",
    "TensorFlow": "🧠",
    "MongoDB": "🍃",
    "PostgreSQL": "🐘",
    "AWS": "☁️",
    "Docker": "🐳",
    "TypeScript": "📘",
    "Next.js": "▲",
    "Firebase": "🔥",
    "Redis": "🔴",
};

export function ProjectShowcase() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCaseStudies, setSelectedCaseStudies] = useState<CaseStudy[]>([]);
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);
    const caseStudySectionRef = React.useRef<HTMLDivElement>(null);
    const lastCaseStudyRef = React.useRef<HTMLDivElement>(null);

    const items: GalleryItem[] = [
        {
            common: "E-Commerce Platform",
            binomial: "Full Stack Web",
            description: "A complete MERN stack e-commerce solution with Stripe payment integration, admin dashboard, and real-time inventory management.",
            features: [
                "Secure Payment Gateway",
                "Admin Dashboard",
                "Inventory Tracking",
                "User Authentication",
                "Responsive Design"
            ],
            photo: {
                url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
                text: "E-Commerce Platform",
                by: "ProjectCraft",
                pos: "center"
            }
        },
        {
            common: "Disease Prediction",
            binomial: "Machine Learning",
            description: "Advanced ML model achieving 98% accuracy in early disease detection using patient data. Includes comprehensive data visualization.",
            features: [
                "98% Accuracy",
                "Data Visualization",
                "Real-time Prediction",
                "Exportable Reports",
                "HIPAA Compliant"
            ],
            photo: {
                url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
                text: "Disease Prediction Model",
                by: "ProjectCraft",
                pos: "center"
            }
        },
        {
            common: "Fitness Tracker Pro",
            binomial: "Mobile Application",
            description: "Cross-platform fitness tracking app built with React Native. Works seamlessly offline with local storage sync and real-time cloud backup when online.",
            features: [
                "Offline-First Architecture",
                "Cloud Sync & Backup",
                "Workout Tracking",
                "Progress Analytics",
                "Social Sharing"
            ],
            photo: {
                url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
                text: "Fitness Tracker App",
                by: "ProjectCraft",
                pos: "center"
            }
        },
        {
            common: "Sentiment Analyzer",
            binomial: "NLP",
            description: "Real-time social media sentiment analysis tool processing thousands of tweets per second to gauge public opinion.",
            features: [
                "Real-time Processing",
                "Multi-language Support",
                "Trend Analysis",
                "API Integration",
                "Visual Dashboards"
            ],
            photo: {
                url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80",
                text: "Sentiment Analysis Tool",
                by: "ProjectCraft",
                pos: "center"
            }
        },
        {
            common: "Portfolio Builder",
            binomial: "Frontend",
            description: "A modern, responsive portfolio website built with Next.js and Framer Motion, featuring 3D animations and dark mode.",
            features: [
                "3D Animations",
                "Dark Mode Support",
                "SEO Optimized",
                "Fast Performance",
                "CMS Integration"
            ],
            photo: {
                url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
                text: "Portfolio Website",
                by: "ProjectCraft",
                pos: "center"
            }
        },
        {
            common: "Team Taskboard",
            binomial: "Productivity",
            description: "Collaborative task management tool with real-time updates, drag-and-drop interface, and team analytics.",
            features: [
                "Real-time Sync",
                "Drag & Drop",
                "Team Analytics",
                "File Sharing",
                "Calendar View"
            ],
            photo: {
                url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
                text: "Task Management App",
                by: "ProjectCraft",
                pos: "center"
            }
        },
        {
            common: "Image Classifier",
            binomial: "Deep Learning",
            description: "CNN-based image classification system trained on custom datasets with 95%+ accuracy for object detection.",
            features: [
                "Custom CNN Architecture",
                "Transfer Learning",
                "Batch Processing",
                "Model Export",
                "GPU Accelerated"
            ],
            photo: {
                url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
                text: "Deep Learning Classifier",
                by: "ProjectCraft",
                pos: "center"
            }
        },
        {
            common: "Crypto Dashboard",
            binomial: "FinTech",
            description: "Real-time cryptocurrency tracking dashboard with portfolio management, alerts, and predictive analytics.",
            features: [
                "Live Price Updates",
                "Portfolio Tracking",
                "Price Alerts",
                "Historical Charts",
                "News Integration"
            ],
            photo: {
                url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
                text: "Crypto Dashboard",
                by: "ProjectCraft",
                pos: "center"
            }
        }
    ];

    // Extract unique categories and calculate counts
    const categories = useMemo(() => ['All', ...Array.from(new Set(items.map(item => item.binomial)))], [items]);

    const projectCounts = useMemo(() => {
        const counts: Record<string, number> = { 'All': items.length };
        items.forEach(item => {
            counts[item.binomial] = (counts[item.binomial] || 0) + 1;
        });
        return counts;
    }, [items]);

    // Filter items based on selected category
    const filteredItems = useMemo(() => {
        if (selectedCategory === 'All') return items;
        return items.filter(item => item.binomial === selectedCategory);
    }, [selectedCategory, items]);

    const stats = [
        { value: filteredItems.length.toString(), label: selectedCategory === 'All' ? "Total Projects" : "Filtered Projects" },
        { value: categories.length - 1, label: "Tech Categories" },
        { value: "100%", label: "Client Satisfaction" },
    ];

    const [dimensions, setDimensions] = React.useState({
        radius: 400,
        width: 280,
        height: 400
    });

    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) { // Mobile - increased radius, smaller cards to prevent overlap
                setDimensions({ radius: 280, width: 180, height: 300 });
            } else if (width < 1024) { // Tablet
                setDimensions({ radius: 300, width: 250, height: 360 });
            } else { // Desktop
                setDimensions({ radius: 400, width: 280, height: 400 });
            }
        };

        handleResize(); // Initial set
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get ambient gradient based on active project or selected filter
    const activeGradient = useMemo(() => {
        if (filteredItems.length > 0 && activeProjectIndex < filteredItems.length) {
            const activeProject = filteredItems[activeProjectIndex];
            return categoryGradients[activeProject.binomial] || categoryGradients['All'];
        }
        return categoryGradients[selectedCategory] || categoryGradients['All'];
    }, [activeProjectIndex, filteredItems, selectedCategory]);

    // Handle card expand - find matching case study and add to list
    const handleCardExpand = async (item: GalleryItem) => {
        // Dynamically import the case studies data only when needed
        const { caseStudies } = await import("@/data/case-studies");

        const matchingCaseStudy = caseStudies.find(
            cs => cs.title.toLowerCase() === item.common.toLowerCase()
        );
        if (matchingCaseStudy) {
            // Check if already added to avoid duplicates
            const alreadyAdded = selectedCaseStudies.some(cs => cs.id === matchingCaseStudy.id);
            if (!alreadyAdded) {
                setSelectedCaseStudies(prev => [...prev, matchingCaseStudy]);
                // Scroll to the new case study after a brief delay for animation
                setTimeout(() => {
                    lastCaseStudyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                // If already added, just scroll to it
                const element = document.getElementById(`case-study-${matchingCaseStudy.id}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Remove a specific case study
    const removeCaseStudy = (id: string) => {
        setSelectedCaseStudies(prev => prev.filter(cs => cs.id !== id));
    };

    // Clear all case studies
    const clearAllCaseStudies = () => {
        setSelectedCaseStudies([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative pt-20 min-h-screen font-sans-secondary flex flex-col"
        >
            {/* Dynamic Ambient Background */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    background: activeGradient
                }}
                transition={{
                    opacity: { duration: 0.5 },
                    background: { duration: 3, ease: "easeInOut" }
                }}
                className="fixed inset-0 -z-10"
            />

            {/* Static background layer */}
            <div className="fixed inset-0 -z-20 bg-background" />

            {/* Header Section - Swipeable zone */}
            <div data-swipeable="true" className="text-center mb-12 mt-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Featured Work
                    </div>
                </motion.div>

                <GradientHeadline
                    text="Project Gallery"
                    className="text-4xl md:text-6xl mb-4"
                />
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto font-light mb-8"
                >
                    Explore our collection of academic and professional projects across multiple domains.
                </motion.p>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex justify-center gap-8 md:gap-16 mb-8"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-secondary to-brand-accent">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Interaction Hints */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
                >
                    <div className="flex items-center gap-2">
                        <MousePointer2 className="w-4 h-4" />
                        <span>Scroll to rotate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        <span>Click card for case study</span>
                    </div>
                </motion.div>
            </div>

            {/* Category Filter - Swipeable zone */}
            <div data-swipeable="true">
                <CategoryFilter
                    categories={categories}
                    activeCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    projectCounts={projectCounts}
                />
            </div>

            {/* Gallery Container */}
            <AnimatePresence>
                <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-[550px] md:h-[700px] w-full overflow-hidden relative z-10 mb-8 pointer-events-auto"
                    data-no-swipe="true"
                >
                    <CircularGallery
                        items={filteredItems}
                        radius={dimensions.radius}
                        itemWidth={dimensions.width}
                        itemHeight={dimensions.height}
                        autoRotateSpeed={0.4}
                        onCardExpand={handleCardExpand}
                        onActiveIndexChange={setActiveProjectIndex}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Scroll Indicator when case studies are available */}
            <AnimatePresence>
                {selectedCaseStudies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center gap-4 mb-4"
                    >
                        <button
                            onClick={() => caseStudySectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex flex-col items-center gap-1 text-brand-secondary hover:text-brand-accent transition-colors"
                        >
                            <span className="text-sm font-medium">View {selectedCaseStudies.length} Case {selectedCaseStudies.length === 1 ? 'Study' : 'Studies'}</span>
                            <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <ChevronDown className="w-5 h-5" />
                            </motion.div>
                        </button>
                        {selectedCaseStudies.length > 1 && (
                            <button
                                onClick={clearAllCaseStudies}
                                className="text-sm text-muted-foreground hover:text-red-400 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Inline Case Study Sections - Stacked */}
            <div ref={caseStudySectionRef} className="space-y-8">
                {selectedCaseStudies.map((caseStudy, caseStudyIndex) => (
                    <motion.div
                        key={caseStudy.id}
                        id={`case-study-${caseStudy.id}`}
                        ref={caseStudyIndex === selectedCaseStudies.length - 1 ? lastCaseStudyRef : null}
                        initial={{
                            opacity: 0,
                            y: caseStudyIndex === 0 ? 80 : -60,
                            scale: caseStudyIndex === 0 ? 0.9 : 0.95
                        }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{
                            duration: caseStudyIndex === 0 ? 0.8 : 0.6,
                            ease: [0.22, 1, 0.36, 1],
                            opacity: { duration: caseStudyIndex === 0 ? 0.6 : 0.5 },
                            scale: { type: "spring", damping: 20, stiffness: 100 }
                        }}
                        className="overflow-hidden"
                    >
                        <div className="container mx-auto px-4 pb-4">
                            <div className="relative rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden">
                                {/* Close Button for individual case study */}
                                <button
                                    onClick={() => removeCaseStudy(caseStudy.id)}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"
                                    title="Remove this case study"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Header */}
                                <div className="p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-brand-secondary/10 to-brand-accent/10">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <span className="px-4 py-1.5 rounded-full bg-brand-secondary/20 text-brand-secondary text-sm font-semibold">
                                            {caseStudy.category}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            {caseStudy.timeline}
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-auto mr-8">
                                            #{caseStudyIndex + 1} of {selectedCaseStudies.length}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                                        {caseStudy.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-2">
                                        Detailed case study and project breakdown
                                    </p>
                                </div>

                                {/* Content Grid */}
                                <div className="p-6 md:p-8 space-y-8">
                                    {/* The Challenge */}
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-lg">
                                                !
                                            </span>
                                            The Challenge
                                        </h4>
                                        <p className="text-muted-foreground pl-0 sm:pl-13 leading-relaxed">
                                            {caseStudy.challenge}
                                        </p>
                                    </div>

                                    {/* Our Approach */}
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                →
                                            </span>
                                            Our Approach
                                        </h4>
                                        <ul className="space-y-3 pl-0 sm:pl-13">
                                            {caseStudy.approach.map((step: string, i: number) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-3 text-muted-foreground"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                                    {step}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* The Solution */}
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                                ✓
                                            </span>
                                            The Solution
                                        </h4>
                                        <p className="text-muted-foreground pl-0 sm:pl-13 leading-relaxed">
                                            {caseStudy.solution}
                                        </p>
                                    </div>

                                    {/* Tech Stack */}
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-4">
                                            Tech Stack
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {caseStudy.techStack.map((tech: string) => (
                                                <span
                                                    key={tech}
                                                    className="px-4 py-2 rounded-xl bg-white/5 text-sm text-foreground border border-white/10 hover:border-brand-secondary/50 transition-colors"
                                                >
                                                    {techIcons[tech] || "•"} {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Results Grid */}
                                    <div>
                                        <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary">
                                                <BarChart3 className="w-5 h-5" />
                                            </span>
                                            Results
                                        </h4>
                                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                                            {caseStudy.results.map((result: { metric: string; value: string }) => (
                                                <div
                                                    key={result.metric}
                                                    className="p-4 rounded-xl bg-white/5 border border-white/10 text-center hover:border-brand-secondary/30 transition-colors"
                                                >
                                                    <div className="text-2xl font-bold text-brand-secondary">
                                                        {result.value}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {result.metric}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Client Quote */}
                                    {caseStudy.clientQuote && (
                                        <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-brand-secondary/10 to-brand-accent/10 border border-brand-secondary/20">
                                            <Quote className="absolute top-6 left-6 w-10 h-10 text-brand-secondary/30" />
                                            <p className="text-base sm:text-lg md:text-xl italic text-foreground mb-4 pl-8 sm:pl-14">
                                                "{caseStudy.clientQuote.text}"
                                            </p>
                                            <div className="pl-8 sm:pl-14">
                                                <div className="font-semibold text-foreground">
                                                    {caseStudy.clientQuote.author}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {caseStudy.clientQuote.role}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                                        <Link
                                            to={`/start-project?type=${caseStudy.category.toLowerCase().replace(/\s+/g, '-')}&project=${caseStudy.id}`}
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent hover:from-brand-secondary/80 hover:to-brand-accent/80 text-white font-semibold transition-all shadow-lg hover:shadow-brand-secondary/25"
                                        >
                                            Start Similar Project
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Clear All Button at bottom when multiple studies */}
            <AnimatePresence>
                {selectedCaseStudies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center py-8"
                    >
                        <button
                            onClick={clearAllCaseStudies}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-foreground font-semibold transition-all hover:bg-white/10 hover:border-red-400/50 hover:text-red-400"
                        >
                            Clear All & Back to Gallery
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center pt-16 pb-40 px-4"
            >
                <p className="text-muted-foreground mb-4">
                    Don't see what you're looking for? We build custom projects too.
                </p>
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent hover:from-brand-secondary/80 hover:to-brand-accent/80 text-white font-semibold transition-all shadow-lg hover:shadow-brand-secondary/25"
                >
                    Request Custom Project
                    <span>→</span>
                </Link>
            </motion.div>
        </motion.div>
    );
}
