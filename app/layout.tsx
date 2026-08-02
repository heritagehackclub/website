import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://heritage-hack-club.vercel.app"),
  title: {
    default: "Heritage Hack Club",
    template: "%s · Heritage Hack Club",
  },
  description:
    "A student-led project community where ideas become usable things—and every contributor gets credit.",
  applicationName: "Heritage Hack Club",
  keywords: ["Hack Club", "student projects", "Heritage", "teen makers"],
  openGraph: {
    type: "website",
    siteName: "Heritage Hack Club",
    title: "Heritage Hack Club",
    description: "Make something real. Build it together. Get credit.",
  },
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#111217" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
