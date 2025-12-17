import { PricingSection } from "@/components/pricing-section";
import { BeamsBackground } from "@/components/ui/beams-background";
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
            <BeamsBackground
                intensity="medium"
                colorHue={240} // Indigo
                colorRange={35}
                beamCount={12}
            />
            <PricingSection />
        </motion.div>
    );
}
