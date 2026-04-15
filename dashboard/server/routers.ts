import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getAllRequests,
  getRequestByIdentityAndNumber,
  createRequest,
  updateRequest,
  deleteRequest,
  logInquiry,
} from "./db";
import { notifyOwner } from "./_core/notification";
import {
  sendNewRequestEmail,
  sendStatusUpdateEmail,
  sendInquiryConfirmationEmail,
} from "./email";

// إنشاء إجراء محمي للمشرفين فقط
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "صلاحيات غير كافية. هذا الإجراء مقتصر على المشرفين فقط.",
    });
  }
  return next({ ctx });
});

// مخطط التحقق من بيانات الطلب الجديد
const createRequestSchema = z.object({
  requestNumber: z.string().min(1, "رقم الطلب مطلوب"),
  identityNumber: z.string().min(1, "رقم الهوية مطلوب"),
  fullName: z.string().min(1, "الاسم الكامل مطلوب"),
  gender: z.enum(["ذكر", "أنثى"]),
  phoneNumber: z.string().min(1, "رقم الهاتف مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  residencyNumber: z.string().optional(),
  age: z.number().int().positive().optional(),
  nationality: z.string().min(1, "الجنسية مطلوبة"),
  requestedAmount: z.number().int().positive("القيمة المطلوبة يجب أن تكون موجبة"),
  approvedAmount: z.number().int().positive().optional(),
  submissionDate: z.date(),
  disbursementDate: z.date().optional(),
  transactionNumber: z.string().optional(),
  fundingAmount: z.number().int().nonnegative().optional(),
  monthlyInstallment: z.number().int().nonnegative().optional(),
  fundingDuration: z.number().int().nonnegative().optional(),
  financialFile: z.string().optional(),
  approvalFees: z.number().int().nonnegative().optional(),
  arrears: z.number().int().nonnegative().optional(),
  totalAmount: z.number().int().nonnegative().optional(),
  status: z.enum(["pending", "approved", "rejected", "completed"]).default("pending"),
  notes: z.string().optional(),
});

// مخطط التحقق من البحث عن الطلب
const inquireRequestSchema = z.object({
  identityNumber: z.string().min(1, "رقم الهوية مطلوب"),
  requestNumber: z.string().min(1, "رقم الطلب مطلوب"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // API endpoints لإدارة الطلبات
  requests: router({
    /**
     * الحصول على جميع الطلبات (للمشرفين فقط)
     */
    list: adminProcedure
      .input(
        z.object({
          search: z.string().optional(),
          status: z.string().optional(),
          limit: z.number().int().positive().default(10),
          offset: z.number().int().nonnegative().default(0),
        })
      )
      .query(async ({ input }) => {
        const allRequests = await getAllRequests({
          search: input.search,
          status: input.status,
          limit: input.limit,
          offset: input.offset,
        });
        return allRequests;
      }),

    /**
     * إضافة طلب جديد (للمشرفين فقط)
     */
    create: adminProcedure
      .input(createRequestSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          await createRequest({
            ...input,
            createdBy: ctx.user.id,
          });

          // إرسال إشعار لصاحب الموقع
          await notifyOwner({
            title: "طلب جديد تم إضافته",
            content: `تم إضافة طلب جديد برقم ${input.requestNumber} للمستفيد ${input.fullName}`,
          });

          // إرسال بريد إلكتروني للمستفيد
          await sendNewRequestEmail(
            input.email,
            input.fullName,
            input.requestNumber,
            input.requestedAmount,
            input.submissionDate
          );

          return { success: true, message: "تم إضافة الطلب بنجاح" };
        } catch (error) {
          console.error("Error creating request:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "حدث خطأ أثناء إضافة الطلب",
          });
        }
      }),

    /**
     * تحديث طلب (للمشرفين فقط)
     */
    update: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          data: createRequestSchema.partial(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // الحصول على بيانات الطلب القديمة
          const allRequests = await getAllRequests({ limit: 1000, offset: 0 });
          const oldRequest = allRequests.find((r: any) => r.id === input.id);

          await updateRequest(input.id, input.data);

          // إرسال بريد إلكتروني إذا تغيرت الحالة
          if (oldRequest && input.data.status && oldRequest.status !== input.data.status) {
            await sendStatusUpdateEmail(
              oldRequest.email,
              oldRequest.fullName,
              oldRequest.requestNumber,
              oldRequest.status,
              input.data.status,
              input.data.approvedAmount
            );
          }

          return { success: true, message: "تم تحديث الطلب بنجاح" };
        } catch (error) {
          console.error("Error updating request:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "حدث خطأ أثناء تحديث الطلب",
          });
        }
      }),

    /**
     * حذف طلب (للمشرفين فقط)
     */
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        try {
          await deleteRequest(input.id);
          return { success: true, message: "تم حذف الطلب بنجاح" };
        } catch (error) {
          console.error("Error deleting request:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "حدث خطأ أثناء حذف الطلب",
          });
        }
      }),

    /**
     * البحث عن طلب برقم الهوية ورقم الطلب (عام)
     */
    inquire: publicProcedure
      .input(inquireRequestSchema)
      .query(async ({ input, ctx }) => {
        try {
          const request = await getRequestByIdentityAndNumber(
            input.identityNumber,
            input.requestNumber
          );

          if (!request) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "لم يتم العثور على الطلب. تأكد من رقم الهوية ورقم الطلب",
            });
          }

          // تسجيل الاستعلام
          const ipAddress = (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0] || ctx.req.socket?.remoteAddress;
          await logInquiry({
            identityNumber: input.identityNumber,
            requestNumber: input.requestNumber,
            ipAddress: ipAddress || undefined,
          });

          // إرسال إشعار لصاحب الموقع
          await notifyOwner({
            title: "استعلام عن حالة طلب",
            content: `تم الاستعلام عن حالة الطلب رقم ${input.requestNumber} برقم هوية ${input.identityNumber}`,
          });

          // إرسال بريد تأكيد الاستعلام
          await sendInquiryConfirmationEmail(
            request.email,
            request.fullName,
            request.requestNumber,
            new Date()
          );

          return request;
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          console.error("Error inquiring request:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "حدث خطأ أثناء البحث عن الطلب",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
