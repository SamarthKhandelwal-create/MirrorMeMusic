/**
 * Site mark: a black diamond mirror frame on a purple field, matching the
 * hand sketch. The band between the outer and inner diamond is filled solid
 * (via evenodd) rather than stroked, so it stays legible at favicon sizes.
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
      <rect width="34" height="34" rx="7" fill="#9333ea" />
      <path
        d="M17 3 L31 17 L17 31 L3 17 Z M17 9.6 L24.4 17 L17 24.4 L9.6 17 Z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}
