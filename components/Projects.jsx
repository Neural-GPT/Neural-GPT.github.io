"use client";

import { ArrowUpRight, GitMerge } from "lucide-react";
import { projects, openSource, profile } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Stagger, Reveal } from "./ui/Reveal";
import GlowCard from "./ui/GlowCard";
import Magnetic from "./ui/Magnetic";

/**
 * Projects
 * ---------------------------------------------------------------
 * Each card leads with the number that matters — 0.99 AUC, 150+
 * students — because that is the thing a reader is actually
 * scanning for. Cards are magnetic with a low strength so a grid
 * of them doesn't feel jittery.
 */

function ProjectCard({ project }) {
  const link = project.links[0];

  return (
    <Magnetic strength={0.08} className="h-full">
      <GlowCard className="flex h-full flex-col p-5">
        {/* metric band */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[2rem] font-bold leading-none text-cyan">
              {project.metric.value}
            </p>
            <p className="mt-1.5 font-mono text-2xs tracking-wide text-dim">
              {project.metric.label}
            </p>
          </div>
          <span className="shrink-0 font-mono text-2xs text-dim">
            {project.date}
          </span>
        </div>

        <h3 className="font-mono text-lg font-semibold tracking-tight text-ice">
          {project.name}
        </h3>
        <p className="mt-1 font-mono text-2xs tracking-wide text-cyan-soft">
          {project.subtitle}
        </p>

        <p className="mt-3.5 text-[0.88rem] leading-relaxed text-muted">
          {project.summary}
        </p>

        <ul className="mt-4 grid gap-2">
          {project.bullets.map((b) => (
            <li
              key={b}
              className="flex gap-2 text-[0.82rem] leading-relaxed text-ice/70"
            >
              <span aria-hidden className="mt-[0.45em] h-px w-2.5 shrink-0 bg-cyan/60" />
              {b}
            </li>
          ))}
        </ul>

        {/* stack + link pinned to the bottom */}
        <div className="mt-auto pt-6">
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded border border-line px-2 py-0.5 font-mono text-2xs text-muted transition-colors group-hover:border-cyan/30 group-hover:text-cyan-soft"
              >
                {s}
              </li>
            ))}
          </ul>

          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-2xs text-muted transition-colors hover:text-cyan"
            >
              {link.label}
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </GlowCard>
    </Magnetic>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 py-24">
      <div className="shell">
        <SectionHeading
          id="projects-heading"
          label="PROJECTS"
          note="Four things I built end to end — two research reproductions, one product in daily use on campus, and one that listens to a water tank."
          action={
            <a
              href={`${profile.githubUrl}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-mono text-2xs text-muted transition-colors hover:text-cyan"
            >
              All repositories
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          }
        />

        <Stagger className="grid gap-5 md:grid-cols-2" step={0.09}>
          {projects.map((p) => (
            <Reveal key={p.id} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </Stagger>

        {/* ---- open source ---- */}
        <Stagger className="mt-5" delay={0.1}>
          <Reveal>
            <Magnetic strength={0.05}>
              <GlowCard className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded border border-line-bright bg-raised text-cyan">
                    <GitMerge size={17} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-2xs tracking-wide text-dim">
                      Open source · merged
                    </p>
                    <h3 className="mt-0.5 font-mono text-base font-semibold text-ice">
                      {openSource.repo}
                    </h3>
                    <p className="mt-2 max-w-[70ch] text-[0.85rem] leading-relaxed text-muted">
                      {openSource.summary}
                    </p>
                  </div>

                  <a
                    href={openSource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded border border-line-bright px-3.5 py-2 font-mono text-2xs text-ice transition-all hover:border-cyan hover:text-cyan"
                  >
                    View commit
                  </a>
                </div>
              </GlowCard>
            </Magnetic>
          </Reveal>
        </Stagger>
      </div>
    </section>
  );
}
