import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type SubscriptionTier = "free" | "active" | "pro";

export interface TierFeatures {
  dailySwipes: number;
  dailySuperLikes: number;
  canSeeWhoLiked: boolean;
  canRewind: boolean;
  boostsPerMonth: number;
  advancedFilters: boolean;
  readReceipts: boolean;
  travelMode: boolean;
  prioritySupport: boolean;
  profileHighlight: boolean;
  unlimitedSwipes: boolean;
}

const tierConfig: Record<SubscriptionTier, TierFeatures> = {
  free: {
    dailySwipes: 25,
    dailySuperLikes: 1,
    canSeeWhoLiked: false,
    canRewind: false,
    boostsPerMonth: 0,
    advancedFilters: false,
    readReceipts: false,
    travelMode: false,
    prioritySupport: false,
    profileHighlight: false,
    unlimitedSwipes: false,
  },
  active: {
    dailySwipes: 100,
    dailySuperLikes: 5,
    canSeeWhoLiked: true,
    canRewind: true,
    boostsPerMonth: 1,
    advancedFilters: true,
    readReceipts: true,
    travelMode: false,
    prioritySupport: false,
    profileHighlight: false,
    unlimitedSwipes: false,
  },
  pro: {
    dailySwipes: 999,
    dailySuperLikes: 10,
    canSeeWhoLiked: true,
    canRewind: true,
    boostsPerMonth: 5,
    advancedFilters: true,
    readReceipts: true,
    travelMode: true,
    prioritySupport: true,
    profileHighlight: true,
    unlimitedSwipes: true,
  },
};

export const tierPricing: Record<SubscriptionTier, { monthly: number; yearly: number }> = {
  free: { monthly: 0, yearly: 0 },
  active: { monthly: 14.99, yearly: 119.99 },
  pro: { monthly: 29.99, yearly: 239.99 },
};

interface SubscriptionContextType {
  tier: SubscriptionTier;
  features: TierFeatures;
  boosts: number;
  dailySwipesRemaining: number;
  dailySuperLikesRemaining: number;
  setTier: (tier: SubscriptionTier) => void;
  useBoost: () => boolean;
  useSwipe: () => boolean;
  useSuperLike: () => boolean;
  canAccess: (feature: keyof TierFeatures) => boolean;
  streakDays: number;
  dailyRewardClaimed: boolean;
  claimDailyReward: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [boosts, setBoosts] = useState(0);
  const [dailySwipesRemaining, setDailySwipesRemaining] = useState(tierConfig.free.dailySwipes);
  const [dailySuperLikesRemaining, setDailySuperLikesRemaining] = useState(tierConfig.free.dailySuperLikes);
  const [streakDays, setStreakDays] = useState(3);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);

  const features = tierConfig[tier];

  const handleSetTier = useCallback((newTier: SubscriptionTier) => {
    setTier(newTier);
    setDailySwipesRemaining(tierConfig[newTier].dailySwipes);
    setDailySuperLikesRemaining(tierConfig[newTier].dailySuperLikes);
    setBoosts(tierConfig[newTier].boostsPerMonth);
  }, []);

  const useSwipe = useCallback(() => {
    if (features.unlimitedSwipes || dailySwipesRemaining > 0) {
      if (!features.unlimitedSwipes) setDailySwipesRemaining((p) => p - 1);
      return true;
    }
    return false;
  }, [dailySwipesRemaining, features]);

  const useSuperLike = useCallback(() => {
    if (dailySuperLikesRemaining > 0) {
      setDailySuperLikesRemaining((p) => p - 1);
      return true;
    }
    return false;
  }, [dailySuperLikesRemaining]);

  const useBoost = useCallback(() => {
    if (boosts > 0) {
      setBoosts((p) => p - 1);
      return true;
    }
    return false;
  }, [boosts]);

  const canAccess = useCallback(
    (feature: keyof TierFeatures) => !!features[feature],
    [features]
  );

  const claimDailyReward = useCallback(() => {
    if (!dailyRewardClaimed) {
      setDailyRewardClaimed(true);
      setStreakDays((p) => p + 1);
      // Reward: extra swipes
      setDailySwipesRemaining((p) => p + 5);
    }
  }, [dailyRewardClaimed]);

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        features,
        boosts,
        dailySwipesRemaining,
        dailySuperLikesRemaining,
        setTier: handleSetTier,
        useBoost,
        useSwipe,
        useSuperLike,
        canAccess,
        streakDays,
        dailyRewardClaimed,
        claimDailyReward,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
