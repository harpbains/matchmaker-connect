import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check, Heart } from "lucide-react";

const steps = ["Basic Info", "Cultural Info", "Profile Setup"];

const religions = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist", "Parsi", "Other", "No religion"];
const languages = ["Hindi", "Gujarati", "Punjabi", "Tamil", "Telugu", "Bengali", "Marathi", "Kannada", "Malayalam", "Urdu", "English", "Other"];
const dietaryOptions = ["Vegetarian", "Vegan", "Non-Vegetarian", "Eggetarian", "Jain Vegetarian", "No preference"];
const educationLevels = ["High School", "Bachelor's", "Master's", "PhD", "Professional Degree", "Other"];
const visaStatuses = ["Citizen", "Permanent Resident", "Work Visa", "Student Visa", "Other"];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    city: "",
    country: "",
    religion: "",
    mother_tongue: "",
    languages: [] as string[],
    dietary_preference: "",
    education: "",
    profession: "",
    height_cm: "",
    visa_status: "",
    bio: "",
    looking_for: "both",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const canProceed = () => {
    if (currentStep === 0) {
      return formData.first_name.trim() && formData.gender && formData.date_of_birth;
    }
    if (currentStep === 1) {
      return true; // Cultural info is optional
    }
    return true;
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        city: formData.city.trim(),
        country: formData.country.trim(),
        religion: formData.religion,
        mother_tongue: formData.mother_tongue,
        languages: formData.languages,
        dietary_preference: formData.dietary_preference,
        education: formData.education,
        profession: formData.profession.trim(),
        height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
        visa_status: formData.visa_status,
        bio: formData.bio.trim(),
        looking_for: formData.looking_for,
        onboarding_completed: true,
      } as any)
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    await refreshProfile();
    toast({ title: "Welcome to DesiConnect! 🎉", description: "Your profile is ready." });
    navigate("/discover");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="font-display font-bold text-foreground">DesiConnect</span>
        </div>
        <Progress value={progress} className="h-1.5 bg-secondary" />
        <div className="flex justify-between mt-2">
          {steps.map((step, i) => (
            <span
              key={step}
              className={`text-[10px] font-medium ${
                i <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {currentStep === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-1">Tell us about yourself</h2>
              <p className="text-sm text-muted-foreground">Basic information to get started</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  className="bg-secondary border-border"
                  placeholder="First name"
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  className="bg-secondary border-border"
                  placeholder="Last name"
                  maxLength={50}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth *</Label>
              <Input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => updateField("date_of_birth", e.target.value)}
                className="bg-secondary border-border"
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="bg-secondary border-border"
                  placeholder="City"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="bg-secondary border-border"
                  placeholder="Country"
                  maxLength={100}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>What are you looking for?</Label>
              <Select value={formData.looking_for} onValueChange={(v) => updateField("looking_for", v)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual Dating</SelectItem>
                  <SelectItem value="matrimony">Matrimony</SelectItem>
                  <SelectItem value="both">Open to Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-1">Cultural Identity</h2>
              <p className="text-sm text-muted-foreground">Help us find culturally compatible matches</p>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
              <Select value={formData.religion} onValueChange={(v) => updateField("religion", v)}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {religions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mother Tongue</Label>
              <Select value={formData.mother_tongue} onValueChange={(v) => updateField("mother_tongue", v)}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Languages Spoken</Label>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Badge
                    key={lang}
                    variant={formData.languages.includes(lang) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      formData.languages.includes(lang)
                        ? "bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                    onClick={() => toggleLanguage(lang)}
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Dietary Preference</Label>
              <Select value={formData.dietary_preference} onValueChange={(v) => updateField("dietary_preference", v)}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {dietaryOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visa Status</Label>
              <Select value={formData.visa_status} onValueChange={(v) => updateField("visa_status", v)}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {visaStatuses.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-1">Complete Your Profile</h2>
              <p className="text-sm text-muted-foreground">A few more details to stand out</p>
            </div>
            <div className="space-y-2">
              <Label>Education</Label>
              <Select value={formData.education} onValueChange={(v) => updateField("education", v)}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {educationLevels.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Profession</Label>
              <Input
                value={formData.profession}
                onChange={(e) => updateField("profession", e.target.value)}
                className="bg-secondary border-border"
                placeholder="e.g. Software Engineer"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                value={formData.height_cm}
                onChange={(e) => updateField("height_cm", e.target.value)}
                className="bg-secondary border-border"
                placeholder="e.g. 175"
                min={100}
                max={250}
              />
            </div>
            <div className="space-y-2">
              <Label>About Me</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                className="bg-secondary border-border min-h-[100px]"
                placeholder="Tell potential matches about yourself..."
                maxLength={500}
              />
              <p className="text-[10px] text-muted-foreground text-right">{formData.bio.length}/500</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="px-4 py-4 border-t border-border bg-card/50 backdrop-blur-sm flex gap-3">
        {currentStep > 0 && (
          <Button
            variant="outline"
            className="flex-1 border-border"
            onClick={() => setCurrentStep((s) => s - 1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button
            className="flex-1"
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
          >
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={handleComplete}
            disabled={loading || !canProceed()}
          >
            {loading ? "Saving..." : (
              <>Complete <Check className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
