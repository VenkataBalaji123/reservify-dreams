
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Invalid email or password. Please check your credentials or sign up if you don't have an account.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address before signing in. Check your inbox for the verification link.");
        } else {
          setError(error.message);
        }
      } else {
        // Successful login
        toast.success("Successfully signed in!");
        navigate('/dashboard');
      }
    } catch (error: any) {
      // This should not be reached since signIn now returns errors instead of throwing
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Card className="w-full max-w-md p-8 space-y-6 animate-fade-in-up">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/auth")}
            className="text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 flex-1 text-center">User Login</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
        
        <p className="text-gray-600 text-center">Sign in to your user account</p>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/login")}
            className="w-full flex items-center justify-center gap-2"
          >
            <ShieldCheck className="h-5 w-5 text-purple-600" />
            <span>Switch to Admin Login</span>
          </Button>
          
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/signup")}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Sign Up
            </Button>
          </p>
          <p className="text-xs text-gray-500">
            First time? You'll need to sign up and verify your email before signing in.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
