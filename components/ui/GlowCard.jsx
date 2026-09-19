"use client";

import { useRef, useCallback } from "react";

/**
 * GlowCard
 * ---------------------------------------------------------------
 * A panel whose border brightens and whose interior picks up a soft
 * cyan spotlight that follows the cursor. Position is written to CSS
 * custom properties rather than React state, so moving the mouse
 * never triggers a re-render.
 */
export default function GlowCard({
  children,
  className = "",
  as: Tag = "div",
  ticks = true,
  ...rest
}) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      className={[
        "group relative overflow-hidden edge",
        ticks ? "ticks" : "",
        "transition-[border-color,box-shadow,transform] duration-300",
        "hover:border-[rgba(255,255,255,0.3)]",
        "hover:shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_18px_50px_-24px_rgba(34,211,238,0.5)]",
        className,
      ].join(" ")}
      {...rest}
    >
      {/* cursor spotlight */}
      <span
        aria-hidden
        className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* top hairline that lights up */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </Tag>
  );
}
