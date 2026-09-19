"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Magnetic
 * ---------------------------------------------------------------
 * The element leans toward the cursor while the pointer is inside
 * its box, then springs home on leave. `strength` is the fraction
 * of the distance from centre that the element travels — 0.35 is
 * noticeable on a button, 0.12 is right for a large card.
 *
 * Pointer-coarse devices and reduced-motion users get a plain
 * wrapper with no listeners attached at all.
 */
export default function Magnetic({
  children,
  className = "",
  strength = 0.3,
  radius = 0,          // extra px beyond the box that still attracts
  as = "div",
  ...rest
}) {
  const ref = useRef(null);
  const still = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

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
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const max = Math.max(r.width, r.height) / 2 + radius;
    const dist = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - dist / (max * 1.6));
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
