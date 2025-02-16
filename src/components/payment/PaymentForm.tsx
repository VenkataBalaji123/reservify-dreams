
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PaymentMethodType } from '@/types/payment';
import { IndianRupee, Loader2 } from 'lucide-react';
import PaymentMethodSelector from './PaymentMethodSelector';
import CardForm from './forms/CardForm';
import UPIForm from './forms/UPIForm';
import BankTransferForm from './forms/BankTransferForm';

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

        <PaymentMethodSelector
          method={method}
          onMethodChange={(value) => setMethod(value)}
        />

        {(method === 'credit_card' || method === 'debit_card') && (
          <CardForm
            formData={formData}
            onChange={handleInputChange}
          />
        )}

        {method === 'upi' && (
          <UPIForm
            upiId={formData.upiId}
            onChange={handleInputChange}
          />
        )}

        {method === 'bank_transfer' && (
          <BankTransferForm
            formData={formData}
            onChange={handleInputChange}
          />
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
