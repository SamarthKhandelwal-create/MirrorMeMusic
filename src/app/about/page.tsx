import fs from "fs";
import path from "path";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getCurrentUser } from "@/lib/auth";
import {
  DISC_ONE,
  DISC_TWO,
  REMIX_NOTE,
  PROJECT_SUMMARY,
  type MirrorTrack,
} from "@/lib/mirror-tracklist";

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
  accent: string;
  img: string;
};

const MIRROR_SINGLES: MirrorSingle[] = [
  {
    num: "01",
    title: "Striped (XO, XO)",
    artifact: "The Striped Suit",
    lesson: "Become a new person",
    accent: "#c9c9d4",
    img: "mirror/01-striped.jpg",
  },
  {
    num: "02",
    title: "If Only",
    artifact: "The Blue Butterfly",
    lesson: "Chase your dreams",
    accent: "#5b8def",
    img: "mirror/02-if-only.jpg",
  },
  {
    num: "03",
    title: "Firecracker",
    artifact: "The Aztec Wildflower",
    lesson: "Love gives you power",
    accent: "#ff5a3c",
    img: "mirror/03-firecracker.jpg",
  },
  {
    num: "04",
    title: "Mess Me Up",
    artifact: "The Purple Power Cord",
    lesson: "Cut the source, don't fight it",
    accent: "#a855f7",
    img: "mirror/04-mess-me-up.jpg",
  },
  {
    num: "05",
    title: "Friends",
    artifact: "The Yellow Microphone",
    lesson: "Find your voice, change the game",
    accent: "#f5c542",
    img: "mirror/05-friends.jpg",
  },
  {
    num: "06",
    title: "Don't Wanna Ask",
    artifact: "The Brown Acoustic Guitar",
    lesson: "Music is always there",
    accent: "#b08968",
    img: "mirror/06-dont-wanna-ask.jpg",
  },
  {
    num: "07",
    title: "Why? (Deluxe)",
    artifact: "The Grey Sunglasses",
    lesson: "Protect your peace, move forward",
    accent: "#9ca3af",
    img: "mirror/07-why.jpg",
  },
];

/**
 * Tracks in the listening section. Each renders only when its file is present
 * in public/audio, so a track can be dropped in without a code change.
 */
const LISTENING_ROOM = [
  {
    heading: "Hear Days Before MIRROR",
    blurb: "A sample from the prequel EP to the concept album that started it all.",
    file: "head-over-heels.mp3",
    title: "Head Over Heels",
    subtitle: "Days Before MIRROR",
  },
  {
    heading: "Hear a website-exclusive demo from MIRROR",
    blurb:
      "An acoustic demo of “No One Knows Me” — track 9 on MIRROR, and unreleased anywhere else.",
    file: "no-one-knows-me-acoustic-demo.mp3",
    title: "No One Knows Me",
    subtitle: "Acoustic Demo · Unreleased",
  },
] as const;

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

function AlbumCover() {
  const exists = publicFileExists("mirror/cover.jpg");
  if (exists) {
    return (
      <div className="max-w-[560px] mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mirror/cover.jpg"
          alt="MIRROR: Shattered — album cover"
          className="w-full aspect-square object-cover ornate-border shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        />
      </div>
    );
  }
  return (
    <div className="max-w-[560px] mx-auto">
      <div className="aspect-square w-full ornate-border bg-surface-container-lowest flex flex-col items-center justify-center gap-4 text-center p-10">
        <span className="material-symbols-outlined text-tertiary text-6xl opacity-40">album</span>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-70 leading-relaxed">
          Add the album cover at
          <br />
          <code className="text-[11px] normal-case tracking-normal">public/mirror/cover.jpg</code>
        </p>
      </div>
    </div>
  );
}

function TrackRow({ track }: { track: MirrorTrack }) {
  const isRemix = track.kind === "remix";
  return (
    <li
      className="px-5 py-4 transition-all duration-300 hover:translate-x-1"
      style={{
        background: `linear-gradient(90deg, ${track.accent}26 0%, ${track.accent}0d 45%, transparent 100%)`,
        borderLeft: `3px solid ${track.accent}`,
      }}
    >
      <div className="flex items-baseline gap-4">
        <span
          className="font-label-sm text-label-sm tabular-nums w-7 shrink-0 opacity-80"
          style={{ color: track.accent }}
        >
          {track.num}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h4 className="font-headline-sm text-[17px] leading-tight" style={{ color: track.accent }}>
              {track.title}
            </h4>
            {track.badge && (
              <span
                className="font-label-sm text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0"
                style={{ color: track.accent, borderColor: `${track.accent}55` }}
              >
                {track.badge}
              </span>
            )}
          </div>
          {track.summary && (
            <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed mt-2 opacity-85">
              {track.summary}
            </p>
          )}
          {track.artifact && (
            <p
              className="font-label-sm text-label-sm uppercase tracking-widest mt-3 flex items-start gap-2"
              style={{ color: track.accent }}
            >
              <span aria-hidden className="shrink-0">◆</span>
              <span className="normal-case tracking-normal font-body-md text-[14px]">
                <strong className="uppercase tracking-widest text-label-sm">{track.artifact}</strong>
                {track.artifactMeaning ? ` — ${track.artifactMeaning}` : ""}
              </span>
            </p>
          )}
        </div>
      </div>
      {isRemix && <span className="sr-only">Remix</span>}
    </li>
  );
}

function FullTrackList() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-2">
        <p className="font-label-sm text-label-sm text-tertiary uppercase tracking-[0.3em]">
          Story &amp; Track Guide
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant italic opacity-70">
          MIRROR: SHATTERED (Deluxe Edition) — 24 tracks
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-headline-sm text-headline-sm text-primary border-b border-primary/20 pb-3">
          Disc 1
        </h3>
        <ol className="space-y-2">
          {DISC_ONE.map((t) => (
            <TrackRow key={t.num} track={t} />
          ))}
        </ol>
      </div>

      <div className="space-y-4">
        <h3 className="font-headline-sm text-headline-sm text-primary border-b border-primary/20 pb-3">
          Disc 2
        </h3>
        <ol className="space-y-2">
          {DISC_TWO.map((t) => (
            <TrackRow key={t.num} track={t} />
          ))}
        </ol>
        <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed opacity-75 pt-2 px-5">
          {REMIX_NOTE}
        </p>
      </div>
    </div>
  );
}

function AiDisclaimer() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="border border-primary/25 bg-surface-container-lowest/60 px-6 py-5 flex gap-4 items-start">
        <span
          className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5 opacity-70"
          aria-hidden
        >
          info
        </span>
        <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed opacity-85">
          <strong className="text-primary font-normal">A note on the visuals above.</strong> The
          imagery here was generated with AI as a tool to execute a vision that was already fully
          written — the same way countless other creators use it. The ideas, the story, and the
          music are mine.
        </p>
      </div>
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
        <h3 className="font-headline-sm text-headline-sm flex-1" style={{ color: single.accent }}>
          {single.title}
        </h3>
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
                I built this platform to help aspiring artists create, market, and release their
                projects efficiently and affordably, while answering the questions nobody explains
                about the business side of music. It grew out of my own mixtape,{" "}
                <span className="italic text-primary">MIRROR</span> — which I wrote and co-produced
                from start to finish.
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
              MIRROR: SHATTERED
            </h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-[0.25em] opacity-70">
              Deluxe Edition
            </p>
            <p className="font-body-lg text-body-lg text-on-surface-variant italic max-w-2xl mx-auto">
              The journey. The lesson. The man you become.
            </p>
          </div>

          {/* 1. Album cover, directly under the title */}
          <AlbumCover />

          {/* 2. Full 24-track guide */}
          <FullTrackList />

          {/* 3. Project summary */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <p className="font-label-sm text-label-sm text-tertiary uppercase tracking-[0.3em]">
                Project Summary
              </p>
            </div>
            {PROJECT_SUMMARY.map((para, i) => (
              <p
                key={i}
                className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
              >
                {para}
              </p>
            ))}
            <p className="font-headline-sm text-headline-sm text-tertiary italic text-center pt-4">
              &ldquo;Make the right choice. Every world. Every choice. It all shapes the man
              you&apos;re destined to be.&rdquo;
            </p>
          </div>

          {/* 4. AI-generated art montage + disclaimer */}
          <div className="space-y-6">
            <ConceptBoard />
            <AiDisclaimer />
          </div>

          {/* 5. Per-single artifact cards */}
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
              was written and created 100% by me, alone.
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
          <div className="relative z-10 max-w-2xl mx-auto space-y-14">
            {LISTENING_ROOM.map((entry) => (
              <div key={entry.file} className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-headline-sm text-headline-sm text-tertiary">{entry.heading}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant italic opacity-80 max-w-lg mx-auto leading-relaxed">
                    {entry.blurb}
                  </p>
                </div>
                {publicFileExists(`audio/${entry.file}`) ? (
                  <AudioPlayer
                    src={`/audio/${entry.file}`}
                    title={entry.title}
                    subtitle={entry.subtitle}
                  />
                ) : (
                  <div className="bg-surface-container-lowest ornate-border p-6 flex flex-col items-center gap-3 text-center py-8">
                    <span className="material-symbols-outlined text-on-surface-variant text-4xl opacity-50">
                      music_note
                    </span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-70">
                      Add <span className="normal-case tracking-normal italic">{entry.title}</span> at{" "}
                      <code className="text-[10px]">public/audio/{entry.file}</code>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
