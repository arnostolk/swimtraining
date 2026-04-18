import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.oceanusaalsmeer.nl",
      },
    ],
  },
};

export default nextConfig;
