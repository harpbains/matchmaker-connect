import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const STORAGE_KEY = "desiconnect_admin_session";

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  loading: true,
  signIn: async () => ({}),
  signOut: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAdmin(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.rpc("verify_admin_login", {
      p_email: email,
      p_password: password,
    });

    if (error) {
      return { error: error.message };
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { error: "Invalid credentials or account inactive." };
    }

    const row = Array.isArray(data) ? data[0] : data;
    const adminUser: AdminUser = {
      id: row.admin_id,
      email: row.admin_email,
      displayName: row.admin_display_name,
      role: row.admin_role,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
    setAdmin(adminUser);
    return {};
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
