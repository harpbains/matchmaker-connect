import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Shield, User } from "lucide-react";

export default function AdminSettingsPage() {
  const { admin, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/admin/login");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Admin account & system configuration</p>
      </div>

      <div className="grid gap-4 max-w-2xl">
        {/* Current admin */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-display flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Current Admin
            </CardTitle>
            <CardDescription>Your active admin session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {admin && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm text-foreground font-medium">{admin.displayName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm text-foreground">{admin.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge className="bg-primary/20 text-primary capitalize">{admin.role}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Admin authentication is separate from the app's user system. Sessions are stored locally and do not use the app's auth provider.
            </p>
            <Button variant="destructive" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out of Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
