import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BeamsBackground } from '@/components/ui/beams-background';
import { GradientHeadline } from '@/components/ui/gradient-headline';
import { cn } from '@/lib/utils';
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
    Sparkles,
    Zap,
    Crown,
    Send,
    CheckCircle2,
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
];

// Pricing packages
const packages = [
    {
        id: 'basic',
        name: 'Basic',
        price: 499,
        description: 'Perfect for small projects and MVPs',
        icon: Sparkles,
        color: 'from-emerald-500 to-emerald-600',
        features: [
            'Single page application',
            'Responsive design',
            'Basic backend API',
            '2 weeks development',
            '1 month support',
        ],
    },
    {
        id: 'professional',
        name: 'Professional',
        price: 1499,
        description: 'Best for growing businesses',
        icon: Zap,
        color: 'from-violet-500 to-violet-600',
        popular: true,
        features: [
            'Multi-page application',
            'Advanced UI/UX design',
            'Full backend with auth',
            'Database integration',
            '4 weeks development',
            '3 months support',
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 4999,
        description: 'Complete solution for large projects',
        icon: Crown,
        color: 'from-amber-500 to-amber-600',
        features: [
            'Full-scale application',
            'Custom architecture',
            'ML/AI integration',
            'Cloud deployment',
            '8+ weeks development',
            '6 months support',
            'Dedicated team',
        ],
    },
];

// Step Progress Bar Component
function StepProgressBar({ currentStep, completedSteps }: { currentStep: number; completedSteps: number[] }) {
    const steps = [
        { num: 1, label: 'Project Type' },
        { num: 2, label: 'Details' },
        { num: 3, label: 'Package' },
        { num: 4, label: 'Contact' },
    ];

    return (
        <div className="w-full max-w-3xl mx-auto mb-12">
            <div className="flex justify-between items-center relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10">
                    <motion.div
                        className="h-full bg-gradient-to-r from-brand-secondary to-brand-accent"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
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

// Step 3: Choose Package
function Step3Package({
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
                                'relative p-6 rounded-2xl border text-left transition-all',
                                isSelected
                                    ? 'border-brand-secondary bg-brand-secondary/10 ring-2 ring-brand-secondary/50'
                                    : 'border-white/10 bg-white/5 hover:border-white/20',
                                pkg.popular && !isSelected && 'border-brand-secondary/50'
                            )}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-brand-secondary to-brand-accent rounded-full text-xs font-bold text-white">
                                    Most Popular
                                </div>
                            )}

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
                                    pkg.color
                                )}
                            >
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-bold text-brand-secondary">${pkg.price}</span>
                                <span className="text-muted-foreground text-sm">starting</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>

                            <ul className="space-y-2">
                                {pkg.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                                        {feature}
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

// Step 4: Contact Form
function Step4Contact({
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

    // Step 1 Data
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Step 2 Data
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [projectTitle, setProjectTitle] = useState<string | null>(null);

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

    // Check URL params for pre-selection
    useEffect(() => {
        const type = searchParams.get('type');
        const project = searchParams.get('project');
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
    }, [searchParams]);

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return selectedType !== null;
            case 2:
                return selectedProject !== null;
            case 3:
                return selectedPackage !== null;
            case 4:
                return formData.name && formData.email && formData.message;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (canProceed() && currentStep < 4) {
            setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setCompletedSteps((prev) => [...prev, 4]);
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
                            <Step3Package
                                key="step3"
                                selectedPackage={selectedPackage}
                                onSelect={(pkg) => setSelectedPackage(pkg)}
                            />
                        )}
                        {currentStep === 4 && (
                            <Step4Contact
                                key="step4"
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

                        {currentStep < 4 && (
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

                {/* Summary Sidebar (visible on step 2+) */}
                {currentStep >= 2 && !isSubmitted && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden md:block fixed top-1/2 -translate-y-1/2 right-6 w-64 p-4 rounded-2xl bg-surface-elevated/95 backdrop-blur-lg border border-white/10 shadow-xl z-30"
                    >
                        <h4 className="text-sm font-semibold text-foreground mb-3">Your Selection</h4>
                        <div className="space-y-2 text-sm">
                            {selectedType && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Project Type:</span>
                                    <span className="text-foreground font-medium">
                                        {projectTypes.find((t) => t.id === selectedType)?.title}
                                    </span>
                                </div>
                            )}
                            {projectTitle && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Reference:</span>
                                    <span className="text-foreground font-medium">{projectTitle}</span>
                                </div>
                            )}
                            {selectedPackage && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Package:</span>
                                    <span className="text-brand-secondary font-medium">
                                        {packages.find((p) => p.id === selectedPackage)?.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
