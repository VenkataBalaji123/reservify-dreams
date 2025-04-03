
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Flights from "./pages/Flights";
import Buses from "./pages/Buses";
import Trains from "./pages/Trains";
import Events from "./pages/Events";
import Movies from "./pages/Movies";
import NotFound from "./pages/NotFound";
import FlightSeats from "./components/flights/FlightSeats";
import BusSeats from "./components/buses/BusSeats";
import TrainSeats from "./components/trains/TrainSeats";
import EventSeats from "./components/events/EventSeats";
import MovieSeats from "./components/movies/MovieSeats";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Dashboard from "./components/dashboard/Dashboard";
import EditProfile from "./components/auth/EditProfile";
import Navbar from "./components/Navbar";
import BookingConfirmation from "./components/bookings/BookingConfirmation";
import BookingManagement from "./components/bookings/BookingManagement";
import BookingHistory from "./components/bookings/BookingHistory";
import UserDashboard from "./pages/UserDashboard";
import PremiumServices from "./pages/PremiumServices";
import PremiumSubscription from "./pages/PremiumSubscription";
import Checkout from "./pages/Checkout";
import AdminCoupons from "./pages/AdminCoupons";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/buses" element={<Buses />} />
            <Route path="/trains" element={<Trains />} />
            <Route path="/events" element={<Events />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/premium-services" element={<PremiumServices />} />
            <Route path="/premium-subscription/:serviceId" element={<PremiumSubscription />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/flights/:flightId/seats" element={<FlightSeats />} />
            <Route path="/buses/:busId/seats" element={<BusSeats />} />
            <Route path="/trains/:trainId/seats" element={<TrainSeats />} />
            <Route path="/events/:eventId/seats" element={<EventSeats />} />
            <Route path="/movies/:movieId/seats" element={<MovieSeats />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/bookings" element={<BookingHistory />} />
            <Route path="/bookings/manage" element={<BookingManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
