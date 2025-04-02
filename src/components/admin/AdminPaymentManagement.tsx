
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Eye, 
  Download, 
  CreditCard,
  User,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type PaymentWithDetails = {
  id: string;
  booking_id?: string;
  amount: number;
  payment_status: string;
  payment_date: string;
  created_at: string;
  payment_method: string | null;
  transaction_id: string | null;
  receipt_url: string | null;
  ticket_url: string | null;
  booking?: {
    id?: string;
    title: string | null;
    booking_type: string;
    total_amount: number;
    user?: {
      email: string | null;
      profile?: {
        first_name: string | null;
        last_name: string | null;
      };
    };
  };
};

const AdminPaymentManagement = () => {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null);
  
  useEffect(() => {
    fetchPayments();
  }, []);
  
  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      
      // Get payments with booking details
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          booking:booking_id (
            id,
            title,
            booking_type,
            total_amount,
            user:user_id (
              email,
              profile:profiles (
                first_name,
                last_name
              )
            )
          )
        `)
        .order("payment_date", { ascending: false });
        
      if (error) throw error;
      
      // Safely type the data as PaymentWithDetails[]
      const typedData: PaymentWithDetails[] = data || [];
      setPayments(typedData);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredPayments = payments.filter(payment => {
    const transactionId = payment.transaction_id?.toLowerCase() || "";
    const paymentMethod = payment.payment_method?.toLowerCase() || "";
    const userName = `${payment.booking?.user?.profile?.first_name || ""} ${payment.booking?.user?.profile?.last_name || ""}`.toLowerCase();
    const userEmail = payment.booking?.user?.email?.toLowerCase() || "";
    const paymentStatus = payment.payment_status.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return (
      transactionId.includes(search) ||
      paymentMethod.includes(search) ||
      userName.includes(search) ||
      userEmail.includes(search) ||
      paymentStatus.includes(search)
    );
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <RotateCcw className="h-3 w-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <HelpCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };
  
  const handleViewDetails = (payment: PaymentWithDetails) => {
    setSelectedPayment(payment);
    setIsDetailsDialogOpen(true);
  };
  
  const handleRefund = (payment: PaymentWithDetails) => {
    setSelectedPayment(payment);
    setIsRefundDialogOpen(true);
  };
  
  const processRefund = async () => {
    if (!selectedPayment) return;
    
    try {
      setIsLoading(true);
      
      // Update payment status to refunded
      const { error: paymentError } = await supabase
        .from("payments")
        .update({ payment_status: "refunded" })
        .eq("id", selectedPayment.id);
        
      if (paymentError) throw paymentError;
      
      // If there's a booking, update its status too
      if (selectedPayment.booking && selectedPayment.booking_id) {
        const { error: bookingError } = await supabase
          .from("unified_bookings")
          .update({ status: "refunded", ticket_status: "cancelled" })
          .eq("id", selectedPayment.booking_id);
          
        if (bookingError) throw bookingError;
      }
      
      toast.success("Payment refunded successfully");
      setIsRefundDialogOpen(false);
      await fetchPayments();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && payments.length === 0) {
    return (
      <div className="flex justify-center my-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Payment Management</CardTitle>
        <CardDescription>Monitor and manage all transaction payments</CardDescription>
        <div className="flex items-center mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search payments..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.transaction_id || 
                        <span className="text-gray-400 text-xs">Not available</span>
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>
                          {payment.booking?.user?.profile?.first_name} {payment.booking?.user?.profile?.last_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {payment.booking?.user?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${payment.amount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">
                        {payment.booking?.booking_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize">
                        {payment.payment_method || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.payment_date ? (
                        format(new Date(payment.payment_date), "MMM d, yyyy")
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.payment_status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDetails(payment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.payment_status === "completed" && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRefund(payment)}
                        >
                          <RotateCcw className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {/* Payment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              View complete payment transaction information
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Transaction ID</span>
                  <span className="text-sm font-mono">
                    {selectedPayment.transaction_id || "Not available"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <span>{getStatusBadge(selectedPayment.payment_status)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Amount</span>
                  <span className="text-sm font-medium">${selectedPayment.amount.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Payment Method</span>
                  <span className="text-sm capitalize">
                    {selectedPayment.payment_method || "Unknown"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Date</span>
                  <span className="text-sm">
                    {selectedPayment.payment_date ? (
                      format(new Date(selectedPayment.payment_date), "MMMM d, yyyy 'at' h:mm a")
                    ) : (
                      "Not available"
                    )}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">
                        {selectedPayment.booking?.user?.profile?.first_name} {selectedPayment.booking?.user?.profile?.last_name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">
                        {selectedPayment.booking?.user?.email || "No email available"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Booking Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Booking Type</span>
                      <span className="text-sm capitalize">
                        {selectedPayment.booking?.booking_type || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Item</span>
                      <span className="text-sm">
                        {selectedPayment.booking?.title || "Not available"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {(selectedPayment.receipt_url || selectedPayment.ticket_url) && (
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Documents</h4>
                    <div className="flex space-x-2">
                      {selectedPayment.receipt_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => window.open(selectedPayment.receipt_url!, '_blank')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Receipt
                        </Button>
                      )}
                      
                      {selectedPayment.ticket_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => window.open(selectedPayment.ticket_url!, '_blank')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Ticket
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              type="button" 
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Refund Confirmation Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Are you sure you want to refund this payment? This action will cancel the associated booking.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Customer</span>
                  <span className="text-sm">
                    {selectedPayment.booking?.user?.profile?.first_name} {selectedPayment.booking?.user?.profile?.last_name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Transaction ID</span>
                  <span className="text-sm font-mono">
                    {selectedPayment.transaction_id || "Not available"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Amount to Refund</span>
                  <span className="text-sm font-medium">${selectedPayment.amount.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Booking</span>
                  <span className="text-sm">
                    {selectedPayment.booking?.title || "Not available"}
                  </span>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-800">
                  <p>
                    This will mark the payment as refunded in the system. Please ensure you process the actual refund through your payment provider separately.
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsRefundDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={processRefund}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const Mail = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default AdminPaymentManagement;
