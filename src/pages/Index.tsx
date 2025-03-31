
import Hero from '@/components/Hero';
import ChatBot from '@/components/ChatBot';
import FeaturedEvents from '@/components/events/FeaturedEvents';
import UniqueServices from '@/components/services/UniqueServices';
import SectionBanner from '@/components/ui/section-banner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Hero />
      
      <SectionBanner
        title="Discover Amazing Events"
        subtitle="From concerts to conferences, find the perfect event for you"
        image="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
        height="large"
      >
        <Button 
          onClick={() => navigate('/events')} 
          className="bg-white text-indigo-600 hover:bg-gray-100"
        >
          Explore Events
        </Button>
      </SectionBanner>
      
      <FeaturedEvents />
      
      <SectionBanner
        title="Travel The World"
        subtitle="Find the best flights, trains and accommodations at unbeatable prices"
        image="https://images.unsplash.com/photo-1488085061387-422e29b40080"
        align="right"
        height="medium"
      >
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/flights')} 
            className="bg-white text-indigo-600 hover:bg-gray-100"
          >
            Book Flights
          </Button>
          <Button 
            onClick={() => navigate('/trains')} 
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white/20"
          >
            Find Trains
          </Button>
        </div>
      </SectionBanner>
      
      <UniqueServices />
      
      <SectionBanner
        title="Movie Night"
        subtitle="Book tickets for the latest blockbusters and indie favorites"
        image="https://images.unsplash.com/photo-1536440136628-849c177e76a1"
        align="left"
        height="medium"
      >
        <Button 
          onClick={() => navigate('/movies')} 
          className="bg-white text-indigo-600 hover:bg-gray-100"
        >
          Book Movie Tickets
        </Button>
      </SectionBanner>
      
      <ChatBot />
    </div>
  );
};

export default Index;
