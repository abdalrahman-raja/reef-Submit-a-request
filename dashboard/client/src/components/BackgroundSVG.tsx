/**
 * Saudi Reef Background SVG Component
 * Renders the green leaf/wave shape as a fixed background
 * Matches the original layout-bg.svg from reef-4434a.web.app
 * The green shape fills the left portion of the page
 */

export default function BackgroundSVG() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#f8faf9",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMinYMin slice"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Main green background shape - fills left portion */}
        <path
          d="M0,0 H820 C820,0 760,200 680,420 C600,640 480,780 360,870 C240,960 120,1000 0,1020 Z"
          fill="#006838"
        />
        {/* Lighter green overlay for depth */}
        <path
          d="M0,0 H760 C760,0 700,180 630,380 C560,580 450,720 340,820 C230,920 110,970 0,990 Z"
          fill="#007a42"
          opacity="0.4"
        />
        {/* Decorative lines */}
        <g opacity="0.15" stroke="#e0ae25" strokeWidth="3" fill="none">
          <line x1="200" y1="900" x2="700" y2="700" />
          <line x1="150" y1="820" x2="550" y2="640" />
          <line x1="100" y1="750" x2="450" y2="590" />
          <line x1="250" y1="980" x2="800" y2="760" />
        </g>
        {/* Decorative wheat pattern */}
        <g opacity="0.08" fill="#fff">
          <path d="M350,200 L350,100 L200,160 C140,185 100,250 100,320 v250 L310,450 l-50,-22 v-25 l75,34 a180,180,0,0,0,32,-20 L240,370 v-25 l128,58 a188,188,0,0,0,21,-25 l-149,-68 v-25 l162,73 a210,210,0,0,0,13,-28 l-175,-80 v-25 l185,84 a215,215,0,0,0,6,-32 l-190,-86 v-25 l190,86 v-34 l-190,-86 l27,-12 l163,74 v-40 l-120,-54 l27,-12 l93,42 v-40 l-55,-25 l27,-12 Z" />
        </g>
      </svg>
    </div>
  );
}
