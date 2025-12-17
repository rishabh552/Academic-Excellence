import { ProcessSection } from "@/components/process-section";
import { BeamsBackground } from "@/components/ui/beams-background";
import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

export function Process() {
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
                colorHue={190} // Cyan/Teal
                colorRange={30}
                beamCount={12}
            />
            <ProcessSection />
        </motion.div>
    );
}
