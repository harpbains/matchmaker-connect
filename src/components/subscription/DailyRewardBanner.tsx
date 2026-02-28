import { Gift, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function DailyRewardBanner() {
  const { streakDays, dailyRewardClaimed, claimDailyReward } = useSubscription();

  if (dailyRewardClaimed) return null;

  return (
    <div className="mx-4 mb-2 p-3 rounded-xl bg-gradient-to-r from-warning/15 to-primary/10 border border-warning/20 flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
        <Gift className="h-5 w-5 text-warning" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">Daily Reward</p>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Flame className="h-3 w-3 text-warning" />
          {streakDays} day streak — +5 swipes
        </p>
      </div>
      <Button
        size="sm"
        className="h-7 text-xs bg-warning text-warning-foreground hover:bg-warning/90"
        onClick={claimDailyReward}
      >
        Claim
      </Button>
    </div>
  );
}
