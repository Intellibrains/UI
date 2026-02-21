import { useState, useRef } from "react";
import { Share2, Mail, MessageCircle, Link2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareScopeModal } from "./ShareScopeModal";

interface ShareDropdownProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  buttonRef: HTMLElement | null;
  onButtonRef: (ref: HTMLElement) => void;
  sidebarWidth: number;
}

export function ShareDropdown({
  isOpen,
  onOpen,
  onClose,
  buttonRef,
  onButtonRef,
  sidebarWidth,
}: ShareDropdownProps) {
  const [showScopeModal, setShowScopeModal] = useState(false);
  const [selectedShareMethod, setSelectedShareMethod] = useState<"mail" | "whatsapp" | "link" | null>(null);
  const buttonElementRef = useRef<HTMLButtonElement>(null);

  const handleShareMethodClick = (method: "mail" | "whatsapp" | "link") => {
    setSelectedShareMethod(method);
    setShowScopeModal(true);
  };

  const shareOptions = [
    { id: "mail", label: "Share via Mail", icon: Mail },
    { id: "whatsapp", label: "Share via WhatsApp", icon: MessageCircle },
    { id: "link", label: "Share via Link", icon: Link2 },
  ];

  const buttonRect = buttonRef?.getBoundingClientRect();

  return (
    <>
      <button
        ref={(el) => {
          buttonElementRef.current = el || null;
          if (el) onButtonRef(el);
        }}
        onClick={onOpen}
        className={cn(
          "sidebar-item w-full",
          isOpen && "sidebar-item-active"
        )}
        data-menu-trigger
      >
        <Share2 className={cn("w-5 h-5 shrink-0", isOpen && "text-sidebar-primary")} />
        <span className="flex-1 text-left">Share</span>
        <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen && "rotate-90")} />
      </button>

      {isOpen && buttonRect && (
        <div
          className="fixed w-48 bg-sidebar border border-sidebar-border rounded-lg shadow-lg z-50 animate-fade-in"
          style={{
            left: `${sidebarWidth}px`,
            top: `${buttonRect.top}px`,
          }}
          data-menu-popup
        >
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

      <ShareScopeModal
        isOpen={showScopeModal}
        onClose={() => {
          setShowScopeModal(false);
          onClose();
        }}
        shareMethod={selectedShareMethod}
      />
    </>
  );
}
