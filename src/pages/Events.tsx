
import { useState } from 'react';
import EventSearch from '@/components/events/EventSearch';
import EventResults from '@/components/events/EventResults';

const Events = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-gray-600">Find and book tickets for the best events near you</p>
        </div>

        <EventSearch onSearch={() => setSearchPerformed(true)} />
        {searchPerformed && <EventResults />}
      </div>
    </div>
  );
};

export default Events;
