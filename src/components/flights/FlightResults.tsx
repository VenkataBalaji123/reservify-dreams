
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane } from 'lucide-react';

const mockFlights = [
  {
    id: 1,
    airline: "Sky Airways",
    departure: "New York (JFK)",
    arrival: "London (LHR)",
    departureTime: "08:00 AM",
    arrivalTime: "9:30 PM",
    duration: "7h 30m",
    price: 599,
  },
  {
    id: 2,
    airline: "Ocean Air",
    departure: "New York (JFK)",
    arrival: "London (LHR)",
    departureTime: "10:30 AM",
    arrivalTime: "11:45 PM",
    duration: "7h 15m",
    price: 649,
  },
];

const FlightResults = () => {
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
                  <p className="text-2xl font-bold">${flight.price}</p>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
                <Button>Select</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FlightResults;
