import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Loader2, AlertCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // First sign in with regular auth
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) throw signInError;
      
      // Check if user has admin role using the is_admin function
      const { data: user } = await supabase.auth.getUser();
      
      if (!user || !user.user) {
        throw new Error("Authentication failed");
      }
      
      const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
        'is_admin',
        { user_uuid: user.user.id }
      );
      
      if (adminCheckError) throw adminCheckError;
      
      if (!isAdmin) {
        // Sign out if not admin
        await supabase.auth.signOut();
        throw new Error("You do not have administrator privileges");
      }
      
      toast.success("Logged in as administrator");
      // Navigate to admin dashboard
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin login error:", error);
      setError(error.message);
      
      // Try to sign out to clean up session if there was an error
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.error("Error signing out:", signOutError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-lg animate-fade-in-up">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/auth")}
            className="text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 flex-1 text-center">Admin Login</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <div className="flex justify-center mb-4">
          <ShieldCheck className="h-12 w-12 text-indigo-600" />
        </div>
        
        <p className="text-gray-600 text-center">Access the system administration panel</p>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleAdminSignIn} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Admin Email"
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
              "Sign In as Administrator"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
