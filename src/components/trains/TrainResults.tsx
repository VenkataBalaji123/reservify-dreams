
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Train, Clock, MapPin, Users, Shield, Coffee } from 'lucide-react';

const SAMPLE_TRAINS = [
  { 
    id: 1, 
    name: 'Rajdhani Express', 
    from: 'Delhi', 
    to: 'Mumbai', 
    departure: '06:00', 
    arrival: '22:00', 
    price: 2500,
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3',
    trainNumber: '12951',
    availableSeats: 82,
    hasFood: true,
    distance: '1,384 km'
  },
  { 
    id: 2, 
    name: 'Shatabdi Express', 
    from: 'Chennai', 
    to: 'Bangalore', 
    departure: '08:00', 
    arrival: '14:00', 
    price: 1800,
    image: 'https://images.unsplash.com/photo-1540544660406-6a69dacb2804',
    trainNumber: '12007',
    availableSeats: 54,
    hasFood: true,
    distance: '346 km'
  },
  { 
    id: 3, 
    name: 'Duronto Express', 
    from: 'Kolkata', 
    to: 'Delhi', 
    departure: '15:30', 
    arrival: '04:30', 
    price: 2200,
    image: 'https://images.unsplash.com/photo-1535535112387-56ffe8db21ff',
    trainNumber: '12273',
    availableSeats: 46,
    hasFood: true,
    distance: '1,525 km'
  },
];

const TrainResults = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {SAMPLE_TRAINS.map((train) => (
        <Card key={train.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <img 
                src={train.image} 
                alt={train.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{train.name}</h3>
                  <p className="text-gray-600">Train #{train.trainNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  {train.hasFood && (
                    <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                      <Coffee className="w-4 h-4 text-green-500" />
                      <span>Meals Available</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">{train.from}</p>
                    <p className="text-sm text-gray-500">{train.departure}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">{train.to}</p>
                    <p className="text-sm text-gray-500">{train.arrival}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>{train.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>{train.availableSeats} seats left</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                <div className="text-2xl font-bold mb-4 md:mb-0">₹{train.price}</div>
                <div className="flex gap-4">
                  <Button variant="outline">
                    View Schedule
                  </Button>
                  <Button onClick={() => navigate(`/trains/${train.id}/seats`)}>
                    Select Seats
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TrainResults;
