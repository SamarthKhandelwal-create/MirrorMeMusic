import fs from "fs";
import path from "path";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCurrentUser } from "@/lib/auth";

function publicFileExists(relativePath: string) {
  return fs.existsSync(path.join(process.cwd(), "public", relativePath));
}

function PhotoSlot({ src, alt }: { src: string; alt: string }) {
  const exists = publicFileExists(src);
  return (
    <div className="ornate-border bg-surface-container-low aspect-[3/4] w-full overflow-hidden relative">
      {exists ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/${src}`} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center p-6">
          <span className="material-symbols-outlined text-on-surface-variant text-4xl opacity-50">
            add_a_photo
          </span>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-70">
            Add photo at
            <br />
            <code className="text-[10px]">public/{src}</code>
          </p>
        </div>
      )}
    </div>
  );
}

export default async function AboutPage() {
  const user = await getCurrentUser();
  const hasTrack = publicFileExists("audio/example-track.mp3");

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader active="About" user={user} />
      <main className="max-w-[1000px] mx-auto px-4 md:px-16 py-12 space-y-32">
        <header className="text-center space-y-6 pt-12 animate-fade-up">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            About MirrorMeMusic
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto italic">
            The story behind MirrorMeMusic.
          </p>
        </header>

        <section className="bg-surface-container-low p-8 md:p-12 ornate-border void-glow space-y-6 animate-fade-up-delay-1">
          <h2 className="font-headline-sm text-headline-sm text-tertiary border-b border-white/5 pb-4">
            What is MirrorMeMusic?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            MirrorMeMusic is an AI-guided creative partner for independent musicians. Instead of
            spreadsheets and scattered notes, artists get an AI Strategist to talk through release
            strategy and branding, a library to catalog their work, and a roadmap that tracks the
            actual phases of getting a project out into the world.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            The goal is simple: give independent artists access to the kind of strategic
            thinking — sonic direction, visual identity, release sequencing — that&apos;s usually
            reserved for artists with a full team behind them.
          </p>
        </section>

        <section className="space-y-12 animate-fade-up-delay-2">
          <div className="text-center">
            <h2 className="font-headline-md text-headline-md text-primary inline-block pb-2 border-b-2 border-on-tertiary-container/30">
              About the Creator
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-6 order-2 md:order-1">
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                <span className="float-left text-5xl font-headline-lg text-tertiary mr-3 mt-1">
                  H
                </span>
                i, I&apos;m Joey Koury. I&apos;m an American musician with Lebanese roots, and I
                love creating music, exploring the music business, and diving into music theory.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                In my free time, I play piano, write music, and experiment with new sounds.
                Outside of music, I enjoy playing tennis, golf, and swimming, spending time with
                family and friends, and cooking and trying new foods.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                MirrorMeMusic is my platform to help aspiring artists create, market, and release
                their projects efficiently and affordably, while answering any questions they
                might have about the business side of music. The entire mixtape MIRROR is
                completely written and co-produced by me, from start to finish.
              </p>
            </div>
            <div className="md:col-span-5 grid grid-cols-2 gap-4 order-1 md:order-2">
              <PhotoSlot src="about/joey-1.jpg" alt="Joey Koury" />
              <div className="mt-8">
                <PhotoSlot src="about/joey-2.jpg" alt="Joey Koury" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low border-y border-white/5 py-16 px-8 relative overflow-hidden animate-fade-up-delay-3">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, var(--color-tertiary) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="font-headline-sm text-headline-sm text-tertiary mb-2">
                Example Track
              </h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                A sample of what the AI Strategist helps artists plan around
              </p>
            </div>
            <div className="bg-surface-container-lowest ornate-border p-6 flex flex-col items-center gap-6">
              {hasTrack ? (
                <audio controls className="w-full" src="/audio/example-track.mp3" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center py-4">
                  <span className="material-symbols-outlined text-on-surface-variant text-4xl opacity-50">
                    music_note
                  </span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-70">
                    Add a track at <code className="text-[10px]">public/audio/example-track.mp3</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
