import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

const menuItems = [
  { icon: User, label: "Personal Information", href: "#" },
  { icon: Mail, label: "Email & Phone", href: "#" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: Compass, label: "Discovery Settings", href: "#" },
  { icon: Globe, label: "Language & Region", href: "#" },
  { icon: ShieldCheck, label: "Privacy Center", href: "#" },
  { icon: Ban, label: "Blocked Users", href: "#" },
];

export default function ProfilePage() {
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
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary/20 text-primary font-display font-bold text-xl">
            R
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-display font-semibold text-foreground">Rahul K.</h2>
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
      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 mb-4 flex items-center gap-3">
        <Crown className="h-8 w-8 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Upgrade to Pro</p>
          <p className="text-xs text-muted-foreground">Unlimited swipes, boosts & more</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Matrimony mode toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border mb-4">
        <div>
          <p className="text-sm font-medium text-foreground">Matrimony Mode</p>
          <p className="text-xs text-muted-foreground">Show serious intent profiles</p>
        </div>
        <Switch />
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

      <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 transition-colors w-full text-left mt-1">
        <LogOut className="h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">Log Out</span>
      </button>
    </div>
  );
}
