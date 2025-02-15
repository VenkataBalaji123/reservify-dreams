
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Film, Clock, Languages, Star, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Movie, Language, MovieCategory } from '@/types/movie';
import type { SearchFilters } from './MovieSearch';

interface MovieResultsProps {
  filters: SearchFilters;
}

const MovieResults = ({ filters }: MovieResultsProps) => {
  const navigate = useNavigate();

  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies', filters],
    queryFn: async () => {
      let query = supabase
        .from('movies')
        .select(`
          *,
          language:languages(name),
          category:movie_categories(name)
        `);

      if (filters.title) {
        query = query.ilike('title', `%${filters.title}%`);
      }
      if (filters.language_id) {
        query = query.eq('language_id', filters.language_id);
      }
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.date) {
        query = query.eq('release_date', filters.date);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="w-full h-64 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!movies?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No movies found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {movies.map((movie) => (
        <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <img 
                src={movie.image_url || '/placeholder.svg'} 
                alt={movie.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{movie.title}</h3>
                  <p className="text-gray-600">{movie.description}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{movie.rating}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>{movie.duration} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-gray-500" />
                  <span>{movie.language.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-gray-500" />
                  <span>{movie.category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                <div className="text-2xl font-bold mb-4 md:mb-0">₹{movie.base_price}</div>
                <div className="flex gap-4">
                  <Button variant="outline">
                    Watch Trailer
                  </Button>
                  <Button onClick={() => navigate(`/movies/${movie.id}/seats`)}>
                    Book Tickets
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MovieResults;
