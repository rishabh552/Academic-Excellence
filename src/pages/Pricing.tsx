import { PricingSection } from "@/components/pricing-section";
import { NicheParticles } from "@/components/ui/niche-particles";
import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

export function Pricing() {
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
                color="#6366f1" // Indigo
                refresh
            />
            <PricingSection />
        </motion.div>
    );
}
