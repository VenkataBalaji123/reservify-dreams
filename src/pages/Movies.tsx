
import { useState } from 'react';
import MovieSearch, { SearchFilters } from '@/components/movies/MovieSearch';
import MovieResults from '@/components/movies/MovieResults';
import SectionBanner from '@/components/ui/section-banner';

const Movies = () => {
  const [filters, setFilters] = useState<SearchFilters>({});

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionBanner
          title="Movie Magic Awaits"
          subtitle="Book tickets for the latest releases and enjoy big screen entertainment"
          image="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
        />

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Movie Tickets</h1>
          <p className="text-gray-600">Find and book tickets for the latest movies in your preferred language</p>
        </div>

        <MovieSearch onSearch={setFilters} />
        <MovieResults filters={filters} />
      </div>
    </div>
  );
};

export default Movies;
