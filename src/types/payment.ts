
export type PaymentMethodType = 'upi' | 'credit_card' | 'debit_card' | 'bank_transfer';

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export interface UPIDetails {
  upiId: string;
}

export interface BankTransferDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface PaymentDetails {
  methodType: PaymentMethodType;
  amount: number;
  cardDetails?: CardDetails;
  upiDetails?: UPIDetails;
  bankDetails?: BankTransferDetails;
}

export interface PaymentReceipt {
  id: string;
  amount: number;
  methodType: PaymentMethodType;
  status: string;
  transactionId: string;
  timestamp: string;
  receiptUrl?: string;
}
