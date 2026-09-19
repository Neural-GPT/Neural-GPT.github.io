/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // deep field
        void: "#010110",
        abyss: "#03031a",
        panel: "#05061c",
        raised: "#080a26",
        // boundaries
        line: "rgba(255,255,255,0.09)",
        "line-bright": "rgba(255,255,255,0.22)",
        // accents
        cyan: {
          DEFAULT: "#22d3ee",
          soft: "#7dd3fc",
          deep: "#0891b2",
        },
        ice: "#e8f6ff",
        muted: "#8493b8",
        dim: "#5b688c",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      maxWidth: {
        shell: "1180px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.35), 0 0 32px -6px rgba(34,211,238,0.35)",
        "glow-soft": "0 0 40px -12px rgba(34,211,238,0.45)",
        panel: "0 1px 0 0 rgba(255,255,255,0.05) inset",
      },
      keyframes: {
        blink: { "0%,49%": { opacity: 1 }, "50%,100%": { opacity: 0 } },
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        sweep: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        blink: "blink 1.1s steps(1) infinite",
        scan: "scan 7s linear infinite",
        float: "float 6s ease-in-out infinite",
        sweep: "sweep 8s linear infinite",
      },
    },
  },
  plugins: [],
};
