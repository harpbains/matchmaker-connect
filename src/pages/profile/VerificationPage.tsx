import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Camera,
  Upload,
  CheckCircle,
  Clock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

type VerificationStatus = "unverified" | "pending" | "verified";

const steps = [
  {
    icon: Camera,
    title: "Take a Selfie",
    description: "Snap a clear photo of your face in good lighting",
  },
  {
    icon: Upload,
    title: "Upload ID",
    description: "Government-issued photo ID (blurred after review)",
  },
  {
    icon: ShieldCheck,
    title: "Get Verified",
    description: "Our team reviews within 24 hours",
  },
];

const benefits = [
  "40% more profile views",
  "Verified badge on your profile",
  "Priority in discovery feed",
  "Higher match rate",
];

export default function VerificationPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>("unverified");
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);

  const handleSubmit = () => {
    setStatus("pending");
  };

  if (status === "verified") {
    return (
      <div className="px-4 pt-4 pb-8">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex flex-col items-center justify-center pt-16 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            You're Verified!
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your profile now has the verified badge. Enjoy higher visibility and trust.
          </p>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="px-4 pt-4 pb-8">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex flex-col items-center justify-center pt-16 text-center">
          <div className="h-20 w-20 rounded-full bg-warning/20 flex items-center justify-center mb-4 animate-pulse">
            <Clock className="h-10 w-10 text-warning" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Under Review
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Our team is reviewing your submission. This usually takes less than 24 hours.
          </p>
          <Badge variant="outline" className="mt-4 border-warning/30 text-warning">
            Estimated: 12-24 hours
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-8">
      <button onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-display font-bold text-foreground">
          Get Verified
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Build trust and boost your profile
        </p>
      </div>

      {/* Benefits */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 mb-5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Verification Benefits</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-xs text-foreground/80">{b}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        {steps.map((step, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <step.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Step {i + 1}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload buttons */}
      <div className="space-y-3 mb-6">
        <Button
          variant={selfieUploaded ? "default" : "outline"}
          className="w-full justify-start gap-3 h-12"
          onClick={() => setSelfieUploaded(true)}
        >
          {selfieUploaded ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          {selfieUploaded ? "Selfie uploaded" : "Upload selfie"}
        </Button>
        <Button
          variant={idUploaded ? "default" : "outline"}
          className="w-full justify-start gap-3 h-12"
          onClick={() => setIdUploaded(true)}
        >
          {idUploaded ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {idUploaded ? "ID uploaded" : "Upload photo ID"}
        </Button>
      </div>

      {/* Submit */}
      <Button
        className="w-full h-12"
        disabled={!selfieUploaded || !idUploaded}
        onClick={handleSubmit}
      >
        <ShieldCheck className="h-4 w-4 mr-2" />
        Submit for Verification
      </Button>
      <p className="text-[10px] text-muted-foreground text-center mt-2">
        Your ID is only used for verification and deleted after review
      </p>
    </div>
  );
}
