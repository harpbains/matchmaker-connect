import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldX, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UnverifiedProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  photos: string[] | null;
  profession: string | null;
  religion: string | null;
  created_at: string;
}

export default function AdminModerationPage() {
  const [profiles, setProfiles] = useState<UnverifiedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<UnverifiedProfile | null>(null);

  const fetchUnverified = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, first_name, last_name, gender, city, country, bio, photos, profession, religion, created_at")
      .eq("is_verified", false)
      .eq("onboarding_completed", true)
      .order("created_at", { ascending: true })
      .limit(50);

    if (!error && data) setProfiles(data);
    setLoading(false);
  };

  useEffect(() => { fetchUnverified(); }, []);

  const handleVerify = async (userId: string) => {
    const { error } = await supabase.rpc("admin_toggle_verify", { p_user_id: userId });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profile verified" });
    setSelected(null);
    fetchUnverified();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Moderation Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {profiles.length} profiles awaiting review
        </p>
      </div>

      {profiles.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShieldCheck className="h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground text-sm">All caught up! No profiles to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <Card key={p.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{p.gender || "—"} · {[p.city, p.country].filter(Boolean).join(", ") || "—"}</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-warning border-warning/30">Pending</Badge>
                </div>

                {p.photos && p.photos.length > 0 && (
                  <div className="flex gap-1 mb-3 overflow-hidden rounded-lg">
                    {p.photos.slice(0, 3).map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt=""
                        className="h-20 w-20 object-cover rounded"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.bio || "No bio"}</p>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handleVerify(p.user_id)}>
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelected(p)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">
                  {selected.first_name} {selected.last_name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="text-muted-foreground">Gender:</span> <span className="capitalize">{selected.gender || "—"}</span></div>
                  <div><span className="text-muted-foreground">Location:</span> {[selected.city, selected.country].filter(Boolean).join(", ") || "—"}</div>
                  <div><span className="text-muted-foreground">Religion:</span> {selected.religion || "—"}</div>
                  <div><span className="text-muted-foreground">Profession:</span> {selected.profession || "—"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Bio:</span>
                  <p className="mt-1 text-foreground">{selected.bio || "No bio provided"}</p>
                </div>
                {selected.photos && selected.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {selected.photos.map((photo, i) => (
                      <img key={i} src={photo} alt="" className="rounded-lg w-full h-32 object-cover" />
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={() => handleVerify(selected.user_id)}>
                    <ShieldCheck className="h-4 w-4 mr-1" /> Approve
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
