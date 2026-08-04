/**
 * Site mark: a black double-outlined diamond (mirror) on a purple field,
 * matching the hand sketch — outer diamond with a concentric inner diamond.
 */
export function SiteLogo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="34" height="34" rx="7" fill="#6b21a8" />
      <polygon
        points="17,4 30,17 17,30 4,17"
        fill="none"
        stroke="#000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polygon
        points="17,9.5 24.5,17 17,24.5 9.5,17"
        fill="none"
        stroke="#000"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
