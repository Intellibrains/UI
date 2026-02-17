import { useState } from "react";
import { Share2, Copy, Check, Mail, MessageCircle, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Share() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://intellibrain.app/invite/abc123";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: "Email",
      icon: Mail,
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
      action: () => window.open(`mailto:?subject=Check out IntelliBrain&body=I've been using IntelliBrain to study smarter. Join me! ${shareUrl}`),
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
      action: () => window.open(`https://wa.me/?text=Check out IntelliBrain! ${shareUrl}`),
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500/10 text-sky-600 hover:bg-sky-500/20",
      action: () => window.open(`https://twitter.com/intent/tweet?text=Check out IntelliBrain!&url=${shareUrl}`),
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600/10 text-blue-700 hover:bg-blue-600/20",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`),
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700/10 text-blue-800 hover:bg-blue-700/20",
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="p-4 border-b bg-card">
        <h1 className="page-title">Share IntelliBrain</h1>
        <p className="page-description">
          Invite friends and study together
        </p>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Copy Link Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="w-5 h-5 text-accent" />
                Share your invite link
              </CardTitle>
              <CardDescription>
                Copy and share this link with your friends to invite them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="bg-muted/50"
                />
                <Button
                  onClick={handleCopyLink}
                  className={cn(
                    "shrink-0 transition-colors",
                    copied ? "bg-green-600 hover:bg-green-600" : "bg-accent hover:bg-accent/90"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Share Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share via</CardTitle>
              <CardDescription>
                Choose your preferred way to share
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl transition-colors",
                      option.color
                    )}
                  >
                    <option.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-3">
                Why invite friends?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Study together and share documents
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Discuss lecture videos in real-time
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Create study groups for exams
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  Help each other learn faster
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
