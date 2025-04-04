
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Bus, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const AdminBuses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/admin/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (data?.role !== "admin") {
          toast.error("You do not have administrator privileges");
          navigate("/");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("An error occurred while verifying administrator privileges");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Bus className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Bus Management</h1>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Bus Management</CardTitle>
              <CardDescription>
                Add, edit, and delete bus routes from the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This is a placeholder for the bus management interface. Here you will be able to:
              </p>
              <ul className="list-disc ml-6 mt-2 text-gray-600">
                <li>Add new bus routes with details like schedule, price, and capacity</li>
                <li>Edit existing bus route information</li>
                <li>Cancel or delete bus routes from the system</li>
                <li>Manage bus schedules and availability</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminBuses;
