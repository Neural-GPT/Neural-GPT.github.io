"use client";

import { useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Tilt
 * ---------------------------------------------------------------
 * Gives a card real depth: it tilts in 3D toward wherever the
 * cursor is over it, then springs back flat the moment the pointer
 * leaves. Pairs naturally with GlowCard's cursor spotlight, which
 * already tracks the same pointer position for its glow -- together
 * they read as one lit, physically-present card rather than a flat
 * div with a border.
 *
 * Built on Framer Motion (already a project dependency) rather than
 * a separate tilt library, so there's nothing extra to install.
 *
 * Two perf details that matter more than they look:
 *  - The card's bounding rect is measured once on mouseenter, not on
 *    every mousemove. Calling getBoundingClientRect() inside a
 *    mousemove handler forces a synchronous layout read on every
 *    single event, and with several tilting cards on one page that
 *    adds up to real jank (including making page scroll feel sticky
 *    while the cursor passes over the grid).
 *  - The motion-value writes are batched to one requestAnimationFrame
 *    per frame, so a burst of mousemove events collapses into a
 *    single update instead of firing dozens of times per frame.
 *
 * `max` is the peak tilt in degrees at the card's edge. Kept modest
 * (6 degrees) with a fairly distant perspective (1400px) so it reads
 * as a subtle lift rather than a swinging card.
 */
export default function Tilt({
  children,
  className = "",
  max = 6,
  perspective = 1400,
  liftScale = 1.012,
  as = "div",
  ...rest
}) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const pendingRef = useRef(null);
  const rafRef = useRef(0);
  const still = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const s = useMotionValue(1);
  const srx = useSpring(rx, { stiffness: 220, damping: 24, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 220, damping: 24, mass: 0.6 });
  const ss = useSpring(s, { stiffness: 220, damping: 24, mass: 0.6 });

  const Tag = motion[as] ?? motion.div;

  const measure = useCallback(() => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  }, []);

  const flush = useCallback(() => {
    rafRef.current = 0;
    const p = pendingRef.current;
    if (!p) return;
    ry.set(p.px * max * 2);
    rx.set(p.py * -max * 2);
    s.set(liftScale);
  }, [max, liftScale, rx, ry, s]);

  const onMove = useCallback(
    (e) => {
      const r = rectRef.current;
      if (!r) return;
      pendingRef.current = {
        px: (e.clientX - r.left) / r.width - 0.5, // -0.5 .. 0.5
        py: (e.clientY - r.top) / r.height - 0.5,
      };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(flush);
    },
    [flush]
  );

  const onLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    rx.set(0);
    ry.set(0);
    s.set(1);
  }, [rx, ry, s]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  if (still) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseEnter={measure}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        scale: ss,
        transformPerspective: perspective,
        willChange: "transform",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
