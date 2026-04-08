import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  logging: {
    browserToTerminal: true,
  },
};

export default nextConfig;
