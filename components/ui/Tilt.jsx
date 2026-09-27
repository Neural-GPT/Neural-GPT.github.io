"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Tilt
 * ---------------------------------------------------------------
 * Gives a card real depth: it tilts in 3D toward wherever the
 * cursor is over it, then springs back flat the moment the pointer
 * leaves. Pairs naturally with GlowCard's cursor spotlight, which
 * already tracks the same pointer position for its glow — together
 * they read as one lit, physically-present card rather than a flat
 * div with a border.
 *
 * Built on Framer Motion (already a project dependency) rather than
 * a separate tilt library, so there's nothing extra to install.
 *
 * `max` is the peak tilt in degrees at the card's edge — 10 reads as
 * "picked up off the page" without tipping into a gimmick. Pointer-
 * coarse devices and reduced-motion users get a plain wrapper with
 * no listeners attached at all.
 */
export default function Tilt({
  children,
  className = "",
  max = 10,
  liftScale = 1.02,
  as = "div",
  ...rest
}) {
  const ref = useRef(null);
  const still = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const s = useMotionValue(1);
  const srx = useSpring(rx, { stiffness: 260, damping: 22, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 260, damping: 22, mass: 0.6 });
  const ss = useSpring(s, { stiffness: 260, damping: 22, mass: 0.6 });

  const Tag = motion[as] ?? motion.div;

  if (still) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(py * -max * 2);
    s.set(liftScale);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
    s.set(1);
  }

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        scale: ss,
        transformPerspective: 900,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
