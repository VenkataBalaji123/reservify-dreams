
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Headphones, 
  Package, 
  Sparkles, 
  Award, 
  Globe, 
  Calendar,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PremiumServiceCards = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const premiumServices = [
    {
      id: 'concierge',
      name: 'Personal Travel Concierge',
      description: 'Get a dedicated travel expert to plan your entire trip with personalized recommendations.',
      icon: <Headphones className="w-8 h-8 text-indigo-500" />,
      benefits: [
        'Customized travel itineraries tailored to your preferences',
        '24/7 support during your entire journey',
        'Priority access to exclusive venues and experiences',
        'Personalized travel recommendations based on your preferences'
      ],
      price: '₹499 per trip',
      bgImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80'
    },
    {
      id: 'surprise',
      name: 'Mystery Destination',
      description: 'Book a surprise trip where the destination is revealed only 24 hours before departure.',
      icon: <Package className="w-8 h-8 text-indigo-500" />,
      benefits: [
        'Complete surprise destination within your budget range',
        'All accommodations and main activities pre-arranged',
        'Personalized mystery box with destination hints',
        'Emergency support contact throughout the journey'
      ],
      price: '₹999 per person',
      bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80'
    },
    {
      id: 'bundle',
      name: 'Smart Bundle Builder',
      description: 'AI-powered trip planner that bundles flights, hotels, and activities for maximum savings.',
      icon: <Sparkles className="w-8 h-8 text-indigo-500" />,
      benefits: [
        'Save up to 30% compared to booking separately',
        'AI-curated suggestions based on your preferences',
        'Flexible rebooking options',
        'Exclusive bundle-only discounts and perks'
      ],
      price: '₹299 subscription fee',
      bgImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80'
    },
    {
      id: 'loyalty',
      name: 'Premium Loyalty Program',
      description: 'Join our elite tier for exclusive discounts, priority booking, and special event access.',
      icon: <Award className="w-8 h-8 text-indigo-500" />,
      benefits: [
        'Earn 2x points on all bookings',
        'Members-only flash sales and promotions',
        'Priority customer support',
        'Free upgrades when available'
      ],
      price: '₹499 annual membership',
      bgImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80'
    },
    {
      id: 'virtual',
      name: 'Virtual Tours',
      description: 'Explore destinations virtually before booking to ensure it meets your expectations.',
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      benefits: [
        'HD virtual walkthroughs of hotels and venues',
        'Interactive 360° views of popular attractions',
        'Expert-guided virtual tours of destinations',
        'Try-before-you-buy experience for premium bookings'
      ],
      price: '₹99 per virtual tour package',
      bgImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80'
    },
    {
      id: 'lastminute',
      name: 'Last-Minute Deals Alerts',
      description: 'Get personalized notifications for steep discounts on last-minute bookings.',
      icon: <Calendar className="w-8 h-8 text-indigo-500" />,
      benefits: [
        'Real-time alerts for deals matching your preferences',
        'Exclusive last-minute offers not available to regular users',
        'One-click booking process',
        'Flexible cancellation on select deals'
      ],
      price: '₹199 annual subscription',
      bgImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80'
    }
  ];

  const handleServiceSelect = (service: any) => {
    if (!user) {
      toast.error("Please sign in to subscribe to premium services");
      navigate('/signin');
      return;
    }
    
    // Navigate to the premium subscription page
    navigate(`/premium-subscription/${service.id}`);
  };

  const handleLearnMore = (service: any) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {premiumServices.map((service) => (
          <Card 
            key={service.id} 
            className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url(${service.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="p-6 text-white">
              <div className="mb-4 p-3 inline-flex rounded-full bg-indigo-100/20 backdrop-blur-sm">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-100 mb-4">{service.description}</p>
              <p className="font-bold text-xl mb-6 text-indigo-300">{service.price}</p>
              <div className="flex flex-col space-y-2 mt-auto">
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 group-hover:translate-y-0"
                  onClick={() => handleServiceSelect(service)}
                >
                  Subscribe Now <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-white/30 text-white hover:bg-white/20"
                  onClick={() => handleLearnMore(service)}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedService && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {selectedService.icon && React.cloneElement(selectedService.icon, { className: "w-5 h-5" })}
                {selectedService.name}
              </DialogTitle>
              <DialogDescription>
                {selectedService.description}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <h4 className="font-medium mb-2 text-indigo-600">Benefits:</h4>
              <ul className="space-y-2">
                {selectedService.benefits.map((benefit: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="font-semibold">Price: <span className="text-indigo-600">{selectedService.price}</span></p>
              </div>

              {!user && (
                <p className="mt-4 text-sm text-amber-600">
                  You need to be signed in to subscribe to premium services.
                </p>
              )}
            </div>

            <DialogFooter className="flex gap-2 flex-col sm:flex-row">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setDialogOpen(false);
                  handleServiceSelect(selectedService);
                }} 
                disabled={!user}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Subscribe Now
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default PremiumServiceCards;
