import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    qualities: [95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.hackclub.com",
      },
    ],
  },
};

export default nextConfig;
