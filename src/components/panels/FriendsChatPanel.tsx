import { useState, useEffect, useRef } from "react";
import { Client } from "@twilio/conversations";
import { Users, ChevronRight, ChevronLeft, Send, Plus, LogIn, Copy, X, Loader2, Check, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createRoom, joinRoom, getTwilioToken } from "@/services/api/client";

export function FriendsChatPanel({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelState, setPanelState] = useState<"initial" | "createRoom" | "joinRoom" | "chat">("initial");
  const [roomName, setRoomName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentRoomName, setCurrentRoomName] = useState("");
  const [currentRoomCode, setCurrentRoomCode] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);

  const checkIsMe = (author: string) => {
    const me = localStorage.getItem("name") || "guest";
    return (author || "").toLowerCase().trim() === me.toLowerCase().trim();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode || currentRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setupConversation = async (conv: any, username: string) => {
    conv.removeAllListeners("messageAdded");
    conv.on("messageAdded", (msg: any) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.sid)) return prev;
        return [...prev, {
          id: msg.sid,
          user: msg.author,
          initials: msg.author.slice(0, 2).toUpperCase(),
          message: msg.body,
          timestamp: new Date(msg.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: checkIsMe(msg.author),
        }];
      });
    });

    const paginator = await conv.getMessages();
    const history = paginator.items.map((msg: any) => ({
      id: msg.sid,
      user: msg.author,
      initials: msg.author.slice(0, 2).toUpperCase(),
      message: msg.body,
      timestamp: new Date(msg.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: checkIsMe(msg.author),
    }));
    setMessages(history);
    setConversation(conv);
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    try {
      setIsGeneratingCode(true);
      const username = localStorage.getItem("name") || "guest";
      const data = await createRoom(username, roomName);
      setGeneratedCode(data.room_code);
      
      const tokenData = await getTwilioToken(username);
      const client = await Client.create(tokenData.token);
      const conv = await client.getConversationByUniqueName(data.room_code);
      await setupConversation(conv, username);
      
      setCurrentRoomName(roomName);
      setCurrentRoomCode(data.room_code);
      setPanelState("chat");
    } catch (e) { console.error(e); } finally { setIsGeneratingCode(false); }
  };

  const handleJoinRoom = async () => {
    try {
      setIsJoining(true);
      const username = localStorage.getItem("name") || "user_" + Math.random().toString(36).slice(2, 5);
      
      // Fix: cast to any to bypass the TypeScript property error
      const joinData: any = await joinRoom(joinCode, username);
      
      const tokenData = await getTwilioToken(username);
      const client = await Client.create(tokenData.token);
      const conv = await client.getConversationByUniqueName(joinCode);
      await setupConversation(conv, username);

      // Fix: Dynamically set the room name from response
      setCurrentRoomName(joinData?.room_name || `Room ${joinCode}`);
      setCurrentRoomCode(joinCode);
      setPanelState("chat");
    } catch (e) { 
      setJoinError("Invalid Code"); 
    } finally { 
      setIsJoining(false); 
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversation) return;
    setIsSending(true);
    await conversation.sendMessage(message);
    setMessage("");
    setIsSending(false);
  };

  return (
    <div className={cn("fixed right-0 top-0 h-full z-40 flex transition-all duration-500", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -left-10 transform -translate-y-1/2 h-24 w-10 bg-card border border-r-0 rounded-l-2xl shadow-[-10px_0_15px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors"
      >
        {isOpen ? <ChevronRight className="w-5 h-5 text-muted-foreground" /> : <ChevronLeft className="w-5 h-5 text-muted-foreground" />}
        <Users className={cn("w-5 h-5", isOpen ? "text-primary" : "text-muted-foreground")} />
      </button>

      <div className={cn(
        "bg-card border-l shadow-2xl transition-all duration-500 ease-in-out flex flex-col h-full relative overflow-hidden",
        isOpen ? "w-80" : "w-0"
      )}>
        <AnimatePresence mode="wait">
          {panelState === "initial" && (
            <motion.div 
              key="initial"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col p-6 space-y-6"
            >
              <div className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Study Chat</h2>
              </div>
              <div className="space-y-3">
                <Button onClick={() => setPanelState("createRoom")} className="w-full py-6 flex items-center gap-4 rounded-xl shadow-md">
                  <Plus className="w-5 h-5" /> <span className="font-semibold">Create New Room</span>
                </Button>
                <Button variant="outline" onClick={() => setPanelState("joinRoom")} className="w-full py-6 flex items-center gap-4 rounded-xl">
                  <LogIn className="w-5 h-5" /> <span className="font-semibold">Join via Code</span>
                </Button>
              </div>
            </motion.div>
          )}

          {panelState === "chat" && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b bg-muted/20 backdrop-blur-sm flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold">
                    {currentRoomName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate leading-tight">{currentRoomName}</p>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={handleCopyCode}>
                      <span className="text-[10px] text-muted-foreground font-mono">#{currentRoomCode}</span>
                      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setPanelState("initial")} className="rounded-full h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex flex-col", msg.isMe ? "items-end" : "items-start")}>
                      {!msg.isMe && (
                        <span className="text-[10px] font-bold text-primary mb-1 ml-1">{msg.user}</span>
                      )}
                      <div className={cn(
                        "px-4 py-2 rounded-2xl text-sm max-w-[85%] shadow-sm",
                        msg.isMe 
                          ? "bg-slate-800 text-white rounded-tr-none" 
                          : "bg-slate-100 text-slate-900 rounded-tl-none border"
                      )}>
                        {msg.message}
                      </div>
                      <span className="text-[9px] text-muted-foreground mt-1 px-1 opacity-70">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-card shrink-0">
                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-2xl border">
                  <Input 
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type message..."
                    className="border-none bg-transparent focus-visible:ring-0 shadow-none text-sm"
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()} className="rounded-xl h-9 w-9 shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Simple Create/Join inputs logic */}
        {(panelState === "createRoom" || panelState === "joinRoom") && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-4">
             <h2 className="font-bold text-lg">{panelState === "createRoom" ? "New Room" : "Join Friend"}</h2>
             <Input 
               placeholder={panelState === "createRoom" ? "Room Name" : "6-digit code"} 
               value={panelState === "createRoom" ? roomName : joinCode}
               onChange={(e) => panelState === "createRoom" ? setRoomName(e.target.value) : setJoinCode(e.target.value.toUpperCase())}
             />
             <Button 
                onClick={panelState === "createRoom" ? handleCreateRoom : handleJoinRoom} 
                className="w-full" disabled={isGeneratingCode || isJoining}
             >
               {(isGeneratingCode || isJoining) ? <Loader2 className="animate-spin" /> : "Continue"}
             </Button>
             <Button variant="ghost" onClick={() => setPanelState("initial")} className="w-full">Back</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}