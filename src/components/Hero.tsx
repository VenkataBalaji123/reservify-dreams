
import { Calendar, MapPin, Search, Ticket, Film, Train } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchType, setSearchType] = useState<'events' | 'movies' | 'trains'>('events');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/${searchType}`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 animate-gradient">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8 animate-fade-in-up">
          Your Next Adventure
          <span className="block text-indigo-600">Starts Here</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
          Discover and book amazing experiences worldwide. From movies to events, we've got your entertainment covered.
        </p>

        <div className="max-w-4xl mx-auto glass p-8 rounded-2xl shadow-xl animate-fade-in-up animation-delay-400">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Where to?"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="w-full h-[42px] bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up animation-delay-600">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Best Prices</h3>
            <p className="text-gray-600">Find the most competitive rates for your entertainment needs.</p>
          </div>
          <div className="glass p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up animation-delay-800">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">24/7 Support</h3>
            <p className="text-gray-600">Our team is here to help you anytime, anywhere.</p>
          </div>
          <div className="glass p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up animation-delay-1000">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Secure Booking</h3>
            <p className="text-gray-600">Your transactions are protected with bank-level security.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
