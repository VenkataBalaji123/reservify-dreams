
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Tag, Timer, Percent } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  image_url: string;
  valid_until: string;
}

const OffersSection = () => {
  const { data: offers, isLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Offer[];
    }
  });

  if (isLoading) {
    return <div className="text-center">Loading offers...</div>;
  }

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Tag className="w-8 h-8 text-indigo-600" />
            Special Offers
          </h2>
          <p className="text-lg text-gray-600">
            Don't miss out on these amazing deals!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers?.map((offer) => (
            <Card 
              key={offer.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img 
                  src={offer.image_url} 
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Percent className="w-4 h-4" />
                  {offer.discount_percentage}% OFF
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Timer className="w-4 h-4 mr-1" />
                  Valid until: {new Date(offer.valid_until).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersSection;
