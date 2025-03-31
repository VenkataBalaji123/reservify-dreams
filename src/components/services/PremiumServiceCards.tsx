
import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PremiumServiceCards = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

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
      price: '₹5,999 per trip'
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
      price: '₹12,999 per person'
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
      price: '₹999 subscription fee + booking costs'
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
      price: '₹4,999 annual membership'
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
      price: '₹499 per virtual tour package'
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
      price: '₹1,999 annual subscription'
    }
  ];

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleSubscribe = () => {
    // This would connect to a payment processing service in a real application
    alert(`Thank you for your interest in ${selectedService.name}! We'll redirect you to the payment page.`);
    setDialogOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {premiumServices.map((service) => (
          <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <div className="mb-4 p-2 inline-flex rounded-full bg-indigo-100">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => handleServiceSelect(service)}
              >
                Learn More & Subscribe
              </Button>
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
                    <span className="mr-2 text-green-500">✓</span>
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
                onClick={handleSubscribe} 
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
