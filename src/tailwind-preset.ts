/**
 * Tailwind-Preset – mappt CSS-Tokens auf Utility-Klassen.
 * In der App: `presets: [require("@josef-hebel/ui/tailwind-preset")]`
 * (bzw. ES-Import). Farben kommen ausschließlich aus tokens.css.
 */
const preset = {
  content: [] as string[],
  theme: {
    extend: {
      colors: {
        jh: {
          blau: "var(--jh-blau)",
          "blau-hover": "var(--jh-blau-hover)",
          "blau-tint": "var(--jh-blau-tint)",
          gelb: "var(--jh-gelb)",
          text: "var(--jh-text)",
          "text-muted": "var(--jh-text-muted)",
          "text-hint": "var(--jh-text-hint)",
          surface: "var(--jh-surface)",
          "surface-alt": "var(--jh-surface-alt)",
          border: "var(--jh-border)",
          "border-strong": "var(--jh-border-strong)",
          "rot-bg": "var(--jh-rot-bg)",
          "rot-fg": "var(--jh-rot-fg)",
          "gelb-bg": "var(--jh-gelb-bg)",
          "gelb-fg": "var(--jh-gelb-fg)",
          "gruen-bg": "var(--jh-gruen-bg)",
          "gruen-fg": "var(--jh-gruen-fg)",
          overlay: "var(--jh-overlay)",
        },
      },
      borderRadius: {
        jh: "var(--jh-radius)",
      },
      height: {
        "jh-header": "var(--jh-header-h)",
      },
      spacing: {
        "jh-header": "var(--jh-header-h)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Arial",
          "Helvetica Neue",
          "Helvetica",
          "sans-serif",
        ],
      },
      boxShadow: {
        "jh-header": "var(--jh-shadow-header)",
        "jh-scrolled": "var(--jh-shadow-scrolled)",
      },
      transitionDuration: {
        jh: "150ms",
      },
    },
  },
  plugins: [] as unknown[],
};

export default preset;
