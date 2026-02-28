import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  User,
  Mail,
  Bell,
  Compass,
  Globe,
  ShieldCheck,
  Ban,
  LogOut,
  ChevronRight,
  Settings,
  Crown,
  Camera,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: User, label: "Personal Information" },
  { icon: Mail, label: "Email & Phone" },
  { icon: Bell, label: "Notifications" },
  { icon: Compass, label: "Discovery Settings" },
  { icon: Globe, label: "Language & Region" },
  { icon: ShieldCheck, label: "Privacy Center" },
  { icon: Ban, label: "Blocked Users" },
];

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { tier } = useSubscription();
  const navigate = useNavigate();
  const [matrimonyMode, setMatrimonyMode] = useState(false);

  const tierLabel = tier === "free" ? "Free" : tier === "active" ? "Active" : "Pro";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  return (
    <div className="px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-display font-bold text-foreground">Profile</h1>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile card */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border mb-4">
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/20 text-primary font-display font-bold text-xl">
              R
            </AvatarFallback>
          </Avatar>
          <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
            <Camera className="h-3 w-3 text-primary-foreground" />
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-foreground">Rahul K.</h2>
            <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">{tierLabel}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Amsterdam, NL</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 h-7 text-xs border-primary/30 text-primary hover:bg-primary/10"
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Subscription CTA */}
      <div
        className="p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 mb-4 flex items-center gap-3 cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => navigate("/subscription")}
      >
        <Crown className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {tier === "pro" ? "Pro Member" : "Upgrade to Pro"}
          </p>
          <p className="text-xs text-muted-foreground">
            {tier === "pro" ? "You have all features unlocked" : "Unlimited swipes, boosts & more"}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Matrimony mode toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border mb-4">
        <div>
          <p className="text-sm font-medium text-foreground">Matrimony Mode</p>
          <p className="text-xs text-muted-foreground">Show serious intent profiles</p>
        </div>
        <Switch checked={matrimonyMode} onCheckedChange={setMatrimonyMode} />
      </div>

      <Separator className="my-2" />

      {/* Menu items */}
      <div className="flex flex-col gap-0.5 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors w-full text-left"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground flex-1">{item.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <Separator className="my-2" />

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 transition-colors w-full text-left mt-1"
      >
        <LogOut className="h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">Log Out</span>
      </button>
    </div>
  );
}
