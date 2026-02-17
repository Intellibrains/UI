import { useState } from "react";
import { Settings as SettingsIcon, HelpCircle, Users, UserPlus, MessageSquareText, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";

interface SettingsItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: "link" | "dialog";
  dialogType?: "help" | "group" | "invite" | "feedback";
}

const settingsItems: SettingsItem[] = [
  {
    id: "help",
    title: "Help",
    description: "Get help with using IntelliBrain",
    icon: HelpCircle,
    action: "dialog",
    dialogType: "help",
  },
  {
    id: "group",
    title: "Create Group",
    description: "Start a study group with friends",
    icon: Users,
    action: "dialog",
    dialogType: "group",
  },
  {
    id: "invite",
    title: "Invite Friends",
    description: "Send invitations to your classmates",
    icon: UserPlus,
    action: "dialog",
    dialogType: "invite",
  },
  {
    id: "feedback",
    title: "Send Feedback",
    description: "Help us improve IntelliBrain",
    icon: MessageSquareText,
    action: "dialog",
    dialogType: "feedback",
  },
];

export default function Settings() {
  const [groupName, setGroupName] = useState("");
  const [inviteEmails, setInviteEmails] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="p-4 border-b bg-card">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <SettingsIcon className="w-5 h-5 text-accent" />
                Options
              </CardTitle>
              <CardDescription>
                Customize your IntelliBrain experience
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {settingsItems.map((item) => (
                  <Dialog key={item.id}>
                    <DialogTrigger asChild>
                      <button
                        className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </button>
                    </DialogTrigger>

                    {/* Help Dialog */}
                    {item.dialogType === "help" && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-accent" />
                            Help Center
                          </DialogTitle>
                          <DialogDescription>
                            Get answers to common questions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-3">
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
                          </div>
                          <Button variant="outline" className="w-full">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Full Documentation
                          </Button>
                        </div>
                      </DialogContent>
                    )}

                    {/* Create Group Dialog */}
                    {item.dialogType === "group" && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-accent" />
                            Create Study Group
                          </DialogTitle>
                          <DialogDescription>
                            Start a new group to collaborate with friends
                          </DialogDescription>
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
                          <Button className="bg-accent hover:bg-accent/90">
                            Create Group
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}

                    {/* Invite Friends Dialog */}
                    {item.dialogType === "invite" && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-accent" />
                            Invite Friends
                          </DialogTitle>
                          <DialogDescription>
                            Enter email addresses to send invitations
                          </DialogDescription>
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
                            <p className="text-xs text-muted-foreground">
                              Separate multiple emails with commas
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button className="bg-accent hover:bg-accent/90">
                            Send Invites
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}

                    {/* Send Feedback Dialog */}
                    {item.dialogType === "feedback" && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <MessageSquareText className="w-5 h-5 text-accent" />
                            Send Feedback
                          </DialogTitle>
                          <DialogDescription>
                            Share your thoughts to help us improve
                          </DialogDescription>
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
                          <Button className="bg-accent hover:bg-accent/90">
                            Submit Feedback
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* App Info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>IntelliBrain v1.0.0</p>
            <p className="mt-1">Made with ❤️ for students</p>
          </div>
        </div>
      </div>
    </div>
  );
}
