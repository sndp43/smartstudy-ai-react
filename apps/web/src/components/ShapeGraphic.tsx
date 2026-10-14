import React from "react";

interface ShapeGraphicProps {
  shape: string;
  size?: number;
  className?: string;
  showVertices?: boolean;
}

export const ShapeGraphic: React.FC<ShapeGraphicProps> = ({
  shape,
  size = 180,
  className = "",
  showVertices = true,
}) => {
  const norm = shape.toLowerCase().trim();

  // Color theme per shape family
  const renderSvgContent = () => {
    switch (true) {
      case norm.includes("circle"):
        return (
          <>
            <defs>
              <radialGradient id="circleGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="60%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0e7490" />
              </radialGradient>
              <filter id="shapeShadow" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0891b2" floodOpacity="0.35" />
              </filter>
            </defs>
            <circle cx="100" cy="100" r="75" fill="url(#circleGrad)" filter="url(#shapeShadow)" stroke="#ffffff" strokeWidth="4" />
            <circle cx="75" cy="75" r="12" fill="#ffffff" opacity="0.35" />
          </>
        );

      case norm.includes("square"):
        return (
          <>
            <defs>
              <linearGradient id="squareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <rect x="35" y="35" width="130" height="130" rx="14" fill="url(#squareGrad)" stroke="#ffffff" strokeWidth="4" />
            {showVertices && (
              <>
                <circle cx="35" cy="35" r="6" fill="#fef08a" stroke="#065f46" strokeWidth="2" />
                <circle cx="165" cy="35" r="6" fill="#fef08a" stroke="#065f46" strokeWidth="2" />
                <circle cx="165" cy="165" r="6" fill="#fef08a" stroke="#065f46" strokeWidth="2" />
                <circle cx="35" cy="165" r="6" fill="#fef08a" stroke="#065f46" strokeWidth="2" />
              </>
            )}
          </>
        );

      case norm.includes("triangle"):
        return (
          <>
            <defs>
              <linearGradient id="triangleGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
            <polygon points="100,25 175,165 25,165" fill="url(#triangleGrad)" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
            {showVertices && (
              <>
                <circle cx="100" cy="25" r="6" fill="#fde047" stroke="#9f1239" strokeWidth="2" />
                <circle cx="175" cy="165" r="6" fill="#fde047" stroke="#9f1239" strokeWidth="2" />
                <circle cx="25" cy="165" r="6" fill="#fde047" stroke="#9f1239" strokeWidth="2" />
              </>
            )}
          </>
        );

      case norm.includes("rectangle"):
        return (
          <>
            <defs>
              <linearGradient id="rectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            <rect x="25" y="55" width="150" height="90" rx="12" fill="url(#rectGrad)" stroke="#ffffff" strokeWidth="4" />
            {showVertices && (
              <>
                <circle cx="25" cy="55" r="5" fill="#fef08a" stroke="#0369a1" strokeWidth="2" />
                <circle cx="175" cy="55" r="5" fill="#fef08a" stroke="#0369a1" strokeWidth="2" />
                <circle cx="175" cy="145" r="5" fill="#fef08a" stroke="#0369a1" strokeWidth="2" />
                <circle cx="25" cy="145" r="5" fill="#fef08a" stroke="#0369a1" strokeWidth="2" />
              </>
            )}
          </>
        );

      case norm.includes("hexagon"):
        return (
          <>
            <defs>
              <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            {/* Hexagon points: (100,25), (165,62), (165,138), (100,175), (35,138), (35,62) */}
            <polygon points="100,25 165,62 165,138 100,175 35,138 35,62" fill="url(#hexGrad)" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
            {/* Inner honeycomb decorative grid */}
            <polygon points="100,50 142,75 142,125 100,150 58,125 58,75" fill="none" stroke="#fef3c7" strokeWidth="2" opacity="0.6" strokeDasharray="3 3" />
            {showVertices && (
              <>
                <circle cx="100" cy="25" r="6" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
                <circle cx="165" cy="62" r="6" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
                <circle cx="165" cy="138" r="6" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
                <circle cx="100" cy="175" r="6" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
                <circle cx="35" cy="138" r="6" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
                <circle cx="35" cy="62" r="6" fill="#ffffff" stroke="#b45309" strokeWidth="2" />
              </>
            )}
          </>
        );

      case norm.includes("octagon"):
        return (
          <>
            <defs>
              <linearGradient id="octGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            {/* 8 points: (60,25), (140,25), (175,60), (175,140), (140,175), (60,175), (25,140), (25,60) */}
            <polygon points="60,25 140,25 175,60 175,140 140,175 60,175 25,140 25,60" fill="url(#octGrad)" stroke="#ffffff" strokeWidth="5" strokeLinejoin="round" />
            {/* Inner white stop sign border */}
            <polygon points="63,33 137,33 167,63 167,137 137,167 63,167 33,137 33,63" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
            <text x="100" y="108" fill="#ffffff" fontSize="22" fontWeight="900" textAnchor="middle" letterSpacing="1" fontFamily="sans-serif">8 SIDES</text>
            {showVertices && (
              <>
                <circle cx="60" cy="25" r="5" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1.5" />
                <circle cx="140" cy="25" r="5" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1.5" />
                <circle cx="175" cy="60" r="5" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1.5" />
                <circle cx="175" cy="140" r="5" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1.5" />
                <circle cx="140" cy="175" r="5" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1.5" />
                <circle cx="60" cy="175" r="5" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1.5" />
                <circle cx="25" cy="140" r="5" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1.5" />
                <circle cx="25" cy="60" r="5" fill="#fef08a" stroke="#7f1d1d" strokeWidth="1.5" />
              </>
            )}
          </>
        );

      case norm.includes("pentagon"):
        return (
          <>
            <defs>
              <linearGradient id="pentaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            {/* 5 points: (100,25), (175,80), (145,170), (55,170), (25,80) */}
            <polygon points="100,25 175,80 145,170 55,170 25,80" fill="url(#pentaGrad)" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
            {showVertices && (
              <>
                <circle cx="100" cy="25" r="6" fill="#fef08a" stroke="#312e81" strokeWidth="2" />
                <circle cx="175" cy="80" r="6" fill="#fef08a" stroke="#312e81" strokeWidth="2" />
                <circle cx="145" cy="170" r="6" fill="#fef08a" stroke="#312e81" strokeWidth="2" />
                <circle cx="55" cy="170" r="6" fill="#fef08a" stroke="#312e81" strokeWidth="2" />
                <circle cx="25" cy="80" r="6" fill="#fef08a" stroke="#312e81" strokeWidth="2" />
              </>
            )}
          </>
        );

      case norm.includes("oval"):
        return (
          <>
            <defs>
              <radialGradient id="ovalGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="70%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c2410c" />
              </radialGradient>
            </defs>
            <ellipse cx="100" cy="100" rx="80" ry="55" fill="url(#ovalGrad)" stroke="#ffffff" strokeWidth="4" />
            <ellipse cx="78" cy="80" rx="16" ry="10" fill="#ffffff" opacity="0.4" />
          </>
        );

      case norm.includes("star"):
        return (
          <>
            <defs>
              <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
            {/* 5-pointed star */}
            <polygon points="100,20 123,73 181,73 134,107 152,162 100,128 48,162 66,107 19,73 77,73" fill="url(#starGrad)" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
            <circle cx="100" cy="100" r="10" fill="#ffffff" opacity="0.4" />
          </>
        );

      case norm.includes("heart"):
        return (
          <>
            <defs>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
            </defs>
            <path
              d="M100,165 C50,130 25,95 25,65 C25,40 45,25 70,25 C85,25 96,35 100,45 C104,35 115,25 130,25 C155,25 175,40 175,65 C175,95 150,130 100,165 Z"
              fill="url(#heartGrad)"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="65" cy="50" r="8" fill="#ffffff" opacity="0.35" />
          </>
        );

      case norm.includes("diamond") || norm.includes("rhombus"):
        return (
          <>
            <defs>
              <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
            </defs>
            <polygon points="100,25 175,100 100,175 25,100" fill="url(#diamondGrad)" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
            {showVertices && (
              <>
                <circle cx="100" cy="25" r="6" fill="#fef08a" stroke="#581c87" strokeWidth="2" />
                <circle cx="175" cy="100" r="6" fill="#fef08a" stroke="#581c87" strokeWidth="2" />
                <circle cx="100" cy="175" r="6" fill="#fef08a" stroke="#581c87" strokeWidth="2" />
                <circle cx="25" cy="100" r="6" fill="#fef08a" stroke="#581c87" strokeWidth="2" />
              </>
            )}
          </>
        );

      case norm.includes("trapezoid") || norm.includes("trapezium"):
        return (
          <>
            <defs>
              <linearGradient id="trapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0f766e" />
              </linearGradient>
            </defs>
            <polygon points="55,45 145,45 180,155 20,155" fill="url(#trapGrad)" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
            {showVertices && (
              <>
                <circle cx="55" cy="45" r="6" fill="#fef08a" stroke="#134e4a" strokeWidth="2" />
                <circle cx="145" cy="45" r="6" fill="#fef08a" stroke="#134e4a" strokeWidth="2" />
                <circle cx="180" cy="155" r="6" fill="#fef08a" stroke="#134e4a" strokeWidth="2" />
                <circle cx="20" cy="155" r="6" fill="#fef08a" stroke="#134e4a" strokeWidth="2" />
              </>
            )}
          </>
        );

      case norm.includes("crescent"):
        return (
          <>
            <defs>
              <linearGradient id="crescGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>
            <path
              d="M135,30 A75,75 0 1,0 135,170 A60,60 0 1,1 135,30 Z"
              fill="url(#crescGrad)"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </>
        );

      case norm.includes("semicircle"):
        return (
          <>
            <defs>
              <linearGradient id="semiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
            <path d="M25,140 A75,75 0 0,1 175,140 Z" fill="url(#semiGrad)" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
            {showVertices && (
              <>
                <circle cx="25" cy="140" r="6" fill="#fef08a" stroke="#831843" strokeWidth="2" />
                <circle cx="175" cy="140" r="6" fill="#fef08a" stroke="#831843" strokeWidth="2" />
              </>
            )}
          </>
        );

      // --- 3D Geometric Solids ---
      case norm.includes("cylinder"):
        return (
          <>
            <defs>
              <linearGradient id="cylBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="45%" stopColor="#c7d2fe" />
                <stop offset="75%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
              <linearGradient id="cylTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#a5b4fc" />
              </linearGradient>
            </defs>
            {/* Cylinder body */}
            <path d="M45,55 L45,145 A55,22 0 0,0 155,145 L155,55 Z" fill="url(#cylBodyGrad)" stroke="#ffffff" strokeWidth="3.5" />
            {/* Cylinder base curve */}
            <ellipse cx="100" cy="145" rx="55" ry="22" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="5 5" opacity="0.7" />
            {/* Cylinder top face */}
            <ellipse cx="100" cy="55" rx="55" ry="22" fill="url(#cylTopGrad)" stroke="#ffffff" strokeWidth="4" />
            <text x="100" y="105" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">3D SOLID</text>
          </>
        );

      case norm.includes("sphere"):
        return (
          <>
            <defs>
              <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#60a5fa" />
                <stop offset="70%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="70" fill="url(#sphereGrad)" stroke="#ffffff" strokeWidth="4" />
            {/* Equator latitude line to show 3D sphere curvature */}
            <ellipse cx="100" cy="100" rx="70" ry="22" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
            <text x="100" y="105" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.9">SPHERE</text>
          </>
        );

      case norm.includes("cube"):
        return (
          <>
            <defs>
              <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
              <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
              <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            {/* Top Face: (100,30), (160,65), (100,100), (40,65) */}
            <polygon points="100,30 160,65 100,100 40,65" fill="url(#cubeTop)" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
            {/* Left Face: (40,65), (100,100), (100,170), (40,135) */}
            <polygon points="40,65 100,100 100,170 40,135" fill="url(#cubeLeft)" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
            {/* Right Face: (100,100), (160,65), (160,135), (100,170) */}
            <polygon points="100,100 160,65 160,135 100,170" fill="url(#cubeRight)" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
            {showVertices && (
              <>
                <circle cx="100" cy="30" r="5" fill="#fef08a" stroke="#7c2d12" strokeWidth="1.5" />
                <circle cx="160" cy="65" r="5" fill="#fef08a" stroke="#7c2d12" strokeWidth="1.5" />
                <circle cx="40" cy="65" r="5" fill="#fef08a" stroke="#7c2d12" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="5" fill="#fef08a" stroke="#7c2d12" strokeWidth="1.5" />
                <circle cx="160" cy="135" r="5" fill="#fef08a" stroke="#7c2d12" strokeWidth="1.5" />
                <circle cx="40" cy="135" r="5" fill="#fef08a" stroke="#7c2d12" strokeWidth="1.5" />
                <circle cx="100" cy="170" r="5" fill="#fef08a" stroke="#7c2d12" strokeWidth="1.5" />
              </>
            )}
          </>
        );

      case norm.includes("cone"):
        return (
          <>
            <defs>
              <linearGradient id="coneBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
              <linearGradient id="coneBase" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#be185d" />
              </linearGradient>
            </defs>
            {/* Cone sides */}
            <path d="M100,25 L35,145 A65,22 0 0,0 165,145 Z" fill="url(#coneBody)" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
            {/* Cone base ellipse */}
            <ellipse cx="100" cy="145" rx="65" ry="22" fill="url(#coneBase)" stroke="#ffffff" strokeWidth="3.5" />
            {showVertices && (
              <circle cx="100" cy="25" r="6" fill="#fef08a" stroke="#831843" strokeWidth="2" />
            )}
            <text x="100" y="115" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">CONE</text>
          </>
        );

      case norm.includes("pyramid"):
        return (
          <>
            <defs>
              <linearGradient id="pyrLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="pyrRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
            </defs>
            {/* Left face */}
            <polygon points="100,25 30,145 105,165" fill="url(#pyrLeft)" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
            {/* Right face */}
            <polygon points="100,25 105,165 175,135" fill="url(#pyrRight)" stroke="#ffffff" strokeWidth="3.5" strokeLinejoin="round" />
            {showVertices && (
              <>
                <circle cx="100" cy="25" r="6" fill="#ffffff" stroke="#713f12" strokeWidth="2" />
                <circle cx="30" cy="145" r="5" fill="#ffffff" stroke="#713f12" strokeWidth="1.5" />
                <circle cx="105" cy="165" r="5" fill="#ffffff" stroke="#713f12" strokeWidth="1.5" />
                <circle cx="175" cy="135" r="5" fill="#ffffff" stroke="#713f12" strokeWidth="1.5" />
              </>
            )}
          </>
        );

      default:
        return (
          <>
            <circle cx="100" cy="100" r="70" fill="#3b82f6" stroke="#ffffff" strokeWidth="4" />
            <text x="100" y="108" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">SHAPE</text>
          </>
        );
    }
  };

  return (
    <div className={`shape-graphic-container ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        className="shape-vector-svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${shape} visual illustration`}
      >
        {renderSvgContent()}
      </svg>
    </div>
  );
};

export default ShapeGraphic;
