import { useState } from "react";
import { Mail, MessageCircle, Link2, History, MessageSquare, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface ShareScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareMethod: "mail" | "whatsapp" | "link" | null;
}

const pastChats = [
  { id: "1", title: "ML Basics Discussion", date: "2 hours ago" },
  { id: "2", title: "Statistics Review", date: "Yesterday" },
  { id: "3", title: "Neural Networks Q&A", date: "3 days ago" },
  { id: "4", title: "Data Structures Help", date: "1 week ago" },
  { id: "5", title: "Algorithm Design", date: "2 weeks ago" },
];

export function ShareScopeModal({ isOpen, onClose, shareMethod }: ShareScopeModalProps) {
  const [scope, setScope] = useState<"entire" | "thread" | "selected">("entire");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const handleShare = () => {
    let message = `Sharing ${scope === "entire" ? "entire conversation" : scope === "thread" ? "specific thread" : "selected messages"}`;
    if (selectedChat && scope === "thread") {
      const chat = pastChats.find(c => c.id === selectedChat);
      message += ` (${chat?.title})`;
    }

    toast({
      title: "Share initiated!",
      description: message,
    });
    onClose();
  };

  const shareMethodLabel = {
    mail: "Share via Mail",
    whatsapp: "Share via WhatsApp",
    link: "Share via Link",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {shareMethod === "mail" && <Mail className="w-5 h-5 text-accent" />}
            {shareMethod === "whatsapp" && <MessageCircle className="w-5 h-5 text-accent" />}
            {shareMethod === "link" && <Link2 className="w-5 h-5 text-accent" />}
            {shareMethodLabel[shareMethod || "link"]}
          </DialogTitle>
          <DialogDescription>Select what you want to share</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={scope} onValueChange={(val) => setScope(val as "entire" | "thread" | "selected")}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => setScope("entire")}>
                <RadioGroupItem value="entire" id="entire" />
                <Label htmlFor="entire" className="flex-1 cursor-pointer">
                  <p className="font-medium text-sm">Entire Historical Conversation</p>
                  <p className="text-xs text-muted-foreground">Share all messages and history</p>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => setScope("thread")}>
                <RadioGroupItem value="thread" id="thread" />
                <Label htmlFor="thread" className="flex-1 cursor-pointer">
                  <p className="font-medium text-sm">Specific Thread</p>
                  <p className="text-xs text-muted-foreground">Share a single conversation thread</p>
                </Label>
              </div>

              {scope === "thread" && (
                <div className="ml-6 p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Select thread:</p>
                  <ScrollArea className="h-32">
                    <div className="space-y-1 pr-4">
                      {pastChats.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => setSelectedChat(chat.id)}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            selectedChat === chat.id
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="font-medium truncate">{chat.title}</div>
                          <div className="text-xs opacity-75">{chat.date}</div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer"
                onClick={() => setScope("selected")}>
                <RadioGroupItem value="selected" id="selected" />
                <Label htmlFor="selected" className="flex-1 cursor-pointer">
                  <p className="font-medium text-sm">Selected Messages</p>
                  <p className="text-xs text-muted-foreground">Share specific messages within a thread</p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-accent hover:bg-accent/90" onClick={handleShare}>Share</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
