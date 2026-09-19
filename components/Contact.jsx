"use client";

import { Mail, Phone, Github, MapPin, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Stagger, Reveal } from "./ui/Reveal";
import GlowCard from "./ui/GlowCard";
import Magnetic from "./ui/Magnetic";

const channels = [
  { icon: Mail, label: profile.email, href: `mailto:${profile.email}`, note: "Email" },
  {
    icon: Phone,
    label: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
    note: "Phone",
  },
  {
    icon: Github,
    label: `github.com/${profile.github}`,
    href: profile.githubUrl,
    note: "Code",
  },
  { icon: MapPin, label: profile.location, href: null, note: "Based in" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 py-24">
      <div className="shell">
        <SectionHeading
          id="contact-heading"
          label="GET IN TOUCH"
          note="Open to research collaborations, internships and anything involving a paper that deserves a working implementation."
        />

        <Stagger className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-2">
              {channels.map(({ icon: Icon, label, href, note }) => {
                const inner = (
                  <GlowCard className="h-full p-4" ticks={false}>
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded border border-line-bright bg-raised text-cyan">
                        <Icon size={15} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-2xs text-dim">{note}</p>
                        <p className="mt-0.5 truncate font-mono text-[0.82rem] text-ice transition-colors group-hover:text-cyan">
                          {label}
                        </p>
                      </div>
                      {href && (
                        <ArrowUpRight
                          size={14}
                          className="ml-auto shrink-0 text-dim transition-colors group-hover:text-cyan"
                        />
                      )}
                    </div>
                  </GlowCard>
                );

                return (
                  <li key={note} className="h-full">
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block h-full"
                      >
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal>
            <GlowCard className="flex h-full flex-col justify-between p-6">
              <div>
                <p className="font-mono text-2xs text-dim">
                  <span className="text-cyan">&gt;</span> say hello
                </p>
                <p className="mt-3 max-w-[34ch] font-mono text-lg leading-snug text-ice">
                  Got a paper you want reproduced, or a problem that needs a model
                  behind it?
                </p>
                <p className="mt-3 max-w-[44ch] text-[0.88rem] leading-relaxed text-muted">
                  I read everything and reply properly. The fastest route is email.
                </p>
              </div>

              <Magnetic strength={0.3} className="mt-8 self-start">
                <a
                  href={`mailto:${profile.email}?subject=Hello%20Arjun`}
                  className="group flex items-center gap-2 rounded border border-cyan/60 bg-cyan/10 px-5 py-3 font-mono text-sm text-cyan transition-all hover:bg-cyan/20 hover:shadow-glow"
                >
                  <Mail size={15} />
                  Send a message
                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </Magnetic>
            </GlowCard>
          </Reveal>
        </Stagger>
      </div>
    </section>
  );
}
