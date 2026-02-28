import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

const boostPacks = [
  { count: 1, price: 3.99 },
  { count: 5, price: 14.99, badge: "Save 25%" },
  { count: 10, price: 24.99, badge: "Best Value" },
];

interface BoostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BoostModal({ open, onOpenChange }: BoostModalProps) {
  const { boosts } = useSubscription();
  const { toast } = useToast();

  const handleBuy = (count: number) => {
    toast({
      title: `🚀 ${count} Boost${count > 1 ? "s" : ""} added!`,
      description: "Use them from your Discover screen",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            Buy Boosts
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground">
          You have <span className="text-foreground font-medium">{boosts}</span> boost{boosts !== 1 ? "s" : ""} remaining
        </p>

        <div className="flex flex-col gap-3 mt-2">
          {boostPacks.map((pack) => (
            <button
              key={pack.count}
              onClick={() => handleBuy(pack.count)}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary/30 hover:border-warning/40 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <span className="text-lg font-display font-bold text-warning">{pack.count}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">
                  {pack.count} Boost{pack.count > 1 ? "s" : ""}
                </p>
                {pack.badge && (
                  <span className="text-[10px] text-warning">{pack.badge}</span>
                )}
              </div>
              <span className="text-sm font-display font-bold text-foreground">
                ${pack.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
