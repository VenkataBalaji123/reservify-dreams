
import { BookingType, TicketStatus, UnifiedBooking } from "@/types/booking";
import { supabase } from "@/integrations/supabase/client";

// Validate and convert booking_type to a valid BookingType
export const validateBookingType = (type: string): BookingType => {
  const validTypes: BookingType[] = ['flight', 'train', 'event', 'movie', 'premium_service'];
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
  
  // Transform data to ensure booking_type is of valid BookingType and payment is properly typed
  const typedBookings = (data || []).map(booking => {
    const validBookingType = validateBookingType(booking.booking_type);
    
    // Create a properly typed UnifiedBooking object
    const typedBooking: UnifiedBooking = {
      id: booking.id,
      user_id: booking.user_id,
      booking_type: validBookingType,
      item_id: booking.item_id,
      seat_number: booking.seat_number,
      booking_date: booking.booking_date,
      travel_date: booking.travel_date,
      ticket_status: booking.ticket_status as TicketStatus,
      total_amount: booking.total_amount,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      // Add the new required properties
      title: booking.title || null,
      status: booking.status || null,
      amount: booking.amount || null,
      description: booking.description || null,
      metadata: booking.metadata || {},
      // Convert payment array to a single payment object if it exists
      payment: booking.payment && booking.payment.length > 0 ? {
        id: booking.payment[0].id,
        booking_id: booking.payment[0].booking_id,
        amount: booking.payment[0].amount,
        payment_method: booking.payment[0].payment_method,
        transaction_id: booking.payment[0].transaction_id,
        payment_status: booking.payment[0].payment_status,
        payment_date: booking.payment[0].payment_date,
        created_at: booking.payment[0].created_at
      } : undefined
    };
    
    return typedBooking;
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
