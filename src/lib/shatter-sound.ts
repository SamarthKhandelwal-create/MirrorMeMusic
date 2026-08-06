/**
 * Synthesized glass-shatter sound. Built in-browser via Web Audio so there's
 * no audio file to ship or license.
 *
 * Three layers, matching how real breaking glass reads:
 *  1. A bright noise transient — the initial crack.
 *  2. A scatter of short high-frequency pings — shards ringing and falling.
 *  3. A short low thud for physical weight.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx || ctx.state === "closed") {
    ctx = new AudioContext();
  }
  // Browsers start the context suspended until a gesture; a click is one.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Short burst of filtered white noise — the initial fracture. */
function playNoiseTransient(ac: AudioContext, master: GainNode, t: number) {
  const dur = 0.34;
  const frames = Math.floor(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const chan = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    // Decaying noise: dense at the strike, thinning out fast.
    const decay = Math.pow(1 - i / frames, 2.6);
    chan[i] = (Math.random() * 2 - 1) * decay;
  }

  const src = ac.createBufferSource();
  src.buffer = buffer;

  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1800;

  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(4200, t);
  bp.frequency.exponentialRampToValueAtTime(1500, t + dur);
  bp.Q.value = 0.8;

  const g = ac.createGain();
  g.gain.setValueAtTime(0.5, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  src.connect(hp);
  hp.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + dur);
}

/** A single shard ringing out. */
function playShard(ac: AudioContext, master: GainNode, t: number, freq: number, level: number) {
  const osc = ac.createOscillator();
  const g = ac.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, t);
  // Slight downward glide — shards lose energy as they ring.
  osc.frequency.exponentialRampToValueAtTime(freq * 0.82, t + 0.5);

  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42 + Math.random() * 0.35);

  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + 0.9);
}

/** Low-frequency body so the hit feels physical rather than thin. */
function playThud(ac: AudioContext, master: GainNode, t: number) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(58, t + 0.18);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.34, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + 0.34);
}

/**
 * Fire the full shatter. Safe to call repeatedly; each call is independent and
 * cleans itself up when its nodes stop.
 */
export function playShatter(volume = 0.5) {
  const ac = getCtx();
  if (!ac) return;

  const t = ac.currentTime;
  const master = ac.createGain();
  master.gain.value = volume;

  // Gentle high shelf keeps the top end bright without becoming harsh.
  const shelf = ac.createBiquadFilter();
  shelf.type = "highshelf";
  shelf.frequency.value = 3200;
  shelf.gain.value = 3;

  master.connect(shelf);
  shelf.connect(ac.destination);

  playThud(ac, master, t);
  playNoiseTransient(ac, master, t);

  // 9 shards spread over ~320ms, pitched across the glass register.
  const SHARDS = 9;
  for (let i = 0; i < SHARDS; i++) {
    const when = t + 0.012 + Math.random() * 0.32;
    const freq = 1500 + Math.random() * 4200;
    const level = 0.1 + Math.random() * 0.11;
    playShard(ac, master, when, freq, level);
  }
}
