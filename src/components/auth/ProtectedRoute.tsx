import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, profile, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect to onboarding if profile not completed
  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
