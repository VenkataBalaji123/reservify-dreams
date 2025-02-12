
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Film, Clock, Languages, Users, Star } from 'lucide-react';

const SAMPLE_MOVIES = [
  { 
    id: 1, 
    name: 'The Dark Knight', 
    language: 'English', 
    time: '18:00', 
    price: 300,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb',
    genre: 'Action/Drama',
    duration: '2h 32min',
    availableSeats: 45
  },
  { 
    id: 2, 
    name: 'Inception', 
    language: 'English', 
    time: '21:00', 
    price: 300,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1',
    genre: 'Sci-Fi/Action',
    duration: '2h 28min',
    availableSeats: 32
  },
  { 
    id: 3, 
    name: '3 Idiots', 
    language: 'Hindi', 
    time: '15:30', 
    price: 250,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',
    genre: 'Comedy/Drama',
    duration: '2h 51min',
    availableSeats: 28
  },
];

const MovieResults = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {SAMPLE_MOVIES.map((movie) => (
        <Card key={movie.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <img 
                src={movie.image} 
                alt={movie.name}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{movie.name}</h3>
                  <p className="text-gray-600">{movie.genre}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{movie.rating}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-gray-500" />
                  <span>{movie.language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-gray-500" />
                  <span>{movie.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>{movie.availableSeats} seats left</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-6">
                <div className="text-2xl font-bold mb-4 md:mb-0">₹{movie.price}</div>
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
