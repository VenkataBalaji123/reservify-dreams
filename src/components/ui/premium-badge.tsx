
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles } from 'lucide-react';

interface PremiumBadgeProps {
  variant?: 'default' | 'compact';
  premiumType?: string;
}

const PremiumBadge = ({ variant = 'default', premiumType }: PremiumBadgeProps) => {
  // Map premium type IDs to readable names
  const getPremiumLabel = (type?: string) => {
    const typeMap: Record<string, string> = {
      'concierge': 'Travel Concierge',
      'surprise': 'Mystery Trip',
      'bundle': 'Bundle Builder',
      'loyalty': 'Loyalty Program',
      'virtual': 'Virtual Tours',
      'lastminute': 'Last-Minute Deals',
    };
    
    return type && typeMap[type] ? typeMap[type] : 'Premium Member';
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            {variant === 'compact' ? (
              <Badge 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 group flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                <span className="hidden group-hover:inline-block">Premium</span>
              </Badge>
            ) : (
              <Badge 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 group flex items-center gap-1 px-3 py-1"
              >
                <Sparkles className="h-3 w-3" />
                <span>Premium Member</span>
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getPremiumLabel(premiumType)}</p>
          <p className="text-xs opacity-70">Exclusive benefits unlocked</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PremiumBadge;
