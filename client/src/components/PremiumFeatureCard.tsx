import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumFeature } from '@/types';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { Link } from 'wouter';

interface PremiumFeatureCardProps {
  feature: PremiumFeature;
  icon: React.ReactNode;
  gradient: string;
  benefits?: string[];
  showUpgrade?: boolean;
}

export function PremiumFeatureCard({ 
  feature, 
  icon, 
  gradient, 
  benefits = [], 
  showUpgrade = true 
}: PremiumFeatureCardProps) {
  const { hasFeature } = usePremiumContext();
  const hasAccess = hasFeature(feature.id);

  const tierColors = {
    basic: 'bg-blue-100 text-blue-700',
    premium: 'bg-pink-100 text-pink-700',
    vip: 'bg-purple-100 text-purple-700',
  };

  const tierGradients = {
    basic: 'from-blue-400 to-blue-500',
    premium: 'from-pink-400 to-red-400',
    vip: 'from-purple-400 to-pink-400',
  };

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${gradient}`}>
      <CardContent className="p-6">
        {/* Premium Badge */}
        <div className="flex items-center justify-between mb-4">
          <Badge 
            className={`${tierColors[feature.requiredTier]} font-semibold`}
          >
            <Crown className="w-3 h-3 mr-1" />
            {feature.requiredTier.toUpperCase()}
          </Badge>
          
          {!hasAccess && (
            <Lock className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Icon */}
        <div className={`w-12 h-12 bg-gradient-to-r ${tierGradients[feature.requiredTier]} rounded-lg flex items-center justify-center mb-4 text-white`}>
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.name}</h3>
        <p className="text-gray-600 mb-4">{feature.description}</p>

        {/* Benefits */}
        {benefits.length > 0 && (
          <ul className="space-y-2 mb-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2" />
                {benefit}
              </li>
            ))}
          </ul>
        )}

        {/* Action Button */}
        {showUpgrade && !hasAccess && (
          <Link href="/premium">
            <Button 
              className={`w-full bg-gradient-to-r ${tierGradients[feature.requiredTier]} hover:opacity-90 transition-opacity`}
            >
              Upgrade to {feature.requiredTier}
            </Button>
          </Link>
        )}

        {hasAccess && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Active
          </div>
        )}
      </CardContent>

      {/* Overlay for locked features */}
      {!hasAccess && showUpgrade && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Link href="/premium">
            <Button 
              size="sm"
              className={`bg-gradient-to-r ${tierGradients[feature.requiredTier]}`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Upgrade to Unlock
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
