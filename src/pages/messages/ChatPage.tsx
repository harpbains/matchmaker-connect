import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, CheckCheck, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockConversations } from "@/data/mockProfiles";

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const conversation = mockConversations.find((c) => c.id === id);
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState(conversation?.messages || []);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: `local-${Date.now()}`,
      text: newMessage.trim(),
      sender: "me" as const,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setLocalMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <button onClick={() => navigate("/messages")} className="p-1">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="relative">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-secondary text-foreground text-sm font-medium">
              {conversation.name[0]}
            </AvatarFallback>
          </Avatar>
          {conversation.online && (
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-online border-2 border-card" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{conversation.name}</p>
          <p className="text-[10px] text-muted-foreground">
            {conversation.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {localMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                msg.sender === "me"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "justify-end" : ""}`}>
                <span className={`text-[10px] ${msg.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {msg.time}
                </span>
                {msg.sender === "me" && (
                  msg.read
                    ? <CheckCheck className="h-3 w-3 text-primary-foreground/60" />
                    : <Check className="h-3 w-3 text-primary-foreground/40" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-secondary border-border"
          />
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
