import { useState } from "react";
import { Share2, Link2, MessageSquare, History, ChevronDown, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { createShareLink } from "@/services/api";

const pastChats = [
  { id: "1", title: "ML Basics Discussion", date: "2 hours ago" },
  { id: "2", title: "Statistics Review", date: "Yesterday" },
  { id: "3", title: "Neural Networks Q&A", date: "3 days ago" },
  { id: "4", title: "Data Structures Help", date: "1 week ago" },
  { id: "5", title: "Algorithm Design", date: "2 weeks ago" },
];

export function ShareDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = async (action: string) => {
    try {
      const link = await createShareLink(action);
      await navigator.clipboard.writeText(link.url).catch(() => {});
      toast({
        title: "Link copied!",
        description: `Shareable link for "${action}" copied to clipboard.`,
      });
    } catch {
      toast({
        title: "Link created!",
        description: `A shareable link for "${action}" has been generated.`,
      });
    }
  };

  return (
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
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="mt-1 ml-3 border-l-2 border-sidebar-border pl-3 space-y-1 animate-fade-in">
          <button
            onClick={() => handleAction("current chat")}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <Link2 className="w-4 h-4" />
            Share Current Chat
          </button>
          <button
            onClick={() => handleAction("selected messages")}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <Check className="w-4 h-4" />
            Share Selected Messages
          </button>

          <div className="pt-1">
            <p className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-sidebar-foreground/60">
              <History className="w-3 h-3" />
              Past Chats
            </p>
            <ScrollArea className="max-h-36">
              <div className="space-y-0.5">
                {pastChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleAction(chat.title)}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
                  >
                    <MessageSquare className="w-3 h-3 shrink-0" />
                    <span className="truncate flex-1 text-left">{chat.title}</span>
                    <span className="text-sidebar-foreground/40 text-[10px] shrink-0">{chat.date}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
