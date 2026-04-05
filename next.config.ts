import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    browserToTerminal: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rd8m6ojbex.ufs.sh",
      },
    ],
  },
  cacheComponents: true,
  reactCompiler: true,
};

export default nextConfig;
