
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, IndianRupee } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockFlights = [
  {
    id: 1,
    airline: "Sky Airways",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "08:00 AM",
    arrivalTime: "10:30 AM",
    duration: "2h 30m",
    price: 4999,
    seatsAvailable: 42,
  },
  {
    id: 2,
    airline: "Ocean Air",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "10:30 AM",
    arrivalTime: "01:00 PM",
    duration: "2h 30m",
    price: 5499,
    seatsAvailable: 28,
  },
  {
    id: 3,
    airline: "Indigo Airways",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "02:00 PM",
    arrivalTime: "04:30 PM",
    duration: "2h 30m",
    price: 4599,
    seatsAvailable: 15,
  },
  // ... Adding more flights with different timings and prices
  {
    id: 4,
    airline: "Air India",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "04:30 PM",
    arrivalTime: "07:00 PM",
    duration: "2h 30m",
    price: 6299,
    seatsAvailable: 32,
  },
  {
    id: 5,
    airline: "Vistara",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "06:45 PM",
    arrivalTime: "09:15 PM",
    duration: "2h 30m",
    price: 5899,
    seatsAvailable: 24,
  },
  {
    id: 6,
    airline: "SpiceJet",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "08:30 PM",
    arrivalTime: "11:00 PM",
    duration: "2h 30m",
    price: 4799,
    seatsAvailable: 38,
  },
  {
    id: 7,
    airline: "Go Air",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "05:15 AM",
    arrivalTime: "07:45 AM",
    duration: "2h 30m",
    price: 4299,
    seatsAvailable: 45,
  },
  {
    id: 8,
    airline: "Air Asia",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "11:45 AM",
    arrivalTime: "02:15 PM",
    duration: "2h 30m",
    price: 4999,
    seatsAvailable: 29,
  },
  {
    id: 9,
    airline: "Jet Airways",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "03:30 PM",
    arrivalTime: "06:00 PM",
    duration: "2h 30m",
    price: 6099,
    seatsAvailable: 19,
  },
  {
    id: 10,
    airline: "Alliance Air",
    departure: "New Delhi (DEL)",
    arrival: "Mumbai (BOM)",
    departureTime: "07:15 PM",
    arrivalTime: "09:45 PM",
    duration: "2h 30m",
    price: 5299,
    seatsAvailable: 36,
  },
];

const FlightResults = () => {
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSelect = (flightId: number) => {
    setSelectedFlight(flightId);
    navigate(`/flights/${flightId}/seats`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {mockFlights.map((flight) => (
        <Card key={flight.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{flight.airline}</h3>
                <p className="text-sm text-gray-500">Flight #{flight.id}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="text-center">
                <p className="font-semibold">{flight.departureTime}</p>
                <p className="text-sm text-gray-500">{flight.departure}</p>
              </div>

              <div className="hidden md:block">
                <div className="w-32 h-px bg-gray-300 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <p className="text-xs text-gray-500">{flight.duration}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold">{flight.arrivalTime}</p>
                <p className="text-sm text-gray-500">{flight.arrival}</p>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {flight.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500">{flight.seatsAvailable} seats left</p>
                </div>
                <Button onClick={() => handleSelect(flight.id)}>Select</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FlightResults;
