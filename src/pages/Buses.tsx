
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BusSearch from '@/components/buses/BusSearch';
import BusResults from '@/components/buses/BusResults';

const Buses = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Bus</h1>
          <p className="text-gray-600">Search and book bus tickets to destinations across India</p>
        </div>

        <BusSearch onSearch={() => setSearchPerformed(true)} />
        {searchPerformed && <BusResults />}
      </div>
    </div>
  );
};

export default Buses;
