
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PaymentMethodType, PaymentDetails } from '@/types/payment';
import {
  CreditCard,
  IndianRupee,
  Building,
  Smartphone,
  Loader2
} from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  bookingId: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: Error) => void;
}

const PaymentForm = ({ amount, bookingId, onSuccess, onError }: PaymentFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<PaymentMethodType>('credit_card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    upiId: '',
    accountNumber: '',
    ifscCode: '',
    accountName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          amount,
          payment_method: method,
          payment_status: 'completed',
          payment_date: new Date().toISOString(),
          transaction_id: `TXN${Math.random().toString(36).slice(2).toUpperCase()}`
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Create payment details record
      const paymentDetails = {
        payment_id: paymentData.id,
        method_type: method,
        ...(method === 'credit_card' || method === 'debit_card' ? {
          card_last_four: formData.cardNumber.slice(-4),
          card_expiry: formData.cardExpiry,
        } : method === 'upi' ? {
          upi_id: formData.upiId
        } : {
          bank_name: 'User Bank',
          account_last_four: formData.accountNumber.slice(-4),
          ifsc_code: formData.ifscCode
        })
      };

      const { error: detailsError } = await supabase
        .from('payment_details')
        .insert(paymentDetails);

      if (detailsError) throw detailsError;

      toast.success('Payment processed successfully');
      onSuccess(paymentData.id);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      onError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <div className="text-2xl font-bold flex items-center">
            <IndianRupee className="h-5 w-5" />
            {amount.toLocaleString('en-IN')}
          </div>
        </div>

        <RadioGroup
          defaultValue={method}
          onValueChange={(value) => setMethod(value as PaymentMethodType)}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem
              value="credit_card"
              id="credit_card"
              className="peer sr-only"
            />
            <Label
              htmlFor="credit_card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <CreditCard className="mb-2 h-6 w-6" />
              Credit Card
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="debit_card"
              id="debit_card"
              className="peer sr-only"
            />
            <Label
              htmlFor="debit_card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <CreditCard className="mb-2 h-6 w-6" />
              Debit Card
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="upi"
              id="upi"
              className="peer sr-only"
            />
            <Label
              htmlFor="upi"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Smartphone className="mb-2 h-6 w-6" />
              UPI
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="bank_transfer"
              id="bank_transfer"
              className="peer sr-only"
            />
            <Label
              htmlFor="bank_transfer"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Building className="mb-2 h-6 w-6" />
              Bank Transfer
            </Label>
          </div>
        </RadioGroup>

        {(method === 'credit_card' || method === 'debit_card') && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength={16}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardExpiry">Expiry Date</Label>
                <Input
                  id="cardExpiry"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardCvv">CVV</Label>
                <Input
                  id="cardCvv"
                  name="cardCvv"
                  type="password"
                  placeholder="123"
                  value={formData.cardCvv}
                  onChange={handleInputChange}
                  maxLength={3}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                name="cardName"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        {method === 'upi' && (
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              name="upiId"
              placeholder="username@upi"
              value={formData.upiId}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {method === 'bank_transfer' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                name="ifscCode"
                placeholder="ABCD0123456"
                value={formData.ifscCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="accountName">Account Holder Name</Label>
              <Input
                id="accountName"
                name="accountName"
                placeholder="John Doe"
                value={formData.accountName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            <>Pay {amount.toLocaleString('en-IN')} INR</>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default PaymentForm;
