
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Calendar, Search, Clock, Filter, IndianRupee, Users 
} from 'lucide-react';
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

export interface BusSearchFilters {
  from: string;
  to: string;
  date: string;
  busType?: string[];
  departureTime?: string;
  priceRange?: [number, number];
  seatsAvailable?: number;
}

interface BusSearchProps {
  onSearch: (filters: BusSearchFilters) => void;
}

const busTypes = [
  "AC Sleeper",
  "AC Seater",
  "Non-AC Sleeper",
  "Non-AC Seater",
  "Volvo"
];

const BusSearch = ({ onSearch }: BusSearchProps) => {
  const [filters, setFilters] = useState<BusSearchFilters>({
    from: '',
    to: '',
    date: '',
    priceRange: [300, 1000],
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

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.busType && filters.busType.length > 0) count++;
    if (filters.departureTime) count++;
    if (filters.priceRange && (filters.priceRange[0] > 300 || filters.priceRange[1] < 1000)) count++;
    if (filters.seatsAvailable) count++;
    
    setActiveFilterCount(count);
  }, [filters]);

  const handleInputChange = (field: keyof BusSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleBusTypeToggle = (busType: string) => {
    setFilters(prev => {
      const currentTypes = prev.busType || [];
      const updatedTypes = currentTypes.includes(busType)
        ? currentTypes.filter(type => type !== busType)
        : [...currentTypes, busType];
      
      return { ...prev, busType: updatedTypes };
    });
  };

  const handlePriceRangeChange = (values: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [values[0], values[1]] }));
  };

  const clearFilters = () => {
    setFilters({
      ...filters,
      busType: [],
      departureTime: undefined,
      priceRange: [300, 1000],
      seatsAvailable: undefined
    });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl animate-fade-in mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      <div className="mt-4 flex flex-col md:flex-row justify-between gap-4">
        <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1" variant="secondary">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Filters</h4>
              
              <div>
                <h5 className="text-sm font-medium mb-2">Bus Type</h5>
                <div className="space-y-2">
                  {busTypes.map((busType) => (
                    <div key={busType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bus-type-${busType}`}
                        checked={(filters.busType || []).includes(busType)}
                        onCheckedChange={() => handleBusTypeToggle(busType)}
                      />
                      <label
                        htmlFor={`bus-type-${busType}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {busType}
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
                    <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                    <SelectItem value="evening">Evening (6PM - 10PM)</SelectItem>
                    <SelectItem value="night">Night (10PM - 6AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-2">Price Range</h5>
                <div className="px-2">
                  <Slider
                    defaultValue={[300, 1000]}
                    value={filters.priceRange}
                    min={300}
                    max={1000}
                    step={50}
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
                <h5 className="text-sm font-medium mb-2">Minimum Seats Available</h5>
                <Select 
                  value={filters.seatsAvailable?.toString()} 
                  onValueChange={(value) => handleInputChange('seatsAvailable', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="5">At least 5</SelectItem>
                    <SelectItem value="10">At least 10</SelectItem>
                    <SelectItem value="20">At least 20</SelectItem>
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
        
        <Button 
          onClick={handleSearch}
          className="w-full md:w-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          Search Buses
        </Button>
      </div>
    </div>
  );
};

export default BusSearch;
