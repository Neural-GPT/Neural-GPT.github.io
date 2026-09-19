"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  profile,
  education,
  projects,
  research,
  skillList,
  certifications,
  highlights,
} from "@/lib/data";

/**
 * Terminal
 * ---------------------------------------------------------------
 * A real little shell, not a typing animation. It keeps a command
 * registry, a scrollback buffer, an arrow-key history stack and tab
 * completion. Every command reads from lib/data.js, so the terminal
 * can never drift out of sync with the rest of the page.
 *
 * Add a command by adding one entry to `registry` below.
 */

const PROMPT = "arjun@portfolio:~$";

// ---- tiny output helpers --------------------------------------------------
const out = (text, tone = "out") => ({ text, tone });
const blank = () => out("");
const head = (text) => out(text, "head");
const ok = (text) => out(text, "ok");
const err = (text) => out(text, "err");
const bullet = (text) => out(`  • ${text}`);
const kv = (k, v) => out(`  ${k.padEnd(14)}${v}`, "kv");

// ---- command registry -----------------------------------------------------
function buildRegistry({ clear, setTheme }) {
  const registry = {
    help: {
      blurb: "list everything this shell understands",
      run: () => [
        head("Available commands"),
        ...Object.entries(registry).map(([name, cmd]) =>
          out(`  ${name.padEnd(12)}${cmd.blurb}`, "kv")
        ),
        blank(),
        out("  Tab completes. ↑ / ↓ walk your history.", "dim"),
      ],
    },

    whoami: {
      blurb: "the one-line version",
      run: () => [ok(profile.name), out(profile.role)],
    },

    bio: {
      blurb: "who I am and what I'm doing",
      run: () => [
        head("bio"),
        out(profile.blurb),
        blank(),
        kv("location", profile.location),
        kv("school", `${education.school} — ${education.short}, class of ${education.graduation}`),
        kv("focus", "NLP · RAG · computer vision · anomaly detection"),
        blank(),
        head("highlights"),
        ...highlights.map(bullet),
      ],
    },

    projects: {
      blurb: "what I've shipped",
      run: () => [
        head(`projects (${projects.length})`),
        ...projects.flatMap((p) => [
          ok(`  ${p.name} — ${p.subtitle}`),
          out(`    ${p.summary}`, "dim"),
          out(`    stack: ${p.stack.join(", ")}`, "dim"),
          blank(),
        ]),
        out("  Run `open <name>` to jump to a repo.", "dim"),
      ],
    },

    research: {
      blurb: "internships, papers, nominations",
      run: () =>
        research.flatMap((r) => [
          ok(`  [${r.period}] ${r.role}`),
          out(`    ${r.org}`, "dim"),
          ...r.bullets.map((b) => out(`    - ${b}`, "dim")),
          blank(),
        ]),
    },

    skills: {
      blurb: "the toolbox, grouped",
      run: () =>
        Object.entries(skillList).flatMap(([group, items]) => [
          ok(`  ${group}`),
          out(`    ${items.join(" · ")}`, "dim"),
        ]),
    },

    education: {
      blurb: "degree and coursework",
      run: () => [
        head(education.school),
        kv("degree", education.degree),
        kv("expected", education.graduation),
        blank(),
        out("  Relevant coursework", "ok"),
        ...education.coursework.map(bullet),
      ],
    },

    certs: {
      blurb: "certifications",
      run: () =>
        certifications.flatMap((c) => [
          ok(`  ${c.name}`),
          out(`    ${c.issuer}`, "dim"),
        ]),
    },

    contact: {
      blurb: "how to reach me",
      run: () => [
        head("contact"),
        kv("email", profile.email),
        kv("phone", profile.phone),
        kv("github", profile.githubUrl),
        kv("location", profile.location),
        blank(),
        out("  `email` opens your mail client.", "dim"),
      ],
    },

    email: {
      blurb: "compose a message to me",
      run: () => {
        if (typeof window !== "undefined") {
          window.location.href = `mailto:${profile.email}`;
        }
        return [ok(`Opening your mail client → ${profile.email}`)];
      },
    },

    open: {
      blurb: "open a project repo — `open leettrack`",
      run: (args) => {
        const q = (args[0] || "").toLowerCase();
        if (!q) {
          return [
            err("open: needs a project name"),
            out(`  try: ${projects.map((p) => p.id).join(", ")}`, "dim"),
          ];
        }
        const hit = projects.find(
          (p) => p.id.includes(q) || p.name.toLowerCase().includes(q)
        );
        if (!hit) return [err(`open: no project matching "${q}"`)];
        const link = hit.links[0];
        if (typeof window !== "undefined" && link) {
          window.open(link.href, "_blank", "noopener,noreferrer");
        }
        return [ok(`Opening ${hit.name} → ${link?.href}`)];
      },
      complete: () => projects.map((p) => p.id),
    },

    ls: {
      blurb: "list the sections of this site",
      run: () => [
        out(
          "  hero/   about/   projects/   research/   skills/   activity/   contact/",
          "ok"
        ),
        out("  resume.txt   key_highlights.txt", "dim"),
      ],
    },

    cat: {
      blurb: "print a file — `cat resume.txt`",
      run: (args) => {
        const f = (args[0] || "").toLowerCase();
        if (f === "resume.txt" || f === "resume") {
          return [
            head(profile.name.toUpperCase()),
            out(`${profile.phone}  |  ${profile.email}  |  ${profile.githubUrl}`, "dim"),
            blank(),
            ok("EDUCATION"),
            out(`  ${education.school} — ${education.degree}, ${education.graduation}`),
            blank(),
            ok("RESEARCH"),
            ...research.map((r) => out(`  ${r.role} · ${r.org} · ${r.period}`)),
            blank(),
            ok("PROJECTS"),
            ...projects.map((p) => out(`  ${p.name} — ${p.subtitle} (${p.date})`)),
            blank(),
            out("  Full PDF: the Résumé button in the header.", "dim"),
          ];
        }
        if (f === "key_highlights.txt" || f === "key_highlights") {
          return [head("key_highlights.txt"), ...highlights.map(bullet)];
        }
        return [err(`cat: ${args[0] || ""}: no such file`), out("  try `ls`", "dim")];
      },
      complete: () => ["resume.txt", "key_highlights.txt"],
    },

    neofetch: {
      blurb: "system info, the fun way",
      run: () => [
        out("      ╔══════════╗", "ok"),
        out(`      ║  ◢◤◢◤◢◤  ║   ${profile.name}`, "ok"),
        out(`      ║  ██ ▓▓ ░░ ║   ${"-".repeat(profile.name.length)}`, "ok"),
        out(`      ║  ◥◣◥◣◥◣  ║   role     ${profile.role}`, "ok"),
        out(`      ╚══════════╝   school   ${education.short} @ ${education.school}`, "ok"),
        out(`                     uptime   2nd year, 3rd semester`),
        out(`                     shell    portfolio.sh v1.0`),
        out(`                     stack    ${profile.keywords.slice(0, 5).join(" · ")}`),
      ],
    },

    theme: {
      blurb: "cycle the accent colour",
      run: () => {
        const next = setTheme();
        return [ok(`Accent set to ${next}.`)];
      },
    },

    date: {
      blurb: "current date and time",
      run: () => [out(`  ${new Date().toString()}`)],
    },

    echo: {
      blurb: "say it back",
      run: (args) => [out(`  ${args.join(" ")}`)],
    },

    sudo: {
      blurb: "nice try",
      run: (args) => [
        err(`Nice try. ${profile.first} is not in the sudoers file.`),
        out("  This incident has been reported (to nobody).", "dim"),
        ...(args.length ? [out(`  ("${args.join(" ")}" denied)`, "dim")] : []),
      ],
    },

    clear: {
      blurb: "wipe the screen",
      run: () => {
        clear();
        return [];
      },
    },
  };

  return registry;
}

// ---- banner ---------------------------------------------------------------
const BANNER = [
  ok(`${profile.name} — ${profile.role}`),
  out(`Type \`help\` to see what this shell can do.`, "dim"),
  blank(),
];

const TONE = {
  head: "text-cyan font-semibold",
  ok: "text-cyan-soft",
  err: "text-rose-400",
  dim: "text-dim",
  kv: "text-ice/80 whitespace-pre",
  out: "text-ice/80",
  in: "text-ice",
};

export default function Terminal({ className = "", startOpen = true }) {
  const [lines, setLines] = useState(startOpen ? BANNER : []);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const [accent, setAccent] = useState(0);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // rgb is carried alongside hex so CSS can build alpha variants from it
  const ACCENTS = useMemo(
    () => [
      { name: "cyan", hex: "#22d3ee", rgb: "34, 211, 238", soft: "#7dd3fc" },
      { name: "ice-white", hex: "#e8f6ff", rgb: "232, 246, 255", soft: "#ffffff" },
      { name: "violet", hex: "#a78bfa", rgb: "167, 139, 250", soft: "#c4b5fd" },
      { name: "signal-green", hex: "#4ade80", rgb: "74, 222, 128", soft: "#86efac" },
    ],
    []
  );

  const registry = useMemo(
    () =>
      buildRegistry({
        clear: () => setLines([]),
        setTheme: () => {
          const next = (accent + 1) % ACCENTS.length;
          setAccent(next);
          if (typeof document !== "undefined") {
            const root = document.documentElement.style;
            root.setProperty("--accent", ACCENTS[next].hex);
            root.setProperty("--accent-rgb", ACCENTS[next].rgb);
            root.setProperty("--accent-soft", ACCENTS[next].soft);
          }
          return ACCENTS[next].name;
        },
      }),
    [accent, ACCENTS]
  );

  // keep the newest line in view
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function submit(raw) {
    const input = raw.trim();
    const echoed = [...lines, { text: input, tone: "in", prompt: true }];

    if (!input) {
      setLines(echoed);
      return;
    }

    const [name, ...args] = input.split(/\s+/);
    const cmd = registry[name.toLowerCase()];

    if (!cmd) {
      setLines([
        ...echoed,
        err(`${name}: command not found`),
        out("  Type `help` for the list.", "dim"),
      ]);
    } else {
      const result = cmd.run(args) || [];
      // `clear` empties the buffer itself, so don't append to a stale copy
      setLines(name.toLowerCase() === "clear" ? [] : [...echoed, ...result, blank()]);
    }

    setHistory((h) => [input, ...h].slice(0, 60));
    setCursor(-1);
    setValue("");
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(value);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      if (next >= 0) {
        setCursor(next);
        setValue(history[next]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(next);
      setValue(next >= 0 ? history[next] : "");
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const parts = value.split(/\s+/);
      // complete the argument if the command is already typed
      if (parts.length > 1) {
        const cmd = registry[parts[0].toLowerCase()];
        const pool = cmd?.complete?.() ?? [];
        const frag = parts[parts.length - 1].toLowerCase();
        const hit = pool.find((c) => c.startsWith(frag));
        if (hit) setValue([...parts.slice(0, -1), hit].join(" "));
        return;
      }
      // otherwise complete the command name
      const frag = parts[0].toLowerCase();
      const matches = Object.keys(registry).filter((c) => c.startsWith(frag));
      if (matches.length === 1) setValue(matches[0]);
      else if (matches.length > 1) {
        setLines((l) => [
          ...l,
          { text: value, tone: "in", prompt: true },
          out(`  ${matches.join("  ")}`, "dim"),
        ]);
      }
      return;
    }

    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div
      className={`crt edge edge-bright ticks flex flex-col bg-[#02031a] ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-line px-3.5 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2 font-mono text-2xs tracking-wide text-dim">
          bash — portfolio.sh
        </span>
        <span className="ml-auto font-mono text-2xs text-dim">
          {Object.keys(registry).length} commands
        </span>
      </div>

      {/* scrollback */}
      <div
        ref={scrollRef}
        className="no-scrollbar relative z-10 h-[340px] overflow-y-auto px-3.5 py-3 font-mono text-[0.8rem] leading-[1.55]"
      >
        {lines.map((line, i) => (
          <div key={i} className={TONE[line.tone] ?? TONE.out}>
            {line.prompt ? (
              <>
                <span className="text-cyan">{PROMPT}</span>{" "}
                <span className="text-ice">{line.text}</span>
              </>
            ) : (
              line.text || "\u00A0"
            )}
          </div>
        ))}

        {/* live input line */}
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-cyan">{PROMPT}</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal input. Type help and press Enter."
              className="w-full bg-transparent font-mono text-[0.8rem] text-ice caret-cyan outline-none placeholder:text-dim/70"
              placeholder="help"
            />
          </div>
        </div>
      </div>

      {/* hint bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-line px-3.5 py-2">
        {["help", "bio", "projects", "research", "neofetch"].map((c) => (
          <button
            key={c}
            onClick={(e) => {
              e.stopPropagation();
              submit(c);
              inputRef.current?.focus();
            }}
            className="rounded border border-line px-2 py-0.5 font-mono text-2xs text-muted transition-colors hover:border-cyan/50 hover:text-cyan"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
