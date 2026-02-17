import { useState } from "react";
import { Crown, Check, Zap, Building2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { upgradePlan } from "@/services/api";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    icon: Zap,
    current: true,
    features: [
      "5 document uploads",
      "3 video uploads",
      "Basic AI chat",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    icon: Crown,
    popular: true,
    features: [
      "Unlimited documents",
      "Unlimited videos",
      "Advanced AI chat",
      "Priority support",
      "Study groups",
      "Share & collaborate",
    ],
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    icon: Building2,
    features: [
      "Everything in Pro",
      "Custom AI models",
      "Admin dashboard",
      "SSO & security",
      "Dedicated support",
      "API access",
    ],
  },
];

interface UpgradePlanModalProps {
  collapsed?: boolean;
}

export function UpgradePlanModal({ collapsed }: UpgradePlanModalProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan: string) => {
    setLoading(true);
    try {
      await upgradePlan(plan.toLowerCase() as "pro" | "enterprise");
      toast({ title: "Plan upgraded!", description: `You are now on the ${plan} plan.` });
    } catch {
      toast({ title: "Error", description: "Failed to upgrade plan.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const trigger = (
    <button
      className={cn(
        "sidebar-item w-full",
        collapsed && "justify-center px-2"
      )}
    >
      <Crown className="w-5 h-5 shrink-0 text-[hsl(var(--warning))]" />
      {!collapsed && <span>Upgrade Plan</span>}
    </button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Crown className="w-5 h-5 text-[hsl(var(--warning))]" />
            Choose Your Plan
          </DialogTitle>
          <DialogDescription>
            Unlock more features to supercharge your learning
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-xl border p-4 flex flex-col",
                plan.popular
                  ? "border-accent shadow-md ring-1 ring-accent/20"
                  : "border-border"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  POPULAR
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <plan.icon className="w-5 h-5 text-accent" />
                <span className="font-semibold text-foreground">{plan.name}</span>
              </div>
              <div className="mb-3">
                <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-1.5 flex-1 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.current ? "outline" : "default"}
                size="sm"
                className={cn(
                  "w-full",
                  plan.popular && "bg-accent hover:bg-accent/90 text-accent-foreground",
                  plan.current && "cursor-default"
                )}
                onClick={() => !plan.current && handleUpgrade(plan.name)}
                disabled={plan.current || loading}
              >
                {loading && !plan.current ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
