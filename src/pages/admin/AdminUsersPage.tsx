import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  city: string | null;
  country: string | null;
  religion: string | null;
  profession: string | null;
  is_verified: boolean;
  onboarding_completed: boolean;
  photos: string[] | null;
  date_of_birth: string | null;
  created_at: string;
}

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_profiles", {
      p_search: search,
      p_limit: PAGE_SIZE,
      p_offset: page * PAGE_SIZE,
      p_gender: genderFilter === "all" ? null : genderFilter,
      p_verified: verifiedFilter === "all" ? null : verifiedFilter === "yes",
    });

    if (!error && data) {
      const parsed = data as unknown as { total: number; profiles: Profile[] };
      setProfiles(parsed.profiles);
      setTotal(parsed.total);
    }
    setLoading(false);
  }, [search, page, genderFilter, verifiedFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleVerify = async (userId: string) => {
    const { data, error } = await supabase.rpc("admin_toggle_verify", { p_user_id: userId });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: data ? "User verified" : "Verification removed" });
    fetchUsers();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} total users</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or city..."
                className="pl-10 bg-secondary border-border"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              />
            </div>
            <Select value={genderFilter} onValueChange={(v) => { setGenderFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[130px] bg-secondary border-border">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={(v) => { setVerifiedFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[130px] bg-secondary border-border">
                <SelectValue placeholder="Verified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Verified</SelectItem>
                <SelectItem value="no">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">No users found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>User</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p) => (
                    <TableRow key={p.id} className="border-border">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {p.first_name} {p.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{p.profession || "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">{p.gender || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {[p.city, p.country].filter(Boolean).join(", ") || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {p.is_verified && <Badge className="bg-primary/20 text-primary text-xs">Verified</Badge>}
                          {p.onboarding_completed ? (
                            <Badge className="bg-secondary text-secondary-foreground text-xs">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">Incomplete</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVerify(p.user_id)}
                          className={p.is_verified ? "text-muted-foreground" : "text-primary"}
                        >
                          <ShieldCheck className="h-4 w-4 mr-1" />
                          {p.is_verified ? "Unverify" : "Verify"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
