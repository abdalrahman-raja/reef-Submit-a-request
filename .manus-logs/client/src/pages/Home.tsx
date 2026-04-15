/**
 * Saudi Reef - Check Status Page
 * Design: Green SVG background on left (fixed), white card form centered
 * Colors: Primary green #006838, header bg #f3f3eb, body bg #f8faf9
 * Font: Tajawal (Arabic)
 * Direction: RTL
 * Layout: The background SVG covers the full page with the green shape on the left
 */

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundSVG from "@/components/BackgroundSVG";
import LoadingCard from "@/components/LoadingCard";
import ResultCard from "@/components/ResultCard";

type FormState = "idle" | "loading" | "success" | "error";

interface ApplicationResult {
  name: string;
  id: string;
  status: string;
  statusColor: string;
  date: string;
  program: string;
}



export default function Home() {
  const [nationalId, setNationalId] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [nationalIdError, setNationalIdError] = useState("");
  const [applicationIdError, setApplicationIdError] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [result, setResult] = useState<ApplicationResult | null>(null);

  const isFormValid = nationalId.length === 10 && applicationId.trim().length > 0;

  const validateNationalId = (value: string) => {
    if (value && value.length !== 10) {
      setNationalIdError("رقم الهوية يجب أن يكون 10 أرقام");
    } else {
      setNationalIdError("");
    }
  };

  const validateApplicationId = (value: string) => {
    if (value && value.trim().length === 0) {
      setApplicationIdError("رقم الطلب مطلوب");
    } else {
      setApplicationIdError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setFormState("loading");
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setFormState("success");
    setResult({
      name: "محمد أحمد العمري",
      id: applicationId,
      status: "قيد المراجعة",
      statusColor: "#d97706",
      date: "2024-03-15",
      program: "برنامج الإسكان الميسر",
    });
  };

  const handleReset = () => {
    setFormState("idle");
    setResult(null);
    setNationalId("");
    setApplicationId("");
    setNationalIdError("");
    setApplicationIdError("");
  };

  return (
    <div
      style={{
        fontFamily: "'Tajawal', Arial, sans-serif",
        minHeight: "100vh",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: "#f8faf9",
      }}
    >
      {/* Fixed background SVG */}
      <BackgroundSVG />

      {/* Content layer */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />

        <main style={{ flex: 1, padding: "40px 20px 60px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
            {/* Page Header */}
            <div
              className="animate-fade-in"
              style={{
                textAlign: "center",
                marginBottom: "2rem",
                padding: "2rem 0 1.5rem",
                background: "rgba(248,250,249,0.7)",
                borderRadius: "12px",
              }}
            >
              <h1
                style={{
                  fontSize: "2.2rem",
                  color: "#006838",
                  fontWeight: 800,
                  fontFamily: "'Tajawal', Arial, sans-serif",
                  margin: "0 0 0.75rem",
                  lineHeight: 1.3,
                }}
              >
                تحقق من حالة الطلب
              </h1>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#4a5568",
                  fontWeight: 400,
                  fontFamily: "'Tajawal', Arial, sans-serif",
                  margin: 0,
                }}
              >
                أدخل رقم الهوية ورقم الطلب للاستعلام عن حالة طلبك
              </p>
            </div>

            {/* Form Card */}
            <div
              className="animate-scale"
              style={{
                background: "linear-gradient(135deg, #fff, #fafbfc)",
                borderRadius: "12px",
                padding: "2.5rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid rgba(0,0,0,0.08)",
                marginBottom: "1.5rem",
              }}
            >
              {formState === "loading" ? (
                <LoadingCard />
              ) : formState !== "success" ? (
                <form onSubmit={handleSubmit} noValidate>
                  {/* National ID Field */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      htmlFor="nationalId"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.75rem",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        fontSize: "1rem",
                        fontFamily: "'Tajawal', Arial, sans-serif",
                        justifyContent: "flex-end",
                      }}
                    >
                      رقم الهوية
                      <i className="fas fa-id-card" style={{ color: "#006838" }} />
                    </label>
                    <input
                      id="nationalId"
                      type="text"
                      value={nationalId}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setNationalId(val);
                        if (val.length > 0) validateNationalId(val);
                      }}
                      onBlur={() => validateNationalId(nationalId)}
                      placeholder="أدخل رقم الهوية (10 أرقام)"
                      maxLength={10}
                      style={{
                        width: "100%",
                        padding: "1rem",
                        fontSize: "1rem",
                        border: `2px solid ${nationalIdError ? "#dc2626" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #fff, #fafbfc)",
                        color: "#1a1a1a",
                        transition: "all 0.3s ease",
                        boxShadow: nationalIdError ? "0 0 0 3px rgba(244,67,54,0.1)" : "0 4px 8px rgba(0,0,0,0.08)",
                        outline: "none",
                        fontFamily: "'Tajawal', Arial, sans-serif",
                        boxSizing: "border-box" as const,
                        direction: "rtl",
                        textAlign: "right" as const,
                      }}
                      onFocus={(e) => {
                        if (!nationalIdError) {
                          e.target.style.borderColor = "#006838";
                          e.target.style.boxShadow = "0 0 0 4px rgba(0,104,56,0.15), 0 4px 12px rgba(0,0,0,0.1)";
                          e.target.style.transform = "translateY(-1px)";
                        }
                      }}
                      onBlurCapture={(e) => {
                        if (!nationalIdError) {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.08)";
                          e.target.style.transform = "translateY(0)";
                        }
                      }}
                    />
                    {nationalIdError && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", color: "#dc2626", fontSize: "0.875rem", fontWeight: 500, justifyContent: "flex-end" }}>
                        {nationalIdError}
                        <i className="fas fa-exclamation-circle" />
                      </div>
                    )}
                  </div>

                  {/* Application ID Field */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      htmlFor="applicationId"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.75rem",
                        fontWeight: 600,
                        color: "#1a1a1a",
                        fontSize: "1rem",
                        fontFamily: "'Tajawal', Arial, sans-serif",
                        justifyContent: "flex-end",
                      }}
                    >
                      رقم الطلب
                      <i className="fas fa-file-alt" style={{ color: "#006838" }} />
                    </label>
                    <input
                      id="applicationId"
                      type="text"
                      value={applicationId}
                      onChange={(e) => {
                        setApplicationId(e.target.value);
                        if (e.target.value.length > 0) validateApplicationId(e.target.value);
                      }}
                      onBlur={() => validateApplicationId(applicationId)}
                      placeholder="أدخل رقم الطلب (مثال: APP-2024-001)"
                      style={{
                        width: "100%",
                        padding: "1rem",
                        fontSize: "1rem",
                        border: `2px solid ${applicationIdError ? "#dc2626" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #fff, #fafbfc)",
                        color: "#1a1a1a",
                        transition: "all 0.3s ease",
                        boxShadow: applicationIdError ? "0 0 0 3px rgba(244,67,54,0.1)" : "0 4px 8px rgba(0,0,0,0.08)",
                        outline: "none",
                        fontFamily: "'Tajawal', Arial, sans-serif",
                        boxSizing: "border-box" as const,
                        direction: "rtl",
                        textAlign: "right" as const,
                      }}
                      onFocus={(e) => {
                        if (!applicationIdError) {
                          e.target.style.borderColor = "#006838";
                          e.target.style.boxShadow = "0 0 0 4px rgba(0,104,56,0.15), 0 4px 12px rgba(0,0,0,0.1)";
                          e.target.style.transform = "translateY(-1px)";
                        }
                      }}
                      onBlurCapture={(e) => {
                        if (!applicationIdError) {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.08)";
                          e.target.style.transform = "translateY(0)";
                        }
                      }}
                    />
                    {applicationIdError && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", color: "#dc2626", fontSize: "0.875rem", fontWeight: 500, justifyContent: "flex-end" }}>
                        {applicationIdError}
                        <i className="fas fa-exclamation-circle" />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" as const }}>
                    {/* Submit Button - primary (right side in RTL) */}
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      style={{
                        flex: 1,
                        minWidth: "150px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "1.25rem 2.5rem",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "8px",
                        cursor: (!isFormValid) ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        textDecoration: "none",
                        minHeight: "3rem",
                        backgroundColor: "#006838",
                        color: "#fff",
                        opacity: (!isFormValid) ? 0.6 : 1,
                        fontFamily: "'Tajawal', Arial, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        if (isFormValid) {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005a2e";
                          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 15px rgba(0,104,56,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#006838";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                      }}
                    >
                      <>
                        <i className="fas fa-search" />
                        <span>تحقق من الطلب</span>
                      </>
                    </button>

                    {/* Back Button */}
                    <a
                      href="/"
                      style={{
                        flex: 1,
                        minWidth: "150px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "1.25rem 2.5rem",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        border: "2px solid #006838",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textDecoration: "none",
                        minHeight: "3rem",
                        backgroundColor: "transparent",
                        color: "#006838",
                        fontFamily: "'Tajawal', Arial, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#006838";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLAnchorElement).style.color = "#006838";
                      }}
                    >
                      <i className="fas fa-arrow-right" />
                      <span>العودة للرئيسية</span>
                    </a>
                  </div>
                </form>
              ) : (
                /* Success Result */
                <div className="animate-fade-in">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      backgroundColor: "#f0fdf4",
                      borderRadius: "8px",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <i className="fas fa-check-circle" style={{ color: "#059669", fontSize: "1.5rem" }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: "#059669", fontSize: "1rem", fontFamily: "'Tajawal', Arial, sans-serif" }}>
                        تم العثور على الطلب
                      </p>
                      <p style={{ margin: 0, color: "#4a5568", fontSize: "0.875rem", fontFamily: "'Tajawal', Arial, sans-serif" }}>
                        فيما يلي تفاصيل طلبك
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[
                      { label: "اسم مقدم الطلب", value: result!.name, icon: "fas fa-user" },
                      { label: "رقم الطلب", value: result!.id, icon: "fas fa-file-alt" },
                      { label: "البرنامج", value: result!.program, icon: "fas fa-home" },
                      { label: "تاريخ التقديم", value: result!.date, icon: "fas fa-calendar" },
                    ].map(({ label, value, icon }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.875rem 1rem",
                          backgroundColor: "rgba(248,249,250,0.5)",
                          borderRadius: "8px",
                          border: "1px solid rgba(0,0,0,0.05)",
                        }}
                      >
                        <span style={{ color: "#4a5568", fontSize: "0.9rem", fontFamily: "'Tajawal', Arial, sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <i className={icon} style={{ color: "#006838" }} />
                          {label}
                        </span>
                        <span style={{ color: "#1a1a1a", fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Tajawal', Arial, sans-serif" }}>
                          {value}
                        </span>
                      </div>
                    ))}

                    {/* Status */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.875rem 1rem",
                        backgroundColor: "rgba(248,249,250,0.5)",
                        borderRadius: "8px",
                        border: "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <span style={{ color: "#4a5568", fontSize: "0.9rem", fontFamily: "'Tajawal', Arial, sans-serif", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <i className="fas fa-info-circle" style={{ color: "#006838" }} />
                        حالة الطلب
                      </span>
                      <span
                        style={{
                          color: result!.statusColor,
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          fontFamily: "'Tajawal', Arial, sans-serif",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: result!.statusColor,
                            display: "inline-block",
                            animation: "pulse-status 2s infinite",
                          }}
                        />
                        {result!.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    style={{
                      marginTop: "1.5rem",
                      width: "100%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "1rem 2rem",
                      fontSize: "1rem",
                      fontWeight: 600,
                      border: "2px solid #006838",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backgroundColor: "transparent",
                      color: "#006838",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#006838";
                      (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "#006838";
                    }}
                  >
                    <i className="fas fa-redo" />
                    <span>استعلام جديد</span>
                  </button>
                </div>
              )}

              {/* Help Section */}
              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #e5e7eb" }}>
                <div
                  style={{
                    background: "#f8faf9",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#1a1a1a",
                      fontSize: "1rem",
                      fontWeight: 700,
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      margin: "0 0 0.75rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    كيف أجد رقم الطلب؟
                    <i className="fas fa-question-circle" style={{ color: "#006838" }} />
                  </h3>
                  <p
                    style={{
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      margin: "0 0 0.75rem",
                      textAlign: "right" as const,
                    }}
                  >
                    يمكنك العثور على رقم الطلب في:
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingRight: "1.5rem",
                      paddingLeft: 0,
                      color: "#4a5568",
                      fontSize: "0.9rem",
                      lineHeight: 1.8,
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      textAlign: "right" as const,
                    }}
                  >
                    <li>رسالة التأكيد المرسلة على بريدك الإلكتروني</li>
                    <li>رسالة التأكيد المرسلة على جوالك</li>
                    <li>إيصال التقديم الذي حصلت عليه</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
