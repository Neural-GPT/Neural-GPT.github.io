"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Menu, X, Terminal as TerminalIcon } from "lucide-react";
import { nav, profile } from "@/lib/data";
import Magnetic from "./ui/Magnetic";

/**
 * Nav
 * ---------------------------------------------------------------
 * Sticky header. The active link is tracked with IntersectionObserver
 * rather than scroll maths, and the underline is a shared layoutId so
 * framer-motion slides it between items.
 */
export default function Nav() {
  const [active, setActive] = useState("home");
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector(n.href))
      .filter(Boolean);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => io.observe(s));

    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-line bg-void/85 backdrop-blur-xl"
          : "border-b border-transparent",
      ].join(" ")}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        {/* mark */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 font-mono text-sm"
          aria-label="Back to top"
        >
          <span className="grid h-8 w-8 place-items-center rounded border border-line-bright bg-raised text-cyan transition-colors group-hover:border-cyan/60">
            <TerminalIcon size={15} strokeWidth={2} />
          </span>
          <span className="font-semibold tracking-tight text-ice">
            {profile.name}
          </span>
        </a>

        {/* desktop links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
          {nav.map((item) => {
            const id = item.href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={[
                  "relative rounded px-3 py-2 text-[0.82rem] transition-colors",
                  isActive ? "text-cyan" : "text-muted hover:text-ice",
                ].join(" ")}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2.5 -bottom-px h-px bg-cyan"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Magnetic strength={0.4} className="hidden sm:block">
            <a
              href={`/${profile.resumeFile}`}
              download
              className="flex items-center gap-2 rounded border border-line-bright bg-raised px-3.5 py-2 font-mono text-2xs tracking-wide text-ice transition-all hover:border-cyan hover:text-cyan hover:shadow-glow"
            >
              <Download size={13} />
              Résumé
            </a>
          </Magnetic>

          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded border border-line text-muted md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* mobile sheet */}
      <motion.nav
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden border-t border-line bg-void/95 backdrop-blur-xl md:hidden"
        aria-hidden={!open}
      >
        <div className="shell grid gap-1 py-3">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2.5 font-mono text-sm text-muted transition-colors hover:bg-raised hover:text-cyan"
            >
              <span className="text-dim">/ </span>
              {item.label}
            </a>
          ))}
          <a
            href={`/${profile.resumeFile}`}
            download
            className="mt-1 flex items-center gap-2 rounded border border-line-bright px-3 py-2.5 font-mono text-sm text-cyan"
          >
            <Download size={14} /> Download résumé
          </a>
        </div>
      </motion.nav>
    </header>
  );
}
