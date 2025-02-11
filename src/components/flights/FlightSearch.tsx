
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search } from 'lucide-react';

interface FlightSearchProps {
  onSearch: () => void;
}

const FlightSearch = ({ onSearch }: FlightSearchProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl animate-fade-in mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="From"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="To"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="date"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">Round Trip</Button>
        <Button variant="outline" size="sm">One Way</Button>
        <Button variant="outline" size="sm">Multi-City</Button>
      </div>
    </div>
  );
};

export default FlightSearch;
