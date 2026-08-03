export function DiamondLogo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Black plate the gem is cut out of */}
      <rect width="34" height="34" rx="7" fill="#000" />

      {/* Gem silhouette: table across the top, girdle at the widest, point at the base */}
      <polygon points="10,11 24,11 31,17.5 17,31 3,17.5" fill="#9333ea" />

      {/* Table (top flat face) */}
      <polygon points="10,11 24,11 21,16 13,16" fill="#c084fc" />

      {/* Crown facets */}
      <polygon points="10,11 13,16 3,17.5" fill="#7e22ce" />
      <polygon points="24,11 31,17.5 21,16" fill="#6b21a8" />

      {/* Pavilion facets converging on the point */}
      <polygon points="3,17.5 13,16 17,31" fill="#7c3aed" />
      <polygon points="31,17.5 21,16 17,31" fill="#581c87" />
      <polygon points="13,16 21,16 17,31" fill="#8b34e8" />

      {/* Cut highlights */}
      <line x1="10" y1="11" x2="24" y2="11" stroke="rgba(243,219,250,0.85)" strokeWidth="0.9" />
      <line x1="13" y1="16" x2="21" y2="16" stroke="rgba(243,219,250,0.4)" strokeWidth="0.6" />
    </svg>
  );
}
