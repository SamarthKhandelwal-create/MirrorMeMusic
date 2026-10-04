/**
 * iOS/Safari audio unlocking.
 *
 * Mobile Safari hands back a suspended AudioContext whose clock is pinned at
 * 0, and only unlocks it when resume() is called from inside a user gesture.
 * Two things then bite:
 *
 *  1. resume() resolves asynchronously, so anything scheduled straight after
 *     the call lands while the context is still suspended.
 *  2. WebKit flips state to "running" a moment BEFORE currentTime starts
 *     advancing — so `state === "running"` is not a usable readiness signal.
 *
 * Either way the nodes get scheduled at t=0, which is already in the past once
 * audio truly starts, and nothing is ever audible. Gate on the clock instead.
 */

/** Resume `ac` from the current gesture, then run `fn` once its clock moves. */
export function unlockThen(ac: AudioContext, fn: () => void) {
  void ac.resume().catch(() => {});
  whenClockRuns(ac, fn);
}

/**
 * Run `fn` once the context's clock is genuinely advancing.
 *
 * Polls animation frames for currentTime to tick, and gives up after ~60 of
 * them so a browser that legitimately reports 0 still gets its audio.
 */
export function whenClockRuns(ac: AudioContext, fn: () => void) {
  if (ac.currentTime > 0) {
    fn();
    return;
  }
  let tries = 0;
  const tick = () => {
    if (ac.currentTime > 0 || tries++ > 60) {
      fn();
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
