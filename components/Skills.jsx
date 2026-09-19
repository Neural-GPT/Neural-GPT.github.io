"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { skillGroups, skillList } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Stagger, Reveal } from "./ui/Reveal";
import GlowCard from "./ui/GlowCard";

/**
 * Skills
 * ---------------------------------------------------------------
 * Percentages on a ring tell you nothing — a radar tells you the
 * *shape* of someone's ability. Pick a group to plot it; pick a
 * second to overlay it as a dashed outline and compare directly.
 *
 * Recharts is imported with ssr:false so the static export doesn't
 * try to render a chart without a DOM.
 */

const ChartSkeleton = ({ height = 330 }) => (
  <div
    className="grid animate-pulse place-items-center rounded border border-line bg-raised/40"
    style={{ height }}
  >
    <span className="font-mono text-2xs text-dim">plotting…</span>
  </div>
);

const SkillRadar = dynamic(() => import("./charts/SkillRadar"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

const FocusPolar = dynamic(() => import("./charts/FocusPolar"), {
  ssr: false,
  loading: () => <ChartSkeleton height={200} />,
});

export default function Skills() {
  const [activeId, setActiveId] = useState(skillGroups[0].id);
  const [compareId, setCompareId] = useState(null);

  const active = skillGroups.find((g) => g.id === activeId);
  const compare = compareId ? skillGroups.find((g) => g.id === compareId) : null;

  return (
    <section id="skills" className="relative scroll-mt-24 py-24">
      <div className="shell">
        <SectionHeading
          id="skills-heading"
          label="SKILLS"
          note="Pick a group to plot it. Shift-click a second group to overlay it as a dashed outline and compare the two."
        />

        <Stagger className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ---- radar ---- */}
          <Reveal>
            <GlowCard className="p-5">
              {/* group toggles */}
              <div
                className="mb-4 flex flex-wrap gap-1.5"
                role="tablist"
                aria-label="Skill groups"
              >
                {skillGroups.map((g) => {
                  const isActive = g.id === activeId;
                  const isCompare = g.id === compareId;
                  return (
                    <button
                      key={g.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={(e) => {
                        // shift / meta click layers a second series on top
                        if (e.shiftKey || e.metaKey) {
                          if (g.id === activeId) return;
                          setCompareId((c) => (c === g.id ? null : g.id));
                        } else {
                          setActiveId(g.id);
                          if (compareId === g.id) setCompareId(null);
                        }
                      }}
                      className={[
                        "flex items-center gap-2 rounded border px-3 py-1.5 font-mono text-2xs transition-all",
                        isActive
                          ? "border-cyan/60 bg-cyan/10 text-cyan shadow-glow-soft"
                          : isCompare
                          ? "border-dashed border-line-bright text-ice/80"
                          : "border-line text-muted hover:border-line-bright hover:text-ice",
                      ].join(" ")}
                    >
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-full"
                        style={{ background: g.color }}
                      />
                      {g.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId + (compareId ?? "")}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SkillRadar group={active} compare={compare} />
                </motion.div>
              </AnimatePresence>

              <p className="mt-2 text-center font-mono text-2xs text-dim">
                {compare
                  ? `${active.label} (solid) vs ${compare.label} (dashed)`
                  : "Hover any vertex for the exact value"}
              </p>
            </GlowCard>
          </Reveal>

          {/* ---- focus split + full list ---- */}
          <Reveal className="grid gap-5">
            <GlowCard className="p-5">
              <p className="mb-4 font-mono text-2xs text-dim">
                <span className="text-cyan">&gt;</span> where the time goes
              </p>
              <FocusPolar />
            </GlowCard>

            <GlowCard className="p-5">
              <p className="mb-4 font-mono text-2xs text-dim">
                <span className="text-cyan">&gt;</span> full toolbox
              </p>
              <dl className="grid gap-3.5">
                {Object.entries(skillList).map(([group, items]) => (
                  <div key={group}>
                    <dt className="font-mono text-2xs text-cyan-soft">{group}</dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {items.map((i) => (
                        <span
                          key={i}
                          className="rounded border border-line px-2 py-0.5 font-mono text-2xs text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
                        >
                          {i}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </GlowCard>
          </Reveal>
        </Stagger>
      </div>
    </section>
  );
}
