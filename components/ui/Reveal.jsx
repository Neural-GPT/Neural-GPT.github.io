"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal / Stagger
 * ---------------------------------------------------------------
 * Two primitives that every section reuses so entry motion stays
 * consistent and is defined in exactly one place.
 *
 *   <Stagger>            wraps a group, times the children
 *     <Reveal>…</Reveal> a single item: fade + rise + slight scale
 *   </Stagger>
 *
 * Both collapse to a plain fade when the visitor prefers reduced
 * motion, so nothing is lost and nothing moves.
 */

export function Stagger({
  children,
  className = "",
  delay = 0,
  step = 0.07,
  as = "div",
  once = true,
  amount = 0.2,
}) {
  const still = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren: delay,
            staggerChildren: still ? 0 : step,
          },
        },
      }}
    >
      {children}
    </Tag>
  );
}

export function Reveal({
  children,
  className = "",
  y = 18,
  scale = 0.985,
  duration = 0.55,
  as = "div",
}) {
  const still = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      className={className}
      variants={{
        hidden: still
          ? { opacity: 0 }
          : { opacity: 0, y, scale, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: still ? 0.2 : duration, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </Tag>
  );
}

/** Standalone reveal for elements that are not inside a <Stagger>. */
export function RevealOnce({ children, className = "", delay = 0, y = 18 }) {
  const still = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={still ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
