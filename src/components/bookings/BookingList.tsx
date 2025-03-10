
import { useState } from 'react';
import UnifiedBookingCard from './UnifiedBookingCard';
import EventBookingCard from './EventBookingCard';
import { UnifiedBooking } from '@/types/booking';

interface EventBooking {
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

interface BookingListProps {
  unifiedBookings: UnifiedBooking[];
  eventBookings: EventBooking[];
  onBookingCancelled: () => void;
}

const BookingList = ({ 
  unifiedBookings, 
  eventBookings,
  onBookingCancelled
}: BookingListProps) => {
  const hasUnifiedBookings = unifiedBookings.length > 0;
  const hasEventBookings = eventBookings.length > 0;

  return (
    <div className="space-y-4">
      {hasUnifiedBookings && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Flight, Train and Movie Bookings</h3>
          {unifiedBookings.map((booking) => (
            <UnifiedBookingCard 
              key={booking.id} 
              booking={booking} 
              onCancelled={onBookingCancelled}
            />
          ))}
        </div>
      )}
      
      {hasEventBookings && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Event Bookings</h3>
          {eventBookings.map((booking) => (
            <EventBookingCard 
              key={booking.id} 
              booking={booking} 
              onCancelled={onBookingCancelled}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;
