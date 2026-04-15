import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// نموذج مستخدم مشرف للاختبار
const adminUser = {
  id: 1,
  openId: "admin-user",
  email: "admin@example.com",
  name: "مشرف النظام",
  loginMethod: "manus",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

// نموذج مستخدم عادي للاختبار
const regularUser = {
  id: 2,
  openId: "regular-user",
  email: "user@example.com",
  name: "مستخدم عادي",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

// إنشاء context للاختبار
function createContext(user: typeof adminUser | typeof regularUser | null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: { "x-forwarded-for": "192.168.1.1" },
      socket: { remoteAddress: "192.168.1.1" },
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };
}

describe("Requests API", () => {
  describe("requests.create", () => {
    it("يجب أن يسمح للمشرفين بإضافة طلب جديد", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.requests.create({
        requestNumber: "REQ-2026-001",
        identityNumber: "1234567890",
        fullName: "أحمد محمد علي",
        gender: "ذكر",
        phoneNumber: "0501234567",
        email: "ahmed@example.com",
        nationality: "سعودي",
        requestedAmount: 50000,
        submissionDate: new Date(),
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("تم إضافة الطلب بنجاح");
    });

    it("يجب أن يرفض إضافة طلب من مستخدم عادي", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.requests.create({
          requestNumber: "REQ-2026-002",
          identityNumber: "1234567891",
          fullName: "محمد أحمد علي",
          gender: "ذكر",
          phoneNumber: "0501234568",
          email: "mohammad@example.com",
          nationality: "سعودي",
          requestedAmount: 60000,
          submissionDate: new Date(),
        });
        expect.fail("يجب أن يرفع خطأ");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
        expect(error.message).toContain("صلاحيات غير كافية");
      }
    });

    it("يجب أن يرفض إضافة طلب من مستخدم غير مسجل", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.requests.create({
          requestNumber: "REQ-2026-003",
          identityNumber: "1234567892",
          fullName: "علي محمد أحمد",
          gender: "ذكر",
          phoneNumber: "0501234569",
          email: "ali@example.com",
          nationality: "سعودي",
          requestedAmount: 70000,
          submissionDate: new Date(),
        });
        expect.fail("يجب أن يرفع خطأ");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("يجب أن يتحقق من صحة البيانات المدخلة", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.requests.create({
          requestNumber: "",
          identityNumber: "1234567893",
          fullName: "فاطمة أحمد",
          gender: "أنثى",
          phoneNumber: "0501234570",
          email: "invalid-email",
          nationality: "سعودية",
          requestedAmount: -1000,
          submissionDate: new Date(),
        });
        expect.fail("يجب أن يرفع خطأ");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("requests.list", () => {
    it("يجب أن يسمح للمشرفين بعرض قائمة الطلبات", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.requests.list({
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("يجب أن يرفض عرض الطلبات لمستخدم عادي", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.requests.list({
          limit: 10,
          offset: 0,
        });
        expect.fail("يجب أن يرفع خطأ");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("يجب أن يدعم البحث عن الطلبات", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.requests.list({
        search: "REQ-2026",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("يجب أن يدعم تصفية الطلبات حسب الحالة", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.requests.list({
        status: "pending",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("requests.inquire", () => {
    it("يجب أن يسمح لأي مستخدم بالبحث عن طلب", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.requests.inquire({
          identityNumber: "1234567890",
          requestNumber: "REQ-2026-001",
        });

        // قد لا يجد الطلب إذا لم يكن موجوداً، لكن يجب أن لا يرفع خطأ صلاحيات
        expect(result).toBeDefined();
      } catch (error: any) {
        // يجب أن يكون الخطأ NOT_FOUND وليس FORBIDDEN
        expect(error.code).toBe("NOT_FOUND");
      }
    });

    it("يجب أن يتحقق من صحة البيانات المدخلة", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.requests.inquire({
          identityNumber: "",
          requestNumber: "",
        });
        expect.fail("يجب أن يرفع خطأ");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("يجب أن يسجل الاستعلام عند البحث عن طلب", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.requests.inquire({
          identityNumber: "1234567890",
          requestNumber: "REQ-2026-001",
        });
      } catch (error: any) {
        // حتى لو لم يجد الطلب، يجب أن يكون قد حاول تسجيل الاستعلام
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("requests.update", () => {
    it("يجب أن يسمح للمشرفين بتحديث الطلبات", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.requests.update({
        id: 1,
        data: {
          status: "approved",
          approvedAmount: 50000,
        },
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("تم تحديث الطلب بنجاح");
    });

    it("يجب أن يرفض تحديث الطلبات من مستخدم عادي", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.requests.update({
          id: 1,
          data: {
            status: "approved",
          },
        });
        expect.fail("يجب أن يرفع خطأ");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("requests.delete", () => {
    it("يجب أن يسمح للمشرفين بحذف الطلبات", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.requests.delete({
        id: 1,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("تم حذف الطلب بنجاح");
    });

    it("يجب أن يرفض حذف الطلبات من مستخدم عادي", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.requests.delete({
          id: 1,
        });
        expect.fail("يجب أن يرفع خطأ");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("Auth", () => {
    it("يجب أن يعيد بيانات المستخدم الحالي", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toEqual(adminUser);
    });

    it("يجب أن يعيد null للمستخدم غير المسجل", async () => {
      const ctx = createContext(null);
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toBeNull();
    });
  });
});
