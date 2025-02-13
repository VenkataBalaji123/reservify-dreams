
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Share2, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Event } from '@/types/event';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

const FeaturedEvents = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data as Event[];
    }
  });

  const handleShare = async (event: Event) => {
    try {
      await navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      });
    } catch (err) {
      toast.error('Unable to share');
    }
  };

  const handleWishlist = async (event: Event) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please sign in to add to wishlist');
      return;
    }

    const { error } = await supabase
      .from('wishlists')
      .upsert({
        user_id: session.user.id,
        item_id: event.id,
        item_type: 'event'
      });

    if (error) {
      toast.error('Failed to add to wishlist');
    } else {
      toast.success('Added to wishlist');
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading featured events...</div>;
  }

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events?.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={event.image_url || '/placeholder.svg'} 
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={() => handleShare(event)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={() => handleWishlist(event)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full">
                  {event.event_type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(event.start_date), 'PPP')}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-2xl font-bold">₹{event.base_price}</p>
                  </div>
                  <Button onClick={() => navigate(`/events/${event.id}`)}>
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvents;
