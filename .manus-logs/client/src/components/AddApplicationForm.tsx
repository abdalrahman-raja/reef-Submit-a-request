/**
 * Add Application Form Component
 * Used in Admin Dashboard to add new applications
 * Stores data in localStorage for retrieval in status check page
 */

import { useState } from "react";
import { toast } from "sonner";

interface ApplicationData {
  fullName: string;
  gender: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
  age: string;
  residencyCardNumber: string;
  nationality: string;
  requestedAmount: string;
  approvedAmount: string;
  submissionDate: string;
  disbursementDate: string;
  transactionNumber: string;
  applicationNumber: string;
}

interface Props {
  onApplicationAdded?: () => void;
}

export default function AddApplicationForm({ onApplicationAdded }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    nationalId: "",
    age: "",
    residencyCardNumber: "",
    nationality: "",
    requestedAmount: "",
    approvedAmount: "",
    submissionDate: "",
    disbursementDate: "",
    transactionNumber: "",
    applicationNumber: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    if (!formData.gender) newErrors.gender = "الجنس مطلوب";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "رقم الهاتف مطلوب";
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    if (!formData.nationalId.trim()) newErrors.nationalId = "رقم الهوية مطلوب";
    if (!formData.age.trim()) newErrors.age = "العمر مطلوب";
    if (!formData.nationality.trim()) newErrors.nationality = "الجنسية مطلوبة";
    if (!formData.requestedAmount.trim()) newErrors.requestedAmount = "القيمة المطلوبة مطلوبة";
    if (!formData.approvedAmount.trim()) newErrors.approvedAmount = "القيمة الموافق عليها مطلوبة";
    if (!formData.submissionDate) newErrors.submissionDate = "تاريخ التقديم مطلوب";
    if (!formData.applicationNumber.trim()) newErrors.applicationNumber = "رقم الطلب مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Get existing applications from localStorage
      const existingApplications = JSON.parse(localStorage.getItem("applications") || "[]");

      // Add new application
      const newApplication = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      existingApplications.push(newApplication);
      localStorage.setItem("applications", JSON.stringify(existingApplications));

      toast.success("تم إضافة الطلب بنجاح!");

      // Reset form
      setFormData({
        fullName: "",
        gender: "",
        phoneNumber: "",
        email: "",
        nationalId: "",
        age: "",
        residencyCardNumber: "",
        nationality: "",
        requestedAmount: "",
        approvedAmount: "",
        submissionDate: "",
        disbursementDate: "",
        transactionNumber: "",
        applicationNumber: "",
      });

      setIsOpen(false);
      onApplicationAdded?.();
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Button to open form */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          fontWeight: 600,
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          backgroundColor: "#006838",
          color: "#fff",
          transition: "all 0.3s ease",
          fontFamily: "'Tajawal', Arial, sans-serif",
          marginBottom: isOpen ? "1rem" : 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#005a2e";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#006838";
        }}
      >
        <i className="fas fa-plus" style={{ marginLeft: "0.5rem" }} />
        إضافة طلب جديد
      </button>

      {/* Form Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  color: "#006838",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                إضافة طلب جديد
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#4a5568",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                {/* Full Name */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="أدخل الاسم الكامل"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.fullName ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.fullName && <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.fullName}</span>}
                </div>

                {/* Gender */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    الجنس *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.gender ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  >
                    <option value="">اختر الجنس</option>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                  {errors.gender && <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.gender}</span>}
                </div>

                {/* Phone Number */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    رقم الهاتف المحمول *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الهاتف"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.phoneNumber ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.phoneNumber && (
                    <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.phoneNumber}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="أدخل البريد الإلكتروني"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.email ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.email && <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.email}</span>}
                </div>

                {/* National ID */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    رقم الهوية *
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الهوية"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.nationalId ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.nationalId && (
                    <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.nationalId}</span>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    العمر *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="أدخل العمر"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.age ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.age && <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.age}</span>}
                </div>

                {/* Residency Card Number */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    رقم بطاقة المقيم
                  </label>
                  <input
                    type="text"
                    name="residencyCardNumber"
                    value={formData.residencyCardNumber}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم بطاقة المقيم"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    الجنسية *
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="أدخل الجنسية"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.nationality ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.nationality && (
                    <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.nationality}</span>
                  )}
                </div>

                {/* Requested Amount */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    القيمة المطلوبة *
                  </label>
                  <input
                    type="number"
                    name="requestedAmount"
                    value={formData.requestedAmount}
                    onChange={handleInputChange}
                    placeholder="أدخل القيمة المطلوبة"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.requestedAmount ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.requestedAmount && (
                    <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.requestedAmount}</span>
                  )}
                </div>

                {/* Approved Amount */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    القيمة الموافق عليها *
                  </label>
                  <input
                    type="number"
                    name="approvedAmount"
                    value={formData.approvedAmount}
                    onChange={handleInputChange}
                    placeholder="أدخل القيمة الموافق عليها"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.approvedAmount ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.approvedAmount && (
                    <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.approvedAmount}</span>
                  )}
                </div>

                {/* Submission Date */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    تاريخ التقديم *
                  </label>
                  <input
                    type="date"
                    name="submissionDate"
                    value={formData.submissionDate}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.submissionDate ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.submissionDate && (
                    <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.submissionDate}</span>
                  )}
                </div>

                {/* Disbursement Date */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    تاريخ نزول المبلغ
                  </label>
                  <input
                    type="date"
                    name="disbursementDate"
                    value={formData.disbursementDate}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                </div>

                {/* Transaction Number */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    رقم العملية
                  </label>
                  <input
                    type="text"
                    name="transactionNumber"
                    value={formData.transactionNumber}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم العملية"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                </div>

                {/* Application Number */}
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, color: "#1a1a1a" }}>
                    رقم الطلب *
                  </label>
                  <input
                    type="text"
                    name="applicationNumber"
                    value={formData.applicationNumber}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الطلب"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${errors.applicationNumber ? "#dc2626" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontFamily: "'Tajawal', Arial, sans-serif",
                      boxSizing: "border-box",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                  {errors.applicationNumber && (
                    <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>{errors.applicationNumber}</span>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    color: "#4a5568",
                    transition: "all 0.3s ease",
                    fontFamily: "'Tajawal', Arial, sans-serif",
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "8px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    backgroundColor: "#006838",
                    color: "#fff",
                    transition: "all 0.3s ease",
                    fontFamily: "'Tajawal', Arial, sans-serif",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ الطلب"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
