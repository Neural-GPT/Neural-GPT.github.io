"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { research } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Stagger, Reveal } from "./ui/Reveal";
import GlowCard from "./ui/GlowCard";

/**
 * Research
 * ---------------------------------------------------------------
 * A real sequence, so a timeline with numbered-feeling markers is
 * the honest structure here. The spine draws itself on scroll; the
 * dots are keyed to status (done / upcoming / pending).
 */

const STATUS = {
  completed: { label: "completed", dot: "bg-cyan", ring: "ring-cyan/30" },
  upcoming: { label: "starts Nov 2026", dot: "bg-cyan-soft", ring: "ring-cyan-soft/25" },
  pending: { label: "result pending", dot: "bg-amber-400", ring: "ring-amber-400/25" },
};

const logLines = [
  ["2025-10", "Smart Attendance System shipped (Flutter + MobileNetV2)"],
  ["2026-03", "PatchCore reproduced — 0.99 AUC on MVTec AD"],
  ["2026-04", "Research internship begins at IIT Bhubaneswar"],
  ["2026-06", "Jal Rakshak deployed to Android and Windows"],
  ["2026-07", "DynaBERT compression: 1.78× speedup, 94.6% accuracy kept"],
  ["2026-08", "LeetTrack live — 150+ students onboard"],
  ["2026-11", "IIT Roorkee internship starts · Sakura result due"],
  ["2027-01", "Possible research exchange, Iwate Prefectural University"],
];

export default function Research() {
  return (
    <section id="research" className="relative scroll-mt-24 py-24">
      <div className="shell">
        <SectionHeading
          id="research-heading"
          label="RESEARCH & EXPERIENCE"
          note="Where the work has been formally supervised, and what came out of it."
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ---- timeline ---- */}
          <Stagger className="relative" step={0.12}>
            {/* spine */}
            <motion.span
              aria-hidden
              className="absolute left-[7px] top-2 w-px origin-top bg-gradient-to-b from-cyan/60 via-line-bright to-transparent"
              style={{ bottom: "1rem" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />

            <ol className="grid gap-7">
              {research.map((item) => {
                const s = STATUS[item.status] ?? STATUS.completed;
                return (
                  <Reveal as="li" key={item.id} className="relative pl-8">
                    <span
                      aria-hidden
                      className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full ring-4 ${s.ring} ${s.dot}`}
                    />

                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="font-mono text-2xs tracking-wide text-cyan">
                        {item.period}
                      </p>
                      <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.62rem] text-dim">
                        {s.label}
                      </span>
                    </div>

                    <h3 className="mt-2 font-mono text-base font-semibold text-ice">
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 hover:text-cyan"
                        >
                          {item.role}
                          <ArrowUpRight
                            size={14}
                            className="text-dim transition-colors group-hover:text-cyan"
                          />
                        </a>
                      ) : (
                        item.role
                      )}
                    </h3>
                    <p className="font-mono text-[0.8rem] text-cyan-soft">
                      {item.org}
                    </p>

                    <ul className="mt-3 grid gap-2">
                      {item.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-2 text-[0.85rem] leading-relaxed text-muted"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.45em] h-px w-2.5 shrink-0 bg-line-bright"
                          />
                          {b}
                        </li>
                      ))}
                    </ul>

                    {item.stats.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {item.stats.map((st) => (
                          <li
                            key={st.label}
                            className="rounded border border-line bg-raised px-3 py-2"
                          >
                            <p className="font-mono text-sm font-semibold text-cyan">
                              {st.value}
                            </p>
                            <p className="font-mono text-[0.62rem] text-dim">
                              {st.label}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Reveal>
                );
              })}
            </ol>
          </Stagger>

          {/* ---- log ---- */}
          <Stagger delay={0.15}>
            <Reveal>
              <GlowCard className="crt h-full bg-[#02031a] p-5">
                <p className="mb-4 font-mono text-2xs text-dim">
                  <span className="text-cyan">&gt;</span> research_log --tail
                </p>

                <ul className="grid gap-2 font-mono text-[0.78rem] leading-relaxed">
                  {logLines.map(([stamp, text]) => (
                    <li key={stamp + text} className="flex gap-3">
                      <span className="shrink-0 text-cyan/80">[{stamp}]</span>
                      <span className="text-ice/75">{text}</span>
                    </li>
                  ))}
                </ul>

                <blockquote className="mt-6 border-t border-line pt-5 font-mono text-[0.82rem] leading-relaxed text-ice/80">
                  Research is not just about finding answers. It&apos;s about
                  asking better questions.
                  <footer className="mt-2 text-2xs text-dim">— Arjun Gupta</footer>
                </blockquote>
              </GlowCard>
            </Reveal>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
