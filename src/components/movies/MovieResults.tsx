
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const SAMPLE_MOVIES = [
  { id: 1, name: 'The Dark Knight', language: 'English', time: '18:00', price: 300 },
  { id: 2, name: 'Inception', language: 'English', time: '21:00', price: 300 },
  { id: 3, name: '3 Idiots', language: 'Hindi', time: '15:30', price: 250 },
];

const MovieResults = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {SAMPLE_MOVIES.map((movie) => (
        <Card key={movie.id} className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">{movie.name}</h3>
              <p className="text-sm text-gray-600">{movie.language}</p>
            </div>
            <div className="text-center">
              <p className="font-medium">{movie.time}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-lg font-bold">₹{movie.price}</p>
              <Button onClick={() => navigate(`/movies/${movie.id}/seats`)}>
                Book Tickets
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MovieResults;
