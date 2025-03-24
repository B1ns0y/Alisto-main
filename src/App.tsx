import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "@/pages/Login";
import Register from "./pages/Register";
import SetPassword from "./pages/SetPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Terms from "./pages/Terms";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Privacy from "./pages/PrivacyPolicy";
import SetPassword2 from "./pages/SetPassword2";
import SetPassword3 from "./pages/SetPassword3";
import { UserProvider } from "./contexts/UserContext";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <UserProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
            <Route path="/set-password/" element={<SetPassword />} />
            <Route path="/set-password-2/" element={<SetPassword2 />} />
            <Route path="/set-password-3/:uidb64/:token" element={<SetPassword3 />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* 404 and fallbacks */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;