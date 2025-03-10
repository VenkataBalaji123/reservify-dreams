
import { BookingType, TicketStatus, UnifiedBooking } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";

// Validate and convert booking_type to a valid BookingType
export const validateBookingType = (type: string): BookingType => {
  const validTypes: BookingType[] = ['flight', 'train', 'event', 'movie'];
  return validTypes.includes(type as BookingType) 
    ? (type as BookingType) 
    : 'event'; // Default fallback
};

// Cancel a unified booking
export const cancelUnifiedBooking = async (bookingId: string, userId: string) => {
  const { error } = await supabase
    .from('unified_bookings')
    .update({ ticket_status: 'cancelled' })
    .eq('id', bookingId)
    .eq('user_id', userId);
  
  if (error) throw error;
  return { success: true };
};

// Cancel an event booking
export const cancelEventBooking = async (bookingId: string, userId: string) => {
  const { error } = await supabase
    .from('ticket_bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('user_id', userId);
  
  if (error) throw error;
  return { success: true };
};

// Fetch unified bookings (flights, trains, movies)
export const fetchUnifiedBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from('unified_bookings')
    .select('*, payment:payments(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Transform data to ensure booking_type is of valid BookingType
  const typedBookings = (data || []).map(booking => {
    const validBookingType = validateBookingType(booking.booking_type);
    return {
      ...booking,
      booking_type: validBookingType
    } as UnifiedBooking;
  });
  
  return typedBookings;
};

// Fetch event bookings
export const fetchEventBookings = async (userId: string) => {
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
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data || [];
};
