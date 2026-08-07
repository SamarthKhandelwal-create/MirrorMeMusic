"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom audio player, themed to match the site's ornate/dark aesthetic.
 *
 * Replaces the native <audio controls>, which renders completely differently
 * across browsers and doesn't accept styling.
 *
 * The visualiser is driven by a real AnalyserNode on the playing audio — it's
 * live data, not a decorative loop, and costs nothing to precompute.
 */

const BAR_COUNT = 48;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  title,
  subtitle,
}: {
  src: string;
  title: string;
  subtitle?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const drawRef = useRef<() => void>(() => {});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // createMediaElementSource throws if called twice on one element.
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [scrubbing, setScrubbing] = useState(false);

  /** Lazily wire the analyser the first time playback starts. */
  const ensureAnalyser = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || sourceRef.current) return;
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch {
      // Visualiser is non-essential; playback continues without it.
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2d.clearRect(0, 0, w, h);

    let values: number[];
    if (analyser) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      // Log-ish sampling so low frequencies don't dominate the display.
      values = Array.from({ length: BAR_COUNT }, (_, i) => {
        const idx = Math.floor(Math.pow(i / BAR_COUNT, 1.4) * data.length);
        return data[Math.min(idx, data.length - 1)] / 255;
      });
    } else {
      values = new Array(BAR_COUNT).fill(0);
    }

    const gap = 2;
    const barW = Math.max(1, (w - gap * (BAR_COUNT - 1)) / BAR_COUNT);
    for (let i = 0; i < BAR_COUNT; i++) {
      const v = values[i];
      // Idle bars keep a faint baseline so the strip never looks broken.
      const mag = playing ? Math.max(v, 0.04) : 0.03;
      const barH = Math.max(2, mag * h);
      const x = i * (barW + gap);
      const y = (h - barH) / 2;

      const grad = ctx2d.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, `rgba(240, 198, 74, ${0.55 + mag * 0.45})`);
      grad.addColorStop(1, `rgba(221, 183, 255, ${0.3 + mag * 0.4})`);
      ctx2d.fillStyle = grad;

      ctx2d.beginPath();
      // roundRect is unsupported on older Safari/Firefox; fall back to a
      // plain rect there rather than throwing and killing the animation loop.
      if (typeof ctx2d.roundRect === "function") {
        ctx2d.roundRect(x, y, barW, barH, barW / 2);
      } else {
        ctx2d.rect(x, y, barW, barH);
      }
      ctx2d.fill();
    }

    rafRef.current = requestAnimationFrame(() => drawRef.current());
  }, [playing]);

  // draw re-schedules itself, so it goes through a ref to avoid referencing
  // its own binding before declaration.
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(() => drawRef.current());
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  // Release the AudioContext if the component goes away mid-playback.
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      return;
    }
    ensureAnalyser();
    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume();
    }
    try {
      await audio.play();
    } catch {
      setFailed(true);
    }
  }, [playing, ensureAnalyser]);

  const seek = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setCurrent(value);
  }, []);

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="w-full glass-panel border border-primary/20 px-6 py-6 sm:px-8 sm:py-7 space-y-5">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setReady(true);
        }}
        onTimeUpdate={(e) => {
          if (!scrubbing) setCurrent(e.currentTarget.currentTime);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
        onError={() => setFailed(true)}
      />

      {/* Title + live level strip */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={toggle}
          disabled={failed}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          className="relative shrink-0 w-14 h-14 rounded-full flex items-center justify-center
                     border border-[#F0C64A]/50 bg-gradient-to-br from-[#2a1c3d] to-[#14091f]
                     text-[#F0C64A] transition-all duration-300
                     hover:border-[#F0C64A] hover:shadow-[0_0_24px_rgba(240,198,74,0.35)]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0C64A]/70
                     disabled:opacity-40 disabled:cursor-not-allowed press-scale"
        >
          <span
            className="material-symbols-outlined text-[30px] leading-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {playing ? "pause" : "play_arrow"}
          </span>
        </button>

        <div className="flex-1 min-w-0">
          <p className="font-headline-sm text-[19px] text-primary leading-tight truncate">{title}</p>
          {subtitle && (
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-65 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="hidden sm:block h-10 w-[180px] shrink-0 opacity-90"
        />
      </div>

      {/* Scrubber */}
      <div className="space-y-2">
        <div className="relative h-1.5 group">
          {/* Track */}
          <div className="absolute inset-0 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C8860A] via-[#F0C64A] to-[#ddb7ff] transition-[width] duration-100"
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Playhead */}
          <div
            className="absolute top-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-[#F0C64A]
                       shadow-[0_0_10px_rgba(240,198,74,0.8)] pointer-events-none
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ left: `${pct}%` }}
          />
          {/* Real range input on top: keyboard + screen-reader support for free. */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={current}
            disabled={!ready || failed}
            onChange={(e) => seek(Number(e.target.value))}
            onPointerDown={() => setScrubbing(true)}
            onPointerUp={() => setScrubbing(false)}
            aria-label="Seek"
            aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant tabular-nums opacity-70">
            {formatTime(current)}
          </span>

          <div className="flex items-center gap-2 group/vol">
            <span
              className="material-symbols-outlined text-[17px] text-on-surface-variant opacity-60"
              aria-hidden
            >
              {volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="w-16 sm:w-20 h-1 accent-[#F0C64A] cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>

          <span className="font-label-sm text-label-sm text-on-surface-variant tabular-nums opacity-70">
            {failed ? "—:—" : formatTime(duration)}
          </span>
        </div>
      </div>

      {failed && (
        <p className="font-label-sm text-label-sm text-error text-center uppercase tracking-widest">
          This track couldn&apos;t be loaded.
        </p>
      )}
    </div>
  );
}
