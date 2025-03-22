import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {Routes, Route, Navigate } from "react-router-dom";
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
      <UserProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Terms" element={<Terms />} />
            <Route path="/Privacy" element={<Privacy />} />
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}/>
              <Dashboard />
              <Route path="/settings" element={<Settings />} />
            <Route />

            <Route path="/register" element={<Register />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/set-password2" element={<SetPassword2 />} />
            <Route path="/reset-password/:uidb64/:token" element={<SetPassword3 />} />
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/verify-email/:uid/:token/" element={<VerifyEmail />} />
          </Routes>
        </AuthProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
