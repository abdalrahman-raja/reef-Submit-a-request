/**
 * ResultCard Component
 * Displays animated success result with staggered animations
 * Features: Slide-in animations, scale effects, smooth transitions
 */

interface ResultCardProps {
  name: string;
  id: string;
  status: string;
  statusColor: string;
  date: string;
  program: string;
  onReset: () => void;
}

export default function ResultCard({
  name,
  id,
  status,
  statusColor,
  date,
  program,
  onReset,
}: ResultCardProps) {
  const resultItems = [
    { label: "اسم مقدم الطلب", value: name, icon: "fas fa-user" },
    { label: "رقم الطلب", value: id, icon: "fas fa-file-alt" },
    { label: "البرنامج", value: program, icon: "fas fa-home" },
    { label: "تاريخ التقديم", value: date, icon: "fas fa-calendar" },
  ];

  return (
    <div
      style={{
        animation: "fadeIn 0.4s ease-in",
      }}
    >
      {/* Success Alert */}
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
          animation: "slideInDown 0.5s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "1.5rem",
            height: "1.5rem",
            borderRadius: "50%",
            backgroundColor: "#059669",
            animation: "scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <i
            className="fas fa-check"
            style={{
              color: "#fff",
              fontSize: "0.875rem",
            }}
          />
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              color: "#059669",
              fontSize: "1rem",
              fontFamily: "'Tajawal', Arial, sans-serif",
            }}
          >
            تم العثور على الطلب
          </p>
          <p
            style={{
              margin: 0,
              color: "#4a5568",
              fontSize: "0.875rem",
              fontFamily: "'Tajawal', Arial, sans-serif",
            }}
          >
            فيما يلي تفاصيل طلبك
          </p>
        </div>
      </div>

      {/* Result Items with Staggered Animation */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {resultItems.map(({ label, value, icon }, index) => (
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
              animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor =
                "rgba(248,249,250,0.8)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateX(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor =
                "rgba(248,249,250,0.5)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
            }}
          >
            <span
              style={{
                color: "#4a5568",
                fontSize: "0.9rem",
                fontFamily: "'Tajawal', Arial, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <i className={icon} style={{ color: "#006838" }} />
              {label}
            </span>
            <span
              style={{
                color: "#1a1a1a",
                fontWeight: 600,
                fontSize: "0.9rem",
                fontFamily: "'Tajawal', Arial, sans-serif",
              }}
            >
              {value}
            </span>
          </div>
        ))}

        {/* Status Badge with Pulse */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.875rem 1rem",
            backgroundColor: "rgba(248,249,250,0.5)",
            borderRadius: "8px",
            border: "1px solid rgba(0,0,0,0.05)",
            animation: "slideInUp 0.5s ease-out 0.4s both",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor =
              "rgba(248,249,250,0.8)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor =
              "rgba(248,249,250,0.5)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
          }}
        >
          <span
            style={{
              color: "#4a5568",
              fontSize: "0.9rem",
              fontFamily: "'Tajawal', Arial, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <i className="fas fa-info-circle" style={{ color: "#006838" }} />
            حالة الطلب
          </span>
          <span
            style={{
              color: statusColor,
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
                backgroundColor: statusColor,
                display: "inline-block",
                animation: "pulse-status 2s infinite",
              }}
            />
            {status}
          </span>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
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
          animation: "slideInUp 0.5s ease-out 0.5s both",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#006838";
          (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 15px rgba(0,104,56,0.3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#006838";
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >
        <i className="fas fa-redo" />
        <span>استعلام جديد</span>
      </button>

      <style>{`
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-status {
          0% {
            box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.4);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(217, 119, 6, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(217, 119, 6, 0);
          }
        }
      `}</style>
    </div>
  );
}
