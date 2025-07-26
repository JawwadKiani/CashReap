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
  type StoreWithCategory,
  type CardRecommendation
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
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
  getUserSearchHistory(userSession: string): Promise<UserSearchHistory[]>;
  addToSearchHistory(history: InsertUserSearchHistory): Promise<UserSearchHistory>;

  // User Saved Cards
  getUserSavedCards(userSession: string): Promise<UserSavedCard[]>;
  saveCard(savedCard: InsertUserSavedCard): Promise<UserSavedCard>;
  unsaveCard(userSession: string, cardId: string): Promise<boolean>;

  // Recommendations
  getCardRecommendationsForStore(storeId: string): Promise<CardRecommendation[]>;
}

export class MemStorage implements IStorage {
  private creditCards: Map<string, CreditCard> = new Map();
  private merchantCategories: Map<string, MerchantCategory> = new Map();
  private cardCategoryRewards: Map<string, CardCategoryReward> = new Map();
  private stores: Map<string, Store> = new Map();
  private userSearchHistory: Map<string, UserSearchHistory> = new Map();
  private userSavedCards: Map<string, UserSavedCard> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed merchant categories
    const categories = [
      { name: "Department Stores", description: "General merchandise stores", iconClass: "fas fa-store" },
      { name: "Gas Stations", description: "Fuel and convenience stores", iconClass: "fas fa-gas-pump" },
      { name: "Restaurants", description: "Dining and food services", iconClass: "fas fa-utensils" },
      { name: "Coffee Shops", description: "Coffee and cafe establishments", iconClass: "fas fa-coffee" },
      { name: "Grocery Stores", description: "Food and household items", iconClass: "fas fa-shopping-cart" },
      { name: "Online Shopping", description: "E-commerce platforms", iconClass: "fas fa-laptop" },
      { name: "Travel", description: "Airlines, hotels, car rentals", iconClass: "fas fa-plane" },
      { name: "Drug Stores", description: "Pharmacies and health stores", iconClass: "fas fa-pills" },
    ];

    categories.forEach(cat => {
      const id = randomUUID();
      this.merchantCategories.set(id, { id, ...cat });
    });

    // Seed credit cards
    const cards = [
      {
        name: "Chase Freedom Flex",
        issuer: "Chase",
        annualFee: 0,
        minCreditScore: 670,
        baseReward: "1.00",
        welcomeBonus: "$200 bonus after spending $500 in first 3 months",
        description: "Rotating quarterly 5% categories, 5% on travel through Chase, 3% on dining and drugstores, 1% on everything else"
      },
      {
        name: "Blue Cash Preferred",
        issuer: "American Express",
        annualFee: 95,
        minCreditScore: 700,
        baseReward: "1.00",
        welcomeBonus: "$350 statement credit after spending $3,000 in first 6 months",
        description: "6% cash back on U.S. supermarkets, 6% on select U.S. streaming services, 3% on transit and gas stations"
      },
      {
        name: "Capital One Savor Cash Rewards",
        issuer: "Capital One",
        annualFee: 95,
        minCreditScore: 670,
        baseReward: "1.00",
        welcomeBonus: "$300 bonus after spending $3,000 in first 3 months",
        description: "4% on dining and entertainment, 2% on grocery stores, 1% on all other purchases"
      },
      {
        name: "Discover it Cash Back",
        issuer: "Discover",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.00",
        welcomeBonus: "Cashback Match - Discover matches all cash back earned in first year",
        description: "5% rotating quarterly categories, 1% on all other purchases"
      },
      {
        name: "Citi Double Cash",
        issuer: "Citi",
        annualFee: 0,
        minCreditScore: 700,
        baseReward: "2.00",
        welcomeBonus: "$200 cash back bonus after spending $1,500 in first 6 months",
        description: "2% on all purchases (1% when you buy, 1% when you pay)"
      }
    ];

    cards.forEach(card => {
      const id = randomUUID();
      this.creditCards.set(id, { id, ...card, isActive: true });
    });

    // Seed card category rewards
    const categoryArray = Array.from(this.merchantCategories.values());
    const cardArray = Array.from(this.creditCards.values());

    // Chase Freedom Flex - Rotating quarterly categories
    const chaseCard = cardArray.find(c => c.name === "Chase Freedom Flex")!;
    const deptStoreCategory = categoryArray.find(c => c.name === "Department Stores")!;
    const gasCategory = categoryArray.find(c => c.name === "Gas Stations")!;

    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: chaseCard.id,
      categoryId: deptStoreCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q4"
    });

    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: chaseCard.id,
      categoryId: gasCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q1"
    });

    // Blue Cash Preferred
    const amexCard = cardArray.find(c => c.name === "Blue Cash Preferred")!;
    const groceryCategory = categoryArray.find(c => c.name === "Grocery Stores")!;

    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: amexCard.id,
      categoryId: groceryCategory.id,
      rewardRate: "6.00",
      isRotating: false
    });

    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: amexCard.id,
      categoryId: gasCategory.id,
      rewardRate: "3.00",
      isRotating: false
    });

    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: amexCard.id,
      categoryId: deptStoreCategory.id,
      rewardRate: "3.00",
      isRotating: false
    });

    // Capital One Savor
    const capitalOneCard = cardArray.find(c => c.name === "Capital One Savor Cash Rewards")!;
    const restaurantCategory = categoryArray.find(c => c.name === "Restaurants")!;

    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: capitalOneCard.id,
      categoryId: restaurantCategory.id,
      rewardRate: "4.00",
      isRotating: false
    });

    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: capitalOneCard.id,
      categoryId: groceryCategory.id,
      rewardRate: "2.00",
      isRotating: false
    });

    // Seed stores with multiple locations across different cities
    const stores = [
      // Target locations
      {
        name: "Target",
        categoryId: deptStoreCategory.id,
        address: "1234 Pine St, Seattle, WA",
        latitude: "47.6097",
        longitude: "-122.3331",
        isChain: true
      },
      {
        name: "Target",
        categoryId: deptStoreCategory.id,
        address: "5678 Broadway, New York, NY",
        latitude: "40.7589",
        longitude: "-73.9851",
        isChain: true
      },
      {
        name: "Target",
        categoryId: deptStoreCategory.id,
        address: "9012 Sunset Blvd, Los Angeles, CA",
        latitude: "34.0928",
        longitude: "-118.3287",
        isChain: true
      },
      {
        name: "Target",
        categoryId: deptStoreCategory.id,
        address: "3456 Michigan Ave, Chicago, IL",
        latitude: "41.8755",
        longitude: "-87.6244",
        isChain: true
      },
      
      // Starbucks locations
      {
        name: "Starbucks",
        categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id,
        address: "456 Broadway, Seattle, WA",
        latitude: "47.6205",
        longitude: "-122.3212",
        isChain: true
      },
      {
        name: "Starbucks",
        categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id,
        address: "789 5th Ave, New York, NY",
        latitude: "40.7614",
        longitude: "-73.9776",
        isChain: true
      },
      {
        name: "Starbucks",
        categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id,
        address: "1011 Hollywood Blvd, Los Angeles, CA",
        latitude: "34.1016",
        longitude: "-118.3402",
        isChain: true
      },
      {
        name: "Starbucks",
        categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id,
        address: "1213 State St, Chicago, IL",
        latitude: "41.8781",
        longitude: "-87.6298",
        isChain: true
      },
      
      // Gas stations
      {
        name: "Shell Gas Station",
        categoryId: gasCategory.id,
        address: "789 1st Ave, Seattle, WA",
        latitude: "47.6058",
        longitude: "-122.3346",
        isChain: true
      },
      {
        name: "Shell Gas Station",
        categoryId: gasCategory.id,
        address: "1415 Park Ave, New York, NY",
        latitude: "40.7505",
        longitude: "-73.9934",
        isChain: true
      },
      {
        name: "Chevron Gas Station",
        categoryId: gasCategory.id,
        address: "1617 Wilshire Blvd, Los Angeles, CA",
        latitude: "34.0522",
        longitude: "-118.2437",
        isChain: true
      },
      {
        name: "BP Gas Station",
        categoryId: gasCategory.id,
        address: "1819 Lake Shore Dr, Chicago, IL",
        latitude: "41.8781",
        longitude: "-87.6164",
        isChain: true
      },
      
      // Grocery stores
      {
        name: "Whole Foods Market",
        categoryId: groceryCategory.id,
        address: "2210 Westlake Ave, Seattle, WA",
        latitude: "47.6417",
        longitude: "-122.3370",
        isChain: true
      },
      {
        name: "Whole Foods Market",
        categoryId: groceryCategory.id,
        address: "2021 Union Sq, New York, NY",
        latitude: "40.7357",
        longitude: "-73.9910",
        isChain: true
      },
      {
        name: "Trader Joe's",
        categoryId: groceryCategory.id,
        address: "2223 Melrose Ave, Los Angeles, CA",
        latitude: "34.0837",
        longitude: "-118.3059",
        isChain: true
      },
      {
        name: "Jewel-Osco",
        categoryId: groceryCategory.id,
        address: "2425 North Ave, Chicago, IL",
        latitude: "41.9103",
        longitude: "-87.6298",
        isChain: true
      },
      
      // Restaurants
      {
        name: "McDonald's",
        categoryId: restaurantCategory.id,
        address: "2627 Pike St, Seattle, WA",
        latitude: "47.6101",
        longitude: "-122.3421",
        isChain: true
      },
      {
        name: "McDonald's",
        categoryId: restaurantCategory.id,
        address: "2829 Times Square, New York, NY",
        latitude: "40.7580",
        longitude: "-73.9855",
        isChain: true
      },
      {
        name: "In-N-Out Burger",
        categoryId: restaurantCategory.id,
        address: "3031 Venice Blvd, Los Angeles, CA",
        latitude: "34.0259",
        longitude: "-118.4398",
        isChain: true
      },
      {
        name: "Portillo's",
        categoryId: restaurantCategory.id,
        address: "3233 River Rd, Chicago, IL",
        latitude: "41.9036",
        longitude: "-87.6674",
        isChain: true
      }
    ];

    stores.forEach(store => {
      const id = randomUUID();
      this.stores.set(id, { id, ...store });
    });
  }

  // Credit Cards
  async getCreditCards(): Promise<CreditCard[]> {
    return Array.from(this.creditCards.values()).filter(card => card.isActive);
  }

  async getCreditCard(id: string): Promise<CreditCard | undefined> {
    return this.creditCards.get(id);
  }

  async createCreditCard(card: InsertCreditCard): Promise<CreditCard> {
    const id = randomUUID();
    const newCard: CreditCard = { ...card, id, isActive: true };
    this.creditCards.set(id, newCard);
    return newCard;
  }

  // Merchant Categories
  async getMerchantCategories(): Promise<MerchantCategory[]> {
    return Array.from(this.merchantCategories.values());
  }

  async getMerchantCategory(id: string): Promise<MerchantCategory | undefined> {
    return this.merchantCategories.get(id);
  }

  async createMerchantCategory(category: InsertMerchantCategory): Promise<MerchantCategory> {
    const id = randomUUID();
    const newCategory: MerchantCategory = { ...category, id };
    this.merchantCategories.set(id, newCategory);
    return newCategory;
  }

  // Card Category Rewards
  async getCardCategoryRewards(): Promise<CardCategoryReward[]> {
    return Array.from(this.cardCategoryRewards.values());
  }

  async getRewardsForCard(cardId: string): Promise<CardCategoryReward[]> {
    return Array.from(this.cardCategoryRewards.values()).filter(reward => reward.cardId === cardId);
  }

  async getRewardsForCategory(categoryId: string): Promise<CardCategoryReward[]> {
    return Array.from(this.cardCategoryRewards.values()).filter(reward => reward.categoryId === categoryId);
  }

  async createCardCategoryReward(reward: InsertCardCategoryReward): Promise<CardCategoryReward> {
    const id = randomUUID();
    const newReward: CardCategoryReward = { ...reward, id };
    this.cardCategoryRewards.set(id, newReward);
    return newReward;
  }

  // Stores
  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }

  async getStore(id: string): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async getStoreWithCategory(id: string): Promise<StoreWithCategory | undefined> {
    const store = this.stores.get(id);
    if (!store) return undefined;
    
    const category = this.merchantCategories.get(store.categoryId);
    if (!category) return undefined;

    return { ...store, category };
  }

  async searchStores(query: string): Promise<StoreWithCategory[]> {
    const stores = Array.from(this.stores.values())
      .filter(store => store.name.toLowerCase().includes(query.toLowerCase()));
    
    const storesWithCategories: StoreWithCategory[] = [];
    for (const store of stores) {
      const category = this.merchantCategories.get(store.categoryId);
      if (category) {
        storesWithCategories.push({ ...store, category });
      }
    }
    
    return storesWithCategories;
  }

  async getNearbyStores(latitude: number, longitude: number, radiusKm: number = 5): Promise<StoreWithCategory[]> {
    // Simple distance calculation for demo purposes
    const stores = Array.from(this.stores.values()).filter(store => {
      if (!store.latitude || !store.longitude) return false;
      
      const storeLat = parseFloat(store.latitude);
      const storeLng = parseFloat(store.longitude);
      
      // Haversine formula for distance calculation
      const R = 6371; // Earth's radius in kilometers
      const dLat = (storeLat - latitude) * Math.PI / 180;
      const dLng = (storeLng - longitude) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(latitude * Math.PI / 180) * Math.cos(storeLat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return distance <= radiusKm;
    });

    const storesWithCategories: StoreWithCategory[] = [];
    for (const store of stores) {
      const category = this.merchantCategories.get(store.categoryId);
      if (category) {
        storesWithCategories.push({ ...store, category });
      }
    }
    
    return storesWithCategories;
  }

  async createStore(store: InsertStore): Promise<Store> {
    const id = randomUUID();
    const newStore: Store = { ...store, id };
    this.stores.set(id, newStore);
    return newStore;
  }

  // User Search History
  async getUserSearchHistory(userSession: string): Promise<UserSearchHistory[]> {
    return Array.from(this.userSearchHistory.values())
      .filter(history => history.userSession === userSession)
      .sort((a, b) => new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime());
  }

  async addToSearchHistory(history: InsertUserSearchHistory): Promise<UserSearchHistory> {
    const id = randomUUID();
    const newHistory: UserSearchHistory = { ...history, id, searchedAt: new Date() };
    this.userSearchHistory.set(id, newHistory);
    return newHistory;
  }

  // User Saved Cards
  async getUserSavedCards(userSession: string): Promise<UserSavedCard[]> {
    return Array.from(this.userSavedCards.values())
      .filter(saved => saved.userSession === userSession);
  }

  async saveCard(savedCard: InsertUserSavedCard): Promise<UserSavedCard> {
    const id = randomUUID();
    const newSavedCard: UserSavedCard = { ...savedCard, id, savedAt: new Date() };
    this.userSavedCards.set(id, newSavedCard);
    return newSavedCard;
  }

  async unsaveCard(userSession: string, cardId: string): Promise<boolean> {
    const saved = Array.from(this.userSavedCards.entries())
      .find(([_, card]) => card.userSession === userSession && card.cardId === cardId);
    
    if (saved) {
      this.userSavedCards.delete(saved[0]);
      return true;
    }
    return false;
  }

  // Recommendations
  async getCardRecommendationsForStore(storeId: string): Promise<CardRecommendation[]> {
    const store = await this.getStore(storeId);
    if (!store) return [];

    const categoryRewards = await this.getRewardsForCategory(store.categoryId);
    const recommendations: CardRecommendation[] = [];

    for (const reward of categoryRewards) {
      const card = await this.getCreditCard(reward.cardId);
      if (card) {
        const category = await this.getMerchantCategory(store.categoryId);
        const categoryMatch = reward.isRotating 
          ? `${reward.rotationPeriod} ${category?.name || 'Category'}`
          : category?.name || 'Category';

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
}

export const storage = new MemStorage();
