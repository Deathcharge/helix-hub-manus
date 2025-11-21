import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, fractals, InsertFractal, collections, InsertCollection, userStats, fractalsInCollections } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Fractal queries
export async function createFractal(fractal: InsertFractal): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create fractal: database not available");
    return;
  }

  try {
    await db.insert(fractals).values(fractal);
    
    // Update user stats
    const existingStats = await db.select().from(userStats).where(eq(userStats.userId, fractal.userId)).limit(1);
    if (existingStats.length > 0 && existingStats[0]) {
      await db.update(userStats)
        .set({
          totalFractalsGenerated: (existingStats[0].totalFractalsGenerated ?? 0) + 1,
          lastGeneratedAt: new Date(),
        })
        .where(eq(userStats.userId, fractal.userId));
    } else {
      await db.insert(userStats).values({
        userId: fractal.userId,
        totalFractalsGenerated: 1,
        lastGeneratedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("[Database] Failed to create fractal:", error);
    throw error;
  }
}

export async function getUserFractals(userId: string, limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get fractals: database not available");
    return [];
  }

  try {
    return await db.select()
      .from(fractals)
      .where(eq(fractals.userId, userId))
      .orderBy(desc(fractals.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get user fractals:", error);
    return [];
  }
}

export async function getFractal(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get fractal: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(fractals).where(eq(fractals.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get fractal:", error);
    return undefined;
  }
}

export async function updateFractal(id: string, updates: Partial<InsertFractal>): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update fractal: database not available");
    return;
  }

  try {
    await db.update(fractals).set(updates).where(eq(fractals.id, id));
  } catch (error) {
    console.error("[Database] Failed to update fractal:", error);
    throw error;
  }
}

export async function toggleFractalFavorite(id: string, isFavorite: boolean, userId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot toggle favorite: database not available");
    return;
  }

  try {
    await db.update(fractals).set({ isFavorite }).where(eq(fractals.id, id));
    
    // Update user stats
    const existingStats = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    if (existingStats.length > 0 && existingStats[0]) {
      const newFavoriteCount = isFavorite 
        ? (existingStats[0].totalFavorites ?? 0) + 1 
        : Math.max(0, (existingStats[0].totalFavorites ?? 0) - 1);
      await db.update(userStats)
        .set({ totalFavorites: newFavoriteCount })
        .where(eq(userStats.userId, userId));
    }
  } catch (error) {
    console.error("[Database] Failed to toggle favorite:", error);
    throw error;
  }
}

export async function deleteFractal(id: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete fractal: database not available");
    return;
  }

  try {
    await db.delete(fractals).where(eq(fractals.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete fractal:", error);
    throw error;
  }
}

// Collection queries
export async function createCollection(collection: InsertCollection): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create collection: database not available");
    return;
  }

  try {
    await db.insert(collections).values(collection);
    
    // Update user stats
    const existingStats = await db.select().from(userStats).where(eq(userStats.userId, collection.userId)).limit(1);
    if (existingStats.length > 0 && existingStats[0]) {
      await db.update(userStats)
        .set({ totalCollections: (existingStats[0].totalCollections ?? 0) + 1 })
        .where(eq(userStats.userId, collection.userId));
    }
  } catch (error) {
    console.error("[Database] Failed to create collection:", error);
    throw error;
  }
}

export async function getUserCollections(userId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get collections: database not available");
    return [];
  }

  try {
    return await db.select()
      .from(collections)
      .where(eq(collections.userId, userId))
      .orderBy(desc(collections.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get user collections:", error);
    return [];
  }
}

export async function getUserStats(userId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get stats: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user stats:", error);
    return undefined;
  }
}

