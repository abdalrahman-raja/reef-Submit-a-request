/**
 * Saudi Reef Header Component
 * Design: Sticky header with beige/cream background (#f3f3eb)
 * Features: Logo on right, green bottom strip
 */

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663553171017/EjJaz2q7k3FEppekewwWj6/logo_25d1e07c.png";

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        backgroundColor: "#f3f3eb",
        direction: "rtl",
      }}
    >
      <div style={{ position: "relative", width: "100%", transition: "all 0.3s ease" }}>
        {/* Top strip */}
        <div style={{ height: "4px", backgroundColor: "#f3f3eb", width: "100%" }} />

        {/* Main header */}
        <div
          style={{
            backgroundColor: "#f3f3eb",
            padding: "15px 0",
            position: "relative",
            direction: "rtl",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              direction: "rtl",
            }}
          >
            {/* Logo */}
            <div>
              <a href="/">
                <img
                  src={LOGO_URL}
                  alt="ريف السعودية - Saudi Reef"
                  style={{ height: "56px", width: "auto", display: "block" }}
                />
              </a>
            </div>
          </div>
        </div>

        {/* White strip */}
        <div style={{ height: "2px", backgroundColor: "#fff" }} />
        {/* Green strip */}
        <div style={{ height: "6px", backgroundColor: "#006838" }} />
      </div>
    </header>
  );
}
