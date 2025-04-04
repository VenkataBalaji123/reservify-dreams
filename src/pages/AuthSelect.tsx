
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { UserRound, ShieldCheck } from "lucide-react";

const AuthSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Card className="w-full max-w-md p-8 space-y-8 animate-fade-in-up">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to TravelBooking</h1>
          <p className="text-gray-600 mt-2">Select your login type</p>
        </div>

        <div className="space-y-6">
          <Button
            onClick={() => navigate("/signin")}
            className="w-full h-20 text-lg bg-indigo-600 hover:bg-indigo-700 space-x-3"
          >
            <UserRound className="h-6 w-6" />
            <span>Login as User</span>
          </Button>

          <Button
            onClick={() => navigate("/admin/login")}
            className="w-full h-20 text-lg bg-purple-600 hover:bg-purple-700 space-x-3"
          >
            <ShieldCheck className="h-6 w-6" />
            <span>Login as Administrator</span>
          </Button>
        </div>

        <div className="text-center mt-6">
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
        </div>
      </Card>
    </div>
  );
};

export default AuthSelect;
