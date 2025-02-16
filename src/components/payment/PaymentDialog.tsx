
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentForm from "./PaymentForm";
import PaymentReceipt from "./PaymentReceipt";
import { useState } from "react";
import { PaymentReceipt as PaymentReceiptType } from "@/types/payment";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  bookingId: string;
  onPaymentComplete: () => void;
}

const PaymentDialog = ({
  open,
  onOpenChange,
  amount,
  bookingId,
  onPaymentComplete
}: PaymentDialogProps) => {
  const [receipt, setReceipt] = useState<PaymentReceiptType | null>(null);

  const handlePaymentSuccess = (paymentId: string) => {
    // Create a sample receipt (in a real app, this would come from the backend)
    setReceipt({
      id: paymentId,
      amount,
      methodType: 'credit_card',
      status: 'completed',
      transactionId: `TXN${Math.random().toString(36).slice(2).toUpperCase()}`,
      timestamp: new Date().toISOString()
    });
    onPaymentComplete();
  };

  const handleDownload = () => {
    // Implementation for downloading receipt
    console.log('Downloading receipt...');
  };

  const handleShare = () => {
    // Implementation for sharing receipt
    console.log('Sharing receipt...');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {receipt ? 'Payment Successful' : 'Complete Payment'}
          </DialogTitle>
        </DialogHeader>
        {receipt ? (
          <PaymentReceipt
            receipt={receipt}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        ) : (
          <PaymentForm
            amount={amount}
            bookingId={bookingId}
            onSuccess={handlePaymentSuccess}
            onError={(error) => console.error('Payment error:', error)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
