
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  GaugeCircle, 
  Award, 
  CreditCard, 
  Map, 
  Package, 
  Headphones, 
  Calendar, 
  Globe, 
  Sparkles,
  MapPin
} from 'lucide-react';

const UniqueServices = () => {
  const navigate = useNavigate();

  const premiumServices = [
    {
      id: 'concierge',
      name: 'Personal Travel Concierge',
      description: 'Get a dedicated travel expert to plan your entire trip with personalized recommendations.',
      icon: <Headphones className="w-8 h-8 text-indigo-500" />,
      route: '/services/concierge'
    },
    {
      id: 'surprise',
      name: 'Mystery Destination',
      description: 'Book a surprise trip where the destination is revealed only 24 hours before departure.',
      icon: <Package className="w-8 h-8 text-indigo-500" />,
      route: '/services/mystery'
    },
    {
      id: 'bundle',
      name: 'Smart Bundle Builder',
      description: 'AI-powered trip planner that bundles flights, hotels, and activities for maximum savings.',
      icon: <Sparkles className="w-8 h-8 text-indigo-500" />,
      route: '/services/bundle'
    },
    {
      id: 'loyalty',
      name: 'Premium Loyalty Program',
      description: 'Join our elite tier for exclusive discounts, priority booking, and special event access.',
      icon: <Award className="w-8 h-8 text-indigo-500" />,
      route: '/services/loyalty'
    },
    {
      id: 'virtual',
      name: 'Virtual Tours',
      description: 'Explore destinations virtually before booking to ensure it meets your expectations.',
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      route: '/services/virtual'
    },
    {
      id: 'lastminute',
      name: 'Last-Minute Deals Alerts',
      description: 'Get personalized notifications for steep discounts on last-minute bookings.',
      icon: <Calendar className="w-8 h-8 text-indigo-500" />,
      route: '/services/alerts'
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our exclusive offerings designed to make your travel and entertainment
            experience extraordinary and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {premiumServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="mb-4 p-2 inline-flex rounded-full bg-indigo-100">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(service.route)}
                >
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniqueServices;
