export function SiteFooter() {
  return (
    <footer className="bg-surface-container-lowest w-full py-12 border-t border-white/5 relative z-10">
      <div className="flex flex-col items-center gap-6 w-full max-w-[1200px] mx-auto px-4 md:px-16">
        <div className="font-headline-sm text-headline-sm text-primary tracking-tighter opacity-80 hover:opacity-100 transition-opacity">
          MirrorMeMusic
        </div>

        <div className="font-label-sm text-label-sm text-outline uppercase tracking-widest opacity-50">
          © 2026 MirrorMeMusic
        </div>
      </div>
    </footer>
  );
}
