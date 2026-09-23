"use client";

import { useEffect, useRef } from "react";

/**
 * HeartbeatDivider
 * ---------------------------------------------------------------
 * A live ECG strip, generated sample by sample on a canvas — not a
 * looping image. Each beat's timing (R-R interval) and the amplitude
 * of every wave (P/Q/R/S/T) carry small random jitter regenerated at
 * every beat, so the trace never repeats exactly, the way a real
 * heart never beats identically twice. The BPM readout and the tag's
 * pulse dot are driven off that same generator, not separate fake
 * timers — when the dot pulses, that's the actual R-wave crossing.
 *
 * Zero React re-renders: canvas + one rAF loop per divider, paused
 * via IntersectionObserver when off-screen and on tab-hide, matching
 * ParticleField's performance pattern.
 */
export default function HeartbeatDivider({ label = "SIGNAL" }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const bpmRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1;
    let running = true;
    let raf = 0;
    let lastTs = 0;
    let colorTick = 0;
    let color = "34,211,238";

    const STEP = 2; // px between generated samples
    let samples = [];
    let accPx = 0; // fractional scroll px carried between frames

    let phase = 0; // 0..1 within the current beat
    let msPerBeat = 900;
    const speedPxPerMs = 0.075; // slower, calmer sweep than before
    let jig = newJig();

    function newJig() {
      const r = () => (Math.random() - 0.5) * 0.01; // timing jitter
      const a = () => 0.9 + Math.random() * 0.2; // amplitude jitter
      return {
        pj: r(), pa: a(),
        qrsShift: r() * 1.4,
        qa: a(), ra: a(), sa: a(),
        tj: r(), ta: a(),
      };
    }

    function gauss(x, mu, sigma, amp) {
      const d = (x - mu) / sigma;
      return amp * Math.exp(-0.5 * d * d);
    }

    // The QRS complex is what makes an ECG read as an ECG: it's not a
    // smooth bump like P and T, it's a near-vertical spike. A gaussian
    // can't produce that — it's built from straight line segments
    // instead, the way the trace actually snaps between deflections.
    function qrs(phase, start, j) {
      const p = phase - start;
      if (p < 0 || p > 0.1) return 0;
      const pts = [
        [0, 0],
        [0.026, -0.11 * j.qa], // Q — small dip
        [0.048, 1.0 * j.ra],   // R — sharp tall spike
        [0.07, -0.3 * j.sa],   // S — sharp dip
        [0.1, 0],
      ];
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[i + 1];
        if (p >= x0 && p <= x1) {
          const t = (p - x0) / (x1 - x0);
          return y0 + (y1 - y0) * t;
        }
      }
      return 0;
    }

    // One cardiac cycle, phase 0..1 -> normalized amplitude. Long flat
    // stretches by construction (P and T decay to ~0 away from their
    // centers, QRS is exactly 0 outside its own narrow window) — the
    // trace only ever leaves the baseline where a real one would.
    function beatShape(p, j) {
      let y = 0;
      y += gauss(p, 0.15 + j.pj, 0.015, 0.09 * j.pa); // P — gentle bump
      y += qrs(p, 0.255 + j.qrsShift, j); // QRS — sudden, sharp
      y += gauss(p, 0.47 + j.tj, 0.05, 0.16 * j.ta); // T — gentle, broad
      return y;
    }

    function readColor() {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-rgb")
        .trim();
      if (v) color = v;
    }

    function fireBeat() {
      msPerBeat = 820 + Math.random() * 200; // organic ~60-73bpm resting range
      jig = newJig();
      const bpm = Math.round(60000 / msPerBeat);
      if (bpmRef.current) bpmRef.current.textContent = `${bpm} bpm`;
      if (dotRef.current) {
        dotRef.current.classList.remove("ecg-beat");
        void dotRef.current.offsetWidth; // restart the CSS animation
        dotRef.current.classList.add("ecg-beat");
      }
    }

    function resize() {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const need = Math.ceil(W / STEP) + 2;
      const prev = samples;
      samples = Array.from(
        { length: need },
        (_, i) => prev[prev.length - need + i] ?? 0
      );
    }

    function draw() {
      const midY = H * 0.55;
      const amp = H * 0.36;

      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      let lastX = 0, lastY = midY;
      samples.forEach((y, i) => {
        const x = i * STEP;
        const py = midY - y * amp;
        if (i === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
        lastX = x; lastY = py;
      });
      ctx.strokeStyle = `rgba(${color},0.95)`;
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.shadowBlur = 7;
      ctx.shadowColor = `rgba(${color},0.6)`;
      ctx.stroke();

      // bright "pen tip" at the live edge, like a real monitor's sweep
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,0.9)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function tick(ts) {
      if (!running) return;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(48, ts - lastTs); // clamp so a stalled tab can't jump
      lastTs = ts;

      accPx += dt * speedPxPerMs;
      const newPx = Math.floor(accPx);
      if (newPx > 0) {
        accPx -= newPx;
        const steps = Math.max(1, Math.round(newPx / STEP));
        for (let i = 0; i < steps; i++) {
          phase += STEP / speedPxPerMs / msPerBeat;
          if (phase >= 1) {
            phase -= 1;
            fireBeat();
          }
          samples.push(beatShape(phase, jig));
          const maxLen = Math.ceil(W / STEP) + 2;
          if (samples.length > maxLen) samples.shift();
        }
      }

      if (colorTick++ % 24 === 0) readColor();
      draw();

      raf = requestAnimationFrame(tick);
    }

    resize();
    readColor();

    if (still) {
      // one representative beat, drawn once, no scrolling
      for (let i = 0; i < samples.length; i++) {
        samples[i] = beatShape((i * STEP * 0.0022) % 1, jig);
      }
      draw();
      return () => {};
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        const should = entry.isIntersecting && !document.hidden;
        if (should && !running) {
          running = true;
          lastTs = 0;
          raf = requestAnimationFrame(tick);
        } else if (!should && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        lastTs = 0;
        raf = requestAnimationFrame(tick);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={wrapRef} className="ecg" role="presentation" aria-hidden="true">
      <canvas ref={canvasRef} className="ecg-canvas" />
      <span className="ecg-fade ecg-fade-l" />
      <span className="ecg-fade ecg-fade-r" />
      <div className="ecg-tag">
        <span ref={dotRef} className="ecg-dot" />
        <span>{label}</span>
        <span ref={bpmRef} className="ecg-bpm">72 bpm</span>
      </div>
    </div>
  );
}
