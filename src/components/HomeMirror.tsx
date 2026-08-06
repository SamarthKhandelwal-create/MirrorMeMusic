"use client";

import { useCallback, useRef, useState } from "react";
import { playShatter } from "@/lib/shatter-sound";

export function HomeMirror({ hasCrack = false }: { hasCrack?: boolean }) {
  const [shattering, setShattering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const strike = useCallback(() => {
    // Ignore re-clicks while the animation is still running.
    if (timerRef.current) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    playShatter(0.45);
    if (!reduced) setShattering(true);

    timerRef.current = setTimeout(() => {
      setShattering(false);
      timerRef.current = null;
    }, 900);
  }, []);

  return (
    <div className={`w-full max-w-[420px] mx-auto mirror-float ${shattering ? "mirror-jolt" : ""}`}>
      {/* No role="img" here: that would hide the SVG's children from assistive
          tech, making the strike control unreachable by keyboard. */}
      <svg viewBox="0 0 500 630" className="w-full h-auto" aria-label="Welcome to MirrorMeMusic">
        <defs>
          <clipPath id="glassClip">
            <ellipse cx="250" cy="360" rx="181" ry="233" />
          </clipPath>
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

        {/* Fracture overlay, clipped to the glass. crack.png is keyed out of
            the source's checkerboard backdrop and recoloured white, so it
            composites normally — no blend mode needed. The source is square and
            near-centred (centroid ~49%/54%), so it sits square on the glass. */}
        {hasCrack && (
          <g clipPath="url(#glassClip)">
            <image
              href="/mirror/crack.png"
              x="88"
              y="196"
              width="324"
              height="324"
              preserveAspectRatio="xMidYMid meet"
              className={shattering ? "mirror-crack-shatter" : "mirror-crack-anim"}
            />
            {/* Click target over the fracture. Sized to the shards, not the
                whole glass, so the rest of the mirror stays non-interactive. */}
            <circle
              cx="250"
              cy="358"
              r="118"
              fill="transparent"
              className="cursor-pointer outline-none"
              role="button"
              tabIndex={0}
              aria-label="Strike the mirror"
              onClick={strike}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  strike();
                }
              }}
            />
          </g>
        )}

        {/* Soft inner vignette so the glass reads as depth, not flat fill */}
        <ellipse
          cx="250" cy="360" rx="181" ry="233"
          fill="none" stroke="#000" strokeWidth="26" opacity="0.55"
        />

        {/* Crown boss at the apex */}
        <g transform="translate(250,111)" filter="url(#gemGlow)">
          <circle r="15" fill="url(#goldRadial)" />
          <circle r="10.5" fill="#170a26" />
          <circle r="6.5" fill="url(#goldRadial)" opacity="0.9" />
          <circle cx="-2" cy="-3" r="1.9" fill="rgba(255,240,200,0.6)" />
        </g>

        {/* Cardinal ornaments */}
        {[
          { x: 53,  y: 360, gem: "#D4A017" },
          { x: 447, y: 360, gem: "#D4A017" },
          { x: 250, y: 609, gem: "#D4A017" },
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
