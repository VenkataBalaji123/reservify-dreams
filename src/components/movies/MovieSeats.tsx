import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IndianRupee, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Seat {
  id: string;
  row: string;
  number: number;
  category: 'regular' | 'premium' | 'recliner';
  price: number;
  isAvailable: boolean;
}

const generateMovieSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const categories = {
    premium: { rows: ['A', 'B'], price: 400 },
    regular: { rows: ['C', 'D', 'E', 'F', 'G'], price: 250 },
    recliner: { rows: ['R'], price: 600 }
  };

  Object.entries(categories).forEach(([category, { rows, price }]) => {
    rows.forEach(row => {
      for (let i = 1; i <= 12; i++) {
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          category: category as 'regular' | 'premium' | 'recliner',
          price,
          isAvailable: Math.random() > 0.3
        });
      }
    });
  });

  return seats;
};

const MovieSeats = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [seats] = useState<Seat[]>(generateMovieSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      }
      return [...prev, seatId];
    });
  };

  const getTotalPrice = () => {
    return seats
      .filter(seat => selectedSeats.includes(seat.id))
      .reduce((total, seat) => total + seat.price, 0);
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful booking
      const bookingDetails = {
        id: Math.random().toString(36).substring(7),
        seats: selectedSeats,
        totalAmount: getTotalPrice(),
        status: 'confirmed'
      };

      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed!",
      });

      // Navigate to booking confirmation
      navigate('/booking-confirmation', { state: { bookingDetails } });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setShowPayment(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Your Movie Seats</h2>
      
      <Card className="p-6 mb-6">
        <div className="mb-8">
          <div className="w-full h-8 bg-gray-800 text-white text-center mb-8">Screen</div>
          
          {['recliner', 'premium', 'regular'].map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
              <div className="grid grid-cols-12 gap-2">
                {seats
                  .filter(seat => seat.category === category)
                  .map((seat) => (
                    <button
                      key={seat.id}
                      disabled={!seat.isAvailable}
                      onClick={() => seat.isAvailable && handleSeatSelect(seat.id)}
                      className={`
                        p-2 rounded text-center text-sm transition-all
                        ${!seat.isAvailable ? 'bg-gray-200 cursor-not-allowed' : 
                          selectedSeats.includes(seat.id) ? 
                          'bg-primary text-white' : 'bg-white border border-gray-200 hover:border-primary'}
                      `}
                    >
                      {seat.row}{seat.number}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-semibold">Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
              <p className="text-sm text-gray-500">{selectedSeats.length} seats selected</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold flex items-center">
                <IndianRupee className="h-5 w-5" />
                {getTotalPrice().toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            disabled={selectedSeats.length === 0}
            onClick={() => setShowPayment(true)}
          >
            Proceed to Payment
          </Button>
        </div>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="4111 1111 1111 1111"
                required
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  required
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  required
                  maxLength={3}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ₹{getTotalPrice().toLocaleString('en-IN')}
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex gap-4 justify-center text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default MovieSeats;
