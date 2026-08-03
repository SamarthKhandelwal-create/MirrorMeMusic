export function HomeMirror() {
  return (
    <div className="w-full max-w-[420px] mx-auto mirror-float">
      <svg viewBox="0 0 500 630" className="w-full h-auto" role="img" aria-label="Welcome to MirrorMeMusic">
        <defs>
          <radialGradient id="goldRadial" cx="170" cy="170" r="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE55C" />
            <stop offset="30%" stopColor="#D4A017" />
            <stop offset="70%" stopColor="#C8860A" />
            <stop offset="100%" stopColor="#7A5C10" />
          </radialGradient>

          <radialGradient id="mirrorDark" cx="200" cy="240" r="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1c0f30" />
            <stop offset="45%" stopColor="#0d0519" />
            <stop offset="100%" stopColor="#030106" />
          </radialGradient>

          <radialGradient id="shimmerGrad" cx="175" cy="215" r="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(214,191,221,0.16)" />
            <stop offset="45%" stopColor="rgba(152,94,208,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          <filter id="goldGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="gemGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Arc the title rides over the top of the frame */}
          <path id="mirrorTitleArc" d="M 30,360 A 220,272 0 0 1 470,360" fill="none" />
        </defs>

        {/* Ambient outer halo */}
        <ellipse
          cx="250" cy="360" rx="204" ry="256"
          fill="none" stroke="#D4A017" strokeWidth="1"
          opacity="0.25" className="mirror-frame-glow"
        />

        {/* Gold frame body */}
        <ellipse
          cx="250" cy="360" rx="197" ry="249"
          fill="url(#goldRadial)" filter="url(#goldGlow)"
          className="mirror-frame-glow"
        />

        {/* Chamfer + inner rims */}
        <ellipse cx="250" cy="360" rx="186" ry="238" fill="#241705" />
        <ellipse cx="250" cy="360" rx="183" ry="235" fill="none" stroke="#FFE55C" strokeWidth="0.9" opacity="0.5" />

        {/* Mirror glass */}
        <ellipse cx="250" cy="360" rx="181" ry="233" fill="url(#mirrorDark)" />
        <ellipse cx="250" cy="360" rx="181" ry="233" fill="url(#shimmerGrad)" className="mirror-shimmer-anim" />

        {/* Soft inner vignette so the glass reads as depth, not flat fill */}
        <ellipse
          cx="250" cy="360" rx="181" ry="233"
          fill="none" stroke="#000" strokeWidth="26" opacity="0.55"
        />

        {/* Crown jewel — purple gem at the apex */}
        <g transform="translate(250,111)" filter="url(#gemGlow)">
          <circle r="15" fill="url(#goldRadial)" />
          <circle r="10.5" fill="#170a26" />
          <polygon points="0,-7.5 6.5,0 0,7.5 -6.5,0" fill="#9333ea" />
          <polygon points="0,-7.5 6.5,0 0,0" fill="#c084fc" opacity="0.75" />
          <polygon points="0,-7.5 -6.5,0 0,0" fill="#7c3aed" opacity="0.6" />
          <circle cx="-2" cy="-3" r="1.9" fill="rgba(245,230,255,0.75)" />
        </g>

        {/* Cardinal ornaments */}
        {[
          { x: 53,  y: 360, gem: "#D4A017" },
          { x: 447, y: 360, gem: "#D4A017" },
          { x: 250, y: 609, gem: "#9333ea" },
        ].map((o) => (
          <g key={`${o.x}-${o.y}`} transform={`translate(${o.x},${o.y})`} filter="url(#gemGlow)">
            <circle r="7.5" fill="url(#goldRadial)" />
            <circle r="3.8" fill="#170a26" />
            <circle r="1.6" fill={o.gem} />
          </g>
        ))}

        {/* Curved title riding the frame's top arc */}
        <text
          style={{
            fontFamily: "var(--font-bodoni-moda), serif",
            fontSize: "27px",
            fontWeight: 600,
            letterSpacing: "0.03em",
          }}
          fill="#F0C64A"
        >
          <textPath href="#mirrorTitleArc" startOffset="50%" textAnchor="middle">
            Welcome to MirrorMeMusic
          </textPath>
        </text>
      </svg>
    </div>
  );
}
