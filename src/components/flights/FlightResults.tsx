
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Plane, Clock, Calendar, IndianRupee } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FlightSearchFilters } from './FlightSearch';
import SearchResultsEmpty from '../ui/search-results-empty';

interface FlightResultsProps {
  filters?: FlightSearchFilters;
}

const FlightResults = ({ filters }: FlightResultsProps) => {
  const navigate = useNavigate();
  const [filteredFlights, setFilteredFlights] = useState<any[]>([]);

  const { data: flights, isLoading } = useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flights')
        .select('id, flight_number, airline, departure_city, arrival_city, departure_time, arrival_time, available_seats, base_price')
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    if (!flights) return;
    
    let results = [...flights];
    
    if (filters) {
      // Apply filters
      if (filters.from) {
        results = results.filter(flight => 
          flight.departure_city.toLowerCase().includes(filters.from.toLowerCase())
        );
      }
      
      if (filters.to) {
        results = results.filter(flight => 
          flight.arrival_city.toLowerCase().includes(filters.to.toLowerCase())
        );
      }
      
      if (filters.date) {
        const searchDate = new Date(filters.date);
        searchDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        results = results.filter(flight => {
          const departureDate = new Date(flight.departure_time);
          return departureDate >= searchDate && departureDate < nextDay;
        });
      }
      
      if (filters.airlines && filters.airlines.length > 0) {
        results = results.filter(flight => 
          filters.airlines!.includes(flight.airline)
        );
      }
      
      if (filters.priceRange) {
        results = results.filter(flight => 
          flight.base_price >= filters.priceRange![0] && 
          flight.base_price <= filters.priceRange![1]
        );
      }
      
      if (filters.departureTime) {
        results = results.filter(flight => {
          const hour = new Date(flight.departure_time).getHours();
          
          switch (filters.departureTime) {
            case 'morning':
              return hour >= 5 && hour < 12;
            case 'afternoon':
              return hour >= 12 && hour < 17;
            case 'evening':
              return hour >= 17 && hour < 21;
            case 'night':
              return hour >= 21 || hour < 5;
            default:
              return true;
          }
        });
      }
    }
    
    setFilteredFlights(results);
  }, [flights, filters]);

  const handleSelect = (flightId: string) => {
    navigate(`/flights/${flightId}/seats`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="p-6 animate-pulse">
            <div className="flex justify-between">
              <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
              <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-4 w-3/4 h-4 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!filteredFlights.length) {
    let searchTerm = '';
    if (filters?.from || filters?.to) {
      searchTerm = [filters.from, filters.to].filter(Boolean).join(' to ');
    }
    
    let filterCount = 0;
    if (filters) {
      if (filters.airlines && filters.airlines.length > 0) filterCount++;
      if (filters.departureTime) filterCount++;
      if (filters.priceRange && (filters.priceRange[0] > 1000 || filters.priceRange[1] < 20000)) filterCount++;
      if (filters.date) filterCount++;
    }
    
    return <SearchResultsEmpty type="flights" searchTerm={searchTerm} filterCount={filterCount} />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{filteredFlights.length} flights found</p>
      
      {filteredFlights.map((flight) => (
        <Card key={flight.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">{flight.airline}</h3>
                <p className="text-sm text-gray-500">{flight.flight_number}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="text-center">
                <p className="font-semibold">{new Date(flight.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p className="text-sm text-gray-500">{flight.departure_city}</p>
              </div>

              <div className="hidden md:block">
                <div className="w-32 h-px bg-gray-300 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <p className="text-xs text-gray-500">
                      {(() => {
                        const departure = new Date(flight.departure_time);
                        const arrival = new Date(flight.arrival_time);
                        const diff = Math.abs(arrival.getTime() - departure.getTime());
                        const hours = Math.floor(diff / (1000 * 60 * 60));
                        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        return `${hours}h ${mins}m`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold">{new Date(flight.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
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
        </Card>
      ))}
    </div>
  );
};

export default FlightResults;
