
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Search, Plane } from 'lucide-react';
import FlightSearch from '@/components/flights/FlightSearch';
import FlightResults from '@/components/flights/FlightResults';

const Flights = () => {
  // Set searchPerformed to true by default to always show flight results
  const [searchPerformed, setSearchPerformed] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Flight</h1>
          <p className="text-gray-600">Search and book flights to destinations worldwide</p>
        </div>

        <FlightSearch onSearch={() => setSearchPerformed(true)} />

        {searchPerformed && <FlightResults />}
      </div>
    </div>
  );
};

export default Flights;
