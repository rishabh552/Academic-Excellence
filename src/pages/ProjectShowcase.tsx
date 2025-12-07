import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { CircularGallery, GalleryItem } from "@/components/ui/circular-gallery";
import { CategoryFilter } from "@/components/ui/category-filter";
import { ProjectModal } from "@/components/ui/project-modal";
import { GradientHeadline } from "@/components/ui/gradient-headline";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, RotateCcw, Sparkles } from "lucide-react";

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

export function ProjectShowcase() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedProject, setExpandedProject] = useState<GalleryItem | null>(null);
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);

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
            if (width < 640) { // Mobile
                setDimensions({ radius: 180, width: 220, height: 320 });
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

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative pt-20 min-h-screen font-sans-secondary flex flex-col overflow-hidden"
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
                        <span>Click card to flip</span>
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
                    className="flex-grow h-[550px] md:h-[700px] w-full overflow-hidden relative z-10 mb-8 pointer-events-auto"
                    data-no-swipe="true"
                >
                    <CircularGallery
                        items={filteredItems}
                        radius={dimensions.radius}
                        itemWidth={dimensions.width}
                        itemHeight={dimensions.height}
                        autoRotateSpeed={0.4}
                        onCardExpand={setExpandedProject}
                        onActiveIndexChange={setActiveProjectIndex}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center pt-16 pb-20 px-4"
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

            {/* Project Modal */}
            <ProjectModal project={expandedProject} onClose={() => setExpandedProject(null)} />
        </motion.div>
    );
}
