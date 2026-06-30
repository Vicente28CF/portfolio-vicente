import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        signal: "var(--signal)",
        violet: "var(--violet)",
        ok: "var(--ok)",
        infra: "var(--infra)",
        frontend: "var(--signal)",
        backend: "var(--ok)",
        test: "var(--violet)",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h2: ["2rem", { lineHeight: "1.15" }],
        h3: ["1.25rem", { lineHeight: "1.3" }],
        body: ["1rem", { lineHeight: "1.6" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
    },
  },
  plugins: [],
};

export default config;
