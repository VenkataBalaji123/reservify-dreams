
import { useState } from 'react';
import { IndianRupee } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UnifiedBooking } from "@/types/booking";
import { cancelUnifiedBooking } from './BookingUtils';
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

interface UnifiedBookingCardProps {
  booking: UnifiedBooking;
  onCancelled: () => void;
}

const UnifiedBookingCard = ({ booking, onCancelled }: UnifiedBookingCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleCancel = async () => {
    try {
      if (!user) return;
      await cancelUnifiedBooking(booking.id, user.id);
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      
      onCancelled();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
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

export default UnifiedBookingCard;
