import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";

export default function SwipeLimitBanner() {
  const { tier, dailySwipesRemaining, features } = useSubscription();
  const navigate = useNavigate();

  if (features.unlimitedSwipes) return null;

  const total = features.dailySwipes;
  const pct = (dailySwipesRemaining / total) * 100;
  const isLow = dailySwipesRemaining <= 5;

  return (
    <div className="mx-4 mb-2 p-3 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Heart className={`h-3.5 w-3.5 ${isLow ? "text-destructive" : "text-primary"}`} />
          <span className="text-xs text-foreground font-medium">
            {dailySwipesRemaining} swipes left
          </span>
        </div>
        {tier === "free" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] text-primary hover:text-primary/80"
            onClick={() => navigate("/subscription")}
          >
            Get more
          </Button>
        )}
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}
