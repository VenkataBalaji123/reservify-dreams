
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, IndianRupee } from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};

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

  return (
    <div className="max-w-2xl mx-auto p-6">
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
            onClick={() => navigate('/')}
          >
            Book Another
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
