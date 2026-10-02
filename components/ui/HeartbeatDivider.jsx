"use client";

import { useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { createEcg } from "@/lib/ecg";

/**
 * HeartbeatDivider
 * ---------------------------------------------------------------
 * A live ECG strip that sits between two sections.
 *
 * It behaves like a bedside monitor: a bright write-head sweeps left
 * to right laying down the trace, the trace fades behind it like
 * phosphor persistence, and a short gap just ahead of the head is
 * erased. The waveform itself comes from lib/ecg.js — a full P-QRS-T
 * complex with beat-to-beat variability, so the spikes are never
 * identical and the rhythm breathes.
 *
 * Performance notes:
 *  - One canvas and one rAF loop per divider, no React state.
 *  - The loop only runs while the divider is on screen.
 *  - The trace is stroked in ~40 alpha buckets instead of per-column.
 *  - The accent colour is re-read from the --accent-rgb CSS variable
 *    twice a second, so the terminal's `theme` command recolours it.
 *  - prefers-reduced-motion renders one static strip and stops.
 */

const BUCKETS = 40;

function readAccent() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-rgb")
    .trim();
  const parts = raw.split(/[\s,]+/).map(Number);
  return parts.length >= 3 && parts.every((n) => Number.isFinite(n))
    ? parts.slice(0, 3)
    : [34, 211, 238];
}

export default function HeartbeatDivider({ seed = 1, bpm = 72, className = "" }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const heartRef = useRef(null);
  const bpmRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ecg = createEcg({ seed, bpm });

    let W = 1;
    let H = 1;
    let dpr = 1;
    let ys = new Float32Array(1);
    let col = 0; // newest written column
    let acc = 0; // sub-pixel progress toward the next column
    let simT = 0; // sample clock, seconds
    let raf = 0;
    let lastTs = 0;
    let visible = false;
    let rgb = readAccent();
    let lastTheme = 0;
    let lastReadout = 0;
    let shownBpm = bpm;

    const speed = () => (W < 640 ? 120 : 170); // px per second
    const baseY = () => H * 0.64;
    const amp = () => H * 0.54;
    const rgba = (a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

    function resize() {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ys = new Float32Array(W).fill(NaN);
      col = 0;
      acc = 0;
      if (still) drawStatic();
      else draw();
    }

    function drawBaseline() {
      ctx.beginPath();
      ctx.moveTo(0, baseY());
      ctx.lineTo(W, baseY());
      ctx.strokeStyle = rgba(0.1);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    /* Reduced motion: a single frozen strip, no fade, no head. */
    function drawStatic() {
      ctx.clearRect(0, 0, W, H);
      drawBaseline();
      const sp = speed();
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const y = baseY() - ecg.sample(0.4 + x / sp) * amp();
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x + 0.5, y);
      }
      ctx.lineJoin = "round";
      ctx.strokeStyle = rgba(0.75);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      drawBaseline();

      const gap = Math.min(60, Math.max(24, W * 0.04));
      const L = Math.max(2, Math.floor(W - gap)); // visible trail length, px
      const by = baseY();
      const a = amp();

      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let b = 0; b < BUCKETS; b++) {
        const k0 = Math.floor((b / BUCKETS) * L);
        const k1 = Math.min(L, Math.floor(((b + 1) / BUCKETS) * L) + 1);
        const mid = (b + 0.5) / BUCKETS;
        const alpha = 0.92 * Math.pow(1 - mid, 1.15);
        if (alpha < 0.02) continue;

        ctx.beginPath();
        let pen = false;
        for (let k = k0; k <= k1; k++) {
          const c = (col - k + W * 2) % W;
          const v = ys[c];
          if (Number.isNaN(v)) {
            pen = false;
            continue;
          }
          const x = c + 0.5;
          const y = by - v * a;
          // break the path where the buffer wraps around
          if (!pen || c === W - 1) {
            ctx.moveTo(x, y);
            pen = true;
          } else {
            ctx.lineTo(x, y);
          }
        }

        if (mid < 0.5) {
          ctx.strokeStyle = rgba(alpha * 0.16);
          ctx.lineWidth = 5;
          ctx.stroke();
        }
        ctx.strokeStyle = rgba(alpha);
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // write-head: glows harder the bigger the current deflection
      const hv = ys[col];
      if (!Number.isNaN(hv)) {
        const hx = col + 0.5 + acc;
        const hy = by - hv * a;
        const heat = Math.min(1, Math.abs(hv) * 1.4);
        const rad = 9 + heat * 12;
        const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, rad);
        grad.addColorStop(0, rgba(0.55 + heat * 0.4));
        grad.addColorStop(1, rgba(0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(hx, hy, rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(232,246,255,0.95)";
        ctx.beginPath();
        ctx.arc(hx, hy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function pulseHeart() {
      const el = heartRef.current;
      if (!el || !el.animate) return;
      el.animate(
        [
          { transform: "scale(1)", filter: "drop-shadow(0 0 0 transparent)" },
          { transform: "scale(1.45)", filter: "drop-shadow(0 0 5px currentColor)", offset: 0.25 },
          { transform: "scale(1)", filter: "drop-shadow(0 0 0 transparent)" },
        ],
        { duration: 380, easing: "ease-out" }
      );
    }

    function frame(ts) {
      if (!visible) return;
      raf = requestAnimationFrame(frame);

      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
      lastTs = ts;

      // advance the write head one pixel column at a time
      const sp = speed();
      acc += dt * sp;
      while (acc >= 1) {
        acc -= 1;
        col = (col + 1) % W;
        simT += 1 / sp;
        ys[col] = ecg.sample(simT);
      }

      const hr = ecg.beatPassed(simT);
      if (hr) {
        pulseHeart();
        shownBpm += (hr - shownBpm) * 0.35;
      }

      if (ts - lastTheme > 500) {
        rgb = readAccent();
        lastTheme = ts;
      }
      if (ts - lastReadout > 600 && bpmRef.current) {
        bpmRef.current.textContent = String(Math.round(shownBpm));
        lastReadout = ts;
      }

      draw();
    }

    function start() {
      if (still || raf) return;
      lastTs = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        visible ? start() : stop();
      },
      { rootMargin: "160px 0px" }
    );
    io.observe(wrap);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const r = wrap.getBoundingClientRect();
        // ignore the observer's initial callback; only rebuild on a real size change
        if (Math.floor(r.width) !== W || Math.floor(r.height) !== H) resize();
      }, 120);
    });
    ro.observe(wrap);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
    };
  }, [seed, bpm]);

  return (
    <div aria-hidden="true" className={`relative z-10 select-none ${className}`}>
      <div className="shell flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-dim">
        <span className="flex items-center gap-2">
          <span ref={heartRef} className="inline-flex text-cyan">
            <Heart size={11} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="text-muted">Live</span>
          <span className="text-dim/70">· Lead II</span>
        </span>
        <span className="tabular-nums">
          <span ref={bpmRef} className="text-cyan-soft">
            {bpm}
          </span>{" "}
          bpm
        </span>
      </div>

      <div ref={wrapRef} className="ecg-strip relative mt-1 h-[76px] w-full sm:h-[92px]">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
      </div>
    </div>
  );
}
