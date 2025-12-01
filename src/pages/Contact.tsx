import { ContactSection } from "@/components/contact-section";
import { FloatingParticles } from "@/components/ui/floating-particles";

export function Contact() {
    return (
        <div className="relative pt-20 font-sans-secondary min-h-screen">
            <FloatingParticles
                customColors={[
                    "rgba(59, 130, 246, 0.3)",   // Calm blue
                    "rgba(34, 211, 238, 0.2)",   // Soft cyan
                    "rgba(99, 102, 241, 0.3)",   // Gentle indigo
                ]}
            />
            <ContactSection />
        </div>
    );
}
