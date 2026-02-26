import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Heart, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <Heart className="h-7 w-7 text-primary-foreground" fill="currentColor" />
          </div>
        </div>

        <Card className="bg-card border-border">
          {sent ? (
            <CardContent className="pt-6 text-center">
              <p className="text-foreground font-medium mb-2">Check your email</p>
              <p className="text-sm text-muted-foreground mb-4">
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <Link to="/auth/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                </Button>
              </Link>
            </CardContent>
          ) : (
            <form onSubmit={handleReset}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-display">Reset Password</CardTitle>
                <CardDescription>Enter your email to receive a reset link</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary border-border"
                    required
                    maxLength={255}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Link to="/auth/login" className="text-sm text-primary hover:underline">
                  <ArrowLeft className="h-3 w-3 inline mr-1" /> Back to Login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
