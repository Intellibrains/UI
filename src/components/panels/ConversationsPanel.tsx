import { useState } from "react";
import { MessageSquare, ChevronRight, ChevronLeft, Search, FileText, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

const documentConversations: Conversation[] = [
  {
    id: "1",
    title: "Machine Learning Basics",
    preview: "What are the key differences between...",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Statistics Chapter 3",
    preview: "How do I calculate standard deviation...",
    timestamp: "2 days ago",
  },
  {
    id: "3",
    title: "Data Structures Review",
    preview: "What is the time complexity of...",
    timestamp: "3 days ago",
  },
];

const videoConversations: Conversation[] = [
  {
    id: "1",
    title: "Neural Networks Lecture",
    preview: "Can you explain backpropagation...",
    timestamp: "Yesterday",
  },
  {
    id: "2",
    title: "Algorithm Design",
    preview: "Explain dynamic programming...",
    timestamp: "1 week ago",
  },
];

interface ConversationsPanelProps {
  className?: string;
  contextType: "document" | "video";
}

export function ConversationsPanel({ className, contextType }: ConversationsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = contextType === "document" ? documentConversations : videoConversations;
  const title = contextType === "document" ? "Document Conversations" : "Video Conversations";
  const ContextIcon = contextType === "document" ? FileText : Video;

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full z-40 flex transition-all duration-300",
        className
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "absolute top-20 -left-10 h-20 w-10 rounded-l-lg rounded-r-none border-r-0 bg-card shadow-lg flex items-center justify-center",
          "hover:bg-accent/10"
        )}
      >
        <div className="flex flex-col items-center gap-1">
          {isOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <ContextIcon className="h-4 w-4 text-accent" />
        </div>
      </Button>

      {/* Panel Content */}
      <div
        className={cn(
          "bg-card border-l shadow-xl transition-all duration-300 flex flex-col",
          isOpen ? "w-72" : "w-0 overflow-hidden"
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <ContextIcon className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredConversations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No conversations yet
              </p>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className="w-full p-3 rounded-lg text-left hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conversation.preview}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {conversation.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
