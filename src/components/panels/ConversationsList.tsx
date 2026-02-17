import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

const conversationsByContext: Record<string, Conversation[]> = {
  document: [
    { id: "1", title: "Machine Learning Basics", preview: "What are the key differences between...", timestamp: "2 hours ago" },
    { id: "2", title: "Statistics Chapter 3", preview: "How do I calculate standard deviation...", timestamp: "2 days ago" },
    { id: "3", title: "Data Structures Review", preview: "What is the time complexity of...", timestamp: "3 days ago" },
  ],
  video: [
    { id: "1", title: "Neural Networks Lecture", preview: "Can you explain backpropagation...", timestamp: "Yesterday" },
    { id: "2", title: "Algorithm Design", preview: "Explain dynamic programming...", timestamp: "1 week ago" },
  ],
  test: [
    { id: "1", title: "ML Quiz Review", preview: "Why was option B correct for...", timestamp: "1 hour ago" },
    { id: "2", title: "Physics Test Discussion", preview: "Can you explain question 3...", timestamp: "3 days ago" },
  ],
};

interface ConversationsListProps {
  contextType: "document" | "video" | "test";
}

export function ConversationsList({ contextType }: ConversationsListProps) {
  const conversations = conversationsByContext[contextType] || [];

  return (
    <div className="flex flex-col min-h-0">
      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
        <MessageSquare className="w-3 h-3" />
        My Conversations
      </p>
      <ScrollArea className="max-h-48">
        <div className="space-y-1.5 pr-2">
          {conversations.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                className="w-full p-2 rounded-lg text-left hover:bg-muted/50 transition-colors group"
              >
                <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {conv.title}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {conv.preview}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {conv.timestamp}
                </p>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
