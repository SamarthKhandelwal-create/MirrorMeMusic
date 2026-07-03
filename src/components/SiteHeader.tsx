import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { GuestButton } from "@/components/GuestButton";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Home", href: "/" },
  { label: "Library", href: "/case-study" },
  { label: "AI Strategist", href: "/roadmap" },
];

export function SiteHeader({
  active,
  user,
}: {
  active?: string;
  user?: {
    email: string;
    displayName: string | null;
    avatarUrl?: string | null;
    isGuest?: boolean;
  } | null;
}) {
  return (
    <header className="bg-surface-container-lowest/80 backdrop-blur-xl sticky top-0 w-full border-b border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 transition-all duration-700 ease-in-out">
      <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 max-w-[1200px] mx-auto">
        <Link
          href="/"
          className="font-headline-md text-headline-md text-primary tracking-tighter hover:drop-shadow-[0_0_15px_rgba(214,191,221,0.4)] transition-all"
        >
          MirrorMeMusic
        </Link>
        <nav className="hidden md:flex items-center gap-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                active === link.label
                  ? "text-primary border-b border-primary pb-1 font-label-sm text-label-sm tracking-widest uppercase hover:drop-shadow-[0_0_8px_rgba(214,191,221,0.6)] transition-all duration-500"
                  : "text-on-surface-variant hover:text-primary transition-colors duration-500 font-label-sm text-label-sm tracking-widest uppercase hover:drop-shadow-[0_0_8px_rgba(214,191,221,0.6)]"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.isGuest && (
                <Link
                  href="/signup"
                  className="hidden sm:inline text-tertiary hover:text-primary transition-colors duration-500 font-label-sm text-label-sm uppercase tracking-widest border border-tertiary/30 rounded-full px-4 py-2 hover:bg-tertiary/10 press-scale"
                >
                  Save Progress
                </Link>
              )}
              <Link
                href="/about"
                className="text-primary hover:text-primary hover:drop-shadow-[0_0_8px_rgba(214,191,221,0.6)] transition-all duration-500 flex items-center gap-2"
                aria-label="About MirrorMeMusic"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {user.isGuest ? "visibility" : "account_circle"}
                  </span>
                )}
                <span className="hidden lg:inline font-label-sm text-label-sm uppercase tracking-widest">
                  {user.isGuest ? "Guest" : user.displayName || user.email.split("@")[0]}
                </span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <GuestButton className="hidden sm:inline text-on-surface-variant hover:text-primary transition-colors duration-500 font-label-sm text-label-sm uppercase tracking-widest">
                Continue as Guest
              </GuestButton>
              <Link
                href="/login"
                className="text-primary hover:text-primary hover:drop-shadow-[0_0_8px_rgba(214,191,221,0.6)] transition-all duration-500 font-label-sm text-label-sm uppercase tracking-widest border border-primary/30 rounded-full px-4 py-2 hover:bg-primary/10 press-scale"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
