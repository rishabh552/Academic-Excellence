"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function ModernNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
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

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Process", path: "/process" },
        { name: "Showcase", path: "/showcase" },
        { name: "Pricing", path: "/pricing" },
        { name: "Contact", path: "/contact" },
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
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={cn(
                                                "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
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
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="ml-4 flex items-center gap-3">
                                <button
                                    onClick={toggleTheme}
                                    className={cn(
                                        "p-2.5 rounded-full transition-all duration-300",
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-white dark:bg-neutral-950 pt-24 px-6 md:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col space-y-6">
                            {navItems.map((item, idx) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "block text-3xl font-bold tracking-tight transition-colors",
                                            location.pathname === item.path
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="pt-8 border-t border-gray-100 dark:border-neutral-800"
                            >
                                <Link
                                    to="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full py-4 bg-blue-600 text-white text-center rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
                                >
                                    Start Your Project
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
