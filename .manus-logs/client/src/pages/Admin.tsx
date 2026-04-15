/**
 * Admin Dashboard Page
 * Design: Admin control panel with sidebar and main content area
 * Colors: Primary green #006838, header bg #f3f3eb, body bg #f8faf9
 * Font: Tajawal (Arabic)
 * Direction: RTL
 * Features: Dashboard overview with quick stats and recent applications
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddApplicationForm from "@/components/AddApplicationForm";

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

interface RecentApplication {
  id: string;
  applicantName: string;
  applicationId: string;
  status: "pending" | "approved" | "rejected";
  submissionDate: string;
}

export default function Admin() {
  const [, navigate] = useLocation();
  const [stats] = useState<DashboardStats>({
    totalApplications: 156,
    pendingApplications: 23,
    approvedApplications: 118,
    rejectedApplications: 15,
  });

  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([
    {
      id: "1",
      applicantName: "محمد أحمد العمري",
      applicationId: "APP-2024-001",
      status: "pending",
      submissionDate: "2024-03-15",
    },
    {
      id: "2",
      applicantName: "فاطمة علي السلمان",
      applicationId: "APP-2024-002",
      status: "approved",
      submissionDate: "2024-03-14",
    },
    {
      id: "3",
      applicantName: "عبدالله محمد الدوسري",
      applicationId: "APP-2024-003",
      status: "pending",
      submissionDate: "2024-03-13",
    },
    {
      id: "4",
      applicantName: "نور خالد الشهري",
      applicationId: "APP-2024-004",
      status: "rejected",
      submissionDate: "2024-03-12",
    },
    {
      id: "5",
      applicantName: "سارة يوسف الحربي",
      applicationId: "APP-2024-005",
      status: "approved",
      submissionDate: "2024-03-11",
    },
  ]);

  useEffect(() => {
    // Load applications from localStorage
    const storedApplications = JSON.parse(localStorage.getItem("applications") || "[]");
    if (storedApplications.length > 0) {
      const formattedApps = storedApplications.map((app: any) => ({
        id: app.id,
        applicantName: app.fullName,
        applicationId: app.applicationNumber,
        status: "pending",
        submissionDate: app.submissionDate,
      }));
      setRecentApplications([...recentApplications, ...formattedApps]);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#fef3c7", text: "#b45309", label: "قيد الانتظار" };
      case "approved":
        return { bg: "#dcfce7", text: "#15803d", label: "موافق عليه" };
      case "rejected":
        return { bg: "#fee2e2", text: "#dc2626", label: "مرفوض" };
      default:
        return { bg: "#f3f4f6", text: "#4b5563", label: "غير محدد" };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div
      style={{
        fontFamily: "'Tajawal', Arial, sans-serif",
        minHeight: "100vh",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8faf9",
      }}
    >
      <Header />

      <main style={{ flex: 1, padding: "2rem 1rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Page Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  color: "#006838",
                  fontWeight: 800,
                  margin: "0 0 0.5rem",
                  lineHeight: 1.2,
                }}
              >
                لوحة التحكم
              </h1>
              <p style={{ fontSize: "1rem", color: "#4a5568", margin: 0 }}>
                مرحباً بك في لوحة تحكم إدارة الطلبات
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <AddApplicationForm onApplicationAdded={() => window.location.reload()} />
              <button
                onClick={handleLogout}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#dc2626",
                color: "#fff",
                transition: "all 0.3s ease",
                fontFamily: "'Tajawal', Arial, sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#991b1b";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dc2626";
              }}
            >
              <i className="fas fa-sign-out-alt" style={{ marginLeft: "0.5rem" }} />
              تسجيل الخروج
              </button>
            </div>

          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {/* Total Applications */}
            <div
              style={{
                background: "linear-gradient(135deg, #fff, #fafbfc)",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.08)",
                animation: "slideInUp 0.6s ease-out",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "0.9rem", color: "#4a5568", margin: "0 0 0.5rem", fontWeight: 500 }}>
                    إجمالي الطلبات
                  </p>
                  <h3 style={{ fontSize: "2rem", color: "#006838", fontWeight: 800, margin: 0 }}>
                    {stats.totalApplications}
                  </h3>
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#ecfdf5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-file-alt" style={{ color: "#006838", fontSize: "1.5rem" }} />
                </div>
              </div>
            </div>

            {/* Pending Applications */}
            <div
              style={{
                background: "linear-gradient(135deg, #fff, #fafbfc)",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.08)",
                animation: "slideInUp 0.6s ease-out 0.1s both",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "0.9rem", color: "#4a5568", margin: "0 0 0.5rem", fontWeight: 500 }}>
                    قيد الانتظار
                  </p>
                  <h3 style={{ fontSize: "2rem", color: "#b45309", fontWeight: 800, margin: 0 }}>
                    {stats.pendingApplications}
                  </h3>
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#fef3c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-hourglass-half" style={{ color: "#b45309", fontSize: "1.5rem" }} />
                </div>
              </div>
            </div>

            {/* Approved Applications */}
            <div
              style={{
                background: "linear-gradient(135deg, #fff, #fafbfc)",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.08)",
                animation: "slideInUp 0.6s ease-out 0.2s both",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "0.9rem", color: "#4a5568", margin: "0 0 0.5rem", fontWeight: 500 }}>
                    موافق عليها
                  </p>
                  <h3 style={{ fontSize: "2rem", color: "#15803d", fontWeight: 800, margin: 0 }}>
                    {stats.approvedApplications}
                  </h3>
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-check-circle" style={{ color: "#15803d", fontSize: "1.5rem" }} />
                </div>
              </div>
            </div>

            {/* Rejected Applications */}
            <div
              style={{
                background: "linear-gradient(135deg, #fff, #fafbfc)",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.08)",
                animation: "slideInUp 0.6s ease-out 0.3s both",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "0.9rem", color: "#4a5568", margin: "0 0 0.5rem", fontWeight: 500 }}>
                    مرفوضة
                  </p>
                  <h3 style={{ fontSize: "2rem", color: "#dc2626", fontWeight: 800, margin: 0 }}>
                    {stats.rejectedApplications}
                  </h3>
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#fee2e2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-times-circle" style={{ color: "#dc2626", fontSize: "1.5rem" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications Table */}
          <div
            style={{
              background: "linear-gradient(135deg, #fff, #fafbfc)",
              borderRadius: "12px",
              padding: "2rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.08)",
              animation: "slideInUp 0.6s ease-out 0.4s both",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                color: "#1a1a1a",
                fontWeight: 700,
                margin: "0 0 1.5rem",
              }}
            >
              آخر الطلبات المقدمة
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "'Tajawal', Arial, sans-serif",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#4a5568",
                        fontSize: "0.9rem",
                      }}
                    >
                      اسم المتقدم
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#4a5568",
                        fontSize: "0.9rem",
                      }}
                    >
                      رقم الطلب
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#4a5568",
                        fontSize: "0.9rem",
                      }}
                    >
                      التاريخ
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#4a5568",
                        fontSize: "0.9rem",
                      }}
                    >
                      الحالة
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#4a5568",
                        fontSize: "0.9rem",
                      }}
                    >
                      الإجراء
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app, index) => {
                    const statusColor = getStatusColor(app.status);
                    return (
                      <tr
                        key={app.id}
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          animation: `slideInUp 0.6s ease-out ${0.5 + index * 0.1}s both`,
                        }}
                      >
                        <td style={{ padding: "1rem", color: "#1a1a1a", fontWeight: 500 }}>
                          {app.applicantName}
                        </td>
                        <td style={{ padding: "1rem", color: "#4a5568", fontSize: "0.9rem" }}>
                          {app.applicationId}
                        </td>
                        <td style={{ padding: "1rem", color: "#4a5568", fontSize: "0.9rem" }}>
                          {new Date(app.submissionDate).toLocaleDateString("ar-SA")}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "0.5rem 1rem",
                              borderRadius: "6px",
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                              fontSize: "0.85rem",
                              fontWeight: 600,
                            }}
                          >
                            {statusColor.label}
                          </span>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <button
                            style={{
                              padding: "0.5rem 1rem",
                              fontSize: "0.85rem",
                              border: "1px solid #006838",
                              borderRadius: "6px",
                              backgroundColor: "transparent",
                              color: "#006838",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              fontFamily: "'Tajawal', Arial, sans-serif",
                              fontWeight: 600,
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
                            عرض التفاصيل
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
