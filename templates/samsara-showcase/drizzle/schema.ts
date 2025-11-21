import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Fractals table for storing generated consciousness visualizations
 */
export const fractals = mysqlTable("fractals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  harmony: varchar("harmony", { length: 32 }).notNull(),
  zoom: varchar("zoom", { length: 32 }).notNull(),
  resilience: varchar("resilience", { length: 32 }).notNull(),
  prana: varchar("prana", { length: 32 }).notNull(),
  drishti: varchar("drishti", { length: 32 }).notNull(),
  klesha: varchar("klesha", { length: 32 }).notNull(),
  isFavorite: boolean("isFavorite").default(false),
  isPublic: boolean("isPublic").default(false),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Fractal = typeof fractals.$inferSelect;
export type InsertFractal = typeof fractals.$inferInsert;

/**
 * Collections for organizing fractals
 */
export const collections = mysqlTable("collections", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isPublic: boolean("isPublic").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;

/**
 * Join table for fractals in collections
 */
export const fractalsInCollections = mysqlTable("fractals_in_collections", {
  fractalId: varchar("fractalId", { length: 64 }).notNull(),
  collectionId: varchar("collectionId", { length: 64 }).notNull(),
  addedAt: timestamp("addedAt").defaultNow(),
});

/**
 * User generation history and stats
 */
export const userStats = mysqlTable("user_stats", {
  userId: varchar("userId", { length: 64 }).primaryKey(),
  totalFractalsGenerated: int("totalFractalsGenerated").default(0),
  totalFavorites: int("totalFavorites").default(0),
  totalCollections: int("totalCollections").default(0),
  lastGeneratedAt: timestamp("lastGeneratedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  fractals: many(fractals),
  collections: many(collections),
  stats: many(userStats),
}));

export const fractalsRelations = relations(fractals, ({ one, many }) => ({
  user: one(users, {
    fields: [fractals.userId],
    references: [users.id],
  }),
  collections: many(fractalsInCollections),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
  fractals: many(fractalsInCollections),
}));

