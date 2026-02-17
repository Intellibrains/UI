import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIDisclaimerProps {
  className?: string;
}

export function AIDisclaimer({ className }: AIDisclaimerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5 py-1.5 px-3 bg-muted/50 rounded-lg",
        className
      )}
    >
      <AlertCircle className="h-3 w-3 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">
        AI-generated answers may be inaccurate. Always verify important information.
      </p>
    </div>
  );
}
