import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";
import type { MockProfile } from "@/data/mockProfiles";

interface MatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: MockProfile | null;
  onSendMessage: () => void;
  onKeepBrowsing: () => void;
}

export default function MatchModal({ open, onOpenChange, profile, onSendMessage, onKeepBrowsing }: MatchModalProps) {
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-xs mx-auto text-center p-8">
        <div className="flex flex-col items-center gap-4">
          {/* Hearts animation placeholder */}
          <div className="relative">
            <Heart className="h-12 w-12 text-primary animate-pulse" fill="currentColor" />
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground">
            It's a Match!
          </h2>
          <p className="text-sm text-muted-foreground">
            You and {profile.name} liked each other
          </p>

          {/* Avatars */}
          <div className="flex items-center gap-4 my-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarFallback className="bg-primary/20 text-primary font-display font-bold text-xl">
                R
              </AvatarFallback>
            </Avatar>
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarFallback className="bg-secondary text-foreground font-display font-bold text-xl">
                {profile.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col gap-2 w-full mt-2">
            <Button
              className="w-full bg-primary text-primary-foreground"
              onClick={onSendMessage}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send a Message
            </Button>
            <Button
              variant="outline"
              className="w-full border-border text-muted-foreground"
              onClick={onKeepBrowsing}
            >
              Keep Browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
