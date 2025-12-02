import { PricingSection } from "@/components/pricing-section";
import { NicheParticles } from "@/components/ui/niche-particles";

export function Pricing() {
    return (
        <div className="relative pt-20 font-sans-secondary min-h-screen">
            <NicheParticles
                className="absolute inset-0 -z-10"
                quantity={100}
                ease={80}
                color="#6366f1" // Indigo
                refresh
            />
            <PricingSection />
        </div>
    );
}
