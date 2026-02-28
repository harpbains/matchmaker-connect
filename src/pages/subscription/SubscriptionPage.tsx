import { useState } from "react";
import { Check, Crown, Sparkles, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useSubscription, SubscriptionTier, tierPricing } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import BoostModal from "@/components/subscription/BoostModal";

const plans: {
  tier: SubscriptionTier;
  name: string;
  tagline: string;
  icon: typeof Crown;
  popular?: boolean;
  features: string[];
}[] = [
  {
    tier: "free",
    name: "Free",
    tagline: "Get started",
    icon: Zap,
    features: [
      "25 daily swipes",
      "1 super like / day",
      "Basic filters",
      "Standard messaging",
    ],
  },
  {
    tier: "active",
    name: "Active",
    tagline: "Most popular",
    icon: Sparkles,
    popular: true,
    features: [
      "100 daily swipes",
      "5 super likes / day",
      "See who liked you",
      "Rewind last swipe",
      "1 boost / month",
      "Advanced filters",
      "Read receipts",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    tagline: "Go all in",
    icon: Crown,
    features: [
      "Unlimited swipes",
      "10 super likes / day",
      "See who liked you",
      "Rewind last swipe",
      "5 boosts / month",
      "Advanced filters",
      "Read receipts",
      "Travel mode",
      "Priority support",
      "Profile highlight",
    ],
  },
];

export default function SubscriptionPage() {
  const [yearly, setYearly] = useState(false);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const { tier: currentTier, setTier } = useSubscription();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelect = (tier: SubscriptionTier) => {
    setTier(tier);
    toast({
      title: tier === "free" ? "Downgraded" : "🎉 Upgraded!",
      description: `You're now on the ${tier.charAt(0).toUpperCase() + tier.slice(1)} plan`,
    });
  };

  return (
    <div className="min-h-screen bg-background px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-display font-bold text-foreground">Choose Your Plan</h1>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className={`text-sm ${!yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <Switch checked={yearly} onCheckedChange={setYearly} />
        <span className={`text-sm ${yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
          Yearly
        </span>
        {yearly && (
          <Badge className="bg-primary/20 text-primary text-[10px] border-0">Save 33%</Badge>
        )}
      </div>

      {/* Plan cards */}
      <div className="flex flex-col gap-4">
        {plans.map((plan) => {
          const price = yearly
            ? tierPricing[plan.tier].yearly
            : tierPricing[plan.tier].monthly;
          const isCurrentPlan = currentTier === plan.tier;

          return (
            <div
              key={plan.tier}
              className={`relative rounded-2xl p-5 border transition-all ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]"
                  : "border-border bg-card"
              } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px]">
                  Most Popular
                </Badge>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  plan.popular ? "bg-primary/20" : "bg-secondary"
                }`}>
                  <plan.icon className={`h-5 w-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                </div>
                <div className="ml-auto text-right">
                  {price > 0 ? (
                    <>
                      <p className="text-xl font-display font-bold text-foreground">
                        ${yearly ? (price / 12).toFixed(2) : price.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">/ month</p>
                    </>
                  ) : (
                    <p className="text-xl font-display font-bold text-foreground">Free</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-xs text-foreground/80">{f}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  isCurrentPlan
                    ? "bg-secondary text-secondary-foreground"
                    : plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
                onClick={() => handleSelect(plan.tier)}
                disabled={isCurrentPlan}
              >
                {isCurrentPlan ? "Current Plan" : plan.tier === "free" ? "Downgrade" : "Upgrade"}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Boost section */}
      <div className="mt-6 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Profile Boosts
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Get 10x more visibility for 30 minutes
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-warning/30 text-warning hover:bg-warning/10"
            onClick={() => setBoostModalOpen(true)}
          >
            Buy Boosts
          </Button>
        </div>
      </div>

      <BoostModal open={boostModalOpen} onOpenChange={setBoostModalOpen} />
    </div>
  );
}
