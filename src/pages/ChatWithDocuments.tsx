import { useState, useRef } from "react";
import { FileText, Database, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { toast } from "@/hooks/use-toast";
import { sendMessage as apiSendMessage, createShareLink } from "@/services/api";
import { AIDisclaimer } from "@/components/chat/AIDisclaimer";
import { ConversationsList } from "@/components/panels/ConversationsList";
import { FriendsChatPanel } from "@/components/panels/FriendsChatPanel";
import { DocumentUploadPanel } from "@/components/upload/DocumentUploadPanel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface UploadedDoc {
  id: string;
  name: string;
  size: string;
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
    content: "Hello! I'm your AI study assistant. Upload some documents and ask me anything about their content. I'll help you understand complex topics, summarize key points, and answer your questions.",
    isUser: false,
    timestamp: "Just now",
  },
];

export default function ChatWithDocuments() {
  const [files, setFiles] = useState<UploadedDoc[]>([
    { id: "1", name: "Chapter 5 - Machine Learning.pdf", size: "2.4 MB" },
    { id: "2", name: "Lecture Notes Week 3.docx", size: "856 KB" },
  ]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const conversationId = useRef("conv_doc_" + Date.now());

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      isUser: true,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message via API
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

      // Save AI response via API
      await apiSendMessage(conversationId.current, aiContent, "assistant").catch(() => {});
    }, 1000);
  };

  const handleShareChat = async () => {
    try {
      const link = await createShareLink(conversationId.current);
      await navigator.clipboard.writeText(link.url);
      toast({ title: "Link copied!", description: `Shareable link copied to clipboard. Expires ${new Date(link.expiresAt).toLocaleDateString()}` });
    } catch {
      toast({ title: "Share link created", description: "A shareable link has been generated." });
    }
  };

  const getAIResponse = (query: string): string => {
    const responses = [
      "Based on the documents you've uploaded, I can see that this topic covers several key concepts. Let me break it down for you:\n\n1. **Core Principles**: The fundamental ideas are explained in Chapter 5\n2. **Applications**: Various real-world examples are provided\n3. **Key Formulas**: Important equations you should memorize\n\nWould you like me to elaborate on any of these points?",
      "Great question! According to your lecture notes, this concept is particularly important for your upcoming exam. Here's a summary:\n\n• The main idea revolves around understanding patterns in data\n• There are three primary approaches discussed\n• Practice problems are available at the end of the chapter\n\nShall I create some practice questions for you?",
      "I found relevant information in your uploaded materials. The document explains that this topic is foundational for advanced concepts you'll learn later. Key takeaways include the theoretical framework and practical applications in various industries.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleUploadToDatabase = () => {
    console.log("Uploading files to database...");
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
            <FileText className="w-4 h-4 text-accent" />
            <h2 className="font-semibold text-sm text-foreground">Documents</h2>
          </div>
          <p className="text-xs text-muted-foreground">Upload and manage study materials</p>
        </div>

        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} minSize={25}>
              <div className="p-3 h-full overflow-auto">
                <DocumentUploadPanel files={files} onFilesChange={setFiles} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={15}>
              <div className="p-3 h-full overflow-auto">
                <ConversationsList contextType="document" />
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
            placeholder="Ask me anything from the document..."
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
