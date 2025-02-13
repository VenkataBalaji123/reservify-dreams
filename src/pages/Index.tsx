
import Hero from '@/components/Hero';
import ChatBot from '@/components/ChatBot';
import FeaturedEvents from '@/components/events/FeaturedEvents';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedEvents />
      <ChatBot />
    </div>
  );
};

export default Index;
