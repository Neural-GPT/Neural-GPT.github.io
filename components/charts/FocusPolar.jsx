"use client";

import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { focusSplit } from "@/lib/data";

/**
 * FocusPolar
 * ---------------------------------------------------------------
 * A polar-area read on where the time actually goes. Each ring is a
 * focus area; length encodes the share of effort. Hovering a ring
 * shows the exact percentage.
 */

function FocusTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded border border-line-bright bg-[#03041d]/95 px-3 py-2 font-mono text-2xs shadow-glow-soft backdrop-blur">
      <p className="text-ice">{d.name}</p>
      <p className="mt-0.5" style={{ color: d.fill }}>
        {d.value}% of my time
      </p>
    </div>
  );
}

export default function FocusPolar() {
  return (
    <div className="grid gap-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center">
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          data={focusSplit}
          innerRadius="28%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          barSize={13}
        >
          <PolarAngleAxis type="number" domain={[0, 40]} tick={false} />
          <Tooltip content={<FocusTip />} cursor={false} />
          <RadialBar
            dataKey="value"
            background={{ fill: "rgba(255,255,255,0.045)" }}
            cornerRadius={2}
            animationDuration={800}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <ul className="grid gap-2.5">
        {focusSplit.map((f) => (
          <li key={f.name} className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: f.fill }}
            />
            <span className="font-mono text-[0.78rem] text-ice/80">{f.name}</span>
            <span className="ml-auto font-mono text-2xs text-dim">{f.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
