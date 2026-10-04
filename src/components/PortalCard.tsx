"use client";

import { useState } from "react";
import Link from "next/link";

export type Portal = {
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  backTitle: string;
  backCopy: string;
  image: string;
  cta: string;
  requiresAuth: boolean;
};

/**
 * One ornate mirror that flips to reveal its link.
 *
 * On pointer devices the flip is pure CSS hover. Touch devices have no hover,
 * so the front face is a button that toggles `data-flipped`; the stylesheet
 * drives the same rotation from that attribute under `@media (hover: none)`.
 */
export function PortalCard({
  portal,
  href,
  delay,
  offset,
}: {
  portal: Portal;
  href: string;
  delay: string;
  offset: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{ animationDelay: delay }}
      className={`w-full animate-fade-up ${offset ? "mt-0 lg:mt-16" : ""}`}
    >
    <div
      data-flipped={flipped}
      className="group portal-card h-[540px] [perspective:1200px] w-full"
    >
      <div className="relative h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] preserve-3d group-hover:rotate-y-180">
        {/* Front: a button only where there's no hover, so pointer users keep
            the untouched mirror and keyboard users still reach the link on the
            back face directly. */}
        <button
          type="button"
          aria-hidden={flipped}
          tabIndex={-1}
          onClick={() => setFlipped((f) => !f)}
          className="absolute inset-0 w-full h-full backface-hidden portal-face-front ornate-frame transition-all duration-500 group-hover:-translate-y-2 text-left appearance-none"
        >
          <span className="w-full h-full mirror-surface flex flex-col items-center justify-center p-8">
            <span
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen z-0 pointer-events-none filter contrast-125 brightness-75"
              style={{ backgroundImage: `url('${portal.image}')`, opacity: 0.2, mixBlendMode: "screen" }}
            />
            <span className="relative z-10 flex flex-col items-center etched-content mirror-glow bg-black/35 backdrop-blur-[2px] rounded-2xl px-8 py-6">
              <span className="font-headline-md text-headline-md tracking-tighter mb-2 block">{portal.title}</span>
              <span className="h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent my-4 block" />
              <span className="font-label-sm text-label-sm tracking-widest uppercase mt-2 block">
                {portal.subtitle}
              </span>
            </span>
          </span>
        </button>

        <div className="absolute inset-0 backface-hidden portal-face-back rotate-y-180 bg-[#110b1c]/95 backdrop-blur-2xl border-2 border-[#1f182a] flex flex-col items-center justify-center p-10 text-center shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] overflow-hidden rounded-[50%_/_60%_60%_40%_40%]">
          {/* Tap the backdrop to flip home again. First child so it sits under
              the copy and the link, but still above the panel itself. */}
          <button
            type="button"
            aria-label={`Close ${portal.title}`}
            onClick={() => setFlipped(false)}
            className="portal-back-close absolute inset-0"
          />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary opacity-50" />
          <span className="relative material-symbols-outlined text-[32px] text-tertiary/50 mb-6 group-hover:drop-shadow-[0_0_25px_rgba(221,183,255,0.7)] pointer-events-none">
            {portal.icon}
          </span>
          <h3 className="relative font-headline-sm text-headline-sm text-primary mb-2 pointer-events-none">
            {portal.backTitle}
          </h3>
          <p className="relative font-body-md text-body-md text-on-surface-variant leading-relaxed mb-8 pointer-events-none">
            {portal.backCopy}
          </p>
          <Link
            href={href}
            className="relative group/btn overflow-hidden px-8 py-4 border border-tertiary rounded-full font-label-sm text-label-sm text-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(221,183,255,0.4)] bg-transparent press-scale"
          >
            <span className="absolute inset-0 w-full h-full bg-tertiary/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              {portal.cta} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
      {/* The flip doesn't work reliably on phones and tablets, so touch
          devices also get a plain link under the mirror. */}
      <Link
        href={href}
        className="portal-touch-link mt-6 mx-auto w-fit items-center gap-2 px-8 py-4 border border-tertiary rounded-full font-label-sm text-label-sm uppercase tracking-widest text-primary bg-tertiary/10 press-scale"
      >
        Go to {portal.title}
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </Link>
    </div>
  );
}
