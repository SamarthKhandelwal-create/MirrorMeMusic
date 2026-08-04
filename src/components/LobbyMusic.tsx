"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generative ambient lobby music, synthesized in-browser (no audio file).
 *
 * Structure:
 *  - A 4-chord progression in D minor that re-voices every 12s, so the
 *    harmony actually moves instead of sitting on one drone.
 *  - A plucked bell voice that picks notes from the current chord's scale on
 *    an irregular schedule, giving melodic motion without a fixed loop.
 *  - A soft sub pulse on the chord root for weight.
 * Everything runs through a shared delay network for a mysterious wash.
 */

const NOTE = {
  D2: 73.42, F2: 87.31, A2: 110.0, Bb2: 116.54, G2: 98.0, C3: 130.81,
  D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, Bb3: 233.08, C4: 261.63,
  D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, Bb4: 466.16, C5: 523.25,
  D5: 587.33, E5: 659.25, F5: 698.46, A5: 880.0, D6: 1174.66,
};

/** i — VI — III — VII in D minor: Dm, Bb, F, C. Melancholy but resolving. */
const PROGRESSION = [
  { root: NOTE.D2, pads: [NOTE.D3, NOTE.F3, NOTE.A3], bells: [NOTE.D5, NOTE.F5, NOTE.A5, NOTE.D6] },
  { root: NOTE.Bb2, pads: [NOTE.D3, NOTE.F3, NOTE.Bb3], bells: [NOTE.D5, NOTE.F5, NOTE.Bb4, NOTE.D6] },
  { root: NOTE.F2, pads: [NOTE.C3, NOTE.F3, NOTE.A3], bells: [NOTE.C5, NOTE.F5, NOTE.A5, NOTE.E5] },
  { root: NOTE.C3, pads: [NOTE.C3, NOTE.E3, NOTE.G3], bells: [NOTE.C5, NOTE.E5, NOTE.G4, NOTE.D5] },
];

const CHORD_SECONDS = 12;
const MASTER_LEVEL = 0.34;

type PadVoice = { osc: OscillatorNode; gain: GainNode; detune: number; ratio: number };

export function LobbyMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    master: GainNode;
    padVoices: PadVoice[];
    subOsc: OscillatorNode;
    subGain: GainNode;
    bellBus: GainNode;
    lfo: OscillatorNode;
  } | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const chordRef = useRef(0);
  // These two callbacks re-schedule themselves, so they're held in refs to
  // avoid referencing a binding before its declaration.
  const scheduleBellRef = useRef<() => void>(() => {});
  const advanceChordRef = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  /** Fire a short plucked bell tone from the current chord. */
  const strikeBell = useCallback((freq: number, velocity: number) => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lpf = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 8;

    lpf.type = "lowpass";
    lpf.frequency.setValueAtTime(freq * 3.5, t);
    lpf.frequency.exponentialRampToValueAtTime(freq * 1.2, t + 2.5);

    // Fast attack, long decay — a struck-glass character.
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(velocity, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

    osc.connect(lpf);
    lpf.connect(gain);
    gain.connect(nodes.bellBus);
    osc.start(t);
    osc.stop(t + 3.4);
  }, []);

  /** Schedule the next bell at an irregular interval so it never loops audibly. */
  const scheduleBell = useCallback(() => {
    const nodes = nodesRef.current;
    if (!nodes) return;
    const delay = 1400 + Math.random() * 2600;
    const id = setTimeout(() => {
      const chord = PROGRESSION[chordRef.current];
      const pool = chord.bells;
      const freq = pool[Math.floor(Math.random() * pool.length)];
      strikeBell(freq, 0.05 + Math.random() * 0.05);
      // Occasional grace note a beat later.
      if (Math.random() < 0.35) {
        const id2 = setTimeout(() => {
          const f2 = pool[Math.floor(Math.random() * pool.length)];
          strikeBell(f2, 0.03 + Math.random() * 0.03);
        }, 260 + Math.random() * 240);
        timersRef.current.push(id2);
      }
      scheduleBellRef.current();
    }, delay);
    timersRef.current.push(id);
  }, [strikeBell]);

  /** Glide pads + sub to the next chord in the progression. */
  const advanceChord = useCallback(() => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes) return;

    chordRef.current = (chordRef.current + 1) % PROGRESSION.length;
    const chord = PROGRESSION[chordRef.current];
    const t = ctx.currentTime;
    const glide = 3.5;

    nodes.padVoices.forEach((v) => {
      const target = chord.pads[v.ratio % chord.pads.length];
      v.osc.frequency.setTargetAtTime(target, t, glide / 3);
    });
    nodes.subOsc.frequency.setTargetAtTime(chord.root, t, glide / 3);

    const id = setTimeout(() => advanceChordRef.current(), CHORD_SECONDS * 1000);
    timersRef.current.push(id);
  }, []);

  const startSynth = useCallback(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    chordRef.current = 0;
    const chord = PROGRESSION[0];
    const t = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, t);
    master.gain.linearRampToValueAtTime(MASTER_LEVEL, t + 4);
    master.connect(ctx.destination);

    // Slow breathing LFO on the master.
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.09;
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();

    // Delay network shared by pads and bells.
    const makeDelay = (time: number, feedback: number) => {
      const d = ctx.createDelay(3);
      const fb = ctx.createGain();
      const damp = ctx.createBiquadFilter();
      damp.type = "lowpass";
      damp.frequency.value = 2200;
      d.delayTime.value = time;
      fb.gain.value = feedback;
      d.connect(damp);
      damp.connect(fb);
      fb.connect(d);
      d.connect(master);
      return d;
    };
    const wash = ctx.createGain();
    wash.gain.value = 0.42;
    wash.connect(makeDelay(0.37, 0.45));
    wash.connect(makeDelay(0.61, 0.38));

    // Bells sit slightly wetter than the pads.
    const bellBus = ctx.createGain();
    bellBus.gain.value = 0.9;
    bellBus.connect(master);
    bellBus.connect(wash);

    // Pad stack: three chord tones, each doubled with a detuned twin.
    const padVoices: PadVoice[] = [];
    chord.pads.forEach((freq, i) => {
      [-7, 6].forEach((detune) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lpf = ctx.createBiquadFilter();
        osc.type = "sawtooth";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        lpf.type = "lowpass";
        lpf.frequency.value = 900;
        lpf.Q.value = 0.7;
        gain.gain.value = 0.055;
        osc.connect(lpf);
        lpf.connect(gain);
        gain.connect(master);
        gain.connect(wash);
        osc.start();
        padVoices.push({ osc, gain, detune, ratio: i });
      });
    });

    // Sub root — sine, well below the pads.
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.value = chord.root;
    subGain.gain.value = 0.13;
    subOsc.connect(subGain);
    subGain.connect(master);
    subOsc.start();

    nodesRef.current = { master, padVoices, subOsc, subGain, bellBus, lfo };

    const chordTimer = setTimeout(() => advanceChordRef.current(), CHORD_SECONDS * 1000);
    timersRef.current.push(chordTimer);
    scheduleBell();

    setPlaying(true);
  }, [scheduleBell]);

  const stopSynth = useCallback(() => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes) return;

    clearTimers();
    nodes.master.gain.setTargetAtTime(0, ctx.currentTime, 0.7);

    const closing = ctx;
    setTimeout(() => {
      try {
        nodes.padVoices.forEach((v) => v.osc.stop());
        nodes.subOsc.stop();
        nodes.lfo.stop();
      } catch {
        /* already stopped */
      }
      closing.close();
    }, 3000);

    nodesRef.current = null;
    ctxRef.current = null;
    setPlaying(false);
  }, []);

  // Keep the self-rescheduling callbacks current without touching refs in render.
  useEffect(() => {
    scheduleBellRef.current = scheduleBell;
    advanceChordRef.current = advanceChord;
  }, [scheduleBell, advanceChord]);

  // Tear down cleanly if the component unmounts mid-playback.
  useEffect(() => {
    return () => {
      clearTimers();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  function toggle() {
    if (playing) stopSynth();
    else startSynth();
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
