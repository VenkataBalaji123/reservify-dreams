
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUnifiedBookings, fetchEventBookings } from './BookingUtils';
import BookingList from './BookingList';
import { UnifiedBooking } from '@/types/booking';

// Event Booking interface
interface Booking {
  id: string;
  event_id: string;
  seat_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed';
  created_at: string;
  seats: {
    seat_number: string;
  };
  event: {
    name: string;
  };
}

const BookingManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unifiedBookings, setUnifiedBookings] = useState<UnifiedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllBookings();
    }
  }, [user]);

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      // Fetch both types of bookings in parallel
      const [eventBookingsData, unifiedBookingsData] = await Promise.all([
        fetchEventBookings(user?.id || ''),
        fetchUnifiedBookings(user?.id || '')
      ]);
      
      // Type validation - filter out any invalid records
      const validEventBookings = eventBookingsData.filter((booking): booking is Booking => {
        return (
          booking !== null &&
          typeof booking.id === 'string' &&
          typeof booking.event_id === 'string' &&
          typeof booking.seat_id === 'string' &&
          typeof booking.total_amount === 'number' &&
          booking.seats !== null &&
          typeof booking.seats.seat_number === 'string' &&
          booking.event !== null &&
          typeof booking.event.name === 'string'
        );
      });
      
      setBookings(validEventBookings);
      setUnifiedBookings(unifiedBookingsData);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-600">Please sign in to view your bookings.</p>
        <Button className="mt-4" onClick={() => navigate('/signin')}>
          Sign In
        </Button>
      </Card>
    );
  }

  const hasBookings = bookings.length > 0 || unifiedBookings.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {!hasBookings ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600">You don't have any bookings yet.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Browse Events
          </Button>
        </Card>
      ) : (
        <BookingList 
          unifiedBookings={unifiedBookings}
          eventBookings={bookings}
          onBookingCancelled={fetchAllBookings}
        />
      )}
    </div>
  );
};

export default BookingManagement;
