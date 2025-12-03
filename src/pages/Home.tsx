import { BackgroundPaths } from "@/components/background-paths";
import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

export function Home() {
    return (
        <motion.div
            id="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative"
        >
            <BackgroundPaths title="Academic Excellence" />
        </motion.div>
    );
}
