import { ServicesSection } from "@/components/services-section";
import { NicheParticles } from "@/components/ui/niche-particles";

export function Services() {
    return (
        <div className="relative pt-20 font-sans-secondary min-h-screen">
            <NicheParticles
                className="absolute inset-0 -z-10"
                quantity={100}
                ease={80}
                color="#8b5cf6" // Violet
                refresh
            />
            <ServicesSection />
        </div>
    );
}
