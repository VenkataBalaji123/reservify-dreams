
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bus, IndianRupee, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BusSearchFilters } from './BusSearch';
import SearchResultsEmpty from '../ui/search-results-empty';

const mockBuses = [
  {
    id: 1,
    operator: "RedBus Express",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "06:00 AM",
    arrivalTime: "09:00 AM",
    duration: "3h",
    price: 599,
    seatsAvailable: 32,
    type: "AC Sleeper"
  },
  {
    id: 2,
    operator: "Travel India",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "07:30 AM",
    arrivalTime: "10:30 AM",
    duration: "3h",
    price: 499,
    seatsAvailable: 28,
    type: "AC Seater"
  },
  {
    id: 3,
    operator: "Royal Travels",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "08:00 AM",
    arrivalTime: "11:00 AM",
    duration: "3h",
    price: 699,
    seatsAvailable: 15,
    type: "AC Sleeper"
  },
  {
    id: 4,
    operator: "City Express",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "09:00 AM",
    arrivalTime: "12:00 PM",
    duration: "3h",
    price: 449,
    seatsAvailable: 40,
    type: "Non-AC Seater"
  },
  {
    id: 5,
    operator: "Comfort Travels",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "10:30 AM",
    arrivalTime: "01:30 PM",
    duration: "3h",
    price: 549,
    seatsAvailable: 25,
    type: "AC Seater"
  },
  {
    id: 6,
    operator: "Highway King",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "11:00 AM",
    arrivalTime: "02:00 PM",
    duration: "3h",
    price: 649,
    seatsAvailable: 20,
    type: "AC Sleeper"
  },
  {
    id: 7,
    operator: "Night Rider",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "11:30 PM",
    arrivalTime: "02:30 AM",
    duration: "3h",
    price: 799,
    seatsAvailable: 30,
    type: "AC Sleeper"
  },
  {
    id: 8,
    operator: "Express Connect",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "01:00 PM",
    arrivalTime: "04:00 PM",
    duration: "3h",
    price: 479,
    seatsAvailable: 35,
    type: "Non-AC Seater"
  },
  {
    id: 9,
    operator: "Prime Bus",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "02:30 PM",
    arrivalTime: "05:30 PM",
    duration: "3h",
    price: 599,
    seatsAvailable: 22,
    type: "AC Seater"
  },
  {
    id: 10,
    operator: "Luxury Lines",
    departure: "Mumbai",
    arrival: "Pune",
    departureTime: "04:00 PM",
    arrivalTime: "07:00 PM",
    duration: "3h",
    price: 849,
    seatsAvailable: 18,
    type: "AC Sleeper"
  }
];

interface BusResultsProps {
  filters?: BusSearchFilters;
}

const BusResults = ({ filters }: BusResultsProps) => {
  const navigate = useNavigate();
  const [filteredBuses, setFilteredBuses] = useState(mockBuses);

  useEffect(() => {
    if (!filters) {
      setFilteredBuses(mockBuses);
      return;
    }

    let results = [...mockBuses];

    // Apply filters
    if (filters.from) {
      results = results.filter(bus => 
        bus.departure.toLowerCase().includes(filters.from.toLowerCase())
      );
    }

    if (filters.to) {
      results = results.filter(bus => 
        bus.arrival.toLowerCase().includes(filters.to.toLowerCase())
      );
    }

    if (filters.date) {
      // For mock data, we're not filtering by date since the mock doesn't include dates
      // In a real app, we would filter by date here
    }

    if (filters.busType && filters.busType.length > 0) {
      results = results.filter(bus => 
        filters.busType!.includes(bus.type)
      );
    }

    if (filters.departureTime) {
      results = results.filter(bus => {
        // Extract hour from departure time
        const timeStr = bus.departureTime;
        const match = timeStr.match(/(\d+):(\d+)\s*([AP]M)/i);
        if (!match) return true;
        
        let hour = parseInt(match[1]);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        
        switch (filters.departureTime) {
          case 'morning':
            return hour >= 6 && hour < 12;
          case 'afternoon':
            return hour >= 12 && hour < 18;
          case 'evening':
            return hour >= 18 && hour < 22;
          case 'night':
            return hour >= 22 || hour < 6;
          default:
            return true;
        }
      });
    }

    if (filters.priceRange) {
      results = results.filter(bus => 
        bus.price >= filters.priceRange![0] && 
        bus.price <= filters.priceRange![1]
      );
    }

    if (filters.seatsAvailable) {
      results = results.filter(bus => 
        bus.seatsAvailable >= filters.seatsAvailable!
      );
    }

    setFilteredBuses(results);
  }, [filters]);

  const handleSelect = (busId: number) => {
    navigate(`/buses/${busId}/seats`);
  };

  if (filteredBuses.length === 0) {
    let searchTerm = '';
    if (filters?.from || filters?.to) {
      searchTerm = [filters.from, filters.to].filter(Boolean).join(' to ');
    }
    
    let filterCount = 0;
    if (filters) {
      if (filters.busType && filters.busType.length > 0) filterCount++;
      if (filters.departureTime) filterCount++;
      if (filters.priceRange && (filters.priceRange[0] > 300 || filters.priceRange[1] < 1000)) filterCount++;
      if (filters.seatsAvailable) filterCount++;
      if (filters.date) filterCount++;
    }
    
    return <SearchResultsEmpty type="buses" searchTerm={searchTerm} filterCount={filterCount} />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-gray-500">{filteredBuses.length} buses found</p>
      
      {filteredBuses.map((bus) => (
        <Card key={bus.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Bus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{bus.operator}</h3>
                <p className="text-sm text-gray-500">{bus.type}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="text-center">
                <p className="font-semibold">{bus.departureTime}</p>
                <p className="text-sm text-gray-500">{bus.departure}</p>
              </div>

              <div className="hidden md:block">
                <div className="w-32 h-px bg-gray-300 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <p className="text-xs text-gray-500">{bus.duration}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold">{bus.arrivalTime}</p>
                <p className="text-sm text-gray-500">{bus.arrival}</p>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {bus.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500">{bus.seatsAvailable} seats left</p>
                </div>
                <Button onClick={() => handleSelect(bus.id)}>Select</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BusResults;
