import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { login, register, setAuthToken } from "@/services/api";
import intelliBrainIcon from "@/assets/intellibrain-icon.svg";

type AuthResponse = {
  user: {
    name: string;
    email: string;
  };
  token: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = (isRegister
        ? await register({ name, email, password })
        : await login({ email, password })) as AuthResponse;
    
      setAuthToken(response.token);
    
      // Save user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("name", response.user.name);
      localStorage.setItem("email", response.user.email);
    
      toast({
        title: isRegister ? "Account created!" : "Welcome back!",
        description: `Signed in as ${response.user.email}`,
      });
    
      navigate("/documents");
    
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({ title: "Google Sign-In", description: "Google OAuth will be connected to your FastAPI backend." });
    navigate("/documents");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
          <img src={intelliBrainIcon} alt="IntelliBrain" className="w-20 h-20 mb-8 brightness-0 invert" />
          <h1 className="text-4xl font-bold mb-4 text-center">IntelliBrain</h1>
          <p className="text-lg text-primary-foreground/80 text-center max-w-md">
            Your intelligent learning companion. Upload documents, watch videos, 
            and test your knowledge with AI-powered insights.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">AI Chat</div>
              <p className="text-sm text-primary-foreground/70 mt-1">
                Ask questions
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold">Docs</div>
              <p className="text-sm text-primary-foreground/70 mt-1">
                Upload & learn
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold">Tests</div>
              <p className="text-sm text-primary-foreground/70 mt-1">
                Assess yourself
              </p>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-accent/20" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
           <div className="lg:hidden flex justify-center mb-8">
             <div className="flex items-center gap-3">
               <img src={intelliBrainIcon} alt="IntelliBrain" className="w-12 h-12" />
               <span className="text-2xl font-bold text-foreground">IntelliBrain</span>
             </div>
           </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">
              {isRegister ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isRegister ? "Start your learning journey today" : "Sign in to continue your learning journey"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Student"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm text-accent hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-muted-foreground">
              or continue with
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-12 font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-accent hover:underline font-medium"
            >
              {isRegister ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
