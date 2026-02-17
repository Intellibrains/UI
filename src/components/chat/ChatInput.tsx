import { useState } from "react";
import { Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface ChatInputProps {
  placeholder?: string;
  onSend: (message: string) => void;
  disabled?: boolean;
  showShare?: boolean;
  onShare?: () => void;
}

export function ChatInput({
  placeholder = "Type your message...",
  onSend,
  disabled,
  showShare = false,
  onShare,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      toast({
        title: "Share link copied!",
        description: "A shareable link to this chat has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="border-t bg-card p-4">
      <div className="flex gap-3 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[48px] max-h-32 resize-none bg-background focus-visible:ring-accent"
          rows={1}
        />
        {showShare && (
          <Button
            onClick={handleShare}
            size="icon"
            variant="outline"
            className="h-12 w-12 shrink-0"
            title="Share Chat"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        )}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="h-12 w-12 shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
