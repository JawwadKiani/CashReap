import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const creditCards = pgTable("credit_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  annualFee: integer("annual_fee").notNull().default(0),
  minCreditScore: integer("min_credit_score").notNull().default(600),
  baseReward: decimal("base_reward", { precision: 4, scale: 2 }).notNull().default("1.00"),
  welcomeBonus: text("welcome_bonus"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

export const merchantCategories = pgTable("merchant_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  iconClass: text("icon_class"),
});

export const cardCategoryRewards = pgTable("card_category_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => creditCards.id),
  categoryId: varchar("category_id").notNull().references(() => merchantCategories.id),
  rewardRate: decimal("reward_rate", { precision: 4, scale: 2 }).notNull(),
  isRotating: boolean("is_rotating").notNull().default(false),
  rotationPeriod: text("rotation_period"), // Q1, Q2, Q3, Q4, or null for permanent
});

export const stores = pgTable("stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  categoryId: varchar("category_id").notNull().references(() => merchantCategories.id),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isChain: boolean("is_chain").notNull().default(false),
});

export const userSearchHistory = pgTable("user_search_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storeId: varchar("store_id").notNull().references(() => stores.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  searchedAt: timestamp("searched_at").notNull().default(sql`now()`),
});

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userSavedCards = pgTable("user_saved_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => creditCards.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  savedAt: timestamp("saved_at").notNull().default(sql`now()`),
});

// New tables for enhanced features

export const userSpendingProfiles = pgTable("user_spending_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  categoryId: varchar("category_id").notNull().references(() => merchantCategories.id),
  monthlySpending: decimal("monthly_spending", { precision: 10, scale: 2 }).notNull().default("0.00"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const purchasePlans = pgTable("purchase_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  storeId: varchar("store_id").references(() => stores.id),
  categoryId: varchar("category_id").references(() => merchantCategories.id),
  targetDate: timestamp("target_date"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const welcomeBonusTracking = pgTable("welcome_bonus_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cardId: varchar("card_id").notNull().references(() => creditCards.id),
  requiredSpending: decimal("required_spending", { precision: 10, scale: 2 }).notNull(),
  currentSpending: decimal("current_spending", { precision: 10, scale: 2 }).notNull().default("0.00"),
  timeframeMonths: integer("timeframe_months").notNull().default(3),
  startDate: timestamp("start_date").notNull().default(sql`now()`),
  isCompleted: boolean("is_completed").notNull().default(false),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  creditScoreRange: varchar("credit_score_range").notNull().default("650-700"), // "600-650", "650-700", "700-750", "750+"
  maxAnnualFee: integer("max_annual_fee").notNull().default(0),
  preferredIssuers: text("preferred_issuers"), // JSON array of preferred issuers
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const cardComparisons = pgTable("card_comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cardIds: text("card_ids").notNull(), // JSON array of card IDs being compared
  comparisonName: text("comparison_name"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertCreditCardSchema = createInsertSchema(creditCards).omit({ id: true });
export const insertMerchantCategorySchema = createInsertSchema(merchantCategories).omit({ id: true });
export const insertCardCategoryRewardSchema = createInsertSchema(cardCategoryRewards).omit({ id: true });
export const insertStoreSchema = createInsertSchema(stores).omit({ id: true });
export const insertUserSearchHistorySchema = createInsertSchema(userSearchHistory).omit({ id: true });
export const insertUserSavedCardSchema = createInsertSchema(userSavedCards).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserSpendingProfileSchema = createInsertSchema(userSpendingProfiles).omit({ id: true, updatedAt: true });
export const insertPurchasePlanSchema = createInsertSchema(purchasePlans).omit({ id: true, createdAt: true });
export const insertWelcomeBonusTrackingSchema = createInsertSchema(welcomeBonusTracking).omit({ id: true });
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true, updatedAt: true });
export const insertCardComparisonSchema = createInsertSchema(cardComparisons).omit({ id: true, createdAt: true });

// Types
export type CreditCard = typeof creditCards.$inferSelect;
export type InsertCreditCard = z.infer<typeof insertCreditCardSchema>;
export type MerchantCategory = typeof merchantCategories.$inferSelect;
export type InsertMerchantCategory = z.infer<typeof insertMerchantCategorySchema>;
export type CardCategoryReward = typeof cardCategoryRewards.$inferSelect;
export type InsertCardCategoryReward = z.infer<typeof insertCardCategoryRewardSchema>;
export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type UserSearchHistory = typeof userSearchHistory.$inferSelect;
export type InsertUserSearchHistory = z.infer<typeof insertUserSearchHistorySchema>;
export type UserSavedCard = typeof userSavedCards.$inferSelect;
export type InsertUserSavedCard = z.infer<typeof insertUserSavedCardSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type UserSpendingProfile = typeof userSpendingProfiles.$inferSelect;
export type InsertUserSpendingProfile = z.infer<typeof insertUserSpendingProfileSchema>;
export type PurchasePlan = typeof purchasePlans.$inferSelect;
export type InsertPurchasePlan = z.infer<typeof insertPurchasePlanSchema>;
export type WelcomeBonusTracking = typeof welcomeBonusTracking.$inferSelect;
export type InsertWelcomeBonusTracking = z.infer<typeof insertWelcomeBonusTrackingSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type CardComparison = typeof cardComparisons.$inferSelect;
export type InsertCardComparison = z.infer<typeof insertCardComparisonSchema>;

// Extended types for API responses
export type StoreWithCategory = Store & {
  category: MerchantCategory;
};

export type CardRecommendation = CreditCard & {
  rewardRate: string;
  categoryMatch: string;
  isRotating: boolean;
  rotationPeriod?: string;
};

export type LocationData = {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
};

// Enhanced API response types
export type SpendingAnalysis = {
  categoryId: string;
  categoryName: string;
  monthlySpending: number;
  recommendedCards: CardRecommendation[];
  potentialEarnings: number;
};

export type PurchasePlanWithRecommendations = PurchasePlan & {
  store?: StoreWithCategory;
  category?: MerchantCategory;
  recommendedCards: CardRecommendation[];
  potentialEarnings: number;
};

export type WelcomeBonusProgress = WelcomeBonusTracking & {
  card: CreditCard;
  progressPercentage: number;
  remainingSpending: number;
  daysRemaining: number;
};

export type CardWithEarnings = CreditCard & {
  projectedAnnualEarnings: number;
  topCategories: Array<{
    categoryName: string;
    rewardRate: string;
    monthlyEarnings: number;
  }>;
};
