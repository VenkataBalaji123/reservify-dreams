
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IndianRupee } from 'lucide-react';

interface SeatType {
  id: string;
  number: string;
  isAvailable: boolean;
  price: number;
  type: 'seater' | 'sleeper';
}

const generateBusSeats = (): SeatType[] => {
  const seaterRows = ['A', 'B', 'C', 'D', 'E'];
  const seaterColumns = [1, 2, 3];
  const sleeperRows = ['L1', 'L2', 'L3'];
  const sleeperColumns = [1, 2];
  const seats: SeatType[] = [];

  // Generate seater seats
  seaterRows.forEach(row => {
    seaterColumns.forEach(col => {
      seats.push({
        id: `${row}${col}`,
        number: `${row}${col}`,
        isAvailable: Math.random() > 0.3,
        price: 500 + Math.floor(Math.random() * 500),
        type: 'seater'
      });
    });
  });

  // Generate sleeper seats
  sleeperRows.forEach(row => {
    sleeperColumns.forEach(col => {
      seats.push({
        id: `${row}${col}`,
        number: `${row}${col}`,
        isAvailable: Math.random() > 0.3,
        price: 800 + Math.floor(Math.random() * 500),
        type: 'sleeper'
      });
    });
  });

  return seats;
};

const BusSeats = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [seats] = useState<SeatType[]>(generateBusSeats());
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

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;
    navigate(`/checkout`, { 
      state: { 
        busId, 
        selectedSeats,
        totalPrice: getTotalPrice()
      } 
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Select Your Bus Seats</h2>
      
      <Card className="p-6 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Seater Section</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {seats
              .filter(seat => seat.type === 'seater')
              .map((seat) => (
                <button
                  key={seat.id}
                  disabled={!seat.isAvailable}
                  onClick={() => seat.isAvailable && handleSeatSelect(seat.id)}
                  className={`
                    p-4 rounded-lg text-center transition-all
                    ${!seat.isAvailable ? 'bg-gray-200 cursor-not-allowed' : 
                      selectedSeats.includes(seat.id) ? 
                      'bg-primary text-white' : 'bg-white border border-gray-200 hover:border-primary'}
                  `}
                >
                  <div className="font-semibold">{seat.number}</div>
                  <div className="text-sm flex items-center justify-center">
                    <IndianRupee className="h-3 w-3" />
                    {seat.price}
                  </div>
                </button>
              ))}
          </div>

          <h3 className="text-lg font-semibold mb-4">Sleeper Section</h3>
          <div className="grid grid-cols-2 gap-4">
            {seats
              .filter(seat => seat.type === 'sleeper')
              .map((seat) => (
                <button
                  key={seat.id}
                  disabled={!seat.isAvailable}
                  onClick={() => seat.isAvailable && handleSeatSelect(seat.id)}
                  className={`
                    p-4 rounded-lg text-center transition-all
                    ${!seat.isAvailable ? 'bg-gray-200 cursor-not-allowed' : 
                      selectedSeats.includes(seat.id) ? 
                      'bg-primary text-white' : 'bg-white border border-gray-200 hover:border-primary'}
                  `}
                >
                  <div className="font-semibold">{seat.number}</div>
                  <div className="text-sm flex items-center justify-center">
                    <IndianRupee className="h-3 w-3" />
                    {seat.price}
                  </div>
                </button>
              ))}
          </div>
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
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      </Card>

      <div className="flex gap-4 justify-center text-sm">
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

export default BusSeats;
