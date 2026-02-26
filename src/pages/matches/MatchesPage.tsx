import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Star, CheckCircle } from "lucide-react";

const matches = [
  { name: "Priya M.", age: 27, location: "NYC", verified: true, isNew: true },
  { name: "Kavya R.", age: 24, location: "Toronto", verified: false, isNew: true },
  { name: "Meera S.", age: 29, location: "London", verified: true, isNew: false },
  { name: "Anita K.", age: 26, location: "Sydney", verified: true, isNew: false },
  { name: "Divya P.", age: 25, location: "Berlin", verified: false, isNew: false },
  { name: "Riya T.", age: 28, location: "Dubai", verified: true, isNew: false },
];

function MatchCard({ match }: { match: typeof matches[0] }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer">
      <div className="relative">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-secondary text-foreground font-display font-semibold text-lg">
            {match.name[0]}
          </AvatarFallback>
        </Avatar>
        {match.verified && (
          <CheckCircle className="absolute -bottom-0.5 -right-0.5 h-5 w-5 text-primary fill-primary stroke-card" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{match.name}, {match.age}</p>
        <p className="text-xs text-muted-foreground">{match.location}</p>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  const newLikes = matches.filter((m) => m.isNew);

  return (
    <div className="px-4 pt-4">
      <h1 className="text-xl font-display font-bold text-foreground mb-4">Matches</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Heart className="h-3.5 w-3.5 mr-1.5" /> All
          </TabsTrigger>
          <TabsTrigger value="new" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            New Likes
            {newLikes.length > 0 && (
              <Badge className="ml-1.5 h-5 px-1.5 bg-primary/20 text-primary text-[10px]">
                {newLikes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="super" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Star className="h-3.5 w-3.5 mr-1.5" /> Super
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-3 gap-3">
            {matches.map((match) => (
              <MatchCard key={match.name} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-4">
          <div className="grid grid-cols-3 gap-3">
            {newLikes.map((match) => (
              <MatchCard key={match.name} match={match} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="super" className="mt-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="h-10 w-10 text-warning mb-3" />
            <p className="text-muted-foreground text-sm">No Super Likes yet</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
