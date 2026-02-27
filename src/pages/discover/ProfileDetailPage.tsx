import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, X, Star, CheckCircle, MapPin, GraduationCap, Briefcase, Ruler, Languages, UtensilsCrossed, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockProfiles } from "@/data/mockProfiles";

export default function ProfileDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = mockProfiles.find((p) => p.id === id);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const initials = profile.name.split(" ").map((n) => n[0]).join("");

  const infoCards = [
    { icon: GraduationCap, label: "Education", value: profile.education },
    { icon: Briefcase, label: "Profession", value: profile.profession },
    { icon: Ruler, label: "Height", value: profile.height },
    { icon: UtensilsCrossed, label: "Diet", value: profile.dietaryPreference },
    { icon: Globe, label: "Visa", value: profile.visaStatus },
    { icon: Languages, label: "Mother Tongue", value: profile.motherTongue },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero section */}
        <div className="relative h-80 bg-gradient-to-b from-secondary to-card">
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <span className="text-9xl font-display font-bold text-foreground">{initials}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-10 h-10 w-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>

          {/* Compatibility */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1">
              {profile.compatibility}% Match
            </Badge>
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-display font-bold text-foreground">
                {profile.name}, {profile.age}
              </h1>
              {profile.verified && (
                <CheckCircle className="h-6 w-6 text-primary" fill="currentColor" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </p>
          </div>
        </div>

        <div className="px-4 space-y-4 pt-4">
          {/* About */}
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground mb-2">About Me</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{profile.bio}</p>
          </div>

          <Separator />

          {/* Cultural Identity */}
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> Cultural Identity
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-secondary text-secondary-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Info cards */}
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground mb-3">Details</h3>
            <div className="grid grid-cols-2 gap-2">
              {infoCards.map((card) => (
                <Card key={card.label} className="bg-card border-border">
                  <CardContent className="p-3 flex items-start gap-2.5">
                    <card.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{card.label}</p>
                      <p className="text-xs text-foreground font-medium mt-0.5">{card.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Languages */}
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang) => (
                <Badge key={lang} variant="outline" className="border-border text-muted-foreground">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Interests */}
          <div>
            <h3 className="text-sm font-display font-semibold text-foreground mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} className="bg-primary/10 text-primary border-0">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-center gap-4 px-4 py-3 max-w-lg mx-auto">
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <X className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]"
          >
            <Heart className="h-6 w-6" fill="currentColor" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12 rounded-full border-warning/30 text-warning hover:bg-warning/10"
          >
            <Star className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
