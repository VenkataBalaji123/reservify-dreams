
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedBooking, BookingType } from "@/types/booking";
import { formatDistance, format } from 'date-fns';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Train, 
  Plane, 
  Film, 
  CalendarDays,
  Download
} from 'lucide-react';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingType>('flight');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('unified_bookings')
        .select(`
          *,
          payment:payments(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      booked: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      expired: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const getBookingTypeIcon = (type: BookingType) => {
    const icons = {
      flight: <Plane className="h-5 w-5" />,
      train: <Train className="h-5 w-5" />,
      event: <Calendar className="h-5 w-5" />,
      movie: <Film className="h-5 w-5" />
    };
    return icons[type];
  };

  const handleDownloadTicket = (booking: UnifiedBooking) => {
    // Implementation for ticket download will be added later
    toast.success('Ticket download started');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as BookingType)}>
        <TabsList className="mb-6">
          <TabsTrigger value="flight" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Flights
          </TabsTrigger>
          <TabsTrigger value="train" className="flex items-center gap-2">
            <Train className="h-4 w-4" />
            Trains
          </TabsTrigger>
          <TabsTrigger value="event" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="movie" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            Movies
          </TabsTrigger>
        </TabsList>

        {(['flight', 'train', 'event', 'movie'] as BookingType[]).map((type) => (
          <TabsContent key={type} value={type}>
            <div className="space-y-4">
              {bookings
                .filter(booking => booking.booking_type === type)
                .map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          {getBookingTypeIcon(booking.booking_type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Booking #{booking.id.slice(0, 8)}</h3>
                            <Badge className={getStatusColor(booking.ticket_status)}>
                              {booking.ticket_status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1 mt-2">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />
                              <span>Booked on {format(new Date(booking.booking_date), 'PPP')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Travel date: {format(new Date(booking.travel_date), 'PPP')}</span>
                            </div>
                            {booking.seat_number && (
                              <div className="flex items-center gap-2">
                                <Ticket className="h-4 w-4" />
                                <span>Seat: {booking.seat_number}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-2xl font-bold flex items-center">
                            <IndianRupee className="h-5 w-5" />
                            {booking.total_amount.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.payment?.payment_status || 'pending')}>
                          Payment: {booking.payment?.payment_status || 'pending'}
                        </Badge>
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => handleDownloadTicket(booking)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Ticket
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              {bookings.filter(booking => booking.booking_type === type).length === 0 && (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">No {type} bookings found</p>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate(`/${type}s`)}
                  >
                    Browse {type}s
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BookingHistory;
