"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlassButton } from "@/components/ui/glass-button";
import { MorphingText } from "@/components/ui/morphing-text";

function FloatingPaths({ position }: { position: number }) {
  // array of animated floating SVG paths with gradually changing stroke opacity and width
  // motions include path length animation and opacity cycling
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }}
            transition={{ duration: 20 + Math.random() * 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({ title = "Academic Projects Done Right" }: { title?: string }) {
  const words = ["Full Stack Web", "Machine Learning", "Deep Learning", "NLP Projects", "Mobile Apps"];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
            <span className="text-sm text-muted-foreground font-medium">Accepting New Projects for Spring 2025</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              {title}
            </span>
          </h1>

          <div className="mb-12 text-2xl md:text-3xl text-muted-foreground font-light">
            Expert assistance for{" "}
            <span className="text-brand-primary font-medium">
              <MorphingText texts={words} />
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-lg mx-auto">
            <Link to="/start-project" className="w-full md:w-auto">
              <GlassButton className="w-full px-8 py-4 text-lg bg-white/10 hover:bg-white/20 border-white/30 text-white">
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">Start Project</span>
                <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">→</span>
              </GlassButton>
            </Link>

            <Link to="/showcase" className="w-full md:w-auto">
              <GlassButton className="w-full px-8 py-4 text-lg bg-white/5 hover:bg-white/15 border-white/20 text-white/80 hover:text-white">
                View Showcase
              </GlassButton>
            </Link>
          </div>
        </motion.div>
      </div>


    </div>
  );
}
