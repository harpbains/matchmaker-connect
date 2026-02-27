import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserPlus, CalendarDays, ShieldCheck, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

interface DashboardStats {
  total_users: number;
  verified_users: number;
  onboarded_users: number;
  users_today: number;
  users_this_week: number;
  users_this_month: number;
  gender_stats: Record<string, number> | null;
  country_stats: Record<string, number> | null;
  religion_stats: Record<string, number> | null;
  signups_by_day: { date: string; count: number }[] | null;
}

const COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(60, 70%, 45%)",
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.rpc("admin_get_dashboard_stats");
      if (!error && data) setStats(data as unknown as DashboardStats);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.total_users, icon: Users, color: "text-primary" },
        { label: "Verified", value: stats.verified_users, icon: ShieldCheck, color: "text-primary" },
        { label: "Onboarded", value: stats.onboarded_users, icon: UserCheck, color: "text-online" },
        { label: "Today", value: stats.users_today, icon: CalendarDays, color: "text-warning" },
        { label: "This Week", value: stats.users_this_week, icon: UserPlus, color: "text-primary" },
        { label: "This Month", value: stats.users_this_month, icon: Globe, color: "text-destructive" },
      ]
    : [];

  const genderData = stats?.gender_stats
    ? Object.entries(stats.gender_stats).map(([name, value]) => ({ name, value }))
    : [];

  const countryData = stats?.country_stats
    ? Object.entries(stats.country_stats).map(([name, value]) => ({ name, value }))
    : [];

  const signupData = stats?.signups_by_day || [];

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
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Live overview of DesiConnect</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Signup trend */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Signups (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signupData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={signupData}>
                  <defs>
                    <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }}
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(240, 12%, 12%)", border: "1px solid hsl(240, 8%, 20%)", borderRadius: 8, fontSize: 12 }}
                    labelFormatter={(v) => new Date(v).toLocaleDateString()}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(160, 84%, 39%)" fill="url(#signupGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No signup data yet</div>
            )}
          </CardContent>
        </Card>

        {/* Gender split */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {genderData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                      {genderData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(240, 12%, 12%)", border: "1px solid hsl(240, 8%, 20%)", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {genderData.map((g, i) => (
                    <div key={g.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-foreground capitalize">{g.name}</span>
                      <span className="text-muted-foreground ml-auto">{g.value}</span>
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

      {/* Country distribution */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          {countryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={countryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} width={100} />
                <Tooltip contentStyle={{ background: "hsl(240, 12%, 12%)", border: "1px solid hsl(240, 8%, 20%)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No country data yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
