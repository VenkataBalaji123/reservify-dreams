import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IndianRupee } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PaymentDialog from '@/components/payment/PaymentDialog';

interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  price: number;
}

const generateSeats = (): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const columns = [1, 2, 3, 4, 5];
  const seats: Seat[] = [];

  rows.forEach(row => {
    columns.forEach(col => {
      seats.push({
        id: `${row}${col}`,
        number: `${row}${col}`,
        isAvailable: Math.random() > 0.3,
        price: 500 + Math.floor(Math.random() * 1000),
      });
    });
  });

  return seats;
};

const FlightSeats = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      return [...prev, seatId];
    });
  };

  const getTotalPrice = () => {
    return seats
      .filter(seat => selectedSeats.includes(seat.id))
      .reduce((total, seat) => total + seat.price, 0);
  };

  const handleProceedToCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with booking.",
        variant: "destructive"
      });
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a booking record
      const { data: bookingData, error: bookingError } = await supabase
        .from('unified_bookings')
        .insert({
          user_id: user.id,
          booking_type: 'flight',
          item_id: flightId,
          seat_number: selectedSeats.join(','),
          travel_date: new Date().toISOString(), // You might want to get this from the flight details
          total_amount: getTotalPrice(),
          ticket_status: 'booked'
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      setBookingId(bookingData.id);
      setShowPayment(true);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentComplete = () => {
    setShowPayment(false);
    navigate('/booking-confirmation', {
      state: {
        bookingDetails: {
          id: bookingId,
          status: 'confirmed',
          seats: selectedSeats,
          totalAmount: getTotalPrice()
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
      
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-6 gap-4 mb-8">
          {seats.map((seat) => (
            <button
              key={seat.id}
              disabled={!seat.isAvailable}
              onClick={() => seat.isAvailable && handleSeatSelect(seat.id)}
              className={`
                p-4 rounded-lg text-center transition-all
                ${!seat.isAvailable ? 'bg-gray-200 cursor-not-allowed' : 
                  selectedSeats.includes(seat.id) ? 
                  'bg-primary text-white' : 'bg-white border border-gray-200 hover:border-primary'}
              `}
            >
              <div className="font-semibold">{seat.number}</div>
              <div className="text-sm flex items-center justify-center">
                <IndianRupee className="h-3 w-3" />
                {seat.price}
              </div>
            </button>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-semibold">Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
              <p className="text-sm text-gray-500">{selectedSeats.length} seats selected</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold flex items-center">
                <IndianRupee className="h-5 w-5" />
                {getTotalPrice().toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            disabled={selectedSeats.length === 0}
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      </Card>

      <div className="flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200"></div>
          <span>Unavailable</span>
        </div>
      </div>

      {showPayment && bookingId && (
        <PaymentDialog
          open={showPayment}
          onOpenChange={setShowPayment}
          amount={getTotalPrice()}
          bookingId={bookingId}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default FlightSeats;
