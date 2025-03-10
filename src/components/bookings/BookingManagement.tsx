
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IndianRupee } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

interface UnifiedBooking {
  id: string;
  booking_type: 'flight' | 'train' | 'event' | 'movie';
  item_id: string;
  seat_number: string;
  ticket_status: 'booked' | 'cancelled' | 'completed' | 'expired';
  total_amount: number;
  created_at: string;
  travel_date: string;
  payment?: {
    id: string;
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_method: string;
    transaction_id: string;
  }[];
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
      fetchBookings();
      fetchUnifiedBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_bookings')
        .select(`
          id,
          event_id,
          seat_id,
          total_amount,
          status,
          created_at,
          seats:seat_id(seat_number),
          event:event_id(name)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type guard to ensure data matches our Booking interface
      const validBookings = (data || []).filter((booking): booking is Booking => {
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

      setBookings(validBookings);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnifiedBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('unified_bookings')
        .select('*, payment:payments(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Unified bookings fetched:', data);
      setUnifiedBookings(data || []);
    } catch (error: any) {
      console.error('Error fetching unified bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch unified bookings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('ticket_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelUnifiedBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('unified_bookings')
        .update({ ticket_status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });

      fetchUnifiedBookings();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
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
        <div className="space-y-4">
          {unifiedBookings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Flight, Train and Movie Bookings</h3>
              {unifiedBookings.map((booking) => (
                <Card key={booking.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">
                        {booking.booking_type.charAt(0).toUpperCase() + booking.booking_type.slice(1)} Booking
                      </h3>
                      <p className="text-sm text-gray-600">
                        Booking ID: {booking.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Seat: {booking.seat_number}
                      </p>
                      {booking.travel_date && (
                        <p className="text-sm text-gray-600">
                          Travel Date: {new Date(booking.travel_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-2">
                        <IndianRupee className="h-4 w-4" />
                        <span className="font-semibold">
                          {booking.total_amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          booking.ticket_status === 'booked'
                            ? 'bg-green-100 text-green-800'
                            : booking.ticket_status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : booking.ticket_status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.ticket_status.charAt(0).toUpperCase() + booking.ticket_status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {booking.ticket_status === 'booked' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          Cancel Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelUnifiedBooking(booking.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </Card>
              ))}
            </div>
          )}
          
          {bookings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Event Bookings</h3>
              {bookings.map((booking) => (
                <Card key={booking.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{booking.event.name}</h3>
                      <p className="text-sm text-gray-600">
                        Booking ID: {booking.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Seat: {booking.seats.seat_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-2">
                        <IndianRupee className="h-4 w-4" />
                        <span className="font-semibold">
                          {booking.total_amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          Cancel Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
