import { useState, useRef } from "react";
import {
  Settings,
  HelpCircle,
  Users,
  UserPlus,
  MessageSquareText,
  ChevronRight,
  ExternalLink,
  CircleHelp,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { createGroup, sendFeedback, inviteFriends } from "@/services/api";

const faqItems = [
  { q: "How do I upload documents?", a: "Drag and drop files or click the upload area." },
  { q: "What formats are supported?", a: "PDF, DOCX, PPT for documents; MP4, MKV for videos." },
  { q: "How does the AI work?", a: "Our AI analyzes your content and answers questions based on it." },
  { q: "Can I share my chats?", a: "Yes! Use the Share option in the sidebar to share chats." },
  { q: "Is my data private?", a: "All uploads are private and only accessible to you." },
];

interface SettingsOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

const options: SettingsOption[] = [
  { id: "help", label: "Help", icon: HelpCircle },
  { id: "group", label: "Create Group", icon: Users },
  { id: "invite", label: "Invite Friends", icon: UserPlus },
  { id: "feedback", label: "Send Feedback", icon: MessageSquareText },
  { id: "faq", label: "FAQ", icon: CircleHelp },
];

interface SettingsDropdownProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  buttonRef: HTMLElement | null;
  onButtonRef: (ref: HTMLElement) => void;
  sidebarWidth: number;
}

export function SettingsDropdown({
  isOpen,
  onOpen,
  onClose,
  buttonRef,
  onButtonRef,
  sidebarWidth,
}: SettingsDropdownProps) {
  const [groupName, setGroupName] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const buttonElementRef = useRef<HTMLButtonElement>(null);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    setLoading("group");
    try {
      const group = await createGroup(groupName);
      toast({ title: "Group created!", description: `"${group.name}" group has been created.` });
      setGroupName("");
    } catch {
      toast({ title: "Error", description: "Failed to create group.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;
    setLoading("feedback");
    try {
      await sendFeedback(feedbackText);
      toast({ title: "Feedback submitted!", description: "Thank you for your feedback." });
      setFeedbackText("");
    } catch {
      toast({ title: "Error", description: "Failed to send feedback.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleInvite = async () => {
    const emails = inviteEmails.split(",").map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0) return;
    setLoading("invite");
    try {
      const result = await inviteFriends(emails);
      toast({ title: "Invites sent!", description: `${result.sent} invitation(s) have been sent.` });
      setInviteEmails("");
    } catch {
      toast({ title: "Error", description: "Failed to send invites.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const buttonRect = buttonRef?.getBoundingClientRect();

  return (
    <>
      <button
        ref={(el) => {
          buttonElementRef.current = el || null;
          if (el) onButtonRef(el);
        }}
        onClick={onOpen}
        className={cn("sidebar-item w-full", isOpen && "sidebar-item-active")}
        data-menu-trigger
      >
        <Settings className={cn("w-5 h-5 shrink-0", isOpen && "text-sidebar-primary")} />
        <span className="flex-1 text-left">Settings</span>
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
            {options.map((opt) => (
              <Dialog key={opt.id}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                    <opt.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{opt.label}</span>
                    <ChevronRight className="w-4 h-4 text-sidebar-foreground/40" />
                  </button>
                </DialogTrigger>

                {opt.id === "help" && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-accent" />
                        Help Center
                      </DialogTitle>
                      <DialogDescription>Get answers to common questions</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {[
                        { q: "How do I upload documents?", a: "Drag and drop files or click the upload area" },
                        { q: "What formats are supported?", a: "PDF, DOCX, PPT for documents; MP4, MKV for videos" },
                        { q: "How does the AI work?", a: "Our AI analyzes your content and answers questions based on it" },
                      ].map((faq, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-lg">
                          <p className="font-medium text-sm text-foreground">{faq.q}</p>
                          <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Full Documentation
                      </Button>
                    </div>
                  </DialogContent>
                )}

                {opt.id === "group" && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-accent" />
                        Create Study Group
                      </DialogTitle>
                      <DialogDescription>Start a new group to collaborate with friends</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Group Name</label>
                        <Input
                          placeholder="e.g., CS101 Study Group"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        className="bg-accent hover:bg-accent/90"
                        disabled={loading === "group" || !groupName.trim()}
                        onClick={handleCreateGroup}
                      >
                        {loading === "group" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create Group
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}

                {opt.id === "invite" && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-accent" />
                        Invite Friends
                      </DialogTitle>
                      <DialogDescription>Enter email addresses to send invitations</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Addresses</label>
                        <Textarea
                          placeholder="Enter emails separated by commas..."
                          value={inviteEmails}
                          onChange={(e) => setInviteEmails(e.target.value)}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">Separate multiple emails with commas</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        className="bg-accent hover:bg-accent/90"
                        disabled={loading === "invite" || !inviteEmails.trim()}
                        onClick={handleInvite}
                      >
                        {loading === "invite" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Send Invites
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}

                {opt.id === "feedback" && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <MessageSquareText className="w-5 h-5 text-accent" />
                        Send Feedback
                      </DialogTitle>
                      <DialogDescription>Share your thoughts to help us improve</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Feedback</label>
                        <Textarea
                          placeholder="Tell us what you think..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        className="bg-accent hover:bg-accent/90"
                        disabled={loading === "feedback" || !feedbackText.trim()}
                        onClick={handleSendFeedback}
                      >
                        {loading === "feedback" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Submit Feedback
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}

                {opt.id === "faq" && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <CircleHelp className="w-5 h-5 text-accent" />
                        Frequently Asked Questions
                      </DialogTitle>
                      <DialogDescription>Quick answers to common questions</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4 max-h-80 overflow-y-auto">
                      {faqItems.map((faq, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-lg">
                          <p className="font-medium text-sm text-foreground">{faq.q}</p>
                          <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
