
import { useState } from 'react';
import EventSearch from '@/components/events/EventSearch';
import EventResults from '@/components/events/EventResults';
import SectionBanner from '@/components/ui/section-banner';

const Events = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionBanner
          title="Discover Amazing Events"
          subtitle="From concerts to festivals, find and book tickets for exciting events"
          image="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"
        />

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Experience</h1>
          <p className="text-gray-600">Explore events by location, date, or category</p>
        </div>

        <EventSearch onSearch={() => setSearchPerformed(true)} />
        {searchPerformed && <EventResults />}
      </div>
    </div>
  );
};

export default Events;
