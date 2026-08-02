import { glyphs } from "@hackclub/icons";
import type { SVGProps } from "react";

type IconName = keyof typeof glyphs;

export function HackIcon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const glyph = glyphs[name]!;

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={1.414}
      focusable="false"
      {...props}
    >
      {glyph}
    </svg>
  );
}
