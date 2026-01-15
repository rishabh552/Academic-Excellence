import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BeamsBackground } from '@/components/ui/beams-background';
import { GradientHeadline } from '@/components/ui/gradient-headline';
import { cn } from '@/lib/utils';
import { useShowcaseOptional } from '@/context/ShowcaseContext';
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Code2,
    Brain,
    Smartphone,
    MessageSquare,
    Network,
    Clock,
    Send,
    CheckCircle2,
    X,
    Plus,
    Workflow,
} from 'lucide-react';

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

// Project types data
const projectTypes = [
    {
        id: 'web-development',
        title: 'Full-Stack Web Apps',
        description: 'Complete web applications with modern frameworks',
        icon: Code2,
        color: 'from-blue-500 to-blue-600',
        examples: ['E-Commerce', 'SaaS Platforms', 'Dashboards'],
    },
    {
        id: 'machine-learning',
        title: 'Machine Learning',
        description: 'Intelligent systems that learn from data',
        icon: Brain,
        color: 'from-purple-500 to-purple-600',
        examples: ['Predictive Models', 'Classification', 'Analytics'],
    },
    {
        id: 'deep-learning',
        title: 'Deep Learning',
        description: 'Advanced neural networks for complex problems',
        icon: Network,
        color: 'from-pink-500 to-pink-600',
        examples: ['Computer Vision', 'Pattern Detection', 'CNNs'],
    },
    {
        id: 'nlp',
        title: 'NLP Projects',
        description: 'Natural language processing solutions',
        icon: MessageSquare,
        color: 'from-cyan-500 to-cyan-600',
        examples: ['Chatbots', 'Sentiment Analysis', 'Translation'],
    },
    {
        id: 'mobile-apps',
        title: 'Mobile Applications',
        description: 'Cross-platform iOS and Android apps',
        icon: Smartphone,
        color: 'from-orange-500 to-orange-600',
        examples: ['React Native', 'Flutter', 'Native Apps'],
    },
    {
        id: 'n8n-automation',
        title: 'n8n Automation',
        description: 'Workflow automation and integrations',
        icon: Workflow,
        color: 'from-teal-500 to-teal-600',
        examples: ['Workflow Automation', 'API Integration', 'Data Pipelines'],
    },
];

// Case studies for Step 2
const caseStudyPreviews = [
    {
        id: 'ecommerce-platform',
        type: 'web-development',
        title: 'E-Commerce Platform',
        description: 'Modern MERN stack platform handling 15K+ daily transactions',
        timeline: '3 months',
        results: ['15K+/day transactions', '99.9% uptime', '+40% revenue'],
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&q=80',
    },
    {
        id: 'disease-prediction',
        type: 'machine-learning',
        title: 'AI Disease Prediction',
        description: 'Ensemble ML model achieving 98.2% prediction accuracy',
        timeline: '4 months',
        results: ['98.2% accuracy', '+65% early detection', '2,000+ lives impacted'],
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
    },
    {
        id: 'fitness-tracker',
        type: 'mobile-apps',
        title: 'Fitness Tracker Pro',
        description: 'React Native app with offline-first architecture',
        timeline: '2.5 months',
        results: ['4.8★ rating', '50K+ DAU', '100% offline reliability'],
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80',
    },
    {
        id: 'sentiment-analyzer',
        type: 'nlp',
        title: 'Sentiment Analyzer',
        description: 'Real-time NLP pipeline processing 10K+ posts/minute',
        timeline: '3 months',
        results: ['94% accuracy', '12 languages', '<30s alert latency'],
        image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&q=80',
    },
    {
        id: 'crypto-dashboard',
        type: 'web-development',
        title: 'Crypto Trading Dashboard',
        description: 'High-performance trading dashboard with ML predictions',
        timeline: '4 months',
        results: ['<50ms latency', '5 exchanges', '12K+ traders'],
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80',
    },
    {
        id: 'image-classifier',
        type: 'deep-learning',
        title: 'Image Classifier',
        description: 'CNN-based image classification with 95%+ accuracy',
        timeline: '3 months',
        results: ['95%+ accuracy', 'GPU accelerated', 'Custom CNN'],
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=80',
    },
    {
        id: 'portfolio-builder',
        type: 'web-development',
        title: 'Portfolio Builder',
        description: 'Modern portfolio website with 3D animations and dark mode',
        timeline: '2 months',
        results: ['3D animations', 'SEO optimized', 'CMS integration'],
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80',
    },
    {
        id: 'team-taskboard',
        type: 'web-development',
        title: 'Team Taskboard',
        description: 'Collaborative task management with real-time updates',
        timeline: '2.5 months',
        results: ['Real-time sync', 'Drag & drop', 'Team analytics'],
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80',
    },
    {
        id: 'n8n-bot',
        type: 'n8n-automation',
        title: 'N8N Bot',
        description: 'AI-powered Telegram bot with Gemini, voice transcription & RAG memory',
        timeline: '2 months',
        results: ['Gemini AI Agent', 'Pinecone RAG', 'Voice-to-Text'],
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
    },
];

// Custom Logos matching Pricing Section
const MiniLogo = () => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
        <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" className="fill-slate-800/50 stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 14L24 24L42 14" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 44V24" className="stroke-slate-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 24L32 29M24 24L16 29" className="stroke-slate-400/50" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const MajorLogo = () => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
        <path d="M8 38H40V42H8V38Z" className="fill-amber-500/20 stroke-amber-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 38L4 16L16 24L24 8L32 24L44 16L40 38H8Z" className="fill-amber-500/10 stroke-amber-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="18" r="3" className="fill-amber-200" />
        <circle cx="16" cy="24" r="2" className="fill-amber-300" />
        <circle cx="32" cy="24" r="2" className="fill-amber-300" />
    </svg>
);

const ResearchLogo = () => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
        <circle cx="24" cy="24" r="6" className="fill-fuchsia-400/30 stroke-fuchsia-300" strokeWidth="2" />
        <ellipse cx="24" cy="24" rx="18" ry="8" className="stroke-fuchsia-400/60" strokeWidth="1.5" transform="rotate(45 24 24)" />
        <ellipse cx="24" cy="24" rx="18" ry="8" className="stroke-purple-400/60" strokeWidth="1.5" transform="rotate(-45 24 24)" />
        <ellipse cx="24" cy="24" rx="18" ry="8" className="stroke-indigo-400/60" strokeWidth="1.5" />
        <circle cx="38" cy="10" r="2" className="fill-fuchsia-300 animate-pulse" />
    </svg>
);

// Updated Pricing packages
const packages = [
    {
        id: 'mini',
        name: 'Basic',
        price: '2,000',
        description: 'Perfect for semester projects and basic requirements.',
        icon: MiniLogo,
        color: 'text-slate-200',
        gradient: 'from-slate-300 via-slate-100 to-slate-300',
        glowColor: 'hover:shadow-[0_0_20px_-5px_rgba(148,163,184,0.5)]',
        hoverBorder: 'hover:border-slate-400',
        priceSuffix: 'Starting Price',
        features: [
            'Complete Source Code',
            'Basic Documentation',
            'Setup Instructions',
            '3 Days Delivery',
            'Standard Support',
        ],
    },
    {
        id: 'major',
        name: 'Professional',
        price: '3,000',
        description: 'Comprehensive solution for final year submissions.',
        icon: MajorLogo,
        color: 'text-amber-300',
        gradient: 'from-amber-300 via-yellow-200 to-amber-400',
        glowColor: 'hover:shadow-[0_0_25px_-5px_rgba(251,191,36,0.6)]',
        hoverBorder: 'hover:border-amber-400',
        popular: true,
        features: [
            'Complete Source Code',
            'Basic Documentation',
            'Setup Instructions',
            '1 Week Delivery',
            'Priority Support',
            'Project Report',
            'PPT Presentation',
            'Video Walkthrough'
        ],
    },
    {
        id: 'research',
        name: 'Research / Custom',
        price: '5,000+',
        description: 'For complex research papers and unique requirements.',
        icon: ResearchLogo,
        color: 'text-fuchsia-300',
        gradient: 'from-fuchsia-400 via-purple-300 to-indigo-400',
        glowColor: 'hover:shadow-[0_0_20px_-5px_rgba(232,121,249,0.5)]',
        hoverBorder: 'hover:border-fuchsia-400',
        priceSuffix: 'varies by complexity',
        features: [
            'Complete Source Code',
            'Research Implementation',
            'Novel Algorithms',
            'Custom Timeline',
            '1-on-1 Explanations',
            'Project Report',
            'Conference Quality',
        ],
    },
];

// Step Progress Bar Component
function StepProgressBar({ currentStep, completedSteps }: { currentStep: number; completedSteps: number[] }) {
    const steps = [
        { num: 1, label: 'Project Type' },
        { num: 2, label: 'Details' },
        { num: 3, label: 'Selections' },
        { num: 4, label: 'Package' },
        { num: 5, label: 'Contact' },
    ];

    return (
        <div className="w-full max-w-3xl mx-auto mb-12">
            <div className="flex justify-between items-center relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10">
                    <motion.div
                        className="h-full bg-gradient-to-r from-brand-secondary to-brand-accent"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {steps.map((step) => {
                    const isCompleted = completedSteps.includes(step.num);
                    const isCurrent = currentStep === step.num;

                    return (
                        <div key={step.num} className="flex flex-col items-center relative z-10">
                            <motion.div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                                    isCurrent
                                        ? 'bg-gradient-to-r from-brand-secondary to-brand-accent text-white shadow-lg shadow-brand-secondary/30'
                                        : isCompleted
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/10 text-muted-foreground'
                                )}
                                animate={{ scale: isCurrent ? 1.1 : 1 }}
                            >
                                {isCompleted && !isCurrent ? <Check className="w-5 h-5" /> : step.num}
                            </motion.div>
                            <span
                                className={cn(
                                    'mt-2 text-xs font-medium',
                                    isCurrent ? 'text-brand-secondary' : 'text-muted-foreground'
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Step 1: Choose Project Type
function Step1ProjectType({
    selectedType,
    onSelect,
}: {
    selectedType: string | null;
    onSelect: (type: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    What type of project do you need?
                </h2>
                <p className="text-muted-foreground">Select the category that best matches your requirements</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {projectTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;

                    return (
                        <motion.button
                            key={type.id}
                            onClick={() => onSelect(type.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            data-cursor="default"
                            className={cn(
                                'relative p-6 rounded-2xl border text-left transition-all',
                                isSelected
                                    ? 'border-brand-secondary bg-brand-secondary/10 ring-2 ring-brand-secondary/50'
                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            )}
                        >
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-secondary flex items-center justify-center"
                                >
                                    <Check className="w-4 h-4 text-white" />
                                </motion.div>
                            )}

                            <div
                                className={cn(
                                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r',
                                    type.color
                                )}
                            >
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-lg font-semibold text-foreground mb-1">{type.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{type.description}</p>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {type.examples.map((ex) => (
                                    <span
                                        key={ex}
                                        className="px-2 py-0.5 bg-white/5 rounded text-xs text-muted-foreground"
                                    >
                                        {ex}
                                    </span>
                                ))}
                            </div>

                            <Link
                                to="/services"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs text-brand-secondary hover:text-brand-accent transition-colors"
                            >
                                Learn more
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}

// Step 2: View Project Details
function Step2Details({
    selectedType,
    selectedProject,
    onSelect,
}: {
    selectedType: string | null;
    selectedProject: string | null;
    onSelect: (project: string, title: string) => void;
}) {
    const filteredProjects = caseStudyPreviews.filter(
        (p) => p.type === selectedType || !selectedType
    );

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Choose a similar project for reference
                </h2>
                <p className="text-muted-foreground">This helps us understand your requirements better</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {filteredProjects.map((project) => {
                    const isSelected = selectedProject === project.id;

                    return (
                        <motion.button
                            key={project.id}
                            onClick={() => onSelect(project.id, project.title)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            data-cursor="default"
                            className={cn(
                                'relative rounded-2xl border overflow-hidden text-left transition-all',
                                isSelected
                                    ? 'border-brand-secondary ring-2 ring-brand-secondary/50'
                                    : 'border-white/10 hover:border-white/20'
                            )}
                        >
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center"
                                >
                                    <Check className="w-5 h-5 text-white" />
                                </motion.div>
                            )}

                            <div className="h-32 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4 bg-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {project.timeline}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>

                                <div className="flex flex-wrap gap-2">
                                    {project.results.map((result, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-brand-secondary/10 text-brand-secondary text-xs rounded-full"
                                        >
                                            {result}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={() => onSelect('custom', 'Custom Project')}
                    data-cursor="default"
                    className={cn(
                        'px-6 py-3 rounded-full border transition-all',
                        selectedProject === 'custom'
                            ? 'border-brand-secondary bg-brand-secondary/10 text-brand-secondary'
                            : 'border-white/20 text-muted-foreground hover:text-foreground'
                    )}
                >
                    I have a different idea in mind
                </button>
            </div>
        </motion.div>
    );
}

// Step 3: Selected Projects (from Wizard Step 2 + Showcase)
interface WizardProject {
    id: string;
    title: string;
    description: string;
    image: string;
    timeline: string;
    results: string[];
}

function Step3SelectedProjects({ wizardProject }: { wizardProject: WizardProject | null }) {
    const { selectedProjects, removeProject, hasProjects } = useShowcaseOptional();

    // Check if we have any projects to display (wizard OR showcase)
    const hasAnyProjects = hasProjects || wizardProject !== null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Your Selected Projects
                </h2>
                <p className="text-muted-foreground">
                    {hasAnyProjects
                        ? 'Review your selections. These will help us understand your requirements.'
                        : 'You haven\'t selected any projects yet. Go back to choose a reference project or visit the Showcase!'}
                </p>
            </div>

            {hasAnyProjects ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {/* Wizard Step 2 Selection */}
                    {wizardProject && (
                        <motion.div
                            key={`wizard-${wizardProject.id}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-white/5 rounded-2xl border border-brand-secondary/30 overflow-hidden"
                        >
                            {/* Reference Badge */}
                            <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-brand-secondary/80 text-white text-xs font-medium">
                                Reference Project
                            </div>

                            {/* Project Image */}
                            <div className="w-full h-32 overflow-hidden">
                                <img
                                    src={wizardProject.image}
                                    alt={wizardProject.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Project Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-foreground text-lg mb-1">
                                    {wizardProject.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {wizardProject.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {wizardProject.results.slice(0, 2).map((result, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 bg-brand-secondary/10 text-brand-secondary text-xs rounded-full"
                                        >
                                            {result}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Showcase Projects */}
                    {selectedProjects.map((project) => (
                        <motion.div
                            key={project.common}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-brand-secondary/30 transition-all"
                        >
                            {/* Showcase Badge */}
                            <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-purple-500/80 text-white text-xs font-medium">
                                From Showcase
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeProject(project.common)}
                                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/80 text-white hover:bg-black transition-all"
                                title="Remove project"
                            >
                                <X size={16} />
                            </button>

                            {/* Project Image */}
                            {project.photo?.url && (
                                <div className="w-full h-32 overflow-hidden">
                                    <img
                                        src={project.photo.url}
                                        alt={project.common}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}

                            {/* Project Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-foreground text-lg mb-1">
                                    {project.common}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {project.binomial}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-secondary/10 flex items-center justify-center">
                        <Plus className="w-10 h-10 text-brand-secondary" />
                    </div>
                    <p className="text-muted-foreground mb-6">No projects selected yet</p>
                </div>
            )}

            {/* Add More Projects Link */}
            <div className="text-center mt-8">
                <Link
                    to="/showcase"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-secondary/30 text-brand-secondary hover:bg-brand-secondary/10 transition-all"
                >
                    <Plus size={18} />
                    {hasAnyProjects ? 'Add More from Showcase' : 'Browse Showcase'}
                </Link>
            </div>
        </motion.div>
    );
}

// Step 4: Choose Package
function Step4Package({
    selectedPackage,
    onSelect,
}: {
    selectedPackage: string | null;
    onSelect: (pkg: string) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Select your package
                </h2>
                <p className="text-muted-foreground">Choose the tier that fits your budget and requirements</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {packages.map((pkg) => {
                    const Icon = pkg.icon;
                    const isSelected = selectedPackage === pkg.id;

                    return (
                        <motion.button
                            key={pkg.id}
                            onClick={() => onSelect(pkg.id)}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            data-cursor="default"
                            className={cn(
                                'relative p-6 rounded-2xl border text-left transition-all duration-300 group',
                                'bg-[#050505] backdrop-blur-md', // Opaque Dark
                                isSelected
                                    ? cn('ring-2 bg-[#0A0A0A]', pkg.hoverBorder ? pkg.hoverBorder.replace('hover:', '') : 'border-brand-secondary') // Active state uses hover border color permanently or brand
                                    : cn('border-white/10', pkg.hoverBorder), // Default state with hover effect
                                pkg.glowColor // Outline glow
                            )}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-brand-secondary to-brand-accent rounded-full text-xs font-bold text-white shadow-lg shadow-brand-secondary/20">
                                    Most Popular
                                </div>
                            )}

                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-secondary flex items-center justify-center z-10"
                                >
                                    <Check className="w-4 h-4 text-white" />
                                </motion.div>
                            )}

                            {/* Icon Container matching Price Section */}
                            <div
                                className={cn(
                                    'w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110',
                                    'bg-[#151515] border border-white/10 shadow-inner'
                                )}
                            >
                                <div className={cn("w-10 h-10", "bg-clip-text text-transparent bg-gradient-to-br", pkg.gradient)}>
                                    <Icon />
                                    {/* Note: Icon component itself has gradients, but wrapper helps sizing */}
                                </div>
                            </div>

                            <h3 className={cn("text-2xl font-bold mb-1 font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-br", pkg.gradient)}>
                                {pkg.name}
                            </h3>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-2xl text-slate-500 font-serif italic mt-1">₹</span>
                                <span className="text-4xl font-bold text-white tracking-tighter">
                                    {pkg.price}
                                </span>
                            </div>

                            {/* Price Suffix */}
                            {pkg.priceSuffix && (
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-4">
                                    {pkg.priceSuffix}
                                </p>
                            )}

                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                {pkg.description}
                            </p>

                            <div className="w-full h-px bg-white/5 mb-6" />

                            <ul className="space-y-3">
                                {pkg.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className={cn(
                                            "flex h-4 w-4 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10",
                                            pkg.color
                                        )}>
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}

// Step 5: Contact Form
function Step5Contact({
    formData,
    onChange,
    onSubmit,
    isSubmitting,
    isSubmitted,
}: {
    formData: { name: string; email: string; phone: string; message: string };
    onChange: (field: string, value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    isSubmitted: boolean;
}) {
    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Thank You!
                </h2>
                <p className="text-muted-foreground mb-6">
                    We've received your project inquiry. Our team will contact you within 24 hours.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent text-white font-semibold"
                >
                    Back to Home
                    <ArrowRight className="w-4 h-4" />
                </a>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Let's get in touch
                </h2>
                <p className="text-muted-foreground">Fill in your details and we'll reach out to discuss your project</p>
            </div>

            <div className="max-w-xl mx-auto space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Your Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        autoComplete="name"
                        placeholder="John Doe"
                        className="w-full px-4 py-4 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-secondary/50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        autoComplete="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-4 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-secondary/50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        autoComplete="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-4 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-secondary/50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Project Details *</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => onChange('message', e.target.value)}
                        placeholder="Tell us about your project requirements, timeline, and any specific features you need..."
                        rows={4}
                        className="w-full px-4 py-4 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 resize-none"
                    />
                </div>

                <button
                    onClick={onSubmit}
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                    className={cn(
                        'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all',
                        isSubmitting || !formData.name || !formData.email || !formData.message
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-brand-secondary to-brand-accent hover:shadow-lg hover:shadow-brand-secondary/25'
                    )}
                >
                    {isSubmitting ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit Inquiry
                            <Send className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}

// Main Wizard Component
export function StartProject() {
    const [searchParams] = useSearchParams();

    // Wizard State
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [cameFromShowcase, setCameFromShowcase] = useState(false); // Track if user entered from showcase cash out

    // Step 1 Data
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Step 2 Data
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [_projectTitle, setProjectTitle] = useState<string | null>(null);

    // Step 3 Data
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

    // Step 4 Data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Check URL params for pre-selection and direct step navigation
    useEffect(() => {
        const type = searchParams.get('type');
        const project = searchParams.get('project');
        const stepParam = searchParams.get('step');

        if (type) {
            setSelectedType(type);
        }
        if (project) {
            const found = caseStudyPreviews.find(p => p.id === project);
            if (found) {
                setSelectedProject(found.id);
                setProjectTitle(found.title);
                if (found.type) {
                    setSelectedType(found.type);
                }
            }
        }

        // Direct navigation to a specific step (e.g., from Showcase "Leave Game")
        if (stepParam) {
            const targetStep = parseInt(stepParam, 10);
            if (targetStep >= 1 && targetStep <= 5) {
                setCurrentStep(targetStep);
                // If coming directly to step 3, mark as from showcase
                if (targetStep === 3) {
                    setCameFromShowcase(true);
                }
                // Mark all previous steps as completed
                const completed = [];
                for (let i = 1; i < targetStep; i++) {
                    completed.push(i);
                }
                setCompletedSteps(completed);
            }
        }
    }, [searchParams]);

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return selectedType !== null;
            case 2:
                return selectedProject !== null;
            case 3:
                return true; // Selected projects step - always can proceed
            case 4:
                return selectedPackage !== null;
            case 5:
                return formData.name && formData.email && formData.message;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (canProceed() && currentStep < 5) {
            setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            // If user came from showcase and is on step 3, go directly to step 1
            if (cameFromShowcase && currentStep === 3) {
                setCurrentStep(1);
                setCompletedSteps([]);
                setCameFromShowcase(false); // Reset after going back
            } else {
                setCurrentStep(currentStep - 1);
            }
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setCompletedSteps((prev) => [...prev, 5]);
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative pt-20 min-h-screen font-sans-secondary"
        >
            <BeamsBackground
                intensity="medium"
                colorHue={270} // Purple
                colorRange={40}
                beamCount={12}
            />

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <GradientHeadline text="Start Your Project" className="text-3xl md:text-5xl mb-4" />
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Let's build something amazing together. Follow the steps below to tell us about your project.
                    </p>
                </div>

                {/* Progress Bar */}
                <StepProgressBar currentStep={currentStep} completedSteps={completedSteps} />

                {/* Step Content */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <Step1ProjectType
                                key="step1"
                                selectedType={selectedType}
                                onSelect={(type) => setSelectedType(type)}
                            />
                        )}
                        {currentStep === 2 && (
                            <Step2Details
                                key="step2"
                                selectedType={selectedType}
                                selectedProject={selectedProject}
                                onSelect={(id, title) => {
                                    setSelectedProject(id);
                                    setProjectTitle(title);
                                }}
                            />
                        )}
                        {currentStep === 3 && (
                            <Step3SelectedProjects
                                key="step3"
                                wizardProject={
                                    selectedProject && selectedProject !== 'custom'
                                        ? caseStudyPreviews.find(p => p.id === selectedProject) || null
                                        : null
                                }
                            />
                        )}
                        {currentStep === 4 && (
                            <Step4Package
                                key="step4"
                                selectedPackage={selectedPackage}
                                onSelect={(pkg) => setSelectedPackage(pkg)}
                            />
                        )}
                        {currentStep === 5 && (
                            <Step5Contact
                                key="step5"
                                formData={formData}
                                onChange={(field, value) =>
                                    setFormData((prev) => ({ ...prev, [field]: value }))
                                }
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                isSubmitted={isSubmitted}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                {!isSubmitted && (
                    <div className="flex justify-between items-center max-w-5xl mx-auto mt-12 pt-8 border-t border-white/10 relative z-50 pb-24 md:pb-8">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={cn(
                                'flex items-center gap-2 px-6 py-3 rounded-full border transition-all',
                                currentStep === 1
                                    ? 'border-white/5 text-muted-foreground cursor-not-allowed opacity-50'
                                    : 'border-white/20 text-foreground hover:bg-white/5'
                            )}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>

                        {currentStep < 5 && (
                            <button
                                onClick={nextStep}
                                disabled={!canProceed()}
                                className={cn(
                                    'flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all',
                                    canProceed()
                                        ? 'bg-gradient-to-r from-brand-secondary to-brand-accent text-white hover:shadow-lg hover:shadow-brand-secondary/25'
                                        : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
                                )}
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}

            </div>
        </motion.div>
    );
}
