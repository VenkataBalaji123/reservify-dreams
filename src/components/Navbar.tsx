
import { useState } from 'react';
import { Menu, X, User, Search, LogOut, Home, Plane, Film, Train, Calendar, LayoutDashboard, Crown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-lg z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex items-center"
              >
                Reservify
              </motion.div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link flex items-center gap-1 ${isActive('/') ? 'text-indigo-600 after:scale-x-100' : ''}`}>
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link to="/flights" className={`nav-link flex items-center gap-1 ${isActive('/flights') ? 'text-indigo-600 after:scale-x-100' : ''}`}>
              <Plane className="h-4 w-4" />
              Flights
            </Link>
            <Link to="/movies" className={`nav-link flex items-center gap-1 ${isActive('/movies') ? 'text-indigo-600 after:scale-x-100' : ''}`}>
              <Film className="h-4 w-4" />
              Movies
            </Link>
            <Link to="/trains" className={`nav-link flex items-center gap-1 ${isActive('/trains') ? 'text-indigo-600 after:scale-x-100' : ''}`}>
              <Train className="h-4 w-4" />
              Trains
            </Link>
            <Link to="/events" className={`nav-link flex items-center gap-1 ${isActive('/events') ? 'text-indigo-600 after:scale-x-100' : ''}`}>
              <Calendar className="h-4 w-4" />
              Events
            </Link>
            <Link to="/premium-services" className={`nav-link flex items-center gap-1 ${isActive('/premium-services') ? 'text-indigo-600 after:scale-x-100' : ''}`}>
              <Crown className="h-4 w-4" />
              Premium
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium">Signed in as</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/bookings')} className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile/edit')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => navigate('/signin')}
                >
                  Sign In
                </Button>
              </motion.div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} animate-fade-in-up`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link to="/flights" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <Plane className="mr-2 h-4 w-4" />
            Flights
          </Link>
          <Link to="/movies" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <Film className="mr-2 h-4 w-4" />
            Movies
          </Link>
          <Link to="/trains" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <Train className="mr-2 h-4 w-4" />
            Trains
          </Link>
          <Link to="/events" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </Link>
          <Link to="/premium-services" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            <Crown className="mr-2 h-4 w-4" />
            Premium Services
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/bookings" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <Calendar className="mr-2 h-4 w-4" />
                My Bookings
              </Link>
              <Link to="/profile/edit" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
              <Button 
                onClick={signOut}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => navigate('/signin')}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
