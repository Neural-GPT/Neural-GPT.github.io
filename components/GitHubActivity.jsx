"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Github, ArrowUpRight, Flame, Calendar, Activity } from "lucide-react";
import { profile } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";
import { Stagger, Reveal } from "./ui/Reveal";
import GlowCard from "./ui/GlowCard";
import Magnetic from "./ui/Magnetic";

/**
 * GitHubActivity
 * ---------------------------------------------------------------
 * A contribution heatmap that hovers to reveal the exact count and
 * date for a day.
 *
 * Data: GitHub's own contribution counts are not on the REST API, so
 * this calls a public read-only mirror of the GraphQL data at request
 * time, from the browser. No token, nothing to keep secret, and it
 * works fine on a static GitHub Pages host. If the request fails, a
 * deterministic placeholder grid renders instead and a note says so —
 * the section never collapses into an empty box.
 *
 * To swap in a different source, replace `fetchContributions` below.
 * Anything that returns [{ date: 'YYYY-MM-DD', count: n }] will work.
 */

const API = (user) =>
  `https://github-contributions-api.jogruber.de/v4/${user}?y=last`;

const LEVEL_CLASS = [
  "bg-[#0b1020] border-white/[0.04]",
  "bg-cyan/20 border-cyan/20",
  "bg-cyan/40 border-cyan/30",
  "bg-cyan/65 border-cyan/45",
  "bg-cyan border-cyan",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Deterministic stand-in so the grid still reads correctly offline. */
function placeholderYear() {
  const days = [];
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  let seed = 20260919;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 364; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const r = rand();
    let count = 0;
    if (r > (weekend ? 0.55 : 0.28)) count = Math.floor(rand() * 9) + 1;
    if (r > 0.94) count = Math.floor(rand() * 14) + 8;
    days.push({ date: d.toISOString().slice(0, 10), count });
  }
  return days;
}

function levelFor(count) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

async function fetchContributions(user) {
  const res = await fetch(API(user), { cache: "no-store" });
  if (!res.ok) throw new Error(`status ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json?.contributions)) throw new Error("unexpected shape");
  return json.contributions
    .map((c) => ({ date: c.date, count: c.count ?? 0 }))
    .slice(-365);
}

/** Group a flat day list into calendar weeks (columns), Sunday first. */
function toWeeks(days) {
  if (!days.length) return [];
  const weeks = [];
  let current = new Array(new Date(days[0].date).getDay()).fill(null);

  for (const day of days) {
    current.push(day);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }
  if (current.length) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }
  return weeks;
}

function streaks(days) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }
  // current streak walks backward from today
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current += 1;
    else break;
  }
  return { longest, current };
}

export default function GitHubActivity() {
  const [days, setDays] = useState([]);
  const [state, setState] = useState("loading"); // loading | live | fallback
  const [hover, setHover] = useState(null); // { day, x, y }
  const gridRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetchContributions(profile.github)
      .then((data) => {
        if (cancelled) return;
        setDays(data);
        setState("live");
      })
      .catch(() => {
        if (cancelled) return;
        setDays(placeholderYear());
        setState("fallback");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = useMemo(() => toWeeks(days), [days]);
  const total = useMemo(() => days.reduce((s, d) => s + d.count, 0), [days]);
  const best = useMemo(
    () => days.reduce((m, d) => (d.count > (m?.count ?? -1) ? d : m), null),
    [days]
  );
  const { longest, current } = useMemo(() => streaks(days), [days]);
  const activeDays = useMemo(() => days.filter((d) => d.count > 0).length, [days]);

  // month labels positioned above the first week of each month
  const monthMarks = useMemo(() => {
    const marks = [];
    let last = -1;
    weeks.forEach((week, i) => {
      const first = week.find(Boolean);
      if (!first) return;
      const m = new Date(first.date).getMonth();
      if (m !== last) {
        marks.push({ index: i, label: MONTHS[m] });
        last = m;
      }
    });
    return marks;
  }, [weeks]);

  function onCellEnter(e, day) {
    const box = gridRef.current?.getBoundingClientRect();
    const cell = e.currentTarget.getBoundingClientRect();
    if (!box) return;
    setHover({
      day,
      x: cell.left - box.left + cell.width / 2,
      y: cell.top - box.top,
    });
  }

  const stats = [
    { icon: Activity, value: total.toLocaleString(), label: "contributions this year" },
    { icon: Flame, value: `${longest} days`, label: "longest streak" },
    { icon: Calendar, value: `${activeDays}`, label: "active days" },
    {
      icon: Github,
      value: best?.count ? `${best.count}` : "—",
      label: "busiest single day",
    },
  ];

  return (
    <section id="activity" className="relative scroll-mt-24 py-24">
      <div className="shell">
        <SectionHeading
          id="activity-heading"
          label="GITHUB ACTIVITY"
          note="Pulled live from GitHub when you load the page. Hover any square for that day's count."
          action={
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-mono text-2xs text-muted transition-colors hover:text-cyan"
            >
              @{profile.github}
              <ArrowUpRight
                size={13}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          }
        />

        <Stagger className="grid gap-5">
          <Reveal>
            <Magnetic strength={0.04}>
              <GlowCard className="p-5">
                {/* header row */}
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded border border-line-bright bg-raised text-cyan">
                    <Github size={17} />
                  </span>
                  <div>
                    <p className="font-mono text-sm text-ice">{profile.github}</p>
                    <p className="font-mono text-2xs text-dim">
                      {state === "loading"
                        ? "fetching contribution graph…"
                        : state === "live"
                        ? `${total.toLocaleString()} contributions in the last year`
                        : "sample grid — live fetch unavailable right now"}
                    </p>
                  </div>
                  <span
                    className={[
                      "ml-auto rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem]",
                      state === "live"
                        ? "border-cyan/40 text-cyan"
                        : "border-line text-dim",
                    ].join(" ")}
                  >
                    {state === "live" ? "live" : state === "loading" ? "…" : "offline"}
                  </span>
                </div>

                {/* heatmap */}
                <div className="no-scrollbar overflow-x-auto pb-1">
                  <div ref={gridRef} className="relative min-w-[720px]">
                    {/* month row */}
                    <div className="relative mb-1.5 ml-8 h-3">
                      {monthMarks.map((m) => (
                        <span
                          key={`${m.label}-${m.index}`}
                          className="absolute font-mono text-[0.62rem] text-dim"
                          style={{ left: `${m.index * 13}px` }}
                        >
                          {m.label}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-1.5">
                      {/* weekday gutter */}
                      <div className="grid w-6 shrink-0 grid-rows-7 gap-[3px]">
                        {DAYS.map((d, i) => (
                          <span
                            key={d}
                            className="font-mono text-[0.6rem] leading-[10px] text-dim"
                          >
                            {i % 2 === 1 ? d : ""}
                          </span>
                        ))}
                      </div>

                      {/* week columns */}
                      <div className="flex gap-[3px]">
                        {weeks.map((week, wi) => (
                          <div key={wi} className="grid grid-rows-7 gap-[3px]">
                            {week.map((day, di) =>
                              day ? (
                                <button
                                  key={day.date}
                                  type="button"
                                  onMouseEnter={(e) => onCellEnter(e, day)}
                                  onFocus={(e) => onCellEnter(e, day)}
                                  onMouseLeave={() => setHover(null)}
                                  onBlur={() => setHover(null)}
                                  aria-label={`${day.count} contributions on ${day.date}`}
                                  className={[
                                    "h-[10px] w-[10px] rounded-[2px] border transition-all duration-150",
                                    LEVEL_CLASS[levelFor(day.count)],
                                    "hover:scale-[1.55] hover:border-white hover:shadow-[0_0_10px_rgba(34,211,238,0.85)]",
                                  ].join(" ")}
                                />
                              ) : (
                                <span key={`${wi}-${di}`} className="h-[10px] w-[10px]" />
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* tooltip */}
                    {hover && (
                      <div
                        role="status"
                        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded border border-line-bright bg-[#03041d]/95 px-2.5 py-1.5 font-mono text-2xs shadow-glow-soft backdrop-blur"
                        style={{ left: hover.x, top: hover.y - 8 }}
                      >
                        <span className="text-cyan">
                          {hover.day.count}{" "}
                          {hover.day.count === 1 ? "contribution" : "contributions"}
                        </span>
                        <span className="text-dim">
                          {" "}
                          ·{" "}
                          {new Date(hover.day.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* legend */}
                <div className="mt-4 flex items-center gap-2 font-mono text-[0.62rem] text-dim">
                  <span>Less</span>
                  {LEVEL_CLASS.map((c, i) => (
                    <span key={i} className={`h-[10px] w-[10px] rounded-[2px] border ${c}`} />
                  ))}
                  <span>More</span>
                  {current > 0 && (
                    <span className="ml-auto text-cyan">
                      {current}-day streak running
                    </span>
                  )}
                </div>
              </GlowCard>
            </Magnetic>
          </Reveal>

          {/* ---- stat strip ---- */}
          <Reveal>
            <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" step={0.06}>
              {stats.map(({ icon: Icon, value, label }) => (
                <Reveal key={label}>
                  <Magnetic strength={0.12}>
                    <GlowCard className="p-4" ticks={false}>
                      <Icon size={15} className="text-cyan" />
                      <p className="mt-3 font-mono text-xl font-semibold text-ice">
                        {value}
                      </p>
                      <p className="mt-0.5 font-mono text-2xs text-dim">{label}</p>
                    </GlowCard>
                  </Magnetic>
                </Reveal>
              ))}
            </Stagger>
          </Reveal>
        </Stagger>
      </div>
    </section>
  );
}
