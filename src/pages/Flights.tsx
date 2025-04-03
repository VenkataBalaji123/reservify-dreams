
import { useState } from 'react';
import FlightSearch, { FlightSearchFilters } from '@/components/flights/FlightSearch';
import FlightResults from '@/components/flights/FlightResults';
import SectionBanner from '@/components/ui/section-banner';

const Flights = () => {
  const [filters, setFilters] = useState<FlightSearchFilters | undefined>();

  const handleSearch = (searchFilters: FlightSearchFilters) => {
    setFilters(searchFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionBanner
          title="Fly to Your Dreams"
          subtitle="Discover amazing flight deals to destinations worldwide"
          image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05"
        />

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Flight</h1>
          <p className="text-gray-600">Search and book flights to destinations worldwide</p>
        </div>

        <FlightSearch onSearch={handleSearch} />
        <FlightResults filters={filters} />
      </div>
    </div>
  );
};

export default Flights;
