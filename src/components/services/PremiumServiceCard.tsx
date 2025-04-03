
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PremiumServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    priceDisplay: string;
    bgImage: string;
    benefits: string[];
  };
}

const PremiumServiceCard = ({ service }: PremiumServiceCardProps) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleSubscribe = () => {
    if (!user) {
      navigate('/signin', { state: { returnUrl: '/checkout', service } });
      return;
    }

    // Check if already subscribed to this service
    if (profile?.is_premium && profile?.premium_type === service.id) {
      navigate('/dashboard');
      return;
    }

    // Navigate to checkout with service data
    navigate('/checkout', { state: { service } });
  };

  // Determine if user is already subscribed to this service
  const isSubscribed = profile?.is_premium && profile?.premium_type === service.id;

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
      <div 
        className="h-32 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${service.bgImage})` }}
      >
        <div className="h-full flex items-center justify-center">
          <h3 className="text-xl font-semibold text-white">{service.name}</h3>
        </div>
      </div>
      
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{service.priceDisplay}</CardTitle>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Premium
          </Badge>
        </div>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <h4 className="text-sm font-medium">Key Benefits:</h4>
        <ul className="space-y-2">
          {service.benefits.map((benefit, i) => (
            <li key={i} className="flex text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSubscribe}
          className="w-full"
          variant={isSubscribed ? "outline" : "default"}
        >
          {isSubscribed ? (
            "Already Subscribed"
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Subscribe Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumServiceCard;
