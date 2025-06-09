import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMatchSchema, 
  insertMessageSchema, 
  insertVideoCallSchema,
  insertWaitlistSchema,
  insertVerificationSchema,
  insertUserSwipeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Potential matches route
  app.get("/api/users/:id/potential-matches", async (req, res) => {
    try {
      const { genderFilter, ageRange, verifiedOnly } = req.query;
      const filters = {
        genderFilter: genderFilter as string,
        ageRange: ageRange ? JSON.parse(ageRange as string) : undefined,
        verifiedOnly: verifiedOnly === 'true',
      };
      
      const matches = await storage.getPotentialMatches(req.params.id, filters);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch potential matches" });
    }
  });

  // Match routes
  app.get("/api/matches/user/:userId", async (req, res) => {
    try {
      const matches = await storage.getUserMatches(req.params.userId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const matchData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(matchData);
      res.status(201).json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid match data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create match" });
    }
  });

  // User swipe/like routes
  app.post("/api/swipes", async (req, res) => {
    try {
      const swipeData = insertUserSwipeSchema.parse(req.body);
      const swipe = await storage.createUserSwipe(swipeData);
      
      // Check if this creates a match
      const isMatch = await storage.checkForMatch(swipeData.swiperId, swipeData.swipedId);
      
      res.status(201).json({ swipe, isMatch });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid swipe data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to record swipe" });
    }
  });

  // Message routes
  app.get("/api/matches/:matchId/messages", async (req, res) => {
    try {
      const messages = await storage.getMatchMessages(req.params.matchId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid message data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.put("/api/messages/:messageId/read", async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(req.params.messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // Video call routes
  app.post("/api/video-calls", async (req, res) => {
    try {
      const callData = insertVideoCallSchema.parse(req.body);
      const call = await storage.createVideoCall(callData);
      res.status(201).json(call);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid video call data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to initiate video call" });
    }
  });

  app.put("/api/video-calls/:callId/status", async (req, res) => {
    try {
      const { status } = req.body;
      const call = await storage.updateVideoCallStatus(req.params.callId, status);
      if (!call) {
        return res.status(404).json({ error: "Video call not found" });
      }
      res.json(call);
    } catch (error) {
      res.status(500).json({ error: "Failed to update video call status" });
    }
  });

  // Waitlist routes
  app.get("/api/waitlist", async (req, res) => {
    try {
      const waitlistEntries = await storage.getWaitlistEntries();
      res.json(waitlistEntries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch waitlist" });
    }
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      const waitlistData = insertWaitlistSchema.parse(req.body);
      const entry = await storage.addToWaitlist(waitlistData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid waitlist data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to join waitlist" });
    }
  });

  // Verification routes
  app.get("/api/verifications/user/:userId", async (req, res) => {
    try {
      const verifications = await storage.getUserVerifications(req.params.userId);
      res.json(verifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch verifications" });
    }
  });

  app.post("/api/verifications", async (req, res) => {
    try {
      const verificationData = insertVerificationSchema.parse(req.body);
      const verification = await storage.createVerification(verificationData);
      res.status(201).json(verification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid verification data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit verification" });
    }
  });

  app.put("/api/verifications/:verificationId/status", async (req, res) => {
    try {
      const { status, notes } = req.body;
      const verification = await storage.updateVerificationStatus(req.params.verificationId, status, notes);
      if (!verification) {
        return res.status(404).json({ error: "Verification not found" });
      }
      res.json(verification);
    } catch (error) {
      res.status(500).json({ error: "Failed to update verification status" });
    }
  });

  // Premium features routes
  app.get("/api/premium-features", async (req, res) => {
    try {
      const features = await storage.getPremiumFeatures();
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch premium features" });
    }
  });

  // User statistics for analytics
  app.get("/api/users/:id/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user statistics" });
    }
  });

  // Premium subscription simulation
  app.post("/api/users/:id/upgrade", async (req, res) => {
    try {
      const { tier } = req.body;
      const user = await storage.upgradeUser(req.params.id, tier);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to upgrade user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
