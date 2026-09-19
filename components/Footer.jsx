"use client";

import { ArrowUp } from "lucide-react";
import { profile } from "@/lib/data";
import Magnetic from "./ui/Magnetic";

export default function Footer() {
  return (
    <footer className="relative border-t border-line py-8">
      <div className="shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-2xs text-dim">
          © {new Date().getFullYear()} {profile.name} · Built with Next.js,
          Tailwind, Framer Motion and Recharts
        </p>

        <div className="flex items-center gap-4">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet font-mono text-2xs"
          >
            Source
          </a>
          <Magnetic strength={0.35}>
            <a
              href="#home"
              aria-label="Back to top"
              className="grid h-8 w-8 place-items-center rounded border border-line text-muted transition-all hover:border-cyan hover:text-cyan"
            >
              <ArrowUp size={14} />
            </a>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
