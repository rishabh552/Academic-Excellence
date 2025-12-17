import { ContactSection } from "@/components/contact-section";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

export function Contact() {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="relative pt-20 font-sans-secondary min-h-screen overflow-hidden"
        >
            <GridPattern
                squareCount={48}
                gridColumns={50}
                gridRows={30}
                className={cn(
                    "[mask-image:radial-gradient(1200px_circle_at_center,white,transparent)]",
                    "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fill-cyan-400/40 stroke-cyan-400/50",
                )}
            />
            <ContactSection />
        </motion.div>
    );
}
