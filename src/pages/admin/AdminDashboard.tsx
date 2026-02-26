import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, MessageCircle, TrendingUp, DollarSign, UserCheck } from "lucide-react";

const stats = [
  { label: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "text-primary" },
  { label: "Active Today", value: "3,291", change: "+8%", icon: UserCheck, color: "text-online" },
  { label: "Matches Today", value: "847", change: "+15%", icon: Heart, color: "text-destructive" },
  { label: "Messages", value: "24.3K", change: "+22%", icon: MessageCircle, color: "text-primary" },
  { label: "Revenue (MTD)", value: "€43,290", change: "+18%", icon: DollarSign, color: "text-warning" },
  { label: "Conversion Rate", value: "4.2%", change: "+0.3%", icon: TrendingUp, color: "text-primary" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of DesiConnect Global</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
              <Badge variant="secondary" className="mt-1 text-xs text-primary">
                {stat.change} this month
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              Chart placeholder — will use Recharts
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gender Ratio by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              Chart placeholder — will use Recharts
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
