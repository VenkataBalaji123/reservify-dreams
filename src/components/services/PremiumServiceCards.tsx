
import { useState, useEffect } from 'react';
import PremiumServiceCard from './PremiumServiceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PremiumServiceCards = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const premiumServices = [
    {
      id: 'concierge',
      name: 'Personal Travel Concierge',
      description: 'Get a dedicated travel expert to plan your entire trip with personalized recommendations.',
      price: 499,
      priceDisplay: '₹499 per trip',
      bgImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80',
      benefits: [
        'Customized travel itineraries tailored to your preferences',
        '24/7 support during your entire journey',
        'Priority access to exclusive venues and experiences',
        'Personalized travel recommendations based on your preferences'
      ],
      category: 'travel'
    },
    {
      id: 'surprise',
      name: 'Mystery Destination',
      description: 'Book a surprise trip where the destination is revealed only 24 hours before departure.',
      price: 999,
      priceDisplay: '₹999 per person',
      bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80',
      benefits: [
        'Complete surprise destination within your budget range',
        'All accommodations and main activities pre-arranged',
        'Personalized mystery box with destination hints',
        'Emergency support contact throughout the journey'
      ],
      category: 'travel'
    },
    {
      id: 'bundle',
      name: 'Smart Bundle Builder',
      description: 'AI-powered trip planner that bundles flights, hotels, and activities for maximum savings.',
      price: 299,
      priceDisplay: '₹299 subscription fee',
      bgImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80',
      benefits: [
        'Save up to 30% compared to booking separately',
        'AI-curated suggestions based on your preferences',
        'Flexible rebooking options',
        'Exclusive bundle-only discounts and perks'
      ],
      category: 'tools'
    },
    {
      id: 'loyalty',
      name: 'Premium Loyalty Program',
      description: 'Join our elite tier for exclusive discounts, priority booking, and special event access.',
      price: 499,
      priceDisplay: '₹499 annual membership',
      bgImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80',
      benefits: [
        'Earn 2x points on all bookings',
        'Members-only flash sales and promotions',
        'Priority customer support',
        'Free upgrades when available'
      ],
      category: 'membership'
    },
    {
      id: 'virtual',
      name: 'Virtual Tours',
      description: 'Explore destinations virtually before booking to ensure it meets your expectations.',
      price: 99,
      priceDisplay: '₹99 per virtual tour package',
      bgImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80',
      benefits: [
        'HD virtual walkthroughs of hotels and venues',
        'Interactive 360° views of popular attractions',
        'Expert-guided virtual tours of destinations',
        'Try-before-you-buy experience for premium bookings'
      ],
      category: 'experience'
    },
    {
      id: 'lastminute',
      name: 'Last-Minute Deals Alerts',
      description: 'Get personalized notifications for steep discounts on last-minute bookings.',
      price: 199,
      priceDisplay: '₹199 annual subscription',
      bgImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80',
      benefits: [
        'Real-time alerts for deals matching your preferences',
        'Exclusive last-minute offers not available to regular users',
        'One-click booking process',
        'Flexible cancellation on select deals'
      ],
      category: 'deals'
    }
  ];

  const categories = [
    { id: "all", name: "All Services" },
    { id: "travel", name: "Travel Services" },
    { id: "experience", name: "Experiences" },
    { id: "tools", name: "Planning Tools" },
    { id: "membership", name: "Memberships" },
    { id: "deals", name: "Special Deals" }
  ];

  const filteredServices = activeTab === "all" 
    ? premiumServices 
    : premiumServices.filter(service => service.category === activeTab);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <PremiumServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumServiceCards;
