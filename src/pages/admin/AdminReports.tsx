
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FileBarChart, Download, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("revenue");

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

  const handleGenerateReport = (reportType: string) => {
    toast.info(`Generating ${reportType} report...`);
    // This would be implemented to generate/download actual reports
    setTimeout(() => {
      toast.success(`${reportType} report generated successfully!`);
    }, 1500);
  };

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
            <FileBarChart className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Revenue Reports</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Reports</CardTitle>
                  <CardDescription>
                    Generate detailed revenue reports for different time periods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => handleGenerateReport("Daily Revenue")}
                      className="flex items-center justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Daily Revenue
                    </Button>
                    
                    <Button
                      onClick={() => handleGenerateReport("Weekly Revenue")}
                      className="flex items-center justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Weekly Revenue
                    </Button>
                    
                    <Button
                      onClick={() => handleGenerateReport("Monthly Revenue")}
                      className="flex items-center justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Monthly Revenue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Reports</CardTitle>
                  <CardDescription>
                    Generate detailed booking reports by service type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => handleGenerateReport("Flight Bookings")}
                      className="flex items-center justify-center"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Flight Bookings
                    </Button>
                    
                    <Button
                      onClick={() => handleGenerateReport("Train Bookings")}
                      className="flex items-center justify-center"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Train Bookings
                    </Button>
                    
                    <Button
                      onClick={() => handleGenerateReport("Movie Bookings")}
                      className="flex items-center justify-center"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Movie Bookings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Reports</CardTitle>
                  <CardDescription>
                    Generate reports on user registration and activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleGenerateReport("User Registration")}
                      className="flex items-center justify-center"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      User Registration Report
                    </Button>
                    
                    <Button
                      onClick={() => handleGenerateReport("User Activity")}
                      className="flex items-center justify-center"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      User Activity Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Reports</CardTitle>
                  <CardDescription>
                    Generate reports on service performance and popularity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleGenerateReport("Service Performance")}
                      className="flex items-center justify-center"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Service Performance Report
                    </Button>
                    
                    <Button
                      onClick={() => handleGenerateReport("Popular Services")}
                      className="flex items-center justify-center"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Popular Services Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
