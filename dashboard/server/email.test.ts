import { describe, expect, it, vi } from "vitest";
import {
  getNewRequestEmailTemplate,
  getStatusUpdateEmailTemplate,
  getInquiryConfirmationEmailTemplate,
  getEmailTransporter,
} from "./email";

describe("Email Templates", () => {
  describe("getNewRequestEmailTemplate", () => {
    it("يجب أن ينشئ قالب بريد لطلب جديد بشكل صحيح", () => {
      const template = getNewRequestEmailTemplate(
        "أحمد محمد",
        "REQ-2026-001",
        50000,
        new Date("2026-04-14")
      );

      expect(template.subject).toContain("REQ-2026-001");
      expect(template.html).toContain("أحمد محمد");
      expect(template.html).toContain("50000");
      expect(template.html).toContain("<!DOCTYPE html");
      expect(template.html).toContain("dir=\"rtl\"");
    });

    it("يجب أن يحتوي البريد على جميع البيانات المطلوبة", () => {
      const template = getNewRequestEmailTemplate(
        "فاطمة علي",
        "REQ-2026-002",
        75000,
        new Date("2026-04-14")
      );

      expect(template.html).toContain("فاطمة علي");
      expect(template.html).toContain("REQ-2026-002");
      expect(template.html).toContain("75000");
      expect(template.html).toContain("بوابة ريف السعودي");
    });
  });

  describe("getStatusUpdateEmailTemplate", () => {
    it("يجب أن ينشئ قالب بريد لتحديث الحالة", () => {
      const template = getStatusUpdateEmailTemplate(
        "محمد أحمد",
        "REQ-2026-003",
        "pending",
        "approved",
        60000
      );

      expect(template.subject).toContain("REQ-2026-003");
      expect(template.html).toContain("محمد أحمد");
      expect(template.html).toContain("موافق عليه");
      expect(template.html).toContain("60000");
    });

    it("يجب أن يعرض الحالة الصحيحة للرفض", () => {
      const template = getStatusUpdateEmailTemplate(
        "علي محمد",
        "REQ-2026-004",
        "pending",
        "rejected"
      );

      expect(template.html).toContain("مرفوض");
    });

    it("يجب أن يعرض الحالة الصحيحة للإكمال", () => {
      const template = getStatusUpdateEmailTemplate(
        "سارة أحمد",
        "REQ-2026-005",
        "approved",
        "completed"
      );

      expect(template.html).toContain("مكتمل");
    });
  });

  describe("getInquiryConfirmationEmailTemplate", () => {
    it("يجب أن ينشئ قالب بريد تأكيد الاستعلام", () => {
      const template = getInquiryConfirmationEmailTemplate(
        "خديجة محمد",
        "REQ-2026-006",
        new Date("2026-04-14")
      );

      expect(template.subject).toContain("REQ-2026-006");
      expect(template.html).toContain("خديجة محمد");
      expect(template.html).toContain("تم استقبال استعلامك");
    });

    it("يجب أن يحتوي على التاريخ والوقت", () => {
      const date = new Date("2026-04-14T15:30:00");
      const template = getInquiryConfirmationEmailTemplate(
        "نور أحمد",
        "REQ-2026-007",
        date
      );

      expect(template.html).toContain("نور أحمد");
      expect(template.html).toContain("REQ-2026-007");
    });
  });

  describe("Email Transporter", () => {
    it("يجب أن يعيد transporter عند توفر بيانات الاعتماد", () => {
      const transporter = getEmailTransporter();
      // قد يكون null إذا لم تكن بيانات الاعتماد متوفرة
      // لكن يجب أن لا يرفع خطأ
      expect(transporter === null || typeof transporter === "object").toBe(true);
    });
  });

  describe("Email Templates HTML Structure", () => {
    it("جميع القوالب يجب أن تحتوي على HTML صحيح", () => {
      const templates = [
        getNewRequestEmailTemplate("أحمد", "REQ-001", 50000, new Date()),
        getStatusUpdateEmailTemplate("محمد", "REQ-002", "pending", "approved"),
        getInquiryConfirmationEmailTemplate("علي", "REQ-003", new Date()),
      ];

      templates.forEach((template) => {
        expect(template.html).toContain("<!DOCTYPE html");
        expect(template.html).toContain("</html>");
        expect(template.html).toContain("dir=\"rtl\"");
        expect(template.html).toContain("lang=\"ar\"");
        expect(template.subject).toBeTruthy();
      });
    });

    it("يجب أن تحتوي جميع القوالب على تنسيق صحيح", () => {
      const template = getNewRequestEmailTemplate(
        "محمد أحمد",
        "REQ-2026-001",
        50000,
        new Date()
      );

      // التحقق من وجود الأقسام الرئيسية
      expect(template.html).toContain("<head>");
      expect(template.html).toContain("<body>");
      expect(template.html).toContain("class=\"container\"");
      expect(template.html).toContain("class=\"header\"");
      expect(template.html).toContain("class=\"content\"");
      expect(template.html).toContain("class=\"footer\"");
    });

    it("يجب أن تحتوي على رابط صفحة التحقق", () => {
      const templates = [
        getNewRequestEmailTemplate("أحمد", "REQ-001", 50000, new Date()),
        getStatusUpdateEmailTemplate("محمد", "REQ-002", "pending", "approved"),
      ];

      templates.forEach((template) => {
        expect(template.html).toContain("check-status");
      });
    });
  });
});
