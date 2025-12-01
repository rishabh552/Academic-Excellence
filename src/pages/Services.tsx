import { ServicesSection } from "@/components/services-section";
import { FloatingParticles } from "@/components/ui/floating-particles";

export function Services() {
    return (
        <div className="relative pt-20 font-sans-secondary min-h-screen">
            <FloatingParticles
                customColors={[
                    "rgba(102, 126, 234, 0.4)",  // Vibrant blue
                    "rgba(118, 75, 162, 0.4)",   // Rich purple
                    "rgba(59, 130, 246, 0.4)",   // Strong blue
                ]}
            />
            <ServicesSection />
        </div>
    );
}
