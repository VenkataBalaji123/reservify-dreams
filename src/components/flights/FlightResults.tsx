
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, IndianRupee, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { toast } from "@/components/ui/use-toast";

const FlightResults = () => {
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: flights, isLoading, error } = useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      console.log('Fetching flights data...');
      // Don't filter by departure_time to show all flights
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .order('departure_time', { ascending: true });

      if (error) {
        console.error('Error fetching flights:', error);
        throw error;
      }
      
      console.log('Flights data retrieved:', data);
      return data || [];
    }
  });

  const handleSelect = (flightId: string) => {
    setSelectedFlight(flightId);
    navigate(`/flights/${flightId}/seats`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error('Flight results error:', error);
    return (
      <Card className="p-6 text-center bg-red-50">
        <p className="text-red-500">There was an error loading flights. Please try again later.</p>
      </Card>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No flights available at the moment.</p>
        <p className="text-sm mt-2">Please check back later or try different search criteria.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-gray-500 pb-2">{flights.length} flights found</p>
      {flights.map((flight) => (
        <Card key={flight.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{flight.airline}</h3>
                <p className="text-sm text-gray-500">Flight #{flight.flight_number}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="text-center">
                <p className="font-semibold">{format(new Date(flight.departure_time), 'HH:mm')}</p>
                <p className="text-sm text-gray-500">{flight.departure_city}</p>
              </div>

              <div className="hidden md:block">
                <div className="w-32 h-px bg-gray-300 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <p className="text-xs text-gray-500">
                      {Math.round((new Date(flight.arrival_time).getTime() - new Date(flight.departure_time).getTime()) / (1000 * 60))} min
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold">{format(new Date(flight.arrival_time), 'HH:mm')}</p>
                <p className="text-sm text-gray-500">{flight.arrival_city}</p>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {flight.base_price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500">{flight.available_seats} seats left</p>
                </div>
                <Button onClick={() => handleSelect(flight.id)}>Select</Button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(flight.departure_time), 'dd MMM yyyy')}
            </div>
            {flight.aircraft_type && (
              <div className="flex items-center gap-1">
                <Plane className="h-4 w-4" />
                {flight.aircraft_type}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FlightResults;
