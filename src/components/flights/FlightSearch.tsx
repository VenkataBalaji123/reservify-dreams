
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search, Filter, Users, Plane } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export interface FlightSearchFilters {
  from: string;
  to: string;
  date: string;
  passengers: string;
  tripType: string;
  priceRange?: [number, number];
  airlines?: string[];
  departureTime?: string;
}

interface FlightSearchProps {
  onSearch: (filters: FlightSearchFilters) => void;
}

const airlines = [
  "Air India", 
  "Indigo", 
  "Vistara", 
  "SpiceJet", 
  "GoAir"
];

const FlightSearch = ({ onSearch }: FlightSearchProps) => {
  const [filters, setFilters] = useState<FlightSearchFilters>({
    from: '',
    to: '',
    date: '',
    passengers: '1',
    tripType: 'roundtrip',
    priceRange: [1000, 20000],
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Real-time search
  useEffect(() => {
    const requiredFields = [filters.from, filters.to];
    const hasRequiredFields = requiredFields.every(field => field.trim() !== '');
    
    if (hasRequiredFields) {
      const debounceTimeout = setTimeout(() => {
        onSearch(filters);
      }, 500);
      
      return () => clearTimeout(debounceTimeout);
    }
  }, [filters, onSearch]);

  useEffect(() => {
    let count = 0;
    if (filters.airlines && filters.airlines.length > 0) count++;
    if (filters.departureTime) count++;
    if (filters.priceRange && (filters.priceRange[0] > 1000 || filters.priceRange[1] < 20000)) count++;
    
    setActiveFilterCount(count);
  }, [filters]);

  const handleInputChange = (field: keyof FlightSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleAirlineToggle = (airline: string) => {
    setFilters(prev => {
      const currentAirlines = prev.airlines || [];
      const updatedAirlines = currentAirlines.includes(airline)
        ? currentAirlines.filter(a => a !== airline)
        : [...currentAirlines, airline];
      
      return { ...prev, airlines: updatedAirlines };
    });
  };

  const handlePriceRangeChange = (values: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [values[0], values[1]] }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      ...filters,
      priceRange: [1000, 20000],
      airlines: [],
      departureTime: undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl animate-fade-in mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="From"
            className="pl-10"
            value={filters.from}
            onChange={(e) => handleInputChange('from', e.target.value)}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="To"
            className="pl-10"
            value={filters.to}
            onChange={(e) => handleInputChange('to', e.target.value)}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="date"
            className="pl-10"
            value={filters.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <Select 
              value={filters.passengers} 
              onValueChange={(value) => handleInputChange('passengers', value)}
            >
              <SelectTrigger className="h-[42px]">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Passengers" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Passenger</SelectItem>
                <SelectItem value="2">2 Passengers</SelectItem>
                <SelectItem value="3">3 Passengers</SelectItem>
                <SelectItem value="4">4+ Passengers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-[42px] px-3">
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Filters</h4>
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Price Range</h5>
                  <div className="px-2">
                    <Slider
                      defaultValue={[1000, 20000]}
                      value={filters.priceRange}
                      min={1000}
                      max={20000}
                      step={500}
                      onValueChange={handlePriceRangeChange}
                      className="my-6"
                    />
                    <div className="flex justify-between text-sm">
                      <span>₹{filters.priceRange?.[0]}</span>
                      <span>₹{filters.priceRange?.[1]}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Airlines</h5>
                  <div className="space-y-2">
                    {airlines.map((airline) => (
                      <div key={airline} className="flex items-center space-x-2">
                        <Checkbox
                          id={`airline-${airline}`}
                          checked={(filters.airlines || []).includes(airline)}
                          onCheckedChange={() => handleAirlineToggle(airline)}
                        />
                        <label
                          htmlFor={`airline-${airline}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {airline}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Departure Time</h5>
                  <Select 
                    value={filters.departureTime} 
                    onValueChange={(value) => handleInputChange('departureTime', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (5AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                      <SelectItem value="evening">Evening (5PM - 9PM)</SelectItem>
                      <SelectItem value="night">Night (9PM - 5AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button size="sm" onClick={() => setShowAdvancedFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Select value={filters.tripType} onValueChange={(value) => handleInputChange('tripType', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trip Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="roundtrip">Round Trip</SelectItem>
            <SelectItem value="oneway">One Way</SelectItem>
            <SelectItem value="multicity">Multi-City</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          className="w-full md:w-auto ml-auto"
          onClick={handleSearch}
        >
          <Search className="mr-2 h-4 w-4" />
          Search Flights
        </Button>
      </div>
    </div>
  );
};

export default FlightSearch;
