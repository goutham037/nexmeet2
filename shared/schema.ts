import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
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
  isVerified: boolean("is_verified").default(false),
  verificationStatus: text("verification_status").$type<'pending' | 'approved' | 'rejected' | 'none'>().default('none'),
  premiumTier: text("premium_tier").$type<'free' | 'basic' | 'premium' | 'vip'>().default('free'),
  location: jsonb("location").$type<{
    country?: string;
    state?: string;
    city?: string;
  }>(),
  preferences: jsonb("preferences").$type<{
    genderFilter?: 'all' | 'male' | 'female';
    ageRange?: [number, number];
    maxDistance?: number;
    verifiedOnly?: boolean;
  }>(),
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
