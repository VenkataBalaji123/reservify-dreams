
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, Calendar, MapPin, ArrowRight, Download, Share2, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { BookingType } from "@/types/booking";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface TicketReceiptProps {
  bookingId: string;
  onDownload?: () => void;
  onShare?: () => void;
}

interface BookingDetails {
  id: string;
  booking_type: BookingType;
  item_id: string;
  seat_number: string;
  travel_date: string;
  total_amount: number;
  booking_date: string;
  item_details?: any;
  payment?: {
    payment_method: string;
    transaction_id: string;
    payment_date: string;
  };
}

const TicketReceipt = ({ bookingId, onDownload, onShare }: TicketReceiptProps) => {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Fetch the booking
        const { data: bookingData, error: bookingError } = await supabase
          .from('unified_bookings')
          .select(`
            *,
            payment:payments(*)
          `)
          .eq('id', bookingId)
          .single();

        if (bookingError) throw bookingError;
        if (!bookingData) throw new Error('Booking not found');

        // Fetch item details based on booking type
        let itemDetails = null;
        if (bookingData.booking_type === 'flight') {
          const { data } = await supabase
            .from('flights')
            .select('*')
            .eq('id', bookingData.item_id)
            .single();
          itemDetails = data;
        } else if (bookingData.booking_type === 'train') {
          const { data } = await supabase
            .from('train_routes')
            .select('*')
            .eq('id', bookingData.item_id)
            .single();
          itemDetails = data;
        } else if (bookingData.booking_type === 'event') {
          const { data } = await supabase
            .from('events')
            .select('*')
            .eq('id', bookingData.item_id)
            .single();
          itemDetails = data;
        } else if (bookingData.booking_type === 'movie') {
          const { data } = await supabase
            .from('movies')
            .select('*')
            .eq('id', bookingData.item_id)
            .single();
          itemDetails = data;
        }

        setBooking({
          ...bookingData,
          item_details: itemDetails,
          payment: bookingData.payment?.[0] || null
        });
      } catch (err: any) {
        console.error('Error fetching booking details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  if (loading) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="text-center">Loading ticket details...</div>
      </Card>
    );
  }

  if (error || !booking) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="text-center text-red-500">
          {error || 'Unable to load ticket details'}
        </div>
      </Card>
    );
  }

  // Generate appropriate title and details based on booking type
  const getTypeSpecificDetails = () => {
    const details = booking.item_details;
    
    if (!details) {
      return {
        title: 'Booking Details',
        locationInfo: 'Location information unavailable',
        timeInfo: 'Time information unavailable',
        additionalInfo: null
      };
    }

    switch (booking.booking_type) {
      case 'flight':
        return {
          title: `Flight Ticket - ${details.flight_number}`,
          locationInfo: (
            <div className="flex items-center">
              <div>
                <div className="font-semibold">{details.departure_city}</div>
                <div className="text-xs">{format(new Date(details.departure_time), 'MMM d, h:mm a')}</div>
              </div>
              <ArrowRight className="mx-2 h-4 w-4" />
              <div>
                <div className="font-semibold">{details.arrival_city}</div>
                <div className="text-xs">{format(new Date(details.arrival_time), 'MMM d, h:mm a')}</div>
              </div>
            </div>
          ),
          timeInfo: `${details.airline} | ${details.aircraft_type || 'Aircraft'}`,
          additionalInfo: (
            <div className="text-sm text-gray-600">
              <div>Flight Status: {details.status}</div>
            </div>
          )
        };
      case 'train':
        return {
          title: `Train Ticket - ${details.train_number}`,
          locationInfo: (
            <div className="flex items-center">
              <div>
                <div className="font-semibold">{details.departure_station}</div>
                <div className="text-xs">{format(new Date(details.departure_time), 'MMM d, h:mm a')}</div>
              </div>
              <ArrowRight className="mx-2 h-4 w-4" />
              <div>
                <div className="font-semibold">{details.arrival_station}</div>
                <div className="text-xs">{format(new Date(details.arrival_time), 'MMM d, h:mm a')}</div>
              </div>
            </div>
          ),
          timeInfo: `${details.train_name} | ${details.train_type}`,
          additionalInfo: (
            <div className="text-sm text-gray-600">
              <div>Train Status: {details.status}</div>
            </div>
          )
        };
      case 'event':
        return {
          title: `Event Ticket - ${details.name}`,
          locationInfo: (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{details.location}</span>
            </div>
          ),
          timeInfo: (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(details.start_date), 'PPp')}</span>
            </div>
          ),
          additionalInfo: (
            <div className="text-sm text-gray-600">
              <div>{details.event_type}</div>
              <div className="mt-1">{details.description?.substring(0, 100)}{details.description?.length > 100 ? '...' : ''}</div>
            </div>
          )
        };
      case 'movie':
        return {
          title: `Movie Ticket - ${details.title}`,
          locationInfo: (
            <div className="flex items-center">
              <span>Language: {details.language_id}</span>
            </div>
          ),
          timeInfo: (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{details.release_date ? format(new Date(details.release_date), 'PPp') : 'Show time unavailable'}</span>
            </div>
          ),
          additionalInfo: (
            <div className="text-sm text-gray-600">
              <div>Duration: {details.duration} minutes</div>
              <div className="mt-1">{details.description?.substring(0, 100)}{details.description?.length > 100 ? '...' : ''}</div>
            </div>
          )
        };
      default:
        return {
          title: 'Booking Details',
          locationInfo: 'Location information unavailable',
          timeInfo: 'Time information unavailable',
          additionalInfo: null
        };
    }
  };

  const { title, locationInfo, timeInfo, additionalInfo } = getTypeSpecificDetails();

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-500">Booking ID: {booking.id.substring(0, 8)}...</p>
          </div>
          <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            Confirmed
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Departure/Event</p>
            <div className="mt-1">{locationInfo}</div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Details</p>
            <div className="mt-1">{timeInfo}</div>
          </div>
        </div>

        {additionalInfo && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">Additional Information</p>
            {additionalInfo}
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 mb-2">Ticket Information</p>
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500">Seat(s)</p>
              <p className="font-medium">{booking.seat_number || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ticket Type</p>
              <p className="font-medium capitalize">{booking.booking_type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Booking Date</p>
              <p className="font-medium">{format(new Date(booking.booking_date), 'PP')}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 mb-2">Payment Information</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Amount Paid</p>
              <p className="font-medium flex items-center">
                <IndianRupee className="h-3 w-3" />
                {booking.total_amount.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="font-medium capitalize">
                {booking.payment?.payment_method || 'Not specified'}
              </p>
            </div>
            {booking.payment?.transaction_id && (
              <div>
                <p className="text-xs text-gray-500">Transaction ID</p>
                <p className="font-medium">{booking.payment.transaction_id}</p>
              </div>
            )}
            {booking.payment?.payment_date && (
              <div>
                <p className="text-xs text-gray-500">Payment Date</p>
                <p className="font-medium">
                  {format(new Date(booking.payment.payment_date), 'PP')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        {onDownload && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={onDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Ticket
          </Button>
        )}
        {onShare && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={onShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Ticket
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TicketReceipt;
