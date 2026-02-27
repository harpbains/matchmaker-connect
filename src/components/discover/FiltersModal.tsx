import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const religions = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist", "Any"];
const languages = ["Hindi", "Tamil", "Telugu", "Gujarati", "Punjabi", "Malayalam", "Bengali", "Urdu", "Kannada"];
const intents = ["Casual Dating", "Matrimony", "Open to Both"];
const educations = ["Any", "Bachelor's", "Master's", "PhD", "Professional Degree"];
const visaStatuses = ["Any", "Citizen", "PR", "Work Visa", "Student Visa"];

export default function FiltersModal({ open, onOpenChange }: FiltersModalProps) {
  const [ageRange, setAgeRange] = useState([21, 35]);
  const [distance, setDistance] = useState([50]);
  const [selectedReligions, setSelectedReligions] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedIntent, setSelectedIntent] = useState<string>("");
  const [selectedEducation, setSelectedEducation] = useState<string>("Any");
  const [selectedVisa, setSelectedVisa] = useState<string>("Any");

  const toggleSelection = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Age Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Age Range</p>
              <span className="text-xs text-primary font-medium">{ageRange[0]} - {ageRange[1]}</span>
            </div>
            <Slider
              value={ageRange}
              onValueChange={setAgeRange}
              min={18}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Distance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Distance</p>
              <span className="text-xs text-primary font-medium">{distance[0]} km</span>
            </div>
            <Slider
              value={distance}
              onValueChange={setDistance}
              min={5}
              max={500}
              step={5}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Religion */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Religion</p>
            <div className="flex flex-wrap gap-2">
              {religions.map((r) => (
                <Badge
                  key={r}
                  variant={selectedReligions.includes(r) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedReligions.includes(r)
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                  onClick={() => toggleSelection(r, selectedReligions, setSelectedReligions)}
                >
                  {r}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Language */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Language</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <Badge
                  key={l}
                  variant={selectedLanguages.includes(l) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedLanguages.includes(l)
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                  onClick={() => toggleSelection(l, selectedLanguages, setSelectedLanguages)}
                >
                  {l}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Intent */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Intent</p>
            <div className="flex flex-wrap gap-2">
              {intents.map((i) => (
                <Badge
                  key={i}
                  variant={selectedIntent === i ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedIntent === i
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedIntent(selectedIntent === i ? "" : i)}
                >
                  {i}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Education */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Education</p>
            <div className="flex flex-wrap gap-2">
              {educations.map((e) => (
                <Badge
                  key={e}
                  variant={selectedEducation === e ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedEducation === e
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedEducation(e)}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Visa Status */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Visa Status</p>
            <div className="flex flex-wrap gap-2">
              {visaStatuses.map((v) => (
                <Badge
                  key={v}
                  variant={selectedVisa === v ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedVisa === v
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedVisa(v)}
                >
                  {v}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-border text-muted-foreground"
            onClick={() => {
              setSelectedReligions([]);
              setSelectedLanguages([]);
              setSelectedIntent("");
              setSelectedEducation("Any");
              setSelectedVisa("Any");
              setAgeRange([21, 35]);
              setDistance([50]);
            }}
          >
            Reset
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground"
            onClick={() => onOpenChange(false)}
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
