import { 
  users, 
  matches, 
  messages, 
  videoCalls, 
  waitlist, 
  verifications, 
  premiumFeatures,
  userSwipes,
  type User, 
  type InsertUser, 
  type Match, 
  type InsertMatch, 
  type Message, 
  type InsertMessage, 
  type VideoCall, 
  type InsertVideoCall,
  type WaitlistEntry,
  type InsertWaitlistEntry,
  type Verification,
  type InsertVerification,
  type PremiumFeature,
  type UserSwipe,
  type InsertUserSwipe
} from "@shared/schema";

interface MatchFilters {
  genderFilter?: string;
  ageRange?: [number, number];
  verifiedOnly?: boolean;
}

interface UserStats {
  totalMatches: number;
  totalMessages: number;
  totalVideoCalls: number;
  profileViews: number;
  likesReceived: number;
  likesSent: number;
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  upgradeUser(id: string, tier: string): Promise<User | undefined>;
  getPotentialMatches(userId: string, filters: MatchFilters): Promise<User[]>;
  getUserStats(userId: string): Promise<UserStats>;

  // Match operations
  getUserMatches(userId: string): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  checkForMatch(swiperId: string, swipedId: string): Promise<boolean>;

  // User swipe operations
  createUserSwipe(swipe: InsertUserSwipe): Promise<UserSwipe>;

  // Message operations
  getMatchMessages(matchId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: string): Promise<Message | undefined>;

  // Video call operations
  createVideoCall(call: InsertVideoCall): Promise<VideoCall>;
  updateVideoCallStatus(callId: string, status: string): Promise<VideoCall | undefined>;

  // Waitlist operations
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;

  // Verification operations
  getUserVerifications(userId: string): Promise<Verification[]>;
  createVerification(verification: InsertVerification): Promise<Verification>;
  updateVerificationStatus(verificationId: string, status: string, notes?: string): Promise<Verification | undefined>;

  // Premium features
  getPremiumFeatures(): Promise<PremiumFeature[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private matches: Map<string, Match>;
  private messages: Map<string, Message>;
  private videoCalls: Map<string, VideoCall>;
  private waitlistEntries: Map<string, WaitlistEntry>;
  private verifications: Map<string, Verification>;
  private userSwipes: Map<string, UserSwipe>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.matches = new Map();
    this.messages = new Map();
    this.videoCalls = new Map();
    this.waitlistEntries = new Map();
    this.verifications = new Map();
    this.userSwipes = new Map();
    this.currentId = 1;
    
    // Initialize with some premium features
    this.initializePremiumFeatures();
  }

  private generateId(): string {
    return (this.currentId++).toString();
  }

  private initializePremiumFeatures() {
    // This would normally be seeded in the database
    // For demo purposes, we'll just keep the feature definitions in the frontend
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      lastActive: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = { 
      ...user, 
      ...updates,
      lastActive: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async upgradeUser(id: string, tier: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = { 
      ...user, 
      premiumTier: tier as any,
      lastActive: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getPotentialMatches(userId: string, filters: MatchFilters): Promise<User[]> {
    const currentUser = this.users.get(userId);
    if (!currentUser) return [];

    // Get all swipes by this user to exclude already swiped profiles
    const userSwipes = Array.from(this.userSwipes.values())
      .filter(swipe => swipe.swiperId === userId)
      .map(swipe => swipe.swipedId);

    let potentialMatches = Array.from(this.users.values())
      .filter(user => 
        user.id !== userId && 
        !userSwipes.includes(user.id)
      );

    // Apply filters
    if (filters.genderFilter && filters.genderFilter !== 'all') {
      potentialMatches = potentialMatches.filter(user => user.gender === filters.genderFilter);
    }

    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange;
      potentialMatches = potentialMatches.filter(user => 
        user.age && user.age >= minAge && user.age <= maxAge
      );
    }

    if (filters.verifiedOnly) {
      potentialMatches = potentialMatches.filter(user => user.isVerified);
    }

    // Limit to 10 potential matches for performance
    return potentialMatches.slice(0, 10);
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const userMatches = Array.from(this.matches.values())
      .filter(match => match.user1Id === userId || match.user2Id === userId);

    const userMessages = Array.from(this.messages.values())
      .filter(message => message.senderId === userId);

    const userVideoCalls = Array.from(this.videoCalls.values())
      .filter(call => call.initiatorId === userId || call.participantId === userId);

    const likesReceived = Array.from(this.userSwipes.values())
      .filter(swipe => swipe.swipedId === userId && swipe.action === 'like').length;

    const likesSent = Array.from(this.userSwipes.values())
      .filter(swipe => swipe.swiperId === userId && swipe.action === 'like').length;

    return {
      totalMatches: userMatches.length,
      totalMessages: userMessages.length,
      totalVideoCalls: userVideoCalls.length,
      profileViews: Math.floor(Math.random() * 100) + 50, // Mock data
      likesReceived,
      likesSent,
    };
  }

  // Match operations
  async getUserMatches(userId: string): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => match.user1Id === userId || match.user2Id === userId)
      .sort((a, b) => (b.lastMessageAt?.getTime() || b.createdAt!.getTime()) - (a.lastMessageAt?.getTime() || a.createdAt!.getTime()));
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.generateId();
    const match: Match = { 
      ...insertMatch, 
      id,
      createdAt: new Date(),
    };
    this.matches.set(id, match);
    return match;
  }

  async checkForMatch(swiperId: string, swipedId: string): Promise<boolean> {
    // Check if the swiped user has also liked the swiper
    const reciprocalSwipe = Array.from(this.userSwipes.values())
      .find(swipe => 
        swipe.swiperId === swipedId && 
        swipe.swipedId === swiperId && 
        swipe.action === 'like'
      );

    if (reciprocalSwipe) {
      // Create a match
      await this.createMatch({
        user1Id: swiperId,
        user2Id: swipedId,
        status: 'active',
      });
      return true;
    }

    return false;
  }

  // User swipe operations
  async createUserSwipe(insertSwipe: InsertUserSwipe): Promise<UserSwipe> {
    const id = this.generateId();
    const swipe: UserSwipe = { 
      ...insertSwipe, 
      id,
      timestamp: new Date(),
    };
    this.userSwipes.set(id, swipe);
    return swipe;
  }

  // Message operations
  async getMatchMessages(matchId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.matchId === matchId)
      .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.generateId();
    const message: Message = { 
      ...insertMessage, 
      id,
      timestamp: new Date(),
    };
    this.messages.set(id, message);

    // Update match's lastMessageAt
    const match = this.matches.get(insertMessage.matchId);
    if (match) {
      match.lastMessageAt = new Date();
      this.matches.set(insertMessage.matchId, match);
    }

    return message;
  }

  async markMessageAsRead(messageId: string): Promise<Message | undefined> {
    const message = this.messages.get(messageId);
    if (!message) return undefined;

    message.readAt = new Date();
    this.messages.set(messageId, message);
    return message;
  }

  // Video call operations
  async createVideoCall(insertCall: InsertVideoCall): Promise<VideoCall> {
    const id = this.generateId();
    const call: VideoCall = { 
      ...insertCall, 
      id,
    };
    this.videoCalls.set(id, call);
    return call;
  }

  async updateVideoCallStatus(callId: string, status: string): Promise<VideoCall | undefined> {
    const call = this.videoCalls.get(callId);
    if (!call) return undefined;

    call.status = status as any;
    
    if (status === 'active' && !call.startedAt) {
      call.startedAt = new Date();
    }
    
    if (status === 'ended' && !call.endedAt) {
      call.endedAt = new Date();
      if (call.startedAt) {
        call.duration = Math.floor((call.endedAt.getTime() - call.startedAt.getTime()) / 1000);
      }
    }

    this.videoCalls.set(callId, call);
    return call;
  }

  // Waitlist operations
  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values())
      .sort((a, b) => a.position - b.position);
  }

  async addToWaitlist(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.generateId();
    const position = this.waitlistEntries.size + 1;
    const entry: WaitlistEntry = { 
      ...insertEntry, 
      id,
      position,
      createdAt: new Date(),
    };
    this.waitlistEntries.set(id, entry);
    return entry;
  }

  // Verification operations
  async getUserVerifications(userId: string): Promise<Verification[]> {
    return Array.from(this.verifications.values())
      .filter(verification => verification.userId === userId)
      .sort((a, b) => b.submittedAt!.getTime() - a.submittedAt!.getTime());
  }

  async createVerification(insertVerification: InsertVerification): Promise<Verification> {
    const id = this.generateId();
    const verification: Verification = { 
      ...insertVerification, 
      id,
      submittedAt: new Date(),
    };
    this.verifications.set(id, verification);
    return verification;
  }

  async updateVerificationStatus(verificationId: string, status: string, notes?: string): Promise<Verification | undefined> {
    const verification = this.verifications.get(verificationId);
    if (!verification) return undefined;

    verification.status = status as any;
    verification.reviewedAt = new Date();
    if (notes) verification.notes = notes;

    // If approved, update user's verification status
    if (status === 'approved') {
      const user = this.users.get(verification.userId);
      if (user) {
        user.isVerified = true;
        user.verificationStatus = 'approved';
        this.users.set(verification.userId, user);
      }
    }

    this.verifications.set(verificationId, verification);
    return verification;
  }

  // Premium features
  async getPremiumFeatures(): Promise<PremiumFeature[]> {
    // Return static features - in a real app this would come from the database
    return [
      {
        id: 'gender-filters',
        name: 'Gender-Specific Filters',
        description: 'Connect exclusively with girls or boys',
        requiredTier: 'premium',
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
        id: 'unlimited-swipes',
        name: 'Unlimited Swipes',
        description: 'No daily limits on likes and matches',
        requiredTier: 'basic',
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
        id: 'super-likes',
        name: 'Super Likes & Gifts',
        description: 'Send super likes and premium gifts',
        requiredTier: 'vip',
        enabled: true,
      },
    ];
  }
}

export const storage = new MemStorage();
