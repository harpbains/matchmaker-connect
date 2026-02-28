import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Bell,
  FileText,
  Megaphone,
  Save,
  Plus,
  Trash2,
  Edit2,
  Send,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  body: string;
  active: boolean;
  createdAt: string;
  type: "banner" | "modal" | "push";
}

interface AppCopy {
  id: string;
  key: string;
  value: string;
  section: string;
}

const mockAnnouncements: Announcement[] = [
  { id: "1", title: "Welcome to DesiConnect!", body: "Find your perfect match from the global desi community.", active: true, createdAt: "2026-02-20", type: "banner" },
  { id: "2", title: "Profile Verification", body: "Get verified to increase your match rate by 40%.", active: true, createdAt: "2026-02-15", type: "modal" },
  { id: "3", title: "Valentine's Special", body: "Enjoy 50% off Pro plans this week!", active: false, createdAt: "2026-02-10", type: "push" },
];

const mockCopy: AppCopy[] = [
  { id: "1", key: "onboarding.welcome_title", value: "Welcome to DesiConnect", section: "Onboarding" },
  { id: "2", key: "onboarding.welcome_subtitle", value: "Find meaningful connections in the global desi community", section: "Onboarding" },
  { id: "3", key: "discovery.empty_state", value: "No more profiles nearby. Try expanding your filters!", section: "Discovery" },
  { id: "4", key: "match.congrats_title", value: "It's a Match!", section: "Matching" },
  { id: "5", key: "match.congrats_body", value: "You and {name} liked each other", section: "Matching" },
  { id: "6", key: "subscription.upgrade_cta", value: "Unlock unlimited swipes", section: "Subscription" },
  { id: "7", key: "profile.completion_prompt", value: "Complete your profile to get 3x more matches", section: "Profile" },
];

export default function AdminContentPage() {
  const [tab, setTab] = useState("announcements");
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [copy, setCopy] = useState(mockCopy);
  const [editingCopy, setEditingCopy] = useState<string | null>(null);

  const toggleAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    toast({ title: "Announcement updated" });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Announcement deleted" });
  };

  const updateCopyValue = (id: string, value: string) => {
    setCopy((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
  };

  const saveCopy = () => {
    setEditingCopy(null);
    toast({ title: "✅ App copy saved", description: "Changes will apply on next app load" });
  };

  const typeColor = (type: string) => {
    if (type === "banner") return "bg-primary/20 text-primary";
    if (type === "modal") return "bg-warning/20 text-warning";
    return "bg-secondary text-secondary-foreground";
  };

  const copySections = [...new Set(copy.map((c) => c.section))];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Content Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage announcements, notifications, and app copy</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-secondary mb-4">
          <TabsTrigger value="announcements" className="gap-1.5">
            <Megaphone className="h-3.5 w-3.5" /> Announcements
          </TabsTrigger>
          <TabsTrigger value="copy" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" /> App Copy
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" /> Push Templates
          </TabsTrigger>
        </TabsList>

        {/* Announcements */}
        <TabsContent value="announcements">
          <div className="space-y-3">
            {announcements.map((ann) => (
              <Card key={ann.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-foreground">{ann.title}</h3>
                        <Badge className={`text-[10px] ${typeColor(ann.type)}`}>{ann.type}</Badge>
                        {ann.active && <Badge className="bg-primary/20 text-primary text-[10px]">Live</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{ann.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Created {new Date(ann.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={ann.active} onCheckedChange={() => toggleAnnouncement(ann.id)} />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteAnnouncement(ann.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full border-dashed">
              <Plus className="h-4 w-4 mr-1" /> Add Announcement
            </Button>
          </div>
        </TabsContent>

        {/* App Copy */}
        <TabsContent value="copy">
          <div className="space-y-6">
            {copySections.map((section) => (
              <Card key={section} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">{section}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {copy
                    .filter((c) => c.section === section)
                    .map((item, idx, arr) => (
                      <div key={item.id}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <Badge variant="outline" className="text-[10px] text-muted-foreground mb-1.5">{item.key}</Badge>
                            {editingCopy === item.id ? (
                              <div className="flex gap-2">
                                <Input
                                  value={item.value}
                                  onChange={(e) => updateCopyValue(item.id, e.target.value)}
                                  className="bg-secondary border-border text-sm"
                                />
                                <Button size="sm" onClick={saveCopy}>
                                  <Save className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <p className="text-sm text-foreground">{item.value}</p>
                            )}
                          </div>
                          {editingCopy !== item.id && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingCopy(item.id)}>
                              <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          )}
                        </div>
                        {idx < arr.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Push Notifications Templates */}
        <TabsContent value="notifications">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base font-display">Push Notification Templates</CardTitle>
              <CardDescription>Pre-configured templates for automated notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "New Match", body: "You matched with {name}! Say hi 👋", enabled: true },
                { name: "New Message", body: "{name} sent you a message", enabled: true },
                { name: "Profile Like", body: "Someone liked your profile! Upgrade to see who", enabled: true },
                { name: "Daily Reminder", body: "New profiles are waiting for you on DesiConnect", enabled: false },
                { name: "Streak Reminder", body: "Don't lose your {days}-day streak! Open DesiConnect", enabled: false },
                { name: "Boost Expiring", body: "Your profile boost is ending soon. Make the most of it!", enabled: true },
              ].map((tmpl, idx, arr) => (
                <div key={tmpl.name}>
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Send className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{tmpl.name}</p>
                      <p className="text-xs text-muted-foreground">{tmpl.body}</p>
                    </div>
                    <Switch checked={tmpl.enabled} />
                  </div>
                  {idx < arr.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
