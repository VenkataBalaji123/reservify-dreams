
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, IndianRupee, Download, Share2 } from 'lucide-react';
import TicketReceipt from './TicketReceipt';
import { useState } from 'react';
import { toast } from 'sonner';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};
  const [showReceipt, setShowReceipt] = useState(false);

  if (!bookingDetails) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-6 text-center">
          <p className="text-gray-600">No booking details found.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleDownloadTicket = () => {
    toast.success("Downloading your ticket...");
    // In a real implementation, this would trigger the actual download
    console.log("Downloading ticket for booking:", bookingDetails.id);
  };

  const handleShareTicket = () => {
    toast.success("Sharing option opened");
    // In a real implementation, this would open share options
    console.log("Sharing ticket for booking:", bookingDetails.id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {showReceipt ? (
        <div>
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setShowReceipt(false)}
          >
            ← Back to Confirmation
          </Button>
          <TicketReceipt 
            bookingId={bookingDetails.id} 
            onDownload={handleDownloadTicket}
            onShare={handleShareTicket}
          />
        </div>
      ) : (
        <Card className="p-6">
          <div className="text-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="text-gray-600">Thank you for your booking.</p>
          </div>

          <div className="space-y-4">
            <div className="border-t border-b py-4">
              <h3 className="font-semibold mb-2">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Booking ID</p>
                  <p className="font-medium">{bookingDetails.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-medium capitalize">{bookingDetails.status}</p>
                </div>
                <div>
                  <p className="text-gray-600">Selected Seats</p>
                  <p className="font-medium">{bookingDetails.seats.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-medium flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {bookingDetails.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/bookings')}
            >
              View All Bookings
            </Button>
            <Button 
              className="flex-1"
              onClick={() => setShowReceipt(true)}
            >
              View Ticket
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BookingConfirmation;
