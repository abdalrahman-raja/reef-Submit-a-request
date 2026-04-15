/**
 * Saudi Reef Footer Component
 * Design: Light beige background (#f3f3eb) with green wave SVG on mobile
 */

const PHONE_ICON_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663553171017/EjJaz2q7k3FEppekewwWj6/phone-call_addee7a5.svg";
const INSTAGRAM_ICON_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663553171017/EjJaz2q7k3FEppekewwWj6/instagram_d5ba2caa.svg";
const TWITTER_ICON_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663553171017/EjJaz2q7k3FEppekewwWj6/twitter_ef72cf1c.svg";
const MOBILE_BG_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663553171017/EjJaz2q7k3FEppekewwWj6/mobile-bg_f6e39e86.png";

export default function Footer() {
  return (
    <footer className="reef-footer" style={{ backgroundColor: "#f3f3eb", direction: "rtl", fontFamily: "'Tajawal', Arial, sans-serif" }}>
      <div className="footer-desktop-layout" style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e0e0e0", paddingBottom: "15px", marginBottom: "20px" }}>
          <span style={{ color: "#333", fontSize: "16px", fontWeight: 700 }}>روابط</span>
          <span style={{ color: "#333", fontSize: "16px", fontWeight: 700 }}>اتصل بنا</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" as const }}>
            {(["اتفاقية الاستخدام", "الأسئلة الشائعة", "الشروط والأحكام"] as string[]).map((link, i) => (
              <span key={link} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {i > 0 && <span style={{ color: "#999", fontSize: "14px", margin: "0 4px" }}>|</span>}
                <a href="#" style={{ color: "#666", textDecoration: "none", fontSize: "14px", fontWeight: 400, transition: "color 0.3s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#006838"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#666"; }}>
                  {link}
                </a>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {([
              { url: PHONE_ICON_URL, label: "الهاتف" },
              { url: INSTAGRAM_ICON_URL, label: "انستغرام" },
              { url: TWITTER_ICON_URL, label: "تويتر" },
            ] as { url: string; label: string }[]).map(({ url, label }) => (
              <a key={label} href="#" aria-label={label} style={{ width: "32px", height: "35px", backgroundColor: "transparent", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all 0.3s ease" }}>
                <img src={url} alt={label} style={{ width: "32px", height: "32px", margin: "0 8px" }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-mobile-layout" style={{ position: "relative", background: `#f3f3eb url(${MOBILE_BG_URL}) no-repeat left bottom`, backgroundSize: "contain", backgroundPosition: "left bottom", padding: "20px 0 40px", minHeight: "180px" }}>
        <div style={{ position: "absolute", top: "20px", right: "20px", textAlign: "right" as const, zIndex: 3 }}>
          <h3 style={{ color: "#006838", fontSize: "18px", fontWeight: 600, margin: "0 0 15px", textAlign: "right" as const }}>اتصل بنا</h3>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            {([TWITTER_ICON_URL, INSTAGRAM_ICON_URL, PHONE_ICON_URL] as string[]).map((url, i) => (
              <a key={i} href="#" style={{ display: "flex", alignItems: "center" }}>
                <img src={url} alt="" style={{ width: "42px", height: "32px" }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" as const, padding: "15px 20px", borderTop: "1px solid #e0e0e0", backgroundColor: "#f3f3eb" }}>
        <p style={{ color: "#666", fontSize: "14px", margin: 0, fontWeight: 400 }}>جميع الحقوق محفوظة 2025م</p>
      </div>

      <style>{`
        .footer-mobile-layout { display: none !important; }
        @media (max-width: 768px) {
          .footer-desktop-layout { display: none !important; }
          .footer-mobile-layout { display: block !important; }
        }
      `}</style>
    </footer>
  );
}
