
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, IndianRupee, Clock, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';

const FlightResults = () => {
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: flights, isLoading } = useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .gte('departure_time', new Date().toISOString())
        .order('departure_time', { ascending: true });

      if (error) throw error;
      return data;
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

  return (
    <div className="space-y-4 animate-fade-in">
      {flights?.map((flight) => (
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
                      {format(new Date(flight.arrival_time), 'HH:mm')}
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
