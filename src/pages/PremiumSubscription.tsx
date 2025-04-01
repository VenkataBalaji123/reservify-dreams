import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PaymentDialog from "@/components/payment/PaymentDialog";
import { Sparkles, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const PremiumSubscription = () => {
  const { serviceId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<any>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to subscribe to premium services");
      navigate('/signin');
      return;
    }

    const mockServices = [
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ];

    const foundService = mockServices.find(s => s.id === serviceId);
    
    if (foundService) {
      setService(foundService);
    } else {
      toast.error("Service not found");
      navigate('/premium-services');
    }
    
    setLoading(false);
  }, [serviceId, user, navigate]);

  const handleSubscribe = async () => {
    if (!user || !service) return;

    try {
      const { data, error } = await supabase
        .from('unified_bookings')
        .insert({
          user_id: user.id,
          booking_type: 'premium_service',
          item_id: service.id,
          title: `Premium Service: ${service.name}`,
          booking_date: new Date().toISOString(),
          status: 'pending',
          amount: service.price,
          total_amount: service.price,
          description: service.description,
          metadata: { service_id: service.id, is_premium: true }
        })
        .select()
        .single();

      if (error) throw error;

      setBookingId(data.id);
      setPaymentOpen(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const handlePaymentComplete = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          premium_type: service.id,
          premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success(`You're now subscribed to ${service.name}!`);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('There was an issue updating your profile. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-20 flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading service details...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-20 flex flex-col items-center justify-center">
        <div className="text-xl text-red-500">Service not found</div>
        <Button onClick={() => navigate('/premium-services')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Premium Services
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-20"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7)), url(${service.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/premium-services')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Premium Services
        </Button>

        <Card className="backdrop-blur-sm bg-white/90 border border-indigo-100 shadow-lg overflow-hidden">
          <div 
            className="h-32 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(79, 70, 229, 0.8), rgba(124, 58, 237, 0.8)), url(${service.bgImage})` 
            }}
          />
          
          <CardHeader className="relative pb-2">
            <div className="absolute -top-12 left-6 bg-white rounded-full p-2 shadow-lg">
              <Avatar className="h-20 w-20 bg-indigo-100 text-indigo-600">
                <AvatarFallback>
                  <Sparkles className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="ml-24">
              <Badge variant="secondary" className="mb-2 bg-indigo-100 text-indigo-700">
                Premium Service
              </Badge>
              <CardTitle className="text-2xl">{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-indigo-600" />
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {service.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg flex flex-col">
                <h3 className="text-lg font-semibold mb-2">Subscription Details</h3>
                <div className="text-3xl font-bold text-indigo-700 mb-1">{service.priceDisplay}</div>
                <p className="text-gray-600 mb-4">
                  Get access to exclusive premium benefits for a year
                </p>
                
                <div className="mt-auto">
                  <Button 
                    onClick={handleSubscribe}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </Button>
                  <p className="text-xs text-center mt-2 text-gray-500">
                    Secure payment processing. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        amount={service?.price || 0}
        bookingId={bookingId}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default PremiumSubscription;
