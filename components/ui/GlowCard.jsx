"use client";

import { useRef, useCallback, useEffect } from "react";

/**
 * GlowCard
 * ---------------------------------------------------------------
 * A panel whose border brightens and whose interior picks up a soft
 * cyan spotlight that follows the cursor. Position is written to CSS
 * custom properties rather than React state, so moving the mouse
 * never triggers a re-render.
 *
 * The rect is read once on mouseenter (or a real resize/scroll), not
 * on every mousemove — calling getBoundingClientRect() inside a
 * mousemove handler forces a synchronous layout read on every single
 * event firing, which is a classic source of scroll jank when it's
 * happening across several cards on the page at once. The actual
 * style write is also batched to one requestAnimationFrame per
 * frame, so a burst of mousemove events collapses into a single
 * paint instead of one per event.
 */
export default function GlowCard({
  children,
  className = "",
  as: Tag = "div",
  ticks = true,
  ...rest
}) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const pendingRef = useRef(null);
  const rafRef = useRef(0);

  const measure = useCallback(() => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  }, []);

  const flush = useCallback(() => {
    rafRef.current = 0;
    const el = ref.current;
    const p = pendingRef.current;
    if (!el || !p) return;
    el.style.setProperty("--mx", `${p.x}px`);
    el.style.setProperty("--my", `${p.y}px`);
  }, []);

  const onMove = useCallback(
    (e) => {
      const r = rectRef.current;
      if (!r) return;
      pendingRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(flush);
    },
    [flush]
  );

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <Tag
      ref={ref}
      onMouseEnter={measure}
      onMouseMove={onMove}
      className={[
        "group relative overflow-hidden edge",
        ticks ? "ticks" : "",
        "transition-[border-color,box-shadow,transform] duration-300",
        "hover:border-[rgba(255,255,255,0.3)]",
        "hover:shadow-[0_0_0_1px_rgb(var(--accent-rgb)/0.28),0_18px_50px_-24px_rgb(var(--accent-rgb)/0.5)]",
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
