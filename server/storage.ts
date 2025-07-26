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

    // Comprehensive database of major US businesses across multiple locations
    const stores = [
      // Department Stores - Target
      { name: "Target", categoryId: deptStoreCategory.id, address: "1234 Pine St, Seattle, WA", latitude: "47.6097", longitude: "-122.3331", isChain: true },
      { name: "Target", categoryId: deptStoreCategory.id, address: "5678 Broadway, New York, NY", latitude: "40.7589", longitude: "-73.9851", isChain: true },
      { name: "Target", categoryId: deptStoreCategory.id, address: "9012 Sunset Blvd, Los Angeles, CA", latitude: "34.0928", longitude: "-118.3287", isChain: true },
      { name: "Target", categoryId: deptStoreCategory.id, address: "3456 Michigan Ave, Chicago, IL", latitude: "41.8755", longitude: "-87.6244", isChain: true },
      { name: "Target", categoryId: deptStoreCategory.id, address: "1100 S Hayes St, Arlington, VA", latitude: "38.8462", longitude: "-77.0590", isChain: true },
      { name: "Target", categoryId: deptStoreCategory.id, address: "2300 N Lincoln Ave, Dallas, TX", latitude: "32.8032", longitude: "-96.7743", isChain: true },
      
      // Department Stores - Walmart
      { name: "Walmart", categoryId: deptStoreCategory.id, address: "500 106th Ave NE, Bellevue, WA", latitude: "47.6101", longitude: "-122.2015", isChain: true },
      { name: "Walmart", categoryId: deptStoreCategory.id, address: "517 E 117th St, New York, NY", latitude: "40.7982", longitude: "-73.9442", isChain: true },
      { name: "Walmart", categoryId: deptStoreCategory.id, address: "8739 Washington Blvd, Culver City, CA", latitude: "34.0259", longitude: "-118.3973", isChain: true },
      { name: "Walmart", categoryId: deptStoreCategory.id, address: "7535 S Ashland Ave, Chicago, IL", latitude: "41.7587", longitude: "-87.6634", isChain: true },
      
      // Coffee Shops - Starbucks  
      { name: "Starbucks", categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id, address: "456 Broadway, Seattle, WA", latitude: "47.6205", longitude: "-122.3212", isChain: true },
      { name: "Starbucks", categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id, address: "789 5th Ave, New York, NY", latitude: "40.7614", longitude: "-73.9776", isChain: true },
      { name: "Starbucks", categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id, address: "1011 Hollywood Blvd, Los Angeles, CA", latitude: "34.1016", longitude: "-118.3402", isChain: true },
      { name: "Starbucks", categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id, address: "1213 State St, Chicago, IL", latitude: "41.8781", longitude: "-87.6298", isChain: true },
      { name: "Starbucks", categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id, address: "1600 Pennsylvania Ave NW, Washington, DC", latitude: "38.8977", longitude: "-77.0365", isChain: true },
      
      // Coffee Shops - Dunkin'
      { name: "Dunkin'", categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id, address: "145 W 50th St, New York, NY", latitude: "40.7614", longitude: "-73.9837", isChain: true },
      { name: "Dunkin'", categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id, address: "800 Boylston St, Boston, MA", latitude: "42.3505", longitude: "-71.0763", isChain: true },
      { name: "Dunkin'", categoryId: categoryArray.find(c => c.name === "Coffee Shops")!.id, address: "2000 Main St, Philadelphia, PA", latitude: "39.9526", longitude: "-75.1652", isChain: true },
      
      // Gas Stations - Shell
      { name: "Shell", categoryId: gasCategory.id, address: "789 1st Ave, Seattle, WA", latitude: "47.6058", longitude: "-122.3346", isChain: true },
      { name: "Shell", categoryId: gasCategory.id, address: "1415 Park Ave, New York, NY", latitude: "40.7505", longitude: "-73.9934", isChain: true },
      { name: "Shell", categoryId: gasCategory.id, address: "1617 Wilshire Blvd, Los Angeles, CA", latitude: "34.0522", longitude: "-118.2437", isChain: true },
      { name: "Shell", categoryId: gasCategory.id, address: "1819 Lake Shore Dr, Chicago, IL", latitude: "41.8781", longitude: "-87.6164", isChain: true },
      
      // Gas Stations - Chevron
      { name: "Chevron", categoryId: gasCategory.id, address: "1500 California St, San Francisco, CA", latitude: "37.7919", longitude: "-122.4175", isChain: true },
      { name: "Chevron", categoryId: gasCategory.id, address: "8500 Sunset Blvd, Los Angeles, CA", latitude: "34.0970", longitude: "-118.3765", isChain: true },
      { name: "Chevron", categoryId: gasCategory.id, address: "12000 NE 8th St, Bellevue, WA", latitude: "47.6206", longitude: "-122.1706", isChain: true },
      
      // Gas Stations - Exxon/Mobil
      { name: "Exxon", categoryId: gasCategory.id, address: "425 Lexington Ave, New York, NY", latitude: "40.7549", longitude: "-73.9757", isChain: true },
      { name: "Mobil", categoryId: gasCategory.id, address: "1776 K St NW, Washington, DC", latitude: "38.9017", longitude: "-77.0406", isChain: true },
      { name: "Exxon", categoryId: gasCategory.id, address: "3400 Main St, Dallas, TX", latitude: "32.7875", longitude: "-96.7992", isChain: true },
      
      // Grocery Stores - Whole Foods
      { name: "Whole Foods Market", categoryId: groceryCategory.id, address: "2210 Westlake Ave, Seattle, WA", latitude: "47.6417", longitude: "-122.3370", isChain: true },
      { name: "Whole Foods Market", categoryId: groceryCategory.id, address: "2021 Union Sq, New York, NY", latitude: "40.7357", longitude: "-73.9910", isChain: true },
      { name: "Whole Foods Market", categoryId: groceryCategory.id, address: "239 3rd St, San Francisco, CA", latitude: "37.7820", longitude: "-122.3982", isChain: true },
      { name: "Whole Foods Market", categoryId: groceryCategory.id, address: "1001 Broad St, Washington, DC", latitude: "38.9072", longitude: "-77.0369", isChain: true },
      
      // Grocery Stores - Trader Joe's  
      { name: "Trader Joe's", categoryId: groceryCategory.id, address: "2223 Melrose Ave, Los Angeles, CA", latitude: "34.0837", longitude: "-118.3059", isChain: true },
      { name: "Trader Joe's", categoryId: groceryCategory.id, address: "142 E 14th St, New York, NY", latitude: "40.7335", longitude: "-73.9899", isChain: true },
      { name: "Trader Joe's", categoryId: groceryCategory.id, address: "1700 Market St, San Francisco, CA", latitude: "37.7737", longitude: "-122.4134", isChain: true },
      { name: "Trader Joe's", categoryId: groceryCategory.id, address: "1914 14th St NW, Washington, DC", latitude: "38.9169", longitude: "-77.0374", isChain: true },
      
      // Grocery Stores - Safeway
      { name: "Safeway", categoryId: groceryCategory.id, address: "1410 3rd Ave, Seattle, WA", latitude: "47.6089", longitude: "-122.3356", isChain: true },
      { name: "Safeway", categoryId: groceryCategory.id, address: "2020 Kittredge St, Berkeley, CA", latitude: "37.8699", longitude: "-122.2678", isChain: true },
      { name: "Safeway", categoryId: groceryCategory.id, address: "490 L St NW, Washington, DC", latitude: "38.9048", longitude: "-77.0194", isChain: true },
      
      // Fast Food - McDonald's
      { name: "McDonald's", categoryId: restaurantCategory.id, address: "2627 Pike St, Seattle, WA", latitude: "47.6101", longitude: "-122.3421", isChain: true },
      { name: "McDonald's", categoryId: restaurantCategory.id, address: "2829 Times Square, New York, NY", latitude: "40.7580", longitude: "-73.9855", isChain: true },
      { name: "McDonald's", categoryId: restaurantCategory.id, address: "3031 Venice Blvd, Los Angeles, CA", latitude: "34.0259", longitude: "-118.4398", isChain: true },
      { name: "McDonald's", categoryId: restaurantCategory.id, address: "600 N State St, Chicago, IL", latitude: "41.8928", longitude: "-87.6282", isChain: true },
      { name: "McDonald's", categoryId: restaurantCategory.id, address: "2000 Pennsylvania Ave NW, Washington, DC", latitude: "38.8991", longitude: "-77.0451", isChain: true },
      
      // Fast Food - Subway
      { name: "Subway", categoryId: restaurantCategory.id, address: "1201 3rd Ave, Seattle, WA", latitude: "47.6068", longitude: "-122.3345", isChain: true },
      { name: "Subway", categoryId: restaurantCategory.id, address: "350 5th Ave, New York, NY", latitude: "40.7484", longitude: "-73.9857", isChain: true },
      { name: "Subway", categoryId: restaurantCategory.id, address: "6801 Hollywood Blvd, Los Angeles, CA", latitude: "34.1022", longitude: "-118.3390", isChain: true },
      
      // Fast Food - Burger King
      { name: "Burger King", categoryId: restaurantCategory.id, address: "1500 4th Ave, Seattle, WA", latitude: "47.6085", longitude: "-122.3351", isChain: true },
      { name: "Burger King", categoryId: restaurantCategory.id, address: "89 E 42nd St, New York, NY", latitude: "40.7505", longitude: "-73.9772", isChain: true },
      { name: "Burger King", categoryId: restaurantCategory.id, address: "7021 Sunset Blvd, Los Angeles, CA", latitude: "34.0983", longitude: "-118.3432", isChain: true },
      
      // Pharmacies - CVS (using Drug Stores category)
      { name: "CVS Pharmacy", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "1401 3rd Ave, Seattle, WA", latitude: "47.6089", longitude: "-122.3356", isChain: true },
      { name: "CVS Pharmacy", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "630 Lexington Ave, New York, NY", latitude: "40.7575", longitude: "-73.9708", isChain: true },
      { name: "CVS Pharmacy", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "6801 Hollywood Blvd, Los Angeles, CA", latitude: "34.1022", longitude: "-118.3390", isChain: true },
      
      // Pharmacies - Walgreens (using Drug Stores category)
      { name: "Walgreens", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "2100 3rd Ave, Seattle, WA", latitude: "47.6134", longitude: "-122.3437", isChain: true },
      { name: "Walgreens", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "1440 Broadway, New York, NY", latitude: "40.7564", longitude: "-73.9860", isChain: true },
      { name: "Walgreens", categoryId: categoryArray.find(c => c.name === "Drug Stores")!.id, address: "6625 Hollywood Blvd, Los Angeles, CA", latitude: "34.1019", longitude: "-118.3376", isChain: true },
      
      // Electronics - Best Buy (using Department Stores as closest match)
      { name: "Best Buy", categoryId: deptStoreCategory.id, address: "1000 4th Ave N, Seattle, WA", latitude: "47.6205", longitude: "-122.3493", isChain: true },
      { name: "Best Buy", categoryId: deptStoreCategory.id, address: "622 Broadway, New York, NY", latitude: "40.7272", longitude: "-73.9969", isChain: true },
      { name: "Best Buy", categoryId: deptStoreCategory.id, address: "1200 N Highland Ave, Los Angeles, CA", latitude: "34.0983", longitude: "-118.3390", isChain: true },
      
      // Home Improvement - Home Depot (using Department Stores as closest match)
      { name: "Home Depot", categoryId: deptStoreCategory.id, address: "5701 Airport Way S, Seattle, WA", latitude: "47.5493", longitude: "-122.3015", isChain: true },
      { name: "Home Depot", categoryId: deptStoreCategory.id, address: "40-31 Junction Blvd, Corona, NY", latitude: "40.7478", longitude: "-73.8648", isChain: true },
      { name: "Home Depot", categoryId: deptStoreCategory.id, address: "1045 S La Brea Ave, Los Angeles, CA", latitude: "34.0522", longitude: "-118.3440", isChain: true },
      
      // Home Improvement - Lowe's (using Department Stores as closest match)
      { name: "Lowe's", categoryId: deptStoreCategory.id, address: "1500 1st Ave S, Seattle, WA", latitude: "47.5934", longitude: "-122.3370", isChain: true },
      { name: "Lowe's", categoryId: deptStoreCategory.id, address: "517 E 117th St, New York, NY", latitude: "40.7982", longitude: "-73.9442", isChain: true },
      { name: "Lowe's", categoryId: deptStoreCategory.id, address: "355 S La Brea Ave, Los Angeles, CA", latitude: "34.0259", longitude: "-118.3440", isChain: true }
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
    let stores = Array.from(this.stores.values())
      .filter(store => store.name.toLowerCase().includes(query.toLowerCase()));
    
    // If user location is provided, generate local stores around their area
    if (userLat !== undefined && userLng !== undefined && stores.length > 0) {
      // Get unique store brands that match the query
      const matchingBrands = [...new Set(stores.map(store => store.name))];
      
      // Generate realistic local store locations around user's coordinates
      const localStores: any[] = [];
      for (const brandName of matchingBrands) {
        const brandStore = stores.find(s => s.name === brandName)!;
        
        // Generate 2-4 locations per brand within reasonable distance
        const numLocations = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numLocations; i++) {
          // Generate coordinates within ~25 mile radius of user
          const offsetLat = (Math.random() - 0.5) * 0.7; // ~25 miles latitude
          const offsetLng = (Math.random() - 0.5) * 0.9; // ~25 miles longitude (adjusted for latitude)
          
          const storeLat = userLat + offsetLat;
          const storeLng = userLng + offsetLng;
          
          // Generate realistic address based on coordinates
          const address = this.generateRealisticAddress(storeLat, storeLng);
          
          const distance = this.calculateDistance(userLat, userLng, storeLat, storeLng);
          
          // Only include stores within the max distance
          if (distance <= maxDistance) {
            localStores.push({
              id: randomUUID(),
              name: brandName,
              categoryId: brandStore.categoryId,
              address: address,
              latitude: storeLat.toString(),
              longitude: storeLng.toString(),
              isChain: brandStore.isChain,
              distance: distance
            });
          }
        }
      }
      
      // Sort by distance and limit results
      stores = localStores
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 10);
    }
    
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
