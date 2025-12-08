import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NicheParticles } from "@/components/ui/niche-particles";
import { GradientHeadline } from "@/components/ui/gradient-headline";
import { CategoryFilter } from "@/components/ui/category-filter";
import {
    ArrowRight,
    Clock,
    Quote,
    CheckCircle2,
    Code2,
    Brain,
    Smartphone,
    MessageSquare,
    Globe,
    Zap,
    TrendingUp,
    Users,
    BarChart3
} from "lucide-react";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

// Technology icons mapping
const techIcons: Record<string, string> = {
    "React": "⚛️",
    "Node.js": "🟢",
    "Python": "🐍",
    "TensorFlow": "🧠",
    "MongoDB": "🍃",
    "PostgreSQL": "🐘",
    "AWS": "☁️",
    "Docker": "🐳",
    "TypeScript": "📘",
    "Next.js": "▲",
    "Flutter": "💙",
    "Firebase": "🔥",
    "GraphQL": "◈",
    "Redis": "🔴",
};

// Category icons
const categoryIcons: Record<string, React.ElementType> = {
    "Full Stack Web": Code2,
    "Machine Learning": Brain,
    "Mobile Application": Smartphone,
    "NLP": MessageSquare,
    "Frontend": Globe,
    "FinTech": TrendingUp,
    "Productivity": Zap,
    "Deep Learning": Brain,
};

// Case Studies Data
interface CaseStudy {
    id: string;
    title: string;
    category: string;
    challenge: string;
    solution: string;
    approach: string[];
    results: { metric: string; value: string }[];
    techStack: string[];
    timeline: string;
    clientQuote?: { text: string; author: string; role: string };
    image: string;
}

const caseStudies: CaseStudy[] = [
    {
        id: "ecommerce-platform",
        title: "E-Commerce Platform",
        category: "Full Stack Web",
        challenge: "A rapidly growing retail client was struggling with their legacy e-commerce system that couldn't handle peak traffic during sales events. They needed a modern solution capable of processing 10,000+ daily transactions with real-time inventory synchronization across 5 warehouse locations. The existing system had frequent downtime, slow page loads averaging 5+ seconds, and a cart abandonment rate of 68% due to poor user experience.",
        solution: "We architected and delivered a comprehensive MERN stack e-commerce platform built on microservices architecture. The system features real-time WebSocket connections for instant inventory updates, Stripe integration for secure payments, and a Redis-powered caching layer that reduced database load by 80%. The admin dashboard provides real-time analytics, inventory management, and automated reorder alerts.",
        approach: [
            "Conducted thorough discovery sessions to map existing workflows and pain points",
            "Designed microservices architecture with separate services for orders, inventory, users, and payments",
            "Implemented real-time inventory sync using WebSockets and Redis pub/sub",
            "Built responsive React frontend with optimistic UI updates for instant feedback",
            "Integrated Stripe payment gateway with 3D Secure authentication",
            "Created comprehensive admin dashboard with sales analytics and reporting",
            "Set up CI/CD pipeline with automated testing and Docker containerization",
            "Deployed on AWS with auto-scaling groups and CloudFront CDN"
        ],
        results: [
            { metric: "Transaction Capacity", value: "15K+/day" },
            { metric: "Page Load Time", value: "< 1.5s" },
            { metric: "Uptime", value: "99.9%" },
            { metric: "Conversion Rate", value: "+28%" },
            { metric: "Cart Abandonment", value: "-45%" },
            { metric: "Revenue Growth", value: "+40%" }
        ],
        techStack: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Redis"],
        timeline: "3 months",
        clientQuote: {
            text: "The platform exceeded our expectations. Not only did sales increase by 40% within the first quarter, but our customer support tickets dropped by 60% because the system just works flawlessly.",
            author: "Sarah Chen",
            role: "CEO, RetailHub"
        },
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80"
    },
    {
        id: "disease-prediction",
        title: "AI Disease Prediction System",
        category: "Machine Learning",
        challenge: "A major healthcare provider was losing patients to late-stage diagnoses of preventable conditions. Their existing screening process was manual, inconsistent, and missed 40% of at-risk patients. They needed an intelligent system that could analyze patient data from multiple sources—lab results, medical history, lifestyle factors—and predict potential health risks before symptoms manifest, while maintaining strict HIPAA compliance.",
        solution: "We developed a sophisticated ensemble machine learning model combining Random Forest, XGBoost, and Neural Networks that analyzes over 150 patient attributes to predict disease risk with 98.2% accuracy. The system integrates seamlessly with existing EHR systems, provides interpretable predictions with confidence scores, and includes an intuitive dashboard for healthcare providers to track patient risk profiles over time.",
        approach: [
            "Partnered with medical experts to identify key predictive factors and validate model outputs",
            "Collected and preprocessed 500K+ anonymized patient records with rigorous data cleaning",
            "Engineered 80+ features from raw medical data including temporal patterns and risk indicators",
            "Trained and validated ensemble model using 5-fold cross-validation with stratified sampling",
            "Implemented SHAP (SHapley Additive exPlanations) for model interpretability",
            "Built secure, HIPAA-compliant data pipeline with encryption at rest and in transit",
            "Created intuitive prediction dashboard with patient risk scoring and trend visualization",
            "Developed automated alert system for high-risk patients requiring immediate attention"
        ],
        results: [
            { metric: "Prediction Accuracy", value: "98.2%" },
            { metric: "Early Detection Rate", value: "+65%" },
            { metric: "False Positive Rate", value: "< 2%" },
            { metric: "Processing Time", value: "< 100ms" },
            { metric: "Patients Screened", value: "50K+/month" },
            { metric: "Lives Impacted", value: "2,000+" }
        ],
        techStack: ["Python", "TensorFlow", "PostgreSQL", "Docker", "AWS"],
        timeline: "4 months",
        clientQuote: {
            text: "This system has revolutionized our preventive care program. We're catching conditions months earlier, and the interpretable predictions help our doctors have more informed conversations with patients about their health risks.",
            author: "Dr. Michael Roberts",
            role: "Chief Medical Officer, HealthFirst Network"
        },
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
    },
    {
        id: "fitness-tracker",
        title: "Fitness Tracker Pro",
        category: "Mobile Application",
        challenge: "A fitness startup had a vision for an app that would work seamlessly for outdoor enthusiasts—hikers, trail runners, and gym-goers who often exercise in areas with poor cellular connectivity. Their previous app lost user data when offline, had battery-draining sync issues, and couldn't integrate with popular health platforms. They needed a cross-platform solution that would work flawlessly offline while providing a premium, animated user experience.",
        solution: "We built a React Native application with a sophisticated offline-first architecture using local SQLite storage with intelligent background sync. The app features custom Lottie animations for workout tracking, heart rate-based zone training, and seamless integration with Apple Health, Google Fit, and Strava. A proprietary conflict resolution algorithm ensures data integrity when syncing across multiple devices.",
        approach: [
            "Designed offline-first data architecture with SQLite and async storage",
            "Implemented intelligent background sync with conflict resolution for multi-device users",
            "Built custom workout animation system using Lottie for smooth 60fps animations",
            "Created heart rate zone training with real-time BLE device integration",
            "Integrated with Apple Health, Google Fit, and Strava APIs for comprehensive data sync",
            "Developed social features including workout sharing, challenges, and leaderboards",
            "Implemented push notifications for workout reminders and achievement celebrations",
            "Optimized battery consumption to less than 5% per hour during active tracking"
        ],
        results: [
            { metric: "App Store Rating", value: "4.8 ★" },
            { metric: "Daily Active Users", value: "50K+" },
            { metric: "Offline Reliability", value: "100%" },
            { metric: "User Retention", value: "78%" },
            { metric: "Workouts Logged", value: "2M+" },
            { metric: "Battery Usage", value: "< 5%/hr" }
        ],
        techStack: ["React", "TypeScript", "Firebase", "Node.js"],
        timeline: "2.5 months",
        clientQuote: {
            text: "Our users are obsessed with the app! The offline reliability is a game-changer for trail runners, and we've seen workout completion rates increase by 40% since launch.",
            author: "Jake Morrison",
            role: "Founder & CEO, FitTrack Labs"
        },
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80"
    },
    {
        id: "sentiment-analyzer",
        title: "Real-time Sentiment Analyzer",
        category: "NLP",
        challenge: "A global marketing agency managing Fortune 500 brand accounts was flying blind during PR crises. Their existing social listening tools had 4-6 hour delays, only worked in English, and couldn't distinguish between sarcasm and genuine sentiment. They needed a real-time system that could process thousands of social media posts per minute across 12 languages and alert their crisis response team within seconds of a viral negative trend.",
        solution: "We developed a streaming NLP pipeline powered by fine-tuned BERT transformers that processes 10,000+ social media posts per minute with 94% accuracy. The system features custom sarcasm detection, emotion classification beyond just positive/negative, and an intelligent alerting system that considers velocity, reach, and influencer amplification to prioritize genuine threats.",
        approach: [
            "Fine-tuned multilingual BERT model on 2M+ labeled social media posts including sarcasm",
            "Built Apache Kafka streaming pipeline for real-time data ingestion from Twitter, Reddit, and news",
            "Implemented custom sarcasm detection layer using contrastive learning techniques",
            "Created emotion classification system detecting 8 distinct emotions beyond sentiment",
            "Developed intelligent alerting with threat scoring based on velocity, reach, and influencer involvement",
            "Built interactive analytics dashboard with real-time charts and trend visualization",
            "Added influencer identification and network analysis for crisis source tracking",
            "Implemented automated report generation with actionable insights and response recommendations"
        ],
        results: [
            { metric: "Processing Speed", value: "10K/min" },
            { metric: "Accuracy", value: "94%" },
            { metric: "Languages", value: "12" },
            { metric: "Alert Latency", value: "< 30s" },
            { metric: "Crises Prevented", value: "15+" },
            { metric: "Response Time", value: "-85%" }
        ],
        techStack: ["Python", "TensorFlow", "AWS", "Redis", "Docker"],
        timeline: "3 months",
        clientQuote: {
            text: "We can now respond to trending topics within minutes instead of hours. Last month, we caught a potential PR disaster for a client before it went viral and turned it into a positive brand moment. This tool pays for itself every single week.",
            author: "Emma Davis",
            role: "Head of Digital Strategy, MediaPulse Agency"
        },
        image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80"
    },
    {
        id: "crypto-dashboard",
        title: "Crypto Trading Dashboard",
        category: "FinTech",
        challenge: "A FinTech startup targeting professional crypto traders found that existing dashboards were either too basic for power users or required expensive enterprise licenses. Traders needed a unified view across multiple exchanges, real-time portfolio tracking with tax lot accounting, and predictive analytics—all with sub-100ms latency to capitalize on arbitrage opportunities.",
        solution: "We built a high-performance trading dashboard using Next.js with WebSocket connections to 5 major exchanges. The platform features custom TradingView charting, ML-powered price prediction alerts, automated portfolio rebalancing suggestions, and a comprehensive tax reporting module. The architecture achieves < 50ms data latency through edge caching and optimized WebSocket aggregation.",
        approach: [
            "Integrated with Binance, Coinbase, Kraken, FTX, and Huobi APIs with unified data models",
            "Built custom WebSocket aggregation layer for sub-50ms price updates across all exchanges",
            "Implemented TradingView charting with custom indicators and drawing tools",
            "Developed LSTM-based ML model for price trend prediction with 72% accuracy on 1-hour windows",
            "Created portfolio analytics engine with tax lot tracking and cost basis calculations",
            "Built automated alert system for arbitrage opportunities and significant price movements",
            "Designed mobile-responsive interface with dark mode and customizable layouts",
            "Implemented secure API key vault with hardware security module integration"
        ],
        results: [
            { metric: "Data Latency", value: "< 50ms" },
            { metric: "Exchanges", value: "5" },
            { metric: "Active Traders", value: "12K+" },
            { metric: "Prediction Accuracy", value: "72%" },
            { metric: "Daily Volume Tracked", value: "$50M+" },
            { metric: "Uptime", value: "99.99%" }
        ],
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS"],
        timeline: "4 months",
        clientQuote: {
            text: "Finally, a dashboard that keeps up with the crypto markets. The arbitrage alerts alone have generated 15% additional returns for our most active users. This is exactly what professional traders need.",
            author: "Alex Thompson",
            role: "Co-founder, CryptoTrader Pro"
        },
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80"
    }
];

// Category badge colors
const categoryColors: Record<string, string> = {
    "Full Stack Web": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Machine Learning": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Mobile Application": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "NLP": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "Frontend": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "FinTech": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    "Productivity": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Deep Learning": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export function CaseStudies() {
    const [searchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get("category");
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All");
    const [expandedStudy, setExpandedStudy] = useState<string | null>(null);

    // Update selected category when URL changes
    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [categoryFromUrl]);

    const categories = useMemo(() =>
        ["All", ...Array.from(new Set(caseStudies.map(cs => cs.category)))],
        []
    );

    const projectCounts = useMemo(() => {
        const counts: Record<string, number> = { "All": caseStudies.length };
        caseStudies.forEach(cs => {
            counts[cs.category] = (counts[cs.category] || 0) + 1;
        });
        return counts;
    }, []);

    const filteredStudies = useMemo(() => {
        if (selectedCategory === "All") return caseStudies;
        return caseStudies.filter(cs => cs.category === selectedCategory);
    }, [selectedCategory]);

    const CategoryIcon = ({ category }: { category: string }) => {
        const Icon = categoryIcons[category] || Globe;
        return <Icon className="w-4 h-4" />;
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
            {/* Background */}
            <NicheParticles
                className="absolute inset-0 -z-10"
                quantity={80}
                ease={80}
                color="#8b5cf6"
                refresh
            />

            {/* Hero Section */}
            <div className="text-center mb-12 mt-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-sm font-medium mb-6"
                >
                    <Users className="w-4 h-4" />
                    Success Stories
                </motion.div>

                <GradientHeadline
                    text="Case Studies"
                    className="text-4xl md:text-6xl mb-4"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto font-light mb-8"
                >
                    Discover how we've helped clients solve complex challenges with innovative solutions.
                </motion.p>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex justify-center gap-8 md:gap-16 mb-8"
                >
                    {[
                        { value: "50+", label: "Projects Delivered" },
                        { value: "98%", label: "Client Satisfaction" },
                        { value: "12", label: "Industries Served" }
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-brand-secondary">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Category Filter */}
            <CategoryFilter
                categories={categories}
                activeCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                projectCounts={projectCounts}
            />

            {/* Case Studies Grid */}
            <div className="container mx-auto px-4 pb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-1"
                    >
                        {filteredStudies.map((study, index) => (
                            <motion.div
                                key={study.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div
                                    className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 ${expandedStudy === study.id
                                        ? "ring-2 ring-brand-secondary/50"
                                        : "hover:border-white/20 hover:bg-white/10"
                                        }`}
                                >
                                    {/* Card Header - Always visible */}
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => setExpandedStudy(expandedStudy === study.id ? null : study.id)}
                                    >
                                        <div className="flex flex-col lg:flex-row">
                                            {/* Image */}
                                            <div className="lg:w-1/3 h-48 lg:h-auto overflow-hidden">
                                                <img
                                                    src={study.image}
                                                    alt={study.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>

                                            {/* Content Preview */}
                                            <div className="lg:w-2/3 p-6">
                                                <div className="flex items-start justify-between gap-4 mb-4">
                                                    <div>
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-3 ${categoryColors[study.category]}`}>
                                                            <CategoryIcon category={study.category} />
                                                            {study.category}
                                                        </div>
                                                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                                                            {study.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="w-4 h-4" />
                                                        {study.timeline}
                                                    </div>
                                                </div>

                                                <p className="text-muted-foreground mb-4 line-clamp-2">
                                                    {study.challenge}
                                                </p>

                                                {/* Tech Stack Preview */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {study.techStack.slice(0, 4).map(tech => (
                                                        <span
                                                            key={tech}
                                                            className="px-2 py-1 rounded-md bg-white/5 text-xs text-muted-foreground border border-white/10"
                                                        >
                                                            {techIcons[tech] || "•"} {tech}
                                                        </span>
                                                    ))}
                                                    {study.techStack.length > 4 && (
                                                        <span className="px-2 py-1 text-xs text-muted-foreground">
                                                            +{study.techStack.length - 4} more
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Results Preview */}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                        <BarChart3 className="w-3 h-3" />
                                                        Key Results
                                                    </div>
                                                    <div className="flex flex-wrap gap-4">
                                                        {study.results.slice(0, 3).map(result => (
                                                            <div key={result.metric} className="text-center">
                                                                <div className="text-lg font-bold text-brand-secondary">
                                                                    {result.value}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {result.metric}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Expand Button */}
                                                <div className="mt-4 flex items-center gap-2 text-sm text-brand-secondary font-medium">
                                                    {expandedStudy === study.id ? "Show Less" : "Read Full Case Study"}
                                                    <ArrowRight className={`w-4 h-4 transition-transform ${expandedStudy === study.id ? "rotate-90" : ""}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {expandedStudy === study.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden border-t border-white/10"
                                            >
                                                <div className="p-6 space-y-6">
                                                    {/* The Challenge */}
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                                            <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                                                                !
                                                            </span>
                                                            The Challenge
                                                        </h4>
                                                        <p className="text-muted-foreground pl-10">
                                                            {study.challenge}
                                                        </p>
                                                    </div>

                                                    {/* Our Approach */}
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                                            <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                                →
                                                            </span>
                                                            Our Approach
                                                        </h4>
                                                        <ul className="space-y-2 pl-10">
                                                            {study.approach.map((step, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                                                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                                                    {step}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* The Solution */}
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                                                            <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                                                ✓
                                                            </span>
                                                            The Solution
                                                        </h4>
                                                        <p className="text-muted-foreground pl-10">
                                                            {study.solution}
                                                        </p>
                                                    </div>

                                                    {/* Results Grid */}
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                                            <span className="w-8 h-8 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary">
                                                                <BarChart3 className="w-4 h-4" />
                                                            </span>
                                                            Results
                                                        </h4>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-10">
                                                            {study.results.map(result => (
                                                                <div
                                                                    key={result.metric}
                                                                    className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
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
                                                    {study.clientQuote && (
                                                        <div className="relative p-6 rounded-xl bg-gradient-to-br from-brand-secondary/10 to-brand-accent/10 border border-brand-secondary/20">
                                                            <Quote className="absolute top-4 left-4 w-8 h-8 text-brand-secondary/30" />
                                                            <p className="text-lg italic text-foreground mb-4 pl-10">
                                                                "{study.clientQuote.text}"
                                                            </p>
                                                            <div className="pl-10">
                                                                <div className="font-semibold text-foreground">
                                                                    {study.clientQuote.author}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {study.clientQuote.role}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* CTA */}
                                                    <div className="flex justify-center pt-4">
                                                        <Link
                                                            to={`/start-project?type=${study.category.toLowerCase().replace(/\\s+/g, '-')}&project=${study.id}`}
                                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent hover:from-brand-secondary/80 hover:to-brand-accent/80 text-white font-semibold transition-all shadow-lg hover:shadow-brand-secondary/25"
                                                        >
                                                            Start Similar Project
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center py-16 px-4 border-t border-white/10"
            >
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Ready to Build Something Amazing?
                </h3>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                    Let's discuss your project and create something that stands out.
                </p>
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-secondary to-brand-accent hover:from-brand-secondary/80 hover:to-brand-accent/80 text-white font-semibold text-lg transition-all shadow-lg hover:shadow-brand-secondary/25"
                >
                    Start Your Project
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </motion.div>
        </motion.div>
    );
}
