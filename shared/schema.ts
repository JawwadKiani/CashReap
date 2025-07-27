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

// Insert schemas
export const insertCreditCardSchema = createInsertSchema(creditCards).omit({ id: true });
export const insertMerchantCategorySchema = createInsertSchema(merchantCategories).omit({ id: true });
export const insertCardCategoryRewardSchema = createInsertSchema(cardCategoryRewards).omit({ id: true });
export const insertStoreSchema = createInsertSchema(stores).omit({ id: true });
export const insertUserSearchHistorySchema = createInsertSchema(userSearchHistory).omit({ id: true });
export const insertUserSavedCardSchema = createInsertSchema(userSavedCards).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });

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
