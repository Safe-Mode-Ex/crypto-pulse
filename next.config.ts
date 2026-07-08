import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.coinpaprika.com",
      },
      {
        protocol: "https",
        hostname: "coinpaprika.com",
      },
    ],
  },
};

export default nextConfig;
