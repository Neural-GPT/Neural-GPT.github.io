"use client";

import { MapPin, GraduationCap, BookOpen, CalendarDays, Check } from "lucide-react";
import { profile, education, highlights, certifications } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Stagger, Reveal } from "./ui/Reveal";
import GlowCard from "./ui/GlowCard";
import Portrait from "./ui/Portrait";

const facts = [
  { icon: MapPin, label: profile.location },
  { icon: GraduationCap, label: `${education.school}, ${education.city}` },
  { icon: BookOpen, label: `${education.degree} (${education.short})` },
  { icon: CalendarDays, label: `Expected graduation ${education.graduation}` },
];

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24">
      <div className="shell">
        <SectionHeading id="about-heading" label="ABOUT ME" />

        <Stagger className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_0.85fr]">
          {/* ---- portrait + bio ---- */}
          <Reveal className="grid gap-7 sm:grid-cols-[180px_minmax(0,1fr)]">
            <Portrait className="h-[220px] w-full sm:h-[230px]" />

            <div>
              <p className="max-w-[58ch] leading-relaxed text-ice/85">
                I&apos;m a second-year BCA student at {education.school}, affiliated
                to AKTU. Most of what I do starts with a paper — I reproduce it,
                break it, then find out whether the result survives contact with a
                real dataset and a real device.
              </p>
              <p className="mt-4 max-w-[58ch] leading-relaxed text-muted">
                That has taken me from compressing transformers under a fixed
                latency budget at IIT Bhubaneswar, to recording 28 minutes of my
                own water tank filling up so a phone could learn the sound of an
                overflow.
              </p>

              <ul className="mt-7 grid gap-3">
                {facts.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 font-mono text-[0.82rem] text-muted"
                  >
                    <Icon size={15} className="shrink-0 text-cyan" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* ---- highlights panel ---- */}
          <Reveal>
            <GlowCard className="h-full p-5">
              <p className="mb-4 font-mono text-2xs text-dim">
                <span className="text-cyan">&gt;</span> key_highlights.txt
              </p>

              <ul className="grid gap-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0 text-cyan"
                      strokeWidth={2.5}
                    />
                    <span className="font-mono text-[0.82rem] leading-relaxed text-ice/85">
                      {h}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-line pt-5">
                <p className="mb-3 font-mono text-2xs text-dim">
                  <span className="text-cyan">&gt;</span> certifications
                </p>
                <ul className="grid gap-2.5">
                  {certifications.map((c) => (
                    <li key={c.name}>
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                      >
                        <span className="font-mono text-[0.8rem] text-ice/85 transition-colors group-hover:text-cyan">
                          {c.name}
                        </span>
                        <span className="block font-mono text-2xs text-dim">
                          {c.issuer}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-6 font-mono text-2xs text-cyan">
                arjun@portfolio:~$ <span className="animate-blink">▊</span>
              </p>
            </GlowCard>
          </Reveal>
        </Stagger>
      </div>
    </section>
  );
}
