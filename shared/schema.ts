import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with enhanced location and premium features
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  age: integer("age"),
  gender: text("gender").$type<'male' | 'female'>(),
  bio: text("bio"),
  interests: jsonb("interests").$type<string[]>().default([]),
  profilePhoto: text("profile_photo"),
  profilePhotos: jsonb("profile_photos").$type<string[]>().default([]),
  isVerified: boolean("is_verified").default(false),
  verificationStatus: text("verification_status").$type<'pending' | 'approved' | 'rejected' | 'none'>().default('none'),
  premiumTier: text("premium_tier").$type<'free' | 'basic' | 'premium' | 'vip'>().default('free'),
  premiumExpiresAt: timestamp("premium_expires_at"),
  location: jsonb("location").$type<{
    country?: string;
    state?: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  }>(),
  preferences: jsonb("preferences").$type<{
    genderFilter?: 'all' | 'male' | 'female';
    ageRange?: [number, number];
    maxDistance?: number;
    verifiedOnly?: boolean;
    languagePreference?: string[];
  }>(),
  languagesSpoken: jsonb("languages_spoken").$type<string[]>().default(['Hindi', 'English']),
  phoneNumber: text("phone_number"),
  upiId: text("upi_id"), // For Indian payments
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default('0.00'),
  profileViews: integer("profile_views").default(0),
  isOnline: boolean("is_online").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastActive: timestamp("last_active").defaultNow(),
});

// Matches table
export const matches = pgTable("matches", {
  id: varchar("id", { length: 255 }).primaryKey(),
  user1Id: varchar("user1_id", { length: 255 }).notNull(),
  user2Id: varchar("user2_id", { length: 255 }).notNull(),
  status: text("status").$type<'active' | 'blocked' | 'unmatched'>().default('active'),
  createdAt: timestamp("created_at").defaultNow(),
  lastMessageAt: timestamp("last_message_at"),
});

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  matchId: varchar("match_id", { length: 255 }).notNull(),
  senderId: varchar("sender_id", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: text("type").$type<'text' | 'image' | 'voice' | 'video'>().default('text'),
  timestamp: timestamp("timestamp").defaultNow(),
  readAt: timestamp("read_at"),
  reactions: jsonb("reactions").$type<{ [userId: string]: string }>(),
});

// Video calls table
export const videoCalls = pgTable("video_calls", {
  id: varchar("id", { length: 255 }).primaryKey(),
  matchId: varchar("match_id", { length: 255 }).notNull(),
  initiatorId: varchar("initiator_id", { length: 255 }).notNull(),
  participantId: varchar("participant_id", { length: 255 }).notNull(),
  status: text("status").$type<'calling' | 'active' | 'ended' | 'missed'>().default('calling'),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  duration: integer("duration"), // in seconds
  quality: text("quality").$type<'standard' | 'hd' | 'premium'>().default('standard'),
});

// Waitlist table
export const waitlist = pgTable("waitlist", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  interestedFeatures: jsonb("interested_features").$type<string[]>().default([]),
  position: serial("position"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Verifications table
export const verifications = pgTable("verifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: text("type").$type<'photo' | 'id' | 'phone'>().notNull(),
  status: text("status").$type<'pending' | 'approved' | 'rejected'>().default('pending'),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  documents: jsonb("documents").$type<string[]>(),
  notes: text("notes"),
});

// Premium features table
export const premiumFeatures = pgTable("premium_features", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  requiredTier: text("required_tier").$type<'basic' | 'premium' | 'vip'>().notNull(),
  enabled: boolean("enabled").default(true),
});

// User swipes/likes table for matching algorithm
export const userSwipes = pgTable("user_swipes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  swiperId: varchar("swiper_id", { length: 255 }).notNull(),
  swipedId: varchar("swiped_id", { length: 255 }).notNull(),
  action: text("action").$type<'like' | 'pass' | 'super_like'>().notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Social Rooms - for country-based, anonymous, and social rooms
export const socialRooms = pgTable("social_rooms", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  roomType: text("room_type").$type<'country' | 'anonymous' | 'social' | 'topic' | 'language'>().notNull(),
  accessLevel: text("access_level").$type<'public' | 'premium' | 'vip'>().default('public'),
  country: text("country"), // For country-based rooms
  language: text("language"), // For language-based rooms
  topic: text("topic"), // For topic-based rooms
  maxMembers: integer("max_members").default(50),
  currentMembers: integer("current_members").default(0),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  settings: jsonb("settings").$type<{
    allowImages?: boolean;
    allowVoice?: boolean;
    allowVideo?: boolean;
    moderationLevel?: 'low' | 'medium' | 'high';
  }>().default({}),
});

// Room Members
export const roomMembers = pgTable("room_members", {
  id: varchar("id", { length: 255 }).primaryKey(),
  roomId: varchar("room_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  role: text("role").$type<'member' | 'moderator' | 'admin'>().default('member'),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActive: timestamp("last_active").defaultNow(),
  isAnonymous: boolean("is_anonymous").default(false),
  anonymousName: text("anonymous_name"),
});

// Room Messages
export const roomMessages = pgTable("room_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  roomId: varchar("room_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").$type<'text' | 'image' | 'voice' | 'video' | 'gif' | 'sticker'>().default('text'),
  isAnonymous: boolean("is_anonymous").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
  editedAt: timestamp("edited_at"),
  reactions: jsonb("reactions").$type<{ [emoji: string]: string[] }>().default({}),
  replyTo: varchar("reply_to", { length: 255 }),
});

// Payment Transactions - for Indian payment methods
export const transactions = pgTable("transactions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default('INR'),
  paymentMethod: text("payment_method").$type<'upi' | 'wallet' | 'netbanking' | 'card' | 'paytm' | 'phonepe' | 'googlepay'>().notNull(),
  paymentGateway: text("payment_gateway").$type<'razorpay' | 'paytm' | 'phonepe' | 'manual'>().notNull(),
  transactionId: text("transaction_id"),
  status: text("status").$type<'pending' | 'completed' | 'failed' | 'refunded'>().default('pending'),
  type: text("type").$type<'premium_upgrade' | 'virtual_gift' | 'room_access' | 'super_like' | 'boost' | 'wallet_topup'>().notNull(),
  description: text("description"),
  metadata: jsonb("metadata").$type<{
    planId?: string;
    giftId?: string;
    recipientId?: string;
    roomId?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Virtual Gifts
export const virtualGifts = pgTable("virtual_gifts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  category: text("category").$type<'flowers' | 'jewelry' | 'food' | 'celebration' | 'love' | 'premium'>().notNull(),
  isActive: boolean("is_active").default(true),
  rarity: text("rarity").$type<'common' | 'rare' | 'epic' | 'legendary'>().default('common'),
});

// Gift Transactions
export const giftTransactions = pgTable("gift_transactions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  senderId: varchar("sender_id", { length: 255 }).notNull(),
  receiverId: varchar("receiver_id", { length: 255 }).notNull(),
  giftId: varchar("gift_id", { length: 255 }).notNull(),
  message: text("message"),
  sentAt: timestamp("sent_at").defaultNow(),
  isAnonymous: boolean("is_anonymous").default(false),
});

// User Activities & Analytics
export const userActivities = pgTable("user_activities", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  activityType: text("activity_type").$type<'login' | 'logout' | 'profile_view' | 'match' | 'message' | 'room_join' | 'gift_sent' | 'premium_upgrade'>().notNull(),
  targetId: varchar("target_id", { length: 255 }), // ID of the target (user, room, etc.)
  metadata: jsonb("metadata").$type<any>().default({}),
  timestamp: timestamp("timestamp").defaultNow(),
});

// User Reports
export const userReports = pgTable("user_reports", {
  id: varchar("id", { length: 255 }).primaryKey(),
  reporterId: varchar("reporter_id", { length: 255 }).notNull(),
  reportedId: varchar("reported_id", { length: 255 }).notNull(),
  reason: text("reason").$type<'inappropriate_content' | 'harassment' | 'fake_profile' | 'spam' | 'other'>().notNull(),
  description: text("description"),
  evidence: jsonb("evidence").$type<string[]>().default([]),
  status: text("status").$type<'pending' | 'investigating' | 'resolved' | 'dismissed'>().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  moderatorNotes: text("moderator_notes"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastActive: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertVideoCallSchema = createInsertSchema(videoCalls).omit({
  id: true,
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  position: true,
  createdAt: true,
});

export const insertVerificationSchema = createInsertSchema(verifications).omit({
  id: true,
  submittedAt: true,
});

export const insertUserSwipeSchema = createInsertSchema(userSwipes).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type VideoCall = typeof videoCalls.$inferSelect;
export type InsertVideoCall = z.infer<typeof insertVideoCallSchema>;

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;

export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;

export type PremiumFeature = typeof premiumFeatures.$inferSelect;

export type UserSwipe = typeof userSwipes.$inferSelect;
export type InsertUserSwipe = z.infer<typeof insertUserSwipeSchema>;

// New enhanced types for social features
export const insertSocialRoomSchema = createInsertSchema(socialRooms).omit({
  id: true,
  createdAt: true,
  currentMembers: true,
});

export const insertRoomMemberSchema = createInsertSchema(roomMembers).omit({
  id: true,
  joinedAt: true,
  lastActive: true,
});

export const insertRoomMessageSchema = createInsertSchema(roomMessages).omit({
  id: true,
  timestamp: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertVirtualGiftSchema = createInsertSchema(virtualGifts).omit({
  id: true,
});

export const insertGiftTransactionSchema = createInsertSchema(giftTransactions).omit({
  id: true,
  sentAt: true,
});

export const insertUserActivitySchema = createInsertSchema(userActivities).omit({
  id: true,
  timestamp: true,
});

export const insertUserReportSchema = createInsertSchema(userReports).omit({
  id: true,
  createdAt: true,
});

export type SocialRoom = typeof socialRooms.$inferSelect;
export type InsertSocialRoom = z.infer<typeof insertSocialRoomSchema>;

export type RoomMember = typeof roomMembers.$inferSelect;
export type InsertRoomMember = z.infer<typeof insertRoomMemberSchema>;

export type RoomMessage = typeof roomMessages.$inferSelect;
export type InsertRoomMessage = z.infer<typeof insertRoomMessageSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type VirtualGift = typeof virtualGifts.$inferSelect;
export type InsertVirtualGift = z.infer<typeof insertVirtualGiftSchema>;

export type GiftTransaction = typeof giftTransactions.$inferSelect;
export type InsertGiftTransaction = z.infer<typeof insertGiftTransactionSchema>;

export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;

export type UserReport = typeof userReports.$inferSelect;
export type InsertUserReport = z.infer<typeof insertUserReportSchema>;
