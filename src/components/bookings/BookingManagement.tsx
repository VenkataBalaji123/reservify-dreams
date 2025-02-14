
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IndianRupee, AlertCircle } from 'lucide-react';
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

const BookingManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_bookings')
        .select(`
          *,
          seats (seat_number),
          event (name)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600">You don't have any bookings yet.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Browse Events
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
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
  );
};

export default BookingManagement;
