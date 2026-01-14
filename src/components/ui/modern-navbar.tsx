"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronRight,
  Code2,
  Brain,
  MessageSquare,
  Smartphone,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Service items for the dropdown
const serviceItems = [
  {
    name: "Full-Stack Web Apps",
    description: "MERN, Next.js, Django",
    icon: Code2,
    color: "bg-blue-700",
  },
  {
    name: "Machine Learning",
    description: "CNN, RNN, Transformers",
    icon: Brain,
    color: "bg-blue-700",
  },
  {
    name: "NLP Projects",
    description: "Chatbots, Sentiment Analysis",
    icon: MessageSquare,
    color: "bg-blue-700",
  },
  {
    name: "Mobile Apps",
    description: "React Native, Flutter",
    icon: Smartphone,
    color: "bg-blue-700",
  },
  {
    name: "n8n Automation",
    description: "Workflow & API Integration",
    icon: Workflow,
    color: "bg-blue-700",
  },
];

// Dropdown animation variants
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.2 },
  }),
};

export function ModernNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-obsidian/90 md:bg-obsidian/80 backdrop-blur-lg md:backdrop-blur-xl saturate-150 border-white/5 shadow-lg shadow-black/10 py-3"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="w-full px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Logo - Enhanced with glow effect */}
            <Link
              to="/"
              className="relative z-50 flex items-center gap-3 group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="relative rounded-full overflow-hidden w-11 h-11 flex items-center justify-center">
                <img
                  src="image.png"
                  alt="aqro for Students"
                  width={44}
                  height={44}
                  loading="lazy"
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
                {/* Glow effect behind logo */}
                <div className="absolute inset-0 bg-blue-700 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-full" />
              </div>
              <span
                className={cn(
                  "text-xl font-bold tracking-tight transition-all duration-300",
                  isScrolled || !isHome
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-900 dark:text-white",
                  "group-hover:text-blue-600"
                )}
              >
                aqro for Students
              </span>
            </Link>

            {/* Desktop Navigation - Show only on large screens (1024px+) */}
            <div className="hidden lg:flex items-center gap-1">
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-300",
                  isScrolled
                    ? "bg-gray-100/50 dark:bg-white/5 border-gray-300 dark:border-white/30"
                    : "bg-white/10 dark:bg-black/10 border-white/40 dark:border-white/30 backdrop-blur-sm"
                )}
              >
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const isHovered = hoveredItem === item.name;

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() =>
                        item.hasDropdown && handleMouseEnter(item.name)
                      }
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
                            className="absolute inset-0 rounded-full bg-blue-700 shadow-md shadow-blue-700/30"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
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
                                    <div
                                      className={cn(
                                        "w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200 ring-1 ring-white/10",
                                        service.color
                                      )}
                                    >
                                      <service.icon className="w-5 h-5" strokeWidth={1.5} />
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
                <Link to="/start-project">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm shadow-lg hover:shadow-blue-700/30 transition-all flex items-center gap-2"
                  >
                    <span>Start Project</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Toggle - Show on screens below 1024px */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50 p-3 text-gray-900 dark:text-white"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
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
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
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
              className="fixed top-0 right-0 bottom-0 z-40 w-[85vw] max-w-sm bg-white dark:bg-neutral-950 pt-24 px-6 lg:hidden overflow-y-auto shadow-2xl"
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
                      stiffness: 200,
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
                    to="/start-project"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full py-4 bg-blue-700 hover:bg-blue-800 text-white text-center rounded-xl font-bold text-lg shadow-lg shadow-blue-700/25 active:scale-95 transition-all"
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
