"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "./ui/project-card";
import { GradientHeadline } from "./ui/gradient-headline";

export function ProjectGrid() {
    const projects = [
        {
            title: "E-Commerce Platform",
            description: "A complete MERN stack e-commerce solution with Stripe payment integration, admin dashboard, and real-time inventory management.",
            category: "Full Stack Web",
            image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
            features: [
                "Secure Payment Gateway",
                "Admin Dashboard",
                "Inventory Tracking",
                "User Authentication",
                "Responsive Design"
            ],
            demoLink: "#"
        },
        {
            title: "Disease Prediction Model",
            description: "Advanced ML model achieving 98% accuracy in early disease detection using patient data. Includes comprehensive data visualization.",
            category: "Machine Learning",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
            features: [
                "98% Accuracy",
                "Data Visualization",
                "Real-time Prediction",
                "Exportable Reports",
                "HIPAA Compliant"
            ],
            demoLink: "#"
        },
        {
            title: "Smart Home Automation",
            description: "Mobile application controlling IoT devices via MQTT protocol. Features voice control and automated scheduling.",
            category: "IoT & Mobile",
            image: "https://images.unsplash.com/photo-1558002038-109177381792?w=800&q=80",
            features: [
                "Voice Control",
                "Automated Scheduling",
                "Device Grouping",
                "Energy Monitoring",
                "Remote Access"
            ],
            demoLink: "#"
        },
        {
            title: "Sentiment Analysis Tool",
            description: "Real-time social media sentiment analysis tool processing thousands of tweets per second to gauge public opinion.",
            category: "NLP",
            image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80",
            features: [
                "Real-time Processing",
                "Multi-language Support",
                "Trend Analysis",
                "API Integration",
                "Visual Dashboards"
            ],
            demoLink: "#"
        },
        {
            title: "Portfolio Website",
            description: "A modern, responsive portfolio website built with Next.js and Framer Motion, featuring 3D animations and dark mode.",
            category: "Frontend",
            image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
            features: [
                "3D Animations",
                "Dark Mode Support",
                "SEO Optimized",
                "Fast Performance",
                "CMS Integration"
            ],
            demoLink: "#"
        },
        {
            title: "Task Management App",
            description: "Collaborative task management tool with real-time updates, drag-and-drop interface, and team analytics.",
            category: "Productivity",
            image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
            features: [
                "Real-time Sync",
                "Drag & Drop",
                "Team Analytics",
                "File Sharing",
                "Calendar View"
            ],
            demoLink: "#"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-6 bg-gray-50 dark:bg-black/20 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <GradientHeadline
                        text="Featured Projects"
                        className="text-4xl md:text-6xl mb-6"
                    />
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
                        Explore our portfolio of academic and professional projects, showcasing innovation across multiple domains.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <ProjectCard {...project} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
