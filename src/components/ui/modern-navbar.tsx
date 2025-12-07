"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronRight, Code2, Brain, MessageSquare, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

// Service items for the dropdown
const serviceItems = [
    {
        name: "Full-Stack Web Apps",
        description: "MERN, Next.js, Django",
        icon: Code2,
        color: "from-blue-500 to-cyan-500"
    },
    {
        name: "Machine Learning",
        description: "CNN, RNN, Transformers",
        icon: Brain,
        color: "from-purple-500 to-pink-500"
    },
    {
        name: "NLP Projects",
        description: "Chatbots, Sentiment Analysis",
        icon: MessageSquare,
        color: "from-orange-500 to-red-500"
    },
    {
        name: "Mobile Apps",
        description: "React Native, Flutter",
        icon: Smartphone,
        color: "from-green-500 to-emerald-500"
    }
];

// Dropdown animation variants
const dropdownVariants = {
    hidden: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: { duration: 0.15, ease: "easeIn" }
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.2, ease: "easeOut" }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.05, duration: 0.2 }
    })
};

export function ModernNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const location = useLocation();
    const isHome = location.pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // Check initial theme
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setIsDark(false);
            document.documentElement.classList.add("light");
        } else {
            // Default to dark (no class needed as it's now :root)
            setIsDark(true);
            document.documentElement.classList.remove("light");
        }
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.remove("light");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.add("light");
            localStorage.setItem("theme", "light");
        }
    };

    // Handle hover with delay for better UX
    const handleMouseEnter = (itemName: string) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setHoveredItem(itemName);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredItem(null);
        }, 150); // Small delay to prevent flicker
    };

    const navItems = [
        { name: "Home", path: "/", hasDropdown: false },
        { name: "Services", path: "/services", hasDropdown: true },
        { name: "Process", path: "/process", hasDropdown: false },
        { name: "Showcase", path: "/showcase", hasDropdown: false },
        { name: "Pricing", path: "/pricing", hasDropdown: false },
        { name: "Contact", path: "/contact", hasDropdown: false },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                    isScrolled
                        ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-gray-200/50 dark:border-white/10 shadow-sm py-3"
                        : "bg-transparent border-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="relative z-50 flex items-center gap-2 group"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                                P
                            </div>
                            <span className={cn(
                                "text-xl font-bold tracking-tight transition-colors duration-300",
                                isScrolled || !isHome ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"
                            )}>
                                ProjectCraft
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-300",
                                isScrolled
                                    ? "bg-gray-100/50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                                    : "bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10 backdrop-blur-sm"
                            )}>
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    const isHovered = hoveredItem === item.name;

                                    return (
                                        <div
                                            key={item.name}
                                            className="relative"
                                            onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.name)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <Link
                                                to={item.path}
                                                className={cn(
                                                    "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1",
                                                    isActive
                                                        ? "text-white"
                                                        : isScrolled || !isHome
                                                            ? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10"
                                                            : "text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-black/20"
                                                )}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="navbar-active"
                                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 shadow-md"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                                <span className="relative z-10">{item.name}</span>
                                                {item.hasDropdown && (
                                                    <motion.span
                                                        animate={{ rotate: isHovered ? 90 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="relative z-10"
                                                    >
                                                        <ChevronRight className="w-3 h-3" />
                                                    </motion.span>
                                                )}
                                            </Link>

                                            {/* Dropdown Panel for Services */}
                                            <AnimatePresence>
                                                {item.hasDropdown && isHovered && (
                                                    <motion.div
                                                        variants={dropdownVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="hidden"
                                                        className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl border border-white/10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-2xl shadow-black/20"
                                                        onMouseEnter={() => handleMouseEnter(item.name)}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        {/* Dropdown arrow */}
                                                        <div className="absolute -top-2 left-6 w-4 h-4 rotate-45 bg-white dark:bg-neutral-900 border-l border-t border-white/10" />

                                                        <div className="relative z-10 space-y-1">
                                                            {serviceItems.map((service, idx) => (
                                                                <motion.div
                                                                    key={service.name}
                                                                    custom={idx}
                                                                    variants={itemVariants}
                                                                    initial="hidden"
                                                                    animate="visible"
                                                                >
                                                                    <Link
                                                                        to="/services"
                                                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all group"
                                                                    >
                                                                        <div className={cn(
                                                                            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform",
                                                                            service.color
                                                                        )}>
                                                                            <service.icon className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                                {service.name}
                                                                            </div>
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                                {service.description}
                                                                            </div>
                                                                        </div>
                                                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                                                    </Link>
                                                                </motion.div>
                                                            ))}
                                                        </div>

                                                        {/* View All Services link */}
                                                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/10">
                                                            <Link
                                                                to="/services"
                                                                className="flex items-center justify-center gap-2 p-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                                            >
                                                                <span>View All Services</span>
                                                                <ChevronRight className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="ml-4 flex items-center gap-3">
                                <button
                                    onClick={toggleTheme}
                                    className={cn(
                                        "p-2.5 rounded-full transition-all duration-300 hover:scale-110",
                                        isScrolled
                                            ? "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
                                            : "hover:bg-white/20 dark:hover:bg-black/20 text-gray-700 dark:text-gray-200"
                                    )}
                                    aria-label="Toggle theme"
                                >
                                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                <Link to="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-5 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        <span>Get Started</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="relative z-50 p-2 text-gray-900 dark:text-white"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay - Enhanced with slide animation and swipe-to-close */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Panel - Slides from right */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={{ left: 0, right: 0.5 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.x > 100 || info.velocity.x > 500) {
                                    setIsMobileMenuOpen(false);
                                }
                            }}
                            className="fixed top-0 right-0 bottom-0 z-40 w-[85vw] max-w-sm bg-white dark:bg-neutral-950 pt-24 px-6 md:hidden overflow-y-auto shadow-2xl"
                        >
                            {/* Swipe indicator */}
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-16 rounded-full bg-gray-300 dark:bg-gray-700 opacity-50" />

                            <div className="flex flex-col space-y-6">
                                {navItems.map((item, idx) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.1 + idx * 0.06,
                                            type: "spring",
                                            damping: 20,
                                            stiffness: 200
                                        }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "block text-2xl font-bold tracking-tight transition-all duration-200",
                                                location.pathname === item.path
                                                    ? "text-blue-600 dark:text-blue-400 translate-x-2"
                                                    : "text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:translate-x-2"
                                            )}
                                        >
                                            {item.name}
                                            {location.pathname === item.path && (
                                                <motion.span
                                                    layoutId="mobile-active-indicator"
                                                    className="inline-block ml-3 w-2 h-2 rounded-full bg-blue-500"
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45, type: "spring", damping: 20 }}
                                    className="pt-8 border-t border-gray-100 dark:border-neutral-800"
                                >
                                    <Link
                                        to="/contact"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
                                    >
                                        Start Your Project
                                    </Link>
                                </motion.div>

                                {/* Hint text */}
                                <p className="text-center text-xs text-gray-400 dark:text-gray-600 pt-4">
                                    Swipe right to close
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
