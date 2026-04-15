import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, requests, inquiries, InsertRequest, InsertInquiry, Request } from "../drizzle/schema";
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
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
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
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

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * الحصول على جميع الطلبات مع إمكانية البحث والتصفية
 */
export async function getAllRequests(filters?: {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<Request[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [];

  if (filters?.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(requests.requestNumber, searchTerm),
        like(requests.identityNumber, searchTerm),
        like(requests.fullName, searchTerm),
        like(requests.email, searchTerm)
      )
    );
  }

  if (filters?.status) {
    conditions.push(eq(requests.status, filters.status));
  }

  let baseQuery = db.select().from(requests);
  let query = baseQuery as any;

  if (conditions.length > 0) {
    query = baseQuery.where(and(...conditions));
  }

  query = query.orderBy(desc(requests.createdAt));

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.offset(filters.offset);
  }

  return await query;
}

/**
 * الحصول على طلب واحد برقم الهوية ورقم الطلب
 */
export async function getRequestByIdentityAndNumber(
  identityNumber: string,
  requestNumber: string
) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(requests)
    .where(
      and(
        eq(requests.identityNumber, identityNumber),
        eq(requests.requestNumber, requestNumber)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * إنشاء طلب جديد
 */
export async function createRequest(data: InsertRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(requests).values(data);
}

/**
 * تحديث طلب
 */
export async function updateRequest(id: number, data: Partial<InsertRequest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(requests).set(data).where(eq(requests.id, id));
}

/**
 * حذف طلب
 */
export async function deleteRequest(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(requests).where(eq(requests.id, id));
}

/**
 * تسجيل استعلام عن حالة الطلب
 */
export async function logInquiry(data: InsertInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(inquiries).values(data);
}

// TODO: add feature queries here as your schema grows.
