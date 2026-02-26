import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

// Layouts
import MobileLayout from "@/components/layouts/MobileLayout";
import AdminLayout from "@/components/layouts/AdminLayout";

// App Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// Onboarding
import OnboardingPage from "@/pages/onboarding/OnboardingPage";

// Mobile pages
import DiscoverPage from "@/pages/discover/DiscoverPage";
import MatchesPage from "@/pages/matches/MatchesPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import ProfilePage from "@/pages/profile/ProfilePage";

// Admin pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminPlaceholder from "@/pages/admin/AdminPlaceholder";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Redirect root to discover */}
            <Route path="/" element={<Navigate to="/discover" replace />} />

            {/* App Auth routes (public) */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            {/* Onboarding */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Mobile App Routes (protected — requires auth + completed onboarding) */}
            <Route element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Console — separate login + role-gated */}
            <Route path="/admin/login" element={<AdminAuthProvider><AdminLoginPage /></AdminAuthProvider>} />
            <Route path="/admin" element={<AdminAuthProvider><AdminRoute><AdminLayout /></AdminRoute></AdminAuthProvider>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="moderation" element={<AdminPlaceholder />} />
              <Route path="analytics" element={<AdminPlaceholder />} />
              <Route path="features" element={<AdminPlaceholder />} />
              <Route path="subscriptions" element={<AdminPlaceholder />} />
              <Route path="content" element={<AdminPlaceholder />} />
              <Route path="settings" element={<AdminPlaceholder />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
