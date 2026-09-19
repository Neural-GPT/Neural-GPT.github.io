"use client";

import { useState } from "react";
import { profile } from "@/lib/data";

/**
 * Portrait
 * ---------------------------------------------------------------
 * Shows profile.avatar if the file exists in /public, and falls back
 * to an initials monogram if it doesn't. That means the site looks
 * finished the moment you clone it, before you've added a photo —
 * a missing image never leaves a broken icon in the layout.
 *
 * A plain <img> rather than next/image on purpose: static export runs
 * with images.unoptimized, so next/image would add a wrapper and no
 * optimisation, and it gives no onError hook to fall back with.
 */
export default function Portrait({ className = "" }) {
  const [failed, setFailed] = useState(false);

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div
      className={`relative overflow-hidden rounded border border-line-bright bg-raised ${className}`}
    >
      {failed ? (
        <div
          className="grid h-full w-full place-items-center bg-gradient-to-br from-[#071233] to-[#02031a]"
          aria-label={profile.name}
        >
          <span className="font-mono text-4xl font-bold tracking-tight text-cyan/70">
            {initials}
          </span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={profile.avatar}
          alt={`Portrait of ${profile.name}`}
          onError={() => setFailed(true)}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
        />
      )}

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scan bg-gradient-to-b from-cyan/15 to-transparent"
      />
    </div>
  );
}
