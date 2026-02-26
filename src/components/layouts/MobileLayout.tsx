import { Outlet, useLocation } from "react-router-dom";
import { Heart, MessageCircle, Compass, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/discover", icon: Compass, label: "Discover" },
  { to: "/matches", icon: Heart, label: "Matches" },
  { to: "/messages", icon: MessageCircle, label: "Chats" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function MobileLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg pb-safe">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                  "text-muted-foreground hover:text-foreground"
                )}
                activeClassName="text-primary"
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    isActive && "drop-shadow-[0_0_6px_hsl(160,84%,39%)]"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
