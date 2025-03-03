
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { User, Phone, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditProfile = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    date_of_birth: profile?.date_of_birth || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate phone number - using a simple pattern check
    const phonePattern = /^\+?[0-9\s-()]{7,15}$/;
    if (formData.phone && !phonePattern.test(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number format",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await updateProfile(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-lg border-none bg-white/90 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                name="first_name"
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                name="last_name"
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="pl-10"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EditProfile;
