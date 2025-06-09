export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  age?: number;
  gender?: 'male' | 'female';
  bio?: string;
  interests?: string[];
  profilePhoto?: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'none';
  premiumTier: 'free' | 'basic' | 'premium' | 'vip';
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  preferences?: {
    genderFilter?: 'all' | 'male' | 'female';
    ageRange?: [number, number];
    maxDistance?: number;
    verifiedOnly?: boolean;
  };
  createdAt: Date;
  lastActive: Date;
}

export interface Match {
  id: string;
  users: [string, string];
  createdAt: Date;
  lastMessageAt?: Date;
  status: 'active' | 'blocked' | 'unmatched';
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'video';
  timestamp: Date;
  readAt?: Date;
  reactions?: { [userId: string]: string };
}

export interface VideoCall {
  id: string;
  matchId: string;
  initiatorId: string;
  participantId: string;
  status: 'calling' | 'active' | 'ended' | 'missed';
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  quality: 'standard' | 'hd' | 'premium';
}

export interface WaitlistEntry {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  interestedFeatures: string[];
  position: number;
  createdAt: Date;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  requiredTier: 'basic' | 'premium' | 'vip';
  enabled: boolean;
}

export interface Verification {
  id: string;
  userId: string;
  type: 'photo' | 'id' | 'phone';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  documents?: string[];
  notes?: string;
}

export interface GenderFilter {
  type: 'all' | 'male' | 'female';
  isPremium: boolean;
}

export interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  tier: 'basic' | 'premium' | 'vip';
  popular?: boolean;
}
