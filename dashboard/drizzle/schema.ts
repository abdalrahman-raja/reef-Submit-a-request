import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * جدول الطلبات - يحتوي على بيانات طلبات التمويل
 */
export const requests = mysqlTable("requests", {
  id: int("id").autoincrement().primaryKey(),
  requestNumber: varchar("requestNumber", { length: 50 }).notNull().unique(),
  identityNumber: varchar("identityNumber", { length: 50 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(), // ذكر / أنثى
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  residencyNumber: varchar("residencyNumber", { length: 50 }),
  age: int("age"),
  nationality: varchar("nationality", { length: 100 }).notNull(),
  requestedAmount: int("requestedAmount").notNull(), // القيمة المطلوبة
  approvedAmount: int("approvedAmount"), // القيمة الموافق عليها
  submissionDate: timestamp("submissionDate").notNull(),
  disbursementDate: timestamp("disbursementDate"),
  transactionNumber: varchar("transactionNumber", { length: 50 }),
  fundingAmount: int("fundingAmount"), // مبلغ التمويل
  monthlyInstallment: int("monthlyInstallment"), // القسط الشهري
  fundingDuration: int("fundingDuration"), // مدة التمويل (عدد الأشهر)
  financialFile: text("financialFile"), // الملف المالي (رابط أو ملاحظات)
  approvalFees: int("approvalFees"), // رسوم موافقة التمويل
  arrears: int("arrears"), // المتعثرات
  totalAmount: int("totalAmount"), // المبلغ الإجمالي
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, approved, rejected, completed
  notes: text("notes"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Request = typeof requests.$inferSelect;
export type InsertRequest = typeof requests.$inferInsert;

/**
 * جدول سجل الاستعلامات - لتسجيل كل استعلام عن حالة الطلب
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  identityNumber: varchar("identityNumber", { length: 50 }).notNull(),
  requestNumber: varchar("requestNumber", { length: 50 }).notNull(),
  inquiredAt: timestamp("inquiredAt").defaultNow().notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;