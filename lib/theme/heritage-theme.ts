import baseTheme from "@hackclub/theme";
import type { Theme } from "theme-ui";

/**
 * Heritage extends Hack Club's tokens without importing the package's
 * restricted Phantom Sans or Zarathustra font files.
 */
export const heritageTheme = {
  ...baseTheme,
  config: {
    initialColorModeName: "light",
    useColorSchemeMediaQuery: false,
    useLocalStorage: true,
  },
  colors: {
    ...baseTheme.colors,
    text: "var(--ink)",
    background: "var(--canvas)",
    primary: "#ec3750",
    secondary: "#338eda",
    muted: "var(--surface-muted)",
    modes: {
      dark: {
        text: "#f7f7fb",
        background: "#111217",
        muted: "#20222a",
      },
    },
  },
  fonts: {
    ...baseTheme.fonts,
    body: "var(--font-dm-sans), system-ui, sans-serif",
    heading: "var(--font-dm-sans), system-ui, sans-serif",
    monospace: "var(--font-dm-mono), ui-monospace, monospace",
  },
  fontWeights: {
    ...baseTheme.fontWeights,
    body: 450,
    heading: 750,
    bold: 750,
  },
  buttons: {
    ...baseTheme.buttons,
    primary: {
      bg: "#d52845",
      color: "white",
      cursor: "pointer",
      fontFamily: "body",
      fontWeight: "bold",
      borderRadius: 7,
      boxShadow: "0 1px 2px rgba(20, 18, 16, 0.12)",
      transition:
        "transform 160ms cubic-bezier(.22,1,.36,1), box-shadow 160ms cubic-bezier(.22,1,.36,1)",
      ":active": { transform: "scale(.97)" },
    },
    secondary: {
      bg: "var(--surface)",
      color: "text",
      cursor: "pointer",
      fontFamily: "body",
      fontWeight: "bold",
      borderRadius: 7,
      border: "1px solid var(--line)",
      transition:
        "transform 160ms cubic-bezier(.22,1,.36,1), border-color 160ms cubic-bezier(.22,1,.36,1)",
      ":active": { transform: "scale(.97)" },
    },
  },
  cards: {
    ...baseTheme.cards,
    primary: {
      bg: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: 8,
      boxShadow: "var(--shadow-card)",
    },
  },
  forms: {
    input: {
      bg: "var(--surface)",
      color: "text",
      borderColor: "var(--line-strong)",
      borderRadius: 7,
      fontFamily: "body",
      ":focus": {
        borderColor: "primary",
        boxShadow: "0 0 0 3px rgba(236, 55, 80, 0.18)",
        outline: "none",
      },
    },
    select: {
      bg: "var(--surface)",
      color: "text",
      borderColor: "var(--line-strong)",
      borderRadius: 7,
      fontFamily: "body",
    },
    textarea: {
      bg: "var(--surface)",
      color: "text",
      borderColor: "var(--line-strong)",
      borderRadius: 7,
      fontFamily: "body",
    },
  },
} as unknown as Theme;
