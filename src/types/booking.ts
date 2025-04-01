
export type BookingType = 'flight' | 'train' | 'event' | 'movie' | 'premium_service';
export type TicketStatus = 'booked' | 'cancelled' | 'completed' | 'expired';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface UnifiedBooking {
  id: string;
  user_id: string;
  booking_type: BookingType;
  item_id: string;
  seat_number: string | null;
  booking_date: string;
  travel_date: string;
  ticket_status: TicketStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  title: string | null;
  status: string | null;
  amount: number | null;
  description: string | null;
  metadata: any;
  payment?: Payment;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  payment_status: PaymentStatus;
  payment_date: string;
  created_at: string;
}
