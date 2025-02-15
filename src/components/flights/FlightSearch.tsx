
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FlightSearchProps {
  onSearch: () => void;
}

const FlightSearch = ({ onSearch }: FlightSearchProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [tripType, setTripType] = useState('roundtrip');

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl animate-fade-in mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="From"
            className="pl-10"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="To"
            className="pl-10"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="date"
            className="pl-10"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <Button 
          className="w-full h-[42px]"
          onClick={onSearch}
        >
          <Search className="mr-2 h-4 w-4" />
          Search Flights
        </Button>
      </div>

      <div className="mt-4">
        <Select value={tripType} onValueChange={setTripType}>
          <SelectTrigger>
            <SelectValue placeholder="Trip Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="roundtrip">Round Trip</SelectItem>
            <SelectItem value="oneway">One Way</SelectItem>
            <SelectItem value="multicity">Multi-City</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FlightSearch;
