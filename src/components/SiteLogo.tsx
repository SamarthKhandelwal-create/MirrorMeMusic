import Image from "next/image";

/**
 * Site mark: the rendered purple diamond mirror.
 *
 * Sourced from logo-options/IMG_3606.png, masked to the diamond so it carries
 * real transparency — the original had a near-black backdrop baked in, which
 * would show as a dark square wherever the surrounding surface isn't the same
 * colour.
 */
export function SiteLogo({ size = 34 }: { size?: number }) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority
      className="shrink-0 select-none"
      style={{ width: size, height: size }}
    />
  );
}
