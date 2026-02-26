import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function AdminPlaceholder() {
  const location = useLocation();
  const pageName = location.pathname.split("/").pop() || "Page";

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-4 capitalize">
        {pageName}
      </h1>
      <Card className="bg-card border-border">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Construction className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm">This section is coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
