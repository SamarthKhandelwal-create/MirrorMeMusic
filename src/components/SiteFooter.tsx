import { DiamondLogo } from "@/components/DiamondLogo";

export function SiteFooter() {
  return (
    <footer className="bg-surface-container-lowest w-full py-12 border-t border-white/5 relative z-10">
      <div className="flex flex-col items-center gap-6 w-full max-w-[1200px] mx-auto px-4 md:px-16">
        <div className="flex items-center gap-3 font-headline-sm text-headline-sm text-primary tracking-tighter opacity-80 hover:opacity-100 transition-opacity">
          <DiamondLogo size={26} />
          MirrorMeMusic
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-2xl leading-relaxed opacity-75">
          Every song, storyline, and visual concept in <span className="italic text-primary">MIRROR</span> was
          created 100% by Joey Koury, alone.
        </p>

        <p className="font-label-sm text-label-sm text-on-surface-variant text-center tracking-wide opacity-60">
          MirrorMeMusic.com is built on Joey&apos;s passion project — <span className="italic">MIRROR</span>.
        </p>

        <div className="font-label-sm text-label-sm text-outline mt-4 uppercase tracking-widest opacity-50">
          © 2026 MirrorMeMusic
        </div>
      </div>
    </footer>
  );
}
