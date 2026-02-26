import { Heart, X, Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const onlineUsers = [
  { name: "Priya", age: 27 },
  { name: "Ananya", age: 25 },
  { name: "Meera", age: 29 },
  { name: "Kavya", age: 24 },
  { name: "Riya", age: 26 },
];

const currentProfile = {
  name: "Ananya Sharma",
  age: 25,
  location: "London, UK",
  bio: "Software engineer who loves hiking and cooking Indian food. Looking for someone who shares my love for travel and chai ☕",
  tags: ["Hindu", "Gujarati", "Vegetarian", "Casual Dating"],
  compatibility: 87,
};

export default function DiscoverPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-foreground">Discover</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary text-xs">
            Casual
          </Badge>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Online Now */}
      <div className="px-4 py-2">
        <p className="text-xs text-muted-foreground mb-2">Online Now</p>
        <ScrollArea className="w-full">
          <div className="flex gap-3">
            {onlineUsers.map((user) => (
              <div key={user.name} className="flex flex-col items-center gap-1">
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-primary">
                    <AvatarFallback className="bg-secondary text-foreground font-medium text-sm">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-online border-2 border-card" />
                </div>
                <span className="text-[10px] text-muted-foreground">{user.name}</span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Profile Card */}
      <div className="flex-1 px-4 py-2">
        <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-gradient-to-b from-secondary to-card border border-border">
          {/* Photo placeholder */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

          {/* Compatibility badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground font-bold">
              {currentProfile.compatibility}% Match
            </Badge>
          </div>

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
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]"
        >
          <Heart className="h-7 w-7" fill="currentColor" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-14 w-14 rounded-full border-warning/30 text-warning hover:bg-warning/10"
        >
          <Star className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
