
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Pencil, Trash2, AlertTriangle, Badge } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminCouponForm from "./AdminCouponForm";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_percentage: number | null;
  discount_amount: number | null;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  current_uses: number;
  created_at: string;
}

const CouponList = () => {
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);
  
  const { data: coupons, isLoading, refetch } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data as Coupon[];
    },
  });

  const handleDeleteCoupon = async () => {
    if (!deletingCouponId) return;
    
    try {
      const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", deletingCouponId);
        
      if (error) throw error;
      
      toast.success("Coupon deleted successfully");
      refetch();
    } catch (error: any) {
      console.error("Error deleting coupon:", error);
      toast.error(error.message || "Failed to delete coupon");
    } finally {
      setDeletingCouponId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden md:table-cell">Valid Until</TableHead>
              <TableHead className="hidden md:table-cell">Usage</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons && coupons.length > 0 ? (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className={isExpired(coupon.valid_until) ? "bg-gray-50" : ""}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Badge className="mr-2 h-4 w-4" />
                      <span className={isExpired(coupon.valid_until) ? "text-gray-500" : ""}>
                        {coupon.code}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.discount_percentage 
                      ? `${coupon.discount_percentage}%` 
                      : `₹${coupon.discount_amount}`}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {coupon.description || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={isExpired(coupon.valid_until) ? "text-red-500" : ""}>
                      {formatDate(coupon.valid_until)}
                      {isExpired(coupon.valid_until) && " (Expired)"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {coupon.current_uses} / {coupon.max_uses}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCoupon(coupon)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Dialog open={deletingCouponId === coupon.id} onOpenChange={(open) => {
                      if (!open) setDeletingCouponId(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingCouponId(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                            Confirm Deletion
                          </DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <p>Are you sure you want to delete the coupon <strong>{coupon.code}</strong>?</p>
                          <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setDeletingCouponId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteCoupon}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No coupons found. Create your first coupon to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {editingCoupon && (
        <Dialog open={!!editingCoupon} onOpenChange={(open) => {
          if (!open) setEditingCoupon(null);
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Coupon</DialogTitle>
            </DialogHeader>
            <AdminCouponForm 
              existingCoupon={editingCoupon} 
              onComplete={() => {
                setEditingCoupon(null);
                refetch();
              }} 
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CouponList;
