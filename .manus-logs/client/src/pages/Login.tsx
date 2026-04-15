/**
 * Login Page - Admin Dashboard
 * Design: Green SVG background on left, white card form centered
 * Colors: Primary green #006838, header bg #f3f3eb, body bg #f8faf9
 * Font: Tajawal (Arabic)
 * Direction: RTL
 * Features: Username/Password login with remember me checkbox
 */

import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundSVG from "@/components/BackgroundSVG";

type LoginState = "idle" | "loading" | "success" | "error";

export default function Login() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginState, setLoginState] = useState<LoginState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = username.trim().length > 0 && password.length > 0;

  const validateUsername = (value: string) => {
    if (value && value.trim().length === 0) {
      setUsernameError("اسم المستخدم مطلوب");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = (value: string) => {
    if (value && value.length === 0) {
      setPasswordError("كلمة المرور مطلوبة");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoginState("loading");
    setErrorMessage("");

    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock authentication - in real app, call actual API
    if (username === "admin" && password === "password123") {
      setLoginState("success");
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("username", username);
      }
      // Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin");
      }, 800);
    } else {
      setLoginState("error");
      setErrorMessage("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  const handleReset = () => {
    setLoginState("idle");
    setUsername("");
    setPassword("");
    setRememberMe(false);
    setUsernameError("");
    setPasswordError("");
    setErrorMessage("");
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
                تسجيل الدخول
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
                أدخل بيانات حسابك للوصول إلى لوحة الإدارة
              </p>
            </div>

            {/* Login Card */}
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
              {/* Lock Icon Section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "2rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#006838",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    animation: "scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                >
                  <i className="fas fa-lock" style={{ color: "#fff", fontSize: "1.75rem" }} />
                </div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    color: "#1a1a1a",
                    fontWeight: 700,
                    fontFamily: "'Tajawal', Arial, sans-serif",
                    margin: "0 0 0.5rem",
                  }}
                >
                  مرحباً بك
                </h2>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#4a5568",
                    fontFamily: "'Tajawal', Arial, sans-serif",
                    margin: 0,
                  }}
                >
                  سجل دخولك للوصول إلى لوحة الإدارة
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "#fee2e2",
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                    animation: "slideInDown 0.5s ease-out",
                  }}
                >
                  <i className="fas fa-exclamation-circle" style={{ color: "#dc2626", fontSize: "1.25rem" }} />
                  <span
                    style={{
                      color: "#dc2626",
                      fontSize: "0.9rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {errorMessage}
                  </span>
                </div>
              )}

              {loginState !== "success" ? (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Username Field */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      htmlFor="username"
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
                      اسم المستخدم
                      <i className="fas fa-user" style={{ color: "#006838" }} />
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (e.target.value.length > 0) validateUsername(e.target.value);
                      }}
                      onBlur={() => validateUsername(username)}
                      placeholder="أدخل اسم المستخدم"
                      style={{
                        width: "100%",
                        padding: "1rem",
                        fontSize: "1rem",
                        border: `2px solid ${usernameError ? "#dc2626" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #fff, #fafbfc)",
                        color: "#1a1a1a",
                        transition: "all 0.3s ease",
                        boxShadow: usernameError ? "0 0 0 3px rgba(244,67,54,0.1)" : "0 4px 8px rgba(0,0,0,0.08)",
                        outline: "none",
                        fontFamily: "'Tajawal', Arial, sans-serif",
                        boxSizing: "border-box" as const,
                        direction: "rtl",
                        textAlign: "right" as const,
                      }}
                      onFocus={(e) => {
                        if (!usernameError) {
                          e.target.style.borderColor = "#006838";
                          e.target.style.boxShadow = "0 0 0 4px rgba(0,104,56,0.15), 0 4px 12px rgba(0,0,0,0.1)";
                          e.target.style.transform = "translateY(-1px)";
                        }
                      }}
                      onBlurCapture={(e) => {
                        if (!usernameError) {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.08)";
                          e.target.style.transform = "translateY(0)";
                        }
                      }}
                    />
                    {usernameError && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "0.5rem",
                          color: "#dc2626",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          justifyContent: "flex-end",
                        }}
                      >
                        {usernameError}
                        <i className="fas fa-exclamation-circle" />
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      htmlFor="password"
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
                      كلمة المرور
                      <i className="fas fa-key" style={{ color: "#006838" }} />
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.length > 0) validatePassword(e.target.value);
                      }}
                      onBlur={() => validatePassword(password)}
                      placeholder="أدخل كلمة المرور"
                      style={{
                        width: "100%",
                        padding: "1rem",
                        fontSize: "1rem",
                        border: `2px solid ${passwordError ? "#dc2626" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #fff, #fafbfc)",
                        color: "#1a1a1a",
                        transition: "all 0.3s ease",
                        boxShadow: passwordError ? "0 0 0 3px rgba(244,67,54,0.1)" : "0 4px 8px rgba(0,0,0,0.08)",
                        outline: "none",
                        fontFamily: "'Tajawal', Arial, sans-serif",
                        boxSizing: "border-box" as const,
                        direction: "rtl",
                        textAlign: "right" as const,
                      }}
                      onFocus={(e) => {
                        if (!passwordError) {
                          e.target.style.borderColor = "#006838";
                          e.target.style.boxShadow = "0 0 0 4px rgba(0,104,56,0.15), 0 4px 12px rgba(0,0,0,0.1)";
                          e.target.style.transform = "translateY(-1px)";
                        }
                      }}
                      onBlurCapture={(e) => {
                        if (!passwordError) {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.08)";
                          e.target.style.transform = "translateY(0)";
                        }
                      }}
                    />
                    {passwordError && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginTop: "0.5rem",
                          color: "#dc2626",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          justifyContent: "flex-end",
                        }}
                      >
                        {passwordError}
                        <i className="fas fa-exclamation-circle" />
                      </div>
                    )}
                  </div>

                  {/* Remember Me Checkbox */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "2rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <label
                      htmlFor="rememberMe"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: 500,
                        color: "#4a5568",
                        fontSize: "0.95rem",
                        fontFamily: "'Tajawal', Arial, sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      تذكرني
                    </label>
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{
                        width: "1.25rem",
                        height: "1.25rem",
                        cursor: "pointer",
                        accentColor: "#006838",
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const }}>
                    {/* Submit Button */}
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
                        cursor: !isFormValid ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        backgroundColor: "#006838",
                        color: "#fff",
                        opacity: !isFormValid ? 0.6 : 1,
                        fontFamily: "'Tajawal', Arial, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        if (isFormValid) {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005a2e";
                          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                          (e.currentTarget as HTMLButtonElement).style.boxShadow =
                            "0 4px 15px rgba(0,104,56,0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#006838";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                      }}
                    >
                      {loginState === "loading" ? (
                        <>
                          <span className="loading-spinner" />
                          <span>جاري التحقق...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt" />
                          <span>تسجيل الدخول</span>
                        </>
                      )}
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
                /* Success Message */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "2rem",
                    textAlign: "center",
                    animation: "fadeIn 0.5s ease-in",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "#f0fdf4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    <i className="fas fa-check" style={{ color: "#059669", fontSize: "1.75rem" }} />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      color: "#059669",
                      fontWeight: 700,
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      margin: 0,
                    }}
                  >
                    تم تسجيل الدخول بنجاح
                  </h3>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#4a5568",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      margin: 0,
                    }}
                  >
                    جاري التحويل إلى لوحة الإدارة...
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
