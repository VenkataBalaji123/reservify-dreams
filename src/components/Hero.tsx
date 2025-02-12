
import { Calendar, MapPin, Search, Ticket, Film, Train, TrendingUp, Award, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdvancedSearch from './AdvancedSearch';

const Hero = () => {
  const [searchType, setSearchType] = useState<'events' | 'movies' | 'trains'>('events');
  const navigate = useNavigate();

  const handleSearch = (data: any) => {
    navigate(`/${searchType}`);
  };

  const popularDestinations = [
    { name: 'Mumbai', image: 'https://source.unsplash.com/300x200/?mumbai' },
    { name: 'Delhi', image: 'https://source.unsplash.com/300x200/?delhi' },
    { name: 'Bangalore', image: 'https://source.unsplash.com/300x200/?bangalore' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 animate-gradient">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8 animate-fade-in-up">
            Your Next Adventure
            <span className="block text-indigo-600">Starts Here</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Discover and book amazing experiences worldwide. From movies to events, we've got your entertainment covered.
          </p>
        </div>

        <div className="mb-16">
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <Button
              variant={searchType === 'events' ? 'default' : 'outline'}
              onClick={() => setSearchType('events')}
              className="flex items-center gap-2 transition-all"
            >
              <Ticket className="w-4 h-4" />
              Events
            </Button>
            <Button
              variant={searchType === 'movies' ? 'default' : 'outline'}
              onClick={() => setSearchType('movies')}
              className="flex items-center gap-2 transition-all"
            >
              <Film className="w-4 h-4" />
              Movies
            </Button>
            <Button
              variant={searchType === 'trains' ? 'default' : 'outline'}
              onClick={() => setSearchType('trains')}
              className="flex items-center gap-2 transition-all"
            >
              <Train className="w-4 h-4" />
              Trains
            </Button>
          </div>

          <AdvancedSearch type={searchType} onSearch={handleSearch} />
        </div>

        {/* Trending Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8 text-indigo-600" />
            Trending Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularDestinations.map((destination, index) => (
              <div 
                key={destination.name}
                className="glass p-4 rounded-xl card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900">{destination.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass p-6 rounded-xl card-hover animate-fade-in-up animation-delay-200">
            <Award className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">Find the most competitive rates for your entertainment needs.</p>
          </div>
          <div className="glass p-6 rounded-xl card-hover animate-fade-in-up animation-delay-400">
            <Star className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">Our team is here to help you anytime, anywhere.</p>
          </div>
          <div className="glass p-6 rounded-xl card-hover animate-fade-in-up animation-delay-600">
            <Shield className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
            <p className="text-gray-600">Your transactions are protected with bank-level security.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
