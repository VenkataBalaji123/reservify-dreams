
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IndianRupee } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Seat {
  id: string;
  seat_number: string;
  price: number;
  status: string;
}

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'failed';

interface TicketBooking {
  user_id: string | undefined;
  event_id: string | undefined;
  seat_id: string;
  total_amount: number;
  status: BookingStatus;
  payment_status: 'pending' | 'completed' | 'failed';
}

const EventSeats = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      // First get the latest event (the one we just created)
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (eventError) throw eventError;
      if (!eventData) {
        toast({
          title: "Event Not Found",
          description: "No events found in the system.",
          variant: "destructive"
        });
        navigate('/events');
        return;
      }

      // Store the event ID for later use
      setCurrentEventId(eventData.id);

      // Now fetch seats using the event UUID
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .eq('event_id', eventData.id)
        .order('seat_number');

      if (error) throw error;
      setSeats(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch seats. Please try again.",
        variant: "destructive"
      });
      console.error('Error fetching seats:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book tickets.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }

    if (!currentEventId) {
      toast({
        title: "Error",
        description: "Event not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat to proceed.",
        variant: "destructive"
      });
      return;
    }

    try {
      const bookings = selectedSeats.map(seatId => ({
        user_id: user.id,
        event_id: currentEventId,
        seat_id: seatId,
        total_amount: seats.find(seat => seat.id === seatId)?.price || 0,
        status: 'pending' as BookingStatus,
        payment_status: 'pending' as const
      }));

      const { error } = await supabase
        .from('ticket_bookings')
        .insert(bookings);

      if (error) throw error;

      toast({
        title: "Booking Created",
        description: "Your booking has been created successfully. Proceeding to payment.",
      });

      navigate('/payment', {
        state: {
          eventId: currentEventId,
          selectedSeats,
          totalAmount: getTotalPrice()
        }
      });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
      
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-6 gap-4 mb-8">
          {seats.map((seat) => (
            <button
              key={seat.id}
              disabled={seat.status !== 'available'}
              onClick={() => seat.status === 'available' && handleSeatSelect(seat.id)}
              className={`
                p-4 rounded-lg text-center transition-all
                ${seat.status !== 'available' ? 'bg-gray-200 cursor-not-allowed' : 
                  selectedSeats.includes(seat.id) ? 
                  'bg-primary text-white' : 'bg-white border border-gray-200 hover:border-primary'}
              `}
            >
              <div className="font-semibold">{seat.seat_number}</div>
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
              <p className="font-semibold">
                Selected Seats: {selectedSeats.map(id => 
                  seats.find(seat => seat.id === id)?.seat_number
                ).join(', ') || 'None'}
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
            onClick={handleBooking}
          >
            Proceed to Payment
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
    </div>
  );
};

export default EventSeats;
