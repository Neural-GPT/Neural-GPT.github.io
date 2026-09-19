"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/**
 * SkillRadar
 * ---------------------------------------------------------------
 * Radar plot of one skill group. Loaded with ssr:false by the parent
 * because Recharts measures the DOM to size itself.
 */

function RadarTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-line-bright bg-[#03041d]/95 px-3 py-2 font-mono text-2xs shadow-glow-soft backdrop-blur">
      <p className="text-ice">{label}</p>
      <p className="mt-0.5 text-cyan">
        confidence {payload[0].value}
        <span className="text-dim"> / 100</span>
      </p>
    </div>
  );
}

export default function SkillRadar({ group, compare }) {
  // merge the comparison series onto the same axes when one is active
  const data = group.data.map((d, i) => ({
    axis: d.axis,
    value: d.value,
    compare: compare ? compare.data[i]?.value ?? null : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={330}>
      <RadarChart data={data} outerRadius="72%" margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={group.color} stopOpacity={0.05} />
            <stop offset="100%" stopColor={group.color} stopOpacity={0.35} />
          </radialGradient>
        </defs>

        <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fill: "#8493b8", fontSize: 11, fontFamily: "var(--font-mono)" }}
        />
        <PolarRadiusAxis
          domain={[0, 100]}
          angle={90}
          tick={false}
          axisLine={false}
        />

        <Tooltip content={<RadarTip />} cursor={false} />

        {compare && (
          <Radar
            name={compare.label}
            dataKey="compare"
            stroke={compare.color}
            strokeWidth={1}
            strokeDasharray="3 3"
            fill={compare.color}
            fillOpacity={0.06}
            isAnimationActive={false}
          />
        )}

        <Radar
          name={group.label}
          dataKey="value"
          stroke={group.color}
          strokeWidth={1.75}
          fill="url(#radarFill)"
          fillOpacity={1}
          dot={{ r: 2.5, fill: group.color, stroke: "#010110", strokeWidth: 1 }}
          activeDot={{ r: 5, fill: "#fff", stroke: group.color, strokeWidth: 2 }}
          animationDuration={650}
          animationEasing="ease-out"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
