import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertUserSearchHistorySchema, 
  insertUserSavedCardSchema,
  type CardRecommendation
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Get all stores
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  // Search stores
  app.get("/api/stores/search", async (req, res) => {
    try {
      const { q, lat, lng } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }

      const userLat = lat ? parseFloat(lat as string) : undefined;
      const userLng = lng ? parseFloat(lng as string) : undefined;
      
      const stores = await storage.searchStores(q as string);
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to search stores" });
    }
  });

  // Get nearby stores
  app.get("/api/stores/nearby", async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      
      if (!lat || !lng || typeof lat !== "string" || typeof lng !== "string") {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusKm = radius ? parseFloat(radius as string) : 5;

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }

      const stores = await storage.getNearbyStores(latitude, longitude, radiusKm);
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nearby stores" });
    }
  });

  // Get store with category
  app.get("/api/stores/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const store = await storage.getStoreWithCategory(id);
      
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  // Get card recommendations for store
  app.get("/api/stores/:id/recommendations", async (req, res) => {
    try {
      const { id } = req.params;
      const { annualFee, creditScore } = req.query;
      
      // Try to get user ID if authenticated, but don't require it
      let userId: string | undefined;
      if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        userId = (req.user as any)?.claims?.sub;
      }
      
      let recommendations = await storage.getCardRecommendationsForStore(id, userId);
      
      // Apply filters
      if (annualFee !== undefined) {
        const maxFee = annualFee === "0" ? 0 : annualFee === "100" ? 100 : Infinity;
        recommendations = recommendations.filter((card: any) => card.annualFee <= maxFee);
      }
      
      if (creditScore !== undefined) {
        const minScore = parseInt(creditScore as string);
        if (!isNaN(minScore)) {
          recommendations = recommendations.filter((card: any) => card.minCreditScore <= minScore);
        }
      }
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Get all credit cards
  app.get("/api/credit-cards", async (req, res) => {
    try {
      const cards = await storage.getCreditCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit cards" });
    }
  });

  // Get specific credit card
  app.get("/api/credit-cards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const card = await storage.getCreditCard(id);
      
      if (!card) {
        return res.status(404).json({ message: "Credit card not found" });
      }
      
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit card" });
    }
  });

  // Get merchant categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getMerchantCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // User search history
  app.get("/api/search-history/:userSession", async (req, res) => {
    try {
      const { userSession } = req.params;
      const history = await storage.getUserSearchHistory(userSession);
      
      // Enrich with store data
      const enrichedHistory = [];
      for (const item of history) {
        const store = await storage.getStoreWithCategory(item.storeId);
        if (store) {
          enrichedHistory.push({
            ...item,
            store
          });
        }
      }
      
      res.json(enrichedHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch search history" });
    }
  });

  // Add to search history
  app.post("/api/search-history", async (req, res) => {
    try {
      const schema = z.object({
        storeId: z.string(),
        userId: z.string()
      });
      
      const { storeId, userId } = schema.parse(req.body);
      
      const history = await storage.addToSearchHistory({
        storeId,
        userId
      });
      
      res.json(history);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to search history" });
    }
  });

  // Get saved cards
  app.get("/api/saved-cards/:userSession", async (req, res) => {
    try {
      const { userSession } = req.params;
      const savedCards = await storage.getUserSavedCards(userSession);
      
      // Enrich with card data
      const enrichedSavedCards = [];
      for (const item of savedCards) {
        const card = await storage.getCreditCard(item.cardId);
        if (card) {
          enrichedSavedCards.push({
            ...item,
            card
          });
        }
      }
      
      res.json(enrichedSavedCards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved cards" });
    }
  });

  // Save card
  app.post("/api/saved-cards", isAuthenticated, async (req: any, res) => {
    try {
      const schema = z.object({
        cardId: z.string(),
      });
      
      const { cardId } = schema.parse(req.body);
      const userId = req.user.claims.sub;
      
      const savedCard = await storage.saveCard({
        cardId,
        userId
      });
      
      res.json(savedCard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save card" });
    }
  });

  // Unsave card
  app.delete("/api/saved-cards/:cardId", isAuthenticated, async (req: any, res) => {
    try {
      const { cardId } = req.params;
      const userId = req.user.claims.sub;
      
      const success = await storage.unsaveCard(userId, cardId);
      
      if (!success) {
        return res.status(404).json({ message: "Saved card not found" });
      }
      
      res.json({ message: "Card unsaved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unsave card" });
    }
  });

  // Purchase Plans API routes
  app.get('/api/purchase-plans/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const plans = await storage.getUserPurchasePlans(userId);
      const plansWithRecommendations = await Promise.all(plans.map(async (plan) => {
        let recommendedCards: any[] = [];
        let potentialEarnings = 0;
        
        if (plan.storeId) {
          recommendedCards = await storage.getCardRecommendationsForStore(plan.storeId, userId);
        } else if (plan.categoryId) {
          // Get cards for category
          const categoryRewards = await storage.getRewardsForCategory(plan.categoryId);
          const cardIds = categoryRewards.map(r => r.cardId);
          if (cardIds.length > 0) {
            const cards = await storage.getCreditCards();
            recommendedCards = cards.filter(c => cardIds.includes(c.id)).slice(0, 3);
          }
        }
        
        if (recommendedCards.length > 0) {
          const bestCard = recommendedCards[0];
          const categoryReward = await storage.getRewardsForCard(bestCard.id);
          const rewardRate = categoryReward.length > 0 ? parseFloat(categoryReward[0].rewardRate) : parseFloat(bestCard.baseReward);
          potentialEarnings = (parseFloat(plan.amount) * rewardRate) / 100;
        }
        
        return {
          ...plan,
          recommendedCards: recommendedCards.map(card => ({
            ...card,
            rewardRate: "2.0" // simplified for demo
          })),
          potentialEarnings
        };
      }));
      
      res.json(plansWithRecommendations);
    } catch (error) {
      console.error("Error fetching purchase plans:", error);
      res.status(500).json({ message: "Failed to fetch purchase plans" });
    }
  });

  app.post('/api/purchase-plans', isAuthenticated, async (req, res) => {
    try {
      const plan = await storage.createPurchasePlan(req.body);
      res.json(plan);
    } catch (error) {
      console.error("Error creating purchase plan:", error);
      res.status(500).json({ message: "Failed to create purchase plan" });
    }
  });

  app.patch('/api/purchase-plans/:id/complete', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await storage.updatePurchasePlan(id, { isCompleted: true });
      res.json(plan);
    } catch (error) {
      console.error("Error completing purchase plan:", error);
      res.status(500).json({ message: "Failed to complete purchase plan" });
    }
  });

  // Welcome Bonus Tracking API routes
  app.get('/api/welcome-bonus-tracking/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const trackings = await storage.getUserWelcomeBonusTracking(userId);
      const cards = await storage.getCreditCards();
      
      const trackingsWithProgress = trackings.map(tracking => {
        const card = cards.find(c => c.id === tracking.cardId);
        const progressPercentage = Math.min((parseFloat(tracking.currentSpending) / parseFloat(tracking.requiredSpending)) * 100, 100);
        const remainingSpending = Math.max(parseFloat(tracking.requiredSpending) - parseFloat(tracking.currentSpending), 0);
        
        // Calculate days remaining
        const startDate = new Date(tracking.startDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + tracking.timeframeMonths);
        const daysRemaining = Math.max(Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 0);
        
        return {
          ...tracking,
          card: card || { name: "Unknown Card", issuer: "Unknown" },
          progressPercentage,
          remainingSpending,
          daysRemaining
        };
      });
      
      res.json(trackingsWithProgress);
    } catch (error) {
      console.error("Error fetching welcome bonus tracking:", error);
      res.status(500).json({ message: "Failed to fetch welcome bonus tracking" });
    }
  });

  app.post('/api/welcome-bonus-tracking', isAuthenticated, async (req, res) => {
    try {
      const tracking = await storage.createWelcomeBonusTracking(req.body);
      res.json(tracking);
    } catch (error) {
      console.error("Error creating welcome bonus tracking:", error);
      res.status(500).json({ message: "Failed to create welcome bonus tracking" });
    }
  });

  app.patch('/api/welcome-bonus-tracking/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const tracking = await storage.updateWelcomeBonusTracking(id, req.body);
      res.json(tracking);
    } catch (error) {
      console.error("Error updating welcome bonus tracking:", error);
      res.status(500).json({ message: "Failed to update welcome bonus tracking" });
    }
  });

  app.patch('/api/welcome-bonus-tracking/:id/complete', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const tracking = await storage.updateWelcomeBonusTracking(id, { isCompleted: true });
      res.json(tracking);
    } catch (error) {
      console.error("Error completing welcome bonus tracking:", error);
      res.status(500).json({ message: "Failed to complete welcome bonus tracking" });
    }
  });

  // Card Comparisons API routes
  app.post('/api/card-comparisons', isAuthenticated, async (req, res) => {
    try {
      const comparison = await storage.createCardComparison({
        ...req.body,
        cardIds: JSON.stringify(req.body.cardIds)
      });
      res.json(comparison);
    } catch (error) {
      console.error("Error creating card comparison:", error);
      res.status(500).json({ message: "Failed to create card comparison" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
