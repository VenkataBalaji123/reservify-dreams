
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, BadgePercent, BadgePlus, BadgeX } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AdminCouponFormProps {
  onComplete: () => void;
  existingCoupon?: {
    id: string;
    code: string;
    description: string;
    discount_percentage?: number;
    discount_amount?: number;
    valid_until: string;
    max_uses: number;
  };
}

const AdminCouponForm = ({ onComplete, existingCoupon }: AdminCouponFormProps) => {
  const queryClient = useQueryClient();
  const [discountType, setDiscountType] = useState(
    existingCoupon?.discount_percentage ? "percentage" : "amount"
  );
  
  const [formData, setFormData] = useState({
    code: existingCoupon?.code || "",
    description: existingCoupon?.description || "",
    discountValue: existingCoupon?.discount_percentage || existingCoupon?.discount_amount || "",
    validUntil: existingCoupon?.valid_until ? 
      new Date(existingCoupon.valid_until).toISOString().split("T")[0] : 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    maxUses: existingCoupon?.max_uses || 100
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.code.trim()) {
        throw new Error("Coupon code is required");
      }

      if (!formData.discountValue || Number(formData.discountValue) <= 0) {
        throw new Error("Discount value must be greater than 0");
      }

      const couponData = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discount_percentage: discountType === "percentage" ? Number(formData.discountValue) : null,
        discount_amount: discountType === "amount" ? Number(formData.discountValue) : null,
        valid_until: new Date(formData.validUntil).toISOString(),
        max_uses: Number(formData.maxUses),
      };

      if (existingCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from("coupons")
          .update(couponData)
          .eq("id", existingCoupon.id);

        if (error) throw error;
        toast.success("Coupon updated successfully!");
      } else {
        // Create new coupon
        const { error } = await supabase
          .from("coupons")
          .insert(couponData);

        if (error) throw error;
        toast.success("Coupon created successfully!");
      }

      // Refresh coupon list
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      onComplete();
    } catch (error: any) {
      console.error("Error saving coupon:", error);
      toast.error(error.message || "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          {existingCoupon ? (
            <>
              <BadgePercent className="mr-2 h-5 w-5 text-amber-600" />
              Edit Coupon
            </>
          ) : (
            <>
              <BadgePlus className="mr-2 h-5 w-5 text-green-600" />
              Create New Coupon
            </>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="code">Coupon Code *</Label>
          <Input
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g. SUMMER20"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Discount Type *</Label>
          <RadioGroup 
            value={discountType} 
            onValueChange={setDiscountType}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage">Percentage (%)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="amount" id="amount" />
              <Label htmlFor="amount">Fixed Amount (₹)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Label htmlFor="discountValue">
            {discountType === "percentage" ? "Discount Percentage *" : "Discount Amount *"}
          </Label>
          <Input
            id="discountValue"
            name="discountValue"
            type="number"
            value={formData.discountValue}
            onChange={handleChange}
            placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 500"}
            min={discountType === "percentage" ? "1" : "1"}
            max={discountType === "percentage" ? "100" : undefined}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="validUntil">Valid Until *</Label>
          <Input
            id="validUntil"
            name="validUntil"
            type="date"
            value={formData.validUntil}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxUses">Maximum Uses</Label>
          <Input
            id="maxUses"
            name="maxUses"
            type="number"
            value={formData.maxUses}
            onChange={handleChange}
            min="1"
            placeholder="e.g. 100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the terms and conditions of this coupon"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onComplete}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : existingCoupon ? "Update Coupon" : "Create Coupon"}
        </Button>
      </div>
    </form>
  );
};

export default AdminCouponForm;
