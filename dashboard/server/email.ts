import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

// إعدادات البريد الإلكتروني
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

// إنشاء transporter
let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter() {
  if (!transporter && emailConfig.auth.user && emailConfig.auth.pass) {
    transporter = nodemailer.createTransport(emailConfig);
  }
  return transporter;
}

/**
 * قالب بريد إضافة طلب جديد
 */
export function getNewRequestEmailTemplate(
  fullName: string,
  requestNumber: string,
  requestedAmount: number,
  submissionDate: Date
): { subject: string; html: string } {
  return {
    subject: `تم استقبال طلبك برقم ${requestNumber}`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
          .header { background: linear-gradient(135deg, #16a34a 0%, #ca8a04 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: white; padding: 30px; }
          .info-box { background-color: #f0fdf4; border-right: 4px solid #16a34a; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .info-label { color: #666; font-size: 14px; margin-bottom: 5px; }
          .info-value { color: #333; font-size: 18px; font-weight: bold; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .button { background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 تم استقبال طلبك</h1>
            <p>شكراً لتقديمك طلب التمويل</p>
          </div>
          <div class="content">
            <p>السلام عليكم ورحمة الله وبركاته</p>
            <p>السيد/السيدة: <strong>${fullName}</strong></p>
            <p>نود إعلامك بأن طلبك قد تم استقباله بنجاح. فيما يلي تفاصيل طلبك:</p>
            
            <div class="info-box">
              <div class="info-label">رقم الطلب</div>
              <div class="info-value">${requestNumber}</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">القيمة المطلوبة</div>
              <div class="info-value">${requestedAmount.toLocaleString()} ريال سعودي</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">تاريخ التقديم</div>
              <div class="info-value">${new Date(submissionDate).toLocaleDateString("ar-SA")}</div>
            </div>
            
            <p>يمكنك متابعة حالة طلبك في أي وقت من خلال <a href="https://your-domain.com/check-status" class="button">صفحة التحقق من الحالة</a></p>
            
            <p>إذا كان لديك أي استفسارات، يرجى التواصل معنا على البريد الإلكتروني أو الهاتف.</p>
            
            <p>شكراً لك</p>
          </div>
          <div class="footer">
            <p>© 2026 بوابة ريف السعودي. جميع الحقوق محفوظة.</p>
            <p>هذا البريد تم إرساله تلقائياً، يرجى عدم الرد عليه</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * قالب بريد تحديث حالة الطلب
 */
export function getStatusUpdateEmailTemplate(
  fullName: string,
  requestNumber: string,
  oldStatus: string,
  newStatus: string,
  approvedAmount?: number
): { subject: string; html: string } {
  const statusMap: Record<string, string> = {
    pending: "قيد الانتظار",
    approved: "موافق عليه",
    rejected: "مرفوض",
    completed: "مكتمل",
  };

  return {
    subject: `تحديث حالة طلبك ${requestNumber}`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
          .header { background: linear-gradient(135deg, #16a34a 0%, #ca8a04 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: white; padding: 30px; }
          .status-box { 
            background-color: ${newStatus === "approved" ? "#dcfce7" : newStatus === "rejected" ? "#fee2e2" : "#fef3c7"};
            border: 2px solid ${newStatus === "approved" ? "#16a34a" : newStatus === "rejected" ? "#dc2626" : "#ca8a04"};
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px;
            text-align: center;
          }
          .status-label { color: #666; font-size: 14px; }
          .status-value { 
            color: ${newStatus === "approved" ? "#16a34a" : newStatus === "rejected" ? "#dc2626" : "#ca8a04"};
            font-size: 24px; 
            font-weight: bold;
            margin: 10px 0;
          }
          .info-box { background-color: #f0fdf4; border-right: 4px solid #16a34a; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .info-label { color: #666; font-size: 14px; margin-bottom: 5px; }
          .info-value { color: #333; font-size: 16px; font-weight: bold; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .button { background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 تحديث حالة طلبك</h1>
          </div>
          <div class="content">
            <p>السلام عليكم ورحمة الله وبركاته</p>
            <p>السيد/السيدة: <strong>${fullName}</strong></p>
            <p>نود إعلامك بتحديث حالة طلبك:</p>
            
            <div class="status-box">
              <div class="status-label">الحالة الجديدة</div>
              <div class="status-value">${statusMap[newStatus] || newStatus}</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">رقم الطلب</div>
              <div class="info-value">${requestNumber}</div>
            </div>
            
            ${approvedAmount ? `
            <div class="info-box">
              <div class="info-label">القيمة الموافق عليها</div>
              <div class="info-value">${approvedAmount.toLocaleString()} ريال سعودي</div>
            </div>
            ` : ""}
            
            <p>يمكنك متابعة تفاصيل طلبك الكاملة من خلال <a href="https://your-domain.com/check-status" class="button">صفحة التحقق من الحالة</a></p>
            
            <p>شكراً لك على تعاملك معنا</p>
          </div>
          <div class="footer">
            <p>© 2026 بوابة ريف السعودي. جميع الحقوق محفوظة.</p>
            <p>هذا البريد تم إرساله تلقائياً، يرجى عدم الرد عليه</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * قالب بريد تأكيد البحث عن الطلب
 */
export function getInquiryConfirmationEmailTemplate(
  fullName: string,
  requestNumber: string,
  inquiryDate: Date
): { subject: string; html: string } {
  return {
    subject: `تأكيد استعلامك عن الطلب ${requestNumber}`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5; }
          .header { background: linear-gradient(135deg, #16a34a 0%, #ca8a04 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: white; padding: 30px; }
          .info-box { background-color: #f0fdf4; border-right: 4px solid #16a34a; padding: 15px; margin: 15px 0; border-radius: 4px; }
          .info-label { color: #666; font-size: 14px; margin-bottom: 5px; }
          .info-value { color: #333; font-size: 16px; font-weight: bold; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ تم استقبال استعلامك</h1>
          </div>
          <div class="content">
            <p>السلام عليكم ورحمة الله وبركاته</p>
            <p>تم استقبال استعلامك عن حالة طلبك. فيما يلي تفاصيل الاستعلام:</p>
            
            <div class="info-box">
              <div class="info-label">رقم الطلب</div>
              <div class="info-value">${requestNumber}</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">تاريخ الاستعلام</div>
              <div class="info-value">${new Date(inquiryDate).toLocaleDateString("ar-SA")} ${new Date(inquiryDate).toLocaleTimeString("ar-SA")}</div>
            </div>
            
            <p>سيتم إرسال تحديثات حالة طلبك إليك عبر البريد الإلكتروني.</p>
            
            <p>شكراً لك</p>
          </div>
          <div class="footer">
            <p>© 2026 بوابة ريف السعودي. جميع الحقوق محفوظة.</p>
            <p>هذا البريد تم إرساله تلقائياً، يرجى عدم الرد عليه</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * إرسال بريد إلكتروني
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    const transporter = getEmailTransporter();
    if (!transporter) {
      console.warn("[Email] Email transporter not configured");
      return false;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    console.log(`[Email] Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return false;
  }
}

/**
 * إرسال بريد عند إضافة طلب جديد
 */
export async function sendNewRequestEmail(
  email: string,
  fullName: string,
  requestNumber: string,
  requestedAmount: number,
  submissionDate: Date
): Promise<boolean> {
  const template = getNewRequestEmailTemplate(
    fullName,
    requestNumber,
    requestedAmount,
    submissionDate
  );
  return sendEmail(email, template.subject, template.html);
}

/**
 * إرسال بريد عند تحديث حالة الطلب
 */
export async function sendStatusUpdateEmail(
  email: string,
  fullName: string,
  requestNumber: string,
  oldStatus: string,
  newStatus: string,
  approvedAmount?: number
): Promise<boolean> {
  const template = getStatusUpdateEmailTemplate(
    fullName,
    requestNumber,
    oldStatus,
    newStatus,
    approvedAmount
  );
  return sendEmail(email, template.subject, template.html);
}

/**
 * إرسال بريد تأكيد الاستعلام
 */
export async function sendInquiryConfirmationEmail(
  email: string,
  fullName: string,
  requestNumber: string,
  inquiryDate: Date
): Promise<boolean> {
  const template = getInquiryConfirmationEmailTemplate(
    fullName,
    requestNumber,
    inquiryDate
  );
  return sendEmail(email, template.subject, template.html);
}
