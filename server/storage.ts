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
      { name: "Pharmacies", description: "Pharmacies and drugstores", iconClass: "fas fa-pills" },
      { name: "Electronics", description: "Electronics and technology stores", iconClass: "fas fa-mobile-alt" },
      { name: "Home Improvement", description: "Hardware stores and home improvement centers", iconClass: "fas fa-tools" }
    ];

    categories.forEach(cat => {
      const id = randomUUID();
      this.merchantCategories.set(id, { id, ...cat });
    });

    // Seed credit cards - All major issuers
    const cards = [
      // CHASE CARDS
      {
        name: "Chase Sapphire Preferred",
        issuer: "Chase",
        annualFee: 95,
        minCreditScore: 720,
        baseReward: "1.00",
        welcomeBonus: "80,000 bonus points after spending $4,000 in first 3 months",
        description: "2x points on travel and dining, 1x on all other purchases. Points worth 25% more when redeemed through Chase Ultimate Rewards"
      },
      {
        name: "Chase Sapphire Reserve",
        issuer: "Chase",
        annualFee: 550,
        minCreditScore: 750,
        baseReward: "1.00",
        welcomeBonus: "60,000 bonus points after spending $4,000 in first 3 months",
        description: "3x points on travel and dining, 1x on all other purchases. $300 annual travel credit, Priority Pass lounge access"
      },
      {
        name: "Chase Freedom Flex",
        issuer: "Chase",
        annualFee: 0,
        minCreditScore: 670,
        baseReward: "1.00",
        welcomeBonus: "$200 bonus after spending $500 in first 3 months",
        description: "5% cash back on rotating quarterly categories (up to $1,500), 5% on travel through Chase, 3% on dining and drugstores"
      },
      {
        name: "Chase Freedom Unlimited",
        issuer: "Chase",
        annualFee: 0,
        minCreditScore: 670,
        baseReward: "1.50",
        welcomeBonus: "$200 bonus after spending $500 in first 3 months",
        description: "1.5% cash back on all purchases, 5% on travel through Chase, 3% on dining and drugstores"
      },
      {
        name: "Chase Ink Business Cash",
        issuer: "Chase",
        annualFee: 0,
        minCreditScore: 680,
        baseReward: "1.00",
        welcomeBonus: "$750 bonus cash back after spending $7,500 in first 3 months",
        description: "5% cash back on office supplies, internet/cable/phone, gas stations (up to $25K annually), 1% on all other purchases"
      },

      // AMERICAN EXPRESS CARDS
      {
        name: "Blue Cash Preferred",
        issuer: "American Express",
        annualFee: 95,
        minCreditScore: 700,
        baseReward: "1.00",
        welcomeBonus: "$350 statement credit after spending $3,000 in first 6 months",
        description: "6% cash back on U.S. supermarkets (up to $6K annually), 6% on select U.S. streaming, 3% on transit and gas"
      },
      {
        name: "Blue Cash Everyday",
        issuer: "American Express",
        annualFee: 0,
        minCreditScore: 670,
        baseReward: "1.00",
        welcomeBonus: "$200 statement credit after spending $2,000 in first 6 months",
        description: "3% cash back on U.S. supermarkets (up to $6K annually), 2% on gas stations, 1% on all other purchases"
      },
      {
        name: "Gold Card",
        issuer: "American Express",
        annualFee: 250,
        minCreditScore: 720,
        baseReward: "1.00",
        welcomeBonus: "90,000 Membership Rewards points after spending $4,000 in first 6 months",
        description: "4x points at restaurants and U.S. supermarkets (up to $25K), 3x points on flights, 1x on all other purchases"
      },
      {
        name: "Platinum Card",
        issuer: "American Express",
        annualFee: 695,
        minCreditScore: 750,
        baseReward: "1.00",
        welcomeBonus: "80,000 Membership Rewards points after spending $6,000 in first 6 months",
        description: "5x points on flights and prepaid hotels, 1x on all other purchases. Premium travel benefits and lounge access"
      },
      {
        name: "Cash Magnet",
        issuer: "American Express",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.50",
        welcomeBonus: "$200 statement credit after spending $2,000 in first 6 months",
        description: "1.5% cash back on all purchases with no rotating categories or caps"
      },

      // CAPITAL ONE CARDS
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
        name: "Capital One SavorOne Cash Rewards",
        issuer: "Capital One",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.00",
        welcomeBonus: "$200 bonus after spending $500 in first 3 months",
        description: "3% on dining, entertainment, and popular streaming, 2% on grocery stores, 1% on all other purchases"
      },
      {
        name: "Capital One Quicksilver Cash Rewards",
        issuer: "Capital One",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.50",
        welcomeBonus: "$200 bonus after spending $500 in first 3 months",
        description: "1.5% cash back on all purchases with no rotating categories"
      },
      {
        name: "Capital One Venture Rewards",
        issuer: "Capital One",
        annualFee: 95,
        minCreditScore: 700,
        baseReward: "2.00",
        welcomeBonus: "75,000 bonus miles after spending $4,000 in first 3 months",
        description: "2x miles on all purchases, miles can be redeemed for travel expenses"
      },
      {
        name: "Capital One VentureOne Rewards",
        issuer: "Capital One",
        annualFee: 0,
        minCreditScore: 670,
        baseReward: "1.25",
        welcomeBonus: "20,000 bonus miles after spending $500 in first 3 months",
        description: "1.25x miles on all purchases, no foreign transaction fees"
      },

      // CITI CARDS
      {
        name: "Citi Double Cash",
        issuer: "Citi",
        annualFee: 0,
        minCreditScore: 700,
        baseReward: "2.00",
        welcomeBonus: "$200 cash back bonus after spending $1,500 in first 6 months",
        description: "2% cash back on all purchases (1% when you buy, 1% when you pay)"
      },
      {
        name: "Citi Custom Cash",
        issuer: "Citi",
        annualFee: 0,
        minCreditScore: 670,
        baseReward: "1.00",
        welcomeBonus: "$200 cash back bonus after spending $750 in first 3 months",
        description: "5% cash back on your top eligible spend category each billing cycle (up to $500), 1% on all other purchases"
      },
      {
        name: "Citi Premier",
        issuer: "Citi",
        annualFee: 95,
        minCreditScore: 720,
        baseReward: "1.00",
        welcomeBonus: "80,000 bonus points after spending $4,000 in first 3 months",
        description: "3x points on travel, gas stations, supermarkets, and restaurants, 1x on all other purchases"
      },
      {
        name: "Citi Rewards+",
        issuer: "Citi",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.00",
        welcomeBonus: "15,000 bonus points after spending $1,000 in first 3 months",
        description: "2x points on supermarkets and gas stations (up to $6K annually), 1x on all other purchases. Points rounded up to nearest 10"
      },

      // DISCOVER CARDS
      {
        name: "Discover it Cash Back",
        issuer: "Discover",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.00",
        welcomeBonus: "Cashback Match - Discover matches all cash back earned in first year",
        description: "5% cash back on rotating quarterly categories (up to $1,500), 1% on all other purchases"
      },
      {
        name: "Discover it Chrome",
        issuer: "Discover",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.00",
        welcomeBonus: "Cashback Match - Discover matches all cash back earned in first year",
        description: "2% cash back at gas stations and restaurants (up to $1K quarterly), 1% on all other purchases"
      },
      {
        name: "Discover it Miles",
        issuer: "Discover",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.50",
        welcomeBonus: "Miles Match - Discover matches all miles earned in first year",
        description: "1.5x miles on all purchases with no rotating categories"
      },

      // BANK OF AMERICA CARDS
      {
        name: "Bank of America Customized Cash Rewards",
        issuer: "Bank of America",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.00",
        welcomeBonus: "$200 online cash rewards bonus after spending $1,000 in first 90 days",
        description: "3% cash back in choice category (gas, online shopping, dining, travel, drug stores, or home improvement), 2% on grocery stores and wholesale clubs, 1% on all other purchases"
      },
      {
        name: "Bank of America Premium Rewards",
        issuer: "Bank of America",
        annualFee: 95,
        minCreditScore: 720,
        baseReward: "1.50",
        welcomeBonus: "60,000 online bonus points after spending $4,000 in first 90 days",
        description: "2x points on travel and dining, 1.5x points on all other purchases. $100 airline incidental credit"
      },
      {
        name: "Bank of America Unlimited Cash Rewards",
        issuer: "Bank of America",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.50",
        welcomeBonus: "$200 online cash rewards bonus after spending $1,000 in first 90 days",
        description: "1.5% cash back on all purchases with no category restrictions"
      },

      // WELLS FARGO CARDS
      {
        name: "Wells Fargo Active Cash",
        issuer: "Wells Fargo",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "2.00",
        welcomeBonus: "$200 cash rewards bonus after spending $1,000 in first 3 months",
        description: "2% cash rewards on purchases"
      },
      {
        name: "Wells Fargo Autograph",
        issuer: "Wells Fargo",
        annualFee: 0,
        minCreditScore: 670,
        baseReward: "1.00",
        welcomeBonus: "20,000 bonus points after spending $1,000 in first 3 months",
        description: "3x points on restaurants, travel, gas stations, transit, popular streaming services, and phone plans, 1x on all other purchases"
      },
      {
        name: "Wells Fargo Reflect",
        issuer: "Wells Fargo",
        annualFee: 0,
        minCreditScore: 670,
        baseReward: "1.00",
        welcomeBonus: "0% intro APR for 21 months on purchases and qualifying balance transfers",
        description: "1% cash rewards on purchases. Extended intro APR period"
      },

      // US BANK CARDS
      {
        name: "U.S. Bank Cash+",
        issuer: "U.S. Bank",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.00",
        welcomeBonus: "$200 bonus after spending $1,000 in first 120 days",
        description: "5% cash back on two categories you choose (up to $2K quarterly), 2% on one everyday category, 1% on all other purchases"
      },
      {
        name: "U.S. Bank Altitude Go",
        issuer: "U.S. Bank",
        annualFee: 0,
        minCreditScore: 670,
        baseReward: "1.00",
        welcomeBonus: "20,000 bonus points after spending $1,000 in first 90 days",
        description: "4x points on dining, 2x on grocery stores, streaming services, and gas stations, 1x on all other purchases"
      },
      {
        name: "U.S. Bank Altitude Reserve",
        issuer: "U.S. Bank",
        annualFee: 400,
        minCreditScore: 750,
        baseReward: "1.50",
        welcomeBonus: "50,000 bonus points after spending $4,500 in first 90 days",
        description: "3x points on mobile wallet purchases, 1.5x on all other purchases. $325 annual travel credit"
      },

      // SYNCHRONY BANK CARDS
      {
        name: "PayPal Cashback Mastercard",
        issuer: "Synchrony Bank",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "2.00",
        welcomeBonus: "No signup bonus",
        description: "2% cash back on all purchases when redeemed to PayPal account"
      },

      // BARCLAYS CARDS
      {
        name: "Barclays Arrival Plus World Elite",
        issuer: "Barclays",
        annualFee: 89,
        minCreditScore: 700,
        baseReward: "2.00",
        welcomeBonus: "70,000 bonus miles after spending $5,000 in first 90 days",
        description: "2x miles on all purchases, miles can be redeemed for travel statement credits"
      },

      // NAVY FEDERAL CARDS
      {
        name: "Navy Federal More Rewards American Express",
        issuer: "Navy Federal",
        annualFee: 0,
        minCreditScore: 650,
        baseReward: "1.00",
        welcomeBonus: "20,000 bonus points after spending $3,000 in first 90 days",
        description: "3x points on gas, 2x on groceries and restaurants, 1x on all other purchases"
      }
    ];

    cards.forEach(card => {
      const id = randomUUID();
      this.creditCards.set(id, { id, ...card, isActive: true });
    });

    // Seed card category rewards
    const categoryArray = Array.from(this.merchantCategories.values());
    const cardArray = Array.from(this.creditCards.values());

    // Chase Freedom Flex - Rotating quarterly categories (5% cash back)
    const chaseCard = cardArray.find(c => c.name === "Chase Freedom Flex")!;
    const deptStoreCategory = categoryArray.find(c => c.name === "Department Stores")!;
    const gasCategory = categoryArray.find(c => c.name === "Gas Stations")!;
    const groceryCategory = categoryArray.find(c => c.name === "Grocery Stores")!;
    const restaurantCategory = categoryArray.find(c => c.name === "Restaurants")!;

    // Q1 2025: Gas Stations
    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: chaseCard.id,
      categoryId: gasCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q1"
    });

    // Q2 2025: Grocery Stores
    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: chaseCard.id,
      categoryId: groceryCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q2"
    });

    // Q3 2025: Restaurants
    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: chaseCard.id,
      categoryId: restaurantCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q3"
    });

    // Q4 2025: Department Stores
    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: chaseCard.id,
      categoryId: deptStoreCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q4"
    });

    // Discover it Cash Back - Rotating quarterly categories (5% cash back)
    const discoverCard = cardArray.find(c => c.name === "Discover it Cash Back")!;
    
    // Q1 2025: Department Stores (different than Chase)
    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: discoverCard.id,
      categoryId: deptStoreCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q1"
    });

    // Q2 2025: Gas Stations
    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: discoverCard.id,
      categoryId: gasCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q2"
    });

    // Q3 2025: Grocery Stores
    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: discoverCard.id,
      categoryId: groceryCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q3"
    });

    // Q4 2025: Restaurants
    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: discoverCard.id,
      categoryId: restaurantCategory.id,
      rewardRate: "5.00",
      isRotating: true,
      rotationPeriod: "Q4"
    });

    // Chase Freedom Flex - Permanent categories (always active)
    this.cardCategoryRewards.set(randomUUID(), {
      id: randomUUID(),
      cardId: chaseCard.id,
      categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id,
      rewardRate: "3.00",
      isRotating: false
    });

    // Blue Cash Preferred - Permanent categories
    const amexCard = cardArray.find(c => c.name === "Blue Cash Preferred")!;

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

    // Comprehensive database of all major US businesses (no location dependency)
    const stores = [
      // DEPARTMENT STORES & GENERAL RETAIL
      { name: "Target", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Walmart", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Costco", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Sam's Club", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "BJ's Wholesale Club", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Macy's", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Nordstrom", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Kohl's", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "JCPenney", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Dillard's", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },

      // GROCERY STORES
      { name: "Whole Foods Market", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Trader Joe's", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Safeway", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Kroger", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Publix", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "H-E-B", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Wegmans", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Stop & Shop", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Giant", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Food Lion", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Harris Teeter", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "ShopRite", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Albertsons", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Meijer", categoryId: groceryCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },

      // GAS STATIONS
      { name: "Shell", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Chevron", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Exxon", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Mobil", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "BP", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Texaco", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Marathon", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Speedway", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Circle K", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "7-Eleven", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Wawa", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "QuikTrip", categoryId: gasCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },

      // RESTAURANTS - FAST FOOD
      { name: "McDonald's", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Burger King", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Wendy's", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Taco Bell", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "KFC", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Subway", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Chick-fil-A", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Chipotle", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Five Guys", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "In-N-Out Burger", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Shake Shack", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Panera Bread", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Pizza Hut", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Domino's", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Papa John's", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },

      // RESTAURANTS - CASUAL DINING
      { name: "Applebee's", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Chili's", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Olive Garden", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Red Lobster", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "TGI Friday's", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Buffalo Wild Wings", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Texas Roadhouse", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Outback Steakhouse", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Cracker Barrel", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Denny's", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "IHOP", categoryId: restaurantCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },

      // COFFEE SHOPS

      // DRUG STORES & PHARMACIES
      { name: "CVS Pharmacy", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Walgreens", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Rite Aid", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Duane Reade", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },

      // ELECTRONICS
      { name: "Best Buy", categoryId: categoryArray.find(c => c.name === "Electronics")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Apple Store", categoryId: categoryArray.find(c => c.name === "Electronics")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Microsoft Store", categoryId: categoryArray.find(c => c.name === "Electronics")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "GameStop", categoryId: categoryArray.find(c => c.name === "Electronics")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "RadioShack", categoryId: categoryArray.find(c => c.name === "Electronics")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },

      // HOME IMPROVEMENT
      { name: "Home Depot", categoryId: categoryArray.find(c => c.name === "Home Improvement")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Lowe's", categoryId: categoryArray.find(c => c.name === "Home Improvement")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Menards", categoryId: categoryArray.find(c => c.name === "Home Improvement")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Ace Hardware", categoryId: categoryArray.find(c => c.name === "Home Improvement")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },

      // ONLINE SHOPPING
      { name: "Amazon", categoryId: categoryArray.find(c => c.name === "Online Shopping")!.id, address: "Online Platform", latitude: "0", longitude: "0", isChain: true },
      { name: "eBay", categoryId: categoryArray.find(c => c.name === "Online Shopping")!.id, address: "Online Platform", latitude: "0", longitude: "0", isChain: true },
      { name: "Walmart.com", categoryId: categoryArray.find(c => c.name === "Online Shopping")!.id, address: "Online Platform", latitude: "0", longitude: "0", isChain: true },
      { name: "Target.com", categoryId: categoryArray.find(c => c.name === "Online Shopping")!.id, address: "Online Platform", latitude: "0", longitude: "0", isChain: true },
      { name: "Best Buy Online", categoryId: categoryArray.find(c => c.name === "Online Shopping")!.id, address: "Online Platform", latitude: "0", longitude: "0", isChain: true },

      // TRAVEL (Airlines, Hotels, Car Rentals)
      { name: "Southwest Airlines", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Service", latitude: "0", longitude: "0", isChain: true },
      { name: "American Airlines", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Service", latitude: "0", longitude: "0", isChain: true },
      { name: "Delta Airlines", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Service", latitude: "0", longitude: "0", isChain: true },
      { name: "United Airlines", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Service", latitude: "0", longitude: "0", isChain: true },
      { name: "JetBlue Airways", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Service", latitude: "0", longitude: "0", isChain: true },
      { name: "Marriott", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Hilton", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Holiday Inn", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Best Western", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Enterprise Rent-A-Car", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Service", latitude: "0", longitude: "0", isChain: true },
      { name: "Hertz", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Service", latitude: "0", longitude: "0", isChain: true },
      { name: "Avis", categoryId: categoryArray.find(c => c.name === "Travel")!.id, address: "National Service", latitude: "0", longitude: "0", isChain: true },

      // ADDITIONAL POPULAR RETAILERS
      { name: "Dollar Tree", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Dollar General", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Family Dollar", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Big Lots", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "TJ Maxx", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Marshall's", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Ross Dress for Less", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true },
      { name: "Burlington", categoryId: deptStoreCategory.id, address: "National Chain", latitude: "0", longitude: "0", isChain: true }
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

  async searchStores(query: string, userLat?: number, userLng?: number, maxDistance = 50): Promise<StoreWithCategory[]> {
    // Simple name-based search across all registered businesses
    const stores = Array.from(this.stores.values())
      .filter(store => store.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 20); // Limit to top 20 results
    
    const storesWithCategories: StoreWithCategory[] = [];
    for (const store of stores) {
      const category = this.merchantCategories.get(store.categoryId);
      if (category) {
        storesWithCategories.push({ ...store, category });
      }
    }
    
    return storesWithCategories;
  }

  // Distance calculation utility
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  // Generate realistic addresses based on coordinates
  private generateRealisticAddress(lat: number, lng: number): string {
    const streetNumbers = [Math.floor(Math.random() * 9000) + 1000];
    const streetNames = ['Main St', 'Broadway', 'Central Ave', 'Washington St', 'Park Ave', 'First St', 'Second St', 'Oak St', 'Maple Ave', 'Church St', 'Mill St', 'State St'];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    
    // Determine city/state based on approximate coordinates
    let city = 'Unknown';
    let state = 'NY';
    
    // Albany, NY area (rough bounds)
    if (lat >= 42.5 && lat <= 43.0 && lng >= -74.2 && lng <= -73.5) {
      const albanyCities = ['Albany', 'Schenectady', 'Troy', 'Cohoes', 'Watervliet', 'Rensselaer', 'Colonie'];
      city = albanyCities[Math.floor(Math.random() * albanyCities.length)];
      state = 'NY';
    }
    // NYC area
    else if (lat >= 40.4 && lat <= 41.0 && lng >= -74.3 && lng <= -73.7) {
      const nycCities = ['New York', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
      city = nycCities[Math.floor(Math.random() * nycCities.length)];
      state = 'NY';
    }
    // Boston area
    else if (lat >= 42.0 && lat <= 42.6 && lng >= -71.5 && lng <= -70.8) {
      const bostonCities = ['Boston', 'Cambridge', 'Somerville', 'Newton', 'Brookline'];
      city = bostonCities[Math.floor(Math.random() * bostonCities.length)];
      state = 'MA';
    }
    // Philadelphia area
    else if (lat >= 39.7 && lat <= 40.2 && lng >= -75.5 && lng <= -74.9) {
      const phillyCities = ['Philadelphia', 'Camden', 'Chester', 'Norristown'];
      city = phillyCities[Math.floor(Math.random() * phillyCities.length)];
      state = 'PA';
    }
    // Default to generic format
    else {
      city = 'Local City';
      state = 'NY';
    }
    
    return `${streetNumbers[0]} ${streetName}, ${city}, ${state}`;
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
}

export const storage = new MemStorage();
