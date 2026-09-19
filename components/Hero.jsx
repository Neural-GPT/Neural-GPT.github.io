"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { profile, education } from "@/lib/data";
import ParticleField from "./ParticleField";
import Terminal from "./Terminal";
import Magnetic from "./ui/Magnetic";

/**
 * Hero
 * ---------------------------------------------------------------
 * The one orchestrated page-load sequence on the site: the mesh
 * fades up, then the name, then the supporting copy, then the
 * terminal. Everything below the fold uses scroll-triggered reveals
 * instead, so the two never compete.
 */

const ease = [0.16, 1, 0.3, 1];

export default function Hero() {
  const still = useReducedMotion();

  const rise = (delay) => ({
    initial: still ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease },
  });

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center pt-24 pb-16"
    >
      <ParticleField />

      {/* cyan bloom behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[22%] h-[460px] w-[820px] max-w-[95vw] -translate-x-1/2 rounded-full bg-cyan/[0.07] blur-[130px]"
      />

      <div className="shell relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* ---------------- left: the claim ---------------- */}
        <div>
          <motion.p
            {...rise(0.05)}
            className="mb-5 font-mono text-2xs tracking-[0.22em] text-cyan-soft"
          >
            <span className="text-dim">// </span>
            {profile.role}
          </motion.p>

          <motion.h1
            {...rise(0.12)}
            className="text-balance font-mono text-[clamp(2.6rem,7.5vw,4.6rem)] font-bold leading-[0.95] tracking-tight"
          >
            <span className="text-ice">{profile.first}</span>{" "}
            <span className="glow-text text-cyan">{profile.last}</span>
          </motion.h1>

          <motion.p
            {...rise(0.2)}
            className="mt-5 max-w-[46ch] font-mono text-[1.02rem] leading-relaxed text-ice/90"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            {...rise(0.27)}
            className="mt-4 max-w-[54ch] text-[0.94rem] leading-relaxed text-muted"
          >
            {profile.blurb}
          </motion.p>

          {/* keyword chips */}
          <motion.ul
            {...rise(0.34)}
            className="mt-7 flex flex-wrap gap-2"
            aria-label="Focus areas"
          >
            {profile.keywords.map((k) => (
              <li key={k} className="chip">
                {k}
              </li>
            ))}
          </motion.ul>

          {/* actions */}
          <motion.div {...rise(0.42)} className="mt-9 flex flex-wrap gap-3">
            <Magnetic strength={0.35}>
              <a
                href="#projects"
                className="group flex items-center gap-2 rounded border border-cyan/60 bg-cyan/10 px-5 py-3 font-mono text-sm text-cyan transition-all hover:bg-cyan/20 hover:shadow-glow"
              >
                View projects
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Magnetic>

            <Magnetic strength={0.35}>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 rounded border border-line-bright px-5 py-3 font-mono text-sm text-ice transition-all hover:border-cyan hover:text-cyan"
              >
                <Mail size={15} />
                Get in touch
              </a>
            </Magnetic>
          </motion.div>

          <motion.p
            {...rise(0.5)}
            className="mt-8 font-mono text-2xs text-dim"
          >
            {education.short} @ {education.school} · class of {education.graduation} ·{" "}
            {profile.location}
          </motion.p>
        </div>

        {/* ---------------- right: the shell ---------------- */}
        <motion.div
          initial={still ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.3, ease }}
          className="relative"
        >
          <Terminal />

          <p className="mt-3 text-center font-mono text-2xs text-dim">
            This shell is live — type a command.
          </p>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute inset-x-0 bottom-6 hidden justify-center lg:flex"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-2xs tracking-[0.2em] text-dim">
            scroll
          </span>
          <span className="h-9 w-px bg-gradient-to-b from-cyan/70 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
