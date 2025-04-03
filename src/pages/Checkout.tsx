
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import PaymentForm from "@/components/payment/PaymentForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PremiumBadge from '@/components/ui/premium-badge';

const Checkout = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    // Extract the service data from location state
    const serviceData = location.state?.service;
    
    if (!serviceData) {
      setError("No service selected. Please choose a premium service first.");
      setLoading(false);
      return;
    }

    if (!user) {
      toast.error("Please sign in to continue with checkout");
      navigate('/signin', { state: { returnUrl: location.pathname, serviceData } });
      return;
    }

    setService(serviceData);
    createBookingRecord(serviceData);
  }, [location, user, navigate]);

  const createBookingRecord = async (serviceData: any) => {
    if (!user || !serviceData) return;

    try {
      setLoading(true);
      
      // Instead of using serviceData.id directly as a UUID, store it as a string in metadata
      const { data, error } = await supabase
        .from('unified_bookings')
        .insert({
          user_id: user.id,
          booking_type: 'premium_service',
          item_id: user.id, // Use user's UUID as item_id to avoid UUID validation issues
          title: `Premium Service: ${serviceData.name}`,
          booking_date: new Date().toISOString(),
          status: 'pending',
          amount: serviceData.price,
          total_amount: serviceData.price,
          description: serviceData.description,
          metadata: { 
            service_id: serviceData.id, 
            is_premium: true,
            service_name: serviceData.name,
            service_price: serviceData.price
          }
        })
        .select()
        .single();

      if (error) throw error;

      setBookingId(data.id);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async (paymentId: string) => {
    try {
      setLoading(true);
      
      // Update booking status
      if (bookingId) {
        const { error: bookingError } = await supabase
          .from('unified_bookings')
          .update({ status: 'completed' })
          .eq('id', bookingId);
        
        if (bookingError) throw bookingError;
      }

      // Update user profile to premium - store service.id as string in premium_type
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          premium_type: service.id, // This is fine as the column accepts strings
          premium_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      setPaymentComplete(true);
      toast.success(`You've successfully subscribed to ${service.name}!`);
    } catch (err: any) {
      console.error('Error completing payment process:', err);
      setError(err.message || 'An error occurred while processing your payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error: Error) => {
    setError(error.message || 'Payment failed. Please try again.');
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (loading && !service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-20 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg">Loading checkout...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-20 px-4">
        <div className="max-w-3xl mx-auto mt-8">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/premium-services')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Premium Services
          </Button>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-20 px-4">
        <div className="max-w-3xl mx-auto mt-8">
          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <CardTitle>Payment Successful</CardTitle>
              </div>
              <CardDescription>
                Your premium subscription is now active
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="font-medium">Service</span>
                  <span className="font-semibold">{service?.name}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="font-medium">Subscription Type</span>
                  <PremiumBadge premiumType={service?.id} />
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="font-medium">Amount Paid</span>
                  <span className="font-semibold">₹{service?.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="font-medium">Valid Until</span>
                  <span className="font-semibold">
                    {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-indigo-700">
                    Thank you for becoming a premium member! You now have access to exclusive benefits and features.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button 
                onClick={handleContinue} 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Continue to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-20 px-4">
      <div className="max-w-3xl mx-auto mt-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Payment Details</span>
                </CardTitle>
                <CardDescription>Complete your payment to subscribe</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingId && (
                  <PaymentForm
                    amount={service?.price || 0}
                    bookingId={bookingId}
                    onSuccess={handlePaymentComplete}
                    onError={handlePaymentError}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between pb-2 border-b">
                    <span>Service</span>
                    <span className="font-medium">{service?.name}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>Duration</span>
                    <span className="font-medium">1 Year</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b">
                    <span>Price</span>
                    <span className="font-medium">₹{service?.price?.toLocaleString('en-IN') || 0}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>₹{service?.price?.toLocaleString('en-IN') || 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <div className="w-full text-sm text-gray-500">
                  <p>Secure payment processing. You can cancel your subscription anytime.</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
