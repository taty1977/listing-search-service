import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browser tests must not contend with the normal dev server's build lock.
  distDir: process.env.PLAYWRIGHT_DEV === "1" ? ".next-e2e" : ".next",
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
