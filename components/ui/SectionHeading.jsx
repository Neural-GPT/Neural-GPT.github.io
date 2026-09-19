"use client";

import { motion } from "framer-motion";

/**
 * SectionHeading
 * ---------------------------------------------------------------
 * The `//` marker borrowed from source-comment syntax, a heading,
 * and a rule that draws itself once when the section scrolls in.
 * `action` slots a link to the right of the rule.
 */
export default function SectionHeading({ id, label, note, action }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id={id}
          className="font-mono text-[0.95rem] tracking-[0.12em] text-cyan-soft"
        >
          <span className="text-dim">// </span>
          {label}
        </h2>
        {action}
      </div>

      <motion.div
        className="section-rule mt-3 origin-left"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />

      {note ? (
        <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">
          {note}
        </p>
      ) : null}
    </div>
  );
}
