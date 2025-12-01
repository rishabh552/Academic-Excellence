"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GradientHeadline } from "./ui/gradient-headline";
import { ProcessCard } from "./ui/process-card";
import { TimelineNode, TimelineLine } from "./ui/animated-timeline";
import { ScrollProgressBar } from "./ui/scroll-progress";
import {
    Send,
    FileText,
    Code2,
    TestTube,
    CheckCircle2,
    Rocket
} from "lucide-react";

interface ProcessStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    details: string[];
    status: "completed" | "active" | "pending";
}

export function ProcessSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const steps: ProcessStep[] = [
        {
            id: 1,
            title: "Submit Your Requirements",
            description: "Share your project topic, detailed requirements, and deadline with our team. We analyze your needs and provide a transparent quote within hours.",
            icon: <Send className="w-6 h-6" />,
            details: [
                "Fill out our simple project request form",
                "Specify your technology stack preferences",
                "Set your deadline and budget expectations",
                "Receive detailed quote and timeline"
            ],
            status: "completed",
        },
        {
            id: 2,
            title: "Project Planning & Design",
            description: "Our experts create a comprehensive project plan, design architecture, and establish clear milestones for your approval.",
            icon: <FileText className="w-6 h-6" />,
            details: [
                "Detailed technical specification document",
                "System architecture and database design",
                "UI/UX wireframes and mockups",
                "Milestone breakdown with deliverables"
            ],
            status: "completed",
        },
        {
            id: 3,
            title: "Expert Development",
            description: "Once approved, our experienced developers start building your project using cutting-edge technologies and industry best practices.",
            icon: <Code2 className="w-6 h-6" />,
            details: [
                "Clean, maintainable, and well-documented code",
                "Regular progress updates and demos",
                "Version control with Git",
                "Adherence to coding standards"
            ],
            status: "active",
        },
        {
            id: 4,
            title: "Quality Assurance & Testing",
            description: "Rigorous testing ensures your project is bug-free, performant, and meets all specified requirements before delivery.",
            icon: <TestTube className="w-6 h-6" />,
            details: [
                "Comprehensive unit and integration testing",
                "Performance optimization",
                "Cross-browser and device compatibility",
                "Security vulnerability assessment"
            ],
            status: "pending",
        },
        {
            id: 5,
            title: "Review & Refinement",
            description: "You review the project, provide feedback, and we make any necessary revisions to ensure it exceeds your expectations.",
            icon: <CheckCircle2 className="w-6 h-6" />,
            details: [
                "Complete project walkthrough session",
                "Unlimited revisions during review period",
                "Documentation and code comments",
                "Training on how to use/maintain the project"
            ],
            status: "pending",
        },
        {
            id: 6,
            title: "Delivery & Support",
            description: "Receive complete source code, comprehensive documentation, deployment assistance, and ongoing support to ensure your success.",
            icon: <Rocket className="w-6 h-6" />,
            details: [
                "Complete source code with all assets",
                "Detailed setup and deployment guide",
                "Video explanation of the codebase",
                "30-day post-delivery support included"
            ],
            status: "pending",
        },
    ];

    return (
        <section id="process" className="relative py-20 md:py-32 bg-transparent overflow-hidden">
            {/* Scroll Progress Indicator */}
            <ScrollProgressBar />

            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Section Header */}
                    <div className="text-center mb-16 md:mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 }}
                            className="mb-4"
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                                Our Process
                            </span>
                        </motion.div>

                        <div className="mb-6">
                            <GradientHeadline
                                text="How It Works"
                                className="text-4xl md:text-5xl lg:text-6xl"
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
                        >
                            From concept to completion, our streamlined 6-step process ensures your project
                            is delivered on time, within budget, and exceeds expectations.
                        </motion.p>
                    </div>

                    {/* Timeline with alternating cards */}
                    <div className="relative">
                        {/* Center timeline line - hidden on mobile, visible on md+ */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -ml-px">
                            <TimelineLine active={true} className="h-full" />
                        </div>

                        {/* Mobile timeline line - visible only on mobile */}
                        <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5">
                            <TimelineLine active={true} className="h-full" />
                        </div>

                        {/* Steps */}
                        <div className="space-y-12 md:space-y-24">
                            {steps.map((step, index) => {
                                const isLeft = index % 2 === 0;

                                return (
                                    <div
                                        key={step.id}
                                        className="relative flex flex-col md:flex-row items-center gap-8"
                                    >
                                        {/* Desktop layout - alternating sides */}
                                        <div className="hidden md:block md:w-1/2">
                                            {isLeft && (
                                                <ProcessCard
                                                    {...step}
                                                    index={index}
                                                    position="left"
                                                    delay={0.1 * index}
                                                />
                                            )}
                                        </div>

                                        {/* Timeline node - centered on desktop, left on mobile */}
                                        <div className="absolute md:relative left-0 md:left-auto flex-shrink-0 z-10">
                                            <TimelineNode
                                                status={step.status}
                                                icon={step.icon}
                                            />
                                        </div>

                                        {/* Desktop layout - alternating sides */}
                                        <div className="hidden md:block md:w-1/2">
                                            {!isLeft && (
                                                <ProcessCard
                                                    {...step}
                                                    index={index}
                                                    position="right"
                                                    delay={0.1 * index}
                                                />
                                            )}
                                        </div>

                                        {/* Mobile layout - all cards on the right side */}
                                        <div className="md:hidden w-full pl-20">
                                            <ProcessCard
                                                {...step}
                                                index={index}
                                                position="right"
                                                delay={0.05 * index}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-20 text-center"
                    >
                        <p className="text-lg text-muted-foreground mb-6">
                            Ready to get started on your project?
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300"
                        >
                            Start Your Project Today
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Enhanced background decorative elements with animated gradients */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10 gradient-animated" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 gradient-animated" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#22D3EE]/5 to-transparent rounded-full blur-3xl -z-20" />
        </section>
    );
}
