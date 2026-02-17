import { useState } from "react";
import { Users, ChevronRight, ChevronLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FriendMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  isMe?: boolean;
}

const mockMessages: FriendMessage[] = [
  {
    id: "1",
    user: "Sarah M.",
    avatar: "",
    message: "Did anyone understand the neural network section?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    user: "You",
    avatar: "",
    message: "Yeah, I can help explain it! The key is understanding backpropagation.",
    timestamp: "10:32 AM",
    isMe: true,
  },
  {
    id: "3",
    user: "Mike T.",
    avatar: "",
    message: "Thanks! Can you share your notes?",
    timestamp: "10:35 AM",
  },
  {
    id: "4",
    user: "Sarah M.",
    avatar: "",
    message: "That would be really helpful for the exam prep.",
    timestamp: "10:36 AM",
  },
];

const onlineFriends = [
  { id: "1", name: "Sarah M.", initials: "SM", online: true },
  { id: "2", name: "Mike T.", initials: "MT", online: true },
  { id: "3", name: "Alex K.", initials: "AK", online: false },
];

interface FriendsChatPanelProps {
  className?: string;
}

export function FriendsChatPanel({ className }: FriendsChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full z-30 flex transition-all duration-300",
        className
      )}
    >
      {/* Toggle Button - positioned below conversations panel toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "absolute top-44 -left-10 h-20 w-10 rounded-l-lg rounded-r-none border-r-0 bg-card shadow-lg flex items-center justify-center",
          "hover:bg-accent/10"
        )}
      >
        <div className="flex flex-col items-center gap-1">
          {isOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <Users className="h-4 w-4 text-primary" />
        </div>
      </Button>

      {/* Panel Content */}
      <div
        className={cn(
          "bg-card border-l shadow-xl transition-all duration-300 flex flex-col h-full",
          isOpen ? "w-80" : "w-0 overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">
              Chat with Friends
            </span>
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full ml-auto">
              {onlineFriends.filter((f) => f.online).length} online
            </span>
          </div>
        </div>

        {/* Online Friends */}
        <div className="px-3 py-3 border-b">
          <p className="text-xs font-medium text-muted-foreground mb-2">Online Now</p>
          <div className="flex gap-3">
            {onlineFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex flex-col items-center gap-1"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs bg-muted">
                      {friend.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
                      friend.online ? "bg-green-500" : "bg-muted-foreground"
                    )}
                  />
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[4rem]">
                  {friend.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.isMe && "flex-row-reverse"
                )}
              >
                {!msg.isMe && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-muted">
                      {msg.user.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[75%]",
                    msg.isMe && "text-right"
                  )}
                >
                  {!msg.isMe && (
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {msg.user}
                    </p>
                  )}
                  <div
                    className={cn(
                      "text-sm p-3 rounded-xl",
                      msg.isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    )}
                  >
                    {msg.message}
                  </div>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-10 text-sm"
            />
            <Button size="sm" className="h-10 px-4">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
