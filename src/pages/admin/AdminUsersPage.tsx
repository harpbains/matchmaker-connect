import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter } from "lucide-react";

const users = [
  { id: 1, name: "Priya Mehta", email: "priya@example.com", status: "active", tier: "Pro", location: "NYC", joined: "2024-01-15" },
  { id: 2, name: "Rahul Kumar", email: "rahul@example.com", status: "active", tier: "Free", location: "London", joined: "2024-02-20" },
  { id: 3, name: "Ananya Sharma", email: "ananya@example.com", status: "suspended", tier: "Active", location: "Toronto", joined: "2024-03-05" },
  { id: 4, name: "Vikram Singh", email: "vikram@example.com", status: "active", tier: "Pro", location: "Sydney", joined: "2024-01-28" },
  { id: 5, name: "Meera Patel", email: "meera@example.com", status: "active", tier: "Free", location: "Berlin", joined: "2024-04-10" },
];

const statusColors: Record<string, string> = {
  active: "bg-primary/20 text-primary",
  suspended: "bg-destructive/20 text-destructive",
  banned: "bg-destructive/20 text-destructive",
};

const tierColors: Record<string, string> = {
  Free: "bg-secondary text-secondary-foreground",
  Active: "bg-primary/20 text-primary",
  Pro: "bg-warning/20 text-warning",
};

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and moderate user accounts</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-10 bg-secondary border-border" />
            </div>
            <Button variant="outline" size="sm" className="border-border text-muted-foreground">
              <Filter className="h-4 w-4 mr-1.5" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-secondary/30 cursor-pointer">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[user.status]}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={tierColors[user.tier]}>{user.tier}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.location}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
