import { useState, useRef } from "react";
import { Video, Database, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { toast } from "@/hooks/use-toast";
import { sendMessage as apiSendMessage, createShareLink } from "@/services/api";
import { AIDisclaimer } from "@/components/chat/AIDisclaimer";
import { ConversationsList } from "@/components/panels/ConversationsList";
import { FriendsChatPanel } from "@/components/panels/FriendsChatPanel";
import { VideoUploadPanel } from "@/components/upload/VideoUploadPanel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface UploadedVideo {
  id: string;
  name: string;
  size: string;
  type: "video" | "youtube";
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Welcome! Upload your lecture videos or paste a YouTube link, and I'll help you understand the content. I can answer questions, create summaries, and help you review key concepts from the video.",
    isUser: false,
    timestamp: "Just now",
  },
];

export default function ChatWithVideos() {
  const [files, setFiles] = useState<UploadedVideo[]>([
    { id: "1", name: "Lecture 7 - Neural Networks.mp4", size: "245 MB", type: "video" },
  ]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const conversationId = useRef("conv_vid_" + Date.now());

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      isUser: true,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMessage]);

    await apiSendMessage(conversationId.current, content, "user").catch(() => {});

    setTimeout(async () => {
      const aiContent = getAIResponse(content);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiContent,
        isUser: false,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMessage]);

      await apiSendMessage(conversationId.current, aiContent, "assistant").catch(() => {});
    }, 1000);
  };

  const handleShareChat = async () => {
    try {
      const link = await createShareLink(conversationId.current);
      await navigator.clipboard.writeText(link.url);
      toast({ title: "Link copied!", description: `Shareable link copied to clipboard.` });
    } catch {
      toast({ title: "Share link created", description: "A shareable link has been generated." });
    }
  };

  const getAIResponse = (query: string): string => {
    const responses = [
      "Based on the video content, I can help explain this concept. At around **timestamp 12:34**, the professor discusses the main principles:\n\n• First, the foundational theory is introduced\n• Then, practical examples are demonstrated\n• Finally, the applications are reviewed\n\nWould you like me to summarize a specific section?",
      "I analyzed the lecture video and found relevant information. The topic you're asking about is covered in detail between **15:20 - 23:45**. Here are the key points:\n\n1. **Introduction to the concept**\n2. **Mathematical formulation**\n3. **Visual demonstration**\n\nShould I explain any of these in more detail?",
      "Great question! The video covers this at multiple points. The most detailed explanation is at **28:15** where the instructor provides step-by-step guidance. I can also create flashcards based on this section if you'd like.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleUploadToDatabase = () => {
    console.log("Uploading videos to database...");
  };

  const handleClearDatabase = () => {
    setFiles([]);
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-72 border-r bg-card flex flex-col">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-4 h-4 text-accent" />
            <h2 className="font-semibold text-sm text-foreground">Videos</h2>
          </div>
          <p className="text-xs text-muted-foreground">Upload videos or paste YouTube links</p>
        </div>

        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} minSize={25}>
              <div className="p-3 h-full overflow-auto">
                <VideoUploadPanel files={files} onFilesChange={setFiles} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={15}>
              <div className="p-3 h-full overflow-auto">
                <ConversationsList contextType="video" />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <div className="p-3 border-t space-y-2">
          <Button
            onClick={handleUploadToDatabase}
            className="w-full h-9 text-sm bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={files.length === 0}
          >
            <Database className="w-4 h-4 mr-2" />
            Upload to Database
          </Button>
          <Button
            onClick={handleClearDatabase}
            variant="outline"
            className="w-full h-9 text-sm text-destructive hover:bg-destructive/10 border-destructive/30"
            disabled={files.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Main Panel - Chat */}
      <div className="flex-1 flex flex-col bg-background mr-10">
        <div className="p-4 border-b bg-card"></div>

        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="max-w-3xl mx-auto w-full space-y-2">
          <ChatInput
            placeholder="Ask me anything from the video..."
            onSend={handleSendMessage}
            disabled={files.length === 0}
            showShare
            onShare={handleShareChat}
          />
          <AIDisclaimer />
        </div>
      </div>

      <FriendsChatPanel />
    </div>
  );
}
