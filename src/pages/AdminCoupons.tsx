
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, TagIcon, Plus, BadgePercent } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminCouponForm from "@/components/admin/AdminCouponForm";
import CouponList from "@/components/admin/CouponList";
import { useAuth } from "@/contexts/AuthContext";

const AdminCoupons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);

  // Check if user is admin
  const { data: userRole, isLoading: isLoadingRole } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
        
      if (error) throw error;
      return data?.role;
    },
    enabled: !!user,
  });

  // Redirect if not admin
  if (!isLoadingRole && userRole !== "admin") {
    navigate("/");
    toast.error("You do not have permission to access this page");
    return null;
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BadgePercent className="mr-2 h-8 w-8 text-indigo-600" />
            Coupon Management
          </h1>
          <p className="text-gray-600 mt-1">Create and manage coupons and promotional offers</p>
        </div>
        <Button 
          onClick={() => setIsAddingCoupon(!isAddingCoupon)}
          className="flex items-center"
        >
          {isAddingCoupon ? "Cancel" : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add New Coupon
            </>
          )}
        </Button>
      </div>

      {isLoadingRole ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          {isAddingCoupon && (
            <Card className="mb-8 p-6">
              <AdminCouponForm onComplete={() => setIsAddingCoupon(false)} />
            </Card>
          )}
          
          <CouponList />
        </>
      )}
    </div>
  );
};

export default AdminCoupons;
