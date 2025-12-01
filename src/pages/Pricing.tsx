import { PricingSection } from "@/components/pricing-section";
import { FloatingParticles } from "@/components/ui/floating-particles";

export function Pricing() {
    return (
        <div className="relative pt-20 font-sans-secondary min-h-screen">
            <FloatingParticles
                customColors={[
                    "rgba(16, 185, 129, 0.3)",   // Success green
                    "rgba(59, 130, 246, 0.3)",   // Trust blue
                    "rgba(99, 102, 241, 0.3)",   // Professional indigo
                ]}
            />
            <PricingSection />
        </div>
    );
}
