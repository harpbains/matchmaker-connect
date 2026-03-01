import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserX, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlockedUser {
  id: string;
  name: string;
  blockedAt: string;
}

const mockBlocked: BlockedUser[] = [
  { id: "b1", name: "Vikram S.", blockedAt: "2026-02-20" },
  { id: "b2", name: "Neha P.", blockedAt: "2026-01-15" },
];

export default function BlockedUsersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [blocked, setBlocked] = useState(mockBlocked);

  const unblock = (id: string) => {
    setBlocked((prev) => prev.filter((u) => u.id !== id));
    toast({ title: "User unblocked" });
  };

  return (
    <div className="px-4 pt-4 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-display font-bold text-foreground">Blocked Users</h1>
      </div>

      {blocked.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-16 text-center">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Ban className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No blocked users</p>
        </div>
      ) : (
        <div className="space-y-2">
          {blocked.map((user) => (
            <Card key={user.id} className="bg-card border-border">
              <CardContent className="p-3 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Blocked {new Date(user.blockedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => unblock(user.id)}
                >
                  <UserX className="h-3.5 w-3.5 mr-1" /> Unblock
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
