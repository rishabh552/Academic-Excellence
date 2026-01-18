import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

// Smooth scroll to top on route change using GSAP
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to let exit animation complete (0.3s exit duration)
    // Then instant scroll to avoid conflicts with enter animation
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
import { ModernNavbar } from "./components/ui/modern-navbar";
import { SwipeNavigation } from "./components/ui/swipe-navigation";
import { PageTransition } from "./components/ui/page-transition";
import { CircularContextMenu } from "./components/ui/circular-context-menu";
import { CustomCursor } from "./components/ui/custom-cursor";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { Process } from "./pages/Process";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

// Lazy load heavy pages for better initial load performance
const ProjectShowcase = lazy(() => import("./pages/ProjectShowcase").then(m => ({ default: m.ProjectShowcase })));
const Pricing = lazy(() => import("./pages/Pricing").then(m => ({ default: m.Pricing })));
const StartProject = lazy(() => import("./pages/StartProject").then(m => ({ default: m.StartProject })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    </div>
  );
}
function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Copyright */}
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © 2025 aqro
          </p>
        </div>
      </div>
    </footer>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      {/* Scroll restoration */}
      <ScrollToTop />

      {/* Sticky Navigation */}
      <ModernNavbar />

      {/* Global Context Menu */}
      <CircularContextMenu />

      {/* Custom Cursor (Desktop only) */}
      <CustomCursor />

      {/* Routes with Swipe Navigation for mobile */}
      <SwipeNavigation>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
              <Route path="/process" element={<PageTransition><Process /></PageTransition>} />
              <Route path="/showcase" element={<PageTransition><ProjectShowcase /></PageTransition>} />
              <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/start-project" element={<PageTransition><StartProject /></PageTransition>} />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </SwipeNavigation>

      {/* Footer - persistent on all pages */}
      <Footer />
    </div>
  );
}

import { ShowcaseProvider } from "./context/ShowcaseContext";

function App() {
  return (
    <ShowcaseProvider>
      <Router>
        <AppContent />
      </Router>
    </ShowcaseProvider>
  );
}

export default App;
