import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminRoutes from "./routes/admin";
import NotFound from "./pages/NotFound";
import DonationSuccess from "./pages/DonationSuccess";
import DonationPending from "./pages/DonationPending";
import DonationFailure from "./pages/DonationFailure";
import DonationTransfer from "./pages/DonationTransfer";
import DonationCash from "./pages/DonationCash";

const queryClient = new QueryClient();

const App = () => {
  // Add scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donation/success" element={<DonationSuccess />} />
              <Route path="/donation/pending" element={<DonationPending />} />
              <Route path="/donation/failure" element={<DonationFailure />} />
              <Route path="/donation/transfer" element={<DonationTransfer />} />
              <Route path="/donation/cash" element={<DonationCash />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
