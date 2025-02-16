
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentReceipt as PaymentReceiptType } from '@/types/payment';
import { IndianRupee, Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';

interface PaymentReceiptProps {
  receipt: PaymentReceiptType;
  onDownload?: () => void;
  onShare?: () => void;
}

const PaymentReceipt = ({ receipt, onDownload, onShare }: PaymentReceiptProps) => {
  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Payment Receipt</h2>
        <p className="text-gray-500">Transaction ID: {receipt.transactionId}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount Paid</span>
          <span className="font-semibold flex items-center">
            <IndianRupee className="h-4 w-4" />
            {receipt.amount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method</span>
          <span className="font-semibold capitalize">
            {receipt.methodType.replace('_', ' ')}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Status</span>
          <span className="font-semibold capitalize">
            {receipt.status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Date & Time</span>
          <span className="font-semibold">
            {format(new Date(receipt.timestamp), 'PPp')}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {onDownload && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={onDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
        {onShare && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={onShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </div>
    </Card>
  );
};

export default PaymentReceipt;
