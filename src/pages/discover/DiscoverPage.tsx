import { useState, useCallback } from "react";
import { Heart, X, Star, SlidersHorizontal, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { mockProfiles } from "@/data/mockProfiles";
import FiltersModal from "@/components/discover/FiltersModal";
import MatchModal from "@/components/discover/MatchModal";
import DailyRewardBanner from "@/components/subscription/DailyRewardBanner";
import SwipeLimitBanner from "@/components/subscription/SwipeLimitBanner";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

const onlineUsers = mockProfiles.filter((p) => p.online);

export default function DiscoverPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(mockProfiles[0]);
  const [isMatrimony, setIsMatrimony] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { useSwipe, useSuperLike } = useSubscription();

  const currentProfile = mockProfiles[currentIndex % mockProfiles.length];

  const nextProfile = useCallback(() => {
    setSwipeDirection(null);
    setCurrentIndex((prev) => (prev + 1) % mockProfiles.length);
  }, []);

  const handleLike = () => {
    if (!useSwipe()) {
      toast({ title: "No swipes left!", description: "Upgrade for more daily swipes", variant: "destructive" });
      return;
    }
    setSwipeDirection("right");
    if (Math.random() < 0.3) {
      setMatchedProfile(currentProfile);
      setTimeout(() => setMatchModalOpen(true), 300);
    } else {
      toast({ title: "💚 Liked!", description: `You liked ${currentProfile.name}` });
    }
    setTimeout(nextProfile, 400);
  };

  const handlePass = () => {
    if (!useSwipe()) {
      toast({ title: "No swipes left!", description: "Upgrade for more daily swipes", variant: "destructive" });
      return;
    }
    setSwipeDirection("left");
    setTimeout(nextProfile, 400);
  };

  const handleSuperLike = () => {
    if (!useSuperLike()) {
      toast({ title: "No super likes left!", description: "Upgrade for more", variant: "destructive" });
      return;
    }
    setSwipeDirection("up");
    toast({ title: "⭐ Super Liked!", description: `You super liked ${currentProfile.name}` });
    setTimeout(nextProfile, 400);
  };

  const initials = (name: string) => name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">Discover</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Matrimony</span>
            <Switch
              checked={isMatrimony}
              onCheckedChange={setIsMatrimony}
              className="scale-75"
            />
          </div>
          <Badge variant="outline" className="border-primary text-primary text-xs">
            {isMatrimony ? "Serious" : "Casual"}
          </Badge>
          <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Daily Reward & Swipe Limit */}
      <DailyRewardBanner />
      <SwipeLimitBanner />

      {/* Online Now */}
      <div className="px-4 py-2">
        <p className="text-xs text-muted-foreground mb-2">Online Now</p>
        <ScrollArea className="w-full">
          <div className="flex gap-3">
            {onlineUsers.map((user) => (
              <button
                key={user.id}
                className="flex flex-col items-center gap-1"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-primary">
                    <AvatarFallback className="bg-secondary text-foreground font-medium text-sm">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-online border-2 border-card" />
                </div>
                <span className="text-[10px] text-muted-foreground">{user.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Profile Card */}
      <div className="flex-1 px-4 py-2">
        <div
          className={`relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-b from-secondary to-card border border-border cursor-pointer transition-all duration-300 ${
            swipeDirection === "left" ? "-translate-x-full opacity-0 rotate-[-15deg]" :
            swipeDirection === "right" ? "translate-x-full opacity-0 rotate-[15deg]" :
            swipeDirection === "up" ? "-translate-y-full opacity-0 scale-90" :
            ""
          }`}
          onClick={() => navigate(`/profile/${currentProfile.id}`)}
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

          {/* Avatar placeholder in center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="text-8xl font-display font-bold text-foreground">{initials(currentProfile.name)}</span>
          </div>

          {/* Compatibility badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground font-bold">
              {currentProfile.compatibility}% Match
            </Badge>
          </div>

          {/* Verified badge */}
          {currentProfile.verified && (
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="border-primary/50 text-primary gap-1">
                <CheckCircle className="h-3 w-3" /> Verified
              </Badge>
            </div>
          )}

          {/* Profile info */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {currentProfile.name}, {currentProfile.age}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">📍 {currentProfile.location}</p>
            <p className="text-sm text-foreground/80 mt-2 line-clamp-2">{currentProfile.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {currentProfile.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-secondary/80 text-secondary-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 px-4 py-4">
        <Button
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={handlePass}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]"
          onClick={handleLike}
        >
          <Heart className="h-7 w-7" fill="currentColor" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full border-warning/30 text-warning hover:bg-warning/10"
          onClick={handleSuperLike}
        >
          <Star className="h-6 w-6" />
        </Button>
      </div>

      {/* Filters Modal */}
      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} />

      {/* Match Modal */}
      <MatchModal
        open={matchModalOpen}
        onOpenChange={setMatchModalOpen}
        profile={matchedProfile}
        onSendMessage={() => {
          setMatchModalOpen(false);
          navigate("/messages");
        }}
        onKeepBrowsing={() => setMatchModalOpen(false)}
      />
    </div>
  );
}
