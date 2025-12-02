import { ContactSection } from "@/components/contact-section";
import { NicheParticles } from "@/components/ui/niche-particles";

export function Contact() {
    return (
        <div className="relative pt-20 font-sans-secondary min-h-screen">
            <NicheParticles
                className="absolute inset-0 -z-10"
                quantity={100}
                ease={80}
                color="#06b6d4" // Cyan
                refresh
            />
            <ContactSection />
        </div>
    );
}
