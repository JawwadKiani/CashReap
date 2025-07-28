import { 
  type CreditCard, 
  type InsertCreditCard,
  type MerchantCategory,
  type InsertMerchantCategory,
  type CardCategoryReward,
  type InsertCardCategoryReward,
  type Store,
  type InsertStore,
  type UserSearchHistory,
  type InsertUserSearchHistory,
  type UserSavedCard,
  type InsertUserSavedCard,
  type User,
  type UpsertUser,
  type StoreWithCategory,
  type CardRecommendation,
  type UserSpendingProfile,
  type InsertUserSpendingProfile,
  type PurchasePlan,
  type InsertPurchasePlan,
  type WelcomeBonusTracking,
  type InsertWelcomeBonusTracking,
  type UserPreferences,
  type InsertUserPreferences,
  type CardComparison,
  type InsertCardComparison,
  users,
  userSearchHistory,
  userSavedCards,
  creditCards,
  merchantCategories,
  cardCategoryRewards,
  stores,
  userSpendingProfiles,
  purchasePlans,
  welcomeBonusTracking,
  userPreferences,
  cardComparisons
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Credit Cards
  getCreditCards(): Promise<CreditCard[]>;
  getCreditCard(id: string): Promise<CreditCard | undefined>;
  createCreditCard(card: InsertCreditCard): Promise<CreditCard>;

  // Merchant Categories
  getMerchantCategories(): Promise<MerchantCategory[]>;
  getMerchantCategory(id: string): Promise<MerchantCategory | undefined>;
  createMerchantCategory(category: InsertMerchantCategory): Promise<MerchantCategory>;

  // Card Category Rewards
  getCardCategoryRewards(): Promise<CardCategoryReward[]>;
  getRewardsForCard(cardId: string): Promise<CardCategoryReward[]>;
  getRewardsForCategory(categoryId: string): Promise<CardCategoryReward[]>;
  createCardCategoryReward(reward: InsertCardCategoryReward): Promise<CardCategoryReward>;

  // Stores
  getStores(): Promise<Store[]>;
  getStore(id: string): Promise<Store | undefined>;
  getStoreWithCategory(id: string): Promise<StoreWithCategory | undefined>;
  searchStores(query: string): Promise<StoreWithCategory[]>;
  getNearbyStores(latitude: number, longitude: number, radiusKm?: number): Promise<StoreWithCategory[]>;
  createStore(store: InsertStore): Promise<Store>;

  // User Search History
  getUserSearchHistory(userId: string): Promise<UserSearchHistory[]>;
  addToSearchHistory(history: InsertUserSearchHistory): Promise<UserSearchHistory>;

  // User Saved Cards
  getUserSavedCards(userId: string): Promise<UserSavedCard[]>;
  saveCard(savedCard: InsertUserSavedCard): Promise<UserSavedCard>;
  unsaveCard(userId: string, cardId: string): Promise<boolean>;

  // Recommendations
  getCardRecommendationsForStore(storeId: string, userId?: string): Promise<CreditCard[]>;

  // User Spending Profiles
  getUserSpendingProfile(userId: string): Promise<UserSpendingProfile[]>;
  updateSpendingProfile(profile: InsertUserSpendingProfile): Promise<UserSpendingProfile>;

  // Purchase Plans
  getUserPurchasePlans(userId: string): Promise<PurchasePlan[]>;
  createPurchasePlan(plan: InsertPurchasePlan): Promise<PurchasePlan>;
  updatePurchasePlan(id: string, updates: Partial<PurchasePlan>): Promise<PurchasePlan>;
  deletePurchasePlan(id: string): Promise<boolean>;

  // Welcome Bonus Tracking
  getUserWelcomeBonusTracking(userId: string): Promise<WelcomeBonusTracking[]>;
  createWelcomeBonusTracking(tracking: InsertWelcomeBonusTracking): Promise<WelcomeBonusTracking>;
  updateWelcomeBonusTracking(id: string, updates: Partial<WelcomeBonusTracking>): Promise<WelcomeBonusTracking>;

  // User Preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;

  // Card Comparisons
  getUserCardComparisons(userId: string): Promise<CardComparison[]>;
  createCardComparison(comparison: InsertCardComparison): Promise<CardComparison>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Credit Cards
  async getCreditCards(): Promise<CreditCard[]> {
    return await db.select().from(creditCards).where(eq(creditCards.isActive, true));
  }

  async getCreditCard(id: string): Promise<CreditCard | undefined> {
    const [card] = await db.select().from(creditCards).where(eq(creditCards.id, id));
    return card;
  }

  async createCreditCard(card: InsertCreditCard): Promise<CreditCard> {
    const [newCard] = await db.insert(creditCards).values(card).returning();
    return newCard;
  }

  // Merchant Categories
  async getMerchantCategories(): Promise<MerchantCategory[]> {
    return await db.select().from(merchantCategories);
  }

  async getMerchantCategory(id: string): Promise<MerchantCategory | undefined> {
    const [category] = await db.select().from(merchantCategories).where(eq(merchantCategories.id, id));
    return category;
  }

  async createMerchantCategory(category: InsertMerchantCategory): Promise<MerchantCategory> {
    const [newCategory] = await db.insert(merchantCategories).values(category).returning();
    return newCategory;
  }

  // Card Category Rewards
  async getCardCategoryRewards(): Promise<CardCategoryReward[]> {
    return await db.select().from(cardCategoryRewards);
  }

  async getRewardsForCard(cardId: string): Promise<CardCategoryReward[]> {
    return await db.select().from(cardCategoryRewards).where(eq(cardCategoryRewards.cardId, cardId));
  }

  async getRewardsForCategory(categoryId: string): Promise<CardCategoryReward[]> {
    return await db.select().from(cardCategoryRewards).where(eq(cardCategoryRewards.categoryId, categoryId));
  }

  async createCardCategoryReward(reward: InsertCardCategoryReward): Promise<CardCategoryReward> {
    const [newReward] = await db.insert(cardCategoryRewards).values(reward).returning();
    return newReward;
  }

  // Stores
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async getStore(id: string): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }

  async getStoreWithCategory(id: string): Promise<StoreWithCategory | undefined> {
    const store = await this.getStore(id);
    if (!store) return undefined;
    
    const category = await this.getMerchantCategory(store.categoryId);
    if (!category) return undefined;

    return { ...store, category };
  }

  async searchStores(query: string): Promise<StoreWithCategory[]> {
    // For simplicity, return all stores that match the query
    const allStores = await db.select().from(stores);
    const allCategories = await db.select().from(merchantCategories);
    
    const filteredStores = allStores
      .filter(store => store.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 20);
    
    const storesWithCategories: StoreWithCategory[] = [];
    for (const store of filteredStores) {
      const category = allCategories.find(c => c.id === store.categoryId);
      if (category) {
        storesWithCategories.push({ ...store, category });
      }
    }
    
    return storesWithCategories;
  }

  async getNearbyStores(latitude: number, longitude: number, radiusKm: number = 5): Promise<StoreWithCategory[]> {
    // For demo purposes, return empty array as we don't have real location data
    return [];
  }

  async createStore(store: InsertStore): Promise<Store> {
    const [newStore] = await db.insert(stores).values(store).returning();
    return newStore;
  }

  // User Search History
  async getUserSearchHistory(userId: string): Promise<UserSearchHistory[]> {
    return await db.select().from(userSearchHistory).where(eq(userSearchHistory.userId, userId));
  }

  async addToSearchHistory(history: InsertUserSearchHistory): Promise<UserSearchHistory> {
    const [newHistory] = await db.insert(userSearchHistory).values(history).returning();
    return newHistory;
  }

  // User Saved Cards
  async getUserSavedCards(userId: string): Promise<UserSavedCard[]> {
    return await db.select().from(userSavedCards).where(eq(userSavedCards.userId, userId));
  }

  async saveCard(savedCard: InsertUserSavedCard): Promise<UserSavedCard> {
    const [newSavedCard] = await db.insert(userSavedCards).values(savedCard).returning();
    return newSavedCard;
  }

  async unsaveCard(userId: string, cardId: string): Promise<boolean> {
    const result = await db.delete(userSavedCards)
      .where(and(eq(userSavedCards.userId, userId), eq(userSavedCards.cardId, cardId)));
    return (result.rowCount || 0) > 0;
  }

  // Utility function to get current quarter
  private getCurrentQuarter(): string {
    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    
    if (month >= 1 && month <= 3) return "Q1";
    if (month >= 4 && month <= 6) return "Q2";
    if (month >= 7 && month <= 9) return "Q3";
    return "Q4";
  }

  // Recommendations
  async getCardRecommendationsForStore(storeId: string, userId?: string): Promise<CreditCard[]> {
    // Get store with category
    const store = await this.getStoreWithCategory(storeId);
    if (!store) return [];

    // Get all cards that have rewards for this category
    const categoryRewards = await db
      .select({
        cardId: cardCategoryRewards.cardId,
        rewardRate: cardCategoryRewards.rewardRate,
      })
      .from(cardCategoryRewards)
      .where(eq(cardCategoryRewards.categoryId, store.categoryId));

    // Get the cards and sort by reward rate
    const cardIds = categoryRewards.map(r => r.cardId);
    if (cardIds.length === 0) {
      // If no specific category rewards, return top general cards
      const topCards = await db.select().from(creditCards).limit(5);
      return topCards;
    }

    let cards = await db
      .select()
      .from(creditCards)
      .where(inArray(creditCards.id, cardIds));

    // Create a map of reward rates
    const rewardMap = new Map(categoryRewards.map(r => [r.cardId, r.rewardRate]));

    // Sort by reward rate (highest first)
    const sortByReward = (a: CreditCard, b: CreditCard) => {
      const aRate = parseFloat(rewardMap.get(a.id) || "0");
      const bRate = parseFloat(rewardMap.get(b.id) || "0");
      return bRate - aRate;
    };

    // If user is provided, prioritize their saved cards but show all relevant cards
    if (userId) {
      try {
        const userSavedCardResults = await db
          .select({ cardId: userSavedCards.cardId })
          .from(userSavedCards)
          .where(eq(userSavedCards.userId, userId));
        
        const savedCardIds = new Set(userSavedCardResults.map(sc => sc.cardId));
        
        // Separate saved and non-saved cards
        const savedCards = cards.filter(card => savedCardIds.has(card.id));
        const otherCards = cards.filter(card => !savedCardIds.has(card.id));
        
        // Sort each group by reward rate
        savedCards.sort(sortByReward);
        otherCards.sort(sortByReward);
        
        // Return saved cards first, then top 2 other cards with highest rewards
        return [...savedCards, ...otherCards.slice(0, 2)];
      } catch (error) {
        console.error("Error fetching user saved cards:", error);
        // Fallback to showing all cards if user query fails
        cards.sort(sortByReward);
        return cards;
      }
    }

    // Sort by reward rate (highest first) and return top 5 cards
    cards.sort(sortByReward);
    return cards.slice(0, 5);
  }

  // User Spending Profiles
  async getUserSpendingProfile(userId: string): Promise<UserSpendingProfile[]> {
    return await db.select().from(userSpendingProfiles).where(eq(userSpendingProfiles.userId, userId));
  }

  async updateSpendingProfile(profile: InsertUserSpendingProfile): Promise<UserSpendingProfile> {
    const [result] = await db
      .insert(userSpendingProfiles)
      .values(profile)
      .onConflictDoUpdate({
        target: [userSpendingProfiles.userId, userSpendingProfiles.categoryId],
        set: {
          monthlySpending: profile.monthlySpending,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  // Purchase Plans
  async getUserPurchasePlans(userId: string): Promise<PurchasePlan[]> {
    return await db.select().from(purchasePlans).where(eq(purchasePlans.userId, userId));
  }

  async createPurchasePlan(plan: InsertPurchasePlan): Promise<PurchasePlan> {
    const [result] = await db.insert(purchasePlans).values(plan).returning();
    return result;
  }

  async updatePurchasePlan(id: string, updates: Partial<PurchasePlan>): Promise<PurchasePlan> {
    const [result] = await db
      .update(purchasePlans)
      .set(updates)
      .where(eq(purchasePlans.id, id))
      .returning();
    return result;
  }

  async deletePurchasePlan(id: string): Promise<boolean> {
    const result = await db.delete(purchasePlans).where(eq(purchasePlans.id, id));
    return result.rowCount > 0;
  }

  // Welcome Bonus Tracking
  async getUserWelcomeBonusTracking(userId: string): Promise<WelcomeBonusTracking[]> {
    return await db.select().from(welcomeBonusTracking).where(eq(welcomeBonusTracking.userId, userId));
  }

  async createWelcomeBonusTracking(tracking: InsertWelcomeBonusTracking): Promise<WelcomeBonusTracking> {
    const [result] = await db.insert(welcomeBonusTracking).values(tracking).returning();
    return result;
  }

  async updateWelcomeBonusTracking(id: string, updates: Partial<WelcomeBonusTracking>): Promise<WelcomeBonusTracking> {
    const [result] = await db
      .update(welcomeBonusTracking)
      .set(updates)
      .where(eq(welcomeBonusTracking.id, id))
      .returning();
    return result;
  }

  // User Preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [result] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return result;
  }

  async updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [result] = await db
      .insert(userPreferences)
      .values(preferences)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...preferences,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  // Card Comparisons
  async getUserCardComparisons(userId: string): Promise<CardComparison[]> {
    return await db.select().from(cardComparisons).where(eq(cardComparisons.userId, userId));
  }

  async createCardComparison(comparison: InsertCardComparison): Promise<CardComparison> {
    const [result] = await db.insert(cardComparisons).values(comparison).returning();
    return result;
  }

  // Seed initial data
  private async seedData() {
    // Check if data already exists
    const existingCards = await db.select().from(creditCards).limit(1);
    if (existingCards.length > 0) return; // Data already seeded

    console.log("Seeding initial data...");
    
    try {
      // First, seed merchant categories
      const categories = [
        { id: "grocery", name: "Grocery Stores", description: "Supermarkets and grocery stores" },
        { id: "gas", name: "Gas Stations", description: "Fuel and gas stations" },
        { id: "dining", name: "Dining", description: "Restaurants and food delivery" },
        { id: "travel", name: "Travel", description: "Airlines, hotels, and rental cars" },
        { id: "drugstores", name: "Drugstores", description: "Pharmacies and drugstores" },
        { id: "department", name: "Department Stores", description: "Large retail stores" },
        { id: "warehouse", name: "Warehouse Clubs", description: "Wholesale clubs like Costco" },
        { id: "online", name: "Online Shopping", description: "E-commerce and online purchases" },
        { id: "streaming", name: "Streaming Services", description: "Video and music streaming" },
        { id: "transit", name: "Transit", description: "Public transportation and rideshare" }
      ];

      for (const category of categories) {
        await db.insert(merchantCategories).values(category).onConflictDoNothing();
      }

      // Seed credit cards - 34+ comprehensive collection
      const cards = [
        // Chase Cards (5)
        {
          id: "chase-sapphire-reserve",
          name: "Chase Sapphire Reserve",
          issuer: "Chase",
          annualFee: 550,
          baseReward: "1.0",
          minCreditScore: 720,
          welcomeBonus: "60,000 points after $4,000 spend in 3 months",
          description: "Premium travel rewards card with 3x on travel and dining"
        },
        {
          id: "chase-sapphire-preferred",
          name: "Chase Sapphire Preferred Card",
          issuer: "Chase",
          annualFee: 95,
          baseReward: "1.0",
          minCreditScore: 690,
          welcomeBonus: "60,000 points after $4,000 spend in 3 months",
          description: "Popular travel card with 2x on travel and dining"
        },
        {
          id: "chase-freedom-unlimited",
          name: "Chase Freedom Unlimited",
          issuer: "Chase",
          annualFee: 0,
          baseReward: "1.5",
          minCreditScore: 630,
          welcomeBonus: "$200 cash back after $500 spend in 3 months",
          description: "Flat 1.5% cash back on all purchases"
        },
        {
          id: "chase-freedom-flex",
          name: "Chase Freedom Flex",
          issuer: "Chase",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 630,
          welcomeBonus: "$200 cash back after $500 spend in 3 months",
          description: "Rotating 5x categories plus 3x on dining and drugstores"
        },
        {
          id: "chase-ink-business-preferred",
          name: "Chase Ink Business Preferred Credit Card",
          issuer: "Chase",
          annualFee: 95,
          baseReward: "1.0",
          minCreditScore: 680,
          welcomeBonus: "100,000 points after $15,000 spend in 3 months",
          description: "Business card with 3x on select business categories"
        },
        
        // American Express Cards (5)
        {
          id: "amex-platinum",
          name: "The Platinum Card® from American Express",
          issuer: "American Express",
          annualFee: 695,
          baseReward: "1.0",
          minCreditScore: 720,
          welcomeBonus: "80,000 points after $6,000 spend in 6 months",
          description: "Luxury travel card with extensive benefits and airport lounge access"
        },
        {
          id: "amex-gold",
          name: "American Express® Gold Card",
          issuer: "American Express",
          annualFee: 250,
          baseReward: "1.0",
          minCreditScore: 700,
          welcomeBonus: "60,000 points after $4,000 spend in 6 months",
          description: "Dining and grocery rewards card with 4x on restaurants"
        },
        {
          id: "amex-everyday-preferred",
          name: "Blue Cash Preferred® Card from American Express",
          issuer: "American Express",
          annualFee: 95,
          baseReward: "1.0",
          minCreditScore: 670,
          welcomeBonus: "$300 after $3,000 spend in 6 months",
          description: "6% cash back at US supermarkets up to $6,000 per year"
        },
        {
          id: "amex-blue-cash-everyday",
          name: "Blue Cash Everyday® Card from American Express",
          issuer: "American Express",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 630,
          welcomeBonus: "$200 after $2,000 spend in 6 months",
          description: "3% cash back at US supermarkets up to $6,000 per year"
        },
        {
          id: "amex-business-platinum",
          name: "The Business Platinum Card® from American Express",
          issuer: "American Express",
          annualFee: 695,
          baseReward: "1.0",
          minCreditScore: 720,
          welcomeBonus: "120,000 points after $15,000 spend in 3 months",
          description: "Premium business card with travel benefits and rewards"
        },

        // Capital One Cards (5)
        {
          id: "capital-one-venture-x",
          name: "Capital One Venture X Rewards Credit Card",
          issuer: "Capital One",
          annualFee: 395,
          baseReward: "baseReward: 2.0",
          minCreditScore: 720,
          welcomeBonus: "75,000 miles after $4,000 spend in 3 months",
          description: "Premium travel card with 2x miles on all purchases"
        },
        {
          id: "capital-one-venture",
          name: "Capital One Venture Rewards Credit Card",
          issuer: "Capital One",
          annualFee: 95,
          baseReward: "baseReward: 2.0",
          minCreditScore: 660,
          welcomeBonus: "60,000 miles after $3,000 spend in 3 months",
          description: "Travel rewards card with 2x miles on all purchases"
        },
        {
          id: "capital-one-savor",
          name: "Capital One Savor Cash Rewards Credit Card",
          issuer: "Capital One",
          annualFee: 95,
          baseReward: "1.0",
          minCreditScore: 660,
          welcomeBonus: "$300 after $3,000 spend in 3 months",
          description: "4% cash back on dining and entertainment"
        },
        {
          id: "capital-one-savorone",
          name: "Capital One SavorOne Cash Rewards Credit Card",
          issuer: "Capital One",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 630,
          welcomeBonus: "$200 after $500 spend in 3 months",
          description: "3% cash back on dining, entertainment, and streaming"
        },
        {
          id: "capital-one-quicksilver",
          name: "Capital One Quicksilver Cash Rewards Credit Card",
          issuer: "Capital One",
          annualFee: 0,
          baseReward: "1.5",
          minCreditScore: 630,
          welcomeBonus: "$200 after $500 spend in 3 months",
          description: "Flat 1.5% cash back on all purchases"
        },

        // Citi Cards (4)
        {
          id: "citi-double-cash",
          name: "Citi Double Cash Card",
          issuer: "Citi",
          annualFee: 0,
          baseReward: "baseReward: 2.0",
          minCreditScore: 650,
          welcomeBonus: "$200 cash back after $1,500 spend in 6 months",
          description: "Simple cash back card with 2% on all purchases"
        },
        {
          id: "citi-premier",
          name: "Citi Premier® Card",
          issuer: "Citi",
          annualFee: 95,
          baseReward: "1.0",
          minCreditScore: 690,
          welcomeBonus: "80,000 points after $4,000 spend in 3 months",
          description: "Travel and dining rewards with 3x points on multiple categories"
        },
        {
          id: "citi-custom-cash",
          name: "Citi Custom Cash℠ Card",
          issuer: "Citi",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 650,
          welcomeBonus: "$200 cash back after $1,500 spend in 6 months",
          description: "5% cash back on your top eligible spend category each month"
        },
        {
          id: "citi-simplicity",
          name: "Citi Simplicity® Card",
          issuer: "Citi",
          annualFee: 0,
          baseReward: "baseReward: 0.0",
          minCreditScore: 580,
          welcomeBonus: "0% intro APR for 21 months",
          description: "No late fees, no penalty rate, no annual fee"
        },

        // Discover Cards (3)
        {
          id: "discover-it-cash",
          name: "Discover it® Cash Back",
          issuer: "Discover",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 600,
          welcomeBonus: "Discover matches all cash back earned in your first year",
          description: "Rotating 5x categories with first-year cash back match"
        },
        {
          id: "discover-it-miles",
          name: "Discover it® Miles",
          issuer: "Discover",
          annualFee: 0,
          baseReward: "1.5",
          minCreditScore: 600,
          welcomeBonus: "Discover matches all miles earned in your first year",
          description: "1.5x miles on all purchases with first-year miles match"
        },
        {
          id: "discover-it-chrome",
          name: "Discover it® chrome",
          issuer: "Discover",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 600,
          welcomeBonus: "Discover matches all cash back earned in your first year",
          description: "2% cash back at gas stations and restaurants"
        },

        // Bank of America Cards (3)
        {
          id: "boa-travel-rewards",
          name: "Bank of America® Travel Rewards Credit Card",
          issuer: "Bank of America",
          annualFee: 0,
          baseReward: "1.5",
          minCreditScore: 650,
          welcomeBonus: "25,000 points after $1,000 spend in 90 days",
          description: "1.5x points on all purchases with no foreign transaction fees"
        },
        {
          id: "boa-cash-rewards",
          name: "Bank of America® Cash Rewards Credit Card",
          issuer: "Bank of America",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 600,
          welcomeBonus: "$200 after $1,000 spend in 90 days",
          description: "3% cash back in your choice category, 2% at grocery stores and wholesale clubs"
        },
        {
          id: "boa-premium-rewards",
          name: "Bank of America® Premium Rewards® Credit Card",
          issuer: "Bank of America",
          annualFee: 95,
          baseReward: "1.5",
          minCreditScore: 720,
          welcomeBonus: "60,000 points after $4,000 spend in 90 days",
          description: "2x points on travel and dining with premium benefits"
        },

        // Wells Fargo Cards (3)
        {
          id: "wells-fargo-active-cash",
          name: "Wells Fargo Active Cash® Card",
          issuer: "Wells Fargo",
          annualFee: 0,
          baseReward: "baseReward: 2.0",
          minCreditScore: 600,
          welcomeBonus: "$200 cash rewards after $1,000 spend in 3 months",
          description: "Flat 2% cash rewards on all purchases"
        },
        {
          id: "wells-fargo-autograph",
          name: "Wells Fargo Autograph℠ Card",
          issuer: "Wells Fargo",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 650,
          welcomeBonus: "20,000 points after $1,000 spend in 3 months",
          description: "3x points on restaurants, travel, gas, transit, and streaming"
        },
        {
          id: "wells-fargo-propel",
          name: "Wells Fargo Propel American Express® Card",
          issuer: "Wells Fargo",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 630,
          welcomeBonus: "20,000 points after $1,000 spend in 3 months",
          description: "3x points on dining, ordering, gas, transit, and streaming"
        },

        // U.S. Bank Cards (3)
        {
          id: "us-bank-altitude-go",
          name: "U.S. Bank Altitude® Go Visa Signature® Card",
          issuer: "U.S. Bank",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 650,
          welcomeBonus: "20,000 points after $1,000 spend in 90 days",
          description: "4x points on dining, 2x on grocery stores, streaming services, and gas"
        },
        {
          id: "us-bank-cash-plus",
          name: "U.S. Bank Cash+® Visa Signature® Card",
          issuer: "U.S. Bank",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 650,
          welcomeBonus: "$200 after $1,000 spend in 120 days",
          description: "5% cash back on two categories you choose each quarter"
        },
        {
          id: "us-bank-altitude-reserve",
          name: "U.S. Bank Altitude® Reserve Visa Infinite® Card",
          issuer: "U.S. Bank",
          annualFee: 400,
          baseReward: "1.5",
          minCreditScore: 750,
          welcomeBonus: "50,000 points after $4,500 spend in 90 days",
          description: "Premium travel card with 3x points on mobile wallet purchases"
        },

        // Additional Popular Cards (5)
        {
          id: "barclays-arrival-plus",
          name: "Barclaycard Arrival® Plus World Elite Mastercard®",
          issuer: "Barclays",
          annualFee: 89,
          baseReward: "baseReward: 2.0",
          minCreditScore: 700,
          welcomeBonus: "70,000 miles after $5,000 spend in 90 days",
          description: "2x miles on all purchases with travel redemption flexibility"
        },
        {
          id: "synchrony-amazon-prime",
          name: "Amazon Prime Rewards Visa Signature Card",
          issuer: "Synchrony Bank",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 650,
          welcomeBonus: "$100 Amazon Gift Card upon approval",
          description: "5% back at Amazon and Whole Foods for Prime members"
        },
        {
          id: "navy-federal-more-rewards",
          name: "Navy Federal Credit Union More Rewards American Express® Card",
          issuer: "Navy Federal",
          annualFee: 0,
          baseReward: "1.0",
          minCreditScore: 650,
          welcomeBonus: "20,000 points after $3,000 spend in 90 days",
          description: "3x points on supermarkets, gas, restaurants, and transit"
        }
      ];

      await db.insert(creditCards).values(cards).onConflictDoNothing();

      // Seed card category rewards - expanded to cover all major categories
      const rewards = [
        // Chase Sapphire Reserve - Premium Travel Card
        { cardId: "chase-sapphire-reserve", categoryId: "travel", rewardRate: "3.0", isRotating: false },
        { cardId: "chase-sapphire-reserve", categoryId: "dining", rewardRate: "3.0", isRotating: false },
        
        // Chase Freedom Flex - Rotating Categories + Fixed
        { cardId: "chase-freedom-flex", categoryId: "dining", rewardRate: "3.0", isRotating: false },
        { cardId: "chase-freedom-flex", categoryId: "drugstores", rewardRate: "3.0", isRotating: false },
        { cardId: "chase-freedom-flex", categoryId: "grocery", rewardRate: "5.0", isRotating: true, rotationPeriod: "Q1 2025" },
        
        // Citi Double Cash - Flat Rate Everything
        { cardId: "citi-double-cash", categoryId: "grocery", rewardRate: "2.0", isRotating: false },
        { cardId: "citi-double-cash", categoryId: "gas", rewardRate: "2.0", isRotating: false },
        { cardId: "citi-double-cash", categoryId: "dining", rewardRate: "2.0", isRotating: false },
        { cardId: "citi-double-cash", categoryId: "travel", rewardRate: "2.0", isRotating: false },
        { cardId: "citi-double-cash", categoryId: "department", rewardRate: "2.0", isRotating: false },
        { cardId: "citi-double-cash", categoryId: "online", rewardRate: "2.0", isRotating: false },
        
        // Discover it Cash Back - Rotating Categories
        { cardId: "discover-it-cash", categoryId: "grocery", rewardRate: "5.0", isRotating: true, rotationPeriod: "Q1 2025" },
        { cardId: "discover-it-cash", categoryId: "gas", rewardRate: "5.0", isRotating: true, rotationPeriod: "Q2 2025" },
        { cardId: "discover-it-cash", categoryId: "online", rewardRate: "5.0", isRotating: true, rotationPeriod: "Q4 2024" },
        
        // American Express Gold - Dining & Grocery
        { cardId: "amex-gold", categoryId: "dining", rewardRate: "4.0", isRotating: false },
        { cardId: "amex-gold", categoryId: "grocery", rewardRate: "4.0", isRotating: false },
        
        // Capital One Venture X - Travel
        { cardId: "capital-one-venture-x", categoryId: "travel", rewardRate: "2.0", isRotating: false },
        { cardId: "capital-one-venture-x", categoryId: "dining", rewardRate: "2.0", isRotating: false },
        
        // Wells Fargo Active Cash - Flat Rate
        { cardId: "wells-fargo-active-cash", categoryId: "grocery", rewardRate: "2.0", isRotating: false },
        { cardId: "wells-fargo-active-cash", categoryId: "gas", rewardRate: "2.0", isRotating: false },
        { cardId: "wells-fargo-active-cash", categoryId: "dining", rewardRate: "2.0", isRotating: false },
        { cardId: "wells-fargo-active-cash", categoryId: "travel", rewardRate: "2.0", isRotating: false },
        
        // U.S. Bank Altitude Go - Dining Focus
        { cardId: "us-bank-altitude-go", categoryId: "dining", rewardRate: "4.0", isRotating: false },
        { cardId: "us-bank-altitude-go", categoryId: "grocery", rewardRate: "2.0", isRotating: false },
        { cardId: "us-bank-altitude-go", categoryId: "gas", rewardRate: "2.0", isRotating: false },
        
        // Department Store specific rewards (Target, Walmart, etc.)
        { cardId: "citi-double-cash", categoryId: "department", rewardRate: "2.0", isRotating: false },
        { cardId: "wells-fargo-active-cash", categoryId: "department", rewardRate: "2.0", isRotating: false },
        { cardId: "chase-freedom-unlimited", categoryId: "department", rewardRate: "1.5", isRotating: false },
        { cardId: "chase-freedom-flex", categoryId: "department", rewardRate: "5.0", isRotating: true, rotationPeriod: "Q3 2025" },
        
        // Warehouse club rewards (Costco, Sam's Club)
        { cardId: "citi-double-cash", categoryId: "warehouse", rewardRate: "2.0", isRotating: false },
        { cardId: "wells-fargo-active-cash", categoryId: "warehouse", rewardRate: "2.0", isRotating: false },
        { cardId: "chase-freedom-unlimited", categoryId: "warehouse", rewardRate: "1.5", isRotating: false },
      ];

      // Clear existing rewards to avoid conflicts and re-seed with expanded data
      await db.delete(cardCategoryRewards);
      await db.insert(cardCategoryRewards).values(rewards);

      // Seed some popular stores
      const storeData = [
        { id: "target", name: "Target", categoryId: "department", address: "National Chain", city: "Multiple Locations", state: "US" },
        { id: "walmart", name: "Walmart", categoryId: "department", address: "National Chain", city: "Multiple Locations", state: "US" },
        { id: "costco", name: "Costco", categoryId: "warehouse", address: "National Chain", city: "Multiple Locations", state: "US" },
        { id: "whole-foods", name: "Whole Foods Market", categoryId: "grocery", address: "National Chain", city: "Multiple Locations", state: "US" },
        { id: "starbucks", name: "Starbucks", categoryId: "dining", address: "National Chain", city: "Multiple Locations", state: "US" }
      ];

      for (const store of storeData) {
        await db.insert(stores).values(store).onConflictDoNothing();
      }

      console.log("Initial data seeded successfully!");
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }
}

export const storage = new DatabaseStorage();