import { useState } from 'react';
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
  type: 'AC1' | 'AC2' | 'AC3' | 'Sleeper';
  position: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper';
  price: number;
  isAvailable: boolean;
}

const generateTrainSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const types = {
    'AC1': { price: 2000, count: 18 },
    'AC2': { price: 1200, count: 36 },
    'AC3': { price: 800, count: 54 },
    'Sleeper': { price: 400, count: 72 }
  };

  const positions = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];

  Object.entries(types).forEach(([type, { price, count }]) => {
    for (let i = 1; i <= count; i++) {
      seats.push({
        id: `${type}-${i}`,
        number: `${i}`,
        type: type as 'AC1' | 'AC2' | 'AC3' | 'Sleeper',
        position: positions[i % positions.length] as Seat['position'],
        price,
        isAvailable: Math.random() > 0.3
      });
    }
  });

  return seats;
};

const TrainSeats = () => {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [seats] = useState<Seat[]>(generateTrainSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<Seat['type']>('AC3');
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

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

  const handleProceedToPayment = async () => {
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
          booking_type: 'train',
          item_id: trainId,
          seat_number: selectedSeats.join(','),
          travel_date: new Date().toISOString(),
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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Your Train Seats</h2>
      
      <Card className="p-6 mb-6">
        <div className="flex gap-4 mb-6">
          {(['AC1', 'AC2', 'AC3', 'Sleeper'] as const).map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-4 mb-8">
          {seats
            .filter(seat => seat.type === selectedType)
            .map((seat) => (
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
                <div className="font-semibold">Seat {seat.number}</div>
                <div className="text-xs text-gray-500">{seat.position}</div>
                <div className="text-sm flex items-center justify-center mt-1">
                  <IndianRupee className="h-3 w-3" />
                  {seat.price}
                </div>
              </button>
            ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-semibold">
                Selected Seats: {selectedSeats.map(id => {
                  const seat = seats.find(s => s.id === id);
                  return `${seat?.type}-${seat?.number}`;
                }).join(', ') || 'None'}
              </p>
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
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </Button>
        </div>
      </Card>

      <div className="flex gap-4 justify-center text-sm flex-wrap">
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

export default TrainSeats;
