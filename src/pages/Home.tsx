import { BackgroundPaths } from "@/components/background-paths";
import { MobileHero } from "@/components/mobile-hero";
import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            staggerChildren: 0.2
        }
    },
    exit: { opacity: 0, y: -10 }
};

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function Home() {
    return (
        <motion.div
            id="home"
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="relative"
        >
            {/* Mobile Hero - visible below 1024px (phones + tablets) */}
            <motion.div variants={itemVariants} className="block lg:hidden">
                <MobileHero title="Academic Excellence" />
            </motion.div>

            {/* Desktop Hero - visible at 1024px and above (laptops + desktops) */}
            <motion.div variants={itemVariants} className="hidden lg:block">
                <BackgroundPaths title="Academic Excellence" />
            </motion.div>
        </motion.div>
    );
}
