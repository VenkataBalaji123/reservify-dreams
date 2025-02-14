
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IndianRupee } from 'lucide-react';

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
  const [seats] = useState<Seat[]>(generateMovieSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

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

  const handleProceedToBooking = () => {
    // Will be implemented when connecting to backend
    console.log('Selected seats:', selectedSeats);
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
            onClick={handleProceedToBooking}
          >
            Proceed to Payment
          </Button>
        </div>
      </Card>

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
