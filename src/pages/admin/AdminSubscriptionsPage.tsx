import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { CreditCard, TrendingUp, Users, DollarSign, Crown, Sparkles, Zap } from "lucide-react";

// Mock subscription data
const revenueByMonth = [
  { month: "Sep", revenue: 2400, subscribers: 34 },
  { month: "Oct", revenue: 4100, subscribers: 58 },
  { month: "Nov", revenue: 6800, subscribers: 89 },
  { month: "Dec", revenue: 8200, subscribers: 112 },
  { month: "Jan", revenue: 10500, subscribers: 148 },
  { month: "Feb", revenue: 12300, subscribers: 176 },
];

const planBreakdown = [
  { plan: "Free", users: 842, percentage: 72, color: "hsl(240, 5%, 55%)" },
  { plan: "Active", users: 218, percentage: 19, color: "hsl(160, 84%, 39%)" },
  { plan: "Pro", users: 106, percentage: 9, color: "hsl(38, 92%, 50%)" },
];

const recentTransactions = [
  { id: "1", user: "Priya M.", plan: "Pro", amount: 29.99, date: "2026-02-28", status: "completed" },
  { id: "2", user: "Raj K.", plan: "Active", amount: 14.99, date: "2026-02-27", status: "completed" },
  { id: "3", user: "Anita S.", plan: "Pro", amount: 239.99, date: "2026-02-27", status: "completed" },
  { id: "4", user: "Dev P.", plan: "Active", amount: 119.99, date: "2026-02-26", status: "completed" },
  { id: "5", user: "Meera R.", plan: "Active", amount: 14.99, date: "2026-02-26", status: "refunded" },
  { id: "6", user: "Arjun B.", plan: "Pro", amount: 29.99, date: "2026-02-25", status: "completed" },
];

const stats = [
  { label: "MRR", value: "$12,300", icon: DollarSign, color: "text-primary", change: "+17%" },
  { label: "Active Subscribers", value: "324", icon: Users, color: "text-primary", change: "+19%" },
  { label: "Avg Revenue/User", value: "$37.96", icon: TrendingUp, color: "text-warning", change: "+5%" },
  { label: "Churn Rate", value: "4.2%", icon: CreditCard, color: "text-destructive", change: "-0.8%" },
];

export default function AdminSubscriptionsPage() {
  const [tab, setTab] = useState("overview");

  const planIcon = (plan: string) => {
    if (plan === "Pro") return <Crown className="h-3.5 w-3.5 text-warning" />;
    if (plan === "Active") return <Sparkles className="h-3.5 w-3.5 text-primary" />;
    return <Zap className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">Revenue, plans, and subscriber management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <Badge variant="outline" className={`text-[10px] ${s.change.startsWith("+") ? "text-primary border-primary/30" : "text-destructive border-destructive/30"}`}>
                  {s.change}
                </Badge>
              </div>
              <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-secondary mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Revenue chart */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip contentStyle={{ background: "hsl(240, 12%, 12%)", border: "1px solid hsl(240, 8%, 20%)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subscriber growth */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Subscriber Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 8%, 20%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} />
                    <Tooltip contentStyle={{ background: "hsl(240, 12%, 12%)", border: "1px solid hsl(240, 8%, 20%)", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="subscribers" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ fill: "hsl(38, 92%, 50%)", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Plan breakdown */}
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Plan Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {planBreakdown.map((plan) => (
                    <div key={plan.plan} className="flex items-center gap-4">
                      <div className="w-20 flex items-center gap-2">
                        {planIcon(plan.plan)}
                        <span className="text-sm font-medium text-foreground">{plan.plan}</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${plan.percentage}%`, background: plan.color }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-foreground font-medium w-16 text-right">{plan.users}</span>
                      <span className="text-xs text-muted-foreground w-10 text-right">{plan.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id} className="border-border">
                      <TableCell className="text-sm font-medium text-foreground">{tx.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs gap-1">
                          {planIcon(tx.plan)}
                          {tx.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">${tx.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${tx.status === "completed" ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
