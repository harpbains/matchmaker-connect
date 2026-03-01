import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Pause,
  Eye,
  EyeOff,
  MapPin,
  Plane,
  Shield,
  Trash2,
  AlertTriangle,
  Crown,
} from "lucide-react";

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { tier } = useSubscription();
  const { toast } = useToast();

  const [profilePaused, setProfilePaused] = useState(false);
  const [hideFromDiscovery, setHideFromDiscovery] = useState(false);
  const [travelMode, setTravelMode] = useState(false);
  const [travelCity, setTravelCity] = useState("London, UK");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const isPremium = tier === "active" || tier === "pro";

  const handlePause = (checked: boolean) => {
    setProfilePaused(checked);
    toast({
      title: checked ? "Profile paused" : "Profile active",
      description: checked
        ? "You won't appear in discovery. Existing matches can still message you."
        : "You're back in the discovery feed!",
    });
  };

  const handleTravelMode = (checked: boolean) => {
    if (!isPremium) {
      toast({
        title: "Premium feature",
        description: "Upgrade to Active or Pro to use Travel Mode",
        variant: "destructive",
      });
      return;
    }
    setTravelMode(checked);
    toast({
      title: checked ? "Travel Mode on" : "Travel Mode off",
      description: checked
        ? `You'll now appear in ${travelCity} discovery feed`
        : "Showing in your home location again",
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm.toLowerCase() !== "delete") return;
    toast({ title: "Account scheduled for deletion" });
    setDeleteDialogOpen(false);
    signOut();
    navigate("/auth/login");
  };

  return (
    <div className="px-4 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-display font-bold text-foreground">Account Settings</h1>
      </div>

      {/* Discovery Controls */}
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 px-1">
        Discovery
      </p>
      <Card className="bg-card border-border mb-5">
        <CardContent className="p-0 divide-y divide-border">
          {/* Pause Profile */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-warning/20 flex items-center justify-center">
                <Pause className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Pause Profile</p>
                <p className="text-xs text-muted-foreground">Hide from everyone temporarily</p>
              </div>
            </div>
            <Switch checked={profilePaused} onCheckedChange={handlePause} />
          </div>

          {/* Hide from Discovery */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center">
                {hideFromDiscovery ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Hide from Discovery</p>
                <p className="text-xs text-muted-foreground">Only visible to your matches</p>
              </div>
            </div>
            <Switch checked={hideFromDiscovery} onCheckedChange={setHideFromDiscovery} />
          </div>

          {/* Travel Mode */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center">
                <Plane className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">Travel Mode</p>
                  {!isPremium && (
                    <Badge variant="outline" className="text-[10px] border-warning/30 text-warning">
                      <Crown className="h-2.5 w-2.5 mr-0.5" /> Premium
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {travelMode ? `Discovering in ${travelCity}` : "Discover profiles in another city"}
                </p>
              </div>
            </div>
            <Switch checked={travelMode} onCheckedChange={handleTravelMode} />
          </div>

          {/* Travel City Selector (visible when travel mode on) */}
          {travelMode && isPremium && (
            <div className="p-4 bg-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">Travel destination</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["London, UK", "New York, US", "Toronto, CA", "Mumbai, IN", "Sydney, AU", "Dubai, AE"].map(
                  (city) => (
                    <Button
                      key={city}
                      variant={travelCity === city ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        setTravelCity(city);
                        toast({ title: `Now discovering in ${city}` });
                      }}
                    >
                      {city}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy & Safety */}
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 px-1">
        Privacy & Safety
      </p>
      <Card className="bg-card border-border mb-5">
        <CardContent className="p-0 divide-y divide-border">
          <button
            className="flex items-center gap-3 p-4 w-full text-left hover:bg-secondary/30 transition-colors"
            onClick={() => navigate("/blocked-users")}
          >
            <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Blocked Users</p>
              <p className="text-xs text-muted-foreground">Manage your block list</p>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Profile Recycling Info */}
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 px-1">
        Profile Activity
      </p>
      <Card className="bg-card border-border mb-5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Profile Recycling</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Profiles inactive for 30+ days are moved to the back of the discovery queue.
                Stay active to remain visible! Last active: <span className="text-foreground">Today</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      {/* Danger Zone */}
      <p className="text-xs text-destructive font-medium uppercase tracking-wider mb-3 px-1">
        Danger Zone
      </p>
      <Button
        variant="outline"
        className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Account
      </Button>
      <p className="text-[10px] text-muted-foreground text-center mt-2">
        This action cannot be undone. All your data will be permanently deleted.
      </p>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-destructive font-display flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Delete Account
            </DialogTitle>
            <DialogDescription>
              This will permanently delete your profile, matches, messages, and all data.
              Type <span className="text-foreground font-medium">"delete"</span> to confirm.
            </DialogDescription>
          </DialogHeader>
          <input
            className="w-full p-3 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground"
            placeholder='Type "delete" to confirm'
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={deleteConfirm.toLowerCase() !== "delete"}
              onClick={handleDeleteAccount}
            >
              Delete Forever
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
