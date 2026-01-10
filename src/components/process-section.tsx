"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Send,
    FileText,
    Code2,
    TestTube,
    CheckCircle2,
    Rocket,
    Check,
    ArrowRight,
    Sparkles
} from "lucide-react";
import "./process-storytelling.css";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    details: string[];
    status: "completed" | "active" | "pending";
    color: string;
}

const steps: ProcessStep[] = [
    {
        id: 1,
        title: "Submit Your Requirements",
        description: "Share your project vision with us. We analyze every detail and provide a transparent quote within hours.",
        icon: <Send />,
        details: [
            "Simple project request form",
            "Technology stack preferences",
            "Deadline & budget clarity",
            "Detailed quote & timeline"
        ],
        status: "completed",
        color: "#1e3a8a", // Dark Blue
    },
    {
        id: 2,
        title: "Project Planning & Design",
        description: "Our architects craft a comprehensive blueprint—from system design to pixel-perfect mockups.",
        icon: <FileText />,
        details: [
            "Technical specifications",
            "Database architecture",
            "UI/UX wireframes",
            "Milestone breakdown"
        ],
        status: "completed",
        color: "#8b5cf6", // Violet
    },
    {
        id: 3,
        title: "Expert Development",
        description: "Watch your project come alive as our developers build with cutting-edge technologies and best practices.",
        icon: <Code2 />,
        details: [
            "Clean, documented code",
            "Regular progress demos",
            "Git version control",
            "Industry standards"
        ],
        status: "active",
        color: "#06b6d4", // Cyan
    },
    {
        id: 4,
        title: "Quality Assurance",
        description: "Rigorous testing ensures your project is bulletproof—performant, secure, and bug-free.",
        icon: <TestTube />,
        details: [
            "Unit & integration tests",
            "Performance optimization",
            "Cross-platform testing",
            "Security assessment"
        ],
        status: "pending",
        color: "#22c55e", // Emerald
    },
    {
        id: 5,
        title: "Review & Refinement",
        description: "Your feedback shapes the final product. Unlimited revisions until you're completely satisfied.",
        icon: <CheckCircle2 />,
        details: [
            "Project walkthrough",
            "Unlimited revisions",
            "Documentation review",
            "Training session"
        ],
        status: "pending",
        color: "#f59e0b", // Amber
    },
    {
        id: 6,
        title: "Delivery & Support",
        description: "Receive everything—source code, documentation, deployment help, and ongoing support.",
        icon: <Rocket />,
        details: [
            "Complete source code",
            "Deployment guide",
            "Video explanation",
            "30-day support"
        ],
        status: "pending",
        color: "#f43f5e", // Rose
    },
];

export function ProcessSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const journeyRef = useRef<HTMLDivElement>(null);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const ctaRef = useRef<HTMLDivElement>(null);
    const centralVisualRef = useRef<HTMLDivElement>(null);
    const progressRingRef = useRef<SVGCircleElement>(null);
    const mobileProgressRef = useRef<HTMLDivElement>(null);
    const engineIconRef = useRef<HTMLDivElement>(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [currentIcon, setCurrentIcon] = useState<React.ReactNode>(steps[0].icon);
    const [currentColor, setCurrentColor] = useState(steps[0].color);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // ===== HERO ANIMATION =====
            // Set initial visible state
            gsap.set(".flow-hero-badge, .flow-hero-title, .flow-hero-subtitle, .flow-scroll-indicator", {
                opacity: 1,
                y: 0
            });

            // Initial entrance animation (runs once on load)
            gsap.from(".flow-hero-badge", {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.2
            });
            gsap.from(".flow-hero-title", {
                opacity: 0,
                y: 40,
                duration: 1,
                delay: 0.4
            });
            gsap.from(".flow-hero-subtitle", {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.6
            });
            gsap.from(".flow-scroll-indicator", {
                opacity: 0,
                duration: 0.6,
                delay: 1
            });

            // Hero fade out/in based on scroll position
            ScrollTrigger.create({
                trigger: heroRef.current,
                start: "top top",
                end: "bottom 20%",
                onLeave: () => {
                    gsap.to(".flow-hero-badge, .flow-hero-title, .flow-hero-subtitle, .flow-scroll-indicator", {
                        opacity: 0,
                        y: -30,
                        duration: 0.4,
                        stagger: 0.05
                    });
                },
                onEnterBack: () => {
                    gsap.to(".flow-hero-badge, .flow-hero-title, .flow-hero-subtitle, .flow-scroll-indicator", {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.05
                    });
                }
            });

            // ===== CENTRAL VISUAL VISIBILITY =====
            ScrollTrigger.create({
                trigger: journeyRef.current,
                start: "top 80%",
                end: "bottom 20%",
                onEnter: () => {
                    centralVisualRef.current?.classList.add("visible");
                },
                onLeave: () => {
                    centralVisualRef.current?.classList.remove("visible");
                },
                onEnterBack: () => {
                    centralVisualRef.current?.classList.add("visible");
                },
                onLeaveBack: () => {
                    centralVisualRef.current?.classList.remove("visible");
                }
            });

            // ===== MAIN JOURNEY SCROLL PROGRESS =====
            ScrollTrigger.create({
                trigger: journeyRef.current,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    const progress = self.progress;

                    // Update circular progress ring (SVG strokeDashoffset)
                    // Circle circumference = 2 * PI * r = 2 * 3.14159 * 160 = 1005.3
                    if (progressRingRef.current) {
                        const circumference = 1005.3;
                        const offset = circumference * (1 - progress);
                        progressRingRef.current.style.strokeDashoffset = String(offset);
                    }

                    // Update mobile progress
                    if (mobileProgressRef.current) {
                        mobileProgressRef.current.style.width = `${progress * 100}%`;
                    }

                    // Calculate current step (1-6)
                    const stepIndex = Math.min(5, Math.floor(progress * 6));
                    if (stepIndex !== currentStep) {
                        setCurrentStep(stepIndex);
                        setCurrentIcon(steps[stepIndex].icon);
                        setCurrentColor(steps[stepIndex].color);

                        // Update progress ring color
                        if (progressRingRef.current) {
                            progressRingRef.current.style.stroke = steps[stepIndex].color;
                        }

                        // Update mobile progress color
                        if (mobileProgressRef.current) {
                            mobileProgressRef.current.style.background = `linear-gradient(90deg, ${steps[stepIndex].color}, ${steps[Math.min(5, stepIndex + 1)].color})`;
                        }

                        // Animate engine icon change
                        if (engineIconRef.current) {
                            gsap.to(engineIconRef.current, {
                                scale: 0.8,
                                opacity: 0,
                                duration: 0.15,
                                onComplete: () => {
                                    gsap.to(engineIconRef.current, {
                                        scale: 1,
                                        opacity: 1,
                                        duration: 0.3,
                                        ease: "back.out(2)"
                                    });
                                }
                            });
                        }

                        // Update timeline dots
                        document.querySelectorAll(".timeline-dot").forEach((dot, i) => {
                            dot.classList.remove("active", "completed");
                            if (i < stepIndex) {
                                dot.classList.add("completed");
                            } else if (i === stepIndex) {
                                dot.classList.add("active");
                            }
                        });
                    }
                }
            });

            // ===== STEP PANELS - PROPER ENTRANCE/EXIT WITH REVERSE =====
            stepRefs.current.forEach((stepEl) => {
                if (!stepEl) return;

                const panel = stepEl.querySelector(".flow-step-panel");
                const features = stepEl.querySelectorAll(".step-feature");

                // Set initial states
                gsap.set(panel, { opacity: 0, y: 60 });
                gsap.set(features, { opacity: 0, x: -20 });

                // Panel entrance - appears when step enters viewport
                ScrollTrigger.create({
                    trigger: stepEl,
                    start: "top 75%",
                    end: "bottom 25%",
                    onEnter: () => {
                        gsap.to(panel, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out"
                        });
                        gsap.to(features, {
                            opacity: 1,
                            x: 0,
                            stagger: 0.1,
                            duration: 0.5,
                            delay: 0.3,
                            ease: "power2.out"
                        });
                    },
                    onLeave: () => {
                        gsap.to(panel, {
                            opacity: 0,
                            y: -40,
                            duration: 0.6,
                            ease: "power2.in"
                        });
                    },
                    onEnterBack: () => {
                        gsap.to(panel, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out"
                        });
                        gsap.to(features, {
                            opacity: 1,
                            x: 0,
                            stagger: 0.05,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    },
                    onLeaveBack: () => {
                        gsap.to(panel, {
                            opacity: 0,
                            y: 60,
                            duration: 0.5,
                            ease: "power2.in"
                        });
                        gsap.to(features, {
                            opacity: 0,
                            x: -20,
                            duration: 0.3
                        });
                    }
                });
            });

            // ===== CENTRAL ENGINE ROTATION - 2 FULL ROTATIONS =====
            gsap.to(".central-engine", {
                scrollTrigger: {
                    trigger: journeyRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1
                },
                rotation: 720,
                ease: "none"
            });

            // Engine rings scale with scroll
            gsap.to(".engine-ring-1", {
                scrollTrigger: {
                    trigger: journeyRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1
                },
                scale: 1.4,
                opacity: 0.6,
                rotation: 360
            });

            gsap.to(".engine-ring-2", {
                scrollTrigger: {
                    trigger: journeyRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5
                },
                scale: 1.3,
                opacity: 0.5,
                rotation: -360
            });

            gsap.to(".engine-ring-3", {
                scrollTrigger: {
                    trigger: journeyRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 2
                },
                scale: 1.2,
                rotation: 180
            });

            // ===== HIDE CENTRAL ENGINE AT CTA =====
            ScrollTrigger.create({
                trigger: ctaRef.current,
                start: "top 60%",
                end: "top 30%",
                onEnter: () => {
                    gsap.to(centralVisualRef.current, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                },
                onLeaveBack: () => {
                    gsap.to(centralVisualRef.current, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });

            // ===== CTA SECTION - Ensure button is visible =====
            // Set initial states explicitly
            gsap.set(".cta-title", { opacity: 0, y: 40 });
            gsap.set(".cta-subtitle", { opacity: 0, y: 30 });
            gsap.set(".cta-button", { opacity: 0, scale: 0.9 });

            ScrollTrigger.create({
                trigger: ctaRef.current,
                start: "top 80%",
                onEnter: () => {
                    gsap.to(".cta-title", {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                    gsap.to(".cta-subtitle", {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: 0.2,
                        ease: "power2.out"
                    });
                    gsap.to(".cta-button", {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        delay: 0.4,
                        ease: "back.out(2)"
                    });
                },
                onLeaveBack: () => {
                    gsap.to(".cta-title", { opacity: 0, y: 40, duration: 0.4 });
                    gsap.to(".cta-subtitle", { opacity: 0, y: 30, duration: 0.3 });
                    gsap.to(".cta-button", { opacity: 0, scale: 0.9, duration: 0.3 });
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, [currentStep]);

    return (
        <div className="process-flow" ref={containerRef}>
            {/* FIXED CENTRAL VISUAL (Engine) with Progress Ring */}
            <div className="flow-central-visual" ref={centralVisualRef}>
                {/* SVG Progress Ring */}
                <svg className="progress-ring" viewBox="0 0 340 340">
                    {/* Background ring */}
                    <circle
                        className="progress-ring-bg"
                        cx="170"
                        cy="170"
                        r="160"
                        fill="none"
                        strokeWidth="4"
                    />
                    {/* Progress ring */}
                    <circle
                        ref={progressRingRef}
                        className="progress-ring-fill"
                        cx="170"
                        cy="170"
                        r="160"
                        fill="none"
                        strokeWidth="4"
                        strokeDasharray="1005.3"
                        strokeDashoffset="1005.3"
                        transform="rotate(-90 170 170)"
                    />
                    {/* Step indicator dots around the ring */}
                    {steps.map((_, i) => {
                        const angle = (i / 6) * 360 - 90; // Start from top
                        const rad = (angle * Math.PI) / 180;
                        const x = 170 + 160 * Math.cos(rad);
                        const y = 170 + 160 * Math.sin(rad);
                        return (
                            <circle
                                key={i}
                                className={`progress-dot ${i < currentStep ? 'completed' : ''} ${i === currentStep ? 'active' : ''}`}
                                cx={x}
                                cy={y}
                                r="6"
                            />
                        );
                    })}
                </svg>

                <div className="central-engine">
                    <div className="engine-ring engine-ring-1" />
                    <div className="engine-ring engine-ring-2" />
                    <div className="engine-ring engine-ring-3" />
                    <div className="engine-core" style={{ background: `radial-gradient(circle, ${currentColor} 0%, ${currentColor}80 100%)` }} />
                    <div
                        className="engine-center"
                        style={{
                            background: currentColor,
                            boxShadow: `0 0 60px ${currentColor}80`
                        }}
                    >
                        <div ref={engineIconRef} className="engine-icon">
                            {currentIcon}
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE PROGRESS BAR */}
            <div className="mobile-progress">
                <div className="mobile-progress-fill" ref={mobileProgressRef} />
            </div>

            {/* HERO SECTION */}
            <section className="flow-hero" ref={heroRef}>
                <span className="flow-hero-badge">
                    <Sparkles size={14} style={{ marginRight: 8, display: 'inline' }} />
                    Our Process
                </span>
                <h1 className="flow-hero-title">The Journey</h1>
                <p className="flow-hero-subtitle">
                    From your first idea to a fully deployed solution—follow our seamless
                    6-step process that transforms concepts into reality.
                </p>
                <div className="flow-scroll-indicator">
                    <span>Scroll to begin</span>
                    <div className="scroll-line" />
                </div>
            </section>

            {/* JOURNEY - ALL STEPS */}
            <div className="flow-journey" ref={journeyRef}>
                {steps.map((step, index) => (
                    <section
                        key={step.id}
                        className="flow-step"
                        ref={el => { stepRefs.current[index] = el as HTMLDivElement; }}
                    >
                        <div
                            className="flow-step-panel"
                            style={{
                                borderColor: `${step.color}25`,
                                boxShadow: `0 0 40px ${step.color}10`
                            }}
                        >
                            <span
                                className="step-tag"
                                style={{ background: step.color }}
                            >
                                {step.status === 'completed' ? '✓ ' : ''}
                                Step {step.id}
                            </span>
                            <h2 className="step-title">{step.title}</h2>
                            <p className="step-description">{step.description}</p>
                            <div className="step-features">
                                {step.details.map((detail, i) => (
                                    <div
                                        key={i}
                                        className="step-feature"
                                        style={{ borderColor: `${step.color}15` }}
                                    >
                                        <Check
                                            className="step-feature-icon"
                                            size={18}
                                            style={{ color: step.color }}
                                        />
                                        <span>{detail}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* CTA SECTION */}
            <section className="flow-cta" ref={ctaRef}>
                <h2 className="cta-title">Ready to Start Your Journey?</h2>
                <p className="cta-subtitle">
                    Let's transform your vision into reality with our proven process.
                </p>
                <Link to="/contact">
                    <button className="cta-button">
                        Begin Your Project
                        <ArrowRight size={20} />
                    </button>
                </Link>
            </section>
        </div>
    );
}
