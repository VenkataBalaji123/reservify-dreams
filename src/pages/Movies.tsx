
import { useState } from 'react';
import MovieSearch from '@/components/movies/MovieSearch';
import MovieResults from '@/components/movies/MovieResults';

const Movies = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Movie Tickets</h1>
          <p className="text-gray-600">Find and book tickets for movies showing near you</p>
        </div>

        <MovieSearch onSearch={() => setSearchPerformed(true)} />
        {searchPerformed && <MovieResults />}
      </div>
    </div>
  );
};

export default Movies;
