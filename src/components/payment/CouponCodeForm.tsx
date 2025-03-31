
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, X, Loader2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface CouponCodeFormProps {
  onApply: (discount: number, discountType: 'percentage' | 'amount') => void;
  onClear: () => void;
  disabled?: boolean;
}

const CouponCodeForm = ({ onApply, onClear, disabled = false }: CouponCodeFormProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount?: number;
    discountPercentage?: number;
  } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim())
        .gte('valid_until', new Date().toISOString())
        .lt('current_uses', 'max_uses')
        .single();

      if (error || !data) {
        throw new Error('Invalid or expired coupon code');
      }

      // Apply the discount
      setAppliedCoupon({
        code: data.code,
        discountAmount: data.discount_amount,
        discountPercentage: data.discount_percentage
      });

      // Determine the type of discount and call the callback
      if (data.discount_percentage) {
        onApply(data.discount_percentage, 'percentage');
      } else if (data.discount_amount) {
        onApply(data.discount_amount, 'amount');
      }

      toast.success(`Coupon "${data.code}" applied successfully!`);
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Invalid or expired coupon code');
      setAppliedCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    onClear();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="coupon-code">Coupon Code</Label>
        {appliedCoupon && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearCoupon}
            className="h-6 px-2 text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-md border border-green-100 bg-green-50 p-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">{appliedCoupon.code}</p>
              <p className="text-xs text-green-700">
                {appliedCoupon.discountPercentage
                  ? `${appliedCoupon.discountPercentage}% discount applied`
                  : `₹${appliedCoupon.discountAmount} discount applied`}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClearCoupon}
            className="h-8 w-8 text-gray-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Tag className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="coupon-code"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="pl-10"
              disabled={disabled || loading}
            />
          </div>
          <Button
            type="button"
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || disabled || loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              'Apply'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CouponCodeForm;
