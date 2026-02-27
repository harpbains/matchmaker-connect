import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(60, 70%, 45%)",
  "hsl(320, 60%, 50%)",
  "hsl(100, 60%, 40%)",
];

interface Stats {
  gender_stats: Record<string, number> | null;
  country_stats: Record<string, number> | null;
  religion_stats: Record<string, number> | null;
  total_users: number;
  verified_users: number;
  onboarded_users: number;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.rpc("admin_get_dashboard_stats");
      if (data) setStats(data as unknown as Stats);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const religionData = stats?.religion_stats
    ? Object.entries(stats.religion_stats).map(([name, value]) => ({ name, value }))
    : [];

  const countryData = stats?.country_stats
    ? Object.entries(stats.country_stats).map(([name, value]) => ({ name, value }))
    : [];

  const funnelData = stats
    ? [
        { stage: "Signed Up", value: stats.total_users },
        { stage: "Onboarded", value: stats.onboarded_users },
        { stage: "Verified", value: stats.verified_users },
      ]
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deeper insights into user demographics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Funnel */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">User Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(240, 12%, 12%)", border: "1px solid hsl(240, 8%, 20%)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Religion */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Religion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {religionData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={religionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {religionData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(240, 12%, 12%)", border: "1px solid hsl(240, 8%, 20%)", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5">
                  {religionData.map((r, i) => (
                    <div key={r.name} className="flex items-center gap-2 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-foreground">{r.name}</span>
                      <span className="text-muted-foreground ml-auto">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Countries */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Users by Country</CardTitle>
        </CardHeader>
        <CardContent>
          {countryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} width={100} />
                <Tooltip contentStyle={{ background: "hsl(240, 12%, 12%)", border: "1px solid hsl(240, 8%, 20%)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(38, 92%, 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
