import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ModernNavbar } from "./components/ui/modern-navbar";
import { SwipeNavigation } from "./components/ui/swipe-navigation";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { Process } from "./pages/Process";
import { ProjectShowcase } from "./pages/ProjectShowcase";
import { Pricing } from "./pages/Pricing";
import { Contact } from "./pages/Contact";
import { CaseStudies } from "./pages/CaseStudies";
import { StartProject } from "./pages/StartProject";
import { NotFound } from "./pages/NotFound";

function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["Home", "Services", "Process", "Showcase", "Case Studies", "Pricing", "Start Project", "Contact"].map((link) => (
              <Link
                key={link}
                to={link === "Home" ? "/" : link === "Showcase" ? "/showcase" : link === "Case Studies" ? "/case-studies" : link === "Start Project" ? "/start-project" : `/${link.toLowerCase()}`}
                className="text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-400 transition-colors duration-200 text-sm"
              >
                {link}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © 2025 ProjectCraft
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
      {/* Sticky Navigation */}
      <ModernNavbar />

      {/* Routes with Swipe Navigation for mobile */}
      <SwipeNavigation>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/process" element={<Process />} />
            <Route path="/showcase" element={<ProjectShowcase />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/start-project" element={<StartProject />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </SwipeNavigation>

      {/* Footer - persistent on all pages */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
