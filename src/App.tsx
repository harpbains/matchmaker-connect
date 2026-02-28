import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
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
import ProfileDetailPage from "@/pages/discover/ProfileDetailPage";
import MatchesPage from "@/pages/matches/MatchesPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import ChatPage from "@/pages/messages/ChatPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import SubscriptionPage from "@/pages/subscription/SubscriptionPage";

// Admin pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminModerationPage from "@/pages/admin/AdminModerationPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AdminFeaturesPage from "@/pages/admin/AdminFeaturesPage";
import AdminSubscriptionsPage from "@/pages/admin/AdminSubscriptionsPage";
import AdminContentPage from "@/pages/admin/AdminContentPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
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
              <Route path="/profile/:id" element={<ProfileDetailPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:id" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
            </Route>

            {/* Admin Console — separate login + role-gated */}
            <Route path="/admin/login" element={<AdminAuthProvider><AdminLoginPage /></AdminAuthProvider>} />
            <Route path="/admin" element={<AdminAuthProvider><AdminRoute><AdminLayout /></AdminRoute></AdminAuthProvider>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="moderation" element={<AdminModerationPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="features" element={<AdminFeaturesPage />} />
              <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
