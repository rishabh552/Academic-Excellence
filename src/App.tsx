import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
// import { DottedSurface } from "./components/ui/dotted-surface";
import { ModernNavbar } from "./components/ui/modern-navbar";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { Process } from "./pages/Process";
import { ProjectShowcase } from "./pages/ProjectShowcase";
import { Pricing } from "./pages/Pricing";
import { Contact } from "./pages/Contact";

function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 right-0 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["Home", "Services", "Process", "Showcase", "Pricing", "Contact"].map((link) => (
              <Link
                key={link}
                to={link === "Home" ? "/" : link === "Showcase" ? "/showcase" : `/${link.toLowerCase()}`}
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
      {/* Animated shader background - fixed behind everything */}
      {/* <DottedSurface /> */}

      {/* Sticky Navigation */}
      <ModernNavbar />

      {/* Routes */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/process" element={<Process />} />
          <Route path="/showcase" element={<ProjectShowcase />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>

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
