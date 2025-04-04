
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminEventManagement from "@/components/admin/AdminEventManagement";
import AdminPaymentManagement from "@/components/admin/AdminPaymentManagement";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [adminRole, setAdminRole] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    ticketsSold: 0,
    activeCoupons: 0,
  });

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

        setAdminRole(true);
        await fetchDashboardStats();
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

  const fetchDashboardStats = async () => {
    try {
      // Fetch total users count
      const { count: usersCount, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (usersError) throw usersError;

      // Fetch total events count
      const { count: eventsCount, error: eventsError } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true });

      if (eventsError) throw eventsError;

      // Fetch total bookings and calculate revenue
      const { data: bookings, error: bookingsError } = await supabase
        .from("unified_bookings")
        .select("total_amount");

      if (bookingsError) throw bookingsError;

      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

      // Fetch active coupons count
      const now = new Date().toISOString();
      const { count: couponsCount, error: couponsError } = await supabase
        .from("coupons")
        .select("*", { count: "exact", head: true })
        .gte("valid_until", now);

      if (couponsError) throw couponsError;

      setStats({
        totalUsers: usersCount || 0,
        totalEvents: eventsCount || 0,
        totalBookings: bookings.length,
        totalRevenue: totalRevenue,
        ticketsSold: bookings.length,
        activeCoupons: couponsCount || 0
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!adminRole) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.totalUsers}</p>
            </Card>
            
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.totalEvents}</p>
            </Card>
            
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.totalBookings}</p>
            </Card>
            
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-1">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </Card>
            
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500">Tickets Sold</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.ticketsSold}</p>
            </Card>
            
            <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500">Active Coupons</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.activeCoupons}</p>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <AdminUserManagement />
            </TabsContent>
            
            <TabsContent value="events" className="space-y-4">
              <AdminEventManagement />
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-4">
              <AdminPaymentManagement />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/coupons")} 
              className="bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
            >
              Manage Coupons & Offers
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                toast.info("Generating Revenue Reports...");
                // This would be implemented to generate/download reports
              }}
              className="bg-green-50 border-green-200 hover:bg-green-100"
            >
              Generate Revenue Reports
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
