
import { CasinoPortfolio } from "@/components/ui/casino-portfolio";
import { Project } from "@/components/ui/poker-card";
import { AnimatePresence, motion } from "framer-motion";

export function ProjectShowcase() {
    // MOCK DATA (Ideally this comes from a prop or context, but keeping local for now)
    const items: Project[] = [
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
            },
            techStack: ["React", "Node.js", "MongoDB", "Stripe"]
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
            },
            techStack: ["Python", "TensorFlow", "Pandas", "Scikit-Learn"]
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
            },
            techStack: ["React Native", "Firebase", "Redux", "TypeScript"]
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
            },
            techStack: ["Python", "NLTK", "FastAPI", "React"]
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
            },
            techStack: ["Next.js", "Framer Motion", "Tailwind CSS", "Vercel"]
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
            },
            techStack: ["Vue.js", "Firebase", "Pinia", "Chart.js"]
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
            },
            techStack: ["PyTorch", "OpenCV", "Docker", "Flask"]
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
            },
            techStack: ["React", "D3.js", "WebSockets", "Node.js"]
        },
        {
            common: "AI Assistant",
            binomial: "n8n Automation",
            description: "Intelligent Telegram bot powered by n8n automation with Google Gemini AI, voice transcription, and RAG-based memory using Pinecone vector store for contextual conversations.",
            features: [
                "Voice-to-Text Transcription",
                "Google Gemini AI Agent",
                "Pinecone RAG Memory",
                "Real-time Telegram Integration",
                "Contextual Conversations"
            ],
            photo: {
                url: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80",
            },
            techStack: ["n8n", "Google Gemini", "Pinecone", "Telegram API"]
        }
    ];

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Full Screen Casino Container */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="casino-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                >
                    <CasinoPortfolio
                        items={items}
                        onActiveProjectChange={(p) => console.log("Active:", p?.common)}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
