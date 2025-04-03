
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BusSearch, { BusSearchFilters } from '@/components/buses/BusSearch';
import BusResults from '@/components/buses/BusResults';
import SectionBanner from '@/components/ui/section-banner';

const Buses = () => {
  const [filters, setFilters] = useState<BusSearchFilters | undefined>();

  const handleSearch = (searchFilters: BusSearchFilters) => {
    setFilters(searchFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionBanner
          title="Book Bus Tickets Online"
          subtitle="Compare & book bus tickets with guaranteed comfort"
          image="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957"
        />

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Bus</h1>
          <p className="text-gray-600">Search and book bus tickets to destinations across India</p>
        </div>

        <BusSearch onSearch={handleSearch} />
        <BusResults filters={filters} />
      </div>
    </div>
  );
};

export default Buses;
