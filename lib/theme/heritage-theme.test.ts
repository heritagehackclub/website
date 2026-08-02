import { describe, expect, it } from "vitest";
import baseTheme from "@hackclub/theme";
import { heritageTheme } from "./heritage-theme";

describe("Heritage theme", () => {
  it("extends Hack Club without using restricted font families", () => {
    expect(heritageTheme.colors?.primary).toBe("#ec3750");
    expect(heritageTheme.space).toEqual(baseTheme.space);
    expect(JSON.stringify(heritageTheme.fonts)).not.toMatch(
      /Phantom|Zarathustra/i,
    );
  });

  it("maps interface typography to free, redistributable font variables", () => {
    const fonts = heritageTheme.fonts as Record<string, string>;
    expect(fonts.body).toContain("--font-dm-sans");
    expect(fonts.monospace).toContain("--font-dm-mono");
  });
});
