import { ServicesSection } from "@/components/services-section";
import { NicheParticles } from "@/components/ui/niche-particles";
import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

export function Services() {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative pt-20 font-sans-secondary min-h-screen"
        >
            <NicheParticles
                className="absolute inset-0 -z-10"
                quantity={100}
                ease={80}
                color="#8b5cf6" // Violet
                refresh
            />
            <ServicesSection />
        </motion.div>
    );
}
