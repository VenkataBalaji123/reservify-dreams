
import { useState } from 'react';
import { IndianRupee } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancelEventBooking } from './BookingUtils';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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

interface EventBookingCardProps {
  booking: Booking;
  onCancelled: () => void;
}

const EventBookingCard = ({ booking, onCancelled }: EventBookingCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleCancel = async () => {
    try {
      if (!user) return;
      await cancelEventBooking(booking.id, user.id);
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      
      onCancelled();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
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
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600"
              >
                Cancel Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
};

export default EventBookingCard;
