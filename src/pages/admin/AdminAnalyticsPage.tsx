import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from "recharts";
import { TrendingUp, Users, Heart, MessageCircle, Zap } from "lucide-react";

const COLORS = [
  "hsl(160, 84%, 39%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)",
  "hsl(200, 70%, 50%)", "hsl(280, 60%, 50%)", "hsl(60, 70%, 45%)",
  "hsl(320, 60%, 50%)", "hsl(100, 60%, 40%)",
];

const tooltipStyle = {
  background: "hsl(240, 12%, 12%)",
  border: "1px solid hsl(240, 8%, 20%)",
  borderRadius: 8,
  fontSize: 12,
};

interface Stats {
  gender_stats: Record<string, number> | null;
  country_stats: Record<string, number> | null;
  religion_stats: Record<string, number> | null;
  total_users: number;
  verified_users: number;
  onboarded_users: number;
}

// Mock engagement data
const engagementData = [
  { day: "Mon", swipes: 1420, matches: 89, messages: 342 },
  { day: "Tue", swipes: 1680, matches: 112, messages: 418 },
  { day: "Wed", swipes: 1540, matches: 96, messages: 380 },
  { day: "Thu", swipes: 1890, matches: 134, messages: 502 },
  { day: "Fri", swipes: 2240, matches: 156, messages: 628 },
  { day: "Sat", swipes: 2680, matches: 198, messages: 756 },
  { day: "Sun", swipes: 2420, matches: 178, messages: 694 },
];

const retentionData = [
  { week: "W1", retention: 100 },
  { week: "W2", retention: 72 },
  { week: "W3", retention: 58 },
  { week: "W4", retention: 48 },
  { week: "W5", retention: 42 },
  { week: "W6", retention: 38 },
  { week: "W7", retention: 35 },
  { week: "W8", retention: 33 },
];

const matchRateByAge = [
  { age: "18-24", rate: 12 },
  { age: "25-29", rate: 18 },
  { age: "30-34", rate: 22 },
  { age: "35-39", rate: 16 },
  { age: "40-44", rate: 10 },
  { age: "45+", rate: 6 },
];

const engagementStats = [
  { label: "Avg. Session", value: "8.4 min", icon: Zap, color: "text-primary" },
  { label: "Match Rate", value: "14.2%", icon: Heart, color: "text-warning" },
  { label: "Msg/Match", value: "6.8", icon: MessageCircle, color: "text-primary" },
  { label: "DAU/MAU", value: "32%", icon: Users, color: "text-primary" },
];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("demographics");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.rpc("admin_get_dashboard_stats");
      if (data) setStats(data as unknown as Stats);
      setLoading(false);
    };
    fetchData();
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
        <p className="text-sm text-muted-foreground mt-1">Deep insights into user behavior and demographics</p>
      </div>

      {/* Engagement stats bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {engagementStats.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4">
              <s.icon className={`h-4 w-4 ${s.color} mb-2`} />
              <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-secondary mb-4">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        {/* Demographics */}
        <TabsContent value="demographics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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
                        <Tooltip contentStyle={tooltipStyle} />
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
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" fill="hsl(38, 92%, 50%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement */}
        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="swipes" fill="hsl(160, 84%, 39%)" radius={[2, 2, 0, 0]} name="Swipes" />
                    <Bar dataKey="messages" fill="hsl(200, 70%, 50%)" radius={[2, 2, 0, 0]} name="Messages" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Matches by Day</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={engagementData}>
                    <defs>
                      <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="matches" stroke="hsl(38, 92%, 50%)" fill="url(#matchGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Match Rate by Age Group</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={matchRateByAge}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                    <XAxis dataKey="age" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Match Rate"]} />
                    <Bar dataKey="rate" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Retention */}
        <TabsContent value="retention">
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">User Retention Cohort</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Retained"]} />
                    <Line type="monotone" dataKey="retention" stroke="hsl(160, 84%, 39%)" strokeWidth={3} dot={{ fill: "hsl(160, 84%, 39%)", r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-5 text-center">
                  <p className="text-3xl font-display font-bold text-foreground">72%</p>
                  <p className="text-xs text-muted-foreground mt-1">Week 2 Retention</p>
                  <p className="text-[10px] text-primary mt-0.5">↑ 4% vs last cohort</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-5 text-center">
                  <p className="text-3xl font-display font-bold text-foreground">33%</p>
                  <p className="text-xs text-muted-foreground mt-1">Week 8 Retention</p>
                  <p className="text-[10px] text-warning mt-0.5">→ Stable</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-5 text-center">
                  <p className="text-3xl font-display font-bold text-foreground">4.2%</p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly Churn</p>
                  <p className="text-[10px] text-primary mt-0.5">↓ 0.8% improvement</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
