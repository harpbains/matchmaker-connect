import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Star,
  ShieldCheck,
  Crown,
  Gift,
  Bell,
  Check,
} from "lucide-react";

interface Notification {
  id: string;
  type: "match" | "message" | "like" | "super_like" | "verification" | "subscription" | "reward" | "system";
  title: string;
  body: string;
  read: boolean;
  time: string;
}

const mockNotifications: Notification[] = [
  { id: "1", type: "match", title: "New Match! 🎉", body: "You and Priya matched! Say hi.", read: false, time: "2m ago" },
  { id: "2", type: "message", title: "New Message", body: "Anita: Hey, how's Amsterdam?", read: false, time: "15m ago" },
  { id: "3", type: "like", title: "Someone liked you", body: "Upgrade to Pro to see who!", read: false, time: "1h ago" },
  { id: "4", type: "super_like", title: "Super Like! ⭐", body: "Someone super liked your profile", read: true, time: "3h ago" },
  { id: "5", type: "reward", title: "Daily Reward", body: "You earned 5 bonus swipes! 🎁", read: true, time: "6h ago" },
  { id: "6", type: "verification", title: "Verified ✅", body: "Your profile has been verified!", read: true, time: "1d ago" },
  { id: "7", type: "subscription", title: "Pro Trial", body: "Try Pro free for 7 days — limited offer", read: true, time: "2d ago" },
  { id: "8", type: "system", title: "Profile Tip", body: "Add more photos to get 3x matches", read: true, time: "3d ago" },
];

const iconMap = {
  match: Heart,
  message: MessageCircle,
  like: Heart,
  super_like: Star,
  verification: ShieldCheck,
  subscription: Crown,
  reward: Gift,
  system: Bell,
};

const colorMap: Record<string, string> = {
  match: "text-primary bg-primary/20",
  message: "text-primary bg-primary/20",
  like: "text-destructive bg-destructive/20",
  super_like: "text-warning bg-warning/20",
  verification: "text-primary bg-primary/20",
  subscription: "text-warning bg-warning/20",
  reward: "text-primary bg-primary/20",
  system: "text-muted-foreground bg-secondary",
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={markAllRead}>
            <Check className="h-3.5 w-3.5 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-1">
        {notifications.map((notif, idx) => {
          const Icon = iconMap[notif.type];
          return (
            <div key={notif.id}>
              <button
                onClick={() => markRead(notif.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left ${
                  notif.read ? "opacity-60" : "bg-secondary/30"
                } hover:bg-secondary/50`}
              >
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[notif.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{notif.title}</p>
                    {!notif.read && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{notif.body}</p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">
                  {notif.time}
                </span>
              </button>
              {idx < notifications.length - 1 && <Separator className="my-0.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
