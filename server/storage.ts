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
  users,
  userSearchHistory,
  userSavedCards,
  creditCards,
  merchantCategories,
  cardCategoryRewards,
  stores
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
  getCardRecommendationsForStore(storeId: string): Promise<CardRecommendation[]>;
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
      .where(eq(userSavedCards.userId, userId));
    return result.rowCount > 0;
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
  async getCardRecommendationsForStore(storeId: string): Promise<CardRecommendation[]> {
    const store = await this.getStore(storeId);
    if (!store) return [];

    const currentQuarter = this.getCurrentQuarter();
    const categoryRewards = await this.getRewardsForCategory(store.categoryId);
    const recommendations: CardRecommendation[] = [];

    for (const reward of categoryRewards) {
      // Skip rotating categories that are not currently active
      if (reward.isRotating && reward.rotationPeriod !== currentQuarter) {
        continue;
      }

      const card = await this.getCreditCard(reward.cardId);
      if (card) {
        const category = await this.getMerchantCategory(store.categoryId);
        let categoryMatch = category?.name || 'Category';
        
        if (reward.isRotating) {
          categoryMatch = `${reward.rotationPeriod} ${categoryMatch} (Currently Active)`;
        }

        recommendations.push({
          ...card,
          rewardRate: reward.rewardRate,
          categoryMatch,
          isRotating: reward.isRotating,
          rotationPeriod: reward.rotationPeriod || undefined
        });
      }
    }

    // Add cards with base rewards if no specific category rewards
    if (recommendations.length === 0) {
      const allCards = await this.getCreditCards();
      for (const card of allCards) {
        recommendations.push({
          ...card,
          rewardRate: card.baseReward,
          categoryMatch: "General Purchases",
          isRotating: false
        });
      }
    }

    // Sort by reward rate (highest first)
    return recommendations.sort((a, b) => parseFloat(b.rewardRate) - parseFloat(a.rewardRate));
  }

  // Seed initial data
  private async seedData() {
    // Check if data already exists
    const existingCards = await db.select().from(creditCards).limit(1);
    if (existingCards.length > 0) return; // Data already seeded

    console.log("Seeding initial data...");
    
    // This is a simplified version - in a real app you'd load this from a data file
    // For now, we'll just ensure the database is ready for the authentication system
  }
}

export const storage = new DatabaseStorage();