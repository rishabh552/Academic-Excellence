import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        scale: 0.98,
        // Start with a clip-path that reveals nothing or just a sliver
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)"
    },
    enter: {
        opacity: 1,
        scale: 1,
        // Reveal full page
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1], // Custom bezier for "premium" feel
            staggerChildren: 0.05
        }
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        // Optional: wipe out or just fade/scale
        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const contentVariants = {
    initial: { opacity: 0, y: 20 },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation();

    return (
        <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="min-h-screen w-full bg-background"
            style={{
                // Ensure smooth rendering
                willChange: "transform, opacity,1 clip-path",
                transformOrigin: "center top"
            }}
        >
            <motion.div variants={contentVariants}>
                {children}
            </motion.div>
        </motion.div>
    );
}
