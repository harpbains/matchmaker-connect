import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Sliders,
  Heart,
  Star,
  Zap,
  Globe,
  ShieldCheck,
  MessageCircle,
  Eye,
  Save,
  RotateCcw,
} from "lucide-react";

interface FeatureVariable {
  id: string;
  label: string;
  description: string;
  icon: typeof Heart;
  type: "toggle" | "number" | "slider" | "select";
  value: any;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  category: string;
}

const defaultFeatures: FeatureVariable[] = [
  // Discovery
  { id: "discovery_enabled", label: "Discovery Feed", description: "Enable/disable the main swiping feed", icon: Heart, type: "toggle", value: true, category: "Discovery" },
  { id: "free_daily_swipes", label: "Free Daily Swipes", description: "Number of daily swipes for free users", icon: Heart, type: "slider", value: 25, min: 5, max: 100, category: "Discovery" },
  { id: "free_super_likes", label: "Free Super Likes", description: "Daily super likes for free users", icon: Star, type: "number", value: 1, category: "Discovery" },
  { id: "match_algorithm", label: "Match Algorithm", description: "Matching algorithm variant", icon: Zap, type: "select", value: "compatibility", options: [
    { label: "Compatibility Score", value: "compatibility" },
    { label: "Location Priority", value: "location" },
    { label: "Activity Based", value: "activity" },
    { label: "Random", value: "random" },
  ], category: "Discovery" },
  { id: "show_online_status", label: "Show Online Status", description: "Display online indicators on profiles", icon: Eye, type: "toggle", value: true, category: "Discovery" },

  // Matrimony
  { id: "matrimony_mode", label: "Matrimony Mode", description: "Enable serious intent filtering mode", icon: ShieldCheck, type: "toggle", value: true, category: "Matrimony" },
  { id: "min_profile_completion", label: "Min Profile Completion", description: "Minimum % profile completion to appear in discovery", icon: ShieldCheck, type: "slider", value: 60, min: 0, max: 100, category: "Matrimony" },

  // Messaging
  { id: "messaging_enabled", label: "Messaging", description: "Enable in-app messaging", icon: MessageCircle, type: "toggle", value: true, category: "Messaging" },
  { id: "read_receipts_free", label: "Read Receipts (Free)", description: "Allow free users to see read receipts", icon: MessageCircle, type: "toggle", value: false, category: "Messaging" },
  { id: "max_message_length", label: "Max Message Length", description: "Maximum characters per message", icon: MessageCircle, type: "number", value: 500, category: "Messaging" },

  // Verification
  { id: "auto_verify", label: "Auto-Verify New Users", description: "Skip manual moderation queue", icon: ShieldCheck, type: "toggle", value: false, category: "Verification" },
  { id: "photo_required", label: "Photo Required", description: "Require at least one photo to use the app", icon: Eye, type: "toggle", value: true, category: "Verification" },

  // Geo
  { id: "travel_mode", label: "Travel Mode", description: "Allow premium users to change location", icon: Globe, type: "toggle", value: true, category: "Geo" },
  { id: "max_distance_km", label: "Max Discovery Distance", description: "Maximum distance filter value in km", icon: Globe, type: "slider", value: 500, min: 10, max: 2000, category: "Geo" },
];

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<FeatureVariable[]>(defaultFeatures);
  const [hasChanges, setHasChanges] = useState(false);

  const updateFeature = (id: string, value: any) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    toast({ title: "✅ Feature variables saved", description: "Changes are live across the app" });
  };

  const handleReset = () => {
    setFeatures(defaultFeatures);
    setHasChanges(false);
    toast({ title: "Variables reset to defaults" });
  };

  const categories = [...new Set(features.map((f) => f.category))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Feature Variables</h1>
          <p className="text-sm text-muted-foreground mt-1">Control app behavior without deploying code</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-1" /> Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm text-warning flex items-center gap-2">
          <Sliders className="h-4 w-4" />
          You have unsaved changes
        </div>
      )}

      <div className="space-y-6">
        {categories.map((cat) => (
          <Card key={cat} className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">{cat}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {features
                .filter((f) => f.category === cat)
                .map((feature, idx, arr) => (
                  <div key={feature.id}>
                    <div className="flex items-start gap-4">
                      <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <feature.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-foreground">{feature.label}</span>
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            {feature.id}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                      <div className="flex-shrink-0 w-48">
                        {feature.type === "toggle" && (
                          <Switch
                            checked={feature.value}
                            onCheckedChange={(v) => updateFeature(feature.id, v)}
                          />
                        )}
                        {feature.type === "number" && (
                          <Input
                            type="number"
                            value={feature.value}
                            onChange={(e) => updateFeature(feature.id, parseInt(e.target.value) || 0)}
                            className="h-8 bg-secondary border-border w-24"
                          />
                        )}
                        {feature.type === "slider" && (
                          <div className="flex items-center gap-3">
                            <Slider
                              value={[feature.value]}
                              min={feature.min}
                              max={feature.max}
                              step={1}
                              onValueChange={([v]) => updateFeature(feature.id, v)}
                              className="flex-1"
                            />
                            <span className="text-xs text-foreground font-medium w-10 text-right">
                              {feature.value}
                            </span>
                          </div>
                        )}
                        {feature.type === "select" && (
                          <Select
                            value={feature.value}
                            onValueChange={(v) => updateFeature(feature.id, v)}
                          >
                            <SelectTrigger className="h-8 bg-secondary border-border text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {feature.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                    {idx < arr.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
