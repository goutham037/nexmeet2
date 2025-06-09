import { useState, useEffect } from 'react';
import { User, PremiumFeature, PremiumPlan } from '@/types';

const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: 'gender-filters',
    name: 'Gender-Specific Filters',
    description: 'Connect exclusively with girls or boys',
    requiredTier: 'premium',
    enabled: true,
  },
  {
    id: 'unlimited-swipes',
    name: 'Unlimited Swipes',
    description: 'No daily limits on likes and matches',
    requiredTier: 'basic',
    enabled: true,
  },
  {
    id: 'video-calling',
    name: 'HD Video & Voice Calls',
    description: 'Crystal clear video and voice calling',
    requiredTier: 'premium',
    enabled: true,
  },
  {
    id: 'read-receipts',
    name: 'Read Receipts',
    description: 'See when your messages are read',
    requiredTier: 'premium',
    enabled: true,
  },
  {
    id: 'incognito-mode',
    name: 'Incognito Browsing',
    description: 'Browse profiles anonymously',
    requiredTier: 'vip',
    enabled: true,
  },
  {
    id: 'priority-matching',
    name: 'Priority Matching',
    description: 'Get matched first with premium algorithm',
    requiredTier: 'premium',
    enabled: true,
  },
  {
    id: 'super-likes',
    name: 'Super Likes & Gifts',
    description: 'Send super likes and premium gifts',
    requiredTier: 'vip',
    enabled: true,
  },
  {
    id: 'advanced-filters',
    name: 'Advanced Filters',
    description: 'Filter by verification, interests, and more',
    requiredTier: 'premium',
    enabled: true,
  },
];

const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    tier: 'basic',
    features: [
      'Unlimited swipes',
      'Basic filters',
      'Standard support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    tier: 'premium',
    popular: true,
    features: [
      'Everything in Basic',
      'Gender-specific filters',
      'HD video calling',
      'Profile verification',
      'Read receipts',
      'Priority matching',
      'Advanced filters',
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 39.99,
    currency: 'USD',
    interval: 'month',
    tier: 'vip',
    features: [
      'Everything in Premium',
      'Incognito browsing',
      'Super likes & gifts',
      'Profile boost',
      'Priority support',
      'Advanced analytics',
    ],
  },
];

export function usePremium(user: User | null) {
  const [features, setFeatures] = useState<PremiumFeature[]>(PREMIUM_FEATURES);
  const [plans, setPlans] = useState<PremiumPlan[]>(PREMIUM_PLANS);

  const hasFeature = (featureId: string): boolean => {
    if (!user) return false;
    
    const feature = features.find(f => f.id === featureId);
    if (!feature || !feature.enabled) return false;

    const tierHierarchy = { free: 0, basic: 1, premium: 2, vip: 3 };
    const userTierLevel = tierHierarchy[user.premiumTier];
    const requiredTierLevel = tierHierarchy[feature.requiredTier];

    return userTierLevel >= requiredTierLevel;
  };

  const canUseGenderFilter = (gender: 'male' | 'female'): boolean => {
    return hasFeature('gender-filters');
  };

  const canMakeVideoCalls = (): boolean => {
    return hasFeature('video-calling');
  };

  const canSeeReadReceipts = (): boolean => {
    return hasFeature('read-receipts');
  };

  const canBrowseIncognito = (): boolean => {
    return hasFeature('incognito-mode');
  };

  const hasPriorityMatching = (): boolean => {
    return hasFeature('priority-matching');
  };

  const canSendSuperLikes = (): boolean => {
    return hasFeature('super-likes');
  };

  const hasAdvancedFilters = (): boolean => {
    return hasFeature('advanced-filters');
  };

  const hasUnlimitedSwipes = (): boolean => {
    return hasFeature('unlimited-swipes');
  };

  const isPremium = (): boolean => {
    return user?.premiumTier !== 'free';
  };

  const getCallQuality = (): 'standard' | 'hd' | 'premium' => {
    if (!user) return 'standard';
    
    switch (user.premiumTier) {
      case 'vip':
        return 'premium';
      case 'premium':
        return 'hd';
      default:
        return 'standard';
    }
  };

  const getDailySwipeLimit = (): number => {
    if (!user) return 5;
    
    switch (user.premiumTier) {
      case 'free':
        return 5;
      default:
        return Infinity; // Unlimited for all paid tiers
    }
  };

  const upgradeToPremium = async (planId: string) => {
    // In a real app, this would integrate with Stripe or another payment processor
    console.log(`Upgrading to plan: ${planId}`);
    // For now, this is a placeholder that would redirect to payment processing
    throw new Error('Payment processing not implemented - this would redirect to Stripe');
  };

  return {
    features,
    plans,
    hasFeature,
    canUseGenderFilter,
    canMakeVideoCalls,
    canSeeReadReceipts,
    canBrowseIncognito,
    hasPriorityMatching,
    canSendSuperLikes,
    hasAdvancedFilters,
    hasUnlimitedSwipes,
    isPremium,
    getCallQuality,
    getDailySwipeLimit,
    upgradeToPremium,
  };
}
