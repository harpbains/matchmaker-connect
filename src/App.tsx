import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MobileLayout from "@/components/layouts/MobileLayout";
import AdminLayout from "@/components/layouts/AdminLayout";

// Mobile pages
import DiscoverPage from "@/pages/discover/DiscoverPage";
import MatchesPage from "@/pages/matches/MatchesPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import ProfilePage from "@/pages/profile/ProfilePage";

// Admin pages
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
        <Routes>
          {/* Redirect root to discover */}
          <Route path="/" element={<Navigate to="/discover" replace />} />

          {/* Mobile App Routes */}
          <Route element={<MobileLayout />}>
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Console Routes */}
          <Route path="/admin" element={<AdminLayout />}>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
