/**
 * ecg.js
 * ---------------------------------------------------------------
 * A tiny synthetic-ECG generator. It is a pure function of time
 * (seconds) so the canvas can sample it at any rate it likes.
 *
 * Each heartbeat is the classic P-QRS-T complex built from gaussians,
 * positioned relative to the R peak, with widths taken from real
 * lead-II morphology (R is a ~20 ms needle, T is a broad ~100 ms hump).
 *
 * What keeps it from looking like a looping GIF:
 *  - RR intervals are never identical: respiratory sinus arrhythmia
 *    (rate swells and falls with a ~4 s breathing cycle), a slow
 *    drift, and per-beat jitter.
 *  - Beat amplitude varies a few percent and follows the breathing
 *    cycle, as it does on a real strip.
 *  - The T wave moves with the heart rate (QT shortens when faster).
 *  - Baseline wander from breathing, plus a little sensor noise.
 *
 * Output is normalised so a typical R peak is ~1.0.
 */

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;
const g = (x, mu, sigma) => {
  const d = (x - mu) / sigma;
  return Math.exp(-0.5 * d * d);
};

export function createEcg({ seed = 1, bpm = 72 } = {}) {
  const rand = mulberry32(seed * 9973 + 17);
  const gauss = () => {
    const u = Math.max(rand(), 1e-9);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rand());
  };

  const phaseResp = rand() * TAU;
  const phaseDrift = rand() * TAU;
  const phaseWander = rand() * TAU;
  const phaseNoise = rand() * TAU;

  const baseRR = 60 / bpm;
  let beats = [];
  let nextT = 0.35 + rand() * 0.35; // first R peak
  let reportedUpTo = -Infinity;

  function addBeat() {
    const t = nextT;
    const resp = Math.sin(TAU * 0.24 * t + phaseResp); // ~4 s breathing
    const drift = Math.sin((TAU * t) / 23 + phaseDrift);
    // Faster on the in-breath, slower on the out-breath.
    const rr = baseRR * (1 - 0.05 * resp) * (1 + 0.03 * drift) * (1 + gauss() * 0.016);
    beats.push({
      t,
      rr,
      r: 1 + gauss() * 0.03 + 0.05 * resp,
      p: 1 + gauss() * 0.08,
      tw: 1 + gauss() * 0.07 - 0.06 * resp,
      tc: 0.17 + 0.09 * rr, // QT tracks the RR interval
    });
    nextT = t + rr;
  }

  function sample(t) {
    while (nextT < t + 0.9) addBeat();
    while (beats.length > 2 && beats[1].t < t - 1.2) beats.shift();

    let v = 0;
    for (let i = 0; i < beats.length; i++) {
      const b = beats[i];
      const dt = t - b.t;
      if (dt < -0.4 || dt > 0.75) continue;
      v +=
        0.11 * b.p * g(dt, -0.17, 0.024) + //  P  atrial depolarisation
        -0.13 * g(dt, -0.032, 0.0085) + //  Q  small septal dip
        1.0 * b.r * g(dt, 0, 0.0105) + //  R  the spike
        -0.27 * g(dt, 0.03, 0.0115) + //  S  undershoot
        0.03 * g(dt, 0.075, 0.03) + //  ST segment lift
        0.27 * b.tw * g(dt, b.tc, 0.052) + //  T  ventricular repolarisation
        0.05 * b.tw * g(dt, b.tc + 0.06, 0.04); //  T  slightly skewed tail
    }

    // baseline wander (breathing + slower motion) and sensor noise
    v += 0.028 * Math.sin(TAU * 0.24 * t + phaseWander);
    v += 0.014 * Math.sin(TAU * 0.06 * t + phaseDrift);
    v += 0.006 * Math.sin(TAU * 43 * t + phaseNoise) + gauss() * 0.004;
    return v;
  }

  /**
   * True once each time the sample clock passes an R peak. Lets the UI
   * pulse in the same frame the spike is drawn.
   */
  function beatPassed(t) {
    let hit = null;
    for (const b of beats) {
      if (b.t <= t && b.t > reportedUpTo) hit = b;
    }
    if (hit) {
      reportedUpTo = hit.t;
      return 60 / hit.rr;
    }
    return 0;
  }

  return { sample, beatPassed };
}
