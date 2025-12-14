"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Briefcase, FolderOpen, Mail, Rocket, DollarSign, X, Cog } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
    color: string;
}

const menuItems: MenuItem[] = [
    { icon: <Home className="w-5 h-5" />, label: "Home", path: "/", color: "#a78bfa" },
    { icon: <Briefcase className="w-5 h-5" />, label: "Services", path: "/services", color: "#8b5cf6" },
    { icon: <Cog className="w-5 h-5" />, label: "Process", path: "/process", color: "#f472b6" },
    { icon: <FolderOpen className="w-5 h-5" />, label: "Showcase", path: "/showcase", color: "#6366f1" },
    { icon: <DollarSign className="w-5 h-5" />, label: "Pricing", path: "/pricing", color: "#06b6d4" },
    { icon: <Mail className="w-5 h-5" />, label: "Contact", path: "/contact", color: "#22d3ee" },
    { icon: <Rocket className="w-5 h-5" />, label: "Start", path: "/start-project", color: "#10b981" },
];

export function CircularContextMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle right-click
    const handleContextMenu = useCallback((e: MouseEvent) => {
        // Don't override context menu on input elements
        const target = e.target as HTMLElement;
        if (
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable
        ) {
            return;
        }

        e.preventDefault();

        // Calculate position, keeping menu within viewport
        const radius = 100; // Menu radius
        const padding = 20;
        let x = e.clientX;
        let y = e.clientY;

        // Clamp to viewport bounds
        x = Math.max(radius + padding, Math.min(window.innerWidth - radius - padding, x));
        y = Math.max(radius + padding, Math.min(window.innerHeight - radius - padding, y));

        setPosition({ x, y });
        setIsOpen(true);
    }, []);

    // Close menu on click outside or escape
    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Handle click outside using menuRef
    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            handleClose();
        }
    }, [handleClose]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            handleClose();
        }
    }, [handleClose]);

    // Navigate to path
    const handleItemClick = (path: string) => {
        handleClose();
        if (location.pathname !== path) {
            navigate(path);
        }
    };

    useEffect(() => {
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleContextMenu, handleClickOutside, handleKeyDown]);

    // Close on route change
    useEffect(() => {
        handleClose();
    }, [location.pathname, handleClose]);

    // Calculate radial positions
    const getItemPosition = (index: number, total: number) => {
        const angleStep = (2 * Math.PI) / total;
        const startAngle = -Math.PI / 2; // Start from top
        const angle = startAngle + index * angleStep;
        const radius = 80;
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        };
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", damping: 25, stiffness: 400 }}
                    className="fixed z-[9999] pointer-events-none"
                    style={{ left: position.x, top: position.y }}
                >
                    {/* Center close button */}
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ delay: 0.1, type: "spring", damping: 20, stiffness: 300 }}
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                        className={cn(
                            "absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto",
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            "bg-obsidian-light/90 backdrop-blur-xl border border-white/10",
                            "text-white/60 hover:text-white hover:bg-obsidian-lighter/90",
                            "transition-colors shadow-lg shadow-black/50"
                        )}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>

                    {/* Menu items */}
                    {menuItems.map((item, index) => {
                        const pos = getItemPosition(index, menuItems.length);
                        const isCurrentPage = location.pathname === item.path;

                        return (
                            <motion.button
                                key={item.path}
                                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    x: pos.x,
                                    y: pos.y,
                                    scale: 1,
                                }}
                                exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                transition={{
                                    type: "spring",
                                    damping: 20,
                                    stiffness: 300,
                                    delay: index * 0.03,
                                }}
                                onClick={(e) => { e.stopPropagation(); handleItemClick(item.path); }}
                                className={cn(
                                    "absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group",
                                    "w-14 h-14 rounded-full flex flex-col items-center justify-center gap-0.5",
                                    "bg-obsidian/90 backdrop-blur-xl border",
                                    "transition-all duration-200 shadow-lg",
                                    isCurrentPage
                                        ? "border-white/30 shadow-white/10"
                                        : "border-white/10 hover:border-white/20 shadow-black/50"
                                )}
                                style={{
                                    boxShadow: isCurrentPage ? `0 0 20px ${item.color}40` : undefined,
                                }}
                                title={item.label}
                            >
                                <span
                                    className={cn(
                                        "transition-colors",
                                        isCurrentPage ? "text-white" : "text-white/70 group-hover:text-white"
                                    )}
                                    style={{ color: isCurrentPage ? item.color : undefined }}
                                >
                                    {item.icon}
                                </span>
                                <span className="text-[9px] font-medium text-white/60 group-hover:text-white/90 transition-colors">
                                    {item.label}
                                </span>
                            </motion.button>
                        );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
