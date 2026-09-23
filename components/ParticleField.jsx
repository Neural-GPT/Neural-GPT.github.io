"use client";

import { useEffect, useRef } from "react";

/**
 * ParticleField
 * ---------------------------------------------------------------
 * A drifting node mesh drawn on a 2D canvas behind the hero, styled
 * as a neural network: nodes connect when close enough, and short
 * bright pulses travel along a random live connection every so often,
 * the way an activation fires across a synapse. That firing is what
 * reads as "neural network" rather than "constellation" — the mesh
 * shape alone doesn't carry that on its own.
 *
 * Performance notes, because this runs on every page load:
 *  - One canvas, one rAF loop, zero React state. Nothing re-renders.
 *  - Neighbour search is bucketed into a spatial grid, so link cost is
 *    roughly O(n) instead of the O(n²) every-pair comparison.
 *  - Pulses are sampled from the edges already drawn this frame, so
 *    finding a valid A→B pair costs nothing extra — no additional
 *    distance checks.
 *  - The loop stops entirely when the hero scrolls out of view or the
 *    tab is hidden.
 *  - Node count scales with viewport area and is capped on small screens.
 *  - prefers-reduced-motion draws a single static frame and exits.
 */
export default function ParticleField({
  className = "",
  density = 0.00009, // nodes per px² of viewport
  maxNodes = 130,
  linkDist = 138,
  parallax = 26, // px the whole field drifts across the viewport
  pulseEvery = 550, // ms between spawning a new signal pulse
  maxPulses = 7,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let raf = 0;
    let running = true;

    // Signal pulses travelling along a live edge, plus the pool of
    // edges to spawn them from — refilled each frame as a side effect
    // of the link-drawing pass below, so sampling one is free.
    let pulses = [];
    let edgeSample = [];
    let pulseTimer = 0;

    // pointer, in canvas space; target vs eased for smooth parallax
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const drift = { x: 0, y: 0, tx: 0, ty: 0 };

    function resize() {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const target = Math.min(
        maxNodes,
        Math.max(28, Math.round(width * height * density))
      );
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.5 + 0.6,
        // depth drives both parallax amount and brightness
        z: Math.random() * 0.75 + 0.25,
      }));
      // old pulses may reference nodes that no longer exist post-resize
      pulses = [];
    }

    // Spatial hash so we only compare nodes in adjacent buckets.
    function buildGrid() {
      const cell = linkDist;
      const cols = Math.max(1, Math.ceil(width / cell));
      const rows = Math.max(1, Math.ceil(height / cell));
      const grid = Array.from({ length: cols * rows }, () => []);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const cx = Math.min(cols - 1, Math.max(0, Math.floor(n.x / cell)));
        const cy = Math.min(rows - 1, Math.max(0, Math.floor(n.y / cell)));
        grid[cy * cols + cx].push(i);
      }
      return { grid, cols, rows, cell };
    }

    function step() {
      // ease pointer + global drift
      drift.x += (drift.tx - drift.x) * 0.06;
      drift.y += (drift.ty - drift.y) * 0.06;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        // wrap rather than bounce — no visible walls
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      const { grid, cols, rows, cell } = buildGrid();

      // refilled below as a byproduct of drawing links; pulses sample from it
      edgeSample.length = 0;

      // ---- links -------------------------------------------------
      ctx.lineWidth = 1;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const bucket = grid[cy * cols + cx];
          if (!bucket.length) continue;

          for (let ox = 0; ox <= 1; ox++) {
            for (let oy = ox === 0 ? 0 : -1; oy <= 1; oy++) {
              const nx = cx + ox;
              const ny = cy + oy;
              if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
              const other = grid[ny * cols + nx];
              if (!other.length) continue;
              const same = ox === 0 && oy === 0;

              for (let a = 0; a < bucket.length; a++) {
                const A = nodes[bucket[a]];
                for (let b = same ? a + 1 : 0; b < other.length; b++) {
                  const B = nodes[other[b]];
                  const dx = A.x - B.x;
                  const dy = A.y - B.y;
                  const d2 = dx * dx + dy * dy;
                  if (d2 > linkDist * linkDist) continue;

                  const d = Math.sqrt(d2);
                  const fade = 1 - d / linkDist;
                  const depth = (A.z + B.z) / 2;

                  // links near the cursor read brighter and cyan
                  const mx = (A.x + B.x) / 2 - pointer.x;
                  const my = (A.y + B.y) / 2 - pointer.y;
                  const near = pointer.active
                    ? Math.max(0, 1 - Math.hypot(mx, my) / 190)
                    : 0;

                  const alpha = fade * 0.2 * depth + near * fade * 0.5;
                  if (alpha < 0.012) continue;

                  // a visibly-drawn edge is fair game for a pulse to travel along
                  if (alpha > 0.05 && edgeSample.length < 260) {
                    edgeSample.push(A, B);
                  }

                  ctx.strokeStyle = near > 0.05
                    ? `rgba(120,225,255,${alpha})`
                    : `rgba(150,190,255,${alpha})`;

                  const px = drift.x * depth;
                  const py = drift.y * depth;
                  ctx.beginPath();
                  ctx.moveTo(A.x + px, A.y + py);
                  ctx.lineTo(B.x + px, B.y + py);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      // ---- nodes -------------------------------------------------
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const px = n.x + drift.x * n.z;
        const py = n.y + drift.y * n.z;

        const near = pointer.active
          ? Math.max(0, 1 - Math.hypot(px - pointer.x, py - pointer.y) / 170)
          : 0;

        const r = n.r * (1 + near * 1.5);
        const alpha = 0.22 * n.z + near * 0.65;

        if (near > 0.35) {
          ctx.shadowBlur = 12 * near;
          ctx.shadowColor = "rgba(34,211,238,0.85)";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = near > 0.2
          ? `rgba(180,240,255,${alpha})`
          : `rgba(200,220,255,${alpha})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // ---- signal pulses ------------------------------------------
      // A short bright dot travelling A→B along a connection that's
      // already on screen — the "activation firing" that makes this
      // read as a neural net rather than a static star map.
      pulseTimer += 16; // approx ms/frame; a decorative timer, not physics
      if (pulseTimer > pulseEvery && pulses.length < maxPulses && edgeSample.length >= 2) {
        pulseTimer = 0;
        const pairs = edgeSample.length / 2;
        const i = (Math.floor(Math.random() * pairs) * 2) | 0;
        pulses.push({
          A: edgeSample[i],
          B: edgeSample[i + 1],
          t: 0,
          dur: 480 + Math.random() * 420,
        });
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += 16;
        if (p.t >= p.dur) {
          pulses.splice(i, 1);
          continue;
        }
        const k = p.t / p.dur;
        // ease in/out so the pulse doesn't feel linear-robotic
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const fade = Math.sin(Math.PI * k); // fades in, peaks mid-flight, fades out
        const depth = (p.A.z + p.B.z) / 2;

        const px = p.A.x + (p.B.x - p.A.x) * e + drift.x * depth;
        const py = p.A.y + (p.B.y - p.A.y) * e + drift.y * depth;

        ctx.shadowBlur = 13;
        ctx.shadowColor = "rgba(34,211,238,0.9)";
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(195,247,255,${0.85 * fade})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function loop() {
      if (!running) return;
      step();
      raf = requestAnimationFrame(loop);
    }

    function onPointer(e) {
      const rect = wrap.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.active = true;
      // normalised -1..1 for the whole-field drift
      drift.tx = ((e.clientX - rect.left) / rect.width - 0.5) * -2 * parallax;
      drift.ty = ((e.clientY - rect.top) / rect.height - 0.5) * -2 * parallax;
    }

    function onLeave() {
      pointer.active = false;
      pointer.tx = -9999;
      pointer.ty = -9999;
      drift.tx = 0;
      drift.ty = 0;
    }

    resize();

    if (still) {
      step(); // one static frame, then stop
      return () => {};
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        const shouldRun = entry.isIntersecting && !document.hidden;
        if (shouldRun && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!shouldRun && running) {
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
        raf = requestAnimationFrame(loop);
      }
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, maxNodes, linkDist, parallax, pulseEvery, maxPulses]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* fade the mesh out toward the bottom so text stays legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />
    </div>
  );
}
