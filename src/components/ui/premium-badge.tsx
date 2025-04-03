
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
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-block">
          {variant === 'compact' ? (
            <Badge 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 group flex items-center gap-1 shadow-[0_0_5px_rgba(124,58,237,0.5)] transition-all duration-300"
            >
              <Sparkles className="h-3 w-3 text-yellow-200" />
              <span className="hidden group-hover:inline-block transition-all">Premium</span>
            </Badge>
          ) : (
            <Badge 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 group flex items-center gap-1 px-3 py-1 shadow-[0_0_5px_rgba(124,58,237,0.5)] transition-all duration-300"
            >
              <Sparkles className="h-3 w-3 text-yellow-200" />
              <span>{getPremiumLabel(premiumType)}</span>
            </Badge>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
        <p className="font-medium text-indigo-700">{getPremiumLabel(premiumType)}</p>
        <p className="text-xs text-indigo-600">Exclusive benefits unlocked</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default PremiumBadge;
