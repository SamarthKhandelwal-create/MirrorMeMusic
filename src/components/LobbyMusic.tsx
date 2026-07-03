"use client";

import { useEffect, useRef, useState } from "react";

export function LobbyMusic({ src = "/audio/lobby.mp3" }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = 0.35;
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      // Browser blocked playback (e.g. no gesture yet); stay paused.
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" onEnded={() => setPlaying(false)} />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause lobby music" : "Play lobby music"}
        aria-pressed={playing}
        title={playing ? "Pause music" : "Play ambient music"}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-primary/30 bg-surface-container-lowest/80 backdrop-blur-md px-4 py-3 text-primary shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(214,191,221,0.3)] transition-all duration-300 press-scale"
      >
        <span
          className={`material-symbols-outlined text-[20px] ${playing ? "animate-pulse" : ""}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {playing ? "graphic_eq" : "music_note"}
        </span>
        <span className="hidden sm:inline font-label-sm text-label-sm uppercase tracking-widest">
          {playing ? "Playing" : "Music"}
        </span>
      </button>
    </>
  );
}
