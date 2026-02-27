import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockConversations } from "@/data/mockProfiles";
import { useState } from "react";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-4">
      <h1 className="text-xl font-display font-bold text-foreground mb-4">Messages</h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-10 bg-secondary border-border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Conversation list */}
      <div className="flex flex-col gap-1">
        {filtered.map((conv) => (
          <button
            key={conv.id}
            onClick={() => navigate(`/messages/${conv.id}`)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer w-full text-left"
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-secondary text-foreground font-medium">
                  {conv.name[0]}
                </AvatarFallback>
              </Avatar>
              {conv.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-online border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{conv.name}</p>
                <span className="text-[10px] text-muted-foreground">{conv.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {conv.lastMessage}
              </p>
            </div>
            {conv.unread > 0 && (
              <div className="h-5 min-w-[20px] rounded-full bg-primary flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary-foreground">{conv.unread}</span>
              </div>
            )}
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-sm">No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
