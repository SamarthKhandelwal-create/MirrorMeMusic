"use client";

import { useCallback, useRef, useState } from "react";

// D minor ambient drone voices
const DRONES = [
  { freq: 73.42,  gain: 0.10, detune: 0   },  // D2 sub
  { freq: 146.83, gain: 0.16, detune: 0   },  // D3
  { freq: 174.61, gain: 0.11, detune: 5   },  // F3 (slightly sharp for warmth)
  { freq: 220.00, gain: 0.09, detune: -4  },  // A3
  { freq: 293.66, gain: 0.07, detune: 0   },  // D4
  { freq: 146.83, gain: 0.05, detune: 12  },  // D3 detuned up
  { freq: 174.61, gain: 0.05, detune: -12 },  // F3 detuned down
];

// Upper shimmer harmonics
const SHIMMER = [
  { freq: 587.33,  gain: 0.016 }, // D5
  { freq: 880.00,  gain: 0.011 }, // A5
  { freq: 1174.66, gain: 0.006 }, // D6
];

type SynthState = {
  masterGain: GainNode;
  oscs: OscillatorNode[];
};

export function LobbyMusic() {
  const stateRef = useRef<SynthState | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [playing, setPlaying] = useState(false);

  const startSynth = useCallback(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Master gain — fades in over 4s
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 4);
    masterGain.connect(ctx.destination);

    // Slow breathing LFO (0.12 Hz ≈ 7 BPM)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = 0.055;
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();

    // Two feedback delay lines — reverb wash
    function makeDelay(time: number, feedback: number) {
      const delay = ctx.createDelay(2);
      const fb = ctx.createGain();
      delay.delayTime.value = time;
      fb.gain.value = feedback;
      delay.connect(fb);
      fb.connect(delay);
      delay.connect(masterGain);
      return delay;
    }
    const delay1 = makeDelay(0.30, 0.42);
    const delay2 = makeDelay(0.52, 0.36);

    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.38;
    reverbSend.connect(delay1);
    reverbSend.connect(delay2);

    const oscs: OscillatorNode[] = [lfo];

    function addVoice(freq: number, gainVal: number, detune = 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const lpf = ctx.createBiquadFilter();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      lpf.type = "lowpass";
      lpf.frequency.value = Math.min(freq * 5, 1800);
      lpf.Q.value = 0.5;
      g.gain.value = gainVal;
      osc.connect(lpf);
      lpf.connect(g);
      g.connect(masterGain);
      g.connect(reverbSend);
      osc.start();
      oscs.push(osc);
    }

    DRONES.forEach((v) => addVoice(v.freq, v.gain, v.detune));
    SHIMMER.forEach((v) => addVoice(v.freq, v.gain));

    stateRef.current = { masterGain, oscs };
    setPlaying(true);
  }, []);

  const stopSynth = useCallback(() => {
    const s = stateRef.current;
    const ctx = ctxRef.current;
    if (!s || !ctx) return;
    s.masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.7);
    setTimeout(() => {
      s.oscs.forEach((o) => {
        try { o.stop(); } catch { /* already stopped */ }
      });
      ctx.close();
      stateRef.current = null;
      ctxRef.current = null;
    }, 3000);
    setPlaying(false);
  }, []);

  function toggle() {
    if (playing) stopSynth(); else startSynth();
  }

  return (
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
  );
}
