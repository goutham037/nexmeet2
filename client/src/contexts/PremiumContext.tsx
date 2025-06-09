import React, { createContext, useContext } from 'react';
import { usePremium } from '@/hooks/usePremium';
import { useAuthContext } from './AuthContext';
import { PremiumFeature, PremiumPlan } from '@/types';

interface PremiumContextType {
  features: PremiumFeature[];
  plans: PremiumPlan[];
  hasFeature: (featureId: string) => boolean;
  canUseGenderFilter: (gender: 'male' | 'female') => boolean;
  canMakeVideoCalls: () => boolean;
  canSeeReadReceipts: () => boolean;
  canBrowseIncognito: () => boolean;
  hasPriorityMatching: () => boolean;
  canSendSuperLikes: () => boolean;
  hasAdvancedFilters: () => boolean;
  hasUnlimitedSwipes: () => boolean;
  isPremium: () => boolean;
  getCallQuality: () => 'standard' | 'hd' | 'premium';
  getDailySwipeLimit: () => number;
  upgradeToPremium: (planId: string) => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const premium = usePremium(user);

  return (
    <PremiumContext.Provider value={premium}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremiumContext() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremiumContext must be used within a PremiumProvider');
  }
  return context;
}
