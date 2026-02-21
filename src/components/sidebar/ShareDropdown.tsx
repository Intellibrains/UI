import { useState } from "react";
import { Share2, Mail, MessageCircle, Link2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareScopeModal } from "./ShareScopeModal";

export function ShareDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showScopeModal, setShowScopeModal] = useState(false);
  const [selectedShareMethod, setSelectedShareMethod] = useState<"mail" | "whatsapp" | "link" | null>(null);

  const handleShareMethodClick = (method: "mail" | "whatsapp" | "link") => {
    setSelectedShareMethod(method);
    setShowScopeModal(true);
  };

  const shareOptions = [
    { id: "mail", label: "Share via Mail", icon: Mail },
    { id: "whatsapp", label: "Share via WhatsApp", icon: MessageCircle },
    { id: "link", label: "Share via Link", icon: Link2 },
  ];

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "sidebar-item w-full",
            isOpen && "sidebar-item-active"
          )}
        >
          <Share2 className={cn("w-5 h-5 shrink-0", isOpen && "text-sidebar-primary")} />
          <span className="flex-1 text-left">Share</span>
          <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen && "rotate-90")} />
        </button>

        {isOpen && (
          <div className="absolute left-full top-0 ml-2 w-48 bg-sidebar border border-sidebar-border rounded-lg shadow-lg z-50 animate-fade-in">
            <div className="py-1">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleShareMethodClick(option.id as "mail" | "whatsapp" | "link")}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <option.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{option.label}</span>
                  <ChevronRight className="w-4 h-4 text-sidebar-foreground/40" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ShareScopeModal
        isOpen={showScopeModal}
        onClose={() => {
          setShowScopeModal(false);
          setIsOpen(false);
        }}
        shareMethod={selectedShareMethod}
      />
    </>
  );
}
