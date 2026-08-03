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

type MirrorSingle = {
  num: string;
  title: string;
  artifact: string;
  lesson: string;
  story: string;
  accent: string;
  img: string;
};

const MIRROR_SINGLES: MirrorSingle[] = [
  {
    num: "01",
    title: "Striped (XO, XO)",
    artifact: "The Striped Suit",
    lesson: "Become a new person",
    story:
      "A boy enters a world of mirrors and stripes, where his darker future self teaches him the consequences of bad decisions. A lesson in temptation, influence, and making the right choice.",
    accent: "#c9c9d4",
    img: "mirror/01-striped.jpg",
  },
  {
    num: "02",
    title: "If Only",
    artifact: "The Blue Butterfly",
    lesson: "Chase your dreams",
    story:
      "A glimpse of the life he could've had if he chased love and his dreams. A lesson in opportunity, regret, and what slips away when you don't act.",
    accent: "#5b8def",
    img: "mirror/02-if-only.jpg",
  },
  {
    num: "03",
    title: "Firecracker",
    artifact: "The Aztec Wildflower",
    lesson: "Love gives you power",
    story:
      "He travels to the past, gains fire and purpose through love and unity, and fights for something bigger than himself. A lesson in passion, power, and using your gifts for good.",
    accent: "#ff5a3c",
    img: "mirror/03-firecracker.jpg",
  },
  {
    num: "04",
    title: "Mess Me Up",
    artifact: "The Purple Power Cord",
    lesson: "Cut the source, don't fight it",
    story:
      "Thrown into a broken world of pixels and chaos, he learns that you can't fight your demons head-on — you have to cut the source. A lesson in escaping toxicity and overcoming what drains you.",
    accent: "#a855f7",
    img: "mirror/04-mess-me-up.jpg",
  },
  {
    num: "05",
    title: "Friends",
    artifact: "The Yellow Microphone",
    lesson: "Find your voice, change the game",
    story:
      "In a world that tries to silence him, he finds his voice and changes the game. A lesson in speaking up, standing out, and creating change.",
    accent: "#f5c542",
    img: "mirror/05-friends.jpg",
  },
  {
    num: "06",
    title: "Don't Wanna Ask",
    artifact: "The Brown Acoustic Guitar",
    lesson: "Music is always there",
    story:
      "Surrounded by everything but fulfillment, he learns that even in solitude, music stays. A lesson in healing, self-worth, and knowing what you truly need.",
    accent: "#b08968",
    img: "mirror/06-dont-wanna-ask.jpg",
  },
  {
    num: "07",
    title: "Why? (Deluxe)",
    artifact: "The Grey Sunglasses",
    lesson: "Protect your peace, move forward",
    story:
      "He steps into the real world as a new man — protected, confident, and ready for what's next. A lesson in growing up, protecting your peace, and walking into your new era.",
    accent: "#9ca3af",
    img: "mirror/07-why.jpg",
  },
];

function ConceptBoard() {
  const exists = publicFileExists("mirror/concept-board.png");
  if (exists) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/mirror/concept-board.png"
        alt="MIRROR: Shattered — visual concept album"
        className="w-full rounded-lg ornate-border"
      />
    );
  }
  return (
    <div className="aspect-[16/10] w-full ornate-border bg-surface-container-low flex flex-col items-center justify-center gap-3 text-center p-8">
      <span className="material-symbols-outlined text-tertiary text-5xl opacity-40">wallpaper</span>
      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-70">
        Add the concept board at
        <br />
        <code className="text-[10px]">public/mirror/concept-board.png</code>
      </p>
    </div>
  );
}

function TrackList({ tracks }: { tracks: MirrorSingle[] }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <p className="font-label-sm text-label-sm text-tertiary uppercase tracking-[0.3em]">Tracklist</p>
      </div>
      <ol className="space-y-2">
        {tracks.map((t) => (
          <li
            key={t.num}
            className="flex items-center gap-4 px-5 py-4 transition-all duration-300 hover:translate-x-1"
            style={{
              background: `linear-gradient(90deg, ${t.accent}26 0%, ${t.accent}0d 45%, transparent 100%)`,
              borderLeft: `3px solid ${t.accent}`,
            }}
          >
            <span
              className="font-label-sm text-label-sm tabular-nums w-8 shrink-0 opacity-80"
              style={{ color: t.accent }}
            >
              {t.num}
            </span>
            <span
              className="font-headline-sm text-[17px] leading-tight flex-1"
              style={{ color: t.accent }}
            >
              {t.title}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-55 hidden sm:block text-right">
              {t.artifact}
            </span>
          </li>
        ))}
      </ol>
      <p className="font-label-sm text-label-sm text-on-surface-variant text-center opacity-50 tracking-wide pt-2">
        Interludes, skits, and monologues sit between these tracks in the full sequence.
      </p>
    </div>
  );
}

function SingleCard({ single }: { single: MirrorSingle }) {
  const exists = publicFileExists(single.img);
  return (
    <div
      className="group ornate-border bg-surface-container-low overflow-hidden flex flex-col transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
      style={{ borderColor: `${single.accent}55` }}
    >
      <div
        className="aspect-[4/5] w-full overflow-hidden relative"
        style={{ background: `linear-gradient(160deg, ${single.accent}22, transparent 70%)` }}
      >
        {exists ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/${single.img}`}
            alt={`${single.title} — ${single.artifact}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center p-4">
            <span
              className="material-symbols-outlined text-4xl opacity-40"
              style={{ color: single.accent }}
            >
              image
            </span>
            <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest opacity-60">
              <code>public/{single.img}</code>
            </p>
          </div>
        )}
        <span
          className="absolute top-3 left-3 font-headline-sm text-headline-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
          style={{ color: single.accent }}
        >
          {single.num}
        </span>
      </div>
      <div className="p-6 space-y-3 flex-1 flex flex-col">
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          {single.artifact}
        </p>
        <h3 className="font-headline-sm text-headline-sm" style={{ color: single.accent }}>
          {single.title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-1">
          {single.story}
        </p>
        <div className="pt-3 border-t border-white/5">
          <p
            className="font-label-sm text-label-sm uppercase tracking-widest flex items-center gap-2"
            style={{ color: single.accent }}
          >
            <span aria-hidden>◆</span>
            {single.lesson}
          </p>
        </div>
      </div>
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
                completely written and co-produced by me, from start to finish — and it&apos;s the
                project that inspired this whole platform.
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

        <section className="space-y-12 animate-fade-up-delay-3">
          <div className="text-center space-y-4">
            <p className="font-label-sm text-label-sm text-tertiary uppercase tracking-[0.3em]">
              A Visual Concept Album
            </p>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              MIRROR: Shattered
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant italic max-w-2xl mx-auto">
              The journey. The lesson. The man you become.
            </p>
          </div>

          <ConceptBoard />

          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              On his 13th birthday, a young, innocent Joey is pulled into his bathroom mirror by a
              darker, future version of himself. He goes missing in the Mirrorverse for seven
              years — the span of his teenage years — and eventually emerges as a changed adult.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              The project is written like a theatrical experience: songs, interludes, skits, and
              monologues, many of them framed as therapy sessions that take place after he escapes
              the Mirrorverse. Each world is its own track — its own color, artifact, and lesson —
              and every choice he makes shapes who he becomes.
            </p>
            <p className="font-headline-sm text-headline-sm text-tertiary italic">
              &ldquo;Make the right choice. Every world. Every choice. It all shapes the man
              you&apos;re destined to be.&rdquo;
            </p>
          </div>

          <TrackList tracks={MIRROR_SINGLES} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MIRROR_SINGLES.map((single) => (
              <SingleCard key={single.num} single={single} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-surface-container-low p-6 ornate-border space-y-3">
              <span className="material-symbols-outlined text-tertiary">groups</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Who It&apos;s For</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Primarily teens and young adults, with a clean version so the story stays
                accessible to everyone.
              </p>
            </div>
            <div className="bg-surface-container-low p-6 ornate-border space-y-3">
              <span className="material-symbols-outlined text-tertiary">campaign</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">The Rollout</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Social media campaigns, billboards, and symbolic mirror installations placed in
                public spaces around the U.S.
              </p>
            </div>
            <div className="bg-surface-container-low p-6 ornate-border space-y-3">
              <span className="material-symbols-outlined text-tertiary">theater_comedy</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">The Tour</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                A North American theatre-style tour where the album is performed in sequence —
                a live cinematic experience, closer to a Broadway play than a concert.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low border-y border-primary/20 py-12 px-8 text-center animate-fade-up-delay-4">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-headline-sm text-headline-sm text-tertiary">Created by Joey Koury</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Every song, storyline, and visual concept in <span className="italic text-primary">MIRROR</span>{" "}
              was written and created 100% by me, alone. AI is used on this site to help artists
              execute their own vision — the same way it&apos;s used by many other creators, like me.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              MirrorMeMusic.com is built on my passion project — <span className="italic text-primary">MIRROR</span>.
            </p>
          </div>
        </section>

        <section className="bg-surface-container-low border-y border-white/5 py-16 px-8 relative overflow-hidden animate-fade-up-delay-4">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, var(--color-tertiary) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="font-headline-sm text-headline-sm text-tertiary mb-2">Hear MIRROR</h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
                A sample from the mixtape that started it all
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
