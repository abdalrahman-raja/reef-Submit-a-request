/**
 * LoadingCard Component
 * Displays animated skeleton loading state while fetching application status
 * Features: Shimmer effect, pulse animations, smooth transitions
 */

export default function LoadingCard() {
  return (
    <div
      style={{
        animation: "fadeIn 0.4s ease-in",
      }}
    >
      {/* Loading Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "#f0f9ff",
          borderRadius: "8px",
          border: "1px solid #bfdbfe",
        }}
      >
        <div
          style={{
            width: "1.5rem",
            height: "1.5rem",
            borderRadius: "50%",
            backgroundColor: "#dbeafe",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: "0.875rem",
              backgroundColor: "#dbeafe",
              borderRadius: "4px",
              animation: "shimmer 2s infinite",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              height: "0.75rem",
              backgroundColor: "#dbeafe",
              borderRadius: "4px",
              width: "70%",
              animation: "shimmer 2s infinite 0.1s",
            }}
          />
        </div>
      </div>

      {/* Loading Skeleton Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.875rem 1rem",
              backgroundColor: "rgba(248,249,250,0.5)",
              borderRadius: "8px",
              border: "1px solid rgba(0,0,0,0.05)",
              animation: `fadeIn 0.5s ease-in ${index * 0.1}s both`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
              <div
                style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "50%",
                  backgroundColor: "#e5e7eb",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              />
              <div
                style={{
                  height: "0.875rem",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "4px",
                  width: "40%",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
            <div
              style={{
                height: "0.875rem",
                backgroundColor: "#e5e7eb",
                borderRadius: "4px",
                width: "30%",
                animation: "shimmer 2s infinite 0.1s",
              }}
            />
          </div>
        ))}
      </div>

      {/* Loading Status Badge */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.875rem 1rem",
          backgroundColor: "rgba(248,249,250,0.5)",
          borderRadius: "8px",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "1rem",
              height: "1rem",
              borderRadius: "50%",
              backgroundColor: "#e5e7eb",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <div
            style={{
              height: "0.875rem",
              backgroundColor: "#e5e7eb",
              borderRadius: "4px",
              width: "60px",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#e5e7eb",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <div
            style={{
              height: "0.875rem",
              backgroundColor: "#e5e7eb",
              borderRadius: "4px",
              width: "80px",
              animation: "shimmer 2s infinite 0.1s",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% {
            background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%);
            background-size: 200% 100%;
            background-position: 200% 0;
          }
          50% {
            background-position: -200% 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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
